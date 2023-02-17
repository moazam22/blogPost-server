import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/comments/entities/comment.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 500 })
  name: string;

  @Field()
  @Column({ length: 500 })
  email: string;

  @Column({ length: 500, select: false })
  password: string;

  @Field({ nullable: true, defaultValue: null })
  @Column({ length: 6, nullable: true, default: null, select: false })
  passwordResetKey: string;

  @Field({ nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  passResetKeyExpiry: Date;

  @OneToMany(() => Post, (post) => post.user)
  // @Field()
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
