import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotasService } from './notas.service';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { Roles } from 'src/auth/roles.decorator';

@Controller('notas')
export class NotasController {
  constructor(private readonly notasService: NotasService) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateNotaDto) {
    return this.notasService.create(dto);
  }

  @Get()
  @Roles('admin', 'docente')
  findAll() {
    return this.notasService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'docente')
  findOne(@Param('id') id: string) {
    return this.notasService.findOne(+id);
  }

  @Get('inscripcion/:idInscripcion')
  @Roles('admin', 'docente')
  findByInscripcion(
    @Param('idInscripcion') idInscripcion: string,
  ) {
    return this.notasService.findByInscripcion(+idInscripcion);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateNotaDto) {
    return this.notasService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.notasService.remove(+id);
  }

  @Patch(':id/restore')
  @Roles('admin')
  restore(@Param('id') id: string) {
    return this.notasService.restore(+id);
  }
}
