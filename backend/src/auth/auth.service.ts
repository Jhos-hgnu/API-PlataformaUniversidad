import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginAuthDTO } from './dto/login-auth.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  async login(dto: LoginAuthDTO) {
    const user = await this.usersService.findByEmail(dto.correo);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const passwordValida = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );
    if (!passwordValida)
      throw new UnauthorizedException('Credenciales inválidas');

    const payload = { id: user.id_usuario, correo: user.correo, rol: user.rol };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      usuario: {
        id: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        rol: user.rol,
      },
    };
  }
}
