import React, { useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice.ts';
import "./index.scss";
import { Link } from 'react-router-dom';
import { hideMessage, showMessage } from '../../redux/toastSlice.ts';

const reducer = (state, action) => {
    return {
        ...state,
        ...action
    }
};

const initialState = {
    username: '',
    password: '',
}

const PageLogin = () => {
    const reduxDispatch = useDispatch();
    const [state, dispatch] = useReducer(reducer, initialState);
    const { username, password } = state;
   


    const loginFn = e => {
        e.preventDefault();
        reduxDispatch(login({ username, password }))
            .then(
                data => {
                    if (data.payload.data.status !== 200) {
                        reduxDispatch( showMessage(data.payload.data.message)); // Setting the error as toast
                        setTimeout(() => {
                            reduxDispatch(hideMessage()); // Hiding the toast
                        }, 2000);

                    }
                }
            );

    };



    return (
        <div className='login-wrap'>
            <div className='logo-container'>
                <img src='./logo.png' alt='LOGO' />
            </div>
            <form className='login-box' onSubmit={loginFn}>
                <h3>Login</h3>
                <label className='form-group'>
                    <div className='form-label'>Username</div>
                    <input className='form-control' type="email" value={username} onChange={e => dispatch({ username: e?.target?.value })} placeholder="Username" required />
                </label>
                <label className='form-group'>
                    <div className='form-label'>Password</div>
                    <input className='form-control password' type="password" value={password} onChange={e => dispatch({ password: e?.target?.value })} placeholder="Password" required />
                </label>
                <div className='login-footer'>
                    <Link to="/signup">Signup </Link>
                    <button className='btn-primary' type="submit">Login</button>
                </div>
            </form>
           
        </div>
    );
};

export default PageLogin;
