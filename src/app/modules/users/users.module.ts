import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UserRepository } from './repositories/users.repository';
import { UserValidator } from './validators/users.validator';

@Module({
  // Registriert den Controller, der die Endpunkte für die Benutzerverwaltung bereitstellt
  controllers: [UsersController],
  // Definiert die Provider, die in diesem Modul verwendet werden:
  // - UsersService: Enthält die Geschäftslogik für die Benutzerverwaltung
  // - UserRepository: Verwaltet die Datenzugriffe und speichert Benutzer
  // - UserValidator: Validiert die Benutzer-Daten (DTOs)
  providers: [UsersService, UserRepository, UserValidator],
})
export class UsersModule {}
