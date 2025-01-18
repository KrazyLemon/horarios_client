import { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import MateriasList from "../Tablas/MateriasList";
import ProfesList from "../Tablas/ProfesList";
import Modal from 'react-modal';
import { genHorarios } from "../../helper/helper";

export default function AsignacionesModal({ grupo, isOpen, onRequestClose, handleGenHorario, horario }) {

    const [materiaSelected, setMateriaSelected] = useState(null);
    const [profesores, setProfesores] = useState(null);
    const [materias, setMaterias] = useState(null);
    const [asignaciones, setAsignaciones] = useState([]);
    const [verificador, setVerificador] = useState(false);

    const url = `http://localhost:8080/`;

    const fetchMaterias = async () => {
        const response = await fetch(`${url}materias/semestre/${grupo.semestre}`);
        const data = await response.json();
        setMaterias(data);
        if(data.length >0){
            setMateriaSelected(data[0]);
            fetchProfesores(data[0].nombre);
        }
    }
    const fetchProfesores = async () => {
        if(!materiaSelected) return;
        //console.log(`${url}profesores/materias/${materiaSelected.nombre}`);
        const response = await fetch(`${url}profesores/materias/${materiaSelected.nombre}`);
        const data = await response.json();
        setProfesores(data);
    }
    const handleSelectedMateria = (materia) => {
        setMateriaSelected(materia);
        fetchProfesores(materia.nombre);
    }
    const handleSelectedProfesor = (profe) => {
       
        const asignacion = {
            profesor: profe,
            materia: materiaSelected,
        };

        setAsignaciones((prevAsignaciones) => {
            const existingAsignacionIndex = prevAsignaciones.findIndex(
                (asignacion) => asignacion.materia.nombre === materiaSelected.nombre
            );

            if (existingAsignacionIndex !== -1) {
                // Actualiza el arreglo asignacion
                const updatedAsignaciones = [...prevAsignaciones];
                updatedAsignaciones[existingAsignacionIndex] = asignacion;
                
                return updatedAsignaciones;
            } else {
                // Añade una nueva asignacion
                return [...prevAsignaciones, asignacion];
            }
        });

        //console.log(asignaciones);
        verificarAsignaciones();

        const currentIndex = materias.findIndex(materia => materia.nombre === materiaSelected.nombre);
        const nextIndex = (currentIndex + 1) % materias.length;
        const nextMateria = materias[nextIndex];
        setMateriaSelected(nextMateria);
        fetchProfesores(nextMateria.nombre);
    }
    const verificarAsignaciones = () => {
        setVerificador(() => {
            if (!materias || asignaciones.length === 0) return false;
            return materias.every(materia =>
                asignaciones.some(asignacion => asignacion.materia.nombre === materia.nombre)
            );
        });
    }
    const handleClick = () => {
        const dataGen = genHorarios(horario,grupo,asignaciones);
        const grupoActualizado = dataGen.grupoActualizado;
        const profesActualizados = dataGen.profesActualizados;
        handleGenHorario(grupoActualizado,profesActualizados);
        onRequestClose();
        setAsignaciones([]);
        setVerificador(false);
    }
    const handleCLoseModal = () => {
        onRequestClose();
        setAsignaciones([]);
        setVerificador(false);
    }
    const filtrarProfesoresPorTurno = (profesores, turnoGrupo) => {
        return profesores.filter(profesor => {
            if (!profesor.entrada) {
                return false;
            }
            const horaEntrada = parseInt(profesor.entrada.split(':')[0], 10);
            const turnoProfesor = horaEntrada >= 14 ? 'V' : 'M';
            return turnoProfesor === turnoGrupo;
        });
    };

    const profesoresFiltrados = profesores ? filtrarProfesoresPorTurno(profesores, grupo.turno) : [];

    useEffect(() => {
        if (grupo) {
            fetchMaterias();
        }
    }, [grupo]);

    useEffect(()=>{
        if(materiaSelected){
            fetchProfesores(materiaSelected.nombre);
        }
    },[materiaSelected])

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleCLoseModal}
            overlayClassName="modal-overlay"
            className="w-5/6 h-5/6 flex mt-6 mx-auto bg-white rounded-md p-3"
        >
            <div className="flex flex-col w-full h-fit"> {/* Materias y Profesores */}
                <h2 className="text-xl font-bold">Asignacion de Profesores</h2>
                <div className="flex w-full items-top">
                    <div className='flex w-full flex-col items-top p-3 text-2xl'>
                        {materias && (
                            <MateriasList
                                materias={materias}
                                materiaSelected={materiaSelected}
                                handleSelectedMateria={handleSelectedMateria}
                            />
                        )}
                        <h6 className="text-xs">**Haz doble click para mostrar los profesores</h6>
                    </div>
                    <div className='flex w-full flex-col items-top p-3 text-2xl'>
                        {profesores && (
                            <ProfesList
                                profesores={profesoresFiltrados}
                                handleSelectedProfesor={handleSelectedProfesor}
                                materia={materiaSelected}
                            />
                        )}
                        <h6 className="text-xs">**Haz click para asignar al grupo el profesor</h6>
                        <h6 className="text-xs">**Haz doble click al finalizar</h6>
                    </div>
                </div>
                <div className='flex flex-col p-3'>
                    <h1 className="flex w-full justify-center text-xl font-semibold">Profesores asignados al Grupo {grupo.grupo}</h1>
                    <table className=''>
                        <thead className="bg-rose-500 text-white">
                            <tr>
                                <th className="px-4 py-2">Profesor</th>
                                <th className="px-4 py-2">Materia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {asignaciones.length > 0 && asignaciones.map((asignacion, index) => (
                                <tr key={index}>
                                    <td className="text-sm border px-1 py-1">{asignacion.profesor.nombre} {asignacion.profesor.apellido}</td>
                                    <td className="text-sm border px-1 py-1">{asignacion.materia.nombre}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end mt-2">
                        {verificador ? (
                            <span className="flex items-center text-green-500 font-semibold text-sm">
                                <Icon icon="fluent:checkmark-circle-20-regular" width="30" height="30" />
                                Todas las asignaciones hechas
                            </span>
                        ) : (
                            <span className="flex items-center text-red-500 font-semibold text-sm">
                                <Icon icon="fluent:error-circle-20-regular" width="30" height="30" />
                                Faltan asignaciones
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex justify-end mt-2 w-full p-3">
                    {verificador ? (
                        <a className="flex items-center space-x-2 rounded bg-amber-500 text-white p-2" onClick={handleClick}>
                            <Icon icon="fluent:sparkle-20-regular" width="30" height="30" />
                            Generar Horario
                        </a>
                    ) : (
                        <a className="flex items-center space-x-2 rounded bg-gray-500 text-white p-2" >
                            <Icon icon="fluent:sparkle-20-regular" width="30" height="30" />
                            Generar Horario
                        </a>
                    )}
                </div>
            </div>
        </Modal>
    );
}