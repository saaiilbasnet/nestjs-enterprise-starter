import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { IdDTO } from 'src/common/common.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.handleFileUpload(file);
  }

  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //     required: ['file'],
  //   },
  // })
  // @Throttle({ default: { ttl: 10000, limit: 290 } })
  // @Post('/register')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFileRegister(@UploadedFile() file: Express.Multer.File) {
  //   return this.mediaService.handleFileUpload(file);
  // }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
      required: ['files'],
    },
  })
  @Post('uploads')
  @UseInterceptors(FilesInterceptor('files'))
  uploadMultipleFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.mediaService.handleMultipleFileUpload(files);
  }

  @Get(':id')
  getById(@Param(':id') { id }: IdDTO) {
    return this.mediaService.getById(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.removeMedia(+id);
  }
}
