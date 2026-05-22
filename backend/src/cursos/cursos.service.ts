import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCursoDto) {
    const existing = await this.prisma.cursos.findUnique({
      where: { codigo: dto.codigo },
    });
    if (existing) throw new ConflictException('El código del curso ya existe');

    const carrera = await this.prisma.carreras.findUnique({
      where: { id_carrera: dto.id_carrera },
    });
    if (!carrera) throw new NotFoundException('La carrera especificada no existe');

    return this.prisma.cursos.create({ data: dto });
  }

  async findAll() {
    return this.prisma.cursos.findMany({
      where: { estado: true },
      include: { Carreras: true },
    });
  }

  async findOne(id: number) {
    const curso = await this.prisma.cursos.findUnique({
      where: { id_curso: id },
      include: { Carreras: true },
    });
    if (!curso) throw new NotFoundException('Curso no encontrado');
    return curso;
  }

  async findByCarrera(idCarrera: number) {
    return this.prisma.cursos.findMany({
      where: { id_carrera: idCarrera, estado: true },
    });
  }

  async update(id: number, dto: UpdateCursoDto) {
    await this.findOne(id);
    return this.prisma.cursos.update({
      where: { id_curso: id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cursos.update({
      where: { id_curso: id },
      data: { estado: false },
    });
  }
}
