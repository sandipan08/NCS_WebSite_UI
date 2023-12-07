import React from 'react'
import Payments from '../../../assets/images/payment.png'

export default function FooterBottom() {
    return (
        <div className="footer-bottom">

            <div className="app-container">

                <img src={Payments} alt="payment method" className="payment-img" />

                <p className="copyright">
                    Copyright &copy; <a href="https://www.paapri.com/">Paapri</a> all rights reserved.
                </p>

            </div>

        </div>
    )
}
