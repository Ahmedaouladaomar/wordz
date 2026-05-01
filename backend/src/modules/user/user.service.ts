import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto'; // Ensure you create this DTO
import { ApiConfigService } from '@/shared/services/api-config.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ApiConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Add a new user
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    // Creating enew entity instance
    const user = this.userRepository.create(createUserDto);
    // Saving entity to DB
    const savedUser = await this.userRepository.save(user);

    // Send verification email
    await this.sendVerificationEmail(savedUser);

    return savedUser;
  }

  /**
   * Find all users
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * Find one user by email (for auth purposes)
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  /**
   * Find one user by ID
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found.`);
    }
    return user;
  }

  /**
   * Update user profile
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id); // Reuses findOne to check existence
    const saltRounds = this.configService.bcryptConfig.saltRounds;

    // If password is being updated, hash it
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(saltRounds);
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    // Merge changes into the existing user object
    Object.assign(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  /**
   * Remove a user and their related data
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  /**
   * Update only the daily target
   */
  async updateDailyTarget(id: string, target: number): Promise<User> {
    const user = await this.findOne(id);
    user.dailyTarget = target;
    return await this.userRepository.save(user);
  }

  /**
   * AUTH HELPER: Find user for passport validation
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  /**
   * Send email verification
   */
  async sendVerificationEmail(user: User): Promise<void> {
    const token = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = token;
    await this.userRepository.save(user);

    const verificationLink = `${this.configService.appConfig.frontendUrl}/verify-email?token=${token}`;
    await this.emailService.sendVerificationEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
      verificationLink,
    );
  }

  async findByEmailVerificationToken(token: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { emailVerificationToken: token } });
  }

  async findByPasswordResetCode(code: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { passwordResetCode: code } });
  }

  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}
