import { useState } from "react";

export function transponerMatriz(matriz) {
    return matriz[0].map((_, colIndex) => matriz.map(row => row[colIndex]));
}

export function revertirMatriz(matriz){
    return matriz[0].map((_,colIndex) => matriz.map(row => row[colIndex]))
} 

export const checkhorario = (horario) => {
    if (!Array.isArray(horario) || horario.length === 0) {
        return "Horario Vacio";
    } else {
        const isEmpty = horario.every(day =>
            Array.isArray(day) && day.every(slot =>
                Object.values(slot).every(value => value === "")
            )
        );
        return isEmpty ? "Horario Vacio" : "Horario Asignado";
    }
}

export const checkSalon = (salon) => { return salon === "" ? "No tiene salon" : salon; }

export const setChipColor = (text) => { return text === "Horario Vacio" ? "border-red-500 text-red-500" : "border-green-500 text-green-500"; }

export const setChipColor2 = (text) => { return text === "No tiene salon" ? "border-red-500 text-red-500" : "border-green-500 text-green-500"; }

const genId = (ids) =>{
    let newId;
    do{
        newId = Math.floor(Math.random() * 1000);
    }while(ids.includes(newId));
    return newId;
}
const updateAsignaciones = (asignaciones, objeto, materia) => {
    const ids = asignaciones.map(asignacion => asignacion.id);
    const newAsignacion = {
        id : genId(ids),
        objeto : objeto,
        materia : materia
    }
    return[...asignaciones,newAsignacion]
}
const addProfe = (profe, profesList) =>{
    return[...profesList, profe]
}

export const genHorarios = (horario, grupo, asignaciones ) => {
    console.log(grupo)
    let existe = true;
    const dia = Array(8);
    let profesList = [];

    for (const item of asignaciones){
        const profe = item.profesor;
        const materia = String(item.materia.nombre);
        const hp = item.profesor.horario;
        let horas = parseInt(item.materia.horas);
        
        let hd = 1; // Indicador de horas asignadas en un dia
        for (let i = 0; i < 5; i++) {
            hd = 1;
            for (let j = 0; j < 8; j++) {
                if (horas > 0) {
                    if (hd < 3) {
                        if (i > 0) {
                            for (let k = 0; k < 8; k++) {
                                if (dia[k] != "" && dia[k] == materia) {
                                    existe = false;
                                }
                            }
                        }
                        if (existe) {
                            if (hp[i][j] == "" && horario[i][j] == "") {
                                horario[i][j] = String(materia);
                                hp[i][j] = grupo.grupo;
                                horas = horas - 1;
                                hd = hd + 1;
                            }
                        } else {
                            if (i == 4) {
                                if ((hp[i][j] == "") && ( horario[i][j] == "")) {
                                    horario[i][j] = String(materia);
                                    hp[i][j] = grupo.grupo;
                                    horas = horas - 1;
                                    hd = hd + 1;
                                }
                            }
                            existe = true;
                        }
                    }
                }
            }
            for (let k = 0; k < 8; k++) {
                dia[k] = horario[i][k];
            }
        }
        profe.horario = hp;
        profe.asignaciones = updateAsignaciones(profe.asignaciones,grupo.grupo,materia);
        profesList = addProfe(profe,profesList);
        //generarAsignacion(item, grupoIndex, profeIndex);
    }
    
    return(
        {   
            horarioGenerado: transponerMatriz(horario),
            profesActualizados: profesList
        }
    );
}
