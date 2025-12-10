import { useEffect, useState } from "react";

export default function HeroContent() {
  const phrases = [
    "Building software...",
    "Writing code...",
    "Sharing knowledge...",
  ];

  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    let currentText = "";
    const fullText = phrases[index];

    const typing = setInterval(() => {
      currentText += fullText[currentIndex];
      setDisplayText(currentText);
      currentIndex++;

      if (currentIndex === fullText.length) {
        clearInterval(typing);

        // Wait, then switch to next text
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % phrases.length);
          setDisplayText("");
        }, 1200);
      }
    }, 60); // typing speed

    return () => clearInterval(typing);
  }, [index]);

  return (
    <div className="relative text-center max-w-4xl mx-auto px-4 flex flex-col items-center justify-center h-screen pointer-events-none">
      <h1 className="text-7xl md:text-8xl font-bold mb-8 text-white tracking-tight">
        <span className="relative inline-block text-gray-200">
          <span className="absolute -top-2 -left-2 w-3 h-3 border-t-2 border-l-2 border-gray-600" />
            Hello, I'm Raphael Gregorius
          <span className="absolute -bottom-2 -right-2 w-3 h-3 border-b-2 border-r-2 border-gray-600" />
        </span>
      </h1>

      <p className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto">
        {displayText}
        <span className="animate-pulse">|</span>
      </p>
    </div>
  );
}
