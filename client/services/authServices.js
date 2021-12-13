import cookie from 'js-cookie'
import nextCookie from 'next-cookies'
import Router from 'next/router'
import {
    IS_LOGIN,
    TOKEN,
    SET_USER,
    EXPIRED_TOKEN,
} from 'constants'
import { GET_ACCESS_USER } from 'graphql/user'
import { client } from 'utils/apollo-client'
import { errorHandler } from 'utils/errorHandler'

export const setAuthCookie = (authObj) => {
    cookies.set(TOKEN, JSON.stringify(authObj))
}

export const setIsLoginCookie = (status) => {
    cookie.set(IS_LOGIN, JSON.stringify(status))
}

export const parseCookie = (ctx) => {
    return nextCookie(ctx)
}

export const removeCookie = (name) => {
    cookie.remove(name)
}

export const getClientHeaders = (access) => {
    return {
        headers: {
            AUTHORIZATION: `JWT ${access}`
        },
    }
}

export const getActivateToken = () => {
    return JSON.parse(cookie.get(TOKEN))
}

export const getNewToken = async (e, refresh) => {
    const errorContent = errorHandler(e);
    if (errorContent === EXPIRED_TOKEN) {
        const newAccess = await client
            .mutate({
                mutation: GET_ACCESS_USER,
                variables: { refresh }
            })
            .catch((e) => removeCookie(TOKEN))

        if (newAccess) {
            const accessToken = newAccess.data.getAccess.access
            setAuthCookie({ access: accessToken, refresh: refresh })
            return accessToken
        }

        return null
    }

    return null
}

export const logout = (dispatch) => {
    cookie.remove(TOKEN)
    cookie.remove(IS_LOGIN)
    dispatch({ type: SET_USER, payload: {} })
}

export const handleRouting = (path) => {
    Router.push(path)
}