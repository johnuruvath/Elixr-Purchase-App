import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks.ts';
import { getProducts, deleteProduct } from '../../redux/productSlice.ts';
import "./index.scss";
import Table from '../../components/table/index.tsx';
import { ProductItem } from '../../redux/productSlice.ts';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ProductForm from '../../components/ProductForm/index.tsx';
import PurchaseForm from '../../components/PurchaseForm/index.tsx';
import { showMessage, hideMessage } from '../../redux/toastSlice.ts';

const PageProducts = () => {

    const { userDetails } = useAppSelector(state => state.auth);
    const imgUrl = "https://info-shop-now.vijee.in/";
    const [show, setShow] = useState<boolean>(false); // Delete Modal
    const [showFormModal, setShowFormModal] = useState<boolean>(false); // product Form Modal
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    const [search, setSearch] = useState(String); // Search string
    const [error, setError] = useState<string>("");
    const [showPurchaseFormModal, setShowPurchaseFormModal] = useState<boolean>(false); // Purchase Form modal


    const columns = [{
        label: "Image", accessor: "image", sortable: false, basecolumn: false,
        render: (row: ProductItem) => <img style={{ width: "50px" }} src={`${imgUrl}${row.image}`} alt={row.name} />

    },
    { label: "Name", accessor: "name", sortable: true, basecolumn: true },

    userDetails && userDetails.type === 1 && { label: "Stock", accessor: "count", sortable: false, basecolumn: false },

    {
        label: "Actions", render: (row: ProductItem) => {
            return <div>
                {userDetails && userDetails.type === 1 ? (
                    <>
                        <span className="material-symbols-outlined" onClick={() => {
                            setSelectedProductId(row.guid);
                            setShowFormModal(true);
                        }}> edit </span>

                        <span
                            onClick={() => {
                                setSelectedProductId(row.guid);
                                setShow(true);
                            }}
                            style={{ color: "red" }}
                            className="material-symbols-outlined"
                        >
                            delete
                        </span>

                        <span className="material-symbols-outlined" onClick={() => {
                            setSelectedProductId(row.guid);
                            setShowPurchaseFormModal(true);
                        }}> local_mall </span>
                    </>
                ) : (
                    <span className="material-symbols-outlined" onClick={() => {
                        setSelectedProductId(row.guid);
                        setShowPurchaseFormModal(true);
                    }}> local_mall
                    </span>
                )}
            </div>
        }, accessor: "guid"
    },]

    const productListOriginal = useAppSelector((state) => state.products.productList); // Reading the productList
    const [productList, setProductList] = useState(Array<ProductItem>); // Creating a copy of ProductList array
    const reduxDispatch = useAppDispatch();

    useEffect(() => {
        reduxDispatch(getProducts()) 
    }, [reduxDispatch])


    useEffect(() => {
        setProductList(productListOriginal.filter((item) => {
            return item.name.toLowerCase().includes(search.toLowerCase()) 
        }))
    }, [productListOriginal, search])

    const handleClose = () => {
        setShow(false); // Hide the delete modal
        setSelectedProductId(null);
    };

    const handleDelete = () => {
        if (selectedProductId) {
            reduxDispatch(deleteProduct(selectedProductId))
                .then((data) => {
                    if (data.payload.data.status === 200) {
                        reduxDispatch(showMessage("Product Deleted")); // Setting the toast message 
                        reduxDispatch(getProducts()) 
                        setTimeout(() => {
                            reduxDispatch(hideMessage()); // Hide the toast
                        }, 2000);
                        handleClose(); // Hide the delete modal
                    } else {
                        reduxDispatch(showMessage(data.payload.data.message)); // Setting the error as toast
                        setTimeout(() => {
                            reduxDispatch(hideMessage()); // Hide the toast
                        }, 2000);
                    }
                });
        }
        handleClose(); // Hide the delete modal
    };

    const toggleFormModal = () => {
        setShowFormModal(!showFormModal); // Hide the product form modal
        setSelectedProductId("");
    }

    const togglePurchaseFormModal = () => {
        setShowPurchaseFormModal(!showPurchaseFormModal); // Hide the purchase form modal
        setSelectedProductId("");
    }


    return (

        <div className='product-box'>
            <div className='product-header-wrap'>
                <div className='product-search-container'>
                    <input type="text" placeholder='Search Product' value={search} onChange={e => setSearch(e?.target?.value)} />

                </div>
                {userDetails && userDetails.type === 1 &&
                    <div className='add-product-container' onClick={toggleFormModal}>
                        <span className="material-symbols-outlined">
                            category
                        </span>
                        <span className='add-product'>  Add Product </span>
                    </div>}

            </div>

            <Table columns={columns} data={productList} />

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton onClick={handleClose}>
                    <Modal.Title> Buy It Now </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p> Do you want to delete? </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={handleDelete}> Yes </Button>
                    <Button variant="secondary" onClick={handleClose}> No </Button>
                </Modal.Footer>
            </Modal >


            <Modal className='form-add-edit-product-modal' show={showFormModal} onHide={toggleFormModal}>
                <ProductForm onHide={toggleFormModal} guid={selectedProductId} />
            </Modal >

            <Modal className='form-add-edit-purchase-modal' show={showPurchaseFormModal} onHide={togglePurchaseFormModal}  >
                <PurchaseForm onHide={togglePurchaseFormModal} productId={selectedProductId} />
            </Modal >

        </div>

    );
};

export default PageProducts;
