import { Icon } from "@iconify/react/dist/iconify.js";
import Modal from "react-modal";
import { toast } from "react-toastify";

export default function NewProfeModal({ isOpen, handleCloseModal, onRequestClose,url }) {

    const handleSubmit = ()=>{
        const nombre = document.getElementById("post_nombre").value;
        const apellido = document.getElementById("post_apellido").value;
        const antiguedad = document.getElementById("post_antiguedad").value;
        const bandera = document.getElementById("post_bandera").value;
        const entrada = document.getElementById("post_entrada").value;
        const salida = document.getElementById("post_salida").value;

        const profe = {
            nombre,
            apellido,
            antiguedad,
            bandera,
            entrada,
            salida,
            materias: Array(1).fill(""),
            horario: Array(5).fill(Array(8).fill('')),
            asignaciones:Array(1).fill({
                id:"",
                materia:"",
                objeto:""
            }),
            horas : 0
        }
        //console.log(profe);
        if(!profe.nombre && !profe.apellido && !profe.antiguedad && !profe.bandera && !profe.entrada && !profe.salida){
            toast.error("Todos los campos son requeridos");
            return;
        }
        const confirm = window.confirm("¿Estás seguro de agregar al profesor?");
        if(!confirm){
            return
        }

        try{
            fetch(url,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(profe)
            }).then(res=>res.json()).then(data=>{
                if(data.status === 200){
                    toast.success("Profesor agregado correctamente");
                }else{
                    toast.error(data.message);
                }
            });
        }catch(err){
            toast.error("Ocurrió un error al agregar al profesor");
        }
        handleCloseModal();
    }
    
    return (
        < Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="New Profe Modal"
            overlayClassName="modal-overlay"
            className="w-3/6 h-fit mt-6 mx-auto bg-white rounded-md p-3"
        >
            <h1 className="text-2xl font-semibold flex h-fit items-center gap-2">
                <Icon icon="fluent:person-add-20-regular" width="40" height="40" className="bg-yellow-500 text-white rounded-full p-1" />
                Nuevo profesor
            </h1>
            <div className="flex flex-col gap-4 mt-2 border rounded-md p-2 bg-gray-100">
                <div className="flex gap-2">
                    <div className="flex flex-col w-full">
                        <label htmlFor="post_nombre" className="font-semibold">Nombre(s)</label>
                        <input type="text" name="post_nombre" id="post_nombre" className="border rounded-md p-2" />
                    </div>
                    <div className="flex flex-col w-full">
                        <label htmlFor="post_apelido" className="font-semibold">Apellido(s)</label>
                        <input type="text" name="post_apellido" id="post_apellido" className="border rounded-md p-2" />
                    </div>
                </div>
                <div className="flex w-full justify-between gap-2">
                    <div className="flex justify-between gap-2 w-full">
                        <div className="flex flex-col w-full">
                            <label htmlFor="post_antiguedad" className="font-semibold">Antigüedad</label>
                            <input type="text" name="post_antiguedad" id="post_antiguedad" placeholder="AAAA/MM/DD" pattern="\d{4}/\d{2}/\d{2}"
                                title="El formato debe ser AAAA/MM/" className="border rounded-md p-2" />
                        </div>
                        <div className="flex w-full flex-col">
                            <label htmlFor="post_bandera" className="font-semibold" >Bandera</label>
                            <select name="post_bandera" id="post_bandera" className="border rounded-md p-2" >
                                <option value="PTC">PTC</option>
                                <option value="definitividad">Definitividad</option>
                                <option value="materias">materias</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full">
                        <div className="flex w-full flex-col">
                            <label htmlFor="post_entrada" className="font-semibold" >Entrada</label>
                            <input type="time" name="post_entrada" id="post_entrada"
                                className="border rounded-md p-2" />
                        </div>
                        <div className="flex w-full flex-col">
                            <label htmlFor="post_salida" className="font-semibold" >Salida</label>
                            <input type="time" name="post_salida" id="post_salida"
                                className="border rounded-md p-2" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <button className="bg-green-500 text-white font-semibold p-2 rounded-md" onClick={handleSubmit}>Guardar</button>
                <button className="bg-red-500 text-white font-semibold p-2 rounded-md" onClick={handleCloseModal}>Cancelar</button>
            </div>
        </Modal>
    );
}