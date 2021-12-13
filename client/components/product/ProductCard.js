import React, { useContext, useEffect, useState } from 'react'
import { MyContext } from 'context'
import useNotifier from 'hooks/useNotifier'
import { Router } from 'next/router'
import { addToCart, addToWish, deleteFromCart } from 'services'
import styles from 'styles/product-card.module.scss'

export const ProductCard = ({ data }) => {
    const [{ name, id, price, productImages }] = useState(data)
    const [canAdd, setCanAdd] = useState(true)
    const [canRemove, setCanRemove] = useState(false)
    const [mainId, setMainId] = useState(id)
    const [hasWish, setHasWish] = useState(false)
    const {
        dispatch,
        state: { userInfo },
    } = useContext(MyContext)

    useEffect(() => {
        if (userInfo && userInfo.userWish) {
            const { userWish } = userInfo
            const checkHasWish = userWish.products.filter((item) => item.id === id)
            if (checkHasWish.length > 0) {
                setHasWish(true)
            } else {
                setHasWish(false)
            }
        } else {
            setHasWish(false)
        }

        handleUserCarts()
    }, [userInfo])

    const getCoverImage = (images) => {
        let image = ""
        for (let i of images) {
            if (i.isCover) {
                image = i.image.image
                break
            }
        }
        return image
    }

    const handleProductClick = () => {
        Router.push(`/product/${id}`)
    }

    const handleAddToCart = () => {
        if (!userInfo) {
            useNotifier({
                type: "error",
                content: "You need to be logged in to perform operation",
            })
            return
        }
        addToCart(mainId, dispatch, userInfo)
    }

    const removeFromCart = () => {
        if (!userInfo) {
            useNotifier({
                type: "error",
                content: "You need to be logged in to perform operation",
            })
            return
        }
        deleteFromCart(mainId, dispatch, userInfo)
    }

    const handleUserCarts = () => {
        if (!userInfo) return

        const { userCarts } = userInfo
        if (!userCarts) return
        let cart = userCarts.filter((item) => item.product.id === id)
        if (cart.length > 0) {
            cart = cart[0]
            setMainId(cart.id)
            setCanRemove(true)

            if (cart.product.totalCount <= cart.quantity) {
                setCanAdd(false)
            } else {
                setCanAdd(true)
            }
        } else {
            setMainId(id)
            setCanRemove(false)
            setCanAdd(true)
        }
    }

    return (
        <div className={styles.productCard}>
            <div className={styles.productCover} onClick={handleProductClick}>
                <img src={getCoverImage(productImages)} alt="" />
            </div>
            <div className={styles.productContent}>
                <div className={styles.productTopContent}>
                    <div className={styles.productPrice}>${price}</div>
                    <div className={styles.productReaction}>
                        {canRemove && (
                            <>
                                <img src="/minus.svg" onClick={removeFromCart} />
                            </>
                        )}
                        {canAdd && <img src="/add.svg" onClick={handleAddToCart} />}
                        <img
                            src={hasWish ? "/favColoured.svg" : "/favorite.svg"}
                            onClick={() => addToWish(id, dispatch)}
                        />
                    </div>
                </div>
                <div className={styles.productInformation} onClick={handleProductClick}>
                    {name}
                </div>
            </div>
        </div>
    )
}

export default ProductCard
