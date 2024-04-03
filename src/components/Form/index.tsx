import React, { useEffect, useReducer, useState } from 'react';
import "./index.scss";
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../redux/authSlice.ts';
import { useAppDispatch, useAppSelector } from '../../redux/hooks.ts';
import { getUsers, addUser } from '../../redux/userSlice.ts';
import { showMessage, hideMessage } from '../../redux/toastSlice.ts';



interface State {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    confirmPassword: string;
    type: number;
}

type reducerAction = Object;

const reducer = (state: State, action: reducerAction) => {
    return {
        ...state,
        ...action
    }
};

const initialState: State = {
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    confirmPassword: '',
    type: 2
}


const Form = ({ onHide = () => { } }) => {

    const { userDetails, jwt } = useAppSelector(state => state.auth);
    const navigate = useNavigate(); 
    const reduxDispatch = useAppDispatch(); // To dispatch store actions
    const [state, dispatch] = useReducer(reducer, initialState);
    const { username, password, firstname, lastname, confirmPassword, type } = state; 
    const [error, setError] = useState<string>(''); // Errors


    const SignupFn = e => {

        e.preventDefault();

        if (password === confirmPassword) { 

            if (userDetails && userDetails.type === 1) { // Checking if the userdetails exist & is admin 

                reduxDispatch(addUser({ name: `${firstname} ${lastname}`, username, password, type, status:1}))
                    .then(data => {

                        if (data.payload.data.status === 200) {
                            onHide(); // Hide the Signup form
                            reduxDispatch(getUsers()) // Displaying the UserList
                            reduxDispatch(showMessage("User Added")); // Setting the toast message
                            setTimeout(() => {
                                reduxDispatch(hideMessage()); // Hide the toast 
                            }, 2000);


                        } else {
                            onHide(); // Hide the Signup form
                            reduxDispatch(showMessage(data.payload.data.message)); // Setting the error as toast
                            setTimeout(() => {
                                reduxDispatch(hideMessage()); // Hide the toast 
                            }, 2000);
                        }

                    })

            } else {

                reduxDispatch(signup({ name: `${firstname} ${lastname}`, username, password }))
                    .then(
                        data => {
                            if (data.payload.data.status === 200) {
                                reduxDispatch(showMessage("User Added")); // Setting the toast message
                                setTimeout(() => {
                                    reduxDispatch(hideMessage()); // Hide the toast 
                                    navigate('/'); // Navigate 
                                }, 1000);


                            } else {
                                reduxDispatch(showMessage(data.payload.data.message)); // Setting the error as toast
                                setTimeout(() => {
                                    reduxDispatch(hideMessage()); // Hide the toast
                                }, 2000);
                            }
                        }
                    );
            }
        }
        else {
            setError("Password doesn't match"); // Setting error message
        }


    };

    return (

        <>
            <form className='signup-box' onSubmit={SignupFn}>
                {userDetails && userDetails.type === 1 ? <h3> Add User </h3> : <h3>  Signup </h3>}
                <label className='form-group'>
                    <div className='form-label'> First Name </div>
                    <input className='form-control' type="text" value={firstname} onChange={e => dispatch({ firstname: e?.target?.value })} placeholder="First Name" required />
                </label>
                <label className='form-group'>
                    <div className='form-label'> Last Name </div>
                    <input className='form-control password' type="text" value={lastname} onChange={e => dispatch({ lastname: e?.target?.value })} placeholder="Last Name" />
                </label>
                <label className='form-group'>
                    <div className='form-label'> Username </div>
                    <input className='form-control' type="email" value={username} onChange={e => dispatch({ username: e?.target?.value })} placeholder="Username" required />

                </label>
                <label className='form-group'>
                    <div className='form-label'> Password </div>
                    <input className='form-control password' type="password" value={password} onChange={e => dispatch({ password: e?.target?.value })} placeholder="Password" required />
                </label>
                <label className='form-group'>
                    <div className='form-label'> Confirm Password </div>
                    <input className={error ? 'error-border' : 'form-control password'} type="password" value={confirmPassword} onChange={e => dispatch({ confirmPassword: e?.target?.value })} placeholder="Confirm Password" required />
                    {error && <p style={{ color: "red" }}> {error} </p>}
                </label>


                {userDetails && userDetails.type === 1 &&
                    <label className='form-group'>
                        <div className='form-label'> User Type </div>
                        <input type="radio" value="1" checked={type === 1} onChange={e => dispatch({ type: 1 })} /> Admin
                        <input style={{ marginLeft: "30px" }} type="radio" value="2" checked={type === 2} onChange={e => dispatch({ type: 2 })} /> User
                    </label>
                }

                <div className='signup-footer'>
                    <Link to="/"> Login </Link>
                    <button className='btn-primary' type="submit"> Signup </button>
                </div>
            </form>

        </>

    );
};

export default Form;