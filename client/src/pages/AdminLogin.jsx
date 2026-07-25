import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/estudiantes');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(usuario, password);
      navigate('/admin/estudiantes');
    } catch (err) {
      setError(err.response?.data?.error || 'Credenciales inválidas. Verifica tu usuario y contraseña.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div class="bg-carbon border border-white/10 p-8 sm:p-10 rounded-sm shadow-2xl w-full max-w-md space-y-6">
        
        <div class="text-center space-y-2">
          <div class="w-20 h-20 rounded-full border-2 border-dorado-campeon p-1 bg-carbon flex items-center justify-center mx-auto shadow-xl">
            <img src="/logo.png" alt="Najera's Team Emblem" class="w-full h-full object-contain rounded-full" />
          </div>
          <h2 class="text-2xl font-bold text-white font-display tracking-widest uppercase">
            NAJERA'S TEAM - ADMIN
          </h2>
          <p class="text-xs text-gray-400 font-body">
            Panel de gestión técnica para Taekwondo y Kickboxing Formativo Especializado.
          </p>
        </div>

        {error && (
          <div class="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl flex items-center gap-2 text-xs text-rose-400">
            <AlertCircle size={16} class="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-300 uppercase mb-1">Usuario</label>
            <div class="relative">
              <User class="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder=""
                class="w-full bg-black/40 border border-white/10 rounded-sm pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-dorado-campeon"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-300 uppercase mb-1">Contraseña</label>
            <div class="relative">
              <Lock class="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                class="w-full bg-black/40 border border-white/10 rounded-sm pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-dorado-campeon"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            class="w-full py-3 bg-rojo-impacto hover:bg-white hover:text-rojo-impacto text-white text-xs font-bold tracking-wider font-display uppercase clip-button transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 impact-flash"
          >
            {submitting ? 'Verificando...' : 'INICIAR SESIÓN'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;
