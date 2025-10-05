"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_path_1 = __importDefault(require("node:path"));
const core_1 = require("@mikro-orm/core");
const postgresql_1 = require("@mikro-orm/postgresql");
const reflection_1 = require("@mikro-orm/reflection");
const core_2 = require("@mikro-orm/core");
const isTsRuntime = core_1.Utils.detectTsNode();
console.log(isTsRuntime, 'isTsRuntime');
exports.default = (0, postgresql_1.defineConfig)({
    metadataProvider: isTsRuntime
        ? reflection_1.TsMorphMetadataProvider
        : core_2.ReflectMetadataProvider,
    entitiesTs: isTsRuntime
        ? [node_path_1.default.resolve(process.cwd(), 'src/**/*.entity.ts')]
        : [node_path_1.default.resolve(process.cwd(), 'src/**/*.entity.ts')],
    entities: !isTsRuntime
        ? [node_path_1.default.resolve(process.cwd(), 'dist/**/*.entity.js')]
        : [node_path_1.default.resolve(process.cwd(), 'dist/**/*.entity.js')],
    dbName: process.env.DB_NAME ?? 'lootjoy',
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? '1234',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    debug: process.env.NODE_ENV !== 'production',
    migrations: {
        tableName: 'mikro_orm_migrations',
        path: node_path_1.default.resolve(process.cwd(), 'migrations'),
        pathTs: node_path_1.default.resolve(process.cwd(), 'migrations'),
        transactional: true,
    },
});
//# sourceMappingURL=mikro-orm.config.js.map