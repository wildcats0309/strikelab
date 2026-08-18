import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const opponents = sqliteTable("opponents", {
  id: integer("id").primaryKey({ autoIncrement: true }), team: text("team").notNull(),
  seasonPa: integer("season_pa").notNull(), seasonSo: integer("season_so").notNull(),
  vsLPa: integer("vs_l_pa").notNull(), vsLSo: integer("vs_l_so").notNull(),
  vsRPa: integer("vs_r_pa").notNull(), vsRSo: integer("vs_r_so").notNull(),
  last30Pa: integer("last_30_pa").notNull(), last30So: integer("last_30_so").notNull(),
  updatedAt: text("updated_at").notNull(),
}, t => [uniqueIndex("idx_opponents_team").on(t.team)]);

export const pitchers = sqliteTable("pitchers", {
  id: integer("id").primaryKey({ autoIncrement: true }), name: text("name").notNull(), hand: text("hand").notNull(), team: text("team").notNull(),
  tbf: integer("tbf").notNull(), strikeouts: integer("strikeouts").notNull(), bfPerIp: real("bf_per_ip").notNull(), projectedIp: real("projected_ip").notNull(), context: real("context").notNull().default(1), updatedAt: text("updated_at").notNull(),
}, t => [uniqueIndex("idx_pitchers_name").on(t.name)]);

export const games = sqliteTable("games", {
  id: integer("id").primaryKey({ autoIncrement: true }), gameDate: text("game_date").notNull(), awayTeam: text("away_team").notNull(), homeTeam: text("home_team").notNull(), awayPitcher: text("away_pitcher").notNull(), homePitcher: text("home_pitcher").notNull(), kLine: real("k_line").notNull(), overOdds: real("over_odds").notNull(), underOdds: real("under_odds").notNull(), updatedAt: text("updated_at").notNull(),
}, t => [index("idx_games_date").on(t.gameDate)]);
