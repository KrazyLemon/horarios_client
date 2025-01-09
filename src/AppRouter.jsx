import React from 'react';
import { Routes, Route } from 'react-router';
import NavBar from './components/NavBar';
import ProfesPage from './pages/ProfesPage';
import GruposPage from './pages/GruposPage';
import HomePage from './pages/HomePage';
import MateriasPage from './pages/MateriasPage';
import GrupoDetailPage from './pages/GrupoDetailPage';
import ProfeDetailPage from './pages/ProfeDetailPage';
import AboutPage from './pages/AboutPage';
import Page404 from './pages/404Page';


export default function AppRouter() {
    return (
        <>
            <Routes>
                <Route path="/" element={<NavBar />} >
                    <Route path="/" element={<HomePage />} />
                    <Route path="/docentes" element={<ProfesPage />} />
                    <Route path="/docentes/detail" element={<ProfeDetailPage />} />
                    <Route path="/grupos" element={<GruposPage />} />
                    <Route path="/grupos/detail" element={<GrupoDetailPage />} />
                    <Route path="/materias" element={<MateriasPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="*" element={<Page404 />} />
                </Route>
            </Routes>
        </>
    );
}