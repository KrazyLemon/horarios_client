import { useState, useEffect } from "react";
import { toast } from "react-toastify";
//import { transponerMatriz } from "../../helper/helper";
export default function HorarioClassic({ objeto, materias, onCellClick, handleMove, mode }) {

    const [materiaColors, setMateriaColors] = useState({});
    const [horario, setHorario] = useState([]);
    
    const handleDragStart = (e, rowIndex, cellIndex) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ rowIndex, cellIndex }));
    };
    const handleDrop = (e, rowIndex, cellIndex) => {
        e.preventDefault();
        // Obtener los datos arrastrados
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        // Obtener la materia desde el horario actual
        const id = horario[data.rowIndex][data.cellIndex];
        const prevRow = data.rowIndex;
        const prevCell = data.cellIndex;
        if (mode == "view") {
            toast.warning("No puede mover Materias");
            return;
        }
        // Llamar a la función handleMove con los valores adecuados
        handleMove(rowIndex, cellIndex, id, prevRow, prevCell);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const generateMateriaColors = (horario) => {
        const colors = [
            '#ef4444', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
        ];
        const uniqueMaterias = [...new Set(horario.flat())].filter(materia => materia !== '');
        const newMateriaColors = {};
        uniqueMaterias.forEach((materia, index) => {
            newMateriaColors[materia] = colors[index % colors.length];
        });
        setMateriaColors(newMateriaColors);
    };
    const getColorForMateria = (materia) => {
        return materiaColors[materia] || '#FFFFFF'; // Default color if materia is not in the list
    };

    const findMateria = (id) => {
        if (!objeto || !materias) return '';
        const asignacion = objeto.asignaciones.find(asignacion => asignacion.id === id);
        if (!asignacion) return '';
        if (asignacion.materia === "Tutorias" || asignacion.materia === "Inglés") {
            return asignacion.materia;
        }
        const materia = materias.find(materia => materia.id === asignacion.materia);
        return materia ? materia.nombre : '';
    };
 
    useEffect(() => {
        if (objeto && objeto.horario) {
            setHorario(objeto.horario);
            generateMateriaColors(objeto.horario);
        }
    }, [objeto]);
    
    return (
        <div className="flex flex-col w-full h-full">
            <table className="table-auto w-full h-full mt-2">
                <thead className="bg-gray-500 text-white">
                    <tr>
                        <th className="px-4 py-2">Hora</th>
                        <th className="px-4 py-2">Lunes</th>
                        <th className="px-4 py-2">Martes</th>
                        <th className="px-4 py-2">Miércoles</th>
                        <th className="px-4 py-2">Jueves</th>
                        <th className="px-4 py-2">Viernes</th>
                    </tr>
                </thead>
                <tbody>
                {horario.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td className="text-sm border px-1 py-1 bg-gray-100">{`${7 + rowIndex}:00 - ${8 + rowIndex}:00`}</td>
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={`${rowIndex}-${cellIndex}`}
                                    className="text-sm border px-1 py-1 text-white"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, rowIndex, cellIndex)}
                                    onDrop={(e) => handleDrop(e, rowIndex, cellIndex)}
                                    onDragOver={handleDragOver}
                                    onClick={() => onCellClick(rowIndex, cellIndex)}
                                    style={{ backgroundColor: getColorForMateria(cell) }}
                                >
                                    {cell === '' ? '' : findMateria(cell)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}