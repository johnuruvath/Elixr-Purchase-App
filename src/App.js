import React from 'react';
import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PageLogin from './pages/login';
import { useSelector } from 'react-redux';
import PageSignup from './pages/signup/index.tsx';
import PageDashboard from './pages/dashboard/index.tsx';
import PageProducts from './pages/products/index.tsx';
import PagePurchases from './pages/purchases/index.tsx';
import Layout from './pages/layout/index.tsx';
import PageUsers from './pages/users/index.tsx';
import Toast from 'react-bootstrap/Toast';
import { useAppSelector } from './redux/hooks.ts';


function App() {

  const { userDetails, jwt } = useSelector(state => state.auth); // userDetails & jwt
  const { message, show } = useAppSelector(state => state.toast); // Toast visibility & message

  return (

    <BrowserRouter>
      <Routes>
        {(userDetails && jwt) ? <>
          <Route path="/" element={<Layout />}>
            <Route index element={<PageDashboard />} />
            {userDetails && userDetails.type === 1 && <Route path="users" element={<PageUsers />} />}
            <Route path="products" element={<PageProducts />} />
            <Route path="purchases" element={<PagePurchases />} />
            <Route path="/*" element={<div> 404 Not found</div>} />
          </Route>
        </> : <>
          <Route path="/" element={<PageLogin />} />
          <Route path="/signup" element={<PageSignup />} />
          <Route path="/*" element={<div> 404 Not found </div>} />
        </>}
      </Routes>
      {show &&
        <Toast className='toast-container'>
          <Toast.Body>  {message}  </Toast.Body>
        </Toast>}

    </BrowserRouter>
  );
}

export default App;
