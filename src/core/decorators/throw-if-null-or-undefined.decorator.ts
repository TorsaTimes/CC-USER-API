import { ConsoleLogger, NotFoundException } from '@nestjs/common';

const logger = new ConsoleLogger('ThrowIfNullOrUndefined');

/**
 * Dieser Decorator prüft, ob das Ergebnis einer Methode `null` oder `undefined` ist.
 * Wenn dies der Fall ist, wird eine NotFoundException geworfen, die dynamisch mit der ID
 * aus den übergebenen Argumenten formatiert wird.
 *
 * Ziel:
 * - Sicherstellen, dass keine `null` oder `undefined` Ergebnisse verarbeitet werden.
 * - Protokollierung von Fehlern und Werfen einer sinnvollen NotFoundException.
 */

export function ThrowIfNullOrUndefined(message: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const result = originalMethod.apply(this, args);
      // Wenn das Ergebnis null oder undefined ist, wird eine NotFoundException geworfen
      if (result === null || result === undefined) {
        // Ersetzt {id} in der Nachricht durch die erste Argument-ID (args[0])
        const formattedMessage = message.replace('{id}', args[0]); // args[0] ist die ID
        logger.error(`Result is null or undefined: ${message}`); // Verwende NestJS Logger
        throw new NotFoundException(formattedMessage);
      }

      return result;
    };

    return descriptor;
  };
}
