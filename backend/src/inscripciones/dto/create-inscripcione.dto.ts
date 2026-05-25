import { IsInt } from 'class-validator';

export class CreateInscripcioneDto {
  @IsInt()
  id_estudiante: number;

  @IsInt()
  id_asignacion: number;
}
