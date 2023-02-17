import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UsersModule } from 'src/users/users.module';
import { ElasticSearchModule } from 'src/elastic-search/elastic-search.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UsersModule, ElasticSearchModule],
  providers: [PostsResolver, PostsService],
  exports: [PostsService],
})
export class PostsModule {}
