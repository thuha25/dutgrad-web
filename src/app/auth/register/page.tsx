'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { APP_ROUTES } from '@/lib/constants';
import { registerSchema } from '@/schemas/auth';
import { useState } from 'react';
import { toast } from 'sonner';
import { Toaster } from "sonner";
import { registerUser } from './action';

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema), 
  });

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);

      const result = await registerUser(formData);

      if (result.error) {
        if (result.error.includes('409')) {
          setError('Account already exists. Please use another email.');
        } else {
          setError(result.error);
        }
        setIsLoading(false);
        return;
      }

      if (result.data) {
        toast.success('Registration successful! Redirected to login page...');
        setTimeout(() => {
          router.push(APP_ROUTES.LOGIN);
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Toaster position="top-right" richColors style={{ zIndex: 9999 }} />
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">DUT Grad</h1>
          </div>
          <CardTitle className="text-2xl font-bold">
            Create your account
          </CardTitle>
          <CardDescription>Sign up to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">User Name</Label>
              <Input
                id="username"
                {...register('username')}
                placeholder="John"
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...register('email')}
                type="email"
                placeholder="name@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                {...register('password')}
                type="password"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                {...register('confirmPassword')}
                type="password"
                disabled={isLoading}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign up with Email'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href={APP_ROUTES.LOGIN}
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
