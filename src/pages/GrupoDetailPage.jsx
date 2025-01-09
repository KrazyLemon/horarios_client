import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import HorarioClassic from "../components/Horarios/HorarioClassic";
import Horario from "../components/Horarios/Horario";
import { checkhorario, checkSalon, filterLista, genId, revertirMatriz, setChipColor, setChipColor2, transponerMatriz } from '../helper/helper';
import AsignacionesModal from "../components/Modals/AsignacionesModal";
import { ToastContainer, toast } from "react-toastify";
import ToolTip from "../components/Generals/ToolTip";
import Loading from "../components/Generals/Loading";
import MateriasList from "../components/Tablas/MateriasList";
import SalonesSelect from "../components/Tablas/SalonesSelect";
import TutoModal from "../components/Modals/TutoModal";
import PutModal from "../components/Modals/PutModal";

export default function GrupoDetailPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const url = `http://localhost:8080/api/v1/`;
    //Listas de Objetos Extraidas del API
    const [grupo, setGrupo] = useState(null);
    const [profesList, setProfesList] = useState(null);
    const [salones, setSalones] = useState(null);
    const [materias, setMaterias] = useState(null);
    const [ingles, setIngles] = useState(null);
    const [salon, setSalon] = useState(null);
    //Booleans Para Controlar los Loadings 
    const [loading, setLoading] = useState(true);
    const [horarioLoading, setHorarioLoading] = useState(true);
    const [materiasLoading, setMateriasLoading] = useState(true);
    const [salonesloading, setSalonesLoading] = useState(true);
    const [loadingIngles, setLoadingIngles] = useState(false);
    const [profesLoading, setProfesLoading] = useState(true);
    //Booleans para controlar los modals y botones
    const [modalShow, setModalShow] = useState(false);
    const [modalTutoShow, setModalTutoShow] = useState(false);
    const [modalConfirmShow, setModalConfirmShow] = useState(false);
    const [isAssigningIngles, setIsAssigningIngles] = useState(true);


    const fetchgrupo = async () => {
        const response = await fetch(`${url}grupos/grupo/${id}`);
        const data = await response.json();
        setGrupo({ ...data, horario: revertirMatriz(data.horario) });
        setSalon(data.salon);
        if (data.asignaciones.some(asignacion => asignacion.materia === "Inglés") && data.semestre <= 5) {
            setIngles(data.asignaciones.find(asignacion => asignacion.materia === "Inglés"));
            setIsAssigningIngles(false);
        }
        setLoading(false);
    }
    const fetchMaterias = async () => {
        const response = await fetch(`${url}materias/semestre/${grupo.semestre}`);
        const data = await response.json();
        setMaterias(data);
        setMateriasLoading(false);
    }
    const fetchSalones = async () => {
        const result = await fetch(`${url}salones`);
        const data = await result.json();
        setSalones(data);
        setSalonesLoading(false);
    }
    const fecthIngles = () => {
        if (ingles == null) {
            const ids = grupo.asignaciones.map(asignacion => asignacion.id);
            const newId = genId(ids);
            const inglesAsignacion = {
                id: newId,
                objeto: "Teacher",
                materia: "Inglés"
            }
            setIngles(inglesAsignacion);
            const newGrupo = grupo;
            newGrupo.asignaciones = [...grupo.asignaciones, inglesAsignacion];
            setGrupo(newGrupo);
        }
    }
    const fetchProfes = async () => {
        if (grupo.asignaciones.length == 1) {
            setProfesLoading(false);
            return;
        }
        const profes = await Promise.all(grupo.asignaciones.map(async asignacion => {
            if (asignacion.objeto !== "Teacher" || asignacion.objeto !== "") {
                //console.log(asignacion.objeto);
                const response = await fetch(`${url}profesores/${asignacion.objeto}`);
                const data = await response.json();
                return data;
            }
        }));
        setProfesList(filterLista(profes));
        setProfesLoading(false);
    }
    const handleModal = () => {
        setModalShow(!modalShow);
        setHorarioLoading(!horarioLoading);
        setProfesLoading(!profesLoading);
    }
    const handleGenHorario = (grupo, profes) => {
        setGrupo(grupo);
        setProfesList(profes);
        setHorarioLoading(!horarioLoading);
        setProfesLoading(!profesLoading);
        toast.success('Horario generado exitosamente');
    }
    const handleTutoModal = () => {
        const count = transponerMatriz(grupo.horario).flat().filter(cell => cell === "Tutorias").length;
        if (profesList == null || grupo.horario == null) {
            toast.error("Primero genere un horario");
            return;
        } else {
            if (count >= 1) {
                toast.error('Solo se puede asignar una celda con la materia Tutorias');
                return;
            }
            setHorarioLoading(!horarioLoading);
            setProfesLoading(!profesLoading);
            setModalTutoShow(!modalTutoShow);
        }
    }
    const handleTuto = (grupo, horario, profes) => {
        const newGrupo = grupo;
        newGrupo.horario = revertirMatriz(horario);
        setGrupo(newGrupo);
        setProfesList(profes);
        setHorarioLoading(!horarioLoading);
        setProfesLoading(!profesLoading);
    }
    const canAssignIngles = () => {
        if (ingles == null) return false;
        const count = transponerMatriz(grupo.horario).flat().filter(cell => cell === ingles.id).length;
        if (count >= 6) {
            setIsAssigningIngles(false);
            return false;
        }
        return true;
    }
    const HandleInglesButton = () => {
        if (!canAssignIngles()) {
            setLoadingIngles(false);
            toast.success('La materia Inglés ya tiene 6 horas asignadas');
        }
    }
    const handleCellClick = (rowIndex, cellIndex) => {
        if (isAssigningIngles) {
            setLoadingIngles(true);
            if (!canAssignIngles()) return;
            const newHorario = grupo.horario.map((row, rIdx) =>
                row.map((cell, cIdx) =>
                    (rIdx === rowIndex && cIdx === cellIndex ? ingles.id : cell))
            );
            setGrupo({ ...grupo, horario: newHorario });
        }
    }
    const checkHorarioProfe = (dia, hora, id, prevRow, prevCell) => {
        // Verificar que la celda del horario del grupo está vacía
        if (grupo.horario[dia][hora] !== "") {
            toast.error("La celda en el horario del grupo ya está ocupada");
            return false;
        }

        // Si la materia es "Inglés", no verificar los horarios de los profesores
        if (ingles !== null) {
            if (id === ingles.id) {
                const nuevoHorarioGrupo = grupo.horario.map((row, rIdx) =>
                    row.map((cell, cIdx) => {
                        if (rIdx === dia && cIdx === hora) {
                            return id;
                        } else if (rIdx === prevRow && cIdx === prevCell) {
                            return "";
                        }
                        return cell;
                    })
                );
                setGrupo({ ...grupo, horario: nuevoHorarioGrupo });
                toast.success("La asignación se realizó con éxito");
                return;
            }
        }
        // Encontrar el profesor que tiene asignada la materia con el grupo especificado
        const profesorIndex = profesList.findIndex(profesor =>
            profesor.asignaciones.some(asignacion => asignacion.id === id)
        );
        const profesorEncontrado = profesList[profesorIndex];
        // Verificar que la celda correspondiente en el horario del profesor está vacía
        const horarioDoc = transponerMatriz(profesorEncontrado.horario)
        if (horarioDoc[dia][hora] !== "") {
            toast.error("La celda en el horario del profesor ya está ocupada");
            return false;
        }
        // Actualizar los horarios utilizando map para mantener la inmutabilidad
        const nuevoHorarioGrupo = grupo.horario.map((row, rIdx) =>
            row.map((cell, cIdx) => {
                if (rIdx === dia && cIdx === hora) {
                    return id;
                } else if (rIdx === prevRow && cIdx === prevCell) {
                    return "";
                }
                return cell;
            })
        );
        const nuevoHorarioProfe = horarioDoc.map((row, rIdx) =>
            row.map((cell, cIdx) => {
                if (rIdx === dia && cIdx === hora) {
                    return id;
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
        setGrupo({ ...grupo, horario: nuevoHorarioGrupo });
        setProfesList(nuevoProfesList);
        setHorarioLoading(false);
        toast.success("La asignación se realizó con éxito");
        return true;
    }
    const handleSalonSelected = (salon) => {
        if (grupo.turno == "V" && salon.g_v != "") {
            toast.error("El salon ya tiene grupo asignado en la tarde");
            return;
        } else {
            if (grupo.turno == "M" && salon.g_m != "") {
                toast.error("El salon ya tiene grupo asignado en la mañana");
                return;
            } else {
                setSalon(salon);
                const newgrupo = grupo;
                newgrupo.salon = salon.salon;
                setGrupo(newgrupo);
            }
        }
    }
    const deleteHorario = () => {
        if (window.confirm("¿Estás seguro de que deseas eliminar los cambios?")) {
            const emptyHorario = Array(8).fill(Array(5).fill(""));
            setGrupo({ ...grupo, horario: emptyHorario, asignaciones: [], salon: "" });
            setIngles(null);
            setProfesList(null);
            setIsAssigningIngles(true);
            toast.success("Horario eliminado exitosamente");
            setHorarioLoading(true);
            fecthIngles();
        }
    }
    const handlePutModal = () => {
        if (grupo == null || grupo.horario == null || profesList == null || grupo.salon == "") {
            toast.error("Primero complete toda la información del grupo");
            return;
        }
        setModalConfirmShow(!modalConfirmShow);
    }

    useEffect(() => {
        fetchgrupo();
    }, [id]);

    useEffect(() => {
        setTimeout(() => {
            if (grupo) {
                fetchMaterias();
                fetchSalones();
                if (grupo.semestre <= 5) {
                    fecthIngles();
                }
                setHorarioLoading(false);
            }
        }, 1000);
    }, [grupo]);

    return (
        <>
            {loading ? <div className="flex w-full h-screen items-center justify-center"><Loading /></div> : (
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
                    <div className="flex  space-x-2"> {/* Contenedor de Acciones y Horario */}
                        <div className="flex flex-col justify-between  space-y-2 bg-white rounded-md shadow-md p-3">
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
                                {salonesloading
                                    ? <div className="flex w-full items-center justify-center"><Loading /></div> :
                                    (<SalonesSelect
                                        salones={salones}
                                        salonGrupo={grupo.salon}
                                        handleSalonSelected={handleSalonSelected}
                                    />)
                                }
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
                            <div>
                                {materiasLoading ?
                                    <div className="flex w-full h-fit items-center justify-center">
                                        <Loading />
                                    </div>
                                    : (
                                        <MateriasList materias={materias} />
                                    )
                                }
                            </div>
                        </div>
                        <div className='flex flex-col w-full space-y-2 bg-white rounded-md shadow-md p-3'>
                            <div className="flex justify-between ">{/* Acciones */}
                                <div className="space-x-2 ">
                                    {grupo.semestre <= 5 && (
                                        <ToolTip tooltip="Asignar Ingles" >
                                            {isAssigningIngles ? (
                                                <a className="flex items-center space-x-2 cursor-pointer rounded bg-purple-500 text-white p-2" onClick={HandleInglesButton}>
                                                    <Icon icon="fluent:calendar-star-20-regular" width="30" height="30" />
                                                    {loadingIngles ? (
                                                        <h1 >Asignando Inglés...</h1>
                                                    ) : (
                                                        <h1 >Asignar Inglés </h1>
                                                    )}
                                                </a>
                                            ) : (
                                                <a className="flex items-center space-x-2 cursor-pointer rounded bg-gray-500 text-white p-2">
                                                    <Icon icon="fluent:calendar-star-20-regular" width="30" height="30" />
                                                    Inglés Asignado
                                                </a>
                                            )}
                                        </ToolTip>
                                    )}
                                    <ToolTip tooltip="Generar Horario">
                                        <a className="flex items-center space-x-2 rounded cursor-pointer bg-amber-500 text-white p-2" onClick={handleModal}>
                                            <Icon icon="fluent:calendar-sparkle-20-regular" width="30" height="30" />
                                            Generar Horario
                                        </a>
                                    </ToolTip>
                                    <ToolTip tooltip="Asignar Tutorias" >
                                        <a className="flex items-center space-x-2 rounded cursor-pointer bg-red-500 text-white p-2" onClick={handleTutoModal} >
                                            <Icon icon="fluent:calendar-person-20-regular" width="30" height="30" />
                                            Asignar Tutorias
                                        </a>
                                    </ToolTip>
                                </div>
                                <div className="space-x-2">
                                    <ToolTip tooltip="Guardar Cambios">
                                        <a className="flex items-center cursor-pointer  rounded bg-green-500 text-white p-2" onClick={handlePutModal} >
                                            <Icon icon="fluent:save-20-regular" width="30" height="30" />
                                            Guardar
                                        </a>
                                    </ToolTip>
                                    <ToolTip tooltip="Eliminar Cambios">
                                        <a className="flex items-center space-x-2 cursor-pointer rounded bg-red-500 text-white p-2" onClick={deleteHorario} >
                                            <Icon icon="fluent:delete-20-regular" width="30" height="30" />
                                            Eliminar
                                        </a>
                                    </ToolTip>
                                </div>
                            </div>
                            {horarioLoading ? <div className="flex w-full h-fit items-center justify-center"><div className="spinner"></div></div> : (
                                <HorarioClassic
                                    mode={"edit"}
                                    materias={materias}
                                    objeto={grupo}
                                    onCellClick={handleCellClick}
                                    handleMove={checkHorarioProfe}
                                />
                            )}
                        </div>
                    </div>
                    <div className='gap space-y-2'>
                        {profesList && (
                            profesLoading ? <div className="flex w-full h-fit items-center justify-center"><Loading /></div> : (
                                profesList.map((profe, index) => (
                                    <div key={index} className="w-full h-fit  bg-white rounded-md shadow-md p-3">
                                        <h1 className="flex w-full font-semibold justify-center">Horario del profe {profe.nombre} {profe.apellido}</h1>
                                        {/* <Horario profesor={profe} /> */}
                                    </div>
                                ))
                            )
                        )}
                        <h1 className="pb-48"></h1>
                    </div>
                    <PutModal
                        isOpen={modalConfirmShow}
                        onRequestClose={handlePutModal}
                        grupo={grupo}
                        horario={revertirMatriz(grupo.horario)}
                        materias={materias}
                        profesList={profesList}
                    />
                    <TutoModal
                        isOpen={modalTutoShow}
                        onRequestClose={() => setModalTutoShow(!modalTutoShow) && setHorarioLoading(!horarioLoading)}
                        horario={grupo.horario}
                        profesList={profesList}
                        handleTutoClick={handleTuto}
                        grupo={grupo}
                        materias={materias}
                    />
                    <AsignacionesModal
                        isOpen={modalShow}
                        onRequestClose={handleModal}
                        grupo={grupo}
                        handleGenHorario={handleGenHorario}
                        horario={revertirMatriz(grupo.horario)}
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