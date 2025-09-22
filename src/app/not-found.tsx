export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center gap-6">
      <h1 className="text-4xl font-bold">404 - Page not found</h1>
      <p className="text-muted-foreground max-w-prose">
        The page you are looking for doesn&apos;t exist. If you typed a language code, it may not be supported yet.
      </p>
      <a href="/en" className="underline text-primary">Go back to homepage</a>
    </div>
  );
}
