import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getInvitationPreview, acceptInvitation, type InvitationPreview } from '@/services/playGroupService';

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [preview, setPreview] = useState<InvitationPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) return;
    getInvitationPreview(token)
      .then(setPreview)
      .catch((err) => {
        setError(err?.response?.data?.error ?? 'Invitación no encontrada o expirada.');
      })
      .finally(() => setLoading(false));
  }, [token]);

  const redirectUnauthenticated = (destination: '/login' | '/register') => {
    sessionStorage.setItem('pendingInviteToken', token!);
    navigate(destination);
  };

  const handleAccept = async () => {
    if (!isAuthenticated) {
      redirectUnauthenticated('/login');
      return;
    }

    setAccepting(true);
    try {
      await acceptInvitation(token!);
      setDone(true);
      setTimeout(() => navigate('/dashboard', { state: { openRanking: true } }), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Error al aceptar la invitación.');
    } finally {
      setAccepting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg animate-pulse">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Branding */}
        <div className="text-center mb-8 select-none">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow">Penca Mundial</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600" />

          <div className="p-8 text-center">
            {error ? (
              <>
                <div className="text-4xl mb-4">❌</div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">Invitación inválida</h2>
                <p className="text-sm text-gray-500 mb-6">{error}</p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full h-10 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-colors"
                >
                  Ir al Dashboard
                </button>
              </>
            ) : done ? (
              <>
                <div className="text-4xl mb-4">🎉</div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">¡Te uniste al grupo!</h2>
                <p className="text-sm text-gray-500">Redirigiendo al ranking...</p>
              </>
            ) : preview ? (
              <>
                <div className="text-4xl mb-4">👥</div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  Te invitaron al grupo
                </h2>
                <p className="text-2xl font-black text-green-600 mb-1">
                  {preview.group_name}
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  Invitado por <span className="font-medium text-gray-600">{preview.invited_by}</span>
                </p>

                {isAuthenticated ? (
                  <button
                    onClick={handleAccept}
                    disabled={accepting}
                    className="w-full h-11 rounded-lg bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold text-sm transition-colors disabled:opacity-60"
                  >
                    {accepting ? 'Uniéndose...' : '✓ Unirme al grupo'}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      Para unirte al grupo necesitás una cuenta.
                    </p>
                    <button
                      onClick={() => redirectUnauthenticated('/register')}
                      className="w-full h-11 rounded-lg bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold text-sm transition-colors"
                    >
                      Crear cuenta y unirme
                    </button>
                    <button
                      onClick={() => redirectUnauthenticated('/login')}
                      className="w-full h-11 rounded-lg border border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700 font-semibold text-sm transition-colors"
                    >
                      Ya tengo cuenta — Iniciar sesión
                    </button>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
