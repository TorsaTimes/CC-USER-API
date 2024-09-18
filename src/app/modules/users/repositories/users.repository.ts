import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { User } from '../entities/user.entity';
import { CombineRepositoryDecorators } from '../../../../core/decorators/combine-repository-decorators.decorator'; // Der kombinierte Decorator
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserRepository {
  private readonly filePath: string;

  constructor(private readonly configService: ConfigService) {
    // Pfad der JSON-Datei aus der Umgebungsvariable: USERS_JSON_PATH, lesen
    const jsonPath = this.configService.get<string>('USERS_JSON_PATH');
    // Wenn der Pfad nicht definiert ist, wird eine Fehler geworfen
    if (!jsonPath) {
      throw new Error('USERS_JSON_PATH is not defined in .env file');
    }
    // Erstelle den absoluten Pfad zur JSON-Datei aus dem Projektstammverzeichnis
    this.filePath = resolve(process.cwd(), jsonPath);
  }

  // Lade alle Benutzer aus der JSON-Datei
  @CombineRepositoryDecorators({
    // Meldung, falls Datei nicht gefunden wird
    fileNotFoundMessage: 'Could not find users.json file',
    // Meldung bei fehlerhafter JSON-Datei
    invalidJsonMessage: 'Invalid JSON structure in users.json file',
    // Meldung bei allgemeinen I/O-Fehlern
    ioErrorMessage: 'General I/O error while accessing users.json file',
    // Meldung, falls kein Benutzer gefunden wird
    notFoundMessage: 'User with the given {id} not found',
  })
  findAll(): User[] {
    // Lese den Inhalt der JSON-Datei als String
    const data = readFileSync(this.filePath, 'utf8');
    // Wandelt den JSON-String in ein Array von User-Objekten um
    return JSON.parse(data);
  }

  @CombineRepositoryDecorators({
    fileNotFoundMessage: 'Could not find users.json file',
    invalidJsonMessage: 'Invalid JSON structure in users.json file',
    ioErrorMessage: 'General I/O error while accessing users.json file',
    notFoundMessage: 'Error: No users found in the database',
  })
  // Finde einen Benutzer anhand seiner ID
  findById(id: number): User {
    // Lade alle Benutzer und suche den Benutzer mit der angegebenen ID
    const users = this.findAll();
    return users.find((user) => user.id === id);
  }
}
