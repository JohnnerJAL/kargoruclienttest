import React from "react";
import styled from "styled-components";
import axios from "axios";

export default function CreateEditModal({ uniqueViaje, isModalOpen, setIsModalOpen, fetchData }) {
    const [viajeForm, setViajeForm] = React.useState({});

    React.useEffect(() => {
        setViajeForm(uniqueViaje)
    }, [uniqueViaje]);

    const closeModal = () => {
        setIsModalOpen(false);
    }

    const changeForm = (e) => {
        setViajeForm({
            ...viajeForm,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!uniqueViaje._id) {
            let url = `${process.env.REACT_APP_SERVER_URL}/transport`;
            await axios.post(url, viajeForm);
        } else {
            let url = `${process.env.REACT_APP_SERVER_URL}/transport/${uniqueViaje._id}`;
            await axios.patch(url, viajeForm);
        }

        await fetchData();
        setIsModalOpen(false);
    }

    return (
        <Container className={isModalOpen ? 'show' : 'hidden'}>
            <Modal>
                <p onClick={closeModal}>X</p>
                <form onSubmit={handleSubmit}>
                    <p>Placa</p>
                    <input type="text" name="placa" value={viajeForm['placa'] || ''} onChange={changeForm} required/>
                    <p>Conductor</p>
                    <input type="text" name="conductor" value={viajeForm['conductor'] || ''} onChange={changeForm} required/>
                    <p>Origen</p>
                    <input type="text" name="origen" value={viajeForm['origen'] || ''} onChange={changeForm} required/>
                    <p>Destino</p>
                    <input type="text" name="destino" value={viajeForm['destino'] || ''} onChange={changeForm} required/>
                    <input type="submit"
                        value={uniqueViaje?._id ? 'Editar' : 'Crear'}
                    />
                </form>
            </Modal>
        </Container>
    );
};

const Container = styled.div`
    position: absolute;
    top: 0%;
    right: 0%;
    bottom: 0%;
    left: 0%;
    background-color: white;
    &.hidden {
        display: none;
    }
    &.show {
        display: flex;
    }
`;

const Modal = styled.div`
    background-color: black;
    margin: auto;

    > p {
        padding: 4px;
        cursor: pointer;
    }
    
    form {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 40px;

        input {
            padding: 4px;
            margin-bottom: 20px;
        }
        
        & input:last-child {
            margin-top: 50px;
            width: 60px;
            padding: 4px;
            margin: auto;
            cursor: pointer;
        }
    }
`;