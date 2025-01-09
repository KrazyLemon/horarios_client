import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ToastContainer, toast } from "react-toastify";
import ProfesList from "../components/Tablas/ProfesList";
import MateriasModal from "../components/Modals/MateriasModal";
import Loading from "../components/Generals/Loading"
import ToolTip from "../components/Generals/ToolTip";
import NewProfeModal from "../components/Modals/newProfeModal";


export default function ProfesPage() {

    const url = 'http://localhost:8080/api/v1/profesores';
    const [profesores, setProfesores] = useState([]);
    const [filteredProfesores, setFilteredProfesores] = useState([]);
    const [selectedProfesor, setSelectedProfesor] = useState();
    const [materias, setMaterias] = useState([]);
    const [modalAddMateria, setModalAddMateria] = useState(false);
    const [modalNewProfe, setModalNewProfe] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchProfesores = async () => {
        const response = await fetch(url);
        const data = await response.json();
        setFilteredProfesores(data);
        setProfesores(data);
        setLoading(false);
    }
    const handleSelectedProfesor = (profe) => {
        setSelectedProfesor(profe);
    }
    const handleModal = (materias) => {
        setSelectedProfesor({
            ...selectedProfesor,
            materias: [...selectedProfesor.materias, ...materias]
        });
        console.log(selectedProfesor.materias);
        setModalAddMateria(false);
    }
    const handleModalAddMateria = () => {
        setModalAddMateria(!modalAddMateria);
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedProfesor({
            ...selectedProfesor,
            [name]: value
        });
    };
    const handleDeleteMateria = (materia) => {
        setSelectedProfesor({
            ...selectedProfesor,
            materias: selectedProfesor.materias.filter(m => m !== materia)
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedProfesor)
            });
            if (response.ok) {
                fetchProfesores();
                toast.success('Profesor guardado exitosamente');
            } else {
                toast.error('Error al guardar el profesor');
                //console.error('Error al guardar el profesor');
            }
        } catch (error) {
            toast.error('Error al conectar con el servidor', error);
            console.error('Error al conectar con el servidor', error);
        }
    };
    const handleDeleteProfesor = async (id) => {
        const confirm = window.confirm('¿Estás seguro de eliminar el profesor?');
        if (confirm) {
            try {
                const response = await fetch(`${url}/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchProfesores();
                    toast.success('Profesor eliminado exitosamente');
                } else {
                    toast.error('Error al eliminar el profesor');
                    //console.error('Error al guardar el profesor');
                }
            } catch (error) {
                toast.error('Error al conectar con el servidor', error);
                console.error('Error al conectar con el servidor', error);
            }
        }
        else {
            return;
        }
    }
    const handleDeleteHorario = async (id) => {
        const confirm = window.confirm('¿Estás seguro de eliminar el horario del profesor?');
        if (confirm) {
            const newProfesor = {
                ...selectedProfesor,
                horario: Array(5).fill(Array(8).fill('')),
                asignaciones: Array(1).fill({
                    id:'',
                    materia: '',
                    grupo: ''
                }),
                horas: 0
            }
            try {
                const response = await fetch(`${url}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newProfesor)
                });
                if (response.ok) {
                    fetchProfesores();
                    toast.success('Horario eliminado exitosamente');
                } else {
                    toast.error('Error al eliminar el horario');
                    //console.error('Error al guardar el profesor');
                }
            } catch (error) {
                toast.error('Error al conectar con el servidor', error);
                console.error('Error al conectar con el servidor', error);
            }
        }
        else {
            return;
        }
    }
    const handleModalNewProfe = () => {
        setModalNewProfe(!modalNewProfe);
        fetchProfesores();
    }
    const filterGruposByTurno = (turno, value) => {
        if (value === 'matutino') {
            setFilteredProfesores(profesores.filter(profe => profe.entrada < '14:00'));
        } else {
            setFilteredProfesores(profesores.filter(profe => profe.entrada >= '14:00'));
        }
    }


    useEffect(() => {
        fetchProfesores();
    }, []);

    return (
        <>{loading ? <div className="flex w-full h-screen items-center justify-center"><Loading /></div> : (
            <div className="w-full ms-2 pe-2  overflow-y-auto">
                <div className='flex w-full justify-between items-center mt-2 bg-white rounded-md shadow-md p-3 space-x-2 '>
                    <div className="flex space-x-2 items-center">
                        <Icon icon="fluent:person-20-regular" width="40" height="40" className="rounded-full bg-yellow-400 text-white p-1" />
                        <h1 className="font-semibold text-2xl">Profesores</h1>
                    </div>
                    <div className="flex space-x-2 items-center">
                        <a className='flex space-x-2 p-2 bg-blue-500 hover:bg-blue-800 rounded text-white items-center' onClick={() => handleModalNewProfe()}>
                            <Icon icon="fluent:person-add-20-regular" width="30" height="30" />
                            Crear nuevo profesor
                        </a>
                    </div>
                </div>
                <div className="flex w-full  mt-2 space-x-2">
                    <div className='w-1/2 items-center bg-white rounded-md shadow-md p-3'>
                        <label className="text-sm font-semibold">Turnos:</label>
                        <select className="text-sm" name="turno" id="turno" onChange={(e) => filterGruposByTurno(document.getElementById('turno').value, e.target.value)}>
                            <option value="todos">Todos</option>
                            <option value="matutino">Matutino</option>
                            <option value="vespertino">Vespertino</option>
                        </select>
                        {filteredProfesores.length > 0 &&
                            <ProfesList
                                profesores={filteredProfesores}
                                handleSelectedProfesor={handleSelectedProfesor}
                            />
                        }
                    </div>
                    <div className="w-1/2 h-fit bg-white rounded-md shadow-md p-3">
                        {selectedProfesor &&
                            <div className="w-full space-y-2">
                                <div className=" w-full flex justify-between">
                                    <ToolTip tooltip={"Vista rapida del profesor, puedes ver los detalles completos del profesor en la sección de detalles"}>
                                        <h1 className="flex text-2xl font-semibold">
                                            <Icon icon="fluent:person-edit-20-regular" width="30" height="30" />
                                            Vista Rapida
                                        </h1>
                                    </ToolTip>
                                </div>
                                <form className="flex flex-col w-full space-y-2" onSubmit={handleSubmit}>
                                    <div className="flex w-full space-x-2">
                                        <div className="flex w-full flex-col">
                                            <label htmlFor="nombre" className="font-semibold">Nombre(s)</label>
                                            <input type="text" name="nombre" id="nombre"
                                                value={selectedProfesor.nombre}
                                                onChange={handleInputChange} className="border rounded-md p-2 bg-gray-100" />
                                        </div>
                                        <div className="flex w-full flex-col">
                                            <label htmlFor="apellido" className="font-semibold" >Apellido(s)</label>
                                            <input type="text" name="apellido" id="apellido"
                                                value={selectedProfesor.apellido}
                                                onChange={handleInputChange} className="border rounded-md p-2 bg-gray-100" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="Antiguedad" className="font-semibold">Antigüedad</label>
                                            <input
                                                type="text"
                                                name="antiguedad"
                                                id="antiguedad"
                                                onChange={handleInputChange}
                                                value={selectedProfesor.antiguedad}
                                                placeholder="AAAA/MM/DD"
                                                pattern="\d{4}/\d{2}/\d{2}"
                                                title="El formato debe ser AAAA/MM/DD"
                                                className="border rounded-md p-2 bg-gray-100"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <div className="flex w-full flex-col">
                                            <label htmlFor="entrada" className="font-semibold" >Entrada</label>
                                            <input type="time" name="entrada" id="entrada"
                                                value={selectedProfesor.entrada}
                                                onChange={handleInputChange}
                                                className="border rounded-md p-2 bg-gray-100" />
                                        </div>
                                        <div className="flex w-full flex-col">
                                            <label htmlFor="salida" className="font-semibold" >Salida</label>
                                            <input type="time" name="salida" id="salida"
                                                value={selectedProfesor.salida}
                                                onChange={handleInputChange}
                                                className="border rounded-md p-2 bg-gray-100" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="horas" className="font-semibold" >Horas</label>
                                            <input type="number" name="horas" id="horas"
                                                value={selectedProfesor.horas}
                                                disabled
                                                className="border rounded-md p-2 bg-gray-100" />
                                        </div>
                                    </div>
                                    <label htmlFor="materias" className="font-semibold">Materias</label>
                                    <div className="flex flex-wrap gap-2">
                                        <a className='bg-gray-100 text-gray-400 border rounded-full px-3 py-1 flex items-center font-semibold text-sm hover:bg-gradient-to-r from-yellow-100 to-red-200 hover:text-gray-700 '
                                            onClick={handleModalAddMateria}>
                                            <Icon icon="fluent:add-circle-20-filled" width="24" height="24" />
                                            Agregar materia
                                        </a>
                                        {selectedProfesor.materias.map((materia, index) => (
                                            <li key={index} className='bg-gray-100 border rounded-full px-3 py-1 flex items-center font-semibold text-sm'>
                                                {materia}
                                                <a className='ml-2 text-gray-400 hover:text-gray-700  ' onClick={() => handleDeleteMateria(materia)}>
                                                    <Icon icon="fluent:dismiss-circle-24-filled" width="24" height="24" />
                                                </a>
                                            </li>
                                        ))}
                                    </div>
                                    <div>
                                        {selectedProfesor && selectedProfesor.asignaciones.map((asignacion, index) => (
                                            <h1>{asignacion.id}</h1>
                                        ))}
                                    </div>
                                    <div className="flex flex-row-reverse justify-between gap-2">
                                        <a className='flex p-2 bg-purple-500 hover:bg-purple-800 rounded text-white items-center'
                                            href={`/docentes/detail?id=${selectedProfesor.id}`}>
                                            <Icon icon="fluent:open-20-regular" width="30" height="30" />
                                            Ver detalles
                                        </a>
                                        <div className="flex space-x-2">
                                            <button type="submit" className="flex items-center bg-green-500 hover:bg-green-800 text-white rounded p-2">
                                                <Icon icon="fluent:save-20-regular" width="30" height="30" />
                                                Guardar
                                            </button>
                                            <a className='flex p-2 bg-red-500 hover:bg-red-800 rounded text-white items-center' onClick={() => handleDeleteProfesor(selectedProfesor.id)} >
                                                <Icon icon="fluent:delete-20-regular" width="30" height="30" />
                                                Eliminar
                                            </a>
                                            <a className='flex p-2 bg-blue-500 hover:bg-blue-800 rounded text-white items-center' onClick={() => handleDeleteHorario(selectedProfesor.id)} >
                                                <Icon icon="fluent:calendar-cancel-20-regular" width="30" height="30" />
                                                Eliminar Horario
                                            </a>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        }
                    </div>
                </div>
                <h1 className='mt-24'></h1>
            </div>
        )}
            <NewProfeModal
                isOpen={modalNewProfe}
                handleCloseModal={handleModalNewProfe}
                onRequestClose={() => setModalNewProfe(false)}
                url={url}
            />
            <MateriasModal
                isOpen={modalAddMateria}
                handleCloseModal={handleModalAddMateria}
                onRequestClose={() => setModalAddMateria(false)}
                materiasSelected={materias}
                addmaterias={handleModal}
            />
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
        </>
    );
}