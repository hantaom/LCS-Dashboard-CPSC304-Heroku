import React from "react";
import {CONSTANTS} from "../TableConstants";
import request from "superagent";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class Division extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			tables: {},
			modal: false,
			query: '',
			//selected are selected&&shown, others are selected
			divisorTables: {selected: []}, 
			dividendTables: {selected: []},
			divisorColumns: {selected: []},
			dividendColumns: {selected: []},
			mode: "null"
		}
		let tables = this.state.tables;
		tables["team"] = {attr: ["team_name","head_coach"]};
		tables["players"] = {attr: ["pl_name","position","team_name","rating"]};
		tables["champion"] = {attr: ["ch_name","win_rate","pick_rate","ban_rate"]};
		tables["game"] = {attr: ["game_id","team_red","team_blue","game_time","result","duration","patch"]};
		tables["game_stats"] = {attr: ["game_id","first_blood","total_gold_red","total_gold_blue","total_champ_kill"]};
		tables["player_stats"]= {attr: ["pl_name","games_played","cs_per_min","assists","kda","minutes_played","cs_total","kills","deaths","kill_participation"]};
		tables["team_stats"] = {attr: ["team_name","games_played","wins","total_deaths","total_assists","avg_game_time"]};
		tables["plays_in"] = {attr: ["game_id","ch_name","pl_name"]};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.buildQuery = this.buildQuery.bind(this);
		this.buildDivisorClause = this.buildDivisorClause.bind(this);
		this.handleDivisorTableChanges = this.handleDivisorTableChanges.bind(this);
		this.handleDivisorColumnChanges = this.handleDivisorColumnChanges.bind(this);
		this.handleDividendTableChanges = this.handleDividendTableChanges.bind(this);
		this.handleDividendColumnChanges = this.handleDividendColumnChanges.bind(this);
		this.handleModeChanges = this.handleModeChanges.bind(this);
		this.createTableOptions = this.createTableOptions.bind(this);
		this.createDivisorColumnOptions = this.createDivisorColumnOptions.bind(this);
		this.createDividendColumnOptions = this.createDividendColumnOptions.bind(this);
		this.toggle = this.toggle.bind(this);
	}

	handleSubmit(event) {
		let queryString = this.buildQuery();
		if (queryString === undefined) {
			queryString = "SELECT * FROM PLAYERS;";
		}
		console.log(queryString);
		let that = this;
        that.props.sendRequest(queryString, this)
            .then(function(res) {
				that.setState({
					queryResults: res,
					headerNames: that.state.dividendColumns.current,
					query: queryString
				});
			});
		event.preventDefault();
	}
	buildQuery() {
		let { dividendTables,divisorTables,dividendColumns,divisorColumns,mode } = this.state;
		if (dividendTables.length <= 0) {
			alert("Choose a table to divide from!");
			return;
		}
		if (divisorTables.length <= 0) {
			alert("Choose a table to divide with!");
			return;
		}
		if (dividendColumns.length < divisorColumns.length) {
			alert("Primary table cannot have less attributes than secondary table!");
			return;
		}
		let divisorClause = this.buildDivisorClause(); //select+from+where
		let selectClause = "select distinct ";
		let fromClause = "from ";
		let selectAppended = false;
		let fromAppended = false;
		for (let table in dividendTables) {
			if (table !== "selected") {
				if (fromAppended) {
					fromClause = fromClause + ",";
				}
				fromClause = fromClause + table + " ";
				fromAppended = true;
			}
		}
		selectAppended = false;
		for (let attribute in dividendColumns) {
			if (attribute !== undefined && attribute !== "selected") {
				if (selectAppended) {
					selectClause = selectClause + ",";
				}
				selectClause = selectClause + attribute + " ";
				selectAppended = true;
			}
		}
		let queryString = selectClause + fromClause + "where not exists (";
		if (mode === "null") {
			return;
		}
		if (mode === "all") {
			let newSelectClause = "select ";
			let appended = false;
			for (let aSec in divisorColumns) {
				if (aSec == null || aSec === "selected") {
					continue;
				}
				let aSecAttr = aSec.split(".")[1];
				for (let aPri in dividendColumns) {
					if (aPri == null || aPri === "selected") {
						continue;
					}
					let aPriAttr = aPri.split(".")[1];
					if (aSecAttr === aPriAttr
						||
					   (aSecAttr.includes("team") && aPriAttr.includes("team"))
					) {
						if (appended) {
							newSelectClause = newSelectClause + ",";
						}
						newSelectClause = newSelectClause + aPriAttr + " ";
						appended = true;
					}
				}
			}
			if (appended) {
				queryString = queryString + newSelectClause + fromClause + "except ";
			}
		}
		let divisorClauseString = divisorClause.selectClause + divisorClause.fromClause + divisorClause.whereClause;
		queryString = queryString + divisorClauseString + ");"
		return queryString;
	}
	buildDivisorClause() {
		let { divisorTables,divisorColumns,dividendColumns } = this.state;
		let selectClause = "select distinct ";
		let fromClause = "from ";
		let whereClause = "where ";
		
		let fromAppended = false;
		for (let table in divisorTables) {
			if (table == null || table === "selected") {
				continue;
			}
			if (fromAppended) {
				fromClause = fromClause + ",";
			}
			fromClause = fromClause + table + " ";
			fromAppended = true;
		}
		let appended = false;
		for (let aSec in divisorColumns) {
			if (aSec == null || aSec === "selected") {
				continue;
			}
			for (let aPri in dividendColumns) {
				if (aPri == null || aPri === "selected") {
					continue;
				}
				//if divisor and dividend has common attribute
				let aSecAttr = aSec.split(".")[1];
				let aPriAttr = aPri.split(".")[1];
				if (aSecAttr === aPriAttr
					||
				   (aSecAttr.includes("team") && aPriAttr.includes("team"))
				) {
					if (appended) {
						whereClause = whereClause + "and ";
						selectClause = selectClause + ",";
					}
					whereClause = whereClause + aSec+"="+aPri;
					selectClause = selectClause + aSec + " ";
					appended = true;
				}
			}
		}
		if (appended === false) {
			selectClause = "";
			fromClause = "";
			whereClause = "";
		}
		return { selectClause, fromClause, whereClause };
	}

	handleDividendTableChanges(event) {
		const { value } = event.target;
		const newTables = this.state.dividendTables;
		const newColumns = this.state.dividendColumns;
		let index = newTables.selected.indexOf(value);
		if (index > -1) {
			delete newTables[value];
			delete newTables.selected[index];
			newColumns.selected.filter((e1) => {
				return e1.split(".")[0] !== value;
			});
			for (let key in newColumns) {
				if (key === "selected" || key == null) {
					continue;
				}
				if (key.split(".")[0] === value) {
					delete newColumns[key];
				}
			}
		} else {
			newTables.selected.push(value);
			newTables[value] = value;
		}
		console.log(newTables);
		console.log(newColumns);
		this.setState({dividendTables: newTables, dividendColumns: newColumns});
	}
	handleDivisorTableChanges(event) {
		const { value } = event.target;
		const newTables = this.state.divisorTables;
		const newColumns = this.state.divisorColumns;
		let index = newTables.selected.indexOf(value);
		if (index > -1) {
			delete newTables[value];
			delete newTables.selected[index];
			newColumns.selected.filter((e1) => {
				return e1.split(".")[0] !== value;
			});
			for (let key in newColumns) {
				if (key === "selected" || key == null) {
					continue;
				}
				if (key.split(".")[0] === value) {
					delete newColumns[key];
				}
			}
		} else {
			newTables.selected.push(value);
			newTables[value] = value;
		}
		console.log(newTables);
		console.log(newColumns);
		this.setState({divisorTables: newTables, divisorColumns: newColumns});
	}
	handleDividendColumnChanges(event) {
		const { value } = event.target;
		//value is "table.attribute"
		const newColumns = this.state.dividendColumns;
		let index = newColumns.selected.indexOf(value);
		if (index > -1) {
			delete newColumns[value];
			delete newColumns.selected[index];
		} else {
			newColumns.selected.push(value);
			newColumns[value] = value;
		}
		console.log(newColumns);
		this.setState({dividendColumns: newColumns});
	}
	handleDivisorColumnChanges(event) {
		const { value } = event.target;
		//value is "table.attribute"
		const newColumns = this.state.divisorColumns;
		let index = newColumns.selected.indexOf(value);
		if (index > -1) {
			delete newColumns[value];
			delete newColumns.selected[index];
		} else {
			newColumns.selected.push(value);
			newColumns[value] = value;
		}
		console.log(newColumns);
		this.setState({divisorColumns: newColumns});
	}
	handleModeChanges(event) {
		console.log(event.target.value);
		this.setState({mode: event.target.value});
	}

	createTableOptions() {
		let items = [];
		let { tables } = this.state;
		for (let value in tables) {
			items.push(<option value={value}>{value}</option>);
		}
		return items;
	}
	createDividendColumnOptions() {
		let items = [];
		let { dividendTables,dividendColumns,tables } = this.state;
		const newTables = dividendTables;
		const newColumns = dividendColumns;
		for (let i = 0; i < newTables.selected.length; i++) {
			let table = newTables.selected[i];
			if (table == null) {
				continue;
			}
			const array = tables[table].attr;
			for (let j = 0; j < array.length; j++) {
				let attribute = array[j];
				attribute = table + "." + attribute;
				items.push(<option key={attribute+".dividend"} value={attribute}>{attribute}</option>);
			}
		}
		return items;
	}
	createDivisorColumnOptions() {
		let items = [];
		let { divisorTables,divisorColumns,tables } = this.state;
		const newTables = divisorTables;
		const newColumns = divisorColumns;
		for (let i = 0; i < newTables.selected.length; i++) {
			let table = newTables.selected[i];
			if (table == null) {
				continue;
			}
			const array = tables[table].attr;
			for (let j = 0; j < array.length; j++) {
				let attribute = array[j];
				attribute = table + "." + attribute;
				items.push(<option key={attribute+".divisor"} value={attribute}>{attribute}</option>);
			}
		}
		return items;
	}
	createModeOptions() {
		let items = [];
		items.push(<option key="null" value="null"></option>);
		items.push(<option key="all" value="all">all of</option>);
		items.push(<option key="none" value="none">none of</option>);
		return items;
	}

    clearColumns(){
        console.log(this.state.displaySelectedColumns);
        this.state.displaySelectedColumns = [];
        console.log("clear columns");
        console.log(this.state.displaySelectedColumns);
        this.state.selectedColumns = [];
        console.log(this.state.selectedColumns);
    }

	toggle() {
		this.setState({
			modal: !this.state.modal
		});
	}
	  

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					<header>From</header>
					<select
					  multiple={true}
					  value={this.state.dividendTables.selected}
					  onChange={this.handleDividendTableChanges}
					>
						{this.createTableOptions()}
					</select>
					<select
					  multiple={true}
					  value={this.state.dividendColumns.selected}
					  onChange={this.handleDividendColumnChanges}
					>
						{this.createDividendColumnOptions()}
					</select>
				</label>
				<br/>
				<br/>
				<label>
					<header>that corresponds to</header>
					<select
					  multiple={false}
					  value={this.state.mode}
					  onChange={this.handleModeChanges}
					>
						{this.createModeOptions()}
					</select>
				</label>
				<br/>
				<br/>
				<label>
					<header>the table below</header>
					<select
					  multiple={true}
					  value={this.state.divisorTables.selected}
					  onChange={this.handleDivisorTableChanges}
					>
						{this.createTableOptions()}
					</select>
					<select
					  multiple={true}
					  value={this.state.divisorColumns.selected}
					  onChange={this.handleDivisorColumnChanges}
					>
						{this.createDivisorColumnOptions()}
					</select>
				</label>
				<br/>
				<Button type="submit" color="success">Generate Query</Button>
				<br/>
				<div>
					<Modal
					  isOpen={this.state.modal}
					  toggle={this.toggle}
					  className={this.props.className}>
                    				<ModalHeader toggle={this.toggle}>Your Query:</ModalHeader>
						<ModalBody>
							{this.state.query}
						</ModalBody>
						<ModalFooter>
							<Button
							  color="primary"
							  onClick={this.toggle}>
								Ok!
							</Button>
						</ModalFooter>
					</Modal>
				</div>
				<br/>
			</form>
		);
	}
}
