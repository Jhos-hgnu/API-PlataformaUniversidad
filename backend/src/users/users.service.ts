import { ConflictException, Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
