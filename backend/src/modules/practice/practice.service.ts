import { isSameDate } from '@/common/utils/date-helpers';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { VocabularyService } from '../vocabulary/vocabulary.service';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { UpdatePracticeDto } from './dto/update-practice.dto';
import { Practice } from './entities/practice.entity';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { Vocabulary } from '../vocabulary/entities/vocabulary.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PracticeService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private readonly usersService: UserService,
    private readonly vocabularyService: VocabularyService,
    @InjectRepository(Practice)
    private readonly practiceRepository: Repository<Practice>,
  ) {}

  async create(createPracticeDto: CreatePracticeDto) {
    const { userId } = createPracticeDto;

    const existingUser = await this.usersService.findOne(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found!');
    }

    // Initialize a new daily practice block
    const practice = this.practiceRepository.create({
      ...createPracticeDto,
      user: existingUser, // Explicitly link the existing user object
      vocabularies: [],
      totalWords: 0, // Explicitly initialize progress at 0
    });

    // Save to db
    const savedPractice = await this.save(practice);

    // Return newly created practice object
    return savedPractice;
  }

  async todayPractice(userId: string): Promise<Practice> {
    const now = new Date();
    const practiceDate = now.toISOString().split('T')[0];

    let practice = await this.practiceRepository.findOne({
      where: { userId, practiceDate },
    });

    if (!practice) {
      try {
        practice = await this.create({
          userId,
          practiceDate,
          totalWords: 0,
        });
      } catch (error: any) {
        // Catch the race condition, if code is '23505' (Postgresql unique violation),
        // it means another request amidst this process.
        if (error.code === '23505') {
          return (await this.practiceRepository.findOne({
            where: { userId, practiceDate },
          })) as Practice;
        }
        throw error;
      }
    }

    return practice;
  }

  async getUnmasteredTerms(userId: string, paginationQuery: PaginationQueryDto) {
    return await this.vocabularyService.findAll(userId, paginationQuery, {
      isMastered: false,
    });
  }

  /**
   *  Helper function to return next streak value for user
   * @param user
   * @returns
   */
  getUserNextStreak(user: User) {
    if (!user) {
      throw new NotFoundException('No user associated with this practice session!');
    }

    const [today, yesterday] = [new Date(), new Date()];

    yesterday.setDate(yesterday.getDate() - 1);

    // We check the last time we incremented user's streak
    const lastStreakIncrementDate = user?.lastStreakIncrementDate
      ? new Date(user?.lastStreakIncrementDate)
      : null;

    const isTodayStreakIncrementDay = lastStreakIncrementDate
      ? isSameDate(today, lastStreakIncrementDate)
      : false;
    const isYesterdayStreakIncrementDay = lastStreakIncrementDate
      ? isSameDate(yesterday, lastStreakIncrementDate)
      : false;

    // If user hits daily target per practice session we update streak conditionally
    if (!isTodayStreakIncrementDay) {
      if (isYesterdayStreakIncrementDay || user.streak === 0) {
        // User upgrades streak
        return { streak: user.streak + 1, lastStreakIncrementDate: today };
      } else {
        // User breaks streak
        return { streak: 1, lastStreakIncrementDate: today };
      }
    }

    // User streak remains unchanged
    return { streak: user.streak, lastStreakIncrementDate: user.lastStreakIncrementDate };
  }

  async updateTotalWords(
    id: string,
    updateTotalWordsDto: { totalWords: number; vocabularyId: string },
  ) {
    return await this.dataSource.transaction(async (entityManager) => {
      const practice = await entityManager.findOne(Practice, {
        where: { id },
        relations: { user: true, vocabularies: true },
      });
      if (!practice) throw new NotFoundException('Practice not found!');

      const vocabulary = await entityManager.findOne(Vocabulary, {
        where: { id: updateTotalWordsDto.vocabularyId },
      });
      if (!vocabulary) throw new NotFoundException('Vocabulary not found!');

      if (practice.isCompleted)
        throw new BadRequestException('Cannot update a completed practice session!');

      if (updateTotalWordsDto.totalWords > practice.user.dailyTarget)
        throw new BadRequestException('Cannot exceed daily target!');

      practice.totalWords = updateTotalWordsDto.totalWords;
      if (updateTotalWordsDto.totalWords === practice.user.dailyTarget) {
        practice.isCompleted = true;

        const { streak, lastStreakIncrementDate } = this.getUserNextStreak(practice.user);
        practice.user.streak = streak;
        practice.user.lastStreakIncrementDate = lastStreakIncrementDate;
        await entityManager.save(User, practice.user);
      }

      if (!practice.vocabularies) practice.vocabularies = [];
      const alreadyLinked = practice.vocabularies.some((v) => v.id === vocabulary.id);

      if (!alreadyLinked) {
        practice.vocabularies.push(vocabulary);
      }

      vocabulary.isMastered = true;

      await entityManager.save(Vocabulary, vocabulary);
      return await entityManager.save(Practice, practice);
    });
  }

  async findAll(): Promise<Practice[]> {
    return await this.practiceRepository.find();
  }

  /**
   * Find one Practice by ID
   */
  async findOne(id: string): Promise<Practice> {
    const practice = await this.practiceRepository.findOne({
      where: { id },
      relations: {
        user: true,
        vocabularies: true,
      },
    });
    if (!practice) {
      throw new NotFoundException(`Practice with ID "${id}" not found.`);
    }
    return practice;
  }

  async save(practice: Practice): Promise<Practice> {
    return await this.practiceRepository.save(practice);
  }

  async update(id: string, updatePracticeDto: UpdatePracticeDto) {
    const practice = await this.findOne(id);
    if (!practice) throw new NotFoundException('Practice not found!');

    Object.assign(practice, updatePracticeDto);

    return await this.save(practice);
  }

  /**
   * Remove a practice session and its related data
   */
  async remove(sessionId: string) {
    return await this.dataSource.transaction(async (entityManager) => {
      const practice = await entityManager.findOne(Practice, {
        where: { id: sessionId },
        relations: { vocabularies: true },
      });

      if (!practice) {
        throw new NotFoundException('Practice session not found!');
      }

      const masteredWords = practice.vocabularies?.filter((w) => w.isMastered === true) || [];

      if (masteredWords.length > 0) {
        const vocabulariesIds = masteredWords.map((w) => w.id);

        await entityManager.update(
          Vocabulary,
          { id: In(vocabulariesIds) },
          {
            isMastered: false,
          },
        );
      }

      await entityManager.delete(Practice, { id: sessionId });

      return { success: true };
    });
  }
}
