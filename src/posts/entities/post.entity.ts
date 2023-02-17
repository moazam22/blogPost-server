import { ObjectType, Field } from '@nestjs/graphql';
import { Comment } from 'src/comments/entities/comment.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
@ObjectType()
export class Post {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  @Field()
  title: string;

  @Column({ type: 'varchar' })
  @Field()
  description: string;

  @Column({ type: 'varchar', nullable: true })
  @Field()
  readTime: string;

  @Column({ type: 'varchar' })
  @Field()
  attachmentUrl: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: true })
  @Field({ nullable: true })
  createdAte: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  @Field({ nullable: true })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  // @Field()
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
