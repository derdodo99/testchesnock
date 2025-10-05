"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250928_wallet_transactions = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250928_wallet_transactions extends migrations_1.Migration {
    async up() {
        this.addSql(`
      create table if not exists "transactions" (
        "id" serial primary key,
        "wallet_id" int not null,
        "amount" int not null,
        "reason" varchar(255) null,
        "correlation_id" varchar(255) null,
        "created_at" timestamptz not null default now(),

        constraint "transactions_wallet_id_fk"
          foreign key ("wallet_id") references "wallets" ("id")
          on update cascade on delete cascade,

        constraint "transactions_correlation_id_uq"
          unique ("correlation_id")
      );
    `);
        this.addSql(`create index if not exists "transactions_wallet_id_idx" on "transactions" ("wallet_id");`);
        this.addSql(`create index if not exists "transactions_created_at_idx" on "transactions" ("created_at");`);
    }
    async down() {
        this.addSql(`drop table if exists "transactions" cascade;`);
    }
}
exports.Migration20250928_wallet_transactions = Migration20250928_wallet_transactions;
//# sourceMappingURL=Migration20250928_wallet_transactions.js.map