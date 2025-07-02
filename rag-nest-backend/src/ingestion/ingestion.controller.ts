import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IngestionService } from './ingestion.service';

@Controller('ingestion')
export class IngestionController {
  constructor(private ingestionService: IngestionService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':docId')
  async trigger(@Param('docId') docId: string) {
    const result = await this.ingestionService.triggerIngestion(docId);
    return { status: 'triggered', result };
  }
}
