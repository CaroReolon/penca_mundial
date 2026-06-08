import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { register, handleSubmit } = useForm<LoginData>();

  const onSubmit = async (data: LoginData) => {
    try {
      setLoading(true);
      setError('');

      const response = await api.post('/login', {
        user: { email: data.email, password: data.password },
      });

      const token = response.headers.authorization;
      if (token) {
        await login(token);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      setError(t('login.error'));
    } finally {
      setLoading(false);
    }
  };

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

        {/* Logo / branding */}
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
          {/* Green accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600" />

          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {t('login.title')}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm font-medium">
                  Email
                </Label>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  className="h-11 border-gray-200 focus-visible:ring-green-500"
                  {...register('email', { required: true })}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm font-medium">
                  {t('login.password')}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="h-11 border-gray-200 focus-visible:ring-green-500 pr-10"
                    {...register('password', { required: true })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-2 rounded-lg bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    {t('login.loading')}
                  </span>
                ) : (
                  t('login.submit')
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
