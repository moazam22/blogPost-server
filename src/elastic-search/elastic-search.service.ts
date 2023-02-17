import { Client } from '@elastic/elasticsearch';
import { Inject, Injectable } from '@nestjs/common';
import {
  PostSearchBody,
  PostSearchResult,
  PostToIndexype,
} from './utils/interface';
import { ELASTICSEARCH_CLIENT } from 'src/utils/Constants';

@Injectable()
export class ESSerivice {
  index = 'post';
  constructor(@Inject(ELASTICSEARCH_CLIENT) private readonly client: Client) {}

  async indexPost(post: PostToIndexype) {
    const payload = {
      id: post.id,
      title: post.title,
      description: post.description,
      readTime: !!post?.readTime ? post.readTime : null,
      attachmentUrl: !!post?.attachmentUrl ? post.attachmentUrl : null,
      createdAte: post.createdAte,
      updatedAt: post.updatedAt,
      authorName: post?.user?.name,
    };
    return await this.client.index<PostSearchBody>({
      index: this.index,
      document: payload,
    });
  }

  async search(text: string) {
    const result = await this.client.search<PostSearchResult>({
      index: this.index,
      body: {
        query: {
          query_string: {
            query: `*${text}*`,
            fields: ['title', 'description', 'authorName', 'readTime'],
          },
        },
      },
    });
    const hits = result.hits.hits;
    return hits.map((item) => item._source);
  }

  async update(post: PostToIndexype) {
    const newBody = {
      id: post.id,
      title: post.title,
      description: post.description,
      readTime: !!post?.readTime ? post.readTime : null,
      attachmentUrl: !!post?.attachmentUrl ? post.attachmentUrl : null,
      createdAte: post.createdAte.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      authorName: post?.user?.name,
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key}='${value}';`;
    }, '');

    return this.client.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: post.id,
          },
        },
        script: script,
      },
    });

    // ===============================================================
    // This an alternate method to update but in this we have to provide the documentId we
    // wants to update,

    // return this.client.update({
    //   index: this.index,
    //   id: 'V7q_U4YBEIDfNZvcwqv7',
    //   body: {
    //     doc: newBody,
    //   },
    // });
    //=================================================================
  }

  async remove(postId: string) {
    return await this.client.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: postId,
          },
        },
      },
    });
  }
}
