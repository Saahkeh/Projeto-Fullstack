
import React, { useState } from 'react';

export default function Cadastro({ onVoltarLogin }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const cadastrar = async () => {
    if (!nome || !email || !senha) {
      setErro('Todos os campos são obrigatórios');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Cadastro realizado com sucesso!');
        onVoltarLogin(); // volta para tela de login
      } else {
        setErro(data.erro || 'Erro ao cadastrar');
      }
    } catch (err) {
      setErro('Erro ao conectar com o servidor');
    }
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} />
      <button onClick={cadastrar}>Cadastrar</button>
      <p>
        Já tem conta? <button onClick={onVoltarLogin}>Voltar ao Login</button>
      </p>
    </div>
  );
}
