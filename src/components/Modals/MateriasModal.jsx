import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';


export default function MateriasModal({ addmaterias ,isOpen, onRequestClose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [materiasSelected, setMateriasSelected] = useState([]);
    const materiasPerPage = 10;

    const [materias, setMaterias] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/materias')
            .then(response => response.json())
            .then(data => {
                setMaterias(data);
            });
    }, []);

    const buscar = (term) => {
        setSearchTerm(term);
        setCurrentPage(1); // Reset to first page on new search
    };
    const handleRowDoubleClick = (materia) => {
        //  console.log(materia);
        if (!materiasSelected.some(selected => selected.nombre === materia.nombre)) {
            setMateriasSelected([...materiasSelected, materia.nombre]);
        }
    };
    const handleRemoveMateria = (nombre) => {
        setMateriasSelected(materiasSelected.filter(materia => materia !== nombre));
    };

    const handleAddMaterias = () => {
        addmaterias(materiasSelected);
        setMateriasSelected([]);
        onRequestClose();
    };

    const filteredMaterias = materias.filter(materia =>
        materia.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const indexOfLastMateria = currentPage * materiasPerPage;
    const indexOfFirstMateria = indexOfLastMateria - materiasPerPage;
    const currentMaterias = filteredMaterias.slice(indexOfFirstMateria, indexOfLastMateria);
    const totalPages = Math.ceil(filteredMaterias.length / materiasPerPage);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="w-3/6 flex items-center mt-6 m-auto bg-white rounded-md shadow-md p-3"
            overlayClassName="modal-overlay"
        >
            <div className='w-full'>
                <h2 className="text-xl font-bold" >Agregar Materias</h2>
                <div className='flex justify-between items-center my-2 border border-gray-400 rounded w-full'>
                    <Icon icon="fluent:search-20-regular" className='ms-2' width="30" height="30" />
                    <input
                        type="text"
                        name="semestre"
                        id="semestre"
                        onChange={(e) => buscar(e.target.value)}
                        placeholder="Buscar"
                        className=' p-2 rounded w-full'
                    />
                </div>
                <table className='w-full table-auto'>
                    <thead className="bg-yellow-500 text-white ">
                        <tr className=''>
                           
                            <th>Materia</th>
                            <th>Clave</th>
                            <th>Horas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentMaterias.length > 0 &&
                            currentMaterias.map((materia) => (
                                <tr 
                                    className={`border ${materiasSelected.some(selected => selected.nombre === materia.nombre) ? 'bg-yellow-200' : ''}`}
                                    key={materia.nombre}
                                    onDoubleClick={() => handleRowDoubleClick(materia)}>
                                    <td className="text-sm border p-1 ">{materia.nombre}</td>
                                    <td className="text-sm border p-1 ">{materia.clave}</td>
                                    <td className="text-sm border p-1 ">{materia.horas}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
                <h6 className='text-xs font-semibold'>**Haz doble click en la materia para seleccionarla</h6>
                <div className="flex justify-end mt-1">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <div>
                    <h1 className='text-xl font-bold'>Materias Seleccionadas</h1>
                    <ul className='flex flex-wrap'>
                        {materiasSelected.map((materia) => (
                            <li key={materia} className='bg-gray-100 border rounded-full px-3 py-1 m-1 flex items-center font-semibold text-sm'>
                                {materia}
                                <button onClick={() => handleRemoveMateria(materia)} className='ml-2 text-gray-400 hover:text-gray-700'>
                                    <Icon icon="fluent:dismiss-circle-24-filled" width="24" height="24" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='flex justify-end'>
                    <button 
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2 mx-1'
                        onClick={handleAddMaterias}>
                        Añadir</button>
                    <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded my-2 mx-1' onClick={onRequestClose}>Cerrar</button>
                </div>
            </div>
        </Modal>
    );
}