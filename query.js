"use strict";
const https = require('https');
const proStatsReq = 'https://api.lolesports.com/api/v2/tournamentPlayerStats?groupName=regular_season&tournamentId=371b5705-3cf9-45fa-944d-88a6d4e83d39';

class QueryHandler {

    constructor(client) {
        this.client = client;
    };

    getRequest(request, port, onResult) {

        let req = port.get(request, function (res) {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            let bodyChunks = [];

            // Buffer the body entirely for processing as a     whole.
            res.on('data', function (chunk) {
                // You can process streamed parts here...
                bodyChunks.push(chunk);
            });

            res.on('end', function () {
                let body = Buffer.concat(bodyChunks);
                // console.log('BODY: ' + body);
                let json = JSON.parse(body.toString());
                // ...and/or process the entire body here.
                onResult(res.statusCode, json)
            });
        });

        req.on('error', function (err) {
            res.send('error: ' + err.message);
        });

        req.end();
    };

    createDeleteQuery() {
        return 'DELETE FROM player_stats; DELETE FROM players';
    };

    createInsertQuery(values) {
        let statColumnQuery =
            `INSERT INTO player_stats`;


        let statValuesQuery = `\nVALUES (
        \'${values["name"]}\',
        ${values["gamesPlayed"]},
        ${values["csPerMin"]},
        ${values["assists"]},
        ${values["kda"]},
        ${values["minutesPlayed"]},
        ${values["cs"]},
        ${values["kills"]},
        ${values["deaths"]},
        ${values["killParticipation"]});\n`;

        let playerColumnQuery =
            `INSERT INTO players`;

        let playerStatQuery = `\nVALUES (
        \'${values["name"]}\',
        \'${values["position"]}\',
        \'${values["teamSlug"]}\');`;

        return  playerColumnQuery + statColumnQuery + statValuesQuery + playerStatQuery;
    };

    executeQuery(query) {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.client.query(query, (err, res) => {
                if (err) {
                    console.log(err);
                    reject (err);
                }
                resolve(res);
            });
        });
    };

    insertQueriesToDB(queries) {
        let that = this;
        queries.forEach((query) => {
            that.executeQuery(query);
        });
    };

    parseToQueries(jsonData, queryParser) {
        let queryArray = [];
        jsonData.stats.forEach((stat) => {
            let query = queryParser(stat);
            queryArray.push(query);
        });

        return queryArray;
    };


    getAndParsePlayerStats() {
        let that = this;
        this.getRequest(proStatsReq, https, function (status, result) {
            let queries = that.parseToQueries(result, that.createInsertQuery);
            that.insertQueriesToDB(queries);
        });
    };

    deleteAllPlayersAndStats() {
        let deleteQuery = this.createDeleteQuery();
        this.executeQuery(deleteQuery);
    };

    updateAndParsePlayerStats() {
        this.deleteAllPlayersAndStats();
        this.getAndParsePlayerStats();

    }

    createTables(client) {
        client.query('CREATE TABLE players (\n' +
            '\tpl_name varchar (30),\n' +
            '\tposition varchar (10),\n' +
            '\tteam_name varchar (30),\n' +
            '\tprimary key (pl_name, team_name)\n' +
            ');', (err, res) => {
            if (err) throw err;
            console.log("holy crap it connected");
            console.log(JSON.stringify(res));
        });

        client.query(`CREATE TABLE player_stats (
            pl_name varchar(30),
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
            );`, (err, res) => {
            if (err) throw err;
            console.log("holy crap it connected");
            console.log(JSON.stringify(res));
        });
    };

}

module.exports = QueryHandler;

