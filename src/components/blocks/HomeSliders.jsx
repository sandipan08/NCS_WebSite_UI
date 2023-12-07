import { React, useEffect, useState, useContext } from 'react'
import { Container, Carousel } from 'react-bootstrap'
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import Button from 'react-bootstrap/Button';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ApiService from '../../helpers/ApiServices'
import { getModelRoute, showMessage } from '../../helpers/Utils'
import { UserContext } from '../../states/contexts/UserContext';
import LittleImg from '../../assets/images/Little.jpg';


// import { Carousel } from 'react-responsive-carousel';



export default function HomeSliders() {
    const [state, setState] = useState([]);

    const { dispatch, user } = useContext(UserContext)

    const onChange = (e) => {
        console.log(e)
    }

    const onClickItem = (e) => {
        console.log(e)
    }

    const onClickThumb = (e) => {
        console.log(e)
    }

    const getBanner = async () => {
        try {
            const response = await ApiService.get(`/shop/banner?client=website&model=${getModelRoute(user).model}`);
            if (response.data.isSuccess) {
                setState(response?.data.documents)

            } else {
            }
        } catch (error) {
            console.log(error.response.data)
            // showMessage(error.response.data.message, "error")
        }
    }

    useEffect(() => {
        getBanner()

    }, []);


    return (
        <div>
            <Card style={{ width: '100%' }}>
                <Card.Img variant="top" src={LittleImg} />
            </Card>

        </div>

    )
}
