CREATE TABLE `games` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`game_date` text NOT NULL,
	`away_team` text NOT NULL,
	`home_team` text NOT NULL,
	`away_pitcher` text NOT NULL,
	`home_pitcher` text NOT NULL,
	`k_line` real NOT NULL,
	`over_odds` real NOT NULL,
	`under_odds` real NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `opponents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`team` text NOT NULL,
	`season_pa` integer NOT NULL,
	`season_so` integer NOT NULL,
	`vs_l_pa` integer NOT NULL,
	`vs_l_so` integer NOT NULL,
	`vs_r_pa` integer NOT NULL,
	`vs_r_so` integer NOT NULL,
	`last_30_pa` integer NOT NULL,
	`last_30_so` integer NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_opponents_team` ON `opponents` (`team`);--> statement-breakpoint
CREATE TABLE `pitchers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`hand` text NOT NULL,
	`team` text NOT NULL,
	`tbf` integer NOT NULL,
	`strikeouts` integer NOT NULL,
	`bf_per_ip` real NOT NULL,
	`projected_ip` real NOT NULL,
	`context` real DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_pitchers_name` ON `pitchers` (`name`);