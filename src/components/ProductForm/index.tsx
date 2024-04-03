import React, { useEffect, useReducer, useState } from 'react';
import "./index.scss";
import { useAppDispatch, useAppSelector } from '../../redux/hooks.ts';
import { addProduct, editProduct, getProducts } from '../../redux/productSlice.ts';
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


const ProductForm = ({ onHide = () => { }, guid}) => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const { name, details, image, imageName, count } = state;
    const reduxDispatch = useAppDispatch();
    const productList = useAppSelector((state) => state.products.productList); // Reading the productList
    const imgUrl = "https://info-shop-now.vijee.in/";
    const [error, setError] = useState<string>(''); // Error 


    const handleProductSubmit = (e) => {

        e.preventDefault();

        if (guid) {

            reduxDispatch(editProduct({ guid, name, details, count }))
                .then(data => {

                    if (data.payload.data.status === 200) {
                        onHide(); // Hide the product form
                        reduxDispatch(showMessage("Product Updated")); // Setting the toast message
                        reduxDispatch(getProducts()) // Displaying the ProductList
                            setTimeout(() => {
                              reduxDispatch(hideMessage()); // Hide the toast 
                            }, 2000);

                    } else {
                        onHide(); // Hide the product form
                        reduxDispatch(showMessage(data.payload.data.message)); // Setting the error as toast
                        setTimeout(() => {
                          reduxDispatch(hideMessage()); // Hide the toast
                        }, 2000);
                    }

                })
        } else {
            reduxDispatch(addProduct({ name, image, imageName, details, count }))
                .then(data => {

                    if (data.payload.data.status === 200) {

                        onHide(); // Hide the product form
                        reduxDispatch(showMessage("Product Added")); // Setting the toast message
                        reduxDispatch(getProducts()) // Displaying the ProductList
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
        if (guid) {
            const product = productList.find((product) => product.guid === guid); // Finding the product by comparing the passed guid & each product guid 
            if (product) {
                dispatch({              // Dispatching the details if product found
                    name: product.name, 
                    details: product.details,
                    count: product.count,
                    image: `${imgUrl}${product.image}`,
                    imageName: product.imageName
                });
            }
        }
    }, [guid, productList]);


    useEffect(() => {
       if (guid && count < 0) {
            setError("Minimum count can not be negative!");
        } else {
            setError("");
        }
    }, [guid, count]);


    function readFile(file) {

        const FR = new FileReader();

        FR.addEventListener("load", function (evt) {
            dispatch({ image: evt?.target?.result });

        });

        FR.readAsDataURL(file);

    }

    const handleImage = (e) => {
        const file = e.target.files[0];
        const filename = file.name;
        dispatch({ imageName: filename });
        readFile(file);

    }

    return (

        <>
            <form className='product-form-box' onSubmit={handleProductSubmit}>
                {guid ? <h3> Edit Product </h3> : <h3> Add Product </h3>}
                <label className='form-group'>
                    <div className='form-label'>  Name </div>
                    <input className='form-control' type="text" value={name} onChange={e => dispatch({ name: e?.target?.value })} placeholder="Name" required />
                </label>
                <label className='form-group'>
                    <div className='form-label'>  Image </div>
                    {guid ? <img src={image} alt={image} style={{ maxWidth: "100px" }} /> :
                        <input className='form-control password' type="file" onChange={handleImage} placeholder="" required/>}
                </label>
                <label className='form-group'>
                    <div className='form-label'>  Details </div>
                    <input className='form-control' type="text" value={details} onChange={e => dispatch({ details: e?.target?.value })} placeholder="Details" required />

                </label>
                <label className='form-group'>
                    <div className='form-label'> Count </div>
                    {guid ? <input className='form-control password' type="number" min="0" value={count} onChange={e => dispatch({ count: e?.target?.value })} placeholder="Count" required /> :
                        <input className='form-control password' type="number" min="1" value={count} onChange={e => dispatch({ count: e?.target?.value })} placeholder="Count" required />}
                    {error && <p style={{ color: "red" }}> {error} </p>}
                </label>

                <div className='product-form-footer'>

                    {guid ? <button className='btn-primary' type="submit"> Edit Product </button> :
                        <button className='btn-primary' type="submit"> Add Product </button>}
                </div>
            </form>

        </>
    )
};

export default ProductForm;

