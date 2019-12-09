import React, {Component} from 'react';
import {Redirect} from 'react-router';
import axios from 'axios';
import './Search.css';
import {Link} from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            to_search: localStorage.getItem("to_search"),
            cuisine_type: "All",
            size: 5,
            which_page: 1
        };
    }

    componentDidMount(){
        let data = {
            to_search: this.state.to_search
        }
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/search',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.setState({
                        result_number: response.data.number,
                        result_list: response.data.info
                    })

                    let cuisine_list = [];
                    for (let i=0; i<response.data.number; i++) {
                        let cur = response.data.info[i].cuisine;
                        if (cur !== "" && !cuisine_list.includes(cur)) {
                            cuisine_list.push(cur);
                        }
                    }
                    this.setState({cuisine_list: cuisine_list});
                    this.setState({cuisine_length: cuisine_list.length});
                }
        })
    }
    
    onClick(rid, rname) {
        localStorage.setItem("rid_visit", rid);
        localStorage.setItem("rname_visit", rname);
    }


    createSelect = () => {
        let select = [];
        for (let i = 0; i < this.state.cuisine_length; i++) {
            select.push(<option value={this.state.cuisine_list[i]}>{this.state.cuisine_list[i]}</option>);
        }
        return select;
    }

    choosePage(i) {
        this.setState({which_page: i});
    }

    helper(pages, info) {
        let result = [];
        for (let i = 1; i <= pages; i++) {
            result.push(
                <button onClick={() => this.choosePage(i)}>{i}</button>
            );
        }
        result.push(
            <div>
                <table class="table">
                    {info[this.state.which_page]}
                </table>
            </div>
        );
        return result;
    }

    createPages = () => {
        let page_info = {};
        let cur = 1;
        let table = [];
        // table.push(
        //     <tr>
        //         <td>Item</td>
        //         <td>Restaurant</td>
        //         <td>Cuisine</td>
        //     </tr>
        // );
        let total = 0;
        for (let i=0; i< this.state.result_number; i++) {
            if (this.state.cuisine_type === "All" || this.state.result_list[i].cuisine === this.state.cuisine_type) {
                let children = [];
                total += 1;
                children.push(
                    <tr>
                        <td>{this.state.result_list[i].name}</td>
                        <td><Link to="/detail" onClick={(e) => this.onClick(this.state.result_list[i].rid, this.state.result_list[i].rname)}>{this.state.result_list[i].rname}</Link></td>
                        <td>{this.state.result_list[i].cuisine}</td>
                    </tr>
                );
            
                table.push(children);
                console.log("table_info------------", table);
                if (total == this.state.size) {
                    page_info[cur.toString()] = table;
                    cur += 1;
                    total = 0;
                    table = []
                }
            }
        }
        if (table.length != 0) {
            page_info[cur.toString()] = table;
            cur += 1
        }
        cur -= 1
        console.log("page_info------------", page_info);
        // this.setState({
        //     pages: cur
        // });
        return this.helper(cur, page_info);

        return page_info[1];
        
    }

    createTable = () => {
        let table = [];
        table.push(
            <tr>
                <td>Item</td>
                <td>Restaurant</td>
                <td>Cuisine</td>
            </tr>
        );
        for (let i=0; i< this.state.result_number; i++) {
            if (this.state.cuisine_type === "All" || this.state.result_list[i].cuisine === this.state.cuisine_type) {
                let children = [];
                children.push(
                    <tr>
                        <td>{this.state.result_list[i].name}</td>
                        <td><Link to="/detail" onClick={(e) => this.onClick(this.state.result_list[i].rid, this.state.result_list[i].rname)}>{this.state.result_list[i].rname}</Link></td>
                        <td>{this.state.result_list[i].cuisine}</td>
                    </tr>
                );
            
                table.push(children);
            }
            
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

        return (
            <div>
                {redirectVar}
                <div className="home_container">
                    <h1 className="h1_style">We found these dishes for you</h1>

                    <label className="h1_style">Choose cuisine type</label>
                    <select onChange={(e) => this.setState({cuisine_type: e.target.value, which_page: 1})}>
                        <option value="All" selected>All</option>
                        {this.createSelect()}
                    </select><br/>

                    {this.createPages()}
                    {/* <div>
                        <table class="table">
                            {this.createPages()}
                        </table>
                    </div> */}

                    {/* <div className="search_result">
                        <table class="table">
                            {this.createTable()}
                        </table>
                    </div> */}
                </div>
            </div>
        );
    }
}



export default Search;