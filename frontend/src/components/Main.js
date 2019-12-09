import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import CustomerSignup from './CustomerSignup';
import OwnerSignup from './OwnerSignup';
import OwnerSignup2 from './OwnerSignup2';
import Home from './Home';
import Search from './Search';
import Navbar from './Navbar'
import Account from './Account';
import Home_for_Owner from './Home_for_Owner';
import Account_for_Owner from './Account_for_Owner';
import Menu from './Menu';
import Detail from './Detail';
import Cart from './Cart';
import Order from './Order';
import Omessage from './Omessage';
import Cmessage from './Cmessage';

//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route path="/" component={Navbar}/>
                <Route exact path="/" component={Login}/>
                <Route path="/signup" component={Signup}/>
                <Route path="/home" component={Home}/>
                <Route path="/search" component={Search}/>
                <Route path="/detail" component={Detail}/>
                <Route path="/cart" component={Cart}/>
                <Route path="/order" component={Order}/>
                <Route path="/ohome" component={Home_for_Owner}/>
                <Route path="/oaccount" component={Account_for_Owner}/>
                <Route path="/menu" component={Menu}/>
                <Route path="/account" component={Account}/>
                <Route path="/csignup" component={CustomerSignup}/>
                <Route path="/osignup" component={OwnerSignup}/>
                <Route path="/osignup2" component={OwnerSignup2}/>
                <Route path="/cmessage" component={Cmessage}/>
                <Route path="/omessage" component={Omessage}/>
            </div>
        );
    }
}
//Export The Main Component
export default Main;