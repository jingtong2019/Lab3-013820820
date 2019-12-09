import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router';
import {setLoginError, setLoginPending, setLoginSuccess, setSignupError} from '../redux_files/reducer/index';
import {connect} from 'react-redux';
import './Signup.css';
import { graphql } from 'react-apollo';
import {osignupMutation } from '../mutation/mutations';

class OwnerSignup extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    onSubmit = (e) => {
        e.preventDefault();
        var data = this.props.osignupMutation({
            variables: {
                email: this.state.email,
                password: this.state.password
             
            }
        });
        this.props.osignupToHome(data);
    }

    render() {
        let {isLoginPending, isLoginSuccess, isSignupError} = this.props;
        console.log(isLoginPending, isLoginSuccess, isSignupError);
        
        let redirectVar = null;
        if (isLoginSuccess) {
            redirectVar = <Redirect to= "/osignup2"/>
            localStorage.setItem("email", this.state.email);
            localStorage.setItem("usertype", "owner");
            localStorage.setItem("rname", this.state.rname);
        }
        return (
            <div>
                {redirectVar}
                <div className="container">
                    
                    <form name = "ownersignup" onSubmit={this.onSubmit}>
                        <p className="bigtitle">Create your Grubhub owner account</p>
                        <input className="boxes" type="text" name="fname" placeholder="First name" onChange={e=>this.setState({fname:e.target.value})}/>
                        
                        <input className="boxes" type="text" name="lname" placeholder="Last name" onChange={e=>this.setState({lname:e.target.value})}/><br/>
                        <br/>
                        <input className="box_input" type="email" name="email" placeholder="Email" onChange={e=>this.setState({email:e.target.value})}/><br/>
                        <br/>
                        <input className="box_input" type="password" name="password" placeholder="Password" onChange={e=>this.setState({password:e.target.value})}/><br/>
                        <br/>
                        <input className="boxes" type="text" name="restaurantName" placeholder="Restaurant name" onChange={e=>this.setState({rname:e.target.value})}/>
                        
                        <input className="boxes" type="text" name="zipcode" placeholder="Zipcode" onChange={e=>this.setState({zipcode:e.target.value})}/><br/>
                        <input className="submit_button" type="submit" value="Sign up" /><br/>
                        

                        {isSignupError && <div>{"This email address has been used!"}</div>}
                        <br/>
                        <button className="back" name="backToLogin"><Link to="/">Back to login</Link></button>

                    </form>
                </div>
            </div>
        );
    }
}

function osignupToHome(data) {
    return dispatch => {
        dispatch(setLoginPending(true));
        dispatch(setLoginSuccess(false));
        dispatch(setLoginError(false));
        dispatch(setSignupError(false));

        if(data.userid !== "-1"){
            console.log("sign up successfully!");
            localStorage.setItem("userid", data.userid);
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
        osignupToHome: (data) => dispatch(osignupToHome(data))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(graphql(osignupMutation, { name: "osignupMutation" })(OwnerSignup));