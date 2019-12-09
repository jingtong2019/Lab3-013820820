import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import {setLoginError, setLoginPending, setLoginSuccess, setSignupError} from '../redux_files/reducer/index';
import {connect} from 'react-redux';
import './Signup.css';
import { graphql } from 'react-apollo';
import {csignupMutation } from '../mutation/mutations';

class CustomerSignup extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onSubmit = (e) => {
        e.preventDefault();
        var data = this.props.csignupMutation({
            variables: {
                email: this.state.email,
                password: this.state.password
             
            }
        });
        this.props.csignupToHome(data);
    }

    render() {
        console.log("this.props", this.props);
        let {isLoginPending, isLoginSuccess, isLoginError, isSignupError} = this.props;
        console.log(isLoginPending, isLoginSuccess, isSignupError);
        
        let redirectVar = null;
        if (isLoginSuccess) {
            redirectVar = <Redirect to= "/home"/>
            localStorage.setItem("usertype", "customer");
        }
        return (
            <div>
                {redirectVar}
                <div className="container">
                    
                    <form name = "customersignup" onSubmit={this.onSubmit}>
                        <p className="bigtitle">Create your Grubhub customer account</p>
                        
                        <input className="boxes" type="text" name="fname" placeholder="First name" onChange={e=>this.setState({fname:e.target.value})} required/>
                        
                        <input className="boxes" type="text" name="lname" placeholder="Last name" onChange={e=>this.setState({lname:e.target.value})} required/><br/>
                        <br/>
                        <input className="box_input" type="email" name="email" placeholder="Email" onChange={e=>this.setState({email:e.target.value})} required/><br/>
                        <br/>
                        <input className="box_input" type="password" name="password" placeholder="Password" onChange={e=>this.setState({password:e.target.value})} required/><br/>
                        <input className="submit_button" type="submit" value="Sign up" />
                        {isSignupError && <div>{"This email address has been used!"}</div>}
                        <br/>
                        <button className="back" name="backToLogin"><Link to="/">Back to login</Link></button>
                    </form>
                </div>
            </div>
        );
    }
}

function csignupToHome(data) {
    return dispatch => {
        dispatch(setLoginPending(true));
        dispatch(setLoginSuccess(false));
        dispatch(setLoginError(false));
        dispatch(setSignupError(false));

        if(data.userid !== "-1"){
            console.log("sign up successfully!");
            localStorage.setItem("authLogin", "true");
            localStorage.setItem("userid", data.userid);
            localStorage.setItem("fname", data.fname);
            dispatch(setLoginPending(false));
            dispatch(setLoginSuccess(true));
        }
        else {
            dispatch(setLoginPending(false));
            dispatch(setLoginError(true));
            dispatch(setSignupError(true));
        }
    };
}


const mapStateToProps = (state) => {
    return {
        isLoginPending: state.isLoginPending,
        isLoginSuccess: state.isLoginSuccess,
        isLoginError: state.isLoginError,
        isSignupError: state.isSignupError
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        csignupToHome: (data) => dispatch(csignupToHome(data))
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(graphql(csignupMutation, { name: "csignupMutation" })(CustomerSignup));