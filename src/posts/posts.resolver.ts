import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput, UpdatePostInput } from './dto/create-post.input';
import { SuccessResponse } from 'src/utils';
import { LogedInUser } from 'src/custom-decoraters/userDecorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly userService: UsersService,
  ) {}

  @Mutation(() => Post)
  @UseGuards(AuthGuard)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @LogedInUser() user: User,
  ): Promise<Post> {
    return await this.postsService.create(createPostInput, user);
  }

  @Query(() => [Post], { name: 'posts' })
  async findAll(): Promise<Post[]> {
    return await this.postsService.findAll();
  }

  @Query(() => Post, { name: 'post' })
  async findOne(@Args('id') id: string): Promise<Post> {
    return await this.postsService.findOne(id);
  }

  @Query(() => [Post], { name: 'userPosts' })
  @UseGuards(AuthGuard)
  async getUserPosts(@Args('userId') userId: string): Promise<Post[]> {
    return await this.postsService.getUserPosts(userId);
  }

  @Query(() => [Post], { name: 'searchPost' })
  @UseGuards(AuthGuard)
  async searchPosts(@Args('queryString') queryString: string) {
    return await this.postsService.searchPosts(queryString);
  }

  @ResolveField('user', () => User)
  async getUser(@Parent() post: Post): Promise<User> {
    const { userId } = post;
    const user = await this.userService.findOne(userId);
    return user;
  }

  @Mutation(() => Post)
  @UseGuards(AuthGuard)
  async updatePost(
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
  ): Promise<Post> {
    return await this.postsService.update(
      updatePostInput.postId,
      updatePostInput,
    );
  }

  @Mutation(() => SuccessResponse)
  @UseGuards(AuthGuard)
  async removePost(@Args('id') id: string): Promise<SuccessResponse> {
    return await this.postsService.remove(id);
  }
}
