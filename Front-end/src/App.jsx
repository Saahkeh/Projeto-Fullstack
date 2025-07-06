import React, { useState, useEffect, useContext } from 'react';
import FilmeForm from './components/FilmeForm';
import FilmeLista from './components/FilmeLista';
import { AuthContext } from './contexts/AuthContext';
import Login from './components/Login';
import './css/style.css';

export default function App() {
  const { state, dispatch } = useContext(AuthContext);
  const [filmes, setFilmes] = useState([]);

  useEffect(() => {
    if (state.token) {
      fetch('https://localhost:5000/api/filmes', {
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
  
  const aoRemover = async (id) => {
    try {
      await fetch(`https://localhost:5000/api/filmes/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${state.token}`
        }
      });
      setFilmes(filmes.filter(filme => filme._id !== id));
    } catch (err) {
      alert('Erro ao remover filme');
    }
  };
  const sair = () => {
    dispatch({ type: 'LOGOUT' });
  };
  return (
    <div>
      <h1>Catálogo de Filmes</h1>
      {!state.token ? (
        <Login />
      ) : (
        <>
          <FilmeForm aoCadastrar={aoCadastrar} />
          <FilmeLista filmes={filmes} aoRemover={aoRemover} />
          <button onClick={sair} class= "logout">Sair</button>
        </>
      )}
    </div>
  );
}
