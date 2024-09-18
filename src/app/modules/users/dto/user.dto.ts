import { IsNotEmpty, IsEmail, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UserDto {
  // Stellt sicher, dass die ID in eine Zahl umgewandelt wird und validiert sie als Ganzzahl (Integer)
  // Transformiert den ID-Wert in einen Zahlentyp (z.B. bei der Datenübertragung)
  @Type(() => Number)
  // Validiert, dass die ID eine Ganzzahl ist
  @IsInt({ message: 'ID must be an integer' })
  // Überprüft, dass die ID nicht leer ist
  @IsNotEmpty({ message: 'ID is required' })
  id: number;
  // Validiert, dass der Name vorhanden ist und ein String ist
  // Überprüft, dass der Name nicht leer ist
  @IsNotEmpty({ message: 'Name is required' })
  // Validiert, dass der Name ein String ist
  @IsString({ message: 'Name must be a string' })
  name: string;
  // Validiert, dass die E-Mail im korrekten Format ist und ein String ist
  // Validiert, dass die E-Mail im korrekten Format vorliegt
  @IsEmail({}, { message: 'Invalid email format' })
  // Überprüft, dass die E-Mail ein String ist
  @IsString({ message: 'Email must be a string' })
  email: string;
}
