import { Client } from '@elastic/elasticsearch';
import { Provider } from '@nestjs/common';
import { ELASTICSEARCH_CLIENT } from 'src/utils/Constants';

export const ClientProvider: Provider = {
  provide: ELASTICSEARCH_CLIENT,
  useFactory: (): Client => {
    return new Client({
      node: 'http://localhost:9200',
      // auth: {
      //   username: 'elastic',
      //   password: 'root',
      // },
    });
  },
};
