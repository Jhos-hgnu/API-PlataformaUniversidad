import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInscripcioneDto } from './dto/create-inscripcione.dto';
import { UpdateInscripcioneDto } from './dto/update-inscripcione.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Inscripciones } from '../../generated/prisma/index';

@Injectable()
export class InscripcionesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateInscripcioneDto) {
    return this.prisma.$transaction(async (tx) => {
      const estudiante = await tx.estudiantes.findUnique({
        where: { id_estudiante: dto.id_estudiante },
      });
      if (!estudiante) throw new NotFoundException('Estudiante no encontrado');

      const asignacion = await tx.asignaciones.findUnique({
        where: { id_asignacion: dto.id_asignacion },
      });
      if (!asignacion) throw new NotFoundException('Asignación no encontrada');
      if (!asignacion.estado)
        throw new BadRequestException('La asignación no está activa');
      if (asignacion.cupo_disponible <= 0)
        throw new BadRequestException(
          'No hay cupo disponible en esta asignación',
        );

      const duplicado = await tx.inscripciones.findFirst({
        where: {
          id_estudiante: dto.id_estudiante,
          id_asignacion: dto.id_asignacion,
          estado: true,
        },
      });
      if (duplicado)
        throw new ConflictException(
          'El estudiante ya está inscrito en esta asignación',
        );

      await tx.asignaciones.update({
        where: { id_asignacion: dto.id_asignacion },
        data: { cupo_disponible: { decrement: 1 } },
      });

      return tx.inscripciones.create({
        data: dto,
        include: {
          Estudiantes: { include: { Usuarios: true } },
          Asignaciones: {
            include: { Cursos: true, Periodos: true, Docentes: true },
          },
        },
      });
    });
  }

  async findAll() {
    return this.prisma.inscripciones.findMany({
      where: { estado: true },
      include: {
        Estudiantes: { include: { Usuarios: true } },
        Asignaciones: {
          include: { Cursos: true, Periodos: true, Docentes: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const inscripcion = await this.prisma.inscripciones.findUnique({
      where: { id_inscripcion: id },
      include: {
        Estudiantes: { include: { Usuarios: true } },
        Asignaciones: {
          include: { Cursos: true, Periodos: true, Docentes: true },
        },
      },
    });
    if (!inscripcion) throw new NotFoundException('Inscripción no encontrada');
    return inscripcion;
  }

  async findByEstudiante(idEstudiante: number) {
    return this.prisma.inscripciones.findMany({
      where: { id_estudiante: idEstudiante, estado: true },
      include: {
        Asignaciones: {
          include: { Cursos: true, Periodos: true, Docentes: true },
        },
      },
    });
  }

  async findByAsignacion(idAsignacion: number) {
    return this.prisma.inscripciones.findMany({
      where: { id_asignacion: idAsignacion, estado: true },
      include: {
        Estudiantes: { include: { Usuarios: true } },
      },
    });
  }

  async update(id: number, dto: UpdateInscripcioneDto) {
    return this.prisma.$transaction(async (tx) => {
      const inscripcion = await tx.inscripciones.findUnique({
        where: { id_inscripcion: id },
      });

      if (!inscripcion || !inscripcion.estado)
        throw new NotFoundException('Inscripción no encontrada');

      if (dto.id_estudiante) {
        const estudiante = await tx.estudiantes.findUnique({
          where: { id_estudiante: dto.id_estudiante },
        });
        if (!estudiante)
          throw new NotFoundException('Estudiante no encontrado');
      }

      const nuevaAsignacionId = dto.id_asignacion ?? inscripcion.id_asignacion;
      const viejaAsignacionId = inscripcion.id_asignacion;

      if (dto.id_asignacion) {
        const asignacion = await tx.asignaciones.findUnique({
          where: { id_asignacion: dto.id_asignacion },
        });
        if (!asignacion)
          throw new NotFoundException('Asignación no encontrada');
        if (!asignacion.estado)
          throw new BadRequestException('La asignación no está activa');
        if (asignacion.cupo_disponible <= 0)
          throw new BadRequestException(
            'No hay cupo disponible en la nueva asignación',
          );
      }

      if (dto.id_estudiante || dto.id_asignacion) {
        const duplicado = await tx.inscripciones.findFirst({
          where: {
            id_estudiante: dto.id_estudiante ?? inscripcion.id_estudiante,
            id_asignacion: dto.id_asignacion ?? inscripcion.id_asignacion,
            estado: true,
          },
        });
        if (duplicado && duplicado.id_inscripcion !== id)
          throw new ConflictException(
            'El estudiante ya está inscrito en esta asignación',
          );
      }

      if (dto.id_asignacion && nuevaAsignacionId !== viejaAsignacionId) {
        await tx.asignaciones.update({
          where: { id_asignacion: viejaAsignacionId },
          data: { cupo_disponible: { increment: 1 } },
        });
        await tx.asignaciones.update({
          where: { id_asignacion: nuevaAsignacionId },
          data: { cupo_disponible: { decrement: 1 } },
        });
      }

      return tx.inscripciones.update({
        where: { id_inscripcion: id },
        data: dto,
        include: {
          Estudiantes: { include: { Usuarios: true } },
          Asignaciones: {
            include: { Cursos: true, Periodos: true, Docentes: true },
          },
        },
      });
    });
  }

  async remove(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const inscripcion = await tx.inscripciones.findUnique({
        where: { id_inscripcion: id },
      });
      if (!inscripcion || !inscripcion.estado)
        throw new NotFoundException('Inscripción no encontrada');

      await tx.asignaciones.update({
        where: { id_asignacion: inscripcion.id_asignacion },
        data: { cupo_disponible: { increment: 1 } },
      });

      return tx.inscripciones.update({
        where: { id_inscripcion: id },
        data: { estado: false },
      });
    });
  }

  async restore(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const inscripcion = await tx.inscripciones.findUnique({
        where: { id_inscripcion: id },
      });
      if (!inscripcion)
        throw new NotFoundException('Inscripción no encontrada');
      if (inscripcion.estado)
        throw new ConflictException('Inscripción ya está activa');

      const asignacion = await tx.asignaciones.findUnique({
        where: { id_asignacion: inscripcion.id_asignacion },
      });
      if (!asignacion) throw new NotFoundException('Asignación no encontrada');
      if (!asignacion.estado)
        throw new BadRequestException('La asignación no está activa');
      if (asignacion.cupo_disponible <= 0)
        throw new BadRequestException('No hay cupo disponible');

      await tx.asignaciones.update({
        where: { id_asignacion: inscripcion.id_asignacion },
        data: { cupo_disponible: { decrement: 1 } },
      });

      return tx.inscripciones.update({
        where: { id_inscripcion: id },
        data: { estado: true },
      });
    });
  }
}
