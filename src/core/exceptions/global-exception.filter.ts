import {
  ExceptionFilter, // Basisinterface für Exception-Filter in NestJS
  Catch, // Dekorator, um Ausnahmen zu behandeln
  ArgumentsHost, // Bietet Zugang zu HTTP-spezifischen Objekten (z.B. Request, Response)
  HttpException, // Basis-Klasse für HTTP-bezogene Ausnahmen
  HttpStatus, // HTTP-Statuscodes
  ConsoleLogger, // NestJS-Logger für Protokollierung
} from '@nestjs/common';
import { Response } from 'express'; // Typisierung für die HTTP-Antwort
import { ErrorResponse } from '../http/error-response'; // Eigene Klasse zur Standardisierung von Fehlerantworten

@Catch() // Dieser Filter fängt alle Ausnahmen ab, die nicht explizit gefangen werden
export class GlobalExceptionFilter implements ExceptionFilter {
  // Logger, um Fehler zu protokollieren
  private readonly logger = new ConsoleLogger(GlobalExceptionFilter.name);

  // Hauptmethode des Filters, die die Ausnahme behandelt
  catch(exception: any, host: ArgumentsHost) {
    // Zugriff auf die HTTP-spezifischen Objekte (z.B. Response)
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // HTTP-Statuscode: Wenn die Ausnahme eine HttpException ist, nutze deren Status.
    // Andernfalls wird ein Statuscode 500 (Internal Server Error) verwendet.
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Fehlermeldung: Für HttpException wird die eigene Nachricht genutzt,
    // bei anderen Fehlern eine allgemeine Nachricht.
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    // Fehler inklusive des Status, der Fehlermeldung und des Stack-Traces wird geloggt
    this.logger.error(`Status: ${status}, Error: ${message}`, exception.stack);

    // standardisierte Fehlerantwort wird return
    response.status(status).json(new ErrorResponse(status, message, 'Error'));
  }
}
