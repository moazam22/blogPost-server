import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field()
  body: string;

  @Field()
  postId: string;

  @Field({ nullable: true })
  parentId: string;
}

@InputType()
export class UpdateCommentInput {
  @Field()
  id: string;

  @Field()
  body: string;
}
