import React from 'react'
import Jewellery from '../../assets/images/products/jewellery-1.jpg'

export default function LBToast() {

    const closeToastHandler = () => {

        const notificationToast = document.querySelector('.notification-toast');
        console.log(notificationToast)
        notificationToast.classList.add('closed');


    }



    return (
        <div className="notification-toast" data-toast>

            <button className="toast-close-btn" onClick={closeToastHandler}>
                <ion-icon name="close-outline"></ion-icon>
            </button>

            <div className="toast-banner">
                <img src={Jewellery} alt="Rose Gold Earrings" width="80" height="70" />
            </div>

            <div className="toast-detail">

                <p className="toast-message">
                    Someone in new just bought
                </p>

                <p className="toast-title">
                    Rose Gold Earrings
                </p>

                <p className="toast-meta">
                    <time dateTime="PT2M">2 Minutes</time> ago
                </p>

            </div>

        </div>
    )
}
