import { Migration } from "@mikro-orm/migrations";

export class Migration20251005CreateRpsBotTables extends Migration {
  async up(): Promise<void> {
    this.addSql(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "rps_bot_games" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "bet" int NOT NULL DEFAULT 0 CHECK ("bet" = 0),

        "status" varchar(16) NOT NULL DEFAULT 'waiting'
          CHECK ("status" IN ('waiting','playing','finished','canceled','expired')),

        "bot_won" boolean NOT NULL DEFAULT false,

        "created_at" timestamptz NOT NULL DEFAULT now(),
        "started_at" timestamptz NULL,
        "finished_at" timestamptz NULL,

        "player_id" int NOT NULL,
        "winner_id" int NULL
      );
    `);

    this.addSql(`
      ALTER TABLE "rps_bot_games"
        ADD CONSTRAINT "rps_bot_games_player_fk"
          FOREIGN KEY ("player_id") REFERENCES "users" ("id")
          ON UPDATE CASCADE ON DELETE RESTRICT,
        ADD CONSTRAINT "rps_bot_games_winner_fk"
          FOREIGN KEY ("winner_id") REFERENCES "users" ("id")
          ON UPDATE CASCADE ON DELETE SET NULL;
    `);

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "rps_bot_games_status_idx" ON "rps_bot_games" ("status");`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "rps_bot_games_player_idx" ON "rps_bot_games" ("player_id");`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "rps_bot_games_created_at_idx" ON "rps_bot_games" ("created_at");`,
    );

    this.addSql(`
      CREATE TABLE IF NOT EXISTS "rps_bot_moves" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),

        "commit_hash" varchar(128) NOT NULL,
        "symbol" varchar(16) NULL
          CHECK ("symbol" IN ('rock','paper','scissors') OR "symbol" IS NULL),
        "nonce" varchar(128) NULL,

        "committed_at" timestamptz NOT NULL DEFAULT now(),
        "revealed_at" timestamptz NULL,

        "game_id" uuid NOT NULL,
        "user_id" int NOT NULL
      );
    `);

    this.addSql(`
      ALTER TABLE "rps_bot_moves"
        ADD CONSTRAINT "rps_bot_moves_game_fk"
          FOREIGN KEY ("game_id") REFERENCES "rps_bot_games" ("id")
          ON UPDATE CASCADE ON DELETE CASCADE,
        ADD CONSTRAINT "rps_bot_moves_user_fk"
          FOREIGN KEY ("user_id") REFERENCES "users" ("id")
          ON UPDATE CASCADE ON DELETE RESTRICT;
    `);

    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "rps_bot_moves_game_user_uq" ON "rps_bot_moves" ("game_id","user_id");`,
    );

    this.addSql(
      `CREATE INDEX IF NOT EXISTS "rps_bot_moves_game_idx" ON "rps_bot_moves" ("game_id");`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "rps_bot_moves_user_idx" ON "rps_bot_moves" ("user_id");`,
    );
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "rps_bot_moves_committed_at_idx" ON "rps_bot_moves" ("committed_at");`,
    );
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "rps_bot_moves";`);
    this.addSql(`DROP TABLE IF EXISTS "rps_bot_games";`);
  }
}
