import React, {Component} from 'react';
import {Redirect} from 'react-router';
import './Home.css';
import axios from 'axios';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';


class Home_for_Owner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: localStorage.getItem('userid'),
            past: false,
            openform: false,
            sent_success: false
        };
    }

    componentDidMount(){
        this.getOrders(false);
    }

    getOrders = (past) => {
        console.log("testest",localStorage.getItem('userid'));
        let data = {
            userid: localStorage.getItem('userid'),
            past: past
        };
        axios.defaults.withCredentials = true;

        axios.post('http://localhost:3001/ohome', data)
            .then((response) => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log("result: ",response.data.result);
                localStorage.setItem('rid', response.data.rid);
                this.setState({
                    orders: response.data.result,
                    number: response.data.number,
                    rid: response.data.rid,
                    rname: response.data.rname
                });
            }
        });

    }

    message() {
        let data = {
            rid: this.state.rid,
            cid: this.state.cid_to_send,
            message: this.state.message,
            // cid to rid
            ctor: false,
            cname: this.state.cname_to_send,
            rname: this.state.rname
        };
        axios.defaults.withCredentials = true;

        axios.post('http://localhost:3001/message', data)
            .then((response) => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                //update the state with the response data
                console.log("Message sent successfully");
                this.setState({sent_success: true});
            }
        });

    }

    openForm(cid, cname) {
        this.setState({
            openform: true,
            cid_to_send: cid,
            cname_to_send: cname
        });
    }

    closeForm() {
        this.setState({
            openform: false,
            sent_success: false
        });
    }

    upcome = () => {
        this.setState({
            past: false
        });
        this.getOrders(false);
    }

    past = () => {
        this.setState({
            past: true
        });
        this.getOrders(true);
    }

    cancel_order(id) {
        let data = {order_id: id};
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/ohomeCancel',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                //console.log("type",typeof(response.data));
                if(response.status === 200){
                    console.log("Cancel order successfully");
                    this.getOrders();
                }
        })
    }

    change_status(id, value) {
        console.log("change status", id, value);
        let data = {order_id: id, new_status: value};
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/ohomeChange',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                //console.log("type",typeof(response.data));
                if(response.status === 200){
                    console.log("update status successfully");

                }
        })
    }

    helper(i) {
        let s = this.state.orders[i].items;
        let item_list = s.split(/;/);
        //console.log("test", item_list);
        let children = [];
        if (i === 0) {
            children.push(
                <tr>
                    <td>Item name</td>
                    <td>Quantity</td>
                    <td>Price</td>
                </tr>
            );
        }
        for (let i=0; i < item_list.length-1; i++) {
            let item = item_list[i].split(/,/);
            //console.log("item", item);
            children.push(
                <tr>
                    <td>{item[1]}</td>
                    <td>{item[2]}</td>
                    <td>{item[3]}</td>
                </tr>
            );
        }
        return children;
    }

    createTable = () => {
        let table = [];
        table.push(
            <tr>
                <td>No.</td>
                <td>Items</td>
                <td>Name</td>
                <td>Address</td>
                <td>Status</td>
            </tr>
        );
        for (let i=0; i< this.state.number; i++) {
            let order = this.state.orders[i];
            table.push(
                <tr>
                    <td>{i+1}</td>
                    <td>
                        <table class="table">
                        {this.helper(i)}
                        </table>
                    </td>
                    <td>{order.cname}</td>
                    <td>{order.caddress}</td>
                    <td>
                        <select onChange={(e) => this.change_status(order._id, e.target.value)}>
                        <option selected="selected">{order.status}</option>
                        {order.status !== "new" && <option value="new">new</option>}
                        {order.status !== "preparing" && <option value="preparing">preparing</option>}
                        {order.status !== "ready" && <option value="ready">ready</option>}
                        {order.status !== "delivered" && <option value="delivered">delivered</option>}
                        {this.state.past === true && order.status !== "cancelled" && <option value="cancelled">cancelled</option>}
                        </select>
                    </td>
                    <td><button onClick={() => this.openForm(this.state.orders[i].cid, this.state.orders[i].cname)}>message</button></td>
                    {this.state.past === false && <td><button onClick={() => this.cancel_order(order._id)}>cancel</button></td>}
                    
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
                        <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                            <ToggleButton value={1} onClick={this.upcome}>Upcoming orders</ToggleButton>
                            <ToggleButton value={2} onClick={this.past}>Past orders</ToggleButton>
                        </ToggleButtonGroup>

                        {this.state.openform === true && this.state.item_number !== 0 &&
                            <div>
                                <input type="text" placeholder="Message" onChange={(e)=>this.setState({message: e.target.value})} required/>
                                <button type="submit" onClick={() => this.message()}>Send</button>
                                <button onClick={() => this.closeForm()}>Close</button>
                                {this.state.sent_success === true && <div>{"Sent successfully"}</div>}
                            </div>
                        
                        }

                        <table class="table">
                                {this.createTable()}
                                
                        </table>
                </div> 
            </div> 
        )
        
    }
}



export default Home_for_Owner;