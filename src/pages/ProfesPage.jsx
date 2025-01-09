import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ToastContainer, toast } from "react-toastify";
import ProfesList from "../components/ProfesList";
import MateriasModal from "../components/MateriasModal";
import Horario from "../components/Horario";
import { transponerMatriz } from "../helper/helper";
import Loading from "../components/Loading"

export default function ProfesPage() {

    const url = 'http://localhost:8080/api/v1/profesores';
    const [profesores, setProfesores] = useState([]);
    const [selectedProfesor, setSelectedProfesor] = useState();
    const [materias, setMaterias] = useState([]);
    const [modalAddMateria, setModalAddMateria] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchProfesores = async () => {
        const response = await fetch(url);
        const data = await response.json();
        setProfesores(data);
        setLoading(false);
    }
    const handleSelectedProfesor = (profe) => {
        setSelectedProfesor(profe);
        //console.log(profe);
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
                toast.success('Profesor  guardado exitosamente');
            } else {
                toast.error('Error al guardar el profesor');
                //console.error('Error al guardar el profesor');
            }
        } catch (error) {
            toast.error('Error al conectar con el servidor', error);
            console.error('Error al conectar con el servidor', error);
        }
    };

    useEffect(() => {
        fetchProfesores();
    }, []);

    return (
        <>{loading ?<div className="flex w-full h-screen items-center justify-center"><Loading /></div> : (
            <div className="w-full ms-2 pe-2  overflow-y-auto">
                <div className='flex w-full justify-between items-center mt-2 bg-white rounded-md shadow-md p-3 space-x-2 '>
                    <div className="flex space-x-2 items-center">
                        <Icon icon="fluent:person-20-regular" width="40" height="40" className="rounded-full bg-yellow-400 text-white p-1" />
                        <h1 className="font-semibold text-2xl">Profesores</h1>
                    </div>
                    <div className="flex space-x-2 items-center">
                        <button className='flex space-x-2 p-2 bg-blue-500 hover:bg-blue-800 rounded text-white items-center'>
                            <Icon icon="fluent:person-add-20-regular" width="30" height="30" />
                            Crear nuevo profesor
                        </button>
                        <button className='flex space-x-2 p-2 bg-red-500 hover:bg-red-800 rounded text-white items-center'>
                            <Icon icon="fluent:person-delete-20-regular" width="30" height="30" />
                            Eliminar profesor
                        </button>
                    </div>
                </div>
                <div className="flex w-full justify-center mt-2 space-x-2">
                    <div className='w-full items-center bg-white rounded-md shadow-md p-3 overflow-y-auto'>
                        {profesores.length > 0 &&
                            <ProfesList
                                profesores={profesores}
                                handleSelectedProfesor={handleSelectedProfesor}
                            />
                        }
                    </div>
                    <div className="flex w-full items-center h-fit bg-white rounded-md shadow-md p-3">
                        {selectedProfesor &&
                            <div className="w-full space-y-2">
                                <div className=" w-full flex justify-between">
                                    <h1 className="flex text-2xl font-semibold">
                                        <Icon icon="fluent:person-edit-20-regular" width="30" height="30" />
                                        Editar Profesor</h1>
                                    <h1 className="text-sm font-semibold">ID: {selectedProfesor.id} </h1>
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
                                            <label htmlFor="apellido" className="font-semibold" >Bandera</label>
                                            <select name="bandera" id="bandera"
                                                value={selectedProfesor.bandera}
                                                onChange={handleInputChange} className="border rounded-md p-2 bg-gray-100">
                                                <option value="materias">materias</option>
                                                <option value="ptc">ptc</option>
                                                <option value="definitividad">definitividad</option>
                                            </select>
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
                                                onChange={handleInputChange}
                                                className="border rounded-md p-2 bg-gray-100" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <table className="table-auto" >
                                            <thead className="bg-rose-500 text-white">
                                                <tr>
                                                    <th>Materias que imparte</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedProfesor.materias.map((materia) => (
                                                    <tr key={materia.nombre}>
                                                        <td className="border-b">{materia}</td>
                                                        <td className="border-b">
                                                            <button className="bg-red-500 hover:bg-red-800 text-white font-semibold rounded-md p-1 "
                                                                onClick={() => {
                                                                    setSelectedProfesor({
                                                                        ...selectedProfesor,
                                                                        materias: selectedProfesor.materias.filter((m) => m !== materia)
                                                                    });
                                                                }}>
                                                                <Icon icon="fluent:delete-20-regular" width="20" height="20" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="flex justify-start">
                                            <a
                                                className="flex items-center bg-blue-500 hover:bg-blue-800 text-white font-semibold rounded-md p-2 mt-2"
                                                onClick={handleModalAddMateria}>
                                                <Icon icon="fluent:add-circle-20-regular" width="30" height="30" />
                                                Agregar materia
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <Horario
                                            horario={transponerMatriz(selectedProfesor.horario)}
                                            grupo={selectedProfesor.nombre} />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button type="submit" className="flex items-center bg-green-500 hover:bg-green-800 text-white font-semibold rounded-md p-2 mt-2">
                                            <Icon icon="fluent:save-20-regular" width="30" height="30" />
                                            Guardar
                                        </button>

                                    </div>
                                </form>

                            </div>
                        }
                    </div>
                </div>
                <h1 className='mt-24'></h1>
            </div>
        )}
            < MateriasModal
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