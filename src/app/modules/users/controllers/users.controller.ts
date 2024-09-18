import {
  Controller,
  Get,
  Param,
  UsePipes,
  ParseIntPipe,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { HttpExceptionFilter } from '../../../../core/filters/http-exception.filter';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

// Gruppiert die Endpunkte unter dem Tag 'users' für Swagger-Dokumentation
@ApiTags('users')
// Definiert den Basis-Endpoint 'v1/users' für diesen Controller
@Controller('v1/users')
// Wendet einen globalen Exception-Filter auf alle Endpunkte in diesem Controller an
@UseFilters(HttpExceptionFilter)
export class UsersController {
  // Injiziert den UsersService, um die Business-Logik auszulagern
  constructor(private readonly usersService: UsersService) {}

  // Endpunkt, um alle Benutzer zurückzugeben
  @Get()
  // Beschreibt den Endpunkt für die Swagger-Dokumentation
  @ApiOperation({ summary: 'Retrieve all users' })
  // Erfolgreiche Rückgabe mit Status 200 und Beschreibung
  @ApiResponse({
    status: 200,
    description: 'List of users returned successfully.',
  })
  // Fehlerhafte Rückgabe, falls keine Benutzer gefunden werden
  @ApiResponse({ status: 404, description: 'No users found.' })
  // ValidationPipe prüft, ob eingehende Daten dem DTO entsprechen, auch wenn hier keine Parameter erwartet werden
  @UsePipes(ValidationPipe)
  findAll() {
    // Übergibt die Anfrage an den UsersService, um alle Benutzer zu finden
    return this.usersService.findAllUsers();
  }

  // Endpunkt, um einen Benutzer nach ID zurückzugeben
  @Get(':id')
  // Beschreibt den Endpunkt für Swagger-Dokumentation
  @ApiOperation({ summary: 'Find a user by ID' })
  // Dokumentiert den ID-Parameter für Swagger
  @ApiParam({ name: 'id', description: 'ID of the user to retrieve' })
  // Erfolgreiche Rückgabe mit Status 200
  @ApiResponse({ status: 200, description: 'User found successfully.' })
  // Fehlerhafte Rückgabe, falls kein Benutzer mit dieser ID gefunden wird
  @ApiResponse({ status: 404, description: 'User not found.' })
  // ParseIntPipe prüft, ob die ID eine Zahl ist, ValidationPipe validiert zusätzlich
  @UsePipes(ParseIntPipe, ValidationPipe)
  findById(@Param('id') id: number) {
    // Übergibt die Anfrage an den UsersService, um einen Benutzer nach ID zu finden
    return this.usersService.findUserById(id);
  }
}
