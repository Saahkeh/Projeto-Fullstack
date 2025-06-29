
import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import Cadastro from './Cadastro';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarCadastro, setMostrarCadastro] = useState(false);

  if (mostrarCadastro) {
    return <Cadastro onVoltarLogin={() => setMostrarCadastro(false)} />;
  }

  return (
    <div  className="login-container">

      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="Senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} />
      <button onClick={() => login(email, senha)}>Entrar</button>
      <p>
        Não tem conta? <button onClick={() => setMostrarCadastro(true)}>Cadastrar</button>
      </p>
    </div>
  );
}
