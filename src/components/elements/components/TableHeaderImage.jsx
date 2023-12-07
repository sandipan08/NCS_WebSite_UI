import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import DefaultImg from '../../../image/default_product_img.jpg'


const TableHeaderImage = ({ image, name }) => {
    console.log();

    return (
        <div className='' style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "10px" }}>
            <span>{name}</span>
            <LazyLoadImage
                className=''
                style={{ cursor: "pointer", objectFit: "fill", }}
                alt={""}
                width={"40"}
                height={"40"}
                effect="blur"
                src={image ? image : DefaultImg}
            />
        </div>
    )
}

export default TableHeaderImage