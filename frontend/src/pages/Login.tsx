import { useState } from 'react';
import { Eye, EyeOff, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

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

  const { register, handleSubmit } = useForm<LoginData>();

  const onSubmit = async (data: LoginData) => {
    try {
      setLoading(true);
      setError('');

      const response = await api.post('/login', {
        user: {
          email: data.email,
          password: data.password,
        },
      });

      const token = response.headers.authorization;

      if (token) {
        await login(token);

        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);

      setError('Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-700 to-green-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="flex flex-col items-center mb-8">
            <Trophy className="h-12 w-12 mb-4" />

            <h1 className="text-3xl font-bold">Penca Mundial</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Email</Label>

              <Input
                type="email"
                {...register('email', {
                  required: true,
                })}
              />
            </div>

            <div>
              <Label>Contraseña</Label>

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: true,
                  })}
                />

                <button
                  type="button"
                  className="absolute right-3 top-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button className="w-full" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
