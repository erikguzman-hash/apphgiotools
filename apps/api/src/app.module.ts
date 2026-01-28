import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ToolsModule } from './modules/tools/tools.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { LogsModule } from './modules/logs/logs.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    // Configuracion de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 100, // 100 requests por minuto
      },
    ]),

    // Firebase (Firestore, Auth, Storage)
    FirebaseModule,

    // Modulos de la aplicacion
    AuthModule,
    UsersModule,
    ToolsModule,
    CategoriesModule,
    LogsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
