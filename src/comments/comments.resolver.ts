import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import {
  CreateCommentInput,
  UpdateCommentInput,
} from './dto/create-comment.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { LogedInUser } from 'src/custom-decoraters/userDecorator';
import { User } from 'src/users/entities/user.entity';
import { SuccessResponse } from 'src/utils';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  // crerate a new Comment
  @Mutation(() => SuccessResponse)
  @UseGuards(AuthGuard)
  async createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @LogedInUser() user: User,
  ): Promise<SuccessResponse> {
    return await this.commentsService.create(createCommentInput, user);
  }

  // Get all comments of a post
  @Query(() => [Comment], { name: 'postComments' })
  async getPostComments(@Args('postId') postId: string): Promise<Comment[]> {
    return await this.commentsService.getPostComments(postId);
  }

  //get comment by commentId
  @Query(() => Comment, { name: 'comment' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.commentsService.findOne(id);
  }

  //get all replies through parentId(commentId)
  @Query(() => [Comment], { name: 'replies' })
  async getCommentReplies(@Args('parentId') parentId: string) {
    return await this.commentsService.getReplies(parentId);
  }

  //Update a comment
  @Mutation(() => SuccessResponse)
  @UseGuards(AuthGuard)
  async updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ): Promise<SuccessResponse> {
    return await this.commentsService.update(
      updateCommentInput.id,
      updateCommentInput,
    );
  }

  //Delete a comment
  @Mutation(() => SuccessResponse)
  removeComment(@Args('id') id: string): Promise<SuccessResponse> {
    return this.commentsService.remove(id);
  }
}
