import { useNavigate } from "@tanstack/react-router";
import React from "react";
import { Helmet } from "react-helmet";
import { LANGUAGE_CONFIG } from "src/editor/languages";
import { Settings } from "src/services/settings";


interface LanguageConfigType {
  runnerName: string;
  languageName: string;
  mode: string;
  defaultText?: string;
  category?: "popular" | "beginner" | "specialized";
  description?: string;
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

    </div>
  );
};


export interface LanguageLandingPageProps {
  languageId: number;
  languageName: string;
}


const LanguageLandingPage: React.FC<LanguageLandingPageProps> = ({
  languageId,
  languageName,
}) => {
  const navigate = useNavigate();

  const handleStartCoding = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(Settings.DEFAULT_LANGUAGE_ID, languageId.toString());
      navigate({
        to: '/',
        replace: true
      });
    }
  };

  const description = `Write, compile and run ${languageName} code online in our free, feature-rich playground. Perfect for learning ${languageName} with instant execution, syntax highlighting, and code sharing capabilities. No installation needed - start coding now!`;

  return (
    <div className="min-h-screen bg-[#211e20] text-[#e9efec] font-mono">
      <Helmet>
        <title>{`${languageName} Online IDE - Free ${languageName} Editor and Compiler`}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://code.cansu.dev/language/${languageName.toLowerCase()}`}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: `${languageName} Online IDE`,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            description: description,
            url: `https://code.cansu.dev/language/${languageName.toLowerCase()}`,
            featureList: [
              "Live Code Execution",
              "Syntax Highlighting",
              "Code Sharing",
              "Auto-save",
            ],
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main Content Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              {languageName} Online IDE
            </h1>
            <p className="text-xl mb-6">
              Free {languageName} editor with instant compilation and execution
            </p>
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button
              onClick={handleStartCoding}
              className="bg-[#3c3836] hover:bg-[#504945] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Start Coding Now
            </button>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#2c2a2a] p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Key Features</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">⚡</span> Instant code execution
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🎨</span> Syntax highlighting
                </li>
                <li className="flex items-center">
                  <span className="mr-2">💾</span> Auto-save functionality
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📤</span> Easy code sharing
                </li>
              </ul>
            </div>

            <div className="bg-[#2c2a2a] p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                Why Choose Our IDE?
              </h2>
              <ul className="space-y-2">
                <li>✓ No installation required</li>
                <li>✓ Clean, distraction-free interface</li>
                <li>✓ Perfect for learning {languageName}</li>
                <li>✓ Mobile-friendly design</li>
              </ul>
            </div>
          </div>

          {/* SEO Content */}
          <div className="mt-8 prose prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">
              Start Coding {languageName} Online
            </h2>
            <p className="mb-4">
              Welcome to our free online {languageName} IDE. Whether you're a
              beginner learning {languageName} or an experienced developer
              looking for a quick coding environment, our platform provides
              everything you need to write, test, and run {languageName} code
              directly in your browser.
            </p>
          </div>
          <CrossLinks currentLanguageId={languageId} />
        </div>
      </div>
    </div>
  );
};
export default LanguageLandingPage;
