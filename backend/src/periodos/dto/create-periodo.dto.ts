import { IsDateString, IsString, MinLength } from 'class-validator';

export class CreatePeriodoDto {
  @IsString()
  @MinLength(2)
  nombre: string;

  @IsDateString()
  fecha_inicio: string;

  @IsDateString()
  fecha_fin: string;
}
