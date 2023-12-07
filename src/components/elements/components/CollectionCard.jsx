import React from 'react'
import { Figure } from 'react-bootstrap'
import { LazyLoadImage } from 'react-lazy-load-image-component'


const CollectionCard = ({ collection, goToCollectionPage, DefaultCollection }) => {
    return (
        <div className='pt-1' key={collection?._id} style={{ display: "flex", justifyContent: "center", paddingBottom: "20px" }}>
            <Figure>
                <LazyLoadImage
                    onClick={() => goToCollectionPage(collection?._id)}
                    style={{ cursor: "pointer" }}
                    alt={""}
                    width={"195"}
                    height={"195"}
                    effect="blur"
                    src={collection?.image?.url ? collection?.image?.url : DefaultCollection} />
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Figure.Caption >
                        {collection?.name}
                    </Figure.Caption>
                </div>
            </Figure>
        </div>
    )
}

export default CollectionCard