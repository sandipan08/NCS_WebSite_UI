import { React, useEffect, useContext, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import AppFooter from '../components/shared/footers/AppFooter';
import AppHeader from '../components/shared/headers/AppHeader';
import Home from '../pages/home/Home';



export default function AppRoutes() {



    useEffect(() => {


    }, []);


    return (
        <BrowserRouter basename='/website'>
            {/* // <BrowserRouter> */}
            {/* <TopHeader />
            <InnerHeader /> */}
            <AppHeader />
            <Routes>
                <Route path="/*" element={<Home />} />
            </Routes>
            <AppFooter />
        </BrowserRouter>
    )
}
