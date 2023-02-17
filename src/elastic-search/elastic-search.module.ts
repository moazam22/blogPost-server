import { Module } from '@nestjs/common';
import { ClientProvider } from './elastic-search.provider';
import { ESSerivice } from './elastic-search.service';

@Module({
  providers: [ClientProvider, ESSerivice],
  exports: [ESSerivice],
})
export class ElasticSearchModule {}
