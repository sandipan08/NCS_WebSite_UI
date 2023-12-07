import React from 'react';
import './style.css';

export default function AppContentBody(props) {
    return (
        <div className='pct-app-content-body' >
            {props.children}
        </div>
    )
}
