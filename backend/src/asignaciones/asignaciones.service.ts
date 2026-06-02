import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAsignacionDto } from './dto/create-asignacion.dto';
import { UpdateAsignacionDto } from './dto/update-asignacion.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AsignacionesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAsignacionDto) {
    const docente = await this.prisma.docentes.findUnique({
      where: { id_docente: dto.id_docente },
    });
    if (!docente) throw new NotFoundException('Docente no encontrado');

    const curso = await this.prisma.cursos.findUnique({
      where: { id_curso: dto.id_curso },
    });
    if (!curso) throw new NotFoundException('Curso no encontrado');

    if (dto.cupo_disponible > curso.cupo_maximo)
      throw new BadRequestException(
        `El cupo disponible (${dto.cupo_disponible}) no puede exceder el cupo máximo del curso (${curso.cupo_maximo})`,
      );

    const periodo = await this.prisma.periodos.findUnique({
      where: { id_periodo: dto.id_periodo },
    });
    if (!periodo) throw new NotFoundException('Periodo no encontrado');

    return this.prisma.$transaction(async (tx) => {
      const duplicado = await tx.asignaciones.findFirst({
        where: {
          id_docente: dto.id_docente,
          id_curso: dto.id_curso,
          id_periodo: dto.id_periodo,
          seccion: dto.seccion,
          estado: true,
        },
      });
      if (duplicado)
        throw new ConflictException(
          'Ya existe una asignación activa con esos mismos datos',
        );

      return tx.asignaciones.create({
        data: dto,
        include: {
          Docentes: { include: { Usuarios: true } },
          Cursos: { include: { Carreras: true } },
          Periodos: true,
        },
      });
    });
  }

  async findAll() {
    return this.prisma.asignaciones.findMany({
      where: { estado: true },
      include: {
        Docentes: { include: { Usuarios: true } },
        Cursos: { include: { Carreras: true } },
        Periodos: true,
      },
    });
  }

  async findOne(id: number) {
    const asignacion = await this.prisma.asignaciones.findUnique({
      where: { id_asignacion: id },
      include: {
        Docentes: { include: { Usuarios: true } },
        Cursos: { include: { Carreras: true } },
        Periodos: true,
      },
    });
    if (!asignacion) throw new NotFoundException('Asignación no encontrada');
    return asignacion;
  }

  async findByDocente(idDocente: number) {
    return this.prisma.asignaciones.findMany({
      where: { id_docente: idDocente, estado: true },
      include: { Cursos: { include: { Carreras: true } }, Periodos: true },
    });
  }

  async findByPeriodo(idPeriodo: number) {
    return this.prisma.asignaciones.findMany({
      where: { id_periodo: idPeriodo, estado: true },
      include: {
        Docentes: { include: { Usuarios: true } },
        Cursos: { include: { Carreras: true } },
      },
    });
  }

  async update(id: number, dto: UpdateAsignacionDto) {
    await this.findOne(id);

    if (dto.id_docente) {
      const docente = await this.prisma.docentes.findUnique({
        where: { id_docente: dto.id_docente },
      });
      if (!docente) throw new NotFoundException('Docente no encontrado');
    }

    if (dto.id_curso) {
      const curso = await this.prisma.cursos.findUnique({
        where: { id_curso: dto.id_curso },
      });
      if (!curso) throw new NotFoundException('Curso no encontrado');

      if (
        dto.cupo_disponible !== undefined &&
        dto.cupo_disponible > curso.cupo_maximo
      )
        throw new BadRequestException(
          `El cupo disponible (${dto.cupo_disponible}) no puede exceder el cupo máximo del curso (${curso.cupo_maximo})`,
        );
    } else if (dto.cupo_disponible !== undefined) {
      const asignacion = await this.prisma.asignaciones.findUnique({
        where: { id_asignacion: id },
        include: { Cursos: { include: { Carreras: true } } },
      });
      if (!asignacion) throw new NotFoundException('Asignación no encontrada');
      if (dto.cupo_disponible > asignacion.Cursos.cupo_maximo)
        throw new BadRequestException(
          `El cupo disponible (${dto.cupo_disponible}) no puede exceder el cupo máximo del curso (${asignacion.Cursos.cupo_maximo})`,
        );
    }

    if (dto.id_periodo) {
      const periodo = await this.prisma.periodos.findUnique({
        where: { id_periodo: dto.id_periodo },
      });
      if (!periodo) throw new NotFoundException('Periodo no encontrado');
    }

    if (dto.seccion || dto.id_docente || dto.id_curso || dto.id_periodo) {
      const duplicado = await this.prisma.asignaciones.findFirst({
        where: {
          id_docente: dto.id_docente ?? (await this.findOne(id)).id_docente,
          id_curso: dto.id_curso ?? (await this.findOne(id)).id_curso,
          id_periodo: dto.id_periodo ?? (await this.findOne(id)).id_periodo,
          seccion: dto.seccion ?? (await this.findOne(id)).seccion,
          estado: true,
        },
      });
      if (duplicado && duplicado.id_asignacion !== id)
        throw new ConflictException(
          'Ya existe una asignación activa con esos mismos datos',
        );
    }
    return this.prisma.asignaciones.update({
      where: { id_asignacion: id },
      data: dto,
      include: {
        Docentes: { include: { Usuarios: true } },
        Cursos: { include: { Carreras: true } },
        Periodos: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    const inscripciones = await this.prisma.inscripciones.count({
      where: { id_asignacion: id, estado: true },
    });
    if (inscripciones > 0)
      throw new ConflictException(
        'No se puede eliminar la asignación porque tiene inscripciones activas',
      );
    return this.prisma.asignaciones.update({
      where: { id_asignacion: id },
      data: { estado: false },
    });
  }

  async restore(id: number) {
    const asignacion = await this.prisma.asignaciones.findUnique({
      where: { id_asignacion: id },
    });
    if (!asignacion) throw new NotFoundException('Asignación no encontrada');
    if (asignacion.estado)
      throw new ConflictException('Asignación ya está activa');
    return this.prisma.asignaciones.update({
      where: { id_asignacion: id },
      data: { estado: true },
    });
  }
}
