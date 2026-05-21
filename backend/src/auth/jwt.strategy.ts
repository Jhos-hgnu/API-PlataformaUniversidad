import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret',
    });
  }

  async validate(payload: { id: number; correo: string; rol: string }) {
    const user = await this.usersService.findByEmail(payload.correo);
    if (!user) throw new UnauthorizedException();
    return { id: user.id_usuario, correo: user.correo, rol: user.rol };
  }
}
