export default function AuthErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md text-center p-6">
        <h1 className="text-2xl font-bold">Authentication Error</h1>
        <p className="mt-4">Something went wrong during authentication. Please try again or contact support.</p>
      </div>
    </main>
  );
}
