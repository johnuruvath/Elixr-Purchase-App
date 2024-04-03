import React, { useEffect, useReducer, useState } from 'react';
import "./index.scss";
import { useAppDispatch, useAppSelector } from '../../redux/hooks.ts';
import { addPurchase, getPurchases } from '../../redux/purchaseSlice.ts';
import { showMessage, hideMessage } from '../../redux/toastSlice.ts';


interface State {
    name: string;
    // image: string;
    details: string;
    count: number;
    image: string;
    imageName: string;
}

type reducerAction = Object;

const reducer = (state: State, action: reducerAction) => {
    return {
        ...state,
        ...action
    }
};

const initialState: State = {
    name: '',
    // image: '',
    details: '',
    count: 1,
    image: '',
    imageName: ''

}


const PurchaseForm = ({ onHide = () => { }, productId }) => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const { name, details, image, imageName, count } = state;
    const reduxDispatch = useAppDispatch();
    const productList = useAppSelector((state) => state.products.productList);
    const imgUrl = "https://info-shop-now.vijee.in/";
    const [error, setError] = useState<string>('');


    const handlePurchase = (e) => {

        e.preventDefault();

        if (productId) {

            reduxDispatch(addPurchase({ productId, count }))
                .then(data => {

                    if (data.payload.data.status === 200) {
                        onHide();  // Hide the purchase form
                        reduxDispatch(showMessage("Purchase Added")); // Setting the toast message
                        setTimeout(() => {
                            reduxDispatch(hideMessage()); // Hide the toast
                        }, 2000);

                    } else {
                        onHide();
                        reduxDispatch(showMessage(data.payload.data.message));  // Setting the error as toast
                        setTimeout(() => { 
                            reduxDispatch(hideMessage()); // Hide the toast
                        }, 2000);
                    }

                })
        }
    }

    useEffect(() => {
        if (productId) {
            const product = productList.find((product) => product.guid === productId); // Finding the product by comparing the passed guid & each product guid
            if (product) {
                dispatch({ // Dispatch details if product found
                    name: product.name,
                    details: product.details,
                    // count: product.count,
                    image: `${imgUrl}${product.image}`,
                    imageName: product.imageName
                });
            }
        }
    }, [productId, productList]);


    useEffect(() => {
        if (count <= 0) {
            setError("Minimum Count must be 1!");
        } else {
            setError("");
        }
    }, [count])

    return (

        <>
            <form className='purchase-form-box' onSubmit={handlePurchase}>
                <h3> {name} </h3>
                <p> {details} </p>

                <label className='form-group'>
                    <img src={image} alt={image} style={{ maxWidth: "100px" }} />
                </label>

                <label className='form-group'>
                    <div className='form-label'> Count </div>
                    <input className='form-control password' type="number" min="1" value={count} onChange={e => dispatch({ count: e?.target?.value })} placeholder="Count" required />
                    {error && <p style={{ color: "red" }}> {error} </p>}
                </label>

                <div className='purchase-form-footer'>

                    <button className='btn-primary' type="submit"> Add To Cart  </button>
                    <button className='btn btn-secondary' type="button" onClick={onHide}> Cancel </button>
                </div>
            </form>

        </>
    )
};

export default PurchaseForm;

