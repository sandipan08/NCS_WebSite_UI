import React from 'react'

export default function MobileBottomNavigation() {
    const mobileMenuHandler = () => {
        console.log("Hello World")
        const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
        console.log(mobileMenu)

    }

    const mobileCartHandler = () => {
        console.log("Shopping Cart")
    }

    const mobileHomeHandler = () => {
        console.log("Home")
    }

    const mobileWishlistHandler = () => {
        console.log("Wishlist")
    }

    const mobileCategoryHandler = () => {
        console.log("Category")

    }


    return (
        <div className="mobile-bottom-navigation">

            <button className="action-btn button-transparent" onClick={mobileMenuHandler}>
                <ion-icon name="menu-outline"></ion-icon>
            </button>

            <button className="action-btn button-transparent" onClick={mobileCartHandler}>
                <ion-icon name="bag-handle-outline"></ion-icon>

                <span className="count">0</span>
            </button>

            <button className="action-btn button-transparent" onClick={mobileHomeHandler}>
                <ion-icon name="home-outline"></ion-icon>
            </button>

            <button className="action-btn button-transparent" onClick={mobileWishlistHandler}>
                <ion-icon name="heart-outline"></ion-icon>

                <span className="count">0</span>
            </button>

            <button className="action-btn button-transparent" onClick={mobileCategoryHandler}>
                <ion-icon name="grid-outline"></ion-icon>
            </button>

        </div>
    )
}
