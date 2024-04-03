import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/index.tsx';
import MobileHeader from '../../components/MobileHeader/index.tsx';

const Layout = () => {

    return (
        <div className='page'>
            <header>
                <Header />
                <MobileHeader />
            </header>
            <section> <Outlet /> </section>
        </div>
    );
};

export default Layout;
