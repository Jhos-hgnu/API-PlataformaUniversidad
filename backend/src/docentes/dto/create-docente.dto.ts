import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateDocenteDto {
  @IsInt()
  id_usuario: number;

  @IsOptional()
  @IsString()
  especialidad?: string;
}
