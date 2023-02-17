import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ESSerivice } from 'src/elastic-search/elastic-search.service';
import { User } from 'src/users/entities/user.entity';
import { SuccessResponse } from 'src/utils';
import { Repository } from 'typeorm';
import { CreatePostInput, UpdatePostInput } from './dto/create-post.input';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private ESSerivice: ESSerivice,
  ) {}
  async create(createPostInput: CreatePostInput, user: User): Promise<Post> {
    const newPost = await this.postRepository.save({
      ...createPostInput,
      user,
    });
    await this.ESSerivice.indexPost(newPost);
    return newPost;
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.postRepository.find();
    return posts;
  }

  async getUserPosts(userId: string): Promise<Post[]> {
    const userPosts = await this.postRepository.find({
      where: { user: { id: userId } },
    });
    return userPosts;
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOneBy({ id });
    if (!!post) return post;
    throw new HttpException('Post not found.', HttpStatus.NOT_FOUND);
  }

  async update(id: string, updatePostInput: UpdatePostInput): Promise<Post> {
    const updatePayload = { ...updatePostInput };
    delete updatePayload['postId'];
    const updatedPost = await this.postRepository.update(id, updatePayload);
    if (!!updatedPost?.affected) {
      const _post = await this.postRepository.findOne({
        where: { id },
        relations: { user: true },
      });
      this.ESSerivice.update(_post);
      return _post;
    }
    throw new HttpException(`Couldn't update post`, HttpStatus.BAD_REQUEST);
  }

  async remove(id: string): Promise<SuccessResponse> {
    const isDeleted = await this.postRepository.delete({ id });
    if (!!isDeleted?.affected) {
      await this.ESSerivice.remove(id);
      return {
        message: 'Post deleted successfully',
        status: 200,
      };
    }
    throw new HttpException(`Post not found`, HttpStatus.NOT_FOUND);
  }

  async searchPosts(queryString: string) {
    const posts = await this.ESSerivice.search(queryString);
    return posts;
  }
}
