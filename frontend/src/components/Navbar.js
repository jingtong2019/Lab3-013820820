import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {StyledLink} from './Signup';
import {connect} from 'react-redux';
import axios from 'axios';
import {setLoginError, setLoginPending, setLoginSuccess} from '../redux_files/reducer/index';
import './Navbar.css';

//create the Navbar Component
class Navbar extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: "Account"
        };
        //this.handleLogout = this.handleLogout.bind(this);
    }

    onClick = (e) => {
        e.preventDefault();
        this.props.logout();
        localStorage.setItem("authLogin", "false");
    }
    
    render(){
        let flag = localStorage.getItem("authLogin");
        let usertype = localStorage.getItem("usertype");

        console.log("navbar:", localStorage.getItem("userid"));
        return(
            <div>
            <head>
            <meta charset="utf-8"></meta>
            <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"></link>
            </head>

            
            <nav class="navbar navbar-inverse">
                <div class="container-fluid">
                    <div class="navbar-header">
                        {usertype === "customer" && <a class="navbar-brand"><StyledLink to="/home">Grubhub</StyledLink></a>}
                        {usertype === "owner" && <a class="navbar-brand"><StyledLink to="/ohome">Grubhub</StyledLink></a>}
                    </div>
                    {flag === "true" && <div className="topnav-right">
                    <ul class="nav navbar-nav">
                    {usertype === "customer" && <li><Link to="/account">{localStorage.getItem("fname")}</Link></li>}
                    {usertype === "customer" && <li><Link to="/order">Orders</Link></li>}
                    {usertype === "owner" && <li><Link to="/oaccount">Account</Link></li>}
                    {usertype === "customer" && <li><Link to="/cart">Cart</Link></li>}
                    {usertype === "owner" && <li><Link to="/menu">Menu</Link></li>}
                    {usertype === "customer" && <li><Link to="/cmessage">Messages</Link></li>}
                    {usertype === "owner" && <li><Link to="/omessage">Messages</Link></li>}
                    <li onClick={this.onClick}><Link to="/">Logout</Link></li>
                    </ul>
                    </div>}
                </div>
            </nav>
        </div>
        )
    }
}


function logout() {
    return dispatch => {
        dispatch(setLoginPending(true));
        dispatch(setLoginSuccess(false));
        dispatch(setLoginError(false));
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
        logout: () => dispatch(logout())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);