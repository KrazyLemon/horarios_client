import axios from 'axios';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { checkhorario, checkSalon, setChipColor, setChipColor2 } from '../helper/helper';
import Loading from '../components/Loading';

export default function GruposPage() {

    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(true);
    const url = 'http://localhost:8080/api/v1/grupos';

    const fetchGrupos = async () => {
        try {
            const response = await axios.get(url);
            setGrupos(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchGrupos();
    }
        , []);

    return (
        <>
            {loading ? <div className="flex w-full h-screen items-center justify-center"><Loading /></div> : (
                <div className='flex flex-col w-full  h-screen mx-2 overflow-y-auto '>
                    <div className='flex w-full justify-between items-center mt-2 bg-white rounded-md shadow-md p-3 space-x-2 '>
                        <div className="flex space-x-2 items-center">
                            <Icon icon="fluent:people-20-regular" width="40px" height="40px" className='rounded-full bg-cyan-400 p-1 text-white ' />
                            <h1 className="font-semibold text-2xl">Grupos</h1>
                        </div>
                        <div className="flex space-x-2 items-center">
                            <button className='flex space-x-2 p-2 bg-blue-500 hover:bg-blue-800 rounded text-white items-center'>
                                <Icon icon="fluent:person-add-20-regular" width="30" height="30" />
                                Crear nuevo grupo
                            </button>
                            <button className='flex space-x-2 p-2 bg-red-500 hover:bg-red-800 rounded text-white items-center'>
                                <Icon icon="fluent:person-delete-20-regular" width="30" height="30" />
                                Eliminar grupo
                            </button>
                        </div>
                    </div>
                    <div className='items-center h-fit mt-2 '>
                        <div className='flex bg-white rounded-md shadow-md p-3 justify-between items-center'>
                            <div className="flex  text-sm font-semibold space-x-1">
                                <h1 className=''>Semestre:</h1>
                                <select name="turno" id="turno" className='font-normal'>
                                    <option value="default">Elige un semestre</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                </select>
                                <h1 className=''>Turnos:</h1>
                                <select name="turno" id="turno" className='font-normal'>
                                    <option value="default">Elige un turno</option>
                                    <option value="M">Matutino</option>
                                    <option value="V">Vespertino</option>
                                </select>
                            </div>
                            <div className="flex  text-sm font-semibold space-x-1">
                                <p className=''>Total de grupos: {grupos.length}</p>
                            </div>
                        </div>
                        <div className='grid grid-cols-6 gap-4 mt-2 pb-2'>
                            {grupos.map((grupo) => (
                                <a key={grupo.id} className="rounded-md shadow-md bg-white p-3 border hover:bg-cyan-100 " href={`/grupos/detail?id=${grupo.grupo}`}>
                                    <h2 className='text-md flex justify-center bg-cyan-500 text-white rounded font-semibold'>{grupo.grupo}</h2>
                                    <div className='flex text-sm  gap-1'>
                                        <h1 className='font-semibold' >Turno:</h1>
                                        <p>{grupo.turno === "M" ? "Matutino" : grupo.turno === "V" ? "Vespertino" : grupo.turno}</p>
                                    </div>
                                    <div className='flex text-sm  gap-1'>
                                        <h1 className='font-semibold' >Semestre:</h1>
                                        <p>{grupo.semestre}</p>
                                    </div>
                                    <div className='flex w-full justify-between text-sm text-white gap-1'>
                                        <span className={`w-full border rounded-md px-1 py-1 flex ${setChipColor2(checkSalon(grupo.salon))}`}>
                                            {checkSalon(grupo.salon) === "No tiene salon" ? (
                                                <Icon icon="fluent:document-dismiss-20-regular" width="20" height="20" />
                                            ) : (
                                                <Icon icon="fluent:document-checkmark-20-regular" width="20" height="20" />
                                            )}
                                            {checkSalon(grupo.salon)}
                                        </span>
                                        <span className={`w-full border rounded-md px-1 py-1 flex items-center  ${setChipColor(checkhorario(grupo.horario))}`}>
                                            {checkhorario(grupo.horario) === "Horario Vacio" ? (
                                                <Icon icon="fluent:calendar-error-20-regular" width="20" height="20" />
                                            ) : (
                                                <Icon icon="fluent:calendar-checkmark-20-regular" width="20" height="20" />
                                            )}
                                            {checkhorario(grupo.horario)}
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                    <h1 className='mt-24'></h1>
                </div>
            )}
        </>
    );
} 