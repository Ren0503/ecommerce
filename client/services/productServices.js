import {
    TOGGLE_USER_WISH,
    SET_USER,
    EXPIRED_TOKEN
} from 'constants'
import {
    CREATE_CART,
    DELETE_CART,
    GET_CATEGORIES,
    GET_PRODUCT,
    TOGGLE_WISH,
    UPDATE_CART
} from 'graphql/product'
import useNotifier from 'hooks/useNotifier'
import { client } from 'utils/apollo-client'
import { errorHandler } from 'utils/errorHandler'
import {
    getActivateToken,
    getClientHeaders,
    getNewToken,
    setAuthCookie
} from './authServices'

const handleAddToWish = async (productId, dispatch, access, refresh) => {
    try {
        await client.mutate({
            mutation: TOGGLE_WISH,
            variables: { productId },
            context: getClientHeaders(access)
        })
    } catch (e) {
        const errorInfo = errorHandler(e)
        if (errorInfo === EXPIRED_TOKEN) {
            const newAccess = await getNewToken(e, refresh)

            if (newAccess) {
                setAuthCookie({ access: newAccess, refresh })
                handleAddToWish(productId, dispatch, newAccess, refresh)
            }
        } else {
            dispatch({ type: TOGGLE_USER_WISH, payload: productId })
        }
    }
}

const handleCartRequest = async (
    productId,
    quantity,
    access,
    refresh,
    mutation,
    variables
) => {
    try {
        const res = await client.mutate({
            mutation,
            variables,
            context: getClientHeaders(access),
        })

        if (res) {
            return res.data
        }
    } catch (error) {
        const errorInfo = errorHandler(e)
        if (errorInfo === EXPIRED_TOKEN) {
            const newAccess = await getNewToken(e, refresh)
            if (newAccess) {
                setAuthCookie({ access: newAccess, refresh })
                handleCartRequest(
                    productId,
                    quantity,
                    dispatch,
                    newAccess,
                    refresh,
                    mutation,
                    variables
                )
            }
        } else {
            useNotifier({ type: "error", content: errorInfo })
        }
    }
}

const handleCartDeleteRequest = async (cartId, access, refresh) => {
    try {
        const res = await client.mutate({
            mutation: DELETE_CART,
            variables: { cartId },
            context: getClientHeaders(access),
        })

        if (res) {
            return res.data
        }
    } catch (e) {
        const errorInfo = errorHandler(e)

        if (errorInfo === EXPIRED_TOKEN) {
            const newAccess = await getNewToken(e, refresh)

            if (newAccess) {
                setAuthCookie({ access: newAccess, refresh })
                handleCartDeleteRequest(cartId, access, refresh)
            }
        }
    }
}

export const getCategories = async () => {
    const res = await client
        .query({ query: GET_CATEGORIES })
        .catch((e) => useNotifier({
            type: "error",
            content: errorHandler(e),
        }))

    if (res) {
        return res.data.categories
    }

    return res
}

export const getProducts = async (variables) => {
    const res = await client
        .query({
            query: GET_PRODUCT,
            variables,
        })
        .catch((e) => useNotifier({
            type: "error",
            content: errorHandler(e)
        }))

    if (res) {
        const {
            results,
            total,
            size,
            current,
            hasNext,
            hasPrev,
        } = res.data.products

        const pageInfo = {
            total,
            size,
            current,
            hasNext,
            hasPrev
        }

        return { results, pageInfo }
    }

    return res
}

export const addToWish = (productId, dispatch) => {
    dispatch({ type: TOGGLE_USER_WISH, payload: productId })

    const activeToken = getActivateToken()
    handleAddToWish(productId, activeToken.access, activeToken.refresh)
}

export const addToCart = async (mainId, dispatch, userInfo, quantity = 1) => {
    const activeToken = getActivateToken()

    const product = userInfo.userCarts.filter((item) => item.id === mainId)

    if (product.lengths > 0) {
        const variables = {
            cartId: mainId,
            quantity,
        }

        const res = await handleCartRequest(
            mainId,
            quantity,
            activeToken.access,
            activeToken.refresh,
            UPDATE_CART,
            variables
        )

        if (res) {
            useNotifier({
                type: "success",
                content: "Cart updated successfully"
            })

            const data = res.updateCartItem.updateCartItem
            const newUserCart = userInfo.userCarts.map((item) => {
                if (item.id === mainId) {
                    return data
                }

                return item
            })

            dispatch({
                type: SET_USER,
                payload: { ...userInfo, userCarts: newUserCart },
            })
        }
    } else {
        const variables = {
            productId: mainId,
            quantity,
        }

        const res = await handleCartRequest(
            mainId,
            quantity,
            activeToken.access,
            activeToken.refresh,
            CREATE_CART,
            variables
        )

        if (res) {
            const data = res.createCartItem.updateCartItem
            const newUserInfo = {
                ...userInfo,
                userCarts: [...userInfo.userCarts, data],
            }

            dispatch({ type: SET_USER, payload: newUserInfo })
        }
    }
}

export const updateCart = async (cartId, quantity) => {
    const activeToken = getActiveToken()
    const variables = {
        cartId,
        quantity,
    }

    const res = await handleCartRequest(
        cartId,
        quantity,
        activeToken.access,
        activeToken.refresh,
        UPDATE_CART,
        variables
    )

    if (res) {
        return true
    }
    return False
}

export const deleteFromCart = async (mainId, dispatch, userInfo) => {
    const activeToken = getActivateToken()

    const product = userInfo.userCarts.filter((item) => item.id === mainId)
    if (product.length < 1) {
        return
    }

    const res = await handleCartDeleteRequest(
        mainId,
        activeToken.access,
        activeToken.refresh
    )

    if (res) {
        const newUserCart = userInfo.userCarts.filter((item) => item.id !== mainId)

        dispatch({
            type: SET_USER,
            payload: { ...userInfo, userCarts: newUserCart },
        })
    }
}