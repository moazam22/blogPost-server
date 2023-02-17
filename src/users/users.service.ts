import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateUserDto,
  ForgotPasswordDto,
  ForgotPasswordResponse,
  LoginDto,
  LoginSuccessResponse,
  ResetPasswordDto,
  resetPasswordKeyDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { decodedTokenType } from './interfaces';
import { SuccessResponse } from 'src/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 12);
  }

  async create(createUserDto: CreateUserDto): Promise<SuccessResponse> {
    const user = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (!!user)
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    const hashedPassword = await this.hashPassword(createUserDto.password);
    const newUser = { ...createUserDto, password: hashedPassword };
    const _user = await this.userRepository.save({ ...newUser });
    if (!_user) throw new InternalServerErrorException();
    return {
      status: 201,
      message: `User registered successfully.`,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginSuccessResponse> {
    const _user = await this.userRepository.findOne({
      select: ['password', 'id'],
      where: { email: loginDto.email },
    });
    const passCompared = !!_user
      ? await bcrypt.compare(loginDto.password, _user.password)
      : null;
    if (!!_user?.id && !!passCompared) {
      const access_token = this.jwtService.sign({ id: _user.id });
      return { access_token };
    }
    throw new HttpException(
      'Incorrect email or password.',
      HttpStatus.BAD_REQUEST,
    );
  }

  async addResetKey(user: User, payload: resetPasswordKeyDto) {
    const updateKey = await this.userRepository.update(user.id, payload);
    if (!updateKey) throw new InternalServerErrorException();
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<ForgotPasswordResponse> {
    const _user = await this.userRepository.findOneBy({
      email: forgotPasswordDto.email,
    });
    if (!!_user) {
      const passwordResetKey = Math.floor(
        100000 + Math.random() * 900000,
      ).toString();
      const date = new Date();
      const oneHourLater = new Date(date.getTime() + 60 * 60 * 1000); // 1 hour added
      const passResetKeyExpiry = oneHourLater.toISOString();
      const payload = { passwordResetKey, passResetKeyExpiry };
      this.addResetKey(_user, payload);
      return {
        status: 200,
        message: `Email Verified`,
        resetKey: passwordResetKey,
      };
    }
    throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<SuccessResponse> {
    const { email, resetKey, password } = resetPasswordDto;
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'passwordResetKey', 'passResetKeyExpiry'],
      where: { email },
    });
    if (!!user) {
      const { id, passResetKeyExpiry, passwordResetKey } = user;
      const currentDate = new Date();
      if (currentDate < passResetKeyExpiry && passwordResetKey === resetKey) {
        const hashedPassword = await this.hashPassword(password);
        await this.userRepository.update(id, {
          password: hashedPassword,
          passResetKeyExpiry: null,
          passwordResetKey: null,
        });
        return {
          status: 200,
          message: 'Password updated successfully.',
        };
      }
      throw new HttpException('Reset Key Expired', HttpStatus.BAD_REQUEST);
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: string): Promise<User> {
    const _user = await this.userRepository.findOneBy({ id });
    if (!!_user) return _user;
    throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
  }

  async getUser(token: string): Promise<User> {
    const { id } = this.jwtService.verify(token) as decodedTokenType;
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const update = await this.userRepository.update(id, updateUserDto);
    if (!!update?.affected) {
      const _user = await this.userRepository.findOneByOrFail({ id });
      return _user;
    } else
      throw new HttpException(`Couldn't update user`, HttpStatus.BAD_REQUEST);
  }

  async remove(id: string): Promise<SuccessResponse> {
    const result = await this.userRepository.delete({ id });
    if (!!result?.affected)
      return {
        message: 'User deleted successfully',
        status: 200,
      };
    else throw new HttpException(`User not found`, HttpStatus.NOT_FOUND);
  }
}
