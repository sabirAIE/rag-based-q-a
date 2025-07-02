import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  Param,
  Patch,
  Body,
  Get,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { AuthGuard } from '@nestjs/passport';
import { DocumentsService } from './documents.service';
import { extname } from 'path';
import { Express } from 'express';
import { get } from 'http';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '../uploads',
        filename: (req, file, cb) => {
          // Save original file name; we'll use UUID for matching in service
          const uniqueFileId = uuidv4();
          req.body.documentId = uniqueFileId; // Pass it via request body
          const uniqueName = uniqueFileId + extname(file.originalname);
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.pdf$/i)) {
          return cb(new Error('Only PDF files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadDocument(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const documentId = req.body.documentId;
    return this.documentsService.saveDocument(
      file,
      req.user.userId,
      documentId,
    );
  }

  @Patch(':docId/status')
  async updateStatus(
    @Param('docId') docId: string,
    @Body() body: { status: string },
  ) {
    return this.documentsService.updateStatus(docId, body.status);
  }

  @Get('getall')
  async getDocuments() {
    return this.documentsService.getDocuments();
  }
  @Get('get-ingested-docs')
  async getIngestedDocuments() {
    return this.documentsService.getIngestedDocuments();
  }

  @Delete(':id')
  async deleteDocument(@Param('id') id: string) {
    return this.documentsService.deleteDocument(id);
  }
}
