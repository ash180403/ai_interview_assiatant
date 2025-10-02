// src/components/shared/Header.tsx

// --- HEADER COMPONENT ---
// This component displays the main title and subtitle of our application.
// It's designed to be clean, bold, and fit our futuristic theme.
const Header = () => {
  return (
    // The `<header>` tag is used for semantic HTML.
    // - `w-full max-w-6xl mb-12 text-center`: This makes the header take the full
    //   width of our content area, adds a large margin below it, and centers the text.
    <header className="w-full max-w-6xl mb-12 text-center">
      {/*
        This is the main title.
        - `text-5xl font-bold`: Makes the text very large and bold to be impactful.
        - `tracking-tight`: Tightens the letter-spacing for a modern, compact look.
      */}
      <h1 className="text-5xl font-bold tracking-tight">AI-Interview Assistant</h1>
      {/*
        This is the subtitle.
        - `text-lg text-white/60 mt-2`: Makes the text slightly larger than normal,
          sets its color to be semi-transparent white for a softer look, and adds
          a small margin above it.
      */}
      <p className="text-lg text-white/60 mt-2">
        Your personal co-pilot for technical interviews.
      </p>
    </header>
  );
};

export default Header;