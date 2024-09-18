import { UserRepository } from '../../../../src/app/modules/users/repositories/users.repository';
import { User } from '../../../../src/app/modules/users/entities/user.entity';
import { readFileSync } from 'fs';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Mocking von readFileSync, um Dateizugriffe zu simulieren
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
}));

// Mock für den join- und resolve-Pfad
jest.mock('path', () => ({
  join: jest.fn(() => 'mocked-path-to-users.json'),
  resolve: jest.fn(() => 'mocked-path-to-users.json'),
}));

describe('UserRepository', () => {
  let repository: UserRepository;
  let configService: ConfigService;
  let mockUsers: User[];

  // Initialisiert vor jedem Test die Mocks und Testdaten
  beforeEach(() => {
    // Mocking des ConfigService
    configService = new ConfigService();
    jest
      .spyOn(configService, 'get')
      .mockReturnValue('mocked-path-to-users.json');

    // Instanziiere UserRepository mit gemocktem ConfigService
    repository = new UserRepository(configService);

    // Testdaten initialisieren
    mockUsers = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
    ];

    // Mock für readFileSync vorbereiten
    (readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockUsers));
  });

  describe('findAll', () => {
    it('should return an array of users when the JSON file contains valid data', () => {
      const users = repository.findAll();

      // Überprüft, ob die Rückgabe korrekt ist und readFileSync aufgerufen wurde
      expect(users).toEqual(mockUsers);
      expect(readFileSync).toHaveBeenCalledWith(
        'mocked-path-to-users.json',
        'utf8',
      ); // Erwartung: Die Datei sollte mit dem korrekten Pfad aufgerufen werden
    });

    it('should throw an error if the JSON file contains invalid data', () => {
      // Simuliert ungültige JSON-Daten
      (readFileSync as jest.Mock).mockReturnValue('invalid-json');

      // Überprüft, ob ein Fehler ausgelöst wird
      expect(() => repository.findAll()).toThrow(
        'Invalid JSON structure in users.json file',
      );
    });

    it('should throw a file not found error when the JSON file is missing', () => {
      // Simuliert, dass die Datei nicht gefunden wird
      (readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      expect(() => repository.findAll()).toThrow(
        'General I/O error while accessing users.json file: I/O Error - ENOENT: no such file or directory',
      );
    });

    it('should throw an error when the JSON file contains invalid JSON structure', () => {
      // Simuliert ungültige JSON-Daten
      (readFileSync as jest.Mock).mockReturnValue('invalid-json');

      expect(() => repository.findAll()).toThrow(
        'Invalid JSON structure in users.json file',
      );
    });

    it('should throw an IO error when there is a general I/O issue accessing the JSON file', () => {
      // Simuliert einen allgemeinen I/O-Fehler
      (readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('EIO: I/O error');
      });

      expect(() => repository.findAll()).toThrow(
        'General I/O error while accessing users.json file',
      );
    });
  });

  describe('findById', () => {
    it('should return the correct user when findById is called with a valid ID', () => {
      const user = repository.findById(1);

      // Erwartung: Der Benutzer mit ID 1 sollte zurückgegeben werden
      expect(user).toEqual(mockUsers[0]);
      expect(readFileSync).toHaveBeenCalledWith(
        'mocked-path-to-users.json',
        'utf8',
      ); // Erwartung: Die Datei sollte mit dem korrekten Pfad aufgerufen werden
    });

    it('should throw NotFoundException when the user is not found by findById', () => {
      // Mockt die Rückgabe von readFileSync
      (readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockUsers));

      expect(() => repository.findById(3)).toThrow(NotFoundException);
    });

    it('should throw an error if the JSON file contains invalid data during findById', () => {
      // Mock für ungültige JSON-Daten
      (readFileSync as jest.Mock).mockReturnValue('invalid-json');

      expect(() => repository.findById(1)).toThrow(
        'Invalid JSON structure in users.json file',
      );
    });

    it('should throw a not found error if no users are found', () => {
      const mockEmptyUsers: User[] = [];

      // Simuliert gültige JSON-Daten, aber keine Benutzer
      (readFileSync as jest.Mock).mockReturnValue(
        JSON.stringify(mockEmptyUsers),
      );

      expect(() => repository.findById(1)).toThrow(
        'Error: No users found in the database',
      );
    });
  });
});
