import React, { useEffect, useState } from 'react';
import './index.scss';
import { useAppDispatch, useAppSelector } from '../../redux/hooks.ts';
import { getUsers, deleteUser } from '../../redux/userSlice.ts';
import Table from '../../components/table/index.tsx';
import { User } from '../../redux/userSlice.ts';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from '../../components/Form/index.tsx';
import { showMessage, hideMessage } from '../../redux/toastSlice.ts';

const PageUsers = () => {

    const [show, setShow] = useState<boolean>(false); // Delete modal
    const [showFormModal, setShowFormModal] = useState<boolean>(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [search, setSearch] = useState(String);  // Search string

    const columns = [{ label: "Name", accessor: "name", sortable: true, basecolumn: true },
    { label: "Username", accessor: "username", sortable: true, basecolumn: false },

    {
        label: "Actions", render: (row: User) => {
            return <div>
                <span onClick={() => {
                    setSelectedUserId(row.guid);
                    setShow(true);
                }}

                    style={{ color: "red" }} className="material-symbols-outlined">
                    delete
                </span> </div>;
        }, accessor: "guid"
    },]

    const reduxDispatch = useAppDispatch();
    const userListOriginal = useAppSelector((state) => state.users.userList); // Reading the userList
    const [userList, setUserList] = useState(Array<User>); // Creating a copy of userList array 

    useEffect(() => {
        reduxDispatch(getUsers())
    }, [reduxDispatch])

    useEffect(() => {
        setUserList(userListOriginal.filter((item) => {
            return item.name.toLowerCase().includes(search.toLowerCase())
        }))
    }, [userListOriginal, search])

    const handleClose = () => {
        setShow(false); // Hide delete modal
        setSelectedUserId(null);
    };

    const handleDelete = () => {
        if (selectedUserId) {

            reduxDispatch(deleteUser(selectedUserId))
                .then((data) => {
                    if (data.payload.data.status === 200) {
                        reduxDispatch(showMessage("User Deleted")); // Setting the toast message 
                        reduxDispatch(getUsers())
                        setTimeout(() => {
                            reduxDispatch(hideMessage()); // Hide the toast message
                        }, 2000);
                        handleClose(); // Hide the delete modal
                    } else {
                        reduxDispatch(showMessage(data.payload.data.message));
                        setTimeout(() => {
                            reduxDispatch(hideMessage()); // Hide the toast message 
                        }, 2000);
                    }
                });
        }
        handleClose(); // Hide the delete modal
    };

    const toggleFormModal = () => {
        setShowFormModal(!showFormModal); 
    }


    return (

        <div className='user-box'>
            <div className='user-header-wrap'>
                <div className='user-search-container'>
                    <input type="text" placeholder='Search User' value={search} onChange={e => setSearch(e?.target?.value)} />

                </div>

                <div className='add-user-container' onClick={toggleFormModal}>
                    <span className="material-symbols-outlined">
                        person_add
                    </span>
                    <span className='add-user'>  Add User </span>
                </div>

            </div>

            <Table columns={columns} data={userList} />

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

            </Modal>


            <Modal className='form-add-edit-user-modal' show={showFormModal} onHide={toggleFormModal} >
                <Form onHide={toggleFormModal}  />
            </Modal>

        </div>

    );
};

export default PageUsers;
