import { Migration } from '@mikro-orm/migrations';

export class Migration20251004CreateRpsTables extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "rps_games" (
        "id" uuid primary key default gen_random_uuid(),
        "bet" int NOT NULL CHECK ("bet" > 0),
        "status" varchar(16) NOT NULL DEFAULT 'waiting'
          CHECK ("status" IN ('waiting','playing','finished','canceled','expired')),

        "creator_id" uuid not null,
        "opponent_id" uuid null,
        "winner_id" uuid null,

        "created_at" timestamptz NOT NULL DEFAULT now(),
        "started_at" timestamptz NULL,
        "finished_at" timestamptz NULL
      );
    `);

    this.addSql(`
      ALTER TABLE "rps_games"
        ADD CONSTRAINT "rps_games_creator_fk"
          FOREIGN KEY ("creator_id") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
        ADD CONSTRAINT "rps_games_opponent_fk"
          FOREIGN KEY ("opponent_id") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE SET NULL,
        ADD CONSTRAINT "rps_games_winner_fk"
          FOREIGN KEY ("winner_id") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE SET NULL;
    `);

    this.addSql(`CREATE INDEX IF NOT EXISTS "rps_games_status_idx" ON "rps_games" ("status");`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "rps_games_bet_idx" ON "rps_games" ("bet");`);
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "rps_games_created_at_idx" ON "rps_games" ("created_at");`,
    );

    this.addSql(`
      CREATE TABLE IF NOT EXISTS "rps_moves" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "game_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,

        "commit_hash" varchar(128) NOT NULL,
        "symbol" varchar(16) NULL
          CHECK ("symbol" IN ('rock','paper','scissors') OR "symbol" IS NULL),
        "nonce" varchar(128) NULL,

        "committed_at" timestamptz NOT NULL DEFAULT now(),
        "revealed_at" timestamptz NULL
      );
    `);

    this.addSql(`
      ALTER TABLE "rps_moves"
        ADD CONSTRAINT "rps_moves_game_fk"
          FOREIGN KEY ("game_id") REFERENCES "rps_games" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
        ADD CONSTRAINT "rps_moves_user_fk"
          FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
    `);

    this.addSql(
      `CREATE UNIQUE INDEX IF NOT EXISTS "rps_moves_game_user_uq" ON "rps_moves" ("game_id","user_id");`,
    );
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "rps_moves";`);
    this.addSql(`DROP TABLE IF EXISTS "rps_games";`);
  }
}
