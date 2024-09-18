import { ConsoleLogger, InternalServerErrorException } from '@nestjs/common';

const logger = new ConsoleLogger('IOErrorDecorator');

/**
 * Dieser Decorator kümmert sich, um allgemeine I/O-Fehler (Input/Output) zu behandeln,
 * die in Methoden auftreten, die Dateizugriffe oder ähnliche Operationen ausführen.
 * Im Gegensatz zu spezifischen Fehlern wie "Datei nicht gefunden" (ENOENT) oder Syntaxfehlern
 * fängt dieser Decorator alle anderen I/O-bezogenen Fehler ab, protokolliert diese und wirft
 * eine InternalServerErrorException mit einer benutzerdefinierten Nachricht.
 *
 * Ziel:
 * - Erkennen und Behandeln von allgemeinen I/O-Fehlern, die nicht durch ENOENT oder Syntaxfehler ausgelöst werden.
 * - Protokollierung der I/O-Fehler zur Diagnose.
 * - Bereitstellung benutzerdefinierter Fehlermeldungen für I/O-Probleme.
 */
export function IOErrorDecorator(message: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      try {
        const result = originalMethod.apply(this, args);
        return result;
      } catch (error) {
        // Prüft, ob der Fehler kein 'ENOENT'- oder Syntaxfehler ist
        if (error.code !== 'ENOENT' && !(error instanceof SyntaxError)) {
          // Protokolliere den I/O-Fehler mithilfe des NestJS-Loggers
          logger.error(`IO Error: ${error.message}`);
          // Wirft eine InternalServerErrorException mit einer benutzerdefinierten Nachricht
          throw new InternalServerErrorException(
            `${message}: I/O Error - ${error.message}`,
          );
        }
        throw error;
      }
    };

    return descriptor;
  };
}
