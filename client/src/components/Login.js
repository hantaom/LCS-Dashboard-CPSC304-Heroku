import React from 'react';
import { Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import './Login.css';
import request from 'superagent';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      username: '',
      password: '',
      accountCreated: false,
      loggedIn: false
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleUsername(event) {
      let username = event.target.value;
      this.setState({username: username})
  }

  handlePassword(event) {
    let password = event.target.value;
    this.setState({password: password})
}

login() {
    let username = this.state.username;
    let password = this.state.password;

    console.log("Username: " + username);
    console.log("Password: " + password);
    this.setState({loggedIn: true});
}

createUser() {
    let username = this.state.username;
    let password = this.state.password;
    let queryString = 'CREATE USER ' + username + ' WITH PASSWORD ' + "\'" + password + "\'" + ';';
    console.log(queryString);
    let that = this;

    request
    .post('/api/query')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .query({ query: queryString})
    .end(function(err, res){
      console.log(res.text);
      that.setState({
        queryResults: res,
        headerNames: that.state.displaySelectedColumns,
        query: queryString,
        accountCreated: true
    });
    }); 
}

  render() {
    return (
      <div>
        <div className="Login">
            <Button color="warning" onClick={this.toggle}>Login/SignUp</Button>
        </div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Please Enter your Credentials: </ModalHeader>
          <ModalBody>
            <Form>
                <FormGroup>
                    <Label for="exampleEmail">Username: </Label>
                    <Input type="text" name="username" onChange={this.handleUsername.bind(this)} id="username" placeholder="Username" />
                </FormGroup>
                 <FormGroup>
                    <Label for="examplePassword">Password: </Label>
                     <Input type="text" name="password" onChange={this.handlePassword.bind(this)} id="password" placeholder="Must have at least 4 characters" />
                </FormGroup>
            </Form>
            {this.state.accountCreated && <Alert color="success">
                Account Successfully created!
            </Alert>
            }
            {this.state.loggedIn && <Alert color="primary">
                Successfully Logged In!
            </Alert>
            }
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.createUser.bind(this)}>Create User</Button>
            <Button color="primary" onClick={this.login.bind(this)}>Login</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Login;