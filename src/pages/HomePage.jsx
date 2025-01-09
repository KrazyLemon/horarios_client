import { Icon } from '@iconify/react';

export default function HomePage() {
    return (
        <div className='flex flex-col w-full  h-screen overflow-y-auto mx-auto'>
            <div className='flex'>
                <div className='items-center h-fit mt-2 mx-2 bg-white rounded-md shadow-md p-4'>
                    <h1 className='text-xl flex gap-2'>Bienvenido <Icon icon="fluent:emoji-20-regular" width="30px" height="30px" className='rounded-full bg-yellow-400 p-1 text-white ' /></h1>
                    <p className='text-sm'> Esta plataforma esta diseñada para generar horarios de la Ingeniera en Sistemas Computacionales de forma automatica </p>
                    <p className='flex text-sm font-semibold underline-offset-1 underline decoration-yellow-400 decoration-2'>Para comenzar, selecciona alguno de los grupos disponibles</p>
                </div>
                <div className='items-center mt-2 mx-2 bg-white rounded-md shadow-md p-4'>
                    <h1 className='text-xl flex gap-2'>Necesitas ayuda <Icon icon="fluent:chat-help-20-regular" width="30px" height="30px" className='rounded-full bg-red-400 p-1 text-white ' /> </h1>
                    <p className='text-sm'> Da click <a href='/ ' className='text-purple-600 underline text-sm'>aqui</a> para ver el manual de introduccion al sistema</p>
                </div>
                <div className='items-center mt-2 mx-2 bg-white rounded-md shadow-md p-4'>
                    <h1 className='text-xl flex gap-2'>Contacto <Icon icon="fluent:mail-20-regular" width="30px" height="30px" className='rounded-full bg-green-400 p-1 text-white ' /> </h1>
                    <p className='text-sm'>Si tienes alguna duda o sugerencia, envíanos un correo a <a href='mailto:contacto@ejemplo.com' className='text-purple-600 underline'>203107172@cuautitlan.tecnm.mx</a></p>
                </div>
            </div>
        </div>
    );
}