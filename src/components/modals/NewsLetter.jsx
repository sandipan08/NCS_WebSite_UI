import React from 'react'
import NewsLetterImg from '../../assets/images/newsletter.png';

export default function NewsLetter() {

    const modalCloseHandler = () => {
        const modal = document.querySelector('[data-modal]');
        modal.classList.add('closed')
    }


    return (
        <div className="modal" data-modal>

            <div className="modal-close-overlay" onClick={modalCloseHandler}></div>

            <div className="modal-content">

                <button className="modal-close-btn" onClick={modalCloseHandler}>
                    <ion-icon name="close-outline"></ion-icon>
                </button>

                <div className="newsletter-img">
                    <img src={NewsLetterImg} alt="subscribe newsletter" width="400" height="400" />
                </div>

                <div className="newsletter">

                    <form action="#">

                        <div className="newsletter-header">

                            <h3 className="newsletter-title">Subscribe Newsletter.</h3>

                            <p className="newsletter-desc">
                                Subscribe the <b>northcott.com</b> to get latest products and discount update.
                            </p>

                        </div>

                        <input type="email" name="email" className="email-field" placeholder="Email Address" required />

                        <button type="submit" className="btn-newsletter">Subscribe</button>

                    </form>

                </div>

            </div>

        </div>
    )
}
