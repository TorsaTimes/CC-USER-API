import { UserDto } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { ThrowIfMappingError } from '../../../../core/decorators/throw-if-mapping-error.decorator';

export class UserMapper {
  // Konvertiert eine User-Entity in ein UserDto-Objekt
  // Dekorator, der bei einem Mapping-Fehler eine definierte Fehlermeldung ausgibt
  @ThrowIfMappingError('Error mapping User to UserDto')
  static toDto(user: User): UserDto {
    const userDto = new UserDto();
    // Konvertiert die ID der User-Entity in eine Zahl und weist sie dem DTO zu
    userDto.id = Number(user.id);
    // Weist den Namen und die E-Mail aus der User-Entity dem DTO zu
    userDto.name = user.name;
    userDto.email = user.email;

    return userDto;
  }

  // Konvertiert ein UserDto-Objekt in eine User-Entity
  @ThrowIfMappingError('Error mapping UserDto to User')
  static toEntity(userDto: UserDto): User {
    const user = new User();
    // Konvertiert die ID aus dem UserDto in eine Zahl und weist sie der User-Entity zu
    user.id = Number(userDto.id);
    // Weist den Namen und die E-Mail aus dem UserDto der User-Entity zu
    user.name = userDto.name;
    user.email = userDto.email;
    return user;
  }
}
