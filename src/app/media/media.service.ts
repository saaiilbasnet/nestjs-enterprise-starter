import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaTypeEnum } from 'src/common/common.enum';
import { DeepPartial, In, Repository } from 'typeorm';
import { Media } from '../media/media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async findOrFail(id: string) {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) {
      throw new HttpException(['Media not found'], HttpStatus.NOT_FOUND);
    }
    return media;
  }

  async handleFileUpload(file: Express.Multer.File) {
    let type: MediaTypeEnum;

    if (file.mimetype.startsWith('image/')) {
      type = MediaTypeEnum.IMAGE;
    } else if (file.mimetype === 'application/pdf') {
      type = MediaTypeEnum.PDF;
    } else if (
      file.mimetype === 'application/msword' ||
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      type = MediaTypeEnum.DOCUMENT;
    } else {
      throw new HttpException(
        [
          'Unsupported file format! Only images, PDFs, and Word documents are allowed.',
        ],
        HttpStatus.BAD_REQUEST,
      );
    }
    const media = this.mediaRepository.create({
      type: type,
      url: `/uploads/${file.filename}`,
    });

    await this.mediaRepository.save(media);
    delete media.deletedAt;

    return { message: 'File uploaded successfully', data: media };
  }

  async handleMultipleFileUpload(files: Array<Express.Multer.File>) {
    const uploadedMedia: DeepPartial<Media>[] = [];

    for (const file of files) {
      let type: MediaTypeEnum;

      if (file.mimetype.startsWith('image/')) {
        type = MediaTypeEnum.IMAGE;
      } else if (file.mimetype === 'application/pdf') {
        type = MediaTypeEnum.PDF;
      } else if (
        file.mimetype === 'application/msword' ||
        file.mimetype ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        type = MediaTypeEnum.DOCUMENT;
      } else {
        throw new HttpException(
          [
            'Unsupported file format! Only images, PDFs, and Word documents are allowed.',
          ],
          HttpStatus.BAD_REQUEST,
        );
      }

      uploadedMedia.push({
        type,
        url: `/public/uploads/${file.filename}`,
      });
    }

    // Save all media in a single DB operation
    const data = await this.mediaRepository.save(uploadedMedia);

    return { message: 'Files uploaded successfully', data };
  }

  removeMedia(id: number) {
    return `This action removes a #${id} media`;
  }

  async getByIds(ids: number[], failOn404: boolean = false) {
    const existingData = await this.mediaRepository.find({
      where: {
        id: In(ids),
      },
    });
    if (existingData.length !== ids.length && failOn404) {
      throw new HttpException(
        ['One or more media not found'],
        HttpStatus.NOT_FOUND,
      );
    }
    return existingData;
  }

  async getById(id: string) {
    const mediaInfo = await this.mediaRepository.findOne({
      where: {
        id,
      },
    });
    return mediaInfo;
  }
}
