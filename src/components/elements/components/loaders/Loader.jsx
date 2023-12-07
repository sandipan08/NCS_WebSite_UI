import React from 'react'
import { Container } from 'react-bootstrap'

const Loader = ({ content, position }) => {
    return (
        <Container className='p-0'
            style={{ color: 'rgb(128, 128, 128)', fontSize: '3rem', fontWeight: 100, display: "flex", justifyContent: "center", alignItems: position ? `${position}` : "center", textAlign: position ? `${position}` : "center", height: '70vh' }}
        >
            {content}
        </Container>
    )
}

export default Loader