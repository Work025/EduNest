import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <div className='footer'>
            <div className='footer-about'>
                <div className='footer-name'>
                    <h1>Edu <span>/</span> Nest</h1>
                </div>
                <div className='tel'>
                    <div>tel: +998 (33) 071 17 70</div>
                    <div>tel: +998 (94) 688 08 84</div>
                </div>
                <div className='footer-link'>
                    <i style={{ color: "blue" }} class="fa-brands fa-telegram"></i>
                    <i style={{ color: "red" }} class="fa-brands fa-youtube"></i>
                </div>
            </div>
            <hr />
            <div className='my-work'>
                <h1>Do you have quation ? <q>tel: +998 (33) 711 75 70</q></h1><p>©2025</p>
            </div>
        </div>
    )
}

export default Footer;