import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';

@Injectable()
export class CarrerasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCarreraDto) {
    const existing = await this.prisma.carreras.findUnique({
      where: { nombre: dto.nombre },
    });
    if (existing) throw new ConflictException('La carrera ya existe');

    return this.prisma.carreras.create({ data: dto });
  }

  async findAll() {
    return this.prisma.carreras.findMany({
      where: { estado: true },
      include: { Cursos: true },
    });
  }

  async findOne(id: number) {
    const carrera = await this.prisma.carreras.findUnique({
      where: { id_carrera: id },
      include: { Cursos: true },
    });
    if (!carrera) throw new NotFoundException('Carrera no encontrada');
    return carrera;
  }

  async update(id: number, dto: UpdateCarreraDto) {
    await this.findOne(id);
    return this.prisma.carreras.update({
      where: { id_carrera: id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.carreras.update({
      where: { id_carrera: id },
      data: { estado: false },
    });
  }
}
