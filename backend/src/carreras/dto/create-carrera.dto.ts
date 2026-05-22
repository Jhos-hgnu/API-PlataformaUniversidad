import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCarreraDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
