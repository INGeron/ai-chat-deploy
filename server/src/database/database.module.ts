import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ConfigService} from "@nestjs/config";

@Module({
    imports:[
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService) => {
                const url = configService.get<string>("DATABASE_URL");
                return {
                    type: 'postgres',
                    url: url, // Если есть URL, он будет приоритетным
                    host: !url ? configService.get<string>("DATABASE_HOST", "localhost") : undefined,
                    port: !url ? configService.get<number>("DATABASE_PORT", 5432) : undefined,
                    username: !url ? configService.get<string>("DATABASE_USER", "postgres") : undefined,
                    password: !url ? configService.get<string>("DATABASE_PASSWORD", "postgres") : undefined,
                    database: !url ? configService.get<string>("DATABASE_NAME", "ai_chat") : undefined,
                    autoLoadEntities: true,
                    synchronize: true, // В продакшене лучше использовать миграции
                    ssl: url ? { rejectUnauthorized: false } : false, // Для Railway и других облаков
                };
            },
            inject:[ConfigService]
        })
    ]})
export class DatabaseModule {}
