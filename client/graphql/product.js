import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
    query categoryQuery($name: String) {
        categories(name: $name) {
            id
            name
            count
        }
    }
`;

export const CREATE_PRODUCT = gql`
    mutation createProductMutation(
        $images: [ProductImageInput]
        $productData: ProductInput!
        $totalCount: Int!
    ) {
        createProduct(
            images: $images
            productData: $productData
            totalCount: $totalCount
        ) {
            product {
                id
            }
        }
    }
`;

export const GET_PRODUCT = gql`
    query productQuery(
        $search: String
        $minPrice: Float
        $maxPrice: Float
        $category: String
        $business: String
        $sortBy: String
        $isAsc: Boolean
        $mine: Boolean
    ) {
        products(
            search: $search
            minPrice: $minPrice
            maxPrice: $maxPrice
            category: $category
            business: $business
            sortBy: $sortBy
            isAsc: $isAsc
            mine: $mine
        ) {
            total
            size
            current
            hasNext
            hasPrev
            results {
                id
                name
                price
                createdAt
                totalAvailable
                productImages {
                    isCover
                    image {
                        image
                    }
                }
            }
        }
    }
`;

export const DELETE_PRODUCT = gql`
    mutation deleteProductMutation($productId: ID!) {
        deleteProduct(productId: $productId) {
            status
        }
    }
`;

export const TOGGLE_WISH = gql`
    mutation toggleWish($productId: ID!) {
        handleWishList(productId: $productId) {
            status
        }
    }
`;

export const CREATE_CART = gql`
    mutation createCartMutation($productId: ID!, $quantity: Int) {
        createCartItem(productId: $productId, quantity: $quantity) {
            cartItem {
                quantity
                id
                product {
                id
                totalCount
                }
            }
        }
    }
`;

export const UPDATE_CART = gql`
    mutation updateCartMutation($cartId: ID!, $quantity: Int!) {
        updateCartItem(cartId: $cartId, quantity: $quantity) {
            cartItem {
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

export const DELETE_CART = gql`
    mutation deleteCartMutation($cartId: ID!) {
        deleteCartItem(cartId: $cartId) {
            status
        }
    }
`;

export const GET_CART = gql`
    query cartQuery($name: String) {
        carts(name: $name) {
            quantity
            id
            product {
                name
                price
                totalAvailable
                productImages {
                    isCover
                    image {
                        image
                    }
                }
            }
        }
    }
`;

export const COMPLETE_PAYMENT = gql`
    mutation completePaymentMutation {
        completePayment {
            status
        }
    }
`;

export const GET_REQUEST_CART = gql`
    query requestCartQuery($name: String) {
        requestCarts(name: $name) {
            quantity
            product {
                name
                price
                productImages {
                    isCover
                    image {
                        image
                    }
                }
            }
            user {
                firstName
                lastName
            }
        }
    }
`;