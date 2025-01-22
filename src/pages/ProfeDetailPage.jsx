import { useLocation } from "react-router";
import { useState, useEffect } from "react";
import Loading from "../components/Generals/Loading";
import { Icon } from "@iconify/react/dist/iconify.js";
import MateriasModal from "../components/Modals/MateriasModal";
import { filterLista, genId, revertirMatriz, transponerMatriz } from "../helper/helper";
import { ToastContainer, toast } from 'react-toastify';
import HorarioClassic from "../components/Horarios/HorarioClassic";
import Modal from "react-modal";


export default function ProfeDetailPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const url = `http://localhost:8080/`;
    const [profe, setProfe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalAddMateria, setModalAddMateria] = useState(false);
    const [modalExtras, setModalExtras] = useState(false);
    const [materias, setMaterias] = useState([]);
    const [materiasHorarios, setMateriasHorarios] = useState([]);
    const [extras, setExtras] = useState([]);
    const [materiaSelected, setMateriaSelected] = useState(null);

    const fecthProfe = async () => {
        const response = await fetch(`${url}profesor/${id}`);
        const data = await response.json();
        setProfe({ ...data, horario: revertirMatriz(data.horario) });
        console
        setLoading(false);
    }
    const fetchMaterias = () => {
        const fetchAsignaciones = async () => {
            const resultados = await Promise.all(profe.asignaciones.map(async (asignacion) => {
                if (asignacion.objeto == null) return "";
                if (asignacion.materia == "Tutorias") {
                    return { nombre: "Tutorias", clave: "TUTO-001", horas: "1" };
                }
                if (isNaN(asignacion.materia.charAt(0))) return { nombre: asignacion.materia, horas: "1", clave: "N/A" };
                const response = await fetch(`${url}materia/${asignacion.materia}`);
                const data = await response.json();
                return data;
            }));
            setMateriasHorarios(resultados);
        };
        fetchAsignaciones().catch(error => console.error('Error fetching Materias:', error));
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfe({
            ...profe,
            [name]: value
        });
    }
    const handleModal = (materias) => {
        setProfe({
            ...profe,
            materias: [...profe.materias, ...materias]
        });
        setModalAddMateria(false);
    }
    const handleModalAddMateria = () => {
        setModalAddMateria(!modalAddMateria);
    }
    const handleModalExtras = () => {
        setModalExtras(!modalExtras);
    }
    const handleClickHorario = (dia, hora) => {
        if (materiaSelected == null) {
            toast.error('Seleccione una materia extra');
            return;
        }
        if (profe.horario[dia][hora] !== "") {
            toast.error('Ya hay una materia en esta hora');
            return;
        }
        if (materiaSelected.horas < 1) {
            toast.error('No hay horas suficientes para esta materia');
            return;
        };

        const horario = profe.horario;
        horario[dia][hora] = materiaSelected.id;
        setProfe({
            ...profe,
            horario: horario
        });
        const horas = materiaSelected.horas - 1;
        const materia = { ...materiaSelected, horas };
        setExtras([...extras.filter(extra => extra !== materiaSelected), materia]);
        setMateriaSelected(materia);
        toast.success('Materia asignada');
    }

    const handleSaveExtras = () => {
        const materia = document.getElementById('ex_materia').value;
        const grupo = document.getElementById('ex_grupo').value;
        const horas = document.getElementById('ex_horas').value;
        const clave = document.getElementById('ex_clave').value;
        const id = genId(profe.asignaciones.map(asignacion => asignacion.id));
        const materiaExtra = { id, materia, grupo, horas, clave };

        const newAsiganacion = {
            id: id,
            materia: materia,
            objeto: grupo
        }
        
        setProfe({
            ...profe,
            horas: profe.horas + parseInt(horas),
            asignaciones: [...profe.asignaciones, newAsiganacion]
        });

        setExtras([...extras, materiaExtra]);
        setModalExtras(false);
        toast.success('Materia extra agregada');
    }

    const handleSelectedMateria = (materia) => {
        setMateriaSelected(materia);
    }

    const handleSaveProfe = async () => {
        const confirm = window.confirm('¿Desea guardar los cambios?');
        if (!confirm) return;
        const horario = transponerMatriz(profe.horario);
        setProfe({
            ...profe,
            horario: horario
        });

        const response = await fetch(`${url}profesor/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(profe)
        });
        if (response.ok) {
            toast.success('Cambios guardados');
            window.history.back();
        }
        else {
            toast.error('Error al guardar los cambios');
        }
    }

    useEffect(() => {
        fecthProfe();
        console.log(profe);
    }, []);

    useEffect(() => {
        if (profe) {
            fetchMaterias();
        }
    }, [profe]);

    return (
        <>{loading ? <div className="flex w-full h-screen items-center justify-center"><Loading /></div> :
            <div className="flex flex-col w-full h-screen overflow-y-auto pb-10 space-x-2 space-y-2 pt-2  pe-2">
                <div className='flex items-center space-x-2 ms-2'>
                    <a className="bg-white rounded-md shadow-md p-3 hover:bg-cyan-400 hover:text-white "
                        onClick={() => window.history.back()}>
                        <Icon icon="fluent:arrow-left-20-regular" width="40" height="40" />
                    </a>
                    <div className='flex w-full justify-center items-center bg-white rounded-md shadow-md p-3'>
                        <h1 className='flex items-center text-4xl font-semibold'>{profe.nombre} {profe.apellido}</h1>
                    </div>
                </div>
                <div className='flex w-full space-x-2 pe-2'>
                    <div className="flex flex-col bg-white rounded-md shadow-md p-3 "> {/* Datos del profesor */}
                        <h2 className="font-semibold text-2xl mb-2">Datos del profesor</h2>
                        <form className="flex flex-col w-full space-y-2" >
                            <div className="flex w-full space-x-2">
                                <div className="flex w-full flex-col">
                                    <label htmlFor="nombre" className="font-semibold">Nombre(s)</label>
                                    <input type="text" name="nombre" id="nombre"
                                        value={profe.nombre}
                                        onChange={handleInputChange} className="border rounded-md p-2 bg-gray-100" />
                                </div>
                                <div className="flex w-full flex-col">
                                    <label htmlFor="apellido" className="font-semibold" >Apellido(s)</label>
                                    <input type="text" name="apellido" id="apellido"
                                        value={profe.apellido}
                                        onChange={handleInputChange} className="border rounded-md p-2 bg-gray-100" />
                                </div>
                            </div>
                            <div className="flex w-full space-x-2">
                                <div className="flex flex-col">
                                    <label htmlFor="Antiguedad" className="font-semibold">Antigüedad</label>
                                    <input
                                        type="text"
                                        name="antiguedad"
                                        id="antiguedad"
                                        onChange={handleInputChange}
                                        value={profe.antiguedad}
                                        placeholder="AAAA/MM/DD"
                                        pattern="\d{4}/\d{2}/\d{2}"
                                        title="El formato debe ser AAAA/MM/DD"
                                        className="border rounded-md p-2 bg-gray-100"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="horas" className="font-semibold" >Horas</label>
                                    <input type="number" name="horas" id="horas"
                                        value={profe.horas}
                                        disabled
                                        className="border rounded-md p-2 bg-gray-100" />
                                </div>
                                <div className="flex w-full flex-col">
                                    <label htmlFor="post_bandera" className="font-semibold" >Tipo</label>
                                    <select name="post_bandera" id="post_bandera" className="border rounded-md p-2 bg-gray-100" value={profe.bandera} onChange={handleInputChange}>
                                        <option value="PTC">PTC</option>
                                        <option value="definitividad">Definitividad</option>
                                        <option value="materias">materias</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex w w-full space-x-2">
                                <div className="flex w-full flex-col">
                                    <label htmlFor="entrada" className="font-semibold" >Entrada</label>
                                    <input type="time" name="entrada" id="entrada"
                                        value={profe.entrada}
                                        onChange={handleInputChange}
                                        className="border rounded-md p-2 bg-gray-100" />
                                </div>
                                <div className="flex w-full flex-col">
                                    <label htmlFor="salida" className="font-semibold" >Salida</label>
                                    <input type="time" name="salida" id="salida"
                                        value={profe.salida}
                                        onChange={handleInputChange}
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
                                {profe.materias.map((materia, index) => (
                                    <li key={index} className='bg-gray-100 border rounded-full px-3 py-1 flex items-center font-semibold text-sm'>
                                        {materia}
                                        <a className='ml-2 text-gray-400 hover:text-gray-700  ' >
                                            <Icon icon="fluent:dismiss-circle-24-filled" width="24" height="24" />
                                        </a>
                                    </li>
                                ))}
                            </div>

                        </form>
                        <div className="flex justify-end w-full mt-4"> {/* Materias extras */}
                            <button className="flex items-center bg-blue-500 hover:bg-blue-800 text-white rounded p-2" onClick={handleModalExtras}>
                                <Icon icon="fluent:calendar-edit-20-regular" width="30" height="30" />
                                Agregar Materias Extras
                            </button>
                        </div>
                        {extras.length > 0 &&
                            <div className="flex flex-col w-full mt-4"> {/* Materias extras */}
                                <h2 className="font-semibold text-2xl mb-2">Materias extras</h2>
                                <table className="table-auto w-full">
                                    <thead className="bg-yellow-500 text-white">
                                        <tr>
                                            <th className="text-sm px-4 py-2">Nombre</th>
                                            <th className="text-sm px-4 py-2">Grupo</th>
                                            <th className="text-sm px-4 py-2">Horas</th>
                                            <th className="text-sm px-4 py-2">Salon</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {extras.map((extra, index) => (
                                            <tr key={index} className={`cursor-pointer ${materiaSelected === extra ? "bg-amber-300" : ""}`} onClick={() => handleSelectedMateria(extra)}>
                                                <td className="text-sm border px-1 py-1">{extra.materia}</td>
                                                <td className="text-sm border px-1 py-1">{extra.grupo}</td>
                                                <td className="text-sm border px-1 py-1">{extra.horas}</td>
                                                <td className="text-sm border px-1 py-1">{extra.clave}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        }
                    </div>
                    <div className="flex flex-col w-full bg-white rounded-md shadow-md p-3"> {/* Horario del profesor */}
                        <div className="flex justify-between gap-2">
                            <button type="submit" className="flex items-center bg-green-500 hover:bg-green-800 text-white rounded p-2" onClick={handleSaveProfe}>
                                <Icon icon="fluent:save-20-regular" width="30" height="30" />
                                Guardar cambios
                            </button>
                            <a className='flex p-2 bg-blue-500 hover:bg-blue-800 rounded text-white items-center' >
                                    <Icon icon="fluent:print-20-regular" width="30" height="30" />
                                    Imprimir horario
                                </a>
                           
                        </div>
                        <HorarioClassic objeto={profe} materias={materiasHorarios} onCellClick={handleClickHorario} />
                    </div>
                </div>
                <Modal
                    isOpen={modalExtras}
                    onRequestClose={() => setModalExtras(false)}
                    className="w-2/5 items-center mt-6 m-auto bg-white rounded-md shadow-md p-3 space-y-2"
                    overlayClassName="modal-overlay"
                >
                    <h1 className="flex justify-center font-semibold">Asigne materias extra para completar las horas semanales</h1>
                    <form>
                        <div className='flex justify-between'>
                            <label htmlFor="nombre">Nombre</label>
                            <input type="text" name="materia" id="ex_materia" placeholder='Ej. Residencias' />
                        </div>
                        <div className='flex justify-between'>
                            <label htmlFor="grupo">Grupo (si no necesita un grupo coloque *)</label>
                            <input type="text" name="grupo" id="ex_grupo" placeholder='Ej. 341M' />
                        </div>
                        <div className='flex justify-between'>
                            <label htmlFor="horas">Horas</label>
                            <input type="number" name="horas" id="ex_horas" placeholder='Ej. 4' />
                        </div>
                        <div className='flex justify-between'>
                            <label htmlFor="clave">Salon</label>
                            <input type="text" name="clave" id="ex_clave" placeholder='Ej. 201C' />
                        </div>
                    </form>
                    <div className='flex justify-end space-x-2'>
                        <button className='bg-green-500 hover:bg-green-800 text-white p-2 rounded-md mt-2' onClick={handleSaveExtras}>
                            Guardar
                        </button>
                        <button className='bg-red-500 hover:bg-red-800 text-white p-2 rounded-md mt-2' onClick={() => setModalExtras(false)}>
                            Cancelar
                        </button>
                    </div>
                </Modal>
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
            </div>
        }</>
    )
}