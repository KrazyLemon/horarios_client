import { useState, useEffect } from "react";
import Loading from "../components/Generals/Loading";
import axios from "axios";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import MateriasList from "../components/Tablas/MateriasList";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function MateriasPage() {
    const [loading, setLoading] = useState(true);
    const [materias, setMaterias] = useState([]);
    const [materiasSelected, setMateriaSelected] = useState(null);
    const [ModalOpen, setModalOpen] = useState(false);
    const url = "http://localhost:8080/materias";

    async function fetchData() {
        try {
            const response = await axios.get(url);
            setMaterias(response.data);
            setLoading(false);
        } catch (error) {
            toast.error(error);
            setLoading(false);
        }
    }

    const handleMateriaSelected = (materia) => {
        setMateriaSelected(materia)
    }

    const handleOpenModal = () => {
        setModalOpen(!ModalOpen)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nombre_materia = e.target.nombre_materia.value;
        const clave_materia = e.target.clave_materia.value;
        const semestre_materia = e.target.semestre_materia.value;
        const horas_materia = e.target.horas_materia.value;
        try {
            const response = await axios.post("http://localhost:8080/materia", {
                nombre_materia,
                clave_materia,
                semestre_materia,
                horas_materia
            });
            if (response.status === 201) {
                toast.success("Materia creada correctamente");
                fetchData();
                setModalOpen(false);
            }
        } catch (error) {
            toast.error(error);
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <>
            {loading ? <div className="flex w-full h-screen items-center justify-center"><Loading /></div> : (
                <div className='flex flex-col w-full  h-screen ms-2 overflow-y-auto pe-2'>
                    <div className="flex justify-between w-full mt-2 bg-white rounded-md shadow-md p-3 space-x-2 ">
                        <div className="flex space-x-2 items-center">
                            <Icon icon="fluent:document-folder-20-regular" width="40" height="40" className="rounded-full bg-lime-400 text-white p-1" />
                            <h1 className="font-semibold text-2xl">Materias</h1>
                        </div>
                        <div className="flex space-x-2 items-center">
                            <button className='flex space-x-2 p-2 bg-blue-500 hover:bg-blue-800 rounded text-white items-center' onClick={!ModalOpen ? () => setModalOpen(true) : () => setModalOpen(false)}>
                                <Icon icon="fluent:document-add-20-regular" width="30" height="30" />
                                Crear nueva materia
                            </button>
                            {/* <button className='flex space-x-2 p-2 bg-red-500 hover:bg-red-800 rounded text-white items-center'>
                                <Icon icon="fluent:document-dismiss-20-regular" width="30" height="30" />
                                Eliminar materia
                            </button> */}
                        </div>
                    </div>
                    <div className="flex w-full justify-start">
                        <div className='flex mt-2 bg-white rounded-md shadow-md p-3 space-x-2 '>
                            <MateriasList
                                materias={materias}
                                handleSelectedMateria={handleMateriaSelected}
                                materiaSelected={materiasSelected} />
                        </div>
                    </div>
                    <h1 className="mt-28"></h1>
                </div>
            )}
            <Modal
                isOpen={ModalOpen}
                onRequestClose={handleOpenModal}
                className="w-1/5  items-center mt-6 m-auto bg-white rounded-md shadow-md p-3 "
                overlayClassName="modal-overlay"
            >
                <h1 className='flex items-center text-2xl mb-3'>
                    <Icon icon="fluent:people-add-20-regular" width="40" height="40" />
                    Crear Materia
                </h1>
                <form className='flex flex-col space-y-2' onSubmit={handleSubmit}>
                    <div className='flex justify-between '>
                        <label htmlFor="nombre_materia">Nombre</label>
                        <input type="text" id="nombre_materia" />
                    </div>
                    <div className='flex justify-between '>
                        <label htmlFor="clave_materia">Clave</label>
                        <input type="text" id="clave_materia" />
                    </div>
                    <div className='flex justify-between '>
                        <label htmlFor="semestre_materia">Semestre:</label>
                        <select name="semestre_materia" id="semestre_materia  ">
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
                        <label htmlFor="horas_materia">Horas</label>
                        <input type="number" id="horas_materia" />
                    </div>
                    <button className='bg-blue-500 hover:bg-blue-800 text-white rounded-md p-2' type="submit">Crear</button>
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
        </>
    );
} 