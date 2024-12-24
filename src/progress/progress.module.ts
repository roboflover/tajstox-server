import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ProgressController],
  providers: [ProgressService, PrismaService],
  imports: [ JwtModule ]
})
export class ProgressModule {}
