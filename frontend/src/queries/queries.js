import { gql } from 'apollo-boost';

const getAuthorsQuery = gql`
    {
        authors {
            name
            id
        }
    }
`;

const getBooksQuery = gql`
    {
        books {
            name
            id
        }
    }
`;

const loginQuery = gql`
    {
        login(email: $email, password: $password, usertype: $usertype){
            userid
            fname
        }
    }
`;

export { getAuthorsQuery, getBooksQuery, loginQuery };