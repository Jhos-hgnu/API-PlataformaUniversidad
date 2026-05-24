import { IsInt, IsString, MinLength } from 'class-validator';

export class CreateEstudianteDto {
  @IsInt()
  id_usuario: number;

  @IsString()
  @MinLength(5)
  carnet: string;

  @IsInt()
  id_carrera: number;
}
