import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/comments/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';

@ObjectType()
export class SuccessResponse {
  @Field()
  status: number;
  @Field()
  message: string;
}
@ObjectType()
export class PostWithComments {
  @Field()
  post: Post;
  @Field(() => [Comment])
  comments: Comment[];
}
