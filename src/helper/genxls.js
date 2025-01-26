import * as xlsx from "xlsx";
import { revertirMatriz } from "./helper";

const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes"];

export const transformData = (data) =>
    data
        .filter((item) => item.grupo) // Filtramos los elementos que tienen 'grupo'
        .map((item) => {
            const diasObj = item.dias.reduce((acc, dia, index) => {
                acc[diasSemana[index]] = dia; // Asignamos el día correspondiente
                return acc;
            }, {});

            return {
                Grupo: item.grupo,
                Materia: item.materia,
                Clave: item.clave,
                ...diasObj, // Expandimos los días en el objeto
                Salon: item.salon,
                Horas: Number(item.horas) // Convertimos 'horas' a número si es necesario
            };
        });

export const transformDataWithProfesor = (data) =>
    data.map((item) => {
        const diasObj = item.dias.reduce((acc, dia, index) => {
            acc[diasSemana[index]] = dia; // Asignamos el día correspondiente
            return acc;
        }, {});

        return {
            Profesor: item.profesor || "Sin asignar",
            Materia: item.materia || "Sin asignar",
            Clave: item.clave || "N/A",
            ...diasObj, // Expandimos los días en el objeto
            Salon: item.salon || "Sin asignar",
            Horas: Number(item.horas) || 0 // Convertimos 'horas' a número si es necesario
        };
    });

export const genXls = (data, filename, sheetname) => {
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, sheetname);
    xlsx.writeFile(wb, filename);
    console.log('Archivo generado:', filename);
}


export const genRow = (grupo, profesList, materiasList) => {
    let hInicio = 7;
    const horo = revertirMatriz(grupo.horario);
    if (grupo.asignaciones.length == 0) return;
    if (grupo.turno == "V") {
        hInicio = 14;
    }
    const row = grupo.asignaciones.map((_, index) => {
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
            profesor: profesList[index].nombre + " " + profesList[index].apellido,
            materia: materiasList[index].nombre,
            clave: materiasList[index].clave,
            dias: dias,
            salon: grupo.salon,
            horas: materiasList[index].horas
        }
    })
    return row;
}