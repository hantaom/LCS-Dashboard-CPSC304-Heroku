import React from "react";
import request from "superagent";
import {CONSTANTS} from "../TableConstants";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class Selection extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedColumns: {},
            selectedTable: '',
            modal: false,
            query: '',
            displayColumns: [],

            displaySelectedColumns: [],

            whereFormStates: []
            /*
             whereFormStates[i] = {
                conjunction: conjunction,
                selectedColumn: "",
                selectedCondition: "",
                inputtedValue: ""
                };
             */
        };

        // Bind this to the function you need
        this.handleTableChanges = this.handleTableChanges.bind(this);
        this.handleColumnChanges = this.handleColumnChanges.bind(this);
        this.createColumnOptions = this.createColumnOptions.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggle = this.toggle.bind(this);
    };
    componentDidMount(){

    }

    /* HANDLE FUNCTIONS */

    handleSubmit(event) {
        let that = this;
        let queryString = that.buildQuery();
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

    handleTableChanges(event) {
        let tableSelected = event.target.value;
        this.setState({
            selectedTable: tableSelected,
            selectedColumns: {},
            displayColumns: [],
            displaySelectedColumns: []
        });
    }

    handleColumnChanges(event) {
        let newColumns = this.state.selectedColumns;
        let eventValue = event.target.value;

        let newColumnsArray = this.columnChangeHelper(newColumns, eventValue);

        this.setState({displaySelectedColumns: newColumnsArray});
    }

    columnChangeHelper(newColumns, eventValue) {
        if (newColumns[eventValue]) {
            delete newColumns[eventValue];
        } else {
            newColumns[eventValue] = eventValue;
        }

        let newColumnsArray = [];

        Object.keys(newColumns).forEach(key => {
            newColumnsArray.push(newColumns[key]);
        });

        return newColumnsArray;
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

    deleteWhereOption(event) {
        let forms = this.state.whereFormStates;
        let id = event.target.id;
        forms.splice(id, 1);
        this.setState({whereFormStates: forms});
    }

    buildQuery() {
        let selectedTable = this.state.selectedTable;
        let selectedColumns = this.state.displaySelectedColumns.toString();
        let whereQuery = this.state.whereFormStates;
        let WHERE = "";

        whereQuery.map((query, i) => {
            if (i !== 0) {
                WHERE += " " + query.conjunction
            }

            WHERE += " " + query.selectedColumn + " " + query.selectedCondition + " " + "\'" + query.inputtedValue + "\'";

        });

        selectedColumns = selectedColumns.length > 0 ? selectedColumns : '*';

        let query = `SELECT ${selectedColumns} FROM ${selectedTable}`;

        if (WHERE !== "") {
            query += " WHERE" + WHERE;
        }

        console.log(query);

        return query + ";";
    };


    /* CREATE OPTIONS */

    createTableOptions() {
        let items = [];
        let tables = CONSTANTS.TABLE_NAMES;

        tables.forEach(table => {
            items.push(<option key={table} value={table}>{table}</option>);
        });

        return items;
    }

    createColumnOptions() {
        let selectedTable = this.state.selectedTable;
        let columns = CONSTANTS.TABLES[selectedTable];

        let items = [];

        if (!columns) return;

        // Add the SELECT * option
        if (!columns.includes("*")) {
            columns.push("*");
        }

        for (let i = 0; i <= columns.length - 1; i++) {
            items.push(<option key={i} value={columns[i]}>{columns[i]}</option>);
        }

        console.log(items);

        return items;
    }

    createWhereOption(event) {

        if (this.state.selectedTable === '') return;

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


    clearColumns(){
        console.log(this.state.displaySelectedColumns);
        this.setState(this.state.displaySelectedColumns = []);
        this.state.displaySelectedColumns = [];
        console.log("clear columns");
        console.log(this.state.displaySelectedColumns);

        this.setState(this.state.selectedColumns = []);
        console.log(this.state.selectedColumns);
        this.setState({selectedColumns: []})
    }


    toggle() {
        this.setState({
          modal: !this.state.modal
        });
      }


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

        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    <h5>Table:</h5>
                    <select multiple={true} value={this.state.tableNames} onChange={this.handleTableChanges}>
                        {this.createTableOptions()}
                    </select>
                </label>
                <br/>
                <br/>
                {this.state.selectedTable !== '' &&
                <label>
                    <h5>Please select data from table:</h5>
                    <select multiple={true} value={this.state.displaySelectedColumns}
                            onChange={this.handleColumnChanges}>
                        {this.createColumnOptions()}
                    </select>
                    <br/>
                    <br/>
                    <Button type="button" color="secondary" value = "CLEAR DATA" onClick = {this.clearColumns.bind(this)}>Clear Data
                    </Button>
                </label>
                }
                <br/>
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
                <br/>
                {this.state.selectedTable !== '' &&
                <div>
                    {button}
                    <Button type="submit" color="success">Generate Query</Button>
                </div>
                }
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

            </form>
        );
    }
}