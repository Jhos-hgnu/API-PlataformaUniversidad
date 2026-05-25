import { IsInt, IsNumber, Min, Max } from 'class-validator';

export class CreateNotaDto {
  @IsInt()
  id_inscripcion: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  nota_final: number;
}
