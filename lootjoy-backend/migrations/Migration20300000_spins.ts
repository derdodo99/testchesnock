import { Migration } from '@mikro-orm/migrations';

export class MigrationXXXXXXXXXXXXXX extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      create table if not exists "spin_pools" (
        "id" serial primary key,
        "price" int not null unique,
        "config" jsonb not null,
        "created_at" timestamptz not null default now()
      );
    `);

    this.addSql(`
      create table if not exists "spin_rolls" (
        "id" serial primary key,
        "user_id" int not null,
        "price" int not null,
        "result" jsonb not null,
        "delta_crystals" int not null,
        "correlation_id" varchar(128) null,
        "created_at" timestamptz not null default now(),
        constraint "spin_rolls_user_id_fk"
          foreign key ("user_id") references "users" ("id")
          on update cascade on delete cascade
      );
    `);

    this.addSql(`create index if not exists "spin_rolls_user_id_idx" on "spin_rolls" ("user_id");`);
    this.addSql(
      `create index if not exists "spin_rolls_created_at_idx" on "spin_rolls" ("created_at");`,
    );

    // сидим базовые пулы
    this.addSql(`
      insert into "spin_pools" ("price","config")
      values
      (25, '[
        {"label":"⭐","type":"crystals","value":250,"chance":0.27},
        {"label":"💎","type":"crystals","value":150,"chance":0.72},
        {"label":"🏆","type":"item","itemId":"trophy_1","chance":2.01},
        {"label":"🎁","type":"item","itemId":"gift_1","chance":2.00},
        {"label":"➖","type":"crystals","value":0,"chance":95.00}
      ]'::jsonb),
      (50, '[
        {"label":"⭐","type":"crystals","value":500,"chance":0.27},
        {"label":"💎","type":"crystals","value":300,"chance":0.72},
        {"label":"🏆","type":"item","itemId":"trophy_2","chance":2.01},
        {"label":"🎁","type":"item","itemId":"gift_2","chance":2.00},
        {"label":"➖","type":"crystals","value":0,"chance":95.00}
      ]'::jsonb),
      (100, '[
        {"label":"⭐","type":"crystals","value":1000,"chance":0.27},
        {"label":"💎","type":"crystals","value":600,"chance":0.72},
        {"label":"🏆","type":"item","itemId":"trophy_3","chance":2.01},
        {"label":"🎁","type":"item","itemId":"gift_3","chance":2.00},
        {"label":"➖","type":"crystals","value":0,"chance":95.00}
      ]'::jsonb),
      (250, '[
        {"label":"⭐","type":"crystals","value":2500,"chance":0.27},
        {"label":"💎","type":"crystals","value":1500,"chance":0.72},
        {"label":"🏆","type":"item","itemId":"trophy_4","chance":2.01},
        {"label":"🎁","type":"item","itemId":"gift_4","chance":2.00},
        {"label":"➖","type":"crystals","value":0,"chance":95.00}
      ]'::jsonb)
      on conflict (price) do nothing;
    `);
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "spin_rolls" cascade;');
    this.addSql('drop table if exists "spin_pools" cascade;');
  }
}
