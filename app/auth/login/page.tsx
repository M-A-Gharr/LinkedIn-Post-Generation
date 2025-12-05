'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithLinkedIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLinkedInLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithLinkedIn();
    } catch (error) {
      toast.error('Failed to sign in with LinkedIn');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">LinkedIn Post Generator</h1>
          <p className="text-muted-foreground">
            Sign in with your LinkedIn account to get started
          </p>
        </div>

        <Button
          onClick={handleLinkedInLogin}
          disabled={isLoading}
          size="lg"
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.732-2.004 1.438-.103.25-.129.599-.129.948v5.419h-3.554s.05-8.736 0-9.638h3.554v1.364c.429-.659 1.191-1.594 2.905-1.594 2.121 0 3.71 1.389 3.71 4.374v5.494zM5.337 8.855c-1.144 0-1.915-.758-1.915-1.704 0-.959.771-1.703 1.96-1.703 1.188 0 1.914.744 1.938 1.703 0 .946-.75 1.704-1.983 1.704zm1.581 11.597H3.754V9.09h3.164v11.362zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
              </svg>
              Sign in with LinkedIn
            </>
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          <p>We only access your basic profile information to personalize your experience.</p>
        </div>
      </Card>
    </div>
  );
}
