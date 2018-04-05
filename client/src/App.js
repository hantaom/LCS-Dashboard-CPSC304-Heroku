import React, {Component} from 'react';
import './App.css';
import TableView from "./components/TableView";
import request from 'superagent';
import Selection from "./components/Selection";
import Join from "./components/Join";
import Delete from "./components/Delete";
import Division from "./components/Division";
import Aggregate from "./components/Aggregate";
import Update from "./components/Update";
import NestedAggregate from "./components/NestedAggregate";
import Login from "./components/Login";
import {TabContent, TabPane, Nav, NavItem, NavLink, Row, Col} from 'reactstrap';
import Insertion from "./components/Insertion";

class App extends Component {
    // Initialize state

    constructor(props) {
        super(props);
        this.state = {
            queryResults: {hello: "WORLD"},
            activeTab: '1',
            data: []
        };
        this.toggle = this.toggle.bind(this);
    }

    componentDidUpdate() {
      console.log("Inside App.js");
      console.log(this.state.data);
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    }

    setData = (data) =>{
      this.setState({data:data});
    };

    sendRequest = (queryString, component) => {
        let that = this;
        return new Promise(function (resolve, reject) {
            request
                .post('/api/query')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .query({query: queryString})
                .end(function (err, res) {
                    if (err) {
                        alert (err.response.body.detail ||
                            err.response.body.hint ||
                            err.response.text +
                            `\nQUERY: ${queryString}`);
                        reject(err);
                        return;
                    }
                    that.setData(JSON.parse(res.text));
                    component.toggle();
                    resolve(res);
                });
        });
    };

    // Fetch Query Results
    componentDidMount() {
        this.getQueryResults();
    }

    // Get the results of the query
    getRequestCall = () => {
        // Get the query results
        fetch('/api/temp')
            .then(res => res.json())
            .then(queryResults => this.setState({queryResults}))
    };

    getQueryResults = () => {
        let that = this;
        request
            .post('/api/query')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .query({query: that.buildQuery()})
            .end(function (err, res) {
                console.log(res.text);
                that.setState({queryResults: res.text})
            });
    };

    buildQuery = () => {
        // Builds a query from forms or whatever

        // temporarily returning generic query
        return 'SELECT * FROM PLAYERS;';
    };

    render() {
        const {queryResults} = this.state;
        return (
            <div className="App">
                <Login/>
                <h1 className="title"> LCS Dashboard </h1>
                <div className="contentBody">
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                onClick={() => {
                                    this.toggle('1');
                                }}
                            >
                                Selection Queries
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                onClick={() => {
                                    this.toggle('2');
                                }}
                            >
                                Join Queries
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                onClick={() => {
                                    this.toggle('3');
                                }}
                            >
                                Division Queries
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                onClick={() => {
                                    this.toggle('4');
                                }}
                            >
                                Insertion Queries
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                onClick={() => {
                                    this.toggle('5');
                                }}
                            >
                                Aggregation Queries
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                onClick={() => {
                                    this.toggle('6');
                                }}
                            >
                                Nested Aggregation Queries
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                onClick={() => {
                                    this.toggle('7');
                                }}
                            >
                                Deletion Queries
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                onClick={() => {
                                    this.toggle('8');
                                }}
                            >
                                Update Queries
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab}>
                        <TabPane tabId="1">
                            <Row>
                                <Col sm="12">
                                    <h4>Selection Queries</h4>
                                    <Selection setData = {this.setData} sendRequest = {this.sendRequest} />
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="2">
                            <Row>
                                <Col sm="12">
                                    <h4>Join Queries</h4>
                                    <Join setData = {this.setData} sendRequest = {this.sendRequest}/>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="3">
                            <Row>
                                <Col sm="12">
                                    <h4>Division Queries</h4>
                                    <Division setData = {this.setData} sendRequest = {this.sendRequest}/>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="4">
                            <Row>
                                <Col sm="12">
                                    <h4>Insertion Queries</h4>
				    <Insertion setData = {this.setData} sendRequest = {this.sendRequest}/>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="5">
                            <Row>
                                <Col sm="12">
                                    <h4>Aggregation Queries</h4>
                                    <Aggregate setData = {this.setData} sendRequest = {this.sendRequest}/>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="6">
                            <Row>
                                <Col sm="12">
                                    <h4>Nested Aggregation Queries</h4>
                                    <NestedAggregate setData = {this.setData} sendRequest = {this.sendRequest}/>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="7">
                            <Row>
                                <Col sm="12">
                                    <h4>Deletion Queries</h4>
                                    <Delete setData = {this.setData} sendRequest = {this.sendRequest}/>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane tabId="8">
                            <Row>
                                <Col sm="12">
                                    <h4>Update Queries</h4>
                                    <Update setData = {this.setData} sendRequest = {this.sendRequest}/>
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
                    <br/>
                </div>
                <TableView data = {this.state.data}/>
            </div>
        );
    }
}

export default App;
