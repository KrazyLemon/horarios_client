
export default function SalonesSelect({ salonGrupo,salones,handleSalonSelected,setSalonGrupo }) {


    const handleClick = (event) =>{
        //console.log(event.target.value);
        const selectedSalon = salones.find(salon => salon.salon === event.target.value);
        handleSalonSelected(selectedSalon);
        setSalonGrupo(event.target.value);
    }

    return (
        <div className="flex w-full justify-between">
            <h1 className="font-semibold">Salon:</h1>
            <select value={salonGrupo} onChange={handleClick}  >
                {salones.map((salon) => (
                    <option key={salon.salon} value={salon.salon}>
                        {salon.salon}
                    </option>
                ))}
            </select>
        </div>
    );
}