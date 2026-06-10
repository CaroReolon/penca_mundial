import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/services/api';
import { useLanguage } from '@/contexts/LanguageContext';

interface FormData {
  token: string;
  password: string;
  confirm: string;
}

export default function ResetPassword() {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Token from URL query param (?token=...) takes priority, then router state
  const urlToken = new URLSearchParams(location.search).get('token') ?? '';
  const prefillToken = urlToken || (location.state as any)?.token || '';
  const tokenFromUrl = Boolean(urlToken);

  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: { token: prefillToken },
  });

  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);

  const password = watch('password');

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirm) {
      setError(t('reset.mismatch'));
      return;
    }

    try {
      setLoading(true);
      setError('');
      await api.post('/api/password/reset', {
        token:    data.token,
        password: data.password,
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch {
      setError(t('reset.error'));
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

        {/* Logo */}
        <div className="flex flex-col items-center mb-8 select-none">
          <div className="text-6xl mb-4 drop-shadow-lg">🏆</div>
          <h1 className="text-4xl font-black text-white tracking-tight drop-shadow">
            Penca Mundial
          </h1>
          <p className="text-green-200 text-sm mt-1 font-medium tracking-widest uppercase">
            FIFA World Cup 2026
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600" />

          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{t('reset.title')}</h2>
            <p className="text-sm text-gray-400 mb-6">
              {tokenFromUrl ? t('reset.subtitleToken') : t('reset.subtitle')}
            </p>

            {success ? (
              <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-4 text-sm text-green-700 text-center">
                {t('reset.success')}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Token — hidden when already provided via URL */}
                {tokenFromUrl ? (
                  <input type="hidden" {...register('token')} />
                ) : (
                  <div className="space-y-1.5">
                    <Label className="text-gray-700 text-sm font-medium">
                      {t('reset.tokenLabel')}
                    </Label>
                    <Input
                      type="text"
                      placeholder={t('reset.tokenPlaceholder')}
                      className="h-11 border-gray-200 focus-visible:ring-green-500 font-mono text-xs placeholder:text-gray-300"
                      {...register('token', { required: true })}
                    />
                  </div>
                )}

                {/* New password */}
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm font-medium">
                    {t('reset.passwordLabel')}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="h-11 border-gray-200 focus-visible:ring-green-500 pr-10 placeholder:text-gray-300"
                      {...register('password', { required: true, minLength: 6 })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm font-medium">
                    {t('reset.confirmLabel')}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="h-11 border-gray-200 focus-visible:ring-green-500 pr-10 placeholder:text-gray-300"
                      {...register('confirm', {
                        required: true,
                        validate: (v) => v === password || t('reset.mismatch'),
                      })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowConfirm((v) => !v)}
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
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
                  className="w-full h-11 mt-1 rounded-lg bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? t('reset.loading') : t('reset.submit')}
                </button>
              </form>
            )}
          </div>

          <p className="pb-6 text-center text-sm text-gray-400">
            <Link to="/login" className="text-green-600 font-medium hover:underline">
              {t('reset.backToLogin')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
