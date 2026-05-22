import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateCursoDto {
  @IsString()
  @MinLength(2)
  codigo: string;

  @IsString()
  @MinLength(2)
  nombre: string;

  @IsInt()
  @Min(1)
  creditos: number;

  @IsInt()
  @Min(1)
  cupo_maximo: number;

  @IsInt()
  id_carrera: number;
}
