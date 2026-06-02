import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CarrerasService } from './carreras.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';
import { Roles } from '../auth/roles.decorator';

@Controller('carreras')
export class CarrerasController {
  constructor(private readonly carrerasService: CarrerasService) {}

  @Post()
  @Roles('admin')
  create(@Body() createCarreraDto: CreateCarreraDto) {
    return this.carrerasService.create(createCarreraDto);
  }

  @Get()
  @Roles('admin', 'docente')
  findAll() {
    return this.carrerasService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'docente')
  findOne(@Param('id') id: string) {
    return this.carrerasService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateCarreraDto: UpdateCarreraDto) {
    return this.carrerasService.update(+id, updateCarreraDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.carrerasService.remove(+id);
  }

  @Patch(':id/restore')
  @Roles('admin')
  restore(@Param('id') id: string) {
    return this.carrerasService.restore(+id);
  }
}
