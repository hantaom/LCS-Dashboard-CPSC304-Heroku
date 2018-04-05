import React from "react";
import {CONSTANTS} from "../TableConstants";
import './Login.css';
import request from 'superagent';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

export default class Selection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tableNames: {selected: []},
            selectedColumns: {selected: []},
            joinOptions: {selected: []},
            displayColumns: [],
            selectedTable: '',
            query: '',
            modal: false,
            whereFormStates: []
            /*
                whereFormStates[i] = {
                conjunction: conjunction,
                selectedColumn: "",
                selectedCondition: "",
                inputtedValue: ""
                };
            */
        }

        // Bind this to the function you need
        this.handleTableChanges = this.handleTableChanges.bind(this);
        this.handleColumnChanges = this.handleColumnChanges.bind(this);
        this.handleJoinChanges = this.handleJoinChanges.bind(this);
        this.createColumnOptions = this.createColumnOptions.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    // Functions for handling the state changes
    // #######################################################################################
    handleTableChanges(event) {
        const newTables = this.state.tableNames;
        let selected = [];
        if (newTables.hasOwnProperty(event.target.value)) {
            delete newTables[event.target.value];
        } else {
            if (!newTables.hasOwnProperty(event.target.value)) {
                newTables[event.target.value] = event.target.value;
            }
        }
        for (var key in newTables) {
            if (newTables.hasOwnProperty(key) && key !== "selected") {
                selected.push(key);
            }
        }
        let tableSelected = event.target.value;
        this.state.tableNames.selected = selected;
        this.setState({selectedTable: tableSelected, tableNames: newTables});
    }

    handleColumnChanges(event) {
        const newColumns = this.state.selectedColumns;
        let selected = [];
        if (newColumns.hasOwnProperty(event.target.value)) {
            delete newColumns[event.target.value];
        } else {
            if (!newColumns.hasOwnProperty(event.target.value)) {
                newColumns[event.target.value] = event.target.value;
            }
        }
        for (var key in newColumns) {
            if (newColumns.hasOwnProperty(key) && key !== "selected") {
                selected.push(key);
            }
        }
        this.state.selectedColumns.selected = selected;
        this.setState({selectedColumns: newColumns});
    }

    handleWhereColumnStates(event) {
        let value = event.target.value;
        let id = event.target.id;
        let whereFormStates = this.state.whereFormStates;
        let state = whereFormStates[id];

        state.selectedCondition = value;

        whereFormStates[id] = state;

        this.setState({whereFormStates: whereFormStates});

        // let newColumnsArray = this.columnChangeHelper(newColumns, eventValue);
    }

    handleWhereColumnChanges(event) {
        let value = event.target.value;
        let id = event.target.id;
        let whereFormStates = this.state.whereFormStates;
        let state = whereFormStates[id];

        state.selectedColumn = value;
        this.setState({whereFormStates: whereFormStates});

    }

    handleWhereInputChanges(event) {
        let value = event.target.value;
        let id = event.target.id;
        let whereFormStates = this.state.whereFormStates;
        let state = whereFormStates[id];

        state.inputtedValue = value;
        this.setState({whereFormStates: whereFormStates});
    }

    handleJoinChanges(event) {
        const newJoinChanges = this.state.joinOptions;
        let selected = [];
        if (newJoinChanges.hasOwnProperty(event.target.value)) {
            delete newJoinChanges[event.target.value];
        } else {
            if (!newJoinChanges.hasOwnProperty(event.target.value)) {
                newJoinChanges[event.target.value] = event.target.value;
            }
        }
        for (var key in newJoinChanges) {
            if (newJoinChanges.hasOwnProperty(key) && key !== "selected") {
                selected.push(key);
            }
        }
        this.state.joinOptions.selected = selected;
        this.setState({joinOptions: newJoinChanges});
    }

    // #######################################################################################

    handleSubmit(event) {
        let query_tables = this.state.tableNames.selected;
        let query_columns = this.state.selectedColumns.selected;
        let query_joins = this.state.joinOptions.selected;
        let query_filters = this.state.whereFormStates;
        let queryString = 'SELECT ';
        // Generate the SELECT part of the query string
        if (query_columns.length > 0) {
            for (let i = 0; i <= query_columns.length - 1; i++) {
                if (i === query_columns.length - 1) {
                    queryString = queryString + query_columns[i] + ' ';
                } else {
                    queryString = queryString + query_columns[i] + ", ";
                }
            }
        }
        // Generate the "FROM" part of the query string
        if (query_tables.length > 0) {
            queryString = queryString + "FROM ";
            for (let i = 0; i <= query_tables.length - 1; i++) {
                if (i === 0) {
                    queryString = queryString + query_tables[i] + ' ';
                } else {
                    queryString = queryString + "INNER JOIN " + query_tables[i] + ' ';
                }
            }
        }
        // Generate the INNER JOIN part of the query string
        if (query_joins.length > 0) {
            queryString = queryString + "ON ";
            for (let i = 0; i <= query_joins.length - 1; i++) {
                if (i === 0) {
                    queryString = queryString + query_joins[i];
                }
            }
        }
        // Generate the WHERE part of the query string
        if (query_filters.length > 0) {
            queryString = queryString + " WHERE ";
            for (let i = 0; i <= query_filters.length - 1; i++) {
                if (i === 0) {
                    let conj = query_filters[i].conjunction;
                    let column = query_filters[i].selectedColumn;
                    let op = query_filters[i].selectedCondition;
                    let value = "\'" + query_filters[i].inputtedValue + "\'";
                    let filter = column + " " + op + " " + value;
                    queryString = queryString + filter;
                } else {
                    let conj = query_filters[i].conjunction;
                    let column = query_filters[i].selectedColumn;
                    let op = query_filters[i].selectedCondition;
                    let value = "\'" + query_filters[i].inputtedValue + "\'";
                    let filter = " " + conj + " " + column + " " + op + " " + value;
                    queryString = queryString + filter;
                }
            }
        }
        // Append ending of query
        queryString = queryString + ";";
        console.log(queryString);
        // Make the post request
        let that = this;
        that.props.sendRequest(queryString, this)
            .then(function(res) {
                that.setState({
                    queryResults: res,
                    headerNames: that.state.displaySelectedColumns,
                    query: queryString
                });
            });
        event.preventDefault();
    }

    // Code that fills what is inside the selection boxes
    // #######################################################################################
    createTableOptions() {
        let items = [];
        let tables = ["team", "players", "champion", "game", "game_stats", "player_stats", "team_stats", "plays_in"];
        for (let i = 0; i <= tables.length - 1; i++) {
            // Dynamically set the options for tables 
            items.push(<option key={i} value={tables[i]}>{tables[i]}</option>);
        }
        return items;
    }

    createColumnOptions() {
        let items = [];
        let columns = this.state.displayColumns;
        let selectedTable = this.state.tableNames;
        if (selectedTable.hasOwnProperty("team")) {
            columns = columns.concat(["team.team_name", "team.head_coach"]);
        } else {
            let toRemove = ["team.team_name", "team.head_coach"];
            if (columns.length > 1) {
                columns = columns.filter(function (el) {
                    return !toRemove.includes(el);
                });
            }
        }
        if (selectedTable.hasOwnProperty("players")) {
            columns = columns.concat(["players.pl_name", "players.position", "players.team_name", "players.rating"]);
        } else {
            let toRemove = ["players.pl_name", "players.position", "players.team_name", "players.rating"];
            if (columns.length > 1) {
                columns = columns.filter(function (el) {
                    return toRemove.indexOf(el) < 0;
                });
            }
        }
        if (selectedTable.hasOwnProperty("champion")) {
            columns = columns.concat(["champion.ch_name", "champion.win_rate", "champion.pick_rate", "champion.ban_rate"]);
        } else {
            let toRemove = ["champion.ch_name", "champion.win_rate", "champion.pick_rate", "champion.ban_rate"];
            columns = columns.filter(function (el) {
                return toRemove.indexOf(el) < 0;
            });
        }
        if (selectedTable.hasOwnProperty("game")) {
            columns = columns.concat(["game.game_id", "game.team_red", "game.team_blue", "game.game_time", "game.result", "game.duration", "game.patch"]);
        } else {
            let toRemove = ["game.game_id", "game.team_red", "game.team_blue", "game.game_time", "game.result", "game.duration", "game.patch"];
            columns = columns.filter(function (el) {
                return toRemove.indexOf(el) < 0;
            });
        }
        if (selectedTable.hasOwnProperty("game_stats")) {
            columns = columns.concat(["game_stats.game_id", "game_stats.first_blood", "game_stats.total_gold_red", "game_stats.total_gold_blue", "game_stats.total_champ_kill"]);
        } else {
            let toRemove = ["game_stats.game_id", "game_stats.first_blood", "game_stats.total_gold_red", "game_stats.total_gold_blue", "game_stats.total_champ_kill"];
            columns = columns.filter(function (el) {
                return toRemove.indexOf(el) < 0;
            });
        }
        if (selectedTable.hasOwnProperty("player_stats")) {
            columns = columns.concat(["player_stats.pl_name", "player_stats.games_played", "player_stats.cs_per_min", "player_stats.assists", "player_stats.kda", "player_stats.minutes_played", "player_stats.cs_total", "player_stats.kills", "player_stats.deaths", "player_stats.kill_participation"]);
        } else {
            let toRemove = ["player_stats.pl_name", "player_stats.games_played", "player_stats.cs_per_min", "player_stats.assists", "player_stats.kda", "player_stats.minutes_played", "player_stats.cs_total", "player_stats.kills", "player_stats.deaths", "player_stats.kill_participation"];
            columns = columns.filter(function (el) {
                return toRemove.indexOf(el) < 0;
            });
        }
        if (selectedTable.hasOwnProperty("team_stats")) {
            columns = columns.concat(["team_stats.team_name", "team_stats.games_played", "team_stats.wins", "team_stats.losses", "team_stats.teamkd", "team_stats.total_kills", "team_stats.total_deaths", "team_stats.total_deaths", "team_stats.total_assists", "team_stats.avg_game_time"]);
        } else {
            let toRemove = ["team_stats.team_name", "team_stats.games_played", "team_stats.wins", "team_stats.losses", "team_stats.teamkd", "team_stats.total_kills", "team_stats.total_deaths", "team_stats.total_deaths", "team_stats.total_assists", "team_stats.avg_game_time"];
            columns = columns.filter(function (el) {
                return toRemove.indexOf(el) < 0;
            });
        }
        if (selectedTable.hasOwnProperty("plays_in")) {
            columns = columns.concat(["plays_in.game_id", "plays_in.ch_name", "plays_in.pl_name"]);
        } else {
            let toRemove = ["plays_in.game_id", "plays_in.ch_name", "plays_in.pl_name"]
            columns = columns.filter(function (el) {
                return toRemove.indexOf(el) < 0;
            });
        }

        // Add the SELECT * option
        if (!columns.includes("*")) {
            columns.push("*");
        }

        for (let i = 0; i <= columns.length - 1; i++) {
            items.push(<option key={i} value={columns[i]}>{columns[i]}</option>);
        }
        return items;
    }

    createJoinOptions() {
        let items = [];
        let joinFilters = [];
        if (this.state.tableNames.selected.length > 1) {
            let t1 = this.state.tableNames.selected[0];
            let t1_columns = CONSTANTS.TABLES[t1];
            let t2 = this.state.tableNames.selected[1];
            let t2_columns = CONSTANTS.TABLES[t2];
            for (let i = 0; i <= t1_columns.length - 1; i++) {
                let columnName_T1 = t1_columns[i].split(".")[1];
                // console.log(columnName_T1);
                for (let j = 0; j <= t2_columns.length - 1; j++) {
                    let columnName_T2 = t2_columns[j].split(".")[1];
                    if (columnName_T1 === columnName_T2) {
                        joinFilters.push(t1_columns[i] + "=" + t2_columns[j])
                    }
                }
            }
        }
        for (let i = 0; i <= joinFilters.length - 1; i++) {
            // Dynamically set the options for tables 
            items.push(<option key={i} value={joinFilters[i]}>{joinFilters[i]}</option>);
        }
        return items;
    }

    deleteWhereOption(event) {
        let forms = this.state.whereFormStates;
        let id = event.target.id;
        forms.splice(id, 1);
        this.setState({whereFormStates: forms});
    }

    createWhereOption(event) {
        let newWhereForm = this.state.whereFormStates;
        let conjunction = event.target.value;
        let i = newWhereForm.length;

        if (i === 0) {
            conjunction = "";
        }

        newWhereForm[i] = {
            conjunction: conjunction,
            selectedColumn: "",
            selectedCondition: "",
            inputtedValue: ""
        };

        this.setState({whereFormStates: newWhereForm});
    }

    clearColumns() {
        console.log(this.state.displayColumns);
        this.setState(this.state.displayColumns = []);
        console.log("clear columns");
        console.log(this.state.displayColumns);
        this.setState(this.state.selectedColumns = {selected:[]});
        console.log(this.state.selectedColumns);
        this.setState(this.state.joinOptions = {selected:[]})
        this.setState(this.state.tableNames = {selected:[]})
    }


    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    // #######################################################################################


    render() {
        const button = this.state.whereFormStates.length > 0 ? (
            <div>
                <Button type="button" outline color="secondary" value="AND" onClick={this.createWhereOption.bind(this)}>Add
                    AND condition</Button>
                <Button type="button" outline color="secondary" value="OR" onClick={this.createWhereOption.bind(this)}>Add
                    OR condition</Button>
            </div>
        ) : (
            <Button type="button" color="primary" value="OR" onClick={this.createWhereOption.bind(this)}>Add
                Condition</Button>
        );
        const join_list = this.createJoinOptions();
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    <header>Table:</header>
                    <select multiple={true} value={this.state.tableNames.selected} onChange={this.handleTableChanges}>
                        {this.createTableOptions()}
                    </select>
                </label>
                <br/>
                {this.state.selectedTable !== '' &&
                <label>
                    <header>Please select your columns:</header>
                    <select multiple={true} value={this.state.selectedColumns.selected}
                            onChange={this.handleColumnChanges}>
                        {this.createColumnOptions()}
                    </select>
                    <br/>
                    <br/>
                </label>
                }
                <br/>
                {join_list.length > 0 &&
                <label>
                    <header>Please select the join condition:</header>
                    <select multiple={true} value={this.state.joinOptions.selected} onChange={this.handleJoinChanges}>
                        {this.createJoinOptions()}
                    </select>
                </label>
                }
                <br/>
                {this.state.whereFormStates.length > 0 &&
                <label>
                    <h5>Add your conditions:</h5>
                    {this.state.whereFormStates.map((formState, i) => (
                        <div className="whereClauses" id={i}>
                            <div>{formState.conjunction}</div>
                            <select id={i} value={formState.selectedColumn}
                                    onChange={this.handleWhereColumnChanges.bind(this)}>
                                {this.createColumnOptions()}
                            </select>
                            <select id={i} value={formState.selectedCondition}
                                    onChange={this.handleWhereColumnStates.bind(this)}>
                                <option key="lt" value="<">Less</option>
                                <option key="gt" value=">">Greater</option>
                                <option key="eq" value="=">Equal</option>
                                <option key="leq" value="<=">LessEq</option>
                                <option key="geq" value=">=">GreaterEq</option>
                            </select>
                            <input id={i} type="text" value={formState.inputtedValue}
                                   onChange={this.handleWhereInputChanges.bind(this)}/>
                            <Button color="danger" size="sm" type="button" value="delete" id={i}
                                    onClick={this.deleteWhereOption.bind(this)}>Delete
                            </Button>

                        </div>))}
                </label>
                }
                <br/>
                {this.state.selectedTable !== '' && <Button type="button" color="secondary" value="CLEAR DATA" onClick={this.clearColumns.bind(this)}>Clear
                        Data
                    </Button>
                }
                <br/>
                <br/>
                {button}
                <Button type="submit" color="success">Generate Query</Button>
                <br/>
                <div>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>Your Query: </ModalHeader>
                        <ModalBody>
                            {this.state.query}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.toggle}>Ok!</Button>
                        </ModalFooter>
                    </Modal>
                </div>
                <br/>
            </form>
        );
    }
}