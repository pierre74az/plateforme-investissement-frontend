import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-20 h-20 bg-[#F0FDF4] border border-[#BBF7D0] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🔍</span>
        </div>
        <p className="text-6xl font-semibold text-[#15803D] mb-3">404</p>
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Page introuvable</h1>
        <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/"
            className="bg-[#15803D] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#166534] transition-all active:scale-[.97]">
            Accueil
          </Link>
          <Link href="/catalogue"
            className="border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all">
            Catalogue
          </Link>
        </div>
      </div>
    </div>
  )
}
