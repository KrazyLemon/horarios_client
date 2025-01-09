import axios from 'axios';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { checkhorario, checkSalon, deleteAsignacion, deleteGrupoDeHorario,filterLista, ordenarPorSemestre } from '../helper/helper';
import ToolTip from '../components/Generals/ToolTip';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
export default function GruposPage() {

    const [grupos, setGrupos] = useState([]);
    const [gruposFiltered, setGruposFiltered] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const url = 'http://localhost:8080/api/v1';
    const regex = /^3[1-8]{2}[MV]$/;

    const fetchGrupos = async () => {
        try {
            const response = await axios.get(`${url}/grupos`);
            //console.log(response.data);
            const listaOrdenada = ordenarPorSemestre(response.data);
            setGrupos(listaOrdenada);
            setGruposFiltered(listaOrdenada);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    }
    const filterGruposByTurno = (turno) => {
        if (turno === "default") {
            setGruposFiltered(grupos);
        } else {
            setGruposFiltered(grupos.filter(grupo => grupo.turno === turno));
        }
    }
    const filterGruposBySemestre = (semestre) => {
        if (semestre === "default") {
            setGruposFiltered(grupos);
        } else {
            setGruposFiltered(grupos.filter(grupo => grupo.semestre === semestre));
        }
    }
    const handleOpenModal = () => {
        setIsOpen(!isOpen);
    }
    const postGrupo = async () => {
        const turno = document.getElementById('post_turno').value;
        const semestre = document.getElementById('post_semestre').value;
        const nombre = document.getElementById('grupo').value;
        if (!regex.test(nombre)) {
            toast.error('El grupo debe tener el formato 3XXM o 3XXV');
            return;
        }
        const asignaciones = {
            id: "",
            objeto: "",
            materia: ""
        }
        const grupo = {
            turno: turno,
            semestre: parseInt(semestre),
            grupo: nombre,
            horario: Array(5).fill(Array(8).fill('')),
            asignaciones: Array(1).fill(asignaciones),
            salon: '',
        }
        try {
            await axios.post(`${url}/grupos`, grupo);
            fetchGrupos();
            handleOpenModal();
            toast.success('Grupo creado con exito');
        } catch (error) {
            console.error(error);
            toast.error(error + 'Error al crear grupo');
        }
    }
    const deleteGrupo = async (id) => {
        const grupo = grupos.find(grupo => grupo.id === id);
        const confirmDelete = window.confirm(`¿Estas seguro de eliminar el grupo ${grupo}?`);
        if (!confirmDelete) return;
        try {
            const profes = await Promise.all(grupo.asignaciones.map(async asignacion => {
                if (asignacion.objeto === "" || asignacion.objeto === "Teacher") {
                    return null;
                }
                const response = await fetch(`${url}/profesores/${asignacion.objeto}`);
                const data = await response.json();
                return data;
            }));
            const newProfes = filterLista(profes).map(profe => {
                profe = deleteGrupoDeHorario(profe, id);
                return profe;
            });
            await Promise.all(newProfes.map(async profe => {
                await axios.put(`${url}/profesores/${profe.id}`, profe);
            }));
            await axios.delete(`${url}/grupos/${id}`);
            fetchGrupos();
            toast.success('Grupo eliminado con exito');
        } catch (error) {
            toast.error('Error al eliminar grupo');
        }
    }
    const resetGrupo = async (id) => {
        const grupo = grupos.find(grupo => grupo.id === id);
        const confirmReset = window.confirm(`¿Estas seguro de deshacer los cambios esto eliminara el horario y salon del grupo?`);
        if (!confirmReset) return;
        try {
            const profes = await Promise.all(grupo.asignaciones.map(async asignacion => {
                if (asignacion.objeto === "" || asignacion.objeto === "Teacher") {
                    return null;
                }
                const response = await fetch(`${url}/profesores/${asignacion.objeto}`);
                const data = await response.json();
                return data;
            }));
            const newProfes = filterLista(profes).map(profe => {
                profe = deleteGrupoDeHorario(profe, id);
                return profe;
            });
            await Promise.all(newProfes.map(async profe => {
                await axios.put(`${url}/profesores/${profe.id}`, profe);
            }));
            grupo.horario = Array(5).fill(Array(8).fill(''));
            grupo.salon = '';
            grupo.asignaciones = Array(1).fill({
                id: "",
                objeto: "",
                materia: ""
            });
            await axios.put(`${url}/grupos/${id}`, grupo);
            fetchGrupos();
            toast.success('Cambios deshechos con exito');
        } catch (error) {
            toast.error('Error al deshacer cambios');
        }
    }

    useEffect(() => {
        fetchGrupos();
    }, []);
    return (
        <>
            {loading ? <div className="spinner"></div> : (
                <div className='flex flex-col w-full  h-screen mx-2 overflow-y-auto '>
                    <div className='flex w-full  items-center mt-2 bg-white rounded-md shadow-md p-3 space-x-2 '>
                        <Icon icon="fluent:people-20-regular" width="40px" height="40px" className='rounded-full bg-cyan-400 p-1 text-white ' />
                        <h1 className="font-semibold text-2xl">Grupos</h1>
                    </div>
                    <div className='items-center h-fit mt-2 '>
                        <div className='flex bg-white rounded-md shadow-md p-3 justify-between items-center'>
                            <div className="flex  text-sm font-semibold space-x-1">
                                <h1 className=''>Turnos:</h1>
                                <select name="turno" id="turno" className='font-normal' onChange={(e) => filterGruposByTurno(document.getElementById('turno').value, e.target.value)}>
                                    <option value="default">Elige un turno</option>
                                    <option value="M">Matutino</option>
                                    <option value="V">Vespertino</option>
                                </select>
                                <h1 className=''>Semestre:</h1>
                                <select name="semestre" id="semestre" className='font-normal' onChange={(e) => filterGruposBySemestre(e.target.value, document.getElementById('semestre').value)}>
                                    <option value="default">Elige un semestre</option>
                                    <option value="1">Primero</option>
                                    <option value="2">Segundo</option>
                                    <option value="3">Tercero</option>
                                    <option value="4">Cuarto</option>
                                    <option value="5">Quinto</option>
                                    <option value="6">Sexto</option>
                                    <option value="7">Septimo</option>
                                    <option value="8">Octavo</option>
                                </select>
                                {
                                    gruposFiltered.length !== grupos.length ? (
                                        <a className='flex space-x-1 items-center text-red-500 cursor-pointer' onClick={() => setGruposFiltered(grupos)}>
                                            <Icon icon="fluent:filter-dismiss-20-regular" width="20" height="20" />
                                            Eliminar filtros
                                        </a>
                                    ) : null
                                }
                            </div>
                            <div className="flex  text-sm font-semibold space-x-1">
                                <p className=''>Total de grupos: {gruposFiltered.length}</p>
                            </div>
                        </div>
                        <div className='grid grid-cols-6 gap-2 mt-2 pb-2'>
                            <div className="flex rounded-md shadow-md bg-white border border-gray-500" >
                                <a onClick={handleOpenModal}
                                    className="flex w-full m-2 flex-col-reverse items-center justify-center p-2 border-dashed border-gray-500 text-gray-500 border rounded hover:bg-gray-200 hover:text-black cursor-pointer" >
                                    <h1>Crear Grupo</h1>
                                    <Icon icon="fluent:people-add-20-regular" width="30" height="30" />
                                </a>
                            </div>
                            {gruposFiltered.map((grupo) => (
                                <div key={grupo.id} className="space rounded-md shadow-md bg-white pt-2 border border-gray-500">
                                    <h2 className='text-md flex items-center justify-between font-semibold px-2'>
                                        Grupo: {grupo.grupo}
                                        <div className='flex text-sm text-white spaces-x-1'>
                                            <span>
                                                {checkSalon(grupo.salon) === "No tiene salon" ? (
                                                    <ToolTip tooltip="No tiene salon asignado">
                                                        <Icon icon="fluent:document-error-20-regular" width="30" height="30" className='text-red-500' />
                                                    </ToolTip>
                                                ) : (
                                                    <ToolTip tooltip={`Salon: ${grupo.salon}`} >
                                                        <Icon icon="fluent:document-checkmark-20-regular" width="30" height="30" className='text-green-500' />
                                                    </ToolTip>
                                                )}
                                            </span>
                                            <span>
                                                {checkhorario(grupo.horario) === "Horario Vacio" ? (
                                                    <ToolTip tooltip="No tiene Horario asignado">
                                                        <Icon icon="fluent:calendar-error-20-regular" width="30" height="30" className='text-red-500' />
                                                    </ToolTip>
                                                ) : (
                                                    <ToolTip tooltip={`Horario Asignado`} >
                                                        <Icon icon="fluent:calendar-checkmark-20-regular" width="30" height="30" className='text-green-500' />
                                                    </ToolTip>
                                                )}
                                            </span>
                                        </div>
                                    </h2>
                                    <div className='flex px-2 text-sm gap-1'>
                                        <h1 className='font-semibold' >Turno:</h1>
                                        <p>{grupo.turno === "M" ? "Matutino" : grupo.turno === "V" ? "Vespertino" : grupo.turno}</p>
                                    </div>
                                    <div className='flex px-2 text-sm gap-1'>
                                        <h1 className='font-semibold' >Semestre: </h1>
                                        <p>{grupo.semestre}</p>
                                    </div>
                                    <div className='flex rounded-b bg-gray-400 justify-between text-sm gap-1 mt-2 '>
                                        <div className='flex space-x-2 items-center'>
                                            <ToolTip tooltip={`Deshacer cambios en Grupo ${grupo.grupo}`}>
                                                <a className='flex p-1 hover:bg-yellow-500 text-white' onClick={() => resetGrupo(grupo.id)}>
                                                    <Icon icon="fluent:arrow-undo-20-regular" width="30" height="30" />
                                                </a>
                                            </ToolTip>
                                            <ToolTip tooltip={`Eliminar Grupo ${grupo.grupo}`}>
                                                <a className='flex p-1 hover:bg-red-500  text-white' onClick={() => deleteGrupo(grupo.id)}>
                                                    <Icon icon="fluent:delete-20-regular" width="30" height="30" />
                                                </a>
                                            </ToolTip>
                                        </div>
                                        <ToolTip tooltip={`Ver Detalles de Grupo ${grupo.grupo}`}>
                                            <a className='flex p-1 hover:bg-blue-500 rounded-br text-white' href={`/grupos/detail?id=${grupo.grupo}`}>
                                                <Icon icon="fluent:open-20-regular" width="30" height="30" />
                                            </a>
                                        </ToolTip>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <h1 className='mt-24'></h1>
                    <Modal
                        isOpen={isOpen}
                        onRequestClose={handleOpenModal}
                        className="w-1/5  items-center mt-6 m-auto bg-white rounded-md shadow-md p-3 "
                        overlayClassName="modal-overlay"
                    >
                        <h1 className='flex items-center text-2xl mb-3'>
                            <Icon icon="fluent:people-add-20-regular" width="40" height="40" />
                            Crear grupo
                        </h1>
                        <form className='flex flex-col space-y-2'>
                            <div className='flex justify-between '>
                                <label htmlFor="turno">Turno:</label>
                                <select name="turno" id="post_turno">
                                    <option value="default">Elige un turno</option>
                                    <option value="M">Matutino</option>
                                    <option value="V">Vespertino</option>
                                </select>
                            </div>
                            <div className='flex justify-between '>
                                <label htmlFor="semestre">Semestre:</label>
                                <select name="semestre" id="post_semestre">
                                    <option value="default">Elige un semestre</option>
                                    <option value="1">Primero</option>
                                    <option value="2">Segundo</option>
                                    <option value="3">Tercero</option>
                                    <option value="4">Cuarto</option>
                                    <option value="5">Quinto</option>
                                    <option value="6">Sexto</option>
                                    <option value="7">Septimo</option>
                                    <option value="8">Octavo</option>
                                </select>
                            </div>
                            <div className='flex justify-between '>
                                <label htmlFor="grupo">Grupo:</label>
                                <input type="text" name="grupo" id="grupo" placeholder='321M' />
                            </div>
                            <div className='flex justify-end'>
                                <a className='flex items-center rounded bg-green-500 hover:bg-green-800 text-white p-1'
                                    onClick={postGrupo} >
                                    <Icon icon="fluent:save-20-regular" width="30" height="30" />
                                    Guardar
                                </a>
                            </div>
                        </form>
                    </Modal>

                    <ToastContainer
                        position="bottom-right"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick={false}
                        rtl={false}
                        pauseOnFocusLoss={false}
                        draggable
                        pauseOnHover
                        theme="colored"
                    />
                </div>
            )}
        </>
    );
} 