import { env } from "cloudflare:workers";

export async function ensureSchema() {
  const db = env.DB;
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS opponents (id INTEGER PRIMARY KEY AUTOINCREMENT, team TEXT NOT NULL UNIQUE, season_pa INTEGER NOT NULL, season_so INTEGER NOT NULL, vs_l_pa INTEGER NOT NULL, vs_l_so INTEGER NOT NULL, vs_r_pa INTEGER NOT NULL, vs_r_so INTEGER NOT NULL, last_30_pa INTEGER NOT NULL, last_30_so INTEGER NOT NULL, updated_at TEXT NOT NULL)"),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_opponents_team ON opponents(team)"),
    db.prepare("CREATE TABLE IF NOT EXISTS pitchers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, hand TEXT NOT NULL, team TEXT NOT NULL, tbf INTEGER NOT NULL, strikeouts INTEGER NOT NULL, bf_per_ip REAL NOT NULL, projected_ip REAL NOT NULL, context REAL NOT NULL DEFAULT 1, updated_at TEXT NOT NULL)"),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_pitchers_name ON pitchers(name)"),
    db.prepare("CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, game_date TEXT NOT NULL, away_team TEXT NOT NULL, home_team TEXT NOT NULL, away_pitcher TEXT NOT NULL, home_pitcher TEXT NOT NULL, k_line REAL NOT NULL, over_odds REAL NOT NULL, under_odds REAL NOT NULL, updated_at TEXT NOT NULL)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_games_date ON games(game_date)"),
  ]);
  return db;
}
