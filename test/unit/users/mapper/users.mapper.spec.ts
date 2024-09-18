import { UserMapper } from '../../../../src/app/modules/users/mapper/user.mapper';
import { User } from '../../../../src/app/modules/users/entities/user.entity';
import { UserDto } from '../../../../src/app/modules/users/dto/user.dto';
import { ConsoleLogger } from '@nestjs/common';

// Instanz von ConsoleLogger
const logger = new ConsoleLogger();

// Mocking des Loggers, um sicherzustellen, dass Mapping-Fehler korrekt geloggt werden
jest.spyOn(logger, 'error').mockImplementation(() => {});

describe('UserMapper', () => {
  // Tests für die toDto Methode des Mappers
  describe('toDto', () => {
    // Testet, ob die Mapping-Funktion von User zu UserDto korrekt funktioniert
    it('should map User entity to UserDto correctly', () => {
      const user: User = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
      };

      const expectedUserDto: UserDto = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
      };

      const userDto = UserMapper.toDto(user);
      // Überprüft, ob die Mapping-Ergebnisse den erwarteten Werten entsprechen
      expect(userDto).toEqual(expectedUserDto);
    });

    // Testet, ob die Funktion eine Fehlermeldung ausgibt, wenn ein null-Wert übergeben wird
    it('should throw an error when mapping fails due to null User entity', () => {
      // Erwartet, dass ein Fehler geworfen wird, wenn null übergeben wird
      expect(() => UserMapper.toDto(null as any)).toThrow(
        'Error mapping User to UserDto',
      );
    });
  });

  // Tests für die toEntity Methode des Mappers
  describe('toEntity', () => {
    // Testet, ob die Mapping-Funktion von UserDto zu User korrekt funktioniert
    it('should map UserDto to User entity correctly', () => {
      const userDto: UserDto = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
      };

      const expectedUser: User = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
      };

      const user = UserMapper.toEntity(userDto);
      // Überprüft, ob die Mapping-Ergebnisse den erwarteten Werten entsprechen
      expect(user).toEqual(expectedUser);
    });

    // Testet, ob die Funktion eine Fehlermeldung ausgibt, wenn ein null-Wert übergeben wird
    it('should throw an error when mapping fails due to null UserDto', () => {
      // Erwartet, dass ein Fehler geworfen wird, wenn null übergeben wird
      expect(() => UserMapper.toEntity(null as any)).toThrow(
        'Error mapping UserDto to User',
      );
    });
  });
});
