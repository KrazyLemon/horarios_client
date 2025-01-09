import { useState, useEffect } from "react";

export default function Horario({ horario, nombre, onCellClick, checkHorarioProfe }) {

    const [materiaColors, setMateriaColors] = useState({});

    useEffect(() => {
        generateMateriaColors(horario);
    }, [horario]);

    const handleDragStart = (e, rowIndex, cellIndex) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ rowIndex, cellIndex }));
    };
    const handleDrop = (e, rowIndex, cellIndex) => {
        e.preventDefault();

        // Obtener los datos arrastrados
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));

        // Obtener la materia desde el horario actual
        const materia = horario[data.rowIndex][data.cellIndex];
        const prevRow = data.rowIndex;
        const prevCell = data.cellIndex;
        // Verificar que el grupo esté definido (nombre del grupo actual)
        if (!nombre) {
            alert("El nombre del grupo no está definido.");
            return;
        }

        // Llamar a la función checkHorarioProfe con los valores adecuados
        checkHorarioProfe(rowIndex, cellIndex, materia, nombre, prevRow, prevCell);
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
                                    className="text-sm border px-2 py-4 text-white"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, rowIndex, cellIndex)}
                                    onDrop={(e) => handleDrop(e, rowIndex, cellIndex)}
                                    onDragOver={handleDragOver}
                                    onClick={() => onCellClick(rowIndex, cellIndex)}
                                    style={{ backgroundColor: getColorForMateria(cell) }}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}