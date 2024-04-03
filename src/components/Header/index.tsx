import React, { useState } from 'react';
import './index.scss';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { logOut } from '../../redux/authSlice.ts';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks.ts';


const Header = () => {

    const [currentPath, setCurrentPath] = useState(window.location.pathname); // Reading the current path 
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { userDetails } = useAppSelector((state) => state.auth);

    const handleLogOut = () => {
        dispatch(logOut())
        setTimeout(() => {
            navigate('/'); // Navigating to the login 
        }, 100)
    }

    const handleNavLinkClick = (path) => {
        setCurrentPath(path); // Setting the current path
    }


    return (
        <div className='header-wrap'>
            <div className='logo-container'>
                <img src='./logo.png' alt='LOGO' />
            </div>
            <nav>
                <div className='menu-container'>
                    <ul>
                        <li>  <Link to="/" className={currentPath === '/' ? 'active' : ''} onClick={() => handleNavLinkClick('/')} >  Home </Link> </li>
                        {userDetails && userDetails.type === 1 && <li> <Link to="/users" className={currentPath === '/users' ? 'active' : ''} onClick={() => handleNavLinkClick('/users')}>  Users </Link> </li>}
                        <li>  <Link to="/products" className={currentPath === '/products' ? 'active' : ''} onClick={() => handleNavLinkClick('/products')}> Products </Link>  </li>
                        <li>  <Link to="/purchases" className={currentPath === '/purchases' ? 'active' : ''} onClick={() => handleNavLinkClick('/purchases')}> Purchases </Link>  </li>
                        <li> <DropdownButton className='dropDown-Icon' id="dropdown-basic-button" title={<span className="material-symbols-outlined">account_circle</span>}>
                            <div className='dropDown-box'>
                                <span className="material-symbols-outlined"> account_circle </span>
                                <h6> {userDetails.username} </h6> <br />
                                <button className='btn-primary' onClick={handleLogOut}>Logout</button>
                            </div>
                        </DropdownButton>
                        </li>

                    </ul>
                </div>
            </nav>
        </div>

    );
};

export default Header;