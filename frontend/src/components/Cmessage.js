import React, {Component} from 'react';
import {Redirect} from 'react-router';
import axios from 'axios';
import './Order.css';


class Cmessage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cid: localStorage.getItem('userid')
        };
    }

    componentDidMount(){
        let data = {
            cid: this.state.cid
        };
        axios.defaults.withCredentials = true;

        axios.post('http://localhost:3001/getCmessage', data)
            .then((response) => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                //update the state with the response data
                this.setState({
                    messages: response.data.result,
                    number: response.data.number
                });
            }
        });
    }


    createTable = () => {
        let table = [];
        for (let i=0; i< this.state.number; i++) {
            table.push(
                <tr>
                <td>{this.state.messages[i].rname}</td>
                <td>{this.state.messages[i].message}</td>
                <td>{this.state.messages[i].sent_time}</td>
                </tr>
            );
        }
        return table;
      }

    render() {
        let flag = localStorage.getItem("authLogin");
        let redirectVar = null;
        if (flag !== "true") {
            console.log("!flag:", !flag);
            redirectVar = <Redirect to= "/"/>
        }

        return(
            <div>
                {redirectVar}
                <div>

                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Restaurant</th>
                                    <th>Message</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.createTable()}
                                
                            </tbody>
                        </table>
                </div> 
            </div> 
        )
        
    }
}



export default Cmessage;