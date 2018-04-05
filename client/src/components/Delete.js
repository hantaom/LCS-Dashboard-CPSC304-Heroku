import React from "react";
import {CONSTANTS} from "../TableConstants";
import request from 'superagent';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class Delete extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
                      selectedTable: '',
                      modal: false,
                      query: '',
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
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createWhereOption = this.createWhereOption.bind(this);
        this.toggle = this.toggle.bind(this);
      }
      
      // Functions for handling the state changes
      // #######################################################################################
      handleTableChanges(event) {
        this.setState({selectedTable: event.target.value});
      }

      handleWhereColumnStates(event) {
        let value = event.target.value;
        let id = event.target.id;
        let whereFormStates = this.state.whereFormStates;
        let state = whereFormStates[id];

        state.selectedCondition = value;

        whereFormStates[id] = state;
        console.log(JSON.stringify(state));

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
                selectedCondition: "<",
                inputtedValue: ""
            };
        
             this.setState({whereFormStates: newWhereForm});
        }
    createColumnOptions() {
        let selectedTable = this.state.selectedTable;
        let columns = CONSTANTS.TABLES[selectedTable];
    
        let items = [];
    
        if (!columns) return;
    
        for (let i = 0; i <= columns.length - 1; i++) {
            items.push(<option key={i} value={columns[i]}>{columns[i]}</option>);
        }
    
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

      
      // #######################################################################################
    
      handleSubmit(event) {
        let query_table = this.state.selectedTable;
        let query_filters = this.state.whereFormStates;
        console.log(JSON.stringify(query_filters));
        let queryString = 'DELETE FROM ';
        // Generate the "FROM" part of the query string
        if (query_table !== '') {
            queryString = queryString + query_table;
        }
        // Generate the WHERE part of the query string
        if (query_filters.length > 0) {
            queryString = queryString + " where ";
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
                    let value = "\'" + query_filters[i].inputtedValue  + "\'";
                    let filter = " " + conj + " " + column + " " + op + " " + value;
                    queryString = queryString + filter;
                }
            }
        }
        // Append ending of query
        queryString = queryString + ';';
        console.log(queryString);
        // Make the post request
          let that = this;
          that.props.sendRequest(queryString, this)
              .then(function (res) {
                  that.setState({
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

    // #######################################################################################

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
              <header>Please select the table:</header>
              <select value={this.state.selectedTable} onChange={this.handleTableChanges}>
                {this.createTableOptions()}
              </select>
            </label>
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
            {this.state.selectedTable !== '' &&
            <div>
                {button}
                <Button type="submit" color="success">Generate Query</Button>
            </div>
            }
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
          </form>
        );
      }
    }