import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaTypeEnum } from 'src/common/common.enum';
import { In, Repository } from 'typeorm';
import { Media } from '../media/media.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async findOrFail(id: string) {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) {
      throw new NotFoundException('Media not found');
    }
    return media;
  }

  async handleFileUpload(file: Express.Multer.File) {
    const type = this.resolveMediaType(file.mimetype);

    const media = this.mediaRepository.create({
      type,
      url: `/uploads/${file.filename}`,
    });

    await this.mediaRepository.save(media);

    return {
      message: 'File uploaded successfully',
      data: { id: media.id, type: media.type, url: media.url },
    };
  }

  async handleMultipleFileUpload(files: Array<Express.Multer.File>) {
    const mediaEntities = files.map((file) => {
      const type = this.resolveMediaType(file.mimetype);
      return this.mediaRepository.create({
        type,
        url: `/uploads/${file.filename}`,
      });
    });

    const data = await this.mediaRepository.save(mediaEntities);

    return { message: 'Files uploaded successfully', data };
  }

  async removeMedia(id: string) {
    const media = await this.findOrFail(id);

    const filePath = path.join(process.cwd(), media.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.mediaRepository.softDelete(media.id);
    return { message: 'Media deleted successfully', success: true };
  }

  async getByIds(ids: string[], failOn404: boolean = false) {
    const existingData = await this.mediaRepository.find({
      where: {
        id: In(ids),
      },
    });
    if (existingData.length !== ids.length && failOn404) {
      throw new NotFoundException('One or more media not found');
    }
    return existingData;
  }

  async getById(id: string) {
    return this.findOrFail(id);
  }

  private resolveMediaType(mimetype: string): MediaTypeEnum {
    if (mimetype.startsWith('image/')) return MediaTypeEnum.IMAGE;
    if (mimetype === 'application/pdf') return MediaTypeEnum.PDF;
    if (
      mimetype === 'application/msword' ||
      mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
      return MediaTypeEnum.DOCUMENT;

    throw new HttpException(
      'Unsupported file format! Only images, PDFs, and Word documents are allowed.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
