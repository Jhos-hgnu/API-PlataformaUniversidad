import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotasService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateNotaDto) {
    return this.prisma.$transaction(async (tx) => {
      const inscripcion = await tx.inscripciones.findUnique({
        where: { id_inscripcion: dto.id_inscripcion },
      });
      if (!inscripcion)
        throw new NotFoundException('Inscripción no encontrada');

      const existente = await tx.notas.findUnique({
        where: { id_inscripcion: dto.id_inscripcion },
      });
      if (existente)
        throw new ConflictException(
          'La inscripción ya tiene una nota asignada',
        );

      return tx.notas.create({
        data: dto,
        include: {
          Inscripciones: {
            include: {
              Estudiantes: { include: { Usuarios: true } },
              Asignaciones: { include: { Cursos: true, Periodos: true } },
            },
          },
        },
      });
    });
  }

  async findAll() {
    return this.prisma.notas.findMany({
      where: { estado: true },
      include: {
        Inscripciones: {
          include: {
            Estudiantes: { include: { Usuarios: true } },
            Asignaciones: { include: { Cursos: true, Periodos: true } },
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const nota = await this.prisma.notas.findUnique({
      where: { id_nota: id },
      include: {
        Inscripciones: {
          include: {
            Estudiantes: { include: { Usuarios: true } },
            Asignaciones: { include: { Cursos: true, Periodos: true } },
          },
        },
      },
    });
    if (!nota) throw new NotFoundException('Nota no encontrada');
    return nota;
  }

  async findByInscripcion(idInscripcion: number) {
    return this.prisma.notas.findUnique({
      where: { id_inscripcion: idInscripcion },
      include: {
        Inscripciones: {
          include: {
            Estudiantes: { include: { Usuarios: true } },
            Asignaciones: { include: { Cursos: true, Periodos: true } },
          },
        },
      },
    });
  }

  async update(id: number, dto: UpdateNotaDto) {
    await this.findOne(id);

    if (dto.id_inscripcion) {
      const inscripcion = await this.prisma.inscripciones.findUnique({
        where: { id_inscripcion: dto.id_inscripcion },
      });
      if (!inscripcion)
        throw new NotFoundException('Inscripción no encontrada');

      const existente = await this.prisma.notas.findUnique({
        where: { id_inscripcion: dto.id_inscripcion },
      });
      if (existente && existente.id_nota !== id)
        throw new ConflictException(
          'La inscripción ya tiene una nota asignada',
        );
    }

    return this.prisma.notas.update({
      where: { id_nota: id },
      data: dto,
      include: {
        Inscripciones: {
          include: {
            Estudiantes: { include: { Usuarios: true } },
            Asignaciones: { include: { Cursos: true, Periodos: true } },
          },
        },
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.notas.update({
      where: { id_nota: id },
      data: { estado: false },
    });
  }

  async restore(id: number) {
    const nota = await this.prisma.notas.findUnique({
      where: { id_nota: id },
    });
    if (!nota) throw new NotFoundException('Nota no encontrada');
    if (nota.estado)
      throw new ConflictException('Nota ya está activa');
    return this.prisma.notas.update({
      where: { id_nota: id },
      data: { estado: true },
    });
  }
}
