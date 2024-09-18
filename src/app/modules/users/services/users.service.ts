import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/users.repository';
import { User } from '../entities/user.entity';
import { UserDto } from '../dto/user.dto'; // Importiert das UserDto zur Verwendung in der Service-Logik
import { UserMapper } from '../mapper/user.mapper'; // Mapper zur Umwandlung zwischen User-Entity und UserDto
import { UserValidator } from '../validators/users.validator'; // Validator zur Validierung von UserDto-Objekten

@Injectable()
export class UsersService {
  constructor(
    // Injektion des Repositories zur Datenbankabfrage
    private readonly userRepository: UserRepository,
    // Injektion der Validator-Klasse zur Validierung
    private readonly userValidator: UserValidator,
  ) {}

  // Lädt alle Benutzer, validiert sie und gibt sie als UserDtos zurück
  findAllUsers(): UserDto[] {
    // Lädt die Benutzer-Entitäten aus der Datenquelle (z.B. JSON-Datei)
    const users: User[] = this.userRepository.findAll();
    // Prüft, ob Benutzer vorhanden sind, und wirft eine Exception, falls keine gefunden werden
    if (!users || users.length === 0) {
      throw new NotFoundException('No users found in the database');
    }
    // Wandelt die Benutzer-Entitäten in UserDtos um
    const userDtos = users.map((user) => UserMapper.toDto(user));

    // Validiert die Liste von UserDtos synchron
    this.userValidator.validateUserDtos(userDtos);

    // Gibt die validierten UserDtos zurück
    return userDtos;
  }

  // Findet einen Benutzer anhand der ID, validiert ihn und gibt ihn als UserDto zurück
  findUserById(id: number): UserDto {
    // Lädt eine spezifische Benutzer-Entität aus der Datenquelle
    const user: User = this.userRepository.findById(id);

    // Falls kein Benutzer mit der angegebenen ID gefunden wird, wird eine NotFoundException geworfen
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    // Wandelt die gefundene Benutzer-Entität in ein UserDto um
    const userDto = UserMapper.toDto(user); // Entität in ein DTO umwandeln

    // Validiert das UserDto
    this.userValidator.validateUserDto(userDto);

    // Gibt das validierte UserDto zurück
    return userDto;
  }
}
