import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IngestionService {
  constructor(private httpService: HttpService) {}

  async triggerIngestion(docId: string) {
    const PYTHON_INGEST_URL = `${process.env.FAST_API_URL}/${docId}`;
    const response$ = this.httpService.post(PYTHON_INGEST_URL);
    const response = await firstValueFrom(response$);
    return response.data;
  }
}
