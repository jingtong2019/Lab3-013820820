
import { gql } from 'apollo-boost';


const loginMutation = gql`
    mutation Login($email: String, $password: String, $usertype: String){
        login(email: $email, password: $password, usertype: $usertype){
            userid
            fname
        }
    }
`;

const csignupMutation = gql`
    mutation Csignup($email: String, $password: String){
        csignup(email: $email, password: $password){
            userid
            fname
        }
    }
`;

const osignupMutation = gql`
    mutation Osignup($email: String, $password: String){
        osignup(email: $email, password: $password){
            userid
            fname
        }
    }
`;

const osignup2Mutation = gql`
    mutation Osignup2($userid: String, $rname: String, $address: String, $phone: String){
        osignup2(userid: $userid, rname: $rname, address: $address, phone: $phone){
            code
        }
    }
`;

const account1Mutation = gql`
    mutation Account1($userid: String){
        account1(userid: $userid){
            code
            fname
            lname
            email
            image_result
            phone
        }
    }
`;
const account2Mutation = gql`
    mutation Account2($userid: String, $fname: String, $lname: String, $email: String, $phone: String){
        account2(userid: $userid, fname: $fname, lname: $lname, email: $email, phone: $phone){
            code
        }
    }
`;

const oaccount1Mutation = gql`
    mutation Oaccount1($userid: String){
        oaccount1(userid: $userid){
            code
            fname
            lname
            rname
            email
            rimage_result
            pimage_result
            phone
            cuisine
        }
    }
`;

const oaccount2Mutation = gql`
    mutation Oaccount2($userid: String, $fname: String, $lname: String, $email: String, $phone: String, $rname: String, $cuisine: String,){
        oaccount2(userid: $userid, fname: $fname, lname: $lname, email: $email, phone: $phone, rname: $rname, cuisine: $cuisine){
            code
        }
    }
`;

export {csignupMutation, loginMutation, osignupMutation, osignup2Mutation, account1Mutation, account2Mutation, oaccount1Mutation, oaccount2Mutation};