import React, { createContext, useReducer } from 'react';

export const AuthContext = createContext();

const initialState = {
  token: null
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, token: action.payload };
    case 'LOGOUT':
      return { ...state, token: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, senha) => {
    const res = await fetch('https://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();
    if (res.ok) {
      dispatch({ type: 'LOGIN', payload: data.token });
    } else {
      alert(data.erro);
    }
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login }}>
      {children}
    </AuthContext.Provider>
  );
}
