// biome-ignore lint/style/useImportType: <explanation>
import React from "react";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import { LANGUAGE_CONFIG } from "src/editor/languages";
import { Settings } from "src/services/settings";

// Types for better TypeScript support
interface LanguageConfigType {
  runnerName: string;
  languageName: string;
  mode: string;
  defaultText?: string;
  category?: "popular" | "beginner" | "specialized";
  description?: string;
}

interface LanguagePageProps {
  languageId: number;
  languageName: string;
}

const popularLanguages = [
  "Python",
  "JavaScript",
  "Java",
  "C++",
  "C#",
  "PHP",
  "Ruby",
];
const beginnerLanguages = ["Javascript", "Python", "Ruby", "Basic"];

const getLanguageCategory = (name: string): string => {
  if (popularLanguages.includes(name)) return "Popular Languages";
  if (beginnerLanguages.includes(name)) return "Great for Learning";
  return "Specialized Languages";
};

const generateSEODescription = (languageName: string): string => {
  const templates = [
    `Write and run ${languageName} code online with our free playground. Features syntax highlighting, instant execution, and code sharing. Perfect for learning ${languageName} programming.`,
    `Free online ${languageName} editor and compiler. Test your ${languageName} code instantly with our feature-rich playground. No installation needed.`,
    `Online ${languageName} playground with real-time compilation. Practice ${languageName} programming with our free editor featuring code execution and sharing capabilities.`,
  ];
  // biome-ignore lint/style/noNonNullAssertion: <what?>
  return templates[Math.floor(Math.random() * templates.length)]!;
};

const CrossLinks: React.FC<{ currentLanguageId: number }> = ({
  currentLanguageId,
}) => {
  const categorizedLanguages = Object.entries(LANGUAGE_CONFIG)
    .filter(([id]) => Number(id) !== currentLanguageId)
    .reduce(
      (acc, [id, lang]) => {
        const category = getLanguageCategory(lang.runnerName);
        if (!acc[category]) acc[category] = [];
        acc[category].push({ id: Number(id), ...lang });
        return acc;
      },
      {} as Record<string, Array<LanguageConfigType & { id: number }>>,
    );

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-[#2c2a2a] rounded-lg">
      <h2 className="text-2xl mb-6 font-bold">
        Explore More Programming Languages
      </h2>

      {Object.entries(categorizedLanguages).map(([category, langs]) => {
        const uniqueLangs = langs.filter(
          (lang, index, self) =>
            index === self.findIndex((l) => l.languageName === lang.languageName)
        );

        return (
          <div key={category} className="mb-8">
            <h3 className="text-xl mb-4 font-semibold">{category}</h3>
            <div className="flex flex-wrap gap-3">
              {uniqueLangs.slice(0, 6).map((lang) => (
                <a
                  key={lang.id}
                  href={`/language/${lang.languageName.toLowerCase()}`}
                  className="px-4 py-2 bg-[#3c3836] hover:bg-[#504945] rounded-lg 
               transition-colors duration-200 text-[#e9efec] hover:text-white
               flex items-center space-x-2"
                >
                  <span>{lang.runnerName}</span>
                </a>
              ))}
            </div>
          </div>
        );
      })}

      <div className="mt-6 p-4 bg-[#211e20] rounded-lg">
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>✨ Clean, distraction-free coding environment</li>
          <li>⚡ Instant code execution</li>
          <li>🎨 Syntax highlighting</li>
          <li>📤 Easy code sharing</li>
          <li>💾 Auto-save functionality</li>
        </ul>
      </div>
    </div>
  );
};

const LanguageLandingPage: React.FC<LanguagePageProps> = ({
  languageId,
  languageName,
}) => {
  useEffect(() => {
    // Store language preference and redirect
    localStorage.setItem(Settings.DEFAULT_LANGUAGE_ID, languageId.toString());

    // Add a small delay to ensure SEO crawlers can read the content
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 100);

    return () => clearTimeout(timer);
  }, [languageId]);

  const description = generateSEODescription(languageName);
  const keywords = `${languageName.toLowerCase()} playground, ${languageName.toLowerCase()} online, ${languageName.toLowerCase()} compiler, ${languageName.toLowerCase()} editor, online ${languageName.toLowerCase()}, ${languageName.toLowerCase()} programming, code editor`;

  return (
    <div className="min-h-screen bg-[#211e20] text-[#e9efec] font-mono">
      <Helmet>
        <title>{`${languageName} Playground - Free Online ${languageName} Editor and Compiler`}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />

        <meta
          property="og:title"
          content={`${languageName} Online Playground - Free ${languageName} Editor`}
        />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${languageName} Online Playground - Free ${languageName} Editor`}
        />
        <meta name="twitter:description" content={description} />

        <link
          rel="canonical"
          href={`https://code.cansu.dev/${languageName.toLowerCase()}`}
        />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: `${languageName} Online Playground`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web Browser",
            description: description,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Syntax highlighting",
              "Code execution",
              "Code sharing",
              "Auto-save functionality",
            ],
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4 font-bold">
            {languageName} Programming Playground
          </h1>
          <p className="text-xl mb-8">
            Free online {languageName} editor with instant execution
          </p>
          <div className="animate-pulse">
            <p className="text-lg">Loading your {languageName} playground...</p>
          </div>
        </div>

        <CrossLinks currentLanguageId={languageId} />
      </div>
    </div>
  );
};

export default LanguageLandingPage;
