import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';

@Injectable()
export class DocentesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDocenteDto) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id_usuario: dto.id_usuario },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    if (usuario.rol !== 'docente')
      throw new ConflictException('El usuario no tiene rol de docente');

    const yaRegistrado = await this.prisma.docentes.findUnique({
      where: { id_usuario: dto.id_usuario },
    });
    if (yaRegistrado)
      throw new ConflictException('Este usuario ya está registrado como docente');

    return this.prisma.docentes.create({
      data: dto,
      include: { Usuarios: true },
    });
  }

  async findAll() {
    return this.prisma.docentes.findMany({
      where: { estado: true },
      include: {
        Usuarios: { select: { nombre: true, apellido: true, correo: true } },
      },
    });
  }

  async findOne(id: number) {
    const docente = await this.prisma.docentes.findUnique({
      where: { id_docente: id },
      include: { Usuarios: true },
    });
    if (!docente) throw new NotFoundException('Docente no encontrado');
    return docente;
  }

  async update(id: number, dto: UpdateDocenteDto) {
    await this.findOne(id);

    if (dto.id_usuario) {
      const usuario = await this.prisma.usuarios.findUnique({
        where: { id_usuario: dto.id_usuario },
      });
      if (!usuario) throw new NotFoundException('Usuario no encontrado');
      if (usuario.rol !== 'docente')
        throw new ConflictException('El usuario no tiene rol de docente');

      const yaRegistrado = await this.prisma.docentes.findUnique({
        where: { id_usuario: dto.id_usuario },
      });
      if (yaRegistrado && yaRegistrado.id_docente !== id)
        throw new ConflictException('Este usuario ya está registrado como docente');
    }

    return this.prisma.docentes.update({
      where: { id_docente: id },
      data: dto,
      include: { Usuarios: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.docentes.update({
      where: { id_docente: id },
      data: { estado: false },
    });
  }

  async restore(id: number) {
    const docente = await this.prisma.docentes.findUnique({
      where: { id_docente: id },
    });
    if (!docente) throw new NotFoundException('Docente no encontrado');
    if (docente.estado) throw new ConflictException('Docente ya está activo');
    return this.prisma.docentes.update({
      where: { id_docente: id },
      data: { estado: true },
    });
  }
}
