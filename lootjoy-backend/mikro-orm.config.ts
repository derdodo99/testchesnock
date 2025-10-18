import 'dotenv/config';
import path from 'node:path';
import { Utils } from '@mikro-orm/core';
import { defineConfig } from '@mikro-orm/postgresql'; // <-- ВАЖНО: из postgresql
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { ReflectMetadataProvider } from '@mikro-orm/core';

const isTsRuntime = Utils.detectTsNode(); // ts-node/tsx => true, dist/js => false

export default defineConfig({
  metadataProvider: isTsRuntime ? TsMorphMetadataProvider : ReflectMetadataProvider,

  entitiesTs: isTsRuntime
    ? [path.resolve(process.cwd(), 'src/**/*.entity.ts')]
    : [path.resolve(process.cwd(), 'src/**/*.entity.ts')],
  entities: !isTsRuntime
    ? [path.resolve(process.cwd(), 'dist/**/*.entity.js')]
    : [path.resolve(process.cwd(), 'dist/**/*.entity.js')],

  dbName: process.env.DB_NAME ?? 'lootjoy',
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? '1234',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),

  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: path.resolve(process.cwd(), 'migrations'),
    pathTs: path.resolve(process.cwd(), 'migrations'),
    transactional: true,
  },
});
