import { Injectable } from '@nestjs/common';
import { validateSync } from 'class-validator';
import { UserDto } from '../dto/user.dto';
import { ValidateDto } from '../../../../core/decorators/validate-dto.decorator'; // Importiere den neuen Decorator

@Injectable()
export class UserValidator {
  // Validiert ein einzelnes UserDto-Objekt
  // Verwende den Decorator, um zusätzliche Validierungslogik zu integrieren
  @ValidateDto()
  validateUserDto(userDto: UserDto): void {
    // Führt eine Validierung des übergebenen DTOs durch
    const errors = validateSync(userDto);
    // Wenn Validierungsfehler vorhanden sind, wird eine Fehlerausnahme ausgelöst
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors}`);
    }
  }

  // Validiert eine Liste von UserDto-Objekten
  validateUserDtos(userDtos: UserDto[]): void {
    // Iteriert durch die Liste und validiert jedes UserDto einzeln
    for (const userDto of userDtos) {
      // Ruft die Einzelvalidierungsmethode auf
      this.validateUserDto(userDto);
    }
  }
}
