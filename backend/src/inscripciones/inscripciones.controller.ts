import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InscripcionesService } from './inscripciones.service';
import { CreateInscripcioneDto } from './dto/create-inscripcione.dto';
import { UpdateInscripcioneDto } from './dto/update-inscripcione.dto';
import { Roles } from 'src/auth/roles.decorator';

@Controller('inscripciones')
export class InscripcionesController {
  constructor(
    private readonly inscripcionesService: InscripcionesService,
  ) {}

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateInscripcioneDto) {
    return this.inscripcionesService.create(dto);
  }

  @Get()
  @Roles('admin', 'docente')
  findAll() {
    return this.inscripcionesService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'docente')
  findOne(@Param('id') id: string) {
    return this.inscripcionesService.findOne(+id);
  }

  @Get('estudiante/:idEstudiante')
  @Roles('admin', 'docente')
  findByEstudiante(@Param('idEstudiante') idEstudiante: string) {
    return this.inscripcionesService.findByEstudiante(+idEstudiante);
  }

  @Get('asignacion/:idAsignacion')
  @Roles('admin', 'docente')
  findByAsignacion(@Param('idAsignacion') idAsignacion: string) {
    return this.inscripcionesService.findByAsignacion(+idAsignacion);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateInscripcioneDto,
  ) {
    return this.inscripcionesService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.inscripcionesService.remove(+id);
  }

  @Patch(':id/restore')
  @Roles('admin')
  restore(@Param('id') id: string) {
    return this.inscripcionesService.restore(+id);
  }
}
