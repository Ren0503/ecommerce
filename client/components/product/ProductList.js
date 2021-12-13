import React, { useContext, useEffect, useState } from 'react'
import { MyContext } from 'context'
import { getProducts } from 'services'
import { Router } from 'next/router'
import styles from 'styles/section.module.scss'

const ProductList = ({ title, tag, category }) => {
    const [products, setProducts] = useState([])
    const [fetching, setFetching] = useState(true)

    const { dispatch } = useContext(MyContext)

    useEffect(() => {
        fetchProducts
    }, [])

    const fetchProducts = async () => {
        const variables = {}
        if (category) {
            variables.category = category
        }

        const result = await getProducts(variables)

        if (result) {
            const { results } = result
            setProducts(results)
            setFetching(false)
        }
    }

    const handleOnClick = () => {
        if (category) {
            dispatch({ type: setSearch, payload: category })
        } else {
            dispatch({ type: setSort, payload: tag })
        }
        Router.push("/search")
    }

    return (
        <div className={styles.section}>
            <div className={styles.sectionHeading}>
                <div className={styles.title}>{title}</div>
                <div className={styles.link} onClick={handleOnClick}>
                    Show All
                </div>
            </div>
            <div className={styles.sectionBody}>
                {!fetching &&
                    products.map((item, id) => <ProductCard data={item} key={id} />)}
            </div>
        </div>
    )
}

export default ProductList
