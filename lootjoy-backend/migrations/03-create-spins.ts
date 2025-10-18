import { Migration } from '@mikro-orm/migrations';

export class MigrationXXXXXXXXXXXXXX extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      create table if not exists "spin_pools" (
        "id" uuid primary key default gen_random_uuid(),             -- CHANGED: serial -> uuid
        "name" varchar(128) not null,                                -- CHANGED: вместо "config"
        "cost" int not null,                                         -- CHANGED: вместо "price"
        "is_active" boolean not null default true,                   -- CHANGED: флаг активности пула
        "created_at" timestamptz not null default now()
      );
    `);

    this.addSql(
      `create index if not exists "spin_pools_is_active_idx" on "spin_pools" ("is_active");`,
    );

    this.addSql(`
      create table if not exists "spin_item" (
        "id" uuid primary key default gen_random_uuid(),             -- CHANGED: uuid
        "pool_id" uuid not null,                                     -- FK -> spin_pools(id)
        "type" varchar(20) not null,                                 -- PrizeType (string)
        "crystals" int null,                                         -- если type = CRYSTALS
        "item_id" varchar(128) null,                                 -- если type = ITEM
        "weight" int not null,                                       -- вероятность
        "stock" int null,                                            -- null => бесконечный
        "is_active" boolean not null default true,                   -- активен ли слот
        constraint "spin_item_pool_id_fk"
          foreign key ("pool_id") references "spin_pools" ("id")
          on update cascade on delete cascade
      );
    `);

    this.addSql(`create index if not exists "spin_item_pool_id_idx" on "spin_item" ("pool_id");`);
    this.addSql(
      `create index if not exists "spin_item_is_active_idx" on "spin_item" ("is_active");`,
    );
    this.addSql(`create index if not exists "spin_item_type_idx" on "spin_item" ("type");`);

    this.addSql(`
      create table if not exists "spin_rolls" (
        "id" uuid primary key default gen_random_uuid(),             -- CHANGED: serial -> uuid
        "pool_id" uuid not null,                                     -- CHANGED: ссылка на spin_pools(id)
        "user_id" uuid not null,                                     -- CHANGED: int -> uuid (users.id)
        "result_type" varchar(20) not null,                          -- CHANGED: вместо jsonb
        "result_crystals" int null,                                  -- nullable
        "result_item_id" varchar(128) null,                          -- nullable
        "cost" int not null,                                         -- CHANGED: вместо price
        "demo" boolean not null default false,                       -- демо-спин (без баланса)
        "server_seed_hash" text not null,
        "client_seed" text not null,
        "nonce" bigint not null,
        "created_at" timestamptz not null default now(),
        constraint "spin_rolls_pool_id_fk"
          foreign key ("pool_id") references "spin_pools" ("id")
          on update cascade on delete cascade,
        constraint "spin_rolls_user_id_fk"
          foreign key ("user_id") references "users" ("id")
          on update cascade on delete cascade
      );
    `);

    this.addSql(`create index if not exists "spin_rolls_user_id_idx" on "spin_rolls" ("user_id");`);
    this.addSql(`create index if not exists "spin_rolls_pool_id_idx" on "spin_rolls" ("pool_id");`);
    this.addSql(
      `create index if not exists "spin_rolls_created_at_idx" on "spin_rolls" ("created_at");`,
    );
    this.addSql(
      `create index if not exists "spin_rolls_result_type_idx" on "spin_rolls" ("result_type");`,
    );

    this.addSql(`
      create table if not exists "inventory_item" (
        "id" uuid primary key default gen_random_uuid(),             -- uuid PK
        "user_id" uuid not null,                                     -- FK -> users(id)
        "item_id" varchar(128) not null,
        "created_at" timestamptz not null default now(),
        constraint "inventory_item_user_id_fk"
          foreign key ("user_id") references "users" ("id")
          on update cascade on delete cascade
      );
    `);

    this.addSql(
      `create index if not exists "inventory_item_user_id_idx" on "inventory_item" ("user_id");`,
    );
    this.addSql(
      `create index if not exists "inventory_item_created_at_idx" on "inventory_item" ("created_at");`,
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "inventory_item" cascade;');
    this.addSql('drop table if exists "spin_rolls" cascade;');
    this.addSql('drop table if exists "spin_item" cascade;');
    this.addSql('drop table if exists "spin_pools" cascade;');
  }
}
