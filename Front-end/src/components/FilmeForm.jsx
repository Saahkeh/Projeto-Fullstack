import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function FilmeForm({ aoCadastrar }) {
  const { state } = useContext(AuthContext);
  const [titulo, setTitulo] = useState('');
  const [genero, setGenero] = useState('');
  const [ano, setAno] = useState('');

  const salvar = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/filmes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.token}`
        },
        body: JSON.stringify({ titulo, genero, ano: Number(ano) })
      });

      const novoFilme = await res.json();

      if (res.ok) {
        setTitulo('');
        setGenero('');
        setAno('');
        if (aoCadastrar) aoCadastrar(novoFilme); // atualiza a lista na tela, se função existir
      } else {
        alert(novoFilme.erro || 'Erro ao cadastrar');
      }
    } catch (err) {
      alert('Erro de conexão com o servidor');
      console.error(err);
    }
  };

  return (
    <div className="filme-form">
      <input placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} />
      <input placeholder="Gênero" value={genero} onChange={e => setGenero(e.target.value)} />
      <input placeholder="Ano" value={ano} type="number" onChange={e => setAno(e.target.value)} />
      <button onClick={salvar}>Salvar</button>
    </div>
  );
}


