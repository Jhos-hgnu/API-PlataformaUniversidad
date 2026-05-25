import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePeriodoDto } from './dto/create-periodo.dto';
import { UpdatePeriodoDto } from './dto/update-periodo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PeriodosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePeriodoDto) {
    const existing = await this.prisma.periodos.findUnique({
      where: { nombre: dto.nombre },
    });
    if (existing) throw new ConflictException('El periodo ya existe');

    return this.prisma.periodos.create({
      data: {
        nombre: dto.nombre,
        fecha_inicio: new Date(dto.fecha_inicio),
        fecha_fin: new Date(dto.fecha_fin),
      },
    });
  }

  async findAll() {
    return this.prisma.periodos.findMany({
      where: { estado: true },
    });
  }

  async findOne(id: number) {
    const periodo = await this.prisma.periodos.findUnique({
      where: { id_periodo: id },
    });
    if (!periodo) throw new NotFoundException('Periodo no encontrado');
    return periodo;
  }

  async update(id: number, dto: UpdatePeriodoDto) {
    await this.findOne(id);

    if (dto.nombre) {
      const existing = await this.prisma.periodos.findUnique({
        where: { nombre: dto.nombre },
      });
      if (existing && existing.id_periodo !== id)
        throw new ConflictException('El periodo ya existe');
    }
    return this.prisma.periodos.update({
      where: { id_periodo: id },
      data: {
        ...dto,
        ...(dto.fecha_inicio && { fecha_inicio: new Date(dto.fecha_inicio) }),
        ...(dto.fecha_fin && { fecha_fin: new Date(dto.fecha_fin) }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.periodos.update({
      where: { id_periodo: id },
      data: { estado: false },
    });
  }

  async restore(id: number) {
    const periodo = await this.prisma.periodos.findUnique({
      where: { id_periodo: id },
    });
    if (!periodo) throw new NotFoundException('Periodo no encontrado');
    if (periodo.estado) throw new ConflictException('Periodo ya está activo');
    return this.prisma.periodos.update({
      where: { id_periodo: id },
      data: { estado: true },
    });
  }
}
