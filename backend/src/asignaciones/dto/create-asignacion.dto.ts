import { IsInt, IsString, Min, MinLength } from 'class-validator';

export class CreateAsignacionDto {
  @IsInt()
  id_docente: number;

  @IsInt()
  id_curso: number;

  @IsInt()
  id_periodo: number;

  @IsString()
  @MinLength(1)
  seccion: string;

  @IsInt()
  @Min(0)
  cupo_disponible: number;
}
