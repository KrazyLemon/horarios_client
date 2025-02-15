import { Outlet } from 'react-router';
import { Icon } from "@iconify/react";

const NavBar = () => {
  
  return (
    <>
      <nav className="flex ms-2 me-2 mt-2 rounded-md border justify-between p-2 items-center shadow-md bg-white bg-opacity-50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <a
            className="flex font-semibold items-center gap-2 hover:bg-purple-200 rounded-md p-3 text-3xl"
            href="/about">
            <img src="/logo.svg" height={"44px"} width={"44px"} strokeLinecap="round" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-cyan-500">
              Sistema de control de horarios
            </span>
          </a>
        </div>
        <div className='flex gap-4 items-center space-x-1'>
          <a className="flex  items-center gap-2 hover:bg-rose-200 rounded-md p-3" href="/">
            <Icon icon="fluent:home-20-regular" width="30px" height="30px" strokeLinecap="round" />
            Inicio
          </a>
          <a className="flex items-center gap-2 hover:bg-amber-200 rounded-md p-3" href="/docentes">
            <Icon icon="fluent:person-20-regular" width="30" height="30" />
            Profesores
          </a>
          <a className="flex items-center gap-2 hover:bg-lime-200 rounded-md p-3" href="/materias">
            <Icon icon="fluent:teaching-20-regular" width="30px" height="30px" />
            Materias
          </a>
          <a className="flex items-center gap-2 hover:bg-cyan-200 rounded-md p-3" href="/grupos">
            <Icon icon="fluent:people-20-regular" width="30px" height="30px" />
            Grupos
          </a>
        </div>
      </nav>
      <div className="flex w-full h-screen">
        <Outlet/>
      </div>
    </>
  );
};

export default NavBar;
