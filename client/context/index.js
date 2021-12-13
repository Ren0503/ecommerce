import React, { createContext, useReducer } from 'react'
import { 
    SET_USER,
    SET_TOKEN_DATA,
    SET_CATEGORY,
    SET_SEARCH,
    SET_SORT,
    TOGGLE_USER_WISH,
} from 'constants'

export const MyContext = createContext({})

const myReducer = (state, action) => {
    const { type, payload } = action
    switch (type) {
        case SET_USER:
            return {
                ...state,
                userInfo: payload,
            }
        case SET_TOKEN_DATA:
            return {
                ...state,
                tokenData: payload,
            }
        case SET_CATEGORY:
            return {
                ...state,
                categories: payload,
            }
        case SET_SEARCH:
            return {
                ...state,
                search: payload,
            }
        case SET_SORT:
            return {
                ...state,
                sortGlobal: payload,
            }
        case TOGGLE_USER_WISH:
            if (!state.userInfo)
                return { state }
            if (userWish) {
                let hasProduct = userWish.products.filter(
                    (item) => item.id === payload
                )
                if (hasProduct.length > 0) {
                    let products = userWish.products.filter(
                        (item) => item.id !== payload
                    )
                    userWish = { ...userWish, products }
                } else {
                    userWish = { products: [...userWish.products, { id: payload }] }
                }
            } else {
                userWish = { products: [{ id: payload }] }
            }

            const newUserInfo = { ...state.userInfo, userWish }

            return {
                ...state,
                userInfo: newUserInfo,
            }
        default:
            console.log("No action type specified")
    }
}

const MyProvider = ({ initialValue, children }) => {
    const [state, dispatch] = useReducer(myReducer, initialValue)

    return (
        <MyContext.Provider value={{ state, dispatch }}>
            { children }
        </MyContext.Provider>
    )
}

export default MyProvider