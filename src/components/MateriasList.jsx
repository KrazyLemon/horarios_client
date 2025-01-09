import { useState } from 'react';

export default function MateriasList({ materias, handleSelectedMateria }) {

    const [selectedMateria, setSelectedMateria] = useState(null);

    const handleSelected = (materia) => {
        setSelectedMateria(materia);
        handleSelectedMateria(materia);
    }
    return (
        <div>
            <h1 className="text-xl font-semibold w-full flex justify-center">Materias</h1>
            <table className="table-auto w-full">
                <thead className="bg-yellow-500 text-white">
                    <tr>
                        <th className="text-sm px-4 py-2">Materia</th>
                        <th className="text-sm px-4 py-2">Clave</th>
                        <th className="text-sm px-4 py-2">Horas</th>
                        <th className="text-sm px-4 py-2">Semestre</th>
                    </tr>
                </thead>
                <tbody>
                    {materias.map((materia) => (
                        <tr 
                            className={`cursor-pointer ${selectedMateria === materia ? "bg-amber-300" : ""}`}
                            key={materia.id}
                            onClick={() => handleSelected(materia)}
                        >
                            <td className="text-sm border px-1 py-1">{materia.nombre}</td>
                            <td className="text-sm border px-1 py-1">{materia.clave}</td>
                            <td className="text-sm border px-1 py-1">{materia.horas}</td>
                            <td className="text-sm border px-1 py-1">{materia.semestre}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}