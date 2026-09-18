import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)] p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center">
          <span className="text-2xl">404</span>
        </div>
        <h2 className="text-lg font-bold text-foreground mb-2">Page not found</h2>
        <p className="text-sm text-muted mb-4">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          Back to Map
        </Link>
      </div>
    </div>
  );
}
