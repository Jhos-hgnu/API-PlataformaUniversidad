import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Roles } from 'src/auth/roles.decorator';

@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @Post()
  @Roles('admin')
  create(@Body() createCursoDto: CreateCursoDto) {
    return this.cursosService.create(createCursoDto);
  }

  @Get()
  @Roles('admin', 'docente')
  findAll() {
    return this.cursosService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'docente')
  findOne(@Param('id') id: string) {
    return this.cursosService.findOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateCursoDto: UpdateCursoDto) {
    return this.cursosService.update(+id, updateCursoDto);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.cursosService.remove(+id);
  }

  @Get('carrera/:idCarrera')
  @Roles('admin', 'docente', 'estudiante')
  findByCarrera(@Param('idCarrera') idCarrera: string) {
    return this.cursosService.findByCarrera(+idCarrera);
  }
}
