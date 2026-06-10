import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/services/api';
import { useLanguage } from '@/contexts/LanguageContext';

interface FormData {
  email: string;
}

export default function ForgotPassword() {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError('');
      await api.post('/api/password/forgot', { email: data.email });
      setToken('sent'); // flag to show success state
    } catch {
      setError(t('forgot.error'));
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  void copied; // suppress unused warning

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
            <h2 className="text-xl font-bold text-gray-900 mb-1">{t('forgot.title')}</h2>
            <p className="text-sm text-gray-400 mb-6">{t('forgot.subtitle')}</p>

            {!token ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm font-medium">Email</Label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="h-11 border-gray-200 focus-visible:ring-green-500 placeholder:text-gray-300"
                    {...register('email', { required: true })}
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-lg bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? t('forgot.loading') : t('forgot.submit')}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-center">
                  <div className="text-3xl mb-2">📬</div>
                  <p className="text-sm font-semibold text-green-800 mb-1">{t('forgot.emailSent')}</p>
                  <p className="text-xs text-green-700">{t('forgot.emailHint')}</p>
                </div>

                <button
                  onClick={() => navigate('/reset-password')}
                  className="w-full h-11 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-colors shadow-sm"
                >
                  {t('forgot.goToReset')}
                </button>
              </div>
            )}
          </div>

          <p className="pb-6 text-center text-sm text-gray-400">
            <Link to="/login" className="text-green-600 font-medium hover:underline">
              {t('forgot.backToLogin')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
