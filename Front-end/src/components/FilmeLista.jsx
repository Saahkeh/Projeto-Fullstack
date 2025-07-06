import React from 'react';

export default function FilmeLista({ filmes, aoRemover }) {
  console.log("Filmes recebidos do backend:", filmes);

  return (
    <div className="filme-lista">
      <h2>Filmes Cadastrados</h2>
      <ul>
        {filmes.map(filme => (
          <li key={filme._id}>
            {filme.titulo} - {filme.genero} - {filme.ano}
            <button onClick={() => aoRemover(filme._id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

