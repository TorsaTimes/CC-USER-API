import { ConsoleLogger, InternalServerErrorException } from '@nestjs/common';

const logger = new ConsoleLogger('InvalidJsonErrorDecorator');

/**
 * Dieser Decorator prüft, ob syntax fehler in den JSON-Daten vorhanden sind.
 * Er fängt Syntaxfehler ab, die durch ungültige JSON-Strukturen ausgelöst werden, und behandelt sie,
 * indem er eine verständliche Fehlermeldung wirft.
 *
 * Ziel:
 * - JSON-bezogene Syntaxfehler abfangen und loggen
 * - Benutzerdefinierte Fehlermeldungen zurückgeben, wenn die JSON-Struktur ungültig ist
 * - Vermeidung von nicht behandelten Syntaxfehlern, die die Anwendung zum Absturz bringen könnten
 */
export function InvalidJsonErrorDecorator(message: string) {
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
        // Prüft, ob der Fehler ein SyntaxError ist (meist bei ungültigem JSON)
        if (error instanceof SyntaxError) {
          // Protokollieren des JSON-Fehlers
          logger.error(`Invalid JSON structure: ${error.message}`);
          // Wirft eine verständliche Fehlermeldung als InternalServerErrorException
          throw new InternalServerErrorException(
            `${message}: Invalid JSON structure`,
          );
        }
        throw error;
      }
    };

    return descriptor;
  };
}
