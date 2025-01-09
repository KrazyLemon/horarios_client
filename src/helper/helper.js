
export function transponerMatriz(matriz) {
    return matriz[0].map((_, colIndex) => matriz.map(row => row[colIndex]));
}

export function revertirMatriz(matriz) {
    return matriz[0].map((_, colIndex) => matriz.map(row => row[colIndex]))
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

export const genId = (ids) => {
    let newId;
    do {
        newId = Math.floor(Math.random() * 100000);
    } while (ids.includes(newId));
    return newId;
}
export const updateAsignaciones = (asignaciones, id, objeto, materia) => {
    //const ids = asignaciones.map(asignacion => asignacion.id);
    const newAsignacion = {
        id: id,
        objeto: objeto,
        materia: materia
    }
    return [...asignaciones, newAsignacion]
}
export const deleteAsignacion = (asignaciones, id) => {
    if (asignaciones === null) return;
    return asignaciones.filter(asignacion => asignacion.objeto !== id);
}
export const filterLista = (asignaciones) => {
    const filtrados = asignaciones.filter(item => item !== undefined && item !== null);
    const sinDuplicados = filtrados.filter((item, index, self) => index === self.findIndex(i => i.id === item.id));
    return sinDuplicados;
}
export function deleteGrupoDeHorario (profe,id) {
    let horas = 0;
    const newHorario = profe.horario.map((dia,index) => {
        dia.map((hora,hIndex) =>{
            if(profe.horario[index][hIndex] === id){
                profe.horario[index][hIndex] = "";
                horas = horas + 1;
            }
        })
    });    
    const newAsignaciones = deleteAsignacion(profe.asignaciones,id);
    profe.horas = profe.horas - horas;
    profe.asignaciones = newAsignaciones;
    profe.horario = newHorario;
    return profe;
}
export function ordenarPorSemestre(lista) {
    return lista.sort((a, b) => {
        // Convierte el semestre a número para una comparación precisa
        const semestreA = parseInt(a.semestre, 10);
        const semestreB = parseInt(b.semestre, 10);
        // Ordena de menor a mayor
        return semestreA - semestreB;
    });
}

function ordenarPorHorario(asignaciones) {
    return asignaciones.sort((a, b) => {
        for (let i = 0; i < a.profesor.horario.length; i++) {
            const horarioA = a.profesor.horario[i];
            const horarioB = b.profesor.horario[i];

            const horasLibresA = horarioA.filter(hora => hora === "").length;
            const horasLibresB = horarioB.filter(hora => hora === "").length;

            if (horasLibresA !== horasLibresB) {
                return horasLibresB - horasLibresA;
            }
        }
        return 0; // Si todos los días tienen la misma cantidad de horas libres
    });
}


const addProfe = (profe, profesList) => {
    return [...profesList, profe]
}
export const genHorarios = (horario, grupo, asignaciones) => {
    let existe = true;
    const dia = Array(8);
    let profesList = [];
    let nuevoGrupo = grupo;
    
    const listaOrdenada = ordenarPorHorario(asignaciones);

    for (const item of listaOrdenada) {
        const profe = item.profesor;
        const hp = item.profesor.horario;
        let horas = parseInt(item.materia.horas);
        const id = genId(profe.asignaciones.map(asignacion => asignacion.id));
        let hd = 1; // Indicador de horas asignadas en un dia
        for (let i = 0; i < 5; i++) {
            hd = 1;
            for (let j = 0; j < 8; j++) {
                if (horas > 0) {
                    if (hd < 3) {
                        if (i > 0) {
                            for (let k = 0; k < 8; k++) {
                                if (dia[k] != "" && dia[k] == id) {
                                    existe = false;
                                }
                            }
                        }
                        if (existe) {
                            if (hp[i][j] == "" && horario[i][j] == "") {
                                horario[i][j] = id;
                                hp[i][j] = id;
                                horas = horas - 1;
                                hd = hd + 1;
                            }
                        } else {
                            if (i == 4) {
                                if ((hp[i][j] == "") && (horario[i][j] == "")) {
                                    horario[i][j] = id;
                                    hp[i][j] = id;
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
        profe.horas = profe.horas + item.materia.horas;
        profe.asignaciones = updateAsignaciones(profe.asignaciones, id, grupo.id, item.materia.id);
        nuevoGrupo.asignaciones = updateAsignaciones(nuevoGrupo.asignaciones, id, profe.id, item.materia.id);
        profesList = addProfe(profe, profesList);
    }
    nuevoGrupo.horario = transponerMatriz(horario);
    return (
        {
            grupoActualizado: nuevoGrupo,
            profesActualizados: profesList
        }
    );
}
