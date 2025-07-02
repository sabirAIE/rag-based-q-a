import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private repo: Repository<Document>,
  ) {}

  async saveDocument(
    file: Express.Multer.File,
    userId: string,
    documentId: string,
  ) {
    const filePath = file.path;
    const fileBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(fileBuffer);

    const document = this.repo.create({
      user: { id: userId },
      name: file.originalname,
      filePath,
      status: 'pending',
      documentId: documentId,
      type: file.mimetype,
      size: (file.size / 1024).toFixed(2) + ' KB',
      pages: pdfData.numpages,
    });

    return this.repo.save(document);
  }

  async updateStatus(documentId: string, status: string) {
    console.log(
      `Updating document with documentId=${documentId} to status=${status}`,
    );
    return this.repo.update({ documentId }, { status });
  }

  async getDocuments() {
    console.log('Fetching all documents');
    return this.repo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async getIngestedDocuments() {
    return this.repo.find({ relations: ['user'], where: { status: 'done' } });
  }

  async deleteDocument(id: string) {
    const result = await this.repo.delete({ documentId: id });
    return {
      message: result.affected ? 'Document deleted' : 'Document not found',
      success: !!result.affected,
    };
  }
}
async function pdf(fileBuffer: Buffer) {
  const data = await pdfParse(fileBuffer);
  return {
    numpages: data.numpages,
    text: data.text,
    info: data.info,
    metadata: data.metadata,
  };
}
