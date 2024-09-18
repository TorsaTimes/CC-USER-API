import { FileNotFoundErrorDecorator } from './file-not-found.decorator';
import { InvalidJsonErrorDecorator } from './invalid-json.decorator';
import { IOErrorDecorator } from './io-error.decorator';
import { ThrowIfNullOrUndefined } from './throw-if-null-or-undefined.decorator';

/**
 * Kombiniert mehrere Dekoratoren in einem zusammen.
 *
 * @param options Ein Objekt, das benutzerdefinierte Fehlermeldungen für verschiedene Szenarien enthält.
 * Dieser Dekorator wendet mehrere Fehlerbehandlungs-Dekoratoren auf eine Repository-Methode an,
 * wie z.B. Datei-nicht-gefunden, ungültige JSON-Struktur, I/O-Fehler oder das Behandeln von null/undefined-Ergebnissen.
 */
export function CombineRepositoryDecorators(options: {
  fileNotFoundMessage: string; // Nachricht für den Fall, dass eine Datei nicht gefunden wird
  invalidJsonMessage: string; // Nachricht für ungültige JSON-Struktur
  ioErrorMessage: string; // Nachricht für allgemeine I/O-Fehler
  notFoundMessage: string; // Nachricht für den Fall, dass das Ergebnis null oder undefined ist
}) {
  return function (
    target: any, // Die Klasse, auf die der Dekorator angewendet wird
    propertyKey: string, // Der Name der Methode, die dekoriert wird
    descriptor: PropertyDescriptor, // Beschreibt die Eigenschaften der Methode
  ) {
    // Protokolliert, um zu bestätigen, dass die kombinierten Dekoratoren angewendet werden
    console.log(`Kombinierte Dekoratoren für Methode anwenden: ${propertyKey}`);

    // Anwenden der einzelnen Dekoratoren in einer bestimmten Reihenfolge,
    // Fehler werden protokolliert und behandelt
    try {
      FileNotFoundErrorDecorator(options.fileNotFoundMessage)(
        target,
        propertyKey,
        descriptor,
      );
      InvalidJsonErrorDecorator(options.invalidJsonMessage)(
        target,
        propertyKey,
        descriptor,
      );
      IOErrorDecorator(options.ioErrorMessage)(target, propertyKey, descriptor);
      ThrowIfNullOrUndefined(options.notFoundMessage)(
        target,
        propertyKey,
        descriptor,
      );
    } catch (error) {
      // Loggen von Fehlern, die beim Anwenden der Dekoratoren auftreten
      console.error('Fehler beim Anwenden des Dekorators:', error);
    }

    return descriptor; // Rückgabe des modifizierten Methoden-Descriptors
  };
}
