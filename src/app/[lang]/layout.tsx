import Head from 'next/head';

// Layout for the dynamic [lang] segment.
// Implements variant 2: pre-generate only the allowed language params and
// disable any other dynamic values so random strings 404 (better SEO & cleanliness).

export const dynamicParams = false; // Block unknown params (anything not returned below becomes 404)

// Central place to manage supported locales. If you add a new locale file, update this list.
const SUPPORTED_LANGS = ['en', 'ro', 'ru'] as const;

export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Could add per-locale context/providers here if needed later.
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/HeroSection/BackgroundVideoHeroSection_compressed.mp4"
          as="video"
          type="video/mp4"
        />
      </Head>
      {children}
    </>
  );
}
