export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 p-10 shadow-lg text-center">
        <h1 className="text-5xl font-bold text-slate-900 mb-4">404</h1>
        <p className="text-lg text-slate-600 mb-6">Page not found. Please check the URL or return to the home page.</p>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}
