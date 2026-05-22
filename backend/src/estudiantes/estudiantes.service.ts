import { Injectable } from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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

    //Verificar que la carrera exista
    const carrera = await this.prisma.carreras.findUnique({
      where: { id_carrera: createEstudianteDto.id_carrera },
    });
    if (!carrera) throw new NotFoundException('Carrera no encontrada');

    //Verificar carnet único
    const existente = await this.prisma.estudiantes.findUnique({
      where: { carnet: createEstudianteDto.carnet },
    });
    if (existente) throw new ConflictException('El carnet ya está registrado');

    return this.prisma.estudiantes.create({
      data: createEstudianteDto,
      include: { Usuarios: true, Carreras: true },
    });
  }

  async findAll() {
    return this.prisma.estudiantes.findMany({
      where: { estado: true },
      include: {
        Usuarios: { select: { nombre: true, apellido: true, correo: true } },
        Carreras: { select: { nombre: true } },
      },
    });
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
}
