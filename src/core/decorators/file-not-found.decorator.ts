import { ConsoleLogger, InternalServerErrorException } from '@nestjs/common';

// Erstelle eine Logger-Instanz für den Decorator, um Fehlermeldungen zu protokollieren
const logger = new ConsoleLogger('FileNotFoundErrorDecorator');

/**
 * Dieser Decorator prüft, den Dateizugriff.
 * Falls die Datei nicht gefunden wird (Fehlercode 'ENOENT'), wird der Fehler abgefangen,
 * im Logger protokolliert und eine InternalServerErrorException mit einer benutzerdefinierten Nachricht geworfen.
 *
 * Ziel:
 * - Dateibezogene Fehler wie 'File not found' (ENOENT) abfangen und behandeln.
 * - Protokollierung der Fehler zur einfacheren Diagnose.
 * - Benutzerdefinierte, verständliche Fehlermeldungen werfen.
 */
export function FileNotFoundErrorDecorator(message: string) {
  // Rückgabewert ist die eigentliche Decorator-Funktion
  return function (
    target: any, // Zielobjekt, auf das der Dekorator angewendet wird (z.B. die Klasse)
    propertyKey: string, // Name der Methode, die dekoriert wird
    descriptor: PropertyDescriptor, // Beschreibt die Methode (z.B. Eigenschaften wie writable, value)
  ) {
    // Speichere die Originalmethode, die durch den Decorator überschrieben wird
    const originalMethod = descriptor.value;

    // Überschreibt die Methode, um zusätzliche Fehlerbehandlung hinzuzufügen
    descriptor.value = function (...args: any[]) {
      try {
        // Ruft die Originalmethode synchron auf und gibt das Ergebnis zurück
        const result = originalMethod.apply(this, args);
        return result;
      } catch (error) {
        // Prüft, ob der Fehlercode 'ENOENT' (Datei nicht gefunden) ist
        if (error.code === 'ENOENT') {
          // Protokolliert den Fehler mithilfe des NestJS-Loggers
          logger.error(`File not found: ${error.message}`);
          // Wirft eine InternalServerErrorException mit einer benutzerdefinierten Nachricht
          throw new InternalServerErrorException(`${message}: File not found`);
        }
        // Wenn es sich um einen anderen Fehler handelt, wirde dieser geworfen
        throw error;
      }
    };

    // Gibt den modifizierten Descriptor zurück
    return descriptor;
  };
}
