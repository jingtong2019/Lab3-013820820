import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';
import {Link} from 'react-router-dom';
import {setLoginError, setLoginPending, setLoginSuccess} from '../redux_files/reducer/index';
import './Login.css';
import { graphql } from 'react-apollo';
import * as compose from 'lodash.flowright';
import {loginMutation } from '../mutation/mutations';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usertype: "Customer"
        };
    }

    onSubmit = (e) => {
        e.preventDefault();
        var data = this.props.loginMutation({
            variables: {
                email: this.state.email,
                password: this.state.password,
                usertype: this.state.usertype,
             
            }
        });
        this.props.loginFunc(data);
    }
    

    render() {

        let {isLoginPending, isLoginSuccess, isLoginError} = this.props;
        console.log(isLoginPending, isLoginSuccess, isLoginError);
        localStorage.setItem("authLogin", isLoginSuccess);
        
        let redirectVar = null;
        if (isLoginSuccess) {
            redirectVar = <Redirect to= "/home"/>
            //console.log("usertype", this.state.usertype);
            localStorage.setItem("usertype", "customer");
            if (this.state.usertype === 'Restaurant Owner') {
                //console.log("usertype", this.state.usertype);
                redirectVar = <Redirect to= "/ohome"/>
                localStorage.setItem("usertype", "owner");
            }
            
        }
        return (
            <div>
                {redirectVar}
                <div class="container">
                
                    <form name = "login" onSubmit={this.onSubmit}>
                        <p className="bigtitle">Sign in with your Grubhub account</p>
                        <label for="select"><b>You are a</b></label>
                        <select className="login_select" name="select" onChange={e=>this.setState({usertype:e.target.value})}>
                        <option value="Customer">Customer</option>
                        <option value="Restaurant Owner">Restaurant Owner</option>
                        </select><br/>
                            
                        <label className="box_label"><b>Email</b></label><br/>
                        <input className="box_input" type="email" name="email" onChange={e=>this.setState({email:e.target.value})} required/><br/><br/>
                        <label className="box_label" for="password"><b>Password</b></label><br/>
                        <input className="box_input" type="password" name="password" onChange={e=>this.setState({password:e.target.value})} required/><br/>
                        <input className="submit_button" type="submit" value="Sign in" />
                            
                        {isLoginError && <div className="err">{"Invalid email or password!"}</div>}
                        
                        <br/>
                        <button name="signup" className="create"><Link to="/signup">Create your account</Link></button>
                        
                    </form>
                    
                </div>
            </div>
        );
    }
}
    

function loginFunc(data) {
    return dispatch => {
        dispatch(setLoginPending(true));
        dispatch(setLoginSuccess(false));
        dispatch(setLoginError(false));

        if (data.userid !== "-1") {
            localStorage.setItem("userid", data.userid);
            localStorage.setItem("fname", data.fname);
            dispatch(setLoginPending(false));
            dispatch(setLoginSuccess(true));
        } 
        else {
            dispatch(setLoginPending(false));
            dispatch(setLoginError(true));
        }
    }
}



const mapStateToProps = (state) => {
    return {
        isLoginPending: state.isLoginPending,
        isLoginSuccess: state.isLoginSuccess,
        isLoginError: state.isLoginError
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        loginFunc: (data) => dispatch(loginFunc(data))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(loginMutation, { name: "loginMutation" })(Login));
