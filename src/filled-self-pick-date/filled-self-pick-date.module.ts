import { Module } from '@nestjs/common';
import { FilledSelfPickDateService } from './filled-self-pick-date.service';
import { FilledSelfPickDateController } from './filled-self-pick-date.controller';

@Module({
  providers: [FilledSelfPickDateService],
  controllers: [FilledSelfPickDateController],
  exports: [FilledSelfPickDateService],
})
export class FilledSelfPickDateModule {}
