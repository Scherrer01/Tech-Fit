// contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

// Criar contexto
const AuthContext = createContext({});

// Hook personalizado para usar o contexto
export const useAuth = () => useContext(AuthContext);

// Provider do contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Verificar token no localStorage ao carregar
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          // Aqui você pode verificar se o token é válido
          // Fazendo uma chamada à API
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Erro ao verificar token:', error);
          logout();
        }
      }
      
      setLoading(false);
    };

    verifyToken();
  }, []);

  // Função de login
  const login = async (email, senha) => {
    setLoading(true);
    try {
      // Chamada à API de login
      const response = await fetch('http://localhost:8000/loginAPI.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Salvar token e dados do usuário
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.usuario));
        
        setToken(data.token);
        setUser(data.usuario);
        
        return { success: true, user: data.usuario };
      } else {
        return { 
          success: false, 
          message: data.message || 'Erro ao fazer login' 
        };
      }
    } catch (error) {
      console.error('Erro de login:', error);
      return { 
        success: false, 
        message: 'Erro de conexão com o servidor' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    // Redirecionar para login se necessário
    window.location.href = '/login';
  };

  // Atualizar dados do usuário
  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
    
    // Se precisar atualizar no backend também:
    // fetch('/api/usuario', { 
    //   method: 'PUT', 
    //   headers: { Authorization: `Bearer ${token}` },
    //   body: JSON.stringify(updatedData)
    // });
  };

  // Verificar se está autenticado
  const isAuthenticated = !!token;

  // Verificar permissões (role-based)
  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role || user.tipo === role;
  };

  // Verificar se é admin
  const isAdmin = () => {
    return hasRole('ADMIN') || hasRole('GERENTE') || hasRole('ADMINISTRADOR');
  };

  // Verificar se é instrutor
  const isInstructor = () => {
    return hasRole('INSTRUTOR') || hasRole('PERSONAL');
  };

  // Valores disponíveis no contexto
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
    hasRole,
    isAdmin,
    isInstructor,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;