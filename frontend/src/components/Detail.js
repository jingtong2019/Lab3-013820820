import React, {Component} from 'react';
import {Redirect} from 'react-router';
import axios from 'axios';
import './Detail.css';


class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cid: localStorage.getItem('userid'),
            rid: localStorage.getItem('rid_visit'),
            rname: localStorage.getItem('rname_visit'),
            ispopup: false,
            add_error: false,
            add_success: false,
            valid_number: false
        };
    }

    componentDidMount(){
        let data = {
            rid: this.state.rid
        }
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/detail',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                console.log("response", response.data);
                if(response.status === 200){
                    this.setState({
                        sname_list: response.data.sname_list,
                        sid_list: response.data.sid_list,
                        menu_list: response.data.info,
                        section_number: response.data.section_number
                    });
                }
        })
    }

    openForm(item) {
        this.setState({
            ispopup: true,
            item: item
        });
    }
    
    closeForm() {
        this.setState({
            ispopup: false,
            add_error: false,
            add_success: false,
            valid_number: false
        });
    }

    onSubmit = () => {
        if (this.state.item_quantity <= 0 || !Number.isInteger(Number(this.state.item_quantity))) {
            this.setState({valid_number: true});
            return;
        }
        let cart = localStorage.getItem("cart");
        if (cart === null) {
            localStorage.setItem("cart", "");
            localStorage.setItem("rid_cart", this.state.rid);
        }
        cart = localStorage.getItem("cart");
        let rid_cart = localStorage.getItem("rid_cart");
        if (cart !== "" && rid_cart !== this.state.rid) {
            this.setState({add_error: true});
        }
        else {
            let cur = this.state.item.mid.toString() + "," + this.state.item.name.toString() + "," 
                + this.state.item_quantity.toString() + "," + this.state.item.price.toString() + ";";
        
            localStorage.setItem("cart", cart+cur);
            localStorage.setItem("rid_cart", this.state.rid);
            this.setState({add_success: true});
        }
        
    }


    createTable = () => {
        let table = [];
        table.push(
            <tr>
                <td>Image</td>
                <td>Name</td>
                <td>Description</td>
                <td>Price</td>
            </tr>
        );
        
        for (let i=0; i< this.state.section_number; i++) {
            let children = [];
            children.push(
                <tr>
                    <td>{this.state.sname_list[i]}</td>
                </tr>
            );
            for (let j=0; j<this.state.menu_list[i].length; j++) {
                let image = "data:image/jpeg;base64," + this.state.menu_list[i][j].menu_image;
                
                children.push(
                    <tr>
                    <td><img src={image} height="100" width="100"></img></td>
                    <td>{this.state.menu_list[i][j].name}</td>
                    <td>{this.state.menu_list[i][j].description}</td>
                    <td>{this.state.menu_list[i][j].price}</td>
                    <td><button onClick={() => this.openForm(this.state.menu_list[i][j])}>Add</button></td>
                    </tr>
                );

            }
            table.push(children);
        }

        return table;
        
      }


    render() {
        //localStorage.setItem("cart", "");
        let cart = localStorage.getItem("cart");
        console.log("testtest", cart);
        
        let flag = localStorage.getItem("authLogin");
        console.log(flag);
        let redirectVar = null;
        if (flag !== "true") {
            redirectVar = <Redirect to= "/"/>
        }


        return (
            <div>
                {redirectVar}
                <h1>{this.state.rname}</h1>

                <div className="quantity_section">
                {this.state.ispopup === true &&
                <div>
                <label>Quantity: </label>
                <input type="number" min="1" step="1" defaultValue="0" onChange={(e) => this.setState({item_quantity: e.target.value, add_error:false, add_success:false, valid_number: false})}/>
                <br/>
                <button type="button" onClick={() => this.onSubmit()}>Add to cart</button>
                <button type="button" onClick={() => this.closeForm()}>Close</button>
                </div>
                }
                {this.state.add_error === true && <div>{"Can not add this item to cart, there are other restaurant's items in cart."}</div>}
                {this.state.add_success === true && <div>{"Item added to cart"}</div>}
                {this.state.valid_number === true && <div>{"Enter a valid integer number"}</div>}
                </div>

                <div className="detail_result">
                <table class = "table">
                    {this.createTable()}
                </table>
                </div>

                

                

            </div>
        );
    }
}


export default Detail;