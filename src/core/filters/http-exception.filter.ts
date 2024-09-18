import {
  ExceptionFilter, // Interface für spezielle Fehlerbehandlungslogik in NestJS
  Catch, // Dekorator, der diesen Filter für HttpException markiert
  ArgumentsHost, // Ermöglicht den Zugriff auf HTTP-spezifische Objekte (z.B. Request, Response)
  HttpException, // Basisklasse für HTTP-spezifische Fehler
} from '@nestjs/common';
import { Request, Response } from 'express'; // Definiert die HTTP-Anfrage und -Antwort
import { ErrorResponse } from '../http/error-response'; // Eigene Klasse zur Standardisierung von Fehlerantworten

@Catch(HttpException) // Filter fängt nur HttpExceptions ab (z.B. 404, 403, 500 etc.)
export class HttpExceptionFilter implements ExceptionFilter {
  // Hauptmethode des Filters, die bei einem HTTP-Fehler aufgerufen wird
  catch(exception: HttpException, host: ArgumentsHost) {
    // Zugriff auf den HTTP-spezifischen Kontext (Anfrage und Antwort)
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // HTTP-Statuscode aus der Ausnahme
    const status = exception.getStatus();

    // ehlermeldung und weitere Details aus der Ausnahme
    const exceptionResponse = exception.getResponse() as any;

    // Fehlerantwort mithilfe der ErrorResponse-Klasse
    const errorResponse = ErrorResponse.create(
      status, // HTTP-Statuscode (z.B. 404, 500)
      exceptionResponse.message || 'An unexpected error occurred', // Fehlermeldung oder eine Standardmeldung
      exceptionResponse.error || 'Error', // Fehlername oder Standard 'Error'
      request.url, // URL der fehlerhaften Anfrage
    );

    // Sende die Fehlerantwort an den Client
    response.status(status).json(errorResponse);
  }
}
