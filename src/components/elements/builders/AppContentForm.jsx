import React from 'react';
import './style.css';
import { Form } from 'react-bootstrap';

export default function AppContentForm(props) {
    return (
        <Form onSubmit={props.onSubmit}
            // className='pct-app-content' 
            encType="multipart/form-data">
            {props.children}
        </Form>
    )
}
