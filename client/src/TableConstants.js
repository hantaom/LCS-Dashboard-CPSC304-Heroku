export const CONSTANTS = {
    TABLE_NAMES: ["team", "players", "champion", "game", "game_stats", "player_stats", "team_stats", "plays_in"],
    TABLES: {
        "team": ["team.team_name", "team.head_coach"],
        "players": ["players.pl_name", "players.position", "players.team_name", "players.rating"],
        "champion": ["champion.ch_name", "champion.win_rate", "champion.pick_rate", "champion.ban_rate"],
        "game": ["game.game_id", "game.team_red", "game.team_blue", "game.game_time", "game.result", "game.duration", "game.patch"],
        "game_stats": ["game_stats.game_id", "game_stats.first_blood", "game_stats.total_gold_red", "game_stats.total_gold_blue", "game_stats.total_champ_kill"],
        "player_stats": ["player_stats.pl_name", "player_stats.games_played", "player_stats.cs_per_min", "player_stats.assists", "player_stats.kda", "player_stats.minutes_played", "player_stats.cs_total", "player_stats.kills", "player_stats.deaths", "player_stats.kill_participation"],
        "team_stats": ["team_stats.team_name", "team_stats.games_played", "team_stats.wins", "team_stats.losses", "team_stats.teamkd", "team_stats.total_kills", "team_stats.total_deaths", "team_stats.total_deaths", "team_stats.total_assists", "team_stats.avg_game_time"],
        "plays_in": ["plays_in.game_id", "plays_in.ch_name", "plays_in.pl_name"]
    }
};