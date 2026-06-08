import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { acceptInvitation } from '@/services/playGroupService';

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterData>();

  const onSubmit = async (data: RegisterData) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/register', {
        user: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
        },
      });

      const token = response.headers.authorization;
      if (token) {
        await login(token);

        // Accept pending group invite if present
        const pendingToken = sessionStorage.getItem('pendingInviteToken');
        if (pendingToken) {
          sessionStorage.removeItem('pendingInviteToken');
          try {
            await acceptInvitation(pendingToken);
          } catch {
            // ignore — user can still join from the invite link again
          }
        }

        navigate('/dashboard');
      }
    } catch (err: any) {
      const messages = err?.response?.data?.errors?.full_messages;
      setError(
        Array.isArray(messages) ? messages.join(', ') : (language === 'es' ? 'Error al crear la cuenta.' : 'Error creating account.')
      );
    } finally {
      setLoading(false);
    }
  };

  const isEs = language === 'es';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Language toggle */}
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
            className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            {language === 'es' ? '🇺🇸 English' : '🇺🇾 Español'}
          </button>
        </div>

        {/* Branding */}
        <div className="flex flex-col items-center mb-8 select-none">
          <div className="text-6xl mb-4 drop-shadow-lg">🏆</div>
          <h1 className="text-4xl font-black text-white tracking-tight drop-shadow">
            Penca Mundial
          </h1>
          <p className="text-green-200 text-sm mt-1 font-medium tracking-widest uppercase">
            FIFA World Cup 2026
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600" />

          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {isEs ? 'Crear cuenta' : 'Create account'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Name row */}
              <div className="flex gap-3">
                <div className="flex-1 space-y-1.5">
                  <Label className="text-gray-700 text-sm font-medium">
                    {isEs ? 'Nombre' : 'First name'}
                  </Label>
                  <Input
                    placeholder={isEs ? 'Juan' : 'John'}
                    className="h-11 border-gray-200 focus-visible:ring-green-500"
                    {...register('first_name', { required: true })}
                  />
                  {errors.first_name && (
                    <p className="text-xs text-red-500">{isEs ? 'Requerido' : 'Required'}</p>
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label className="text-gray-700 text-sm font-medium">
                    {isEs ? 'Apellido' : 'Last name'}
                  </Label>
                  <Input
                    placeholder={isEs ? 'García' : 'Doe'}
                    className="h-11 border-gray-200 focus-visible:ring-green-500"
                    {...register('last_name', { required: true })}
                  />
                  {errors.last_name && (
                    <p className="text-xs text-red-500">{isEs ? 'Requerido' : 'Required'}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm font-medium">Email</Label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  className="h-11 border-gray-200 focus-visible:ring-green-500"
                  {...register('email', { required: true })}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm font-medium">
                  {isEs ? 'Contraseña' : 'Password'}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="h-11 border-gray-200 focus-visible:ring-green-500 pr-10"
                    {...register('password', { required: true, minLength: 6 })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password?.type === 'minLength' && (
                  <p className="text-xs text-red-500">{isEs ? 'Mínimo 6 caracteres' : 'At least 6 characters'}</p>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm font-medium">
                  {isEs ? 'Confirmar contraseña' : 'Confirm password'}
                </Label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-11 border-gray-200 focus-visible:ring-green-500"
                  {...register('password_confirmation', {
                    required: true,
                    validate: v => v === watch('password') || (isEs ? 'Las contraseñas no coinciden' : 'Passwords do not match'),
                  })}
                />
                {errors.password_confirmation && (
                  <p className="text-xs text-red-500">{errors.password_confirmation.message || (isEs ? 'Requerido' : 'Required')}</p>
                )}
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-1 rounded-lg bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {isEs ? 'Creando cuenta...' : 'Creating account...'}
                  </span>
                ) : (
                  isEs ? 'Crear cuenta' : 'Create account'
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="mt-5 text-center text-sm text-gray-400">
              {isEs ? '¿Ya tenés cuenta?' : 'Already have an account?'}{' '}
              <Link to="/login" className="text-green-600 font-medium hover:underline">
                {isEs ? 'Iniciá sesión' : 'Sign in'}
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
