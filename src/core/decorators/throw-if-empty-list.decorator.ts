import { ConsoleLogger, NotFoundException } from '@nestjs/common';

const logger = new ConsoleLogger('ThrowIfEmptyList');

/**
 * Dieser Decorator prüft, ob eine Liste Leer ist, die eine Liste zurückgeben.
 * Wenn die Liste leer ist, wird ein Fehler geloggt und eine NotFoundException geworfen.
 * Dies stellt sicher, dass leere Ergebnismengen
 * als Fehler behandelt werden.
 *
 * Ziel:
 * - Sicherstellen, dass leere Listen als Fehler behandelt werden.
 * - Protokollierung von leeren Listen zur besseren Diagnose.
 * - Werfen einer NotFoundException, wenn eine leere Liste zurückgegeben wird.
 */

export function ThrowIfEmptyList(message: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const result = originalMethod.apply(this, args);
      // Prüft, ob das Ergebnis eine leere Liste ist
      if (Array.isArray(result) && result.length === 0) {
        // Protokolliere den Fehler bei leerer Liste
        logger.error(`List is Empty: ${message}`);
        // Wirft eine NotFoundException mit der benutzerdefinierten Nachricht
        throw new NotFoundException(message);
      }
      return result;
    };

    return descriptor;
  };
}
