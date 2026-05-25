import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AsignacionesService } from './asignaciones.service';
import { CreateAsignacionDto } from './dto/create-asignacion.dto';
import { UpdateAsignacionDto } from './dto/update-asignacion.dto';
import { Roles } from '../auth/roles.decorator';

@Controller('asignaciones')
export class AsignacionesController {
  constructor(private readonly asignacionesService: AsignacionesService) {}

  @Post()
  @Roles('admin')
  create(@Body() createAsignacionDto: CreateAsignacionDto) {
    return this.asignacionesService.create(createAsignacionDto);
  }

  @Get()
  @Roles('admin', 'docente')
  findAll() {
    return this.asignacionesService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'docente')
  findOne(@Param('id') id: string) {
    return this.asignacionesService.findOne(+id);
  }

  @Get('docente/:idDocente')
  @Roles('admin', 'docente')
  findByDocente(@Param('idDocente') idDocente: string) {
    return this.asignacionesService.findByDocente(+idDocente);
  }

  @Get('periodo/:idPeriodo')
  @Roles('admin', 'docente')
  findByPeriodo(@Param('idPeriodo') idPeriodo: string) {
    return this.asignacionesService.findByPeriodo(+idPeriodo);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Param('id') id: string,
    @Body() updateAsignacionDto: UpdateAsignacionDto,
  ) {
    return this.asignacionesService.update(+id, updateAsignacionDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.asignacionesService.remove(+id);
  }

  @Patch(':id/restore')
  @Roles('admin')
  restore(@Param('id') id: string) {
    return this.asignacionesService.restore(+id);
  }
}
