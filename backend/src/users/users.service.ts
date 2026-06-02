import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.usuarios.findUnique({
      where: { correo: email },
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    const { correo, password, nombre, apellido, rol } = createUserDto;

    const existing = await this.prisma.usuarios.findUnique({
      where: { correo },
    });
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const nuevoUsario = await this.prisma.usuarios.create({
      data: {
        nombre,
        apellido,
        correo,
        password_hash,
        rol: rol || 'estudiante',
      },
    });

    const { password_hash: _, ...usuarioLimpio } = nuevoUsario;
    return usuarioLimpio;
  }

  async findAll() {
    return this.prisma.usuarios.findMany();
    //return `This action returns all users`;
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id_usuario: id },
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    const { password_hash: _, ...usuarioLimpio } = usuario;
    return usuarioLimpio;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const data: any = {};
    if (updateUserDto.nombre !== undefined) data.nombre = updateUserDto.nombre;
    if (updateUserDto.apellido !== undefined)
      data.apellido = updateUserDto.apellido;
    if (updateUserDto.correo !== undefined) data.correo = updateUserDto.correo;
    if (updateUserDto.rol !== undefined) data.rol = updateUserDto.rol;
    if (updateUserDto.estado !== undefined) data.estado = updateUserDto.estado;
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      data.password_hash = await bcrypt.hash(updateUserDto.password, salt);
    }

    const usuario = await this.prisma.usuarios.update({
      where: { id_usuario: id },
      data,
    });
    const { password_hash: _, ...usuarioLimpio } = usuario;
    return usuarioLimpio;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.usuarios.update({
      where: { id_usuario: id },
      data: { estado: false },
    });
  }
}
