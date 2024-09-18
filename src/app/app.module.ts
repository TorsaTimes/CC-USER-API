import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module'; // Importiert das UsersModule
import { ConfigModule } from '@nestjs/config'; // Importiert das ConfigModule für die Umgebungsvariablen
import { join } from 'path'; // Importiere join, um Pfade zu erstellen

@Module({
  // Definiert die importierten Module, die in dieser Anwendung verwendet werden
  imports: [
    // Modul für Benutzerverwaltung
    UsersModule,
    // Wird verwendet, um Umgebungsvariablen zu verwalten
    ConfigModule.forRoot({
      isGlobal: true, // Macht das ConfigModule global verfügbar, sodass es in allen Modulen genutzt werden kann
      envFilePath: join(process.cwd(), 'src/config/.env'), // Pfad zur .env-Datei für Umgebungsvariablen
    }),
  ],
})
export class AppModule {}
