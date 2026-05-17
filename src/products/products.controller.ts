import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

import { ConfigService } from '@nestjs/config';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly configService: ConfigService
  ) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 5, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  create(@Body() product: CreateProductDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    const baseUrl = this.configService.get('APP_URL') || 'http://localhost:3000';
    let existingImages: string[] = [];
    if (product.images) {
        try {
            existingImages = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
        } catch(e) {
            existingImages = Array.isArray(product.images) ? product.images : [product.images];
        }
    }
    
    let uploadedImages: string[] = [];
    if (files && files.length > 0) {
      uploadedImages = files.map(f => `${baseUrl}/uploads/${f.filename}`);
    }
    
    product.images = [...existingImages, ...uploadedImages];
    return this.productsService.create(product);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('images', 5, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateProductDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    const baseUrl = this.configService.get('APP_URL') || 'http://localhost:3000';
    
    let existingImages: string[] = [];
    if (data.images) {
        try {
            existingImages = typeof data.images === 'string' ? JSON.parse(data.images) : data.images;
        } catch(e) {
            existingImages = Array.isArray(data.images) ? data.images : [data.images];
        }
    }
    
    let uploadedImages: string[] = [];
    if (files && files.length > 0) {
      uploadedImages = files.map(f => `${baseUrl}/uploads/${f.filename}`);
    }
    
    if (files && files.length > 0 || data.images) {
        data.images = [...existingImages, ...uploadedImages];
    }

    return this.productsService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
