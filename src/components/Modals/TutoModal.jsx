import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import ProfesList from '../Tablas/ProfesList';
import Horario from '../Horarios/Horario';
import HorarioClassic from '../Horarios/HorarioClassic';
import { toast } from 'react-toastify';
import { transponerMatriz, revertirMatriz, updateAsignaciones, genId } from '../../helper/helper';

function TutoModal({ isOpen, onRequestClose, grupo, materias, profesList, handleTutoClick }) {
    const [tutor, setTutor] = useState(null);

    const handleSelectedProfesor = (profe) => {
        setTutor({...profe, horario: transponerMatriz(profe.horario)});
    }

    const handleCellClick = (rowIndex, cellIndex) => {
        if (!tutor) {
            toast.warning("Seleccione primero un Tutor");
            return;
        } else {
            if (grupo.horario[rowIndex][cellIndex] != "") {
                toast.error("La celda en el horario del grupo ya está ocupada");
                return false;
            }
            if (tutor.horario[rowIndex][cellIndex] != "") {
                toast.error("La celda en el horario del profesor ya está ocupada");
                return false;
            }
            const id = genId(tutor.asignaciones.map(asignacion => asignacion.id));
            const nuevoHorarioProfe = tutor.horario.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                    if (rIdx === rowIndex && cIdx === cellIndex) {
                        return id;
                    }
                    return cell;
                })
            );
            const nuevoHorarioGrupo = grupo.horario.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                    if (rIdx === rowIndex && cIdx === cellIndex) {
                        return id;
                    }
                    return cell;
                })
            );

            const nuevaAsignacionProfesor = updateAsignaciones(tutor.asignaciones, id, grupo.id, "Tutorias");
            const nuevaAsignacionGrupo = updateAsignaciones(grupo.asignaciones, id, tutor.id, "Tutorias");

            const profeIndex = profesList.findIndex(profe => profe.id === tutor.id)       
            const horas = (parseInt(tutor.horas) + 1).toString();
            const nuevoProfesList = profesList.map((profesor, index) =>
                index === profeIndex
                    ? {
                        ...profesor,
                        horario: revertirMatriz(nuevoHorarioProfe),
                        asignaciones: nuevaAsignacionProfesor,
                        horas: horas
                    }
                    : profesor
            );
            console.log(nuevoProfesList);
            const nuevoGrupo = { ...grupo, asignaciones: nuevaAsignacionGrupo };


            handleTutoClick(nuevoGrupo, revertirMatriz(nuevoHorarioGrupo), nuevoProfesList);
            toast.success("Tutor Asignado");
            onRequestClose();
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            overlayClassName="modal-overlay"
            className="w-5/6 h-5/6 flex items-top mt-6 mx-auto bg-white rounded-md p-3"
        >
            <div className='flex space-x-2 justify-around'>
                <div className=' space-y-2'>
                    <h1 className='flex w-full justify-center font-semibold text-2xl'>1. Elige un Tutor</h1>
                    <ProfesList profesores={profesList} handleSelectedProfesor={handleSelectedProfesor} />
                    {tutor ? (
                        <div className='w-full h-fit'>
                            <h1 className='flex w-full justify-center font-semibold text-xl'>Horario del profesor {tutor.nombre} {tutor.apellido}</h1>
                            <HorarioClassic objeto={tutor} />
                        </div>
                    ) : (
                        <h1></h1>
                    )}
                </div>
                <div className='flex flex-col justify-between w-full h-fill'>
                    <h1 className='flex w-full justify-center font-semibold text-2xl'>2. Elige una hora</h1>
                    <h1 className='mt-7'></h1>
                    <HorarioClassic
                        objeto={grupo}
                        onCellClick={handleCellClick}
                        materias={materias}
                    />
                </div>

            </div>

        </Modal>
    );
}

export default TutoModal;