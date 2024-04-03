import React, { useState } from 'react';
import Form from "../../components/Form/index.tsx";
import "./index.scss";

const PageSignup = () => {

   
    return (
        <div className='signup-wrap'>
            <div className='logo-container'> 
                <img src='./logo.png' alt='LOGO' />
            </div>
            <Form/>
        </div>

    );
};

export default PageSignup;