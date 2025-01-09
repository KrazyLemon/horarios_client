import { useState, useEffect } from "react";
import Loading from "../components/Loading"
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import MateriasList from "../components/MateriasList";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function MateriasPage() {
    const [loading, setLoading] = useState(true);
    const [materias, setMaterias] = useState([]);
    const [materiasSelected, setMateriaSelected] = useState(null);
    const url = "http://localhost:8080/api/v1/materias";

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
                            <button className='flex space-x-2 p-2 bg-blue-500 hover:bg-blue-800 rounded text-white items-center'>
                                <Icon icon="fluent:document-add-20-regular" width="30" height="30" />
                                Crear nueva materia
                            </button>
                            <button className='flex space-x-2 p-2 bg-red-500 hover:bg-red-800 rounded text-white items-center'>
                                <Icon icon="fluent:document-dismiss-20-regular" width="30" height="30" />
                                Eliminar materia
                            </button>
                        </div>
                    </div>
                    <div className="flex w-full justify-end">
                        <div className='flex mt-2 bg-white rounded-md shadow-md p-3 space-x-2 '>
                            <MateriasList
                                materias={materias}
                                handleSelectedMateria={handleMateriaSelected} />
                        </div>
                    </div>
                    <h1 className="mt-24"></h1>
                </div>
            )}
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