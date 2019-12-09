import React, {Component} from 'react';
import {Redirect} from 'react-router';
import axios from 'axios';
import './Menu.css';


class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: localStorage.getItem('userid'),
            add_section: false,
            add_item: false,
            update_item: false,
            same_section_name: false,
            add_section_success: false,
            add_item_success: false,
            update_button: false,
            update_same_section_name: false,
            update_section_success: false,
            update_item_success: false
        };
    }

    componentDidMount(){
        console.log("testuserid", this.state.userid);
        let data = {
            userid: this.state.userid
        }
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/menu',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                console.log("response", response.data);
                if(response.status === 200){
                    // this.setState({
                    //     rid: response.data[3],
                    //     sname_list: response.data[1],
                    //     menu_list: response.data[2],
                    //     sid_list: response.data[0],
                    //     section_number: response.data[4]
                    // });
                    this.setState({
                        rid: response.data.rid,
                        sname_list: response.data.sname_list,
                        sid_list: response.data.sid_list,
                        menu_list: response.data.info,
                        section_number: response.data.section_number
                    });
                    console.log("sname_list ---------", response.data.sname_list);
                    console.log("menu_list ---------", response.data.info);
                }
        })
    }


    add_item(sid) {
        this.setState({
            add_item: true,
            sid_to_add: sid,
            add_section: false,
            update_item: false,
            update_button: false
        });
    }

    update_item(pre_item_info, sid) {
        this.setState({
            update_item: true,
            sid_to_update_menu: sid,
            pre_item_info: pre_item_info,
            add_section: false,
            add_item: false,
            update_button: false
        });
    }

    update_button(sid, sname) {
        this.setState({
            update_button: true,
            sid_to_update: sid,
            pre_section_name: sname,
            add_item: false,
            add_section: false,
            update_item: false
        });
    }

    delete_section(sid) {
        let data = {
            rid: this.state.rid,
            sid: sid
        }
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/deleteSection',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log("Delete successfully");
                }
        })
    }

    delete_item(mid, sid) {
        let data = {
            mid: mid,
            sid: sid
        }
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/deleteItem',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log("Delete successfully");
                }
        })
    }

    saveItem = (e) => {
        console.log("test2", this.state.sid_to_add);
        e.preventDefault();
        const data = new FormData();
        data.append('myImage', this.state.item_image);
        data.append('rid', this.state.rid);
        data.append('name', this.state.item_name);
        data.append('description', this.state.item_description);
        data.append('price', this.state.item_price);
        data.append('sid', this.state.sid_to_add);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/addItem',data, config)
            .then(response => {
                console.log("Status Code : ",response.status);
                //console.log("type",typeof(response.data));
                if(response.status === 200){
                    console.log("add item successfully!");
                    this.setState({add_item_success: true});
                }
        })
    }

    updateItem = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('myImage', this.state.item_image_update);
        data.append('mid', this.state.pre_item_info.mid);
        data.append('sid', this.state.sid_to_update_menu);
        data.append('name', this.state.item_name_update);
        data.append('description', this.state.item_description_update);
        data.append('price', this.state.item_price_update);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/updateItem',data, config)
            .then(response => {
                console.log("Status Code : ",response.status);
                //console.log("type",typeof(response.data));
                if(response.status === 200){
                    console.log("update item successfully!");
                    this.setState({update_item_success: true});
                }
        })
    }


    createTable = () => {
        let table = [];
        
        for (let i=0; i< this.state.section_number; i++) {
            let children = [];
            
            children.push(
                <tr>
                    <td>{this.state.sname_list[i]}</td>
                    <td><button onClick={() => this.add_item(this.state.sid_list[i])}>add item</button></td>
                    <td><button onClick={() => this.update_button(this.state.sid_list[i], this.state.sname_list[i])}>update</button></td>
                    <td><button onClick={() => this.delete_section(this.state.sid_list[i])}>delete</button></td>
                </tr>
            );
            
            for (let j=0; j<this.state.menu_list[i].length; j++) {
                if (j === 0) {
                    children.push(
                        <tr>
                            <td>Image</td>
                            <td>Item name</td>
                            <td>Description</td>
                            <td>Price</td>
                        </tr>
                    );
                }
                let image = "data:image/jpeg;base64," + this.state.menu_list[i][j].menu_image;
                
                children.push(
                    <tr>
                    <td><img src={image} height="100" width="100"></img></td>
                    <td>{this.state.menu_list[i][j].name}</td>
                    <td>{this.state.menu_list[i][j].description}</td>
                    <td>{this.state.menu_list[i][j].price}</td>
                    <td><button onClick={() => this.update_item(this.state.menu_list[i][j], this.state.sid_list[i])}>update</button></td>
                    <td><button onClick={() => this.delete_item(this.state.menu_list[i][j].mid, this.state.sid_list[i])}>delete</button></td>
                    </tr>
                );

            }
            table.push(children);
        }

        return table;
        
      }

    openForm() {
        this.setState({
            add_section: true,
            add_item: false,
            update_item: false,
            update_button: false
        });
    }

    closeForm() {
        this.setState({
            add_section: false,
            same_section_name: false,
            add_section_success: false
        });
    }

    closeAddItem() {
        this.setState({
            add_item: false,
            add_item_success: false
        });
    }

    closeUpdateItem() {
        this.setState({
            update_item: false,
            update_item_success: false
        });
    }

    closeUpdateSection() {
        this.setState({update_button: false});
    }

    saveSection = (e) => {
        e.preventDefault();
        console.log("test", this.state.rid);
        const data = {
            // userid: this.state.userid,
            section_name: this.state.section_name,
            rid: this.state.rid
        };
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/addSection',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                //console.log("type",typeof(response.data));
                if(response.status === 200){
                    console.log("add section successfully");
                    this.setState({same_section_name: false});
                    this.setState({add_section_success: true});
                }
                else if (response.status === 202) {
                    this.setState({same_section_name: true});
                    this.setState({add_section_success: false});
                }
        })
    }

    updateSection = (e) => {
        e.preventDefault();
        const data = {
            update_section_name: this.state.update_section_name,
            rid: this.state.rid,
            sid: this.state.sid_to_update
        };
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/updateSection',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                //console.log("type",typeof(response.data));
                if(response.status === 200){
                    console.log("update section successfully");
                    this.setState({update_same_section_name: false});
                    this.setState({update_section_success: true});
                }
                else if (response.status === 202) {
                    this.setState({update_same_section_name: true});
                    this.setState({update_section_success: false});
                }
        })
    }

    render() {
        
        let flag = localStorage.getItem("authLogin");
        console.log(flag);
        let redirectVar = null;
        if (flag !== "true") {
            redirectVar = <Redirect to= "/"/>
        }


        return (
            <div>
                {redirectVar}
                <div>
                    <div className="button_part">
                        <button type="button" onClick={() => this.openForm()}>Add section</button>
                    </div>
                    <div className="table_part">
                        <table class="table">
                            {this.createTable()}
                        </table>
                    </div>
                <div className="add_section">
                {this.state.add_section === true && <form>
                    <input type="text" placeholder="Enter section name" onChange={e=>this.setState({section_name:e.target.value})} required/>
                    <button type="submit" onClick={this.saveSection}>Save</button>
                    <button type="button" onClick={() => this.closeForm()}>Close</button>
                    {this.state.same_section_name === true && <div>{"Section name already exist"}</div>}
                    {this.state.add_section_success === true && <div>{"Section added successfully"}</div>}
                </form>}

                {this.state.add_item === true && <form onSubmit={this.saveItem}>

                    <input type="text" placeholder="Enter item name" onChange={e=>this.setState({item_name:e.target.value})} required/>
                    <br/>
                    <input type="text" placeholder="Enter item description" onChange={e=>this.setState({item_description:e.target.value})} required/>
                    <br/>
                    <input type="number" step="0.01" placeholder="Enter price" onChange={e=>this.setState({item_price:e.target.value})} required/>
                    <br/>
                    <input name = "myImage" type="file" onChange={e=>this.setState({item_image:e.target.files[0]})} required/>
                    <input type="submit" value="Add" />
                    <button type="button" onClick={() => this.closeAddItem()}>Close</button>
                    {this.state.add_item_success === true && <div>{"Item added successfully"}</div>}
                </form>}

                {this.state.update_button === true && <form>
                    <input type="text" placeholder="Enter section name" defaultValue={this.state.pre_section_name} onChange={e=>this.setState({update_section_name:e.target.value})} required/>
                    <button type="submit" onClick={this.updateSection}>Update</button>
                    <button type="button" onClick={() => this.closeUpdateSection()}>Close</button>
                    {this.state.update_same_section_name === true && <div>{"Section name already exist"}</div>}
                    {this.state.update_section_success === true && <div>{"Section updated successfully"}</div>}
                </form>}

                {this.state.update_item === true && <form onSubmit={this.updateItem}>
                    <input type="text" placeholder="Enter item name" defaultValue={this.state.pre_item_info.name} onChange={e=>this.setState({item_name_update:e.target.value})} required/>
                    <input type="text" placeholder="Enter item description" defaultValue={this.state.pre_item_info.description} onChange={e=>this.setState({item_description_update:e.target.value})} required/>
                    <input type="number" step="0.01" placeholder="Enter price" defaultValue={this.state.pre_item_info.price} onChange={e=>this.setState({item_price_update:e.target.value})} required/>
                    <input name = "myImage" type="file" onChange={e=>this.setState({item_image_update:e.target.files[0]})} required/>
                    <input type="submit" value="Update" />
                    <button type="button" onClick={() => this.closeUpdateItem()}>Close</button>
                    {this.state.update_item_success === true && <div>{"Item updated successfully"}</div>}
                </form>}
                </div>
                
                
                </div>



            </div>
        );
    }
}


export default Menu;