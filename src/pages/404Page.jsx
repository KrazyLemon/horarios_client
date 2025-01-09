import { Icon } from "@iconify/react";

export default function Page404() {
    return (
        <div className="flex flex-col items-center justify-center h-screen w-full">
            <img src="/not-found-gif.gif" alt="404" />
            <h1 className="text-4xl font-extrabold py-5">Error 404</h1>
            <p className=" text-2xl ">La pagina a la que esta intentando acceder no existe.  
                <a href="/" className="bg-blue-500 rounded-md text-white p-2 text-2xl flex justify-center w-1/2 items-center mt-2 mx-auto">
                    Regresar al inicio
                    <Icon icon="fluent:home-20-regular" width="30px" height="30px" />
                </a>
            </p>
            
        </div>
    );
}