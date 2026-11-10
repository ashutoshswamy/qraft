import Link from "next/link";
import { Globe, Plus } from "lucide-react";
import Logo from "./components/Logo";
import Background from "./components/Background";
import QRGenerator from "./components/QRGenerator";
import ThemeToggle from "./components/ThemeToggle";
import { GithubLogo, LinkedinLogo, XLogo } from "./components/BrandIcons";

const socials = [
  { href: "https://github.com/ashutoshswamy", label: "GitHub", Icon: GithubLogo },
  { href: "https://linkedin.com/in/ashutoshswamy", label: "LinkedIn", Icon: LinkedinLogo },
  { href: "https://x.com/ashutoshswamy_", label: "X", Icon: XLogo },
  { href: "https://ashutoshswamy.in", label: "Portfolio", Icon: Globe },
];

const faqs = [
  {
    q: "Is Qraft really free?",
    a: "Yes. Qraft is free with no sign-up, no watermark and no download limit.",
  },
  {
    q: "Is my link or text uploaded anywhere?",
    a: "No. Every QR code is generated in your browser, so what you type never leaves your device.",
  },
  {
    q: "What can I put in a QR code?",
    a: "Any link or text: a website, a portfolio, a menu, a Wi-Fi note or a short message.",
  },
  {
    q: "Which pattern, color and size should I choose?",
    a: "Pick square, dots, rounded, classy or elegant, then a size and an ink color. Keep the ink dark on the white background so the code scans reliably.",
  },
  {
    q: "What format do I get?",
    a: "A high-resolution PNG, exported at 2x the preview size so it stays sharp in print.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip">
      <Background />

      <header className="ground-zone mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-on-ground" aria-label="Qraft home">
          <Logo className="h-9 w-9" />
          <span className="font-display text-2xl font-extrabold tracking-tight">Qraft</span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 py-6 sm:py-10 lg:py-14">
        <QRGenerator />
      </main>

      <section
        aria-labelledby="faq-heading"
        className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
          <h2
            id="faq-heading"
            className="ground-zone font-display text-balance text-4xl font-extrabold leading-[1.04] tracking-[-0.03em] text-on-ground sm:text-5xl lg:sticky lg:top-8 lg:self-start"
          >
            Free QR code generator: <span className="overprint">questions</span>
          </h2>

          <div className="paper-zone divide-y divide-line rounded-3xl bg-paper px-5 py-2 shadow-[0_28px_56px_-28px_rgb(8_6_70/0.6)] sm:px-8">
            {faqs.map(({ q, a }, i) => (
              <details key={q} name="faq" open={i === 0} className="group faq-item">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-lg font-bold leading-snug tracking-tight text-ink sm:text-xl">
                    {q}
                  </h3>
                  <span
                    aria-hidden
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-coral text-[#15123a] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:rotate-45 group-active:scale-90"
                  >
                    <Plus className="h-5 w-5" strokeWidth={2.5} />
                  </span>
                </summary>
                <p className="max-w-[60ch] pb-6 pr-14 text-base leading-relaxed text-ink-soft">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="ground-zone mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 pb-6 pt-8 sm:px-6 lg:px-8">
        <span className="text-sm font-medium text-on-ground-soft">Built by Ashutosh Swamy</span>
        <ul className="flex items-center gap-1">
          {socials.map(({ href, label, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="grid h-11 w-11 place-items-center rounded-xl text-on-ground transition-colors duration-200 hover:bg-on-ground/12"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
