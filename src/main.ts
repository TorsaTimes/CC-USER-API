import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { GlobalExceptionFilter } from './core/exceptions/global-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // Erstellt die Anwendung mit dem AppModule
  const app = await NestFactory.create(AppModule);

  // Registriert einen globalen Exception-Filter, der alle Fehler in der Anwendung abfängt und verarbeitet
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Aktiviert eine globale Validierungspipeline mit spezifischen Optionen:
  // - `transform`: Konvertiert eingehende Daten in die entsprechenden Typen der DTOs
  // - `whitelist`: Entfernt unerwünschte Felder, die nicht im DTO definiert sind
  // - `forbidNonWhitelisted`: Wirft einen Fehler, wenn nicht definierte Felder gesendet werden
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Setzt Swagger für die API-Dokumentation auf
  const config = new DocumentBuilder()
    .setTitle('User API') // Titel der API-Dokumentation
    .setDescription('The User API documentation') // Beschreibung der API
    .setVersion('1.0') // API-Version
    .addTag('users') // Fügt User Tag für Endpunkte hinzu, um diesen zu gruppieren
    .build();

  // Erzeugt das Swagger-Dokument basierend auf der Konfiguration
  const document = SwaggerModule.createDocument(app, config);
  // Stellt die Swagger-Dokumentation unter dem Pfad /api bereit
  SwaggerModule.setup('api', app, document);

  // Startet den Server und hört auf Port 3000
  await app.listen(3000);
}
// Startet die Anwendung
bootstrap();
