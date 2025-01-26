import { useEffect, useState } from "react"
import Loading from "../Generals/Loading";
import { revertirMatriz } from "../../helper/helper";

export default function Horario({ profesor, handleGetHorario }) {
    const URL = "http://localhost:8080"
    const [grupos, setGrupos] = useState(null);
    const [materias, setMaterias] = useState(null);
    const [horario, setHorario] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchGrupos = () => {
        const fetchAsignaciones = async () => {
            const resultados = await Promise.all(profesor.asignaciones.map(async (asignacion) => {
                if (asignacion.objeto == "*") return { grupo: asignacion.objeto, salon: "" };
                if (asignacion.objeto == null) return "";
                const response = await fetch(`${URL}/grupo/${asignacion.objeto}`);
                const data = await response.json();
                return data;
            }));
            setGrupos(resultados);
        };
        fetchAsignaciones().catch(error => console.error('Error fetching grupos:', error));
    }
    const fetchMaterias = () => {
        const fetchAsignaciones = async () => {
            const resultados = await Promise.all(profesor.asignaciones.map(async (asignacion) => {
                if (asignacion.objeto == null) return "";
                if (asignacion.materia == "Tutorias") {
                    return { nombre: "Tutorias", clave: "TUTO-001", horas: "1" };
                }

                if (isNaN(asignacion.materia.charAt(0))) return { nombre: asignacion.materia, horas: "1", clave: "N/A" };
                const response = await fetch(`${URL}/materia/${asignacion.materia}`);
                const data = await response.json();
                return data;
            }));
            setMaterias(resultados);

        };
        fetchAsignaciones().catch(error => console.error('Error fetching Materias:', error));
    }
    const genRow = () => {
        let hInicio = 7;
        const horo = revertirMatriz(profesor.horario);
        if (profesor.asignaciones.length == 0) return;
        if (parseInt(profesor.entrada) >= 14) {
            hInicio = 14;
        }
        const row = profesor.asignaciones.map((_, index) => {
            const id = _.id;
            const dias = horo.map((row, index) => {
                const inicio = row.indexOf(id);
                const final = 1 + row.lastIndexOf(id);
                if (id == "") return "";
                if (inicio == -1) {
                    return "";
                }
                return String(inicio + hInicio) + "-" + String(final + hInicio);
            })
            return {
                grupo: grupos[index].grupo,
                materia: materias[index].nombre,
                clave: materias[index].clave,
                dias: dias,
                salon: grupos[index].salon,
                horas: materias[index].horas
            }
        })
        setHorario(row);
        handleGetHorario(row);
        setLoading(false);
    }
    useEffect(() => {
        fetchMaterias();
        fetchGrupos();
    }, []);

    useEffect(() => {
        if (grupos && materias) {
            genRow();
        }

    }, [grupos, materias]);

    return (
        <>
            {loading ?
                <div className="flex justify-center items-center h-fit">
                    <Loading />
                </div> : (profesor &&
                    profesor.asignaciones.length == 1 ? <> No tiene asignaciones </> : (
                    <table className="table-auto w-full h-full mt-2">
                        <thead className="bg-gray-500 text-white">
                            <tr>
                                <th className="px-4 py-2">Grupo</th>
                                <th className="px-4 py-2">Materia</th>
                                <th className="px-4 py-2">Clave</th>
                                <th className="px-4 py-2">Lunes</th>
                                <th className="px-4 py-2">Martes</th>
                                <th className="px-4 py-2">Miercoles</th>
                                <th className="px-4 py-2">Jueves</th>
                                <th className="px-4 py-2">Viernes</th>
                                <th className="px-4 py-2">Salon</th>
                                <th className="px-4 py-2">Horas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {horario && horario.map((index) => (
                                <tr key={index.grupo}>
                                    <td className="text-sm border px-1 py-1 ">{index.grupo}</td>
                                    <td className="text-sm border px-1 py-1 ">{index.materia}</td>
                                    <td className="text-sm border px-1 py-1 ">{index.clave}</td>
                                    {index.dias.map((dia, index) => (
                                        <td key={index} className="text-sm border px-1 py-1 ">{dia === "" ? "" : dia}</td>
                                    ))}
                                    <td className="text-sm border px-1 py-1 ">{index.salon}</td>
                                    <td className="text-sm border px-1 py-1 ">{index.horas}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
                )
            }
        </>
    )
}