import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Vocabulary } from './entities/vocabulary.entity';
import { CreateVocabularyDto } from './dto/create-vocabulary.dto';
import { UpdateVocabularyDto } from './dto/update-vocabulary.dto';
import { PageDto } from '@/common/dto/page.dto';
import { PageMetaDto } from '@/common/dto/page-meta.dto';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { VocabularyFilterDto } from './dto/vocabulary-filter.dto';

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
  async findAll(
    userId: string,
    paginationQuery: PaginationQueryDto,
    vocabularyFilterDto?: VocabularyFilterDto,
  ): Promise<PageDto<Vocabulary>> {
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

    if (typeof vocabularyFilterDto?.isMastered === 'boolean') {
      where.isMastered = vocabularyFilterDto?.isMastered;
    }

    if (typeof vocabularyFilterDto?.isFavourite === 'boolean') {
      where.isFavourite = vocabularyFilterDto?.isFavourite;
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

    const pageMeta = new PageMetaDto(page, take, total);
    return new PageDto(vocabularies, pageMeta);
  }

  /**
   * Find one vocabulary entry by ID
   */
  async findOne(id: string): Promise<Vocabulary> {
    const vocabulary = await this.vocabularyRepository.findOne({
      where: { id },
    });
    if (!vocabulary) {
      throw new NotFoundException(`Vocabulary with ID "${id}" not found.`);
    }
    return vocabulary;
  }

  async save(vocabulary: Vocabulary): Promise<Vocabulary> {
    return await this.vocabularyRepository.save(vocabulary);
  }

  /**
   * Update a vocabulary entry
   */
  async update(id: string, updateVocabularyDto: UpdateVocabularyDto): Promise<Vocabulary> {
    const vocabulary = await this.findOne(id);
    Object.assign(vocabulary, updateVocabularyDto);
    return await this.vocabularyRepository.save(vocabulary);
  }

  /**
   * Remove a vocabulary entry
   */
  async remove(id: string): Promise<void> {
    const vocabulary = await this.findOne(id);
    await this.vocabularyRepository.remove(vocabulary);
  }
}
