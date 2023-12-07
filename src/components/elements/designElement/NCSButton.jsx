import React from 'react'
import Button from 'react-bootstrap/Button';
import "./ncsButton.css"

export default function NCSButton({ props }) {
    switch (props.buttonType) {
        case 'thirdlyDefaultButton': return <Button variant="outline-warning" id='thirdlyDefaultButton'>{props.buttonName}</Button>;
        case 'primaryDefaultButton': return <Button variant="warning" id='primaryDefaultButton'>{props.buttonName}</Button>;
        case 'footerDefaultButton': return <Button variant="warning" id='footerDefaultButton'>{props.buttonName}</Button>;
        default: return <Button variant="outline-primary">Warning</Button>
    }

}


