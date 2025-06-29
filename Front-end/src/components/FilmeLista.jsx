import React from 'react';

export default function FilmeLista({ filmes }) {
  return (
    <div className="filme-lista">
 
      <h2>Filmes Cadastrados</h2>
      <ul>
        {filmes.map(filme => (
          <li key={filme._id}>
            {filme.titulo} - {filme.genero} ({filme.ano})
          </li>
        ))}
      </ul>
    </div>
  );
}
