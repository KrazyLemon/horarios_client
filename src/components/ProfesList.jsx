import { useState } from 'react';

export default function ProfesList({ profesores, handleSelectedProfesor }) {

    const [selectedProfesor, setSelectedProfesor] = useState(null);

    const handleSelected = (profe) => {
        setSelectedProfesor(profe);
        handleSelectedProfesor(profe);
        //console.log(profe);
    }

    return (
        <div>
            <h1 className="font-semibold w-full flex justify-center text-xl">Profesores</h1>
            <table className='table-auto w-full'>
                <thead className="bg-cyan-500 text-white">
                    <tr>
                        <th className="text-sm px-4 py-2">Nombre</th>
                        <th className="text-sm px-4 py-2">Apellido</th>
                        <th className="text-sm px-4 py-2">Entrada</th>
                        <th className="text-sm px-4 py-2">Salida</th>
                        <th className="text-sm px-4 py-2">Horas</th>
                        <th className="text-sm px-4 py-2">Bandera</th>
                        <th className="text-sm px-4 py-2">Antigüedad</th>
                    </tr>
                </thead>
                <tbody>
                    {profesores.map((profe) => (
                        <tr 
                            className={`cursor-pointer ${selectedProfesor === profe ? "bg-cyan-300" : ""}`}
                            key={profe.id}
                            onClick={() => handleSelected(profe)}
                        >
                            <td className="text-sm border px-1 py-1">{profe.nombre}</td>
                            <td className="text-sm border px-1 py-1">{profe.apellido}</td>
                            <td className="text-sm border px-1 py-1">{profe.entrada}</td>
                            <td className="text-sm border px-1 py-1">{profe.salida}</td>
                            <td className="text-sm border px-1 py-1">{profe.horas}</td>
                            <td className="text-sm border px-1 py-1">{profe.bandera}</td>
                            <td className="text-sm border px-1 py-1">{profe.antiguedad}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}