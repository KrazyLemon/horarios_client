import Modal from 'react-modal';
import { Icon } from '@iconify/react/dist/iconify.js';
import HorarioClassic from '../Horarios/HorarioClassic';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import Loading from '../Generals/Loading';
import { revertirMatriz } from '../../helper/helper';

export default function PutModal({ isOpen, onRequestClose, grupo, profesList, materias }) {

    const URL = "http://localhost:8080/";
    const [loading, setLoading] = useState(true);
    const [salon, setSalon] = useState(null);

    const getSalon = async () => {
        try {
            const response = await fetch(`${URL}/salones/salon/${grupo.salon}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSalon(data);
        } catch (error) {
            //console.error('Failed to fetch salon:', error);
            //toast.error('Failed to fetch salon');
        }
    };
    const put = async () => {
        try {

            await putGrupo();
            await putSalon();
            await Promise.all(profesList.map(profesor => putProfesor(profesor)));
            onRequestClose();
            window.location.href = '/grupos';
            toast.success('Cambios guardados exitosamente');
        } catch (error) {
            toast.error(error + ' Error al guardar los cambios');
        }
    }
    const putSalon = async () => {
        if (grupo.turno === 'm') {
            setSalon({
                ...salon, g_m: grupo.id
            })
        } else {
            setSalon({
                ...salon, g_v: grupo.id
            })
        }
        //console.log(salon);
        const response = await fetch(`${URL}/salones/${salon.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(salon),
        });
        return response.json();
    }
    const putGrupo = async () => {
        const newGrupo = {
            ...grupo,
            horario: revertirMatriz(grupo.horario)
        }
        const response = await fetch(`${URL}/grupos/${grupo.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newGrupo),
        });
        return response.json();
    }
    const putProfesor = async (profesor) => {
        const response = await fetch(`${URL}/profesores/${profesor.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profesor),
        });
        return response.json();
    }

    useEffect(() => {
        setTimeout(() => {
            if (grupo != null) {
                getSalon(grupo.salon);
            }
            setLoading(false);
        }, 1000);
    }, [grupo]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="w-5/6 flex items-center mt-6 m-auto bg-white rounded-md shadow-md p-3 "
            overlayClassName="modal-overlay"
        >
            {loading ? (
                <div className='flex justify-center items-center w-full h-full'>
                    <Loading />
                </div>
            ) : (
                <div className='flex flex-col space-y-2 w-full'>
                    <h1 className='text-2xl font-semibold flex space-x-2'>
                        <Icon icon="fluent:save-24-regular" width="30" height="30" className="bg-green-500 text-white rounded-full p-1 me-1" />
                        Guardar Cambios
                    </h1>
                    <div>
                        <h1 className='text-lg font-semibold '>Grupo: {grupo.grupo} </h1>
                        <h1 className='text-lg font-semibold'>Salon: {grupo.salon}</h1>
                        <HorarioClassic objeto={grupo} materias={materias} />
                    </div>
                    <h1 className='text-lg font-semibold flex w-full justify-center'> Profesores Asignados al grupo: </h1>
                    <table className="table-auto w-full h-full">
                        <thead className="bg-gray-500 text-white">
                            <tr>
                                <th className="px-2 py-1">Profesor</th>
                                <th className="px-2 py-1">Horas</th>
                                <th className="px-2 py-1">Horario</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profesList && profesList.map((profesor) => (
                                <tr key={profesor.nombre}>
                                    <td className="text-sm border px-1 py-1 ">{profesor.nombre} {profesor.apellido}</td>
                                    <td className="text-sm border px-1 py-1 ">+{profesor.horas}</td>
                                    <td className='text-sm border px-1 py-1 flex space-x-2'>
                                        <Icon icon="fluent:checkmark-circle-20-regular" width="20" height="20" className='text-green-500 me-2' />
                                        Horario Actualizado
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='flex justify-center'>
                        <a className='bg-green-500 text-white p-2 rounded-md mt-2 cursor-pointer' onClick={put}>Guardar Cambios</a>
                    </div>
                </div>
            )}
        </Modal>
    )
}
