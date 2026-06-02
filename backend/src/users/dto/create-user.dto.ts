import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsString()
  @MinLength(2)
  apellido: string;

  @IsEmail({}, { message: 'El correo no es válido' })
  correo: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsOptional()
  @IsString()
  @IsIn(['admin', 'docente', 'estudiante'], { message: 'Rol no válido' })
  rol?: string;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
