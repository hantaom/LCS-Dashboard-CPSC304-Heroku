/*Create the team table*/
create table team (
  team_name varchar(30),
  head_coach varchar(30),
  primary key (team_name)
);
/*Create the players table*/
create table players (
  pl_name varchar(30),
  position varchar(10),
  team_name varchar(30) references team,
  rating int,
  primary key (pl_name)
);
/*Create the champion table*/
create table champion (
  ch_name varchar(30) primary key,
  win_rate float,
  pick_rate float,
  ban_rate float
);
/*Create the game table*/
create table game (
  game_id varchar(50),
  team_red varchar(30) references team,
  team_blue varchar(30) references team,
  game_time int not null,
  result char(1),
  duration int,
  patch float,
  primary key (game_id),
  unique (team_red, team_blue, game_time)
);
/*Create the game_stats table*/
create table game_stats (
  game_id varchar(50) references game on delete cascade,
  first_blood varchar(1),
  total_gold_red int,
  total_gold_blue int,
  total_champ_kill int,
  primary key (game_id)
);
/*Create the player_stats table*/
create table player_stats (
  pl_name varchar(30) references players(pl_name) on delete cascade,
  games_played int,
  cs_per_min int,
  assists int,
  kda float,
  minutes_played int,
  cs_total int,
  kills int,
  deaths int,
  kill_participation float,
  primary key (pl_name)
);
/*Create the team_stats table*/
create table team_stats (
  team_name varchar(30) references team,
  games_played int,
  wins int,
  losses int,
  teamkd int,
  total_kills int,
  total_deaths int,
  total_assists int,
  avg_game_time int,
  primary key (team_name)
);

/*Create the plays_in table*/
create table plays_in (
  game_id varchar(50) references game on delete cascade,
  ch_name varchar(30) references champion(ch_name) on delete cascade,
  pl_name varchar(30) references players(pl_name) on delete cascade,
  primary key (game_id, ch_name, pl_name)
);
/* Insert Statements */
/* Populate the Teams table */
insert into team (team_name, head_coach)
values ('cloud9', 'Reapered');
insert into team (team_name, head_coach)
values ('echo-fox', 'Inero');
insert into team (team_name, head_coach)
values ('team-liquid', 'Locodoco');
insert into team (team_name, head_coach)
values ('100-thieves', 'pro0lly');
insert into team (team_name, head_coach)
values ('clutch-gaming', 'DLim');
insert into team (team_name, head_coach)
values ('team-solomid', 'SSONG');
insert into team (team_name, head_coach)
values ('counter-logic-gaming', 'Zikz');
insert into team (team_name, head_coach)
values ('fly-quest', 'Zikz');
insert into team (team_name, head_coach)
values ('golden-guardians', 'dunno');
insert into team (team_name, head_coach)
values ('optic-gaming', 'forgot');

/* Popululate the players table */
insert into players (pl_name, position, team_name, rating)
values ('Bjergsen', 'mid', 'team-solomid', 8);
insert into players (pl_name, position, team_name, rating)
values ('Hauntzer', 'top', 'team-solomid', 7);
insert into players (pl_name, position, team_name, rating)
values ('Zven', 'adc', 'team-solomid', 7);
insert into players (pl_name, position, team_name, rating)
values ('Mithy', 'support', 'team-solomid', 5);
insert into players (pl_name, position, team_name, rating)
values ('Froggen', 'mid', 'echo-fox', 6);
insert into players (pl_name, position, team_name, rating)
values ('Pobelter', 'mid', 'echo-fox', 5);
insert into players (pl_name, position, team_name, rating)
values ('Jensen', 'mid', 'cloud9', 8);
insert into players (pl_name, position, team_name, rating)
values ('Xmithe', 'jg', 'team-liquid', 7);

/* Populate the Champion Table */
insert into champion (ch_name, win_rate, pick_rate, ban_rate)
values ('Gragas',51.4,31.6,12.9);
insert into champion (ch_name, win_rate, pick_rate, ban_rate)
values ('Varus',46.7,28.8,23.8);
insert into champion (ch_name, win_rate, pick_rate, ban_rate)
values ('Ashe',49.8,27.5,12.2);
insert into champion (ch_name, win_rate, pick_rate, ban_rate)
values ('Orianna',52.7,24.8,21.9);
insert into champion (ch_name, win_rate, pick_rate, ban_rate)
values ('Karma',45.0,23.6,13.1);
insert into champion (ch_name, win_rate, pick_rate, ban_rate)
values ('Gnar',44.0,21.2,9.1);
insert into champion (ch_name, win_rate, pick_rate, ban_rate)
values ('Anivia',42.1,14.2,24.1);
insert into champion (ch_name, win_rate, pick_rate, ban_rate)
values ('Corki',41.2,13,3.2);
insert into champion (ch_name, win_rate, pick_rate, ban_rate)
values ('Ryze',47.7,32.1,34.6);

/* Populate the game table */
insert into game (game_id,team_red,team_blue,game_time,result,duration,patch)
values ('1','team-solomid','team-liquid',090517,'B',1680000,8.3);
insert into game (game_id,team_red,team_blue,game_time,result,duration,patch)
values ('2','echo-fox','100-thieves',110217,'R',1800000,8.3);
insert into game (game_id,team_red,team_blue,game_time,result,duration,patch)
values ('3','team-liquid','clutch-gaming',100117,'B',17830000,8.3);
insert into game (game_id,team_red,team_blue,game_time,result,duration,patch)
values ('4','cloud9','echo-fox',120617,'B',3188000,8.3);
insert into game (game_id,team_red,team_blue,game_time,result,duration,patch)
values ('5','team-solomid','counter-logic-gaming',090517,'B',1380000,8.3);
insert into game (game_id,team_red,team_blue,game_time,result,duration,patch)
values ('6','fly-quest','golden-guardians',121517,'R',1400000,8.4);
insert into game (game_id,team_red,team_blue,game_time,result,duration,patch)
values ('7','clutch-gaming','fly-quest',121617,'B',1000000,8.4);
insert into game (game_id,team_red,team_blue,game_time,result,duration,patch)
values ('8','team-solomid','clutch-gaming',121617,'R',1200000,8.4);

/* Popululate the game_stats table */
insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
values ('1', 'R', 60000, 70000, 15);
insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
values ('2', 'R', 45057, 40587, 20);
insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
values ('3', 'B', 80000, 86789, 23);
insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
values ('4', 'B', 239485, 200000, 42);
insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
values ('5', 'R', 100000, 100000, 10);
insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
values ('6', 'B', 300000, 280000, 30);
insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
values ('7', 'R', 101000, 91000, 50);
insert into game_stats (game_id,first_blood,total_gold_red,total_gold_blue,total_champ_kill)
values ('8', 'B', 89000, 89000, 29);

/* Populate the plays_in table */
insert into plays_in (game_id, ch_name, pl_name)
values ('1', 'Gnar', 'Hauntzer');
insert into plays_in (game_id, ch_name, pl_name)
values ('2', 'Anivia', 'Froggen');
insert into plays_in (game_id, ch_name, pl_name)
values ('3', 'Corki', 'Pobelter');
insert into plays_in (game_id, ch_name, pl_name)
values ('4', 'Ryze', 'Jensen');
insert into plays_in (game_id, ch_name, pl_name)
values ('5', 'Anivia', 'Bjergsen');
insert into plays_in (game_id, ch_name, pl_name)
values ('6', 'Varus', 'Zven');
insert into plays_in (game_id, ch_name, pl_name)
values ('6', 'Karma', 'Mithy');
insert into plays_in (game_id, ch_name, pl_name)
values ('7', 'Orianna', 'Bjergsen');
insert into plays_in (game_id, ch_name, pl_name)
values ('8', 'Gragas', 'Xmithe');

/* Populate the player_stats table */
insert into player_stats (pl_name, games_played, cs_per_min, assists, kda, minutes_played, cs_total, kills, deaths, kill_participation)
values ('Bjergsen', 18, 11, 9, 6.2, 940, 1200, 900, 300, 0.8);
insert into player_stats (pl_name, games_played, cs_per_min, assists, kda, minutes_played, cs_total, kills, deaths, kill_participation)
values ('Hauntzer', 18, 9, 7, 3.4, 940, 1000, 800, 450, 0.7);
insert into player_stats (pl_name, games_played, cs_per_min, assists, kda, minutes_played, cs_total, kills, deaths, kill_participation)
values ('Zven', 14, 13, 6, 8, 780, 1504, 1100, 120, 0.7);
insert into player_stats (pl_name, games_played, cs_per_min, assists, kda, minutes_played, cs_total, kills, deaths, kill_participation)
values ('Mithy', 13, 1, 20, 4.5, 780, 400, 200, 470, 1);
insert into player_stats (pl_name, games_played, cs_per_min, assists, kda, minutes_played, cs_total, kills, deaths, kill_participation)
values ('Froggen', 0, 12, 6, 5.6, 0, 1600, 450, 200, 0.4);
insert into player_stats (pl_name, games_played, cs_per_min, assists, kda, minutes_played, cs_total, kills, deaths, kill_participation)
values ('Pobelter', 14, 8, 5, 3.1, 600, 990, 600, 550, 0.5);
insert into player_stats (pl_name, games_played, cs_per_min, assists, kda, minutes_played, cs_total, kills, deaths, kill_participation)
values ('Jensen', 12, 13, 8, 5.6, 980, 1450, 820, 230, 0.7);
insert into player_stats (pl_name, games_played, cs_per_min, assists, kda, minutes_played, cs_total, kills, deaths, kill_participation)
values ('Xmithe', 15, 6, 13, 2.5, 930, 780, 350, 460, 0.9);

/* populate the team_stats table */
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('cloud9', 8, 7, 1, 38.9, 105, 72, 1.46);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('100-thieves',	19,	13,	6,	1.24,	192, 155, 300);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('clutch-gaming',	20,	11,	9,	1.14,	171,	150, 200);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('counter-logic-gaming',	18,	7,	11,	0.89,	188,	212, 500);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('echo-fox',	19,	12,	7,	1.15,	243,	212, 123);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('fly-quest',	18,	6,	12,	0.72,	156,	217, 45);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('golden-guardians',	18,	4,	14,	0.71,	156,	219, 984);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('optic-gaming',	18,	5,	13,	0.78,	154,	198, 84);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('team-liquid',	20,	12,	8,	1.14,	190,	166, 0);
insert into team_stats (team_name, games_played, wins, losses, teamkd, total_kills, total_deaths, total_assists)
values ('team-solomid',	20,	13,	7,	1.42,	219,	154, 200);

