import { ConsoleLogger, BadRequestException } from '@nestjs/common';
import { validateSync } from 'class-validator';

const logger = new ConsoleLogger('ValidateDto');

/**
 * Dieser Decorator validiert automatisch ein DTO (Data Transfer Object) vor der Ausführung einer Methode.
 * Wenn Validierungsfehler auftreten, werden diese protokolliert und eine BadRequestException wird geworfen.
 *
 * Ziel:
 * - Automatische Validierung von DTOs vor der Verarbeitung.
 * - Protokollierung von Validierungsfehlern zur besseren Diagnose.
 * - Werfen einer BadRequestException, wenn die Validierung fehlschlägt.
 */

export function ValidateDto() {
  return function (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const dto = args[0];
      const errors = validateSync(dto);
      // Wenn Fehler gefunden werden, wird eine BadRequestException geworfen
      if (errors.length > 0) {
        logger.error(
          `Mapping Error: ${errors.map((err) => err.toString()).join(', ')}`,
        );
        throw new BadRequestException(
          `Validation failed: ${errors.map((err) => err.toString()).join(', ')}`,
        );
      }
      // Originalmethode wird aufgerufen, wenn keine Fehler gefunden wurden
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}
