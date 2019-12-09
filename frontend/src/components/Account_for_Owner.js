import React, {Component} from 'react';
import {Redirect} from 'react-router';
import './Account.css';
import testimage from '../images/default_profile.jpeg';
import axios from 'axios';
import { graphql } from 'react-apollo';
import * as compose from 'lodash.flowright';
import {oaccount1Mutation, oaccount2Mutation } from '../mutation/mutations';


class Account_for_Owner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updated_status: 0,
            profile_image: testimage,
            restaurant_image: testimage,
            userid: localStorage.getItem("userid")
        };
    }

    componentDidMount(){
        var data = this.props.account1Mutation({
            variables: {
                userid: this.state.userid
            }
        });
        if(data.code === 200){
            this.setState({
                fname: data.fname,
                lname: data.lname,
                email: data.email,
                phone: data.phone,
                cuisine: data.cuisine,
                rname: data.rname
            })
            if (data.pimage_result !== "no image") {
                this.setState({profile_image: "data:image/jpeg;base64," + data.pimage_result});
            }
            if (data.rimage_result !== "no image") {
                this.setState({restaurant_image: "data:image/jpeg;base64," + data.rimage_result});
            }
        }
    }

    onClick = (e) => {
        e.preventDefault();
        var data = this.props.account1Mutation({
            variables: {
                fname: this.state.fname,
                lname: this.state.lname,
                email: this.state.email,
                phone: this.state.phone,
                cuisine: this.state.cuisine,
                rname: this.state.rname,
                userid: this.state.userid
            }
        });
        if(data.code === 200){
            console.log("update successfully");
            this.setState({
                updated_status: 1
            });
        }
        else {
            this.setState({
                updated_status: 2
            });
        }
    }


    onSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('myImage', this.state.pimage);
        data.append('userid', this.state.userid);
        
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/oaccount3',data, config)
            .then(response => {
                console.log("Status Code : ",response.status);
                //console.log("type",typeof(response.data));
                if(response.status === 200){
                    console.log("update profile image successfully!");
                }
        })
    }

    rimageSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('myImage', this.state.rimage);
        data.append('userid', this.state.userid);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/oaccount4',data, config)
            .then(response => {
                console.log("Status Code : ",response.status);
                //console.log("type",typeof(response.data));
                if(response.status === 200){
                    console.log("update restaurant image successfully!");
                }
        })
    }

    render() {
        let flag = localStorage.getItem("authLogin");
        
        let redirectVar = null;
        if (flag !== "true") {
            console.log("!flag:", !flag);
            redirectVar = <Redirect to= "/"/>
        }
        return (
            <div>
                {redirectVar}
                <div className="account_container">
                    <div>
                    
                    <img src={this.state.profile_image} height="100" width="100"></img>

                    <form onSubmit={this.onSubmit}>
                    <span>Profile image</span>
                    <input name = "myImage" type="file" onChange={e=>this.setState({pimage:e.target.files[0]})} required/>
                    <input type="submit" value="Upload" />
                    </form>

                    <img src={this.state.restaurant_image} height="100" width="100"></img>
                    <form onSubmit={this.rimageSubmit}>
                    <span>Restaurant image</span>
                    <input name = "myImage" type="file" onChange={e=>this.setState({rimage:e.target.files[0]})} required/>
                    <input type="submit" value="Upload" />
                    </form>

                    <form>
                    <input className="boxes" type="text" name="fname" value={this.state.fname} placeholder="First name" onChange={e=>this.setState({fname:e.target.value})} required/>
                    <input className="boxes" type="text" name="lname" value={this.state.lname} placeholder="Last name" onChange={e=>this.setState({lname:e.target.value})} required/><br/>
                    <br/>
                    <input className="box_input" type="email" name="email" value={this.state.email} placeholder="Email address" onChange={e=>this.setState({email:e.target.value})} required/><br/>
                    <br/>
                    <input className="box_input" type="text" name="phone" value={this.state.phone} placeholder="Phone number" onChange={e=>this.setState({phone:e.target.value})}/><br/>

                    <input className="box_input" type="text" name="rname" value={this.state.rname} placeholder="Restaurant name" onChange={e=>this.setState({rname:e.target.value})}/><br/>
                    
                    <input className="box_input" type="text" name="cuisine" value={this.state.cuisine} placeholder="Cuisine" onChange={e=>this.setState({cuisine:e.target.value})}/><br/>
                    <button className="save_button" type="submit" onClick={this.onClick}>Save</button>
        
                    </form>
                    {this.state.updated_status === 1 && <div>{"Information saved successfully!"}</div>}
                    {this.state.updated_status === 2 && <div>{"Error, email been used."}</div>}
                    </div>
                </div>
            </div>
        );
    }
}

export default compose(
    graphql(oaccount1Mutation, { name: "oaccount1Mutation" }),
    graphql(oaccount2Mutation, { name: "oaccount2Mutation" })
)(Account_for_Owner);