import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsService } from 'src/posts/posts.service';
import { User } from 'src/users/entities/user.entity';
import { SuccessResponse } from 'src/utils';
import { Repository } from 'typeorm';
import {
  CreateCommentInput,
  UpdateCommentInput,
} from './dto/create-comment.input';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private CommentRepo: Repository<Comment>,
    private readonly postService: PostsService,
  ) {}

  async create(
    createCommentInput: CreateCommentInput,
    user: User,
  ): Promise<SuccessResponse> {
    const { postId } = createCommentInput;
    const post = await this.postService.findOne(postId);
    const newComment = await this.CommentRepo.save({
      ...createCommentInput,
      user,
      post,
    });
    if (!newComment)
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    return {
      status: 201,
      message: 'Comment added successfully',
    };
  }

  async getPostComments(postId: string): Promise<Comment[]> {
    const comments = await this.CommentRepo.find({
      where: { post: { id: postId } },
      relations: { user: true },
    });
    if (!comments)
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    return comments;
  }

  async getReplies(parentId: string): Promise<Comment[]> {
    const replies = await this.CommentRepo.find({
      where: { parentId },
      relations: { user: true },
    });
    if (!replies)
      throw new HttpException('parentId not found.', HttpStatus.NOT_FOUND);
    return replies;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  async update(
    id: string,
    updateCommentInput: UpdateCommentInput,
  ): Promise<SuccessResponse> {
    const updatedComment = await this.CommentRepo.update(
      id,
      updateCommentInput,
    );
    if (!updatedComment?.affected)
      throw new HttpException('Comment not found.', HttpStatus.NOT_FOUND);
    return {
      status: 200,
      message: 'Comment updated successfully',
    };
  }

  async remove(id: string): Promise<SuccessResponse> {
    const isCommentDeleted = await this.CommentRepo.delete(id);
    if (!isCommentDeleted?.affected)
      throw new HttpException('Comment not found.', HttpStatus.NOT_FOUND);
    return {
      status: 200,
      message: 'Comment deleted successfully.',
    };
  }
}
