import React, { useContext, useEffect, useState } from 'react';
import Login from './components/Login';
import FilmeForm from './components/FilmeForm';
import FilmeLista from './components/FilmeLista';
import { AuthContext } from './contexts/AuthContext';
import './css/style.css';


export default function App() {
  const { state } = useContext(AuthContext);
  const [filmes, setFilmes] = useState([]);

  useEffect(() => {
    if (state.token) {
      // Buscar filmes do backend ao logar
      fetch('http://localhost:5000/api/filmes', {
        headers: { Authorization: `Bearer ${state.token}` }
      })
        .then(res => res.json())
        .then(data => setFilmes(data))
        .catch(() => alert('Erro ao buscar filmes'));
    }
  }, [state.token]);

  const aoCadastrar = (novoFilme) => {
    setFilmes((anteriores) => [...anteriores, novoFilme]);
  };

  return (
    <div>
      <h1>Catálogo de Filmes</h1>
      {!state.token ? (
        <Login />
      ) : (
        <>
          <FilmeForm aoCadastrar={aoCadastrar} />
          <FilmeLista filmes={filmes} />
        </>
      )}
    </div>
  );
}

