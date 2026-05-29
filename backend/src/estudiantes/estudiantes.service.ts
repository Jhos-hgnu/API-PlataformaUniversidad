import { Injectable } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryEstudianteDto } from './dto/query-estudiante.dto';

@Injectable()
export class EstudiantesService {
  constructor(private prisma: PrismaService) {}

  async create(createEstudianteDto: CreateEstudianteDto) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id_usuario: createEstudianteDto.id_usuario },
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    if (usuario.rol !== 'estudiante')
      throw new ConflictException('El usuario no tiene rol de estudiante');

    const carrera = await this.prisma.carreras.findUnique({
      where: { id_carrera: createEstudianteDto.id_carrera },
    });
    if (!carrera) throw new NotFoundException('Carrera no encontrada');

    return this.prisma.$transaction(async (tx) => {
      const yaRegistrado = await tx.estudiantes.findUnique({
        where: { id_usuario: createEstudianteDto.id_usuario },
      });
      if (yaRegistrado)
        throw new ConflictException(
          'Este usuario ya está registrado como estudiante',
        );

      const existente = await tx.estudiantes.findUnique({
        where: { carnet: createEstudianteDto.carnet },
      });
      if (existente) throw new ConflictException('El carnet ya está registrado');

      return tx.estudiantes.create({
        data: createEstudianteDto,
        include: { Usuarios: true, Carreras: true },
      });
    });
  }

  async findAll(query: QueryEstudianteDto = { page: 1, limit: 10 }) {
    const skip = ((query.page ?? 1) - 1) * (query.limit ?? 10);
    const [data, total] = await Promise.all([
      this.prisma.estudiantes.findMany({
        where: { estado: true },
        skip,
        take: query.limit,
        include: {
          Usuarios: { select: { nombre: true, apellido: true, correo: true } },
          Carreras: { select: { nombre: true } },
        },
      }),
      this.prisma.estudiantes.count({ where: { estado: true } }),
    ]);
    return { data, total, page: query.page, limit: query.limit };
  }

  async findOne(id: number) {
    const estudiante = await this.prisma.estudiantes.findUnique({
      where: { id_estudiante: id },
      include: {
        Usuarios: { select: { nombre: true, apellido: true, correo: true } },
        Carreras: true,
      },
    });
    if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
    return estudiante;
  }

  async findByUserId(idUsuario: number) {
    const estudiante = await this.prisma.estudiantes.findUnique({
      where: { id_usuario: idUsuario },
      include: { Usuarios: true, Carreras: true },
    });
    if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
    return estudiante;
  }

  async findByCarrera(idCarrera: number) {
    return this.prisma.estudiantes.findMany({
      where: { id_carrera: idCarrera, estado: true },
      include: {
        Usuarios: { select: { nombre: true, apellido: true, correo: true } },
      },
    });
  }

  async update(id: number, updateEstudianteDto: UpdateEstudianteDto) {
    await this.findOne(id);

    if (updateEstudianteDto.id_carrera) {
      const carrera = await this.prisma.carreras.findUnique({
        where: { id_carrera: updateEstudianteDto.id_carrera },
      });
      if (!carrera) throw new NotFoundException('Carrera no encontrada');
    }

    if (updateEstudianteDto.carnet) {
      const existente = await this.prisma.estudiantes.findUnique({
        where: { carnet: updateEstudianteDto.carnet },
      });
      if (existente && existente.id_estudiante !== id)
        throw new ConflictException('El carnet ya está registrado');
    }

    return this.prisma.estudiantes.update({
      where: { id_estudiante: id },
      data: updateEstudianteDto,
      include: { Usuarios: true, Carreras: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.estudiantes.update({
      where: { id_estudiante: id },
      data: { estado: false },
    });
  }

  async restore(id: number) {
    const estudiante = await this.prisma.estudiantes.findUnique({
      where: { id_estudiante: id },
    });
    if (!estudiante) throw new NotFoundException('Estudiante no encontrado');
    if (estudiante.estado)
      throw new ConflictException('Estudiante ya está activo');
    return this.prisma.estudiantes.update({
      where: { id_estudiante: id },
      data: { estado: true },
    });
  }
}
