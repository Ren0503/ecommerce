import { gql } from '@apollo/client';

export const LOGIN = gql`
    mutation LoginMutation($email: String!, $password: String!) {
        loginUser(email: $email, password: $password) {
            access
            refresh
            user {
                id
                firstName
                lastName
                userBusiness {
                    name
                    id
                }
                userWish {
                    products {
                        id
                    }
                }
                userCarts {
                    id
                    quantity
                    product {
                        id
                        totalCount
                    }
                }
            }
        }
    }
`;

export const REGISTER = gql`
    mutation RegisterMutation(
        $email: String!
        $password: String!
        $firstName: String!
        $lastName: String!
    ) {
        registerUser(
            email: $email
            firstName: $firstName
            lastName: $lastName
            password: $password
        ) {
            message
        }
    }
`;

export const ME = gql`
    query meQuery {
        me {
            id
            firstName
            lastName
            userBusiness {
                name
                id
            }
            userWish {
                products {
                    id
                }
            }
            userCarts {
                id
                quantity
                product {
                    id
                    totalCount
                }
            }
        }
    }
`;

export const GET_ACCESS_USER = gql`
    mutation getAccessMutation($refresh: String!) {
        getAccess(refresh: $refresh) {
            access
        }
    }
`;

export const CREATE_BUSINESS = gql`
    mutation createBusinessMutation($name: String!) {
        createBusiness(name: $name) {
            business {
                id
            }
        }
    }
`;

export const UPLOAD_IMAGE = gql`
    mutation uploadImageMutation($image: Upload!) {
        imageUpload(image: $image) {
            image {
                id
                image
            }
        }
    }
`;