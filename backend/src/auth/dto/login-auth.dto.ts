import { IsString } from 'class-validator';

export class LoginAuthDTO {
  @IsString()
  correo: string;

  @IsString()
  password: string;
}
