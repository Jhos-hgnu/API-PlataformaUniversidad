import { IsString } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  nombre: string;
  @IsString()
  apellido: string;
  @IsString()
  correo: string;
  @IsString()
  password: string;
}
