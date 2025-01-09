import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Horario from "../components/Horario";
import { checkhorario, checkSalon, revertirMatriz, setChipColor, setChipColor2, transponerMatriz } from '../helper/helper';
import AsignacionesModal from "../components/AsignacionesModal";
import { ToastContainer, toast } from "react-toastify";
import ToolTip from "../components/Tooltip";
import Loading from "../components/Loading";


export default function GrupoDetailPage() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const url = `http://localhost:8080/api/v1/`;
    const [grupo, setGrupo] = useState(null);
    const [horario, setHorario] = useState(null);
    const [profesList, setProfesList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalShow, setModalShow] = useState(false);
    const [isAssigningIngles, setIsAssigningIngles] = useState(false);

    const fetchgrupo = async () => {
        const response = await fetch(`${url}grupos/grupo/${id}`);
        const data = await response.json();
        setGrupo(data);
        setHorario(transponerMatriz(data.horario));
        setLoading(false);
    }
    const handleModal = () => {
        setModalShow(!modalShow);
    }
    const handleGenHorario = (horario, profes) => {
        setHorario(horario);
        setProfesList(profes);
        if (horario != null) {
            toast.success('Horario generado exitosamente');
        } else {
            toast.error('Error al generar el horario');
        }
        // if(profesList != null){
        //     toast.success('Profesores actualizados exitosamente');
        // } else{
        //     toast.error('Error al actualizar los profesores');
        // }
        //console.log(profes);
    }
    const handleInglesButton = () => {
        setIsAssigningIngles(true);
    }
    const handleCellClick = (rowIndex, cellIndex) => {
        if (isAssigningIngles) {
            const newHorario = horario.map((row, rIdx) =>
                row.map((cell, cIdx) => (rIdx === rowIndex && cIdx === cellIndex ? 'Inglés' : cell))
            );
            setHorario(newHorario);
            setIsAssigningIngles(false); // Optionally, turn off assigning mode after one assignment
        }
    }
    const handleTutoButton = () => {

    }
    const checkHorarioProfe = (dia, hora, materia, grupo, prevRow, prevCell) => {
        // Verificar que la celda del horario del grupo está vacía
        if (horario[dia][hora] !== "") {
            toast.error("La celda en el horario del grupo ya está ocupada");
            return false;
        }

        // Encontrar el profesor que tiene asignada la materia con el grupo especificado
        console.log(profesList)
        const profesorIndex = profesList.findIndex(profesor =>
            profesor.asignaciones.some(asignacion => asignacion.materia === materia && asignacion.objeto === grupo)
        );

        if (profesorIndex === -1) {
            toast.error("No se encontró un profesor con materia:" + materia + " y grupo:" + grupo);
            return false;
        }

        const profesorEncontrado = profesList[profesorIndex];

        // Verificar que la celda correspondiente en el horario del profesor está vacía

        const horarioDoc = transponerMatriz(profesorEncontrado.horario)

        if (horarioDoc[dia][hora] !== "") {
            toast.error("La celda en el horario del profesor ya está ocupada");
            return false;
        }

        // Actualizar los horarios utilizando map para mantener la inmutabilidad
        const nuevoHorarioGrupo = horario.map((row, rIdx) =>
            row.map((cell, cIdx) => {
                if (rIdx === dia && cIdx === hora) {
                    return materia;
                } else if (rIdx === prevRow && cIdx === prevCell) {
                    return "";
                }
                return cell;
            })
        );


        const nuevoHorarioProfe = horarioDoc.map((row, rIdx) =>
            row.map((cell, cIdx) => {
                if (rIdx === dia && cIdx === hora) {
                    return grupo;
                } else if (rIdx === prevRow && cIdx === prevCell) {
                    return "";
                }
                return cell;
            })
        );


        const nuevoProfesList = profesList.map((profesor, index) =>
            index === profesorIndex
                ? { ...profesor, horario: revertirMatriz(nuevoHorarioProfe) }
                : profesor
        );

        setHorario(nuevoHorarioGrupo);
        setProfesList(nuevoProfesList);

        toast.success("La asignación se realizó con éxito");
        return true;
    }

    useEffect(() => {
        fetchgrupo();
    }, [id]);


    return (
        <>
            {loading ?<div className="flex w-full h-screen items-center justify-center"><Loading /></div> : (
                <div className="flex flex-col w-full h-screen overflow-y-auto pb-10 space-x-2 space-y-2 pt-2 pe-2">
                    <div className='flex items-center space-x-2'>
                        <a className="bg-white rounded-md shadow-md p-3 ms-2 hover:bg-cyan-400 hover:text-white " 
                           onClick={() => window.history.back()}>
                            <Icon icon="fluent:arrow-left-20-regular" width="40" height="40" />
                        </a>
                        <div className='flex w-full justify-center items-center bg-white rounded-md shadow-md p-3'>
                            <h1 className='flex items-center text-4xl font-semibold'>Horario de Grupo {grupo.grupo}</h1>
                        </div>
                    </div>
                    <div className="flex items-top space-x-2"> {/* Contenedor de Acciones y Horario */}
                        <div className="grid w-1/6 space-y-2 bg-white rounded-md shadow-md p-3"> {/* Acciones */}
                            <div className="space-y-2" >
                                <h1 className="flex w-full justify-center font-semibold">Información del grupo</h1>
                                <div className="flex w-full justify-between">
                                    <h1 className="font-semibold">Grupo:</h1>
                                    <h1>{grupo.grupo}</h1>
                                </div>
                                <div className="flex w-full justify-between">
                                    <h1 className="font-semibold">Turno:</h1>
                                    <h1>{grupo.turno === "M" ? "Matutino" : grupo.turno === "V" ? "Vespertino" : grupo.turno}</h1>
                                </div>
                                <div className="flex w-full justify-between">
                                    <h1 className="font-semibold">Salon:</h1>
                                    <select >
                                        <option value={"salon"} >Salon 1 </option>
                                        <option value={"salon"} >Salon 2</option>
                                        <option value={"salon"} >Salon 3 </option>
                                        <option value={"salon"} >Salon 4 </option>
                                        <option value={"salon"} >Salon 5 </option>
                                        <option value={"salon"} >Salon 6 </option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col w-full items-center space-y-1"> {/*Alertas*/}
                                <span className={`border rounded-md px-2 py-1 flex w-full items-center ${setChipColor2(checkSalon(grupo.salon))}`}>
                                    {checkSalon(grupo.salon) === "No tiene salon" ? (
                                        <Icon icon="fluent:document-error-20-regular" width="30" height="30" className='me-1' />
                                    ) : (
                                        <Icon icon="fluent:document-checkmark-20-regular" width="30" height="30" className='me-1' />
                                    )}
                                    {checkSalon(grupo.salon) == "No tiene salon" ? "No tiene salon" : "Salon Asignado"}
                                </span>
                                <span className={`border rounded-md px-2 py-1 flex w-full items-center  ${setChipColor(checkhorario(grupo.horario))}`}>
                                    {checkhorario(grupo.horario) === "Horario Vacio" ? (
                                        <Icon icon="fluent:calendar-error-20-regular" width="30" height="30" className='me-1' />
                                    ) : (
                                        <Icon icon="fluent:calendar-checkmark-20-regular" width="30" height="30" className='me-1' />
                                    )}
                                    {checkhorario(grupo.horario) === "Horario Vacio" ? "Horario Vacio" : "Horario Asignado"}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <h1 className="flex justify-center text-xl font-semibold">Acciones</h1>
                                <div className="space-x-2 flex justify-center w-full">
                                    <ToolTip tooltip="Generar Horario">
                                        <a className="flex items-center space-x-2 rounded bg-amber-500 text-white p-2" onClick={handleModal}>
                                            <Icon icon="fluent:calendar-sparkle-20-regular" width="30" height="30" />
                                        </a>
                                    </ToolTip>
                                    <ToolTip tooltip="Asignar Tutorias" >
                                        <a className="flex items-center space-x-2 rounded cursor-pointer bg-red-500 text-white p-2" onClick={handleTutoButton} >
                                            <Icon icon="fluent:calendar-person-20-regular" width="30" height="30" />
                                        </a>
                                    </ToolTip>
                                    {grupo.semestre <= 5 && (
                                        <ToolTip tooltip="Asignar Ingles" >
                                            <a
                                                className="flex items-center space-x-2 rounded cursor-pointer bg-purple-500 text-white p-2" onClick={handleInglesButton} >
                                                <Icon icon="fluent:calendar-star-20-regular" width="30" height="30" />
                                            </a>
                                        </ToolTip>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col w-full items-center bg-white rounded-md shadow-md p-3'>   {/* Horario */}
                            <Horario
                                horario={horario}
                                nombre={grupo.grupo}
                                onCellClick={handleCellClick}
                                checkHorarioProfe={checkHorarioProfe}
                            />
                            <div className="flex justify-start w-full pt-3 space-x-2">
                                <ToolTip tooltip="Guardar Horario">
                                    <a className="flex items-center  rounded bg-green-500 text-white p-2" >
                                        <Icon icon="fluent:save-20-regular" width="30" height="30" />
                                        Guardar horario
                                    </a>
                                </ToolTip>
                                <ToolTip tooltip="Eliminar Horario">
                                    <a className="flex items-center space-x-2 rounded bg-red-500 text-white p-2" >
                                        <Icon icon="fluent:delete-20-regular" width="30" height="30" />
                                        Eliminar horario
                                    </a>
                                </ToolTip>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-wrap space-y-2'>
                        {profesList && (
                            profesList.map((profe, index) => (
                                <div className="flex w-full space-x-2 bg-white rounded-md shadow-md p-3">
                                    <div className="flex flex-col w-1/2">
                                        <h1 className="flex w-full font-semibold justify-center">Horario del profe {profe.nombre} {profe.apellido}</h1>
                                        <Horario horario={transponerMatriz(profe.horario)} nombre={profe.nombre + " " + profe.apellido} />
                                    </div>
                                    <div className="flex flex-col w-1/2">
                                        <h1 className="flex w-full font-semibold justify-center">Informacion Actualizada del profesor</h1>
                                        <table className="table-auto w-full h-fit mt-2">
                                            <thead className="bg-gray-500 text-white">
                                                <th className="px-4 py-2">Materia</th>
                                                <th className="px-4 py-2">Grupo</th>
                                            </thead>
                                            {profe.asignaciones.map((asignacion) => (
                                                <tr>
                                                    <td className="text-sm border px-1 py-1 bg-gray-100">{asignacion.materia}</td>
                                                    <td className="text-sm border px-1 py-1 bg-gray-100">{asignacion.objeto}</td>
                                                </tr>
                                            ))}
                                        </table>
                                    </div>
                                </div>
                            ))
                        )}
                        <h1 className="mt-20"></h1>
                    </div>
                    <AsignacionesModal
                        isOpen={modalShow}
                        onRequestClose={handleModal}
                        grupo={grupo}
                        handleGenHorario={handleGenHorario}
                        horario={revertirMatriz(horario)}
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
            )}
        </>
    );
}