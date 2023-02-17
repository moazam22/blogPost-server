import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SuccessResponse } from 'src/utils';
import {
  CreateUserDto,
  ForgotPasswordDto,
  ForgotPasswordResponse,
  LoginDto,
  LoginSuccessResponse,
  ResetPasswordDto,
  UpdateUserDto,
} from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver()
export class UserResolver {
  constructor(private userService: UsersService) {}

  @Query(() => String)
  async hello() {
    return 'Hello World';
  }

  @Mutation(() => SuccessResponse)
  async Signup(@Args('createUserDto') createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Mutation(() => LoginSuccessResponse)
  async login(@Args('loginDto') loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(
    @Args('forgotPasswordDto') forgotPasswordDto: ForgotPasswordDto,
  ) {
    return this.userService.forgotPassword(forgotPasswordDto);
  }

  @Mutation(() => SuccessResponse)
  async resetPassword(
    @Args('resetPasswordDto') resetPasswordDto: ResetPasswordDto,
  ) {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @Mutation(() => SuccessResponse)
  async register(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<SuccessResponse> {
    return this.userService.create(createUserDto);
  }

  @Query(() => [User])
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User)
  async getUser(@Args('token') token: string): Promise<User> {
    return this.userService.getUser(token);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('payload') updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Mutation(() => SuccessResponse)
  async deleteUser(@Args('id') id: string): Promise<SuccessResponse> {
    return this.userService.remove(id);
  }
}
