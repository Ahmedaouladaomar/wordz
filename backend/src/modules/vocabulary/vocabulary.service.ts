import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Vocabulary } from './entities/vocabulary.entity';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { PageDto } from '@/common/dto/page.dto';
import { PageMetaDto } from '@/common/dto/page-meta.dto';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

@Injectable()
export class VocabularyService {
  constructor(
    @InjectRepository(Vocabulary)
    private readonly vocabularyRepository: Repository<Vocabulary>,
  ) {}

  /**
   * Create a new vocabulary entry
   */
  async create(createVocabularyDto: CreateVocabularyDto, userId: string): Promise<Vocabulary> {
    const vocabulary = this.vocabularyRepository.create({
      ...createVocabularyDto,
      userId,
    });
    return await this.vocabularyRepository.save(vocabulary);
  }

  /**
   * Find all vocabulary entries for a user with pagination, ordering, and search
   */
  async findAll(userId: string, paginationQuery: PaginationQueryDto): Promise<PageDto<Vocabulary>> {
    const {
      page = 1,
      take = 10,
      orderBy = 'createdAt',
      sortOrder = 'DESC',
      search,
    } = paginationQuery;

    // Build where clause
    const where: any = { userId };
    if (search) {
      where.term = Like(`%${search}%`);
    }

    // Build order clause
    const order: any = {};
    const validOrderFields = ['id', 'term', 'definition', 'example', 'createdAt', 'updatedAt'];
    const orderField = validOrderFields.includes(orderBy) ? orderBy : 'createdAt';
    order[orderField] = sortOrder;

    const [vocabularies, total] = await this.vocabularyRepository.findAndCount({
      where,
      skip: (page - 1) * take,
      take,
      order,
    });

    const pageMeta = new PageMetaDto(page, take, vocabularies.length, total);
    return new PageDto(vocabularies, pageMeta);
  }

  /**
   * Find one vocabulary entry by ID
   */
  async findOne(id: string, userId: string): Promise<Vocabulary> {
    const vocabulary = await this.vocabularyRepository.findOne({
      where: { id, userId },
    });
    if (!vocabulary) {
      throw new NotFoundException(`Vocabulary with ID "${id}" not found.`);
    }
    return vocabulary;
  }

  /**
   * Update a vocabulary entry
   */
  async update(
    id: string,
    updateVocabularyDto: UpdateVocabularyDto,
    userId: string,
  ): Promise<Vocabulary> {
    const vocabulary = await this.findOne(id, userId);
    Object.assign(vocabulary, updateVocabularyDto);
    return await this.vocabularyRepository.save(vocabulary);
  }

  /**
   * Remove a vocabulary entry
   */
  async remove(id: string, userId: string): Promise<void> {
    const vocabulary = await this.findOne(id, userId);
    await this.vocabularyRepository.remove(vocabulary);
  }
}
