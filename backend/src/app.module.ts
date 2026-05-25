import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CarrerasModule } from './carreras/carreras.module';
import { CursosModule } from './cursos/cursos.module';
import { EstudiantesModule } from './estudiantes/estudiantes.module';
import { DocentesModule } from './docentes/docentes.module';
import { PeriodosModule } from './periodos/periodos.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule, CarrerasModule, CursosModule, EstudiantesModule, DocentesModule, PeriodosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
