import React, {Component} from 'react';
import {Redirect} from 'react-router';
import axios from 'axios';
import './Cart.css';


class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cid: localStorage.getItem('userid'),
            rid: localStorage.getItem('rid_cart'),
            rname: localStorage.getItem('rname_visit'),
            openform: false,
            order_success: false,
            item_number: 0,
            place_empty: false,
            name: "",
            address: ""
        };
    }

    componentDidMount(){
        
        let data = {
            cart: localStorage.getItem('cart')
        }
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/getCart',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    //console.log("response", response.data);
                    let total = 0;
                    for (let i=0; i< response.data.item_number; i++) {
                        total += parseFloat(response.data.item_list[i].price) * parseFloat(response.data.item_list[i].quantity);
                    }
                    this.setState({
                        item_list: response.data.item_list,
                        item_number: response.data.item_number,
                        total: total.toFixed(2)
                    })
                }
        })

    }

    onClick(i) {
        let newcart= "";
        let temp = [];
        let number = 0;
        for (let j=0; j< this.state.item_number; j++) {
            if (j !== i) {
                temp.push(this.state.item_list[j]);
                number += 1;
                newcart += this.state.item_list[j].mid.toString() + "," + this.state.item_list[j].name.toString() + ","
                + this.state.item_list[j].quantity.toString() + "," + this.state.item_list[j].price.toString() + ";";
            }
        }
        localStorage.setItem("cart", newcart);

        this.setState({
            item_list: temp,
            item_number: number
        });
        
    }
    openForm() {
        this.setState({openform: true});
    }

    closeForm() {
        this.setState({
            openform: false,
            order_success: false,
            place_empty: false
        });
    }

    place() {
        if (this.state.name === "" || this.state.address === "") {
            this.setState({place_empty: true});
            return;
        }
        let data = {
          rid: this.state.rid,
          cid: this.state.cid,
          status: "new",
          items: localStorage.getItem('cart'),
          cname: this.state.name,
          caddress: this.state.address
        };

        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/place', data)
            .then((response) => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                //update the state with the response data
                console.log("place order successfully");
                localStorage.setItem('cart', "");
                this.setState({
                    order_success: true,
                    item_list: [],
                    item_number: 0
                });

            }
        });
    }


    createTable = () => {
        let table = [];
        table.push(
            <tr>
                <td>Image</td>
                <td>Name</td>
                <td>Price</td>
                <td>Quantity</td>
            </tr>
        );
        for (let i=0; i< this.state.item_number; i++) {
            console.log("image", this.state.item_list[i]);
            let image = "data:image/jpeg;base64," + this.state.item_list[i].menu_image;
            table.push(
                <tr>
                <td><img src={image} height="100" width="100"></img></td>
                <td>{this.state.item_list[i].name}</td>
                <td>{this.state.item_list[i].price}</td>
                <td>{this.state.item_list[i].quantity}</td>
                <td><button onClick={() => this.onClick(i)}>Remove</button></td>
                </tr>
            );
        }
        return table;
      }


    render() {
        console.log("test", this.state.item_number);
        let flag = localStorage.getItem("authLogin");
        console.log(flag);
        let redirectVar = null;
        if (flag !== "true") {
            redirectVar = <Redirect to= "/"/>
        }

        return (
            <div>
                {redirectVar}
                
                {this.state.item_number !== 0 &&
                <div>
                    <h1>Your cart</h1>
                    <div className="cart_result">
                        <table class="table">
                                {this.createTable()}
                        </table>
                    </div>
                
                    <div className="place_section">
                    <div><label>Your balance: </label> {this.state.total}</div>
                    <button onClick={() => this.openForm()}>Checkout</button>
                    
                    
                    {this.state.openform === true && this.state.item_number !== 0 &&
                    <div>
                        <input type="text" placeholder="Your name" onChange={(e)=>this.setState({name: e.target.value, order_success:false})} required/>
                        <input type="text" placeholder="Your address" onChange={(e)=>this.setState({address: e.target.value, order_success:false})} required/>
                        <button type="submit" onClick={() => this.place()}>Place order</button>
                        <button onClick={() => this.closeForm()}>Close</button>
                        {this.state.place_empty === true && <div>{"Please enter your name and address"}</div>}

                    </div>
                    }
                    </div>

                </div>}
                {this.state.order_success === true && <div>{"Your order is placed successfully!"}</div>}
                {this.state.item_number === 0 && <div>{"Your cart is empty now"}</div>}

            </div>
        );
    }
}


export default Cart;