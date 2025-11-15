import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Login from './pages/Login.jsx';
import './index.css';
import Alunos from './pages/Alunos.jsx';
import Index from './pages/index.jsx';
import Agendas from './pages/Agendas.jsx'
import Colaboradores from './pages/Colaboradores.jsx'

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'; 
import Financeiro from './pages/Financeiro.jsx';
import Configuracoes from './pages/Configuracoes.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/index',
    element: <Index />,
  },
  {
    path:'/Alunos',
    element:<Alunos />
  },
  {
    path:'/Agendas',
    element:<Agendas/>
  },
  {
    path:'/Colaboradores',
    element: <Colaboradores/>
  },
  {
    path: '/Financeiro',
    element: <Financeiro/>
  },
  {
    path: '/Configuracoes',
    element: <Configuracoes/>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);