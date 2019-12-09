import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './Signup.css';

import styled from 'styled-components';


export const StyledLink = styled(Link)`
    text-decoration: none;

    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
    color: white;
`;


class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    

    render() {
        return (
            <div className="container">
                <p className="bigtitle">Choose your account type</p>
                <br/>
                <button className="signup_button" name="buyer"><StyledLink to="/csignup">You Are a Customer</StyledLink></button><br/><br/>
                <button className="signup_button" name="owner"><StyledLink to="/osignup">You Are a Restaurant Owner</StyledLink></button><br/><br/>
                <button className="signup_button" name="signin"><StyledLink to="/">Back to Sign In</StyledLink></button>

            </div>
        );
    }
}

export default Signup;