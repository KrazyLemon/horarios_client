import { createContext, useEffect, useState } from 'react';
import instance from '../api/axios';

export const GlobalContext = createContext();

export const useGlobal = () => {
    const globalContext = useContext(GlobalContext);
    if (!globalContext) {
        throw new Error("useGlobal debe estar dentro del proveedor GlobalContext");
    }
    return globalContext;
}

export default function GlobalProvider({ children }) {

    const [grupos, setGrupos] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [salones, setSalones] = useState([]);
    const [profesores, setProfesores] = useState([]);

    // Metodos para obtener datos de la API
    const getGrupos = async () => {
        try {
            const response = await instance.get("/grupos");
            console.log(response);
            const data = await response.data();
            setGrupos(data);
            return data;
        } catch (error) {
            return error;
            console.log(error);
        }
    }
    const getMaterias = async () => {
        try {
            const response = await instance.get(`/materias`);
            const data = await response.data();
            setMaterias(data);
            return data;
        } catch (error) {
            return error;
        }
    }
    const getProfesores = async () => {
        try {
            const response = await instance.get(`/profesores`);
            const data = await response.data();
            setProfesores(data);
            return data;
        } catch (error) {
            return error;
        }
    }
    const getSalones = async () => {
        try {
            const response = await instance.get(`/salones`);
            const data = await response.data();
            setSalones(data);
            return data;
        } catch (error) {
            return error;
        }
    }
    const getGrupoById = async (id) => {
        try {
            const response = await instance.get(`/grupo/${id}`);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }
    const getMateriaById = async (id) => {
        try {
            const response = await instance.get(`/materia/${id}`);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }
    const getProfesorById = async (id) => {
        try {
            const response = await instance.get(`/profesor/${id}`);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }
    const getSalonById = async (id) => {
        try {
            const response = await instance.get(`/salon/${id}`);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }
    const getMateriaBySemestre = async (semestre) => {
        try {
            const response = await instance.get(`/materia/semestre/${semestre}`);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }
    const getMateriaByNombre = async (nombre) => {
        try {
            const response = await instance.get(`/materia/nombre/${nombre}`);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }
    const getGrupobyGrupo = async (grupo) => {
        try {
            const response = await instance.get(`/grupos/grupo/${grupo}`);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }
    const getProfesoresByMateria = async (materia) => {
        try {
            const response = await instance.get(`/profesores/materia/${materia}`);
            const data = await response.data();
            return data;
        }
        catch (error) {
            return error;
        }
    }
    const getProfesorByNombre = async (nombre) => {
        try {
            const response = await instance.get(`/profesor/nombre/${nombre}`);
            const data = await response.data();
            return data;
        }
        catch (error) {
            return error;
        }
    }
    const getSalonbyNombre = async (nombre) => {
        try {
            const response = await instance.get(`/salones/salon/${nombre}`);
            const data = await response.data();
            return data;
        }
        catch (error) {
            return error;
        }
    }

    // Metodos para Actualizar datos a la API
    const putGrupo = async (id, grupo) => {
        try {
            const response = await instance.put(`/grupo/${id}`, grupo);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }
    const putMateria = async (id, materia) => {
        try {
            const response = await instance.put(`/materia/${id}`, materia);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }
    const putProfesor = async (id, profesor) => {
        try {
            const response = await instance.put(`/profesor/${id}`, profesor);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }
    const putSalon = async (id, salon) => {
        try {
            const response = await instance.put(`/salon/${id}`, salon);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }
    // Metodos para enviar datos de la API
    const postGrupo = async (grupo) => {
        try {
            const response = await instance.post(`/grupo`, grupo);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }
    const postMateria = async (materia) => {
        try {
            const response = await instance.post(`/materia`, materia);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }
    const postProfesor = async (profesor) => {
        try {
            const response = await instance.post(`/profesor`, profesor);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }
    const postSalon = async (salon) => {
        try {
            const response = await instance.post(`/salon`, salon);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }
    // Metodos para eliminar datos de la API
    const deleteGrupo = async (id) => {
        try {
            const response = await instance.delete(`/grupo/${id}`);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }
    const deleteMateria = async (id) => {
        try {
            const response = await instance.delete(`/materia/${id}`);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }
    const deleteProfesor = async (id) => {
        try {
            const response = await instance.delete(`/profesor/${id}`);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }
    const deleteSalon = async (id) => {
        try {
            const response = await instance.delete(`/salon/${id}`);
            const data = await response.data();
            return data;
        } catch (error) {
            return error;
        }
    }

    useEffect(() => {
        getGrupos();
        getMaterias();
        getProfesores();
        getSalones();
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                grupos,
                materias,
                profesores,
                salones,
                getGrupos,
                getMaterias,
                getProfesores,
                getSalones,
                getGrupoById,
                getMateriaById,
                getProfesorById,
                getSalonById,
                getMateriaBySemestre,
                getMateriaByNombre,
                getGrupobyGrupo,
                getProfesoresByMateria,
                getProfesorByNombre,
                getSalonbyNombre,
                putGrupo,
                putMateria,
                putProfesor,
                putSalon,
                postGrupo,
                postMateria,
                postProfesor,
                postSalon,
                deleteGrupo,
                deleteMateria,
                deleteProfesor,
                deleteSalon
            }}>
            {children}
        </GlobalContext.Provider>
    )
}