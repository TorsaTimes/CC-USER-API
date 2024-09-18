export class ErrorResponse {
  // Konstruktor initialisiert die Fehlermeldung mit allen erforderlichen Eigenschaften
  constructor(
    public statusCode: number, // HTTP-Statuscode (z.B. 404, 500)
    public message: string, // Fehlermeldung, die dem Benutzer angezeigt wird
    public error: string, // Name oder Typ des Fehlers (z.B. 'Not Found')
    public timestamp: string = new Date().toISOString(), // Zeitstempel, wann der Fehler auftrat (Standard ist der aktuelle Zeitpunkt)
    public path?: string, // Pfad der fehlerhaften Anfrage
  ) {}

  // Methode zum Erstellen einer neuen Fehlerantwort-Instanz
  static create(
    statusCode: number, // HTTP-Statuscode der Antwort
    message: string, // Fehlermeldung, die der Client erhält
    error: string, // Der spezifische Fehlername oder -typ
    path: string, // Der Pfad der fehlerhaften Anfrage
  ): ErrorResponse {
    // ErrorResponse welcher zurückgegeben wird
    return new ErrorResponse(
      statusCode,
      message,
      error,
      new Date().toISOString(), // Erzeuge automatisch einen neuen Zeitstempel
      path, // Übergabe des Pfads der Anfrage
    );
  }
}
