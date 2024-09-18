import { ConsoleLogger, InternalServerErrorException } from '@nestjs/common';

const logger = new ConsoleLogger('ThrowIfMappingError');

/**
 * Dieser Decorator fängt alle Fehler ab, die beim Mapping von Objekten (z.B. von einer Entität zu einem DTO) auftreten.
 * Er protokolliert den Fehler mithilfe des NestJS-Loggers und wirft eine InternalServerErrorException mit einer benutzerdefinierten Nachricht.
 *
 * Ziel:
 * - Fehler beim Mapping von Objekten erkennen und behandeln.
 * - Protokollierung der Mapping-Fehler zur besseren Diagnose.
 */

export function ThrowIfMappingError(message: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      try {
        return originalMethod.apply(this, args);
      } catch (error) {
        // Protokolliert den Mapping-Fehler und wirft eine Exception
        logger.error(`Mapping Error: ${error.message}`);
        throw new InternalServerErrorException(`${message}: ${error.message}`);
      }
    };

    return descriptor;
  };
}
