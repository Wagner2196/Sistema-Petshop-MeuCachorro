import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './paginas/Home/Home';
import { Login } from './paginas/Login/Login';
import { Usuarios } from './paginas/Usuarios/Usuarios';
import { NovoUsuario } from './paginas/NovoUsuario/NovoUsuario';
import { EditarUsuario } from './paginas/EditarUsuario/EditarUsuario';
import { Animais } from './paginas/Animais/Animais/Animais';
import { NovoAnimal } from './paginas/Animais/NovoAnimal/NovoAnimal';
import { EditarAnimal } from './paginas/Animais/EditarAnimal/EditarAnimal';
import { BanhoEtosa } from './paginas/BanhoTosa/BanhoTosa/BanhoTosa';
import { Veterinario } from './paginas/Veterinario/Veterinario/Veterinario';
import { NovaConsulta } from './paginas/Consulta/NovaConsulta/NovaConsulta';
import { EditarConsulta } from './paginas/Consulta/EditarConsulta/EditarConsulta';
import { AnimaisPerdidos } from './paginas/AnimaisPerdidos/AnimaisPerdidos';
import { Relatorios } from './paginas/Relatorios/Relatorios'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/usuarios' element={<Usuarios />} />
        <Route path="/usuario/novo" element={<NovoUsuario />} />
        <Route path="/usuario/editar/:id" element={<EditarUsuario />} />
        <Route path='/animais' element={<Animais />} />
        <Route path='/animais/novo' element={<NovoAnimal />} />
        <Route path="/animais/editar/:animalId" element={<EditarAnimal />} />
        <Route path='/banhoetosa' element={<BanhoEtosa />} />
        <Route path='/veterinario' element={<Veterinario />} />
        <Route path='/consultas/novo' element={<NovaConsulta />} />
        <Route path="/consultas/editar/:id" element={<EditarConsulta />} />
        <Route path='/animaisperdidos' element={<AnimaisPerdidos />} />

        {/* NOVA ROTA DE RELATÓRIOS */}
        <Route path='/relatorios' element={<Relatorios />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
