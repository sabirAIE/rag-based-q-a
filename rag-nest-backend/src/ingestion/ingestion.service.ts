import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IngestionService {
  constructor(private httpService: HttpService) {}

  async triggerIngestion(docId: string) {
    try {
      const PYTHON_INGEST_URL = `${process.env.FAST_API_URL}/ingest/${docId}`;
      console.log(`Triggering ingestion for document ID: ${PYTHON_INGEST_URL}`);
      const response$ = this.httpService.post(PYTHON_INGEST_URL);
      const response = await firstValueFrom(response$);
      return response.data;
    } catch (error) {
      console.error('Error triggering ingestion:', error.data);
      throw new Error('Failed to trigger ingestion');
    }
  }
}
