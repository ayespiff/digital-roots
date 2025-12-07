import { useState } from "react";

export default function WelcomeScreen({
  onContinue = (_: { lang: string }) => {},
}) {
  const [lang, setLang] = useState("en");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (!consent) return setError("Please confirm consent to continue.");
    setError("");
    onContinue({ lang });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 grid place-items-center text-white">DR</div>
            <span className="font-semibold tracking-tight">Digital Roots</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="lang" className="sr-only">Language</label>
            <select
              id="lang"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="rounded-md border px-2 py-1"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="pt">Português</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-8 items-center px-4 py-10 md:py-16">
          {/* Copy + consent */}
          <section className="order-2 md:order-1 bg-white rounded-2xl shadow-sm border">
            <div className="p-6">
              <h1 className="text-2xl md:text-3xl font-semibold">Learn essential digital skills—simply.</h1>
              <p className="mt-2 text-slate-600">
                Short, practical lessons on web safety, passwords, browsing, and everyday tasks. Designed for first-time or low-confidence users.
              </p>

              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• 5–10 minutes per lesson — learn at your pace.</li>
                <li>• Privacy-first — pseudonymous ID; export/delete your data anytime.</li>
              </ul>

              <div className="mt-5 flex items-start gap-3">
                <input
                  id="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4"
                />
                <label htmlFor="consent" className="text-sm">
                  I agree to the <a className="underline" href="#">privacy summary</a> and understand my data will be used to improve learning.
                </label>
              </div>
              {error && <p className="mt-2 text-sm text-rose-600" role="alert">{error}</p>}

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleContinue}
                  className="inline-flex items-center justify-center rounded-xl bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                >
                  I agree & continue
                </button>
                <a href="#learn-more" className="px-4 py-2 text-sm rounded-xl border inline-flex items-center justify-center">
                  Learn more
                </a>
              </div>
            </div>
          </section>

          {/* Visual side */}
          <section className="order-1 md:order-2">
            <div className="relative aspect-[4/3] rounded-3xl bg-gradient-to-br from-indigo-200 via-violet-200 to-pink-200 shadow-md overflow-hidden">
              <div className="absolute inset-0 grid place-items-center">
                <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-sm text-center max-w-xs">
                  <p className="text-sm text-slate-700">
                    Welcome! You’ll learn by doing: short steps, quick quizzes, instant feedback.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/70">
        <div className="mx-auto max-w-5xl px-4 py-4 text-xs text-slate-500 flex items-center justify-between">
          <p>v1.0 • Language: <span className="font-medium">{lang.toUpperCase()}</span></p>
          <nav className="flex items-center gap-4">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Accessibility</a>
            <a href="#" className="hover:underline">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
