import React from "react";
import styled from "styled-components";
import axios from "axios";
import { config } from "dotenv";

import CreateEditModal from '../components/CreateEditModal';

config({ path: '.env' });

export default function Dashboard() {
    const [viajes, setViajes] = React.useState([]);

    const fetchData = async (filter) => {
        let url = `${process.env.REACT_APP_SERVER_URL}/transport`;
        
        if (filter) {
            url += `?placa=${filter}`;
        }

        const { data: { data } } = await axios.get(url);
        setViajes(data);

        return data;
    };

    const [uniqueViaje, setUniqueViaje] = React.useState({});
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleModal = (placa) => {
        if (placa) {
            fetchData(placa)
              .then(data => {
                setUniqueViaje(data?.[0]);
                setIsModalOpen(true);
              });
        } else {
            setUniqueViaje({});
            setIsModalOpen(true);
        }
    };

    const deleteViaje = async (id) => {
        let url = `${process.env.REACT_APP_SERVER_URL}/transport/${id}`;
        await axios.delete(url);
        await fetchData();
    }
    
    React.useEffect(() => {
        fetchData();
    }, []);

    return (
        <Container>
            <Btn onClick={() => handleModal()}>
                <p>Nuevo viaje</p>
            </Btn>
            <DashboardFrame>
                <table>
                    <thead>
                        <tr>
                            <td>Fecha</td>
                            <td>Placa</td>
                            <td>Conductor</td>
                            <td>Origen</td>
                            <td>Destino</td>
                            <td>Editar</td>
                            <td>Eliminar</td>
                        </tr>
                    </thead>
                    <tbody>
                        {viajes?.map((viaje, idx) => (
                            <tr key={idx}>
                                <td>{viaje.date && new Date(viaje.date).toLocaleString()}</td>
                                <td>{viaje.placa}</td>
                                <td>{viaje.conductor}</td>
                                <td>{viaje.origen}</td>
                                <td>{viaje.destino}</td>
                                <td className="edit" onClick={() => handleModal(viaje.placa)}>
                                    <i className="far fa-edit"></i>
                                </td>
                                <td className="delete" onClick={() => deleteViaje(viaje._id)}>
                                    <i className="far fa-trash-alt"></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DashboardFrame>

            <CreateEditModal
                uniqueViaje={uniqueViaje}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                fetchData={fetchData}
            />
        </Container>
    );
};

const Container = styled.div`
    color: white;
    display: flex;
    flex-direction: column;
`;

const DashboardFrame = styled.div`
    margin: auto;
    transform: translateY(100px);

    td {
        border: solid white;
        padding: 20px;
    }

    .edit {
        text-align: center;
        cursor: pointer;
        i {
            color: greenyellow;
        }
    }

    .delete {
        text-align: center;
        cursor: pointer;
        i {
            color: red;
        }
    }
`;

const Btn = styled.div`
    background-color: white;
    padding: 10px;
    color: black;
    width: 100px;
    text-align: center;
    border-radius: 4px;
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
`;