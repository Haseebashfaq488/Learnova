import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type PaletteId = 'indigo' | 'emerald' | 'crimson' | 'cyan' | 'violet' | 'obsidian';
export type FontId = 'inter' | 'jakarta' | 'outfit' | 'lexend' | 'poppins' | 'serif' | 'space';
export type MotionMode = 'expressive' | 'minimal';

export interface PaletteInfo {
  id: PaletteId;
  name: string;
  tagline: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  badgeBg: string;
}

export interface FontInfo {
  id: FontId;
  name: string;
  family: string;
  category: string;
  description: string;
}

export const PALETTES: PaletteInfo[] = [
  {
    id: 'indigo',
    name: 'Oxford Royal',
    tagline: 'Prestige, Focus & University Classic',
    primaryLight: '#2646B8',
    primaryDark: '#4F75FF',
    accent: '#3156D3',
    badgeBg: '#E8EEFF',
  },
  {
    id: 'emerald',
    name: 'Emerald Academy',
    tagline: 'Growth, Biology, STEM & Calm Clarity',
    primaryLight: '#059669',
    primaryDark: '#34D399',
    accent: '#10B981',
    badgeBg: '#ECFDF5',
  },
  {
    id: 'crimson',
    name: 'Cambridge Crimson',
    tagline: 'Ivy Heritage, Distinction & Warmth',
    primaryLight: '#9F1239',
    primaryDark: '#FB7185',
    accent: '#E11D48',
    badgeBg: '#FFF1F2',
  },
  {
    id: 'cyan',
    name: 'Nordic Aurora',
    tagline: 'Scandinavian Clarity & Precision',
    primaryLight: '#0E7490',
    primaryDark: '#38BDF8',
    accent: '#06B6D4',
    badgeBg: '#ECFEFF',
  },
  {
    id: 'violet',
    name: 'Violet Scholar',
    tagline: 'Intellect, Creative Curiosity & EdTech',
    primaryLight: '#6D28D9',
    primaryDark: '#A78BFA',
    accent: '#8B5CF6',
    badgeBg: '#F5F3FF',
  },
  {
    id: 'obsidian',
    name: 'Obsidian Minimal',
    tagline: 'High Contrast, Slate & Distraction-Free',
    primaryLight: '#1E293B',
    primaryDark: '#94A3B8',
    accent: '#475569',
    badgeBg: '#F1F5F9',
  },
];

export const FONTS: FontInfo[] = [
  {
    id: 'inter',
    name: 'Inter',
    family: "'Inter', system-ui, sans-serif",
    category: 'Modern Sans',
    description: 'Clean, balanced, high-legibility interface typography.',
  },
  {
    id: 'jakarta',
    name: 'Plus Jakarta Sans',
    family: "'Plus Jakarta Sans', system-ui, sans-serif",
    category: 'Refined Editorial',
    description: 'Modern geometric elegance with distinctive humanist character.',
  },
  {
    id: 'outfit',
    name: 'Outfit',
    family: "'Outfit', system-ui, sans-serif",
    category: 'Inspiring EdTech',
    description: 'Friendly, modern geometric design tailored for learning products.',
  },
  {
    id: 'lexend',
    name: 'Lexend',
    family: "'Lexend', system-ui, sans-serif",
    category: 'Cognitive Readability',
    description: 'Empirically engineered to improve reading fluency and visual tracking.',
  },
  {
    id: 'poppins',
    name: 'Poppins',
    family: "'Poppins', system-ui, sans-serif",
    category: 'Approachable',
    description: 'Warm, rounded geometric curves that inspire confidence and comfort.',
  },
  {
    id: 'serif',
    name: 'Academic Editorial',
    family: "'Newsreader', 'Inter', Georgia, serif",
    category: 'Scholarly Classic',
    description: 'Prestigious serif display headings paired with high-clarity sans body.',
  },
  {
    id: 'space',
    name: 'Space Grotesk',
    family: "'Space Grotesk', system-ui, sans-serif",
    category: 'STEM & Engineering',
    description: 'Technical, confident character inspired by scientific computing.',
  },
];

interface ThemeContextType {
  theme: ThemeMode;
  actualTheme: 'light' | 'dark';
  setTheme: (mode: ThemeMode) => void;
  palette: PaletteId;
  setPalette: (palette: PaletteId) => void;
  font: FontId;
  setFont: (font: FontId) => void;
  motionMode: MotionMode;
  setMotionMode: (mode: MotionMode) => void;
  resetToDefaults: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  actualTheme: 'light',
  setTheme: () => {},
  palette: 'indigo',
  setPalette: () => {},
  font: 'inter',
  setFont: () => {},
  motionMode: 'expressive',
  setMotionMode: () => {},
  resetToDefaults: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('learnova_theme');
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch {}
    return 'light';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  const [palette, setPaletteState] = useState<PaletteId>(() => {
    try {
      const saved = localStorage.getItem('learnova_palette') as PaletteId;
      if (PALETTES.some((p) => p.id === saved)) {
        return saved;
      }
    } catch {}
    return 'indigo';
  });

  const [font, setFontState] = useState<FontId>(() => {
    try {
      const saved = localStorage.getItem('learnova_font') as FontId;
      if (FONTS.some((f) => f.id === saved)) {
        return saved;
      }
    } catch {}
    return 'inter';
  });

  const [motionMode, setMotionModeState] = useState<MotionMode>(() => {
    try {
      const saved = localStorage.getItem('learnova_motion') as MotionMode;
      if (saved === 'expressive' || saved === 'minimal') {
        return saved;
      }
    } catch {}
    return 'expressive';
  });

  // Apply Theme (light / dark)
  useEffect(() => {
    const updateTheme = () => {
      let resolved: 'light' | 'dark' = 'light';
      if (theme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        resolved = theme;
      }

      setActualTheme(resolved);

      const root = document.documentElement;
      root.setAttribute('data-theme', resolved);
      if (resolved === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      try {
        localStorage.setItem('learnova_theme', theme);
      } catch {}
    };

    updateTheme();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Apply Palette
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-palette', palette);
    try {
      localStorage.setItem('learnova_palette', palette);
    } catch {}
  }, [palette]);

  // Apply Font
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-font', font);
    try {
      localStorage.setItem('learnova_font', font);
    } catch {}
  }, [font]);

  // Apply Motion Mode
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-motion', motionMode);
    try {
      localStorage.setItem('learnova_motion', motionMode);
    } catch {}
  }, [motionMode]);

  const setTheme = (mode: ThemeMode) => setThemeState(mode);
  const setPalette = (p: PaletteId) => setPaletteState(p);
  const setFont = (f: FontId) => setFontState(f);
  const setMotionMode = (m: MotionMode) => setMotionModeState(m);

  const resetToDefaults = () => {
    setThemeState('light');
    setPaletteState('indigo');
    setFontState('inter');
    setMotionModeState('expressive');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        actualTheme,
        setTheme,
        palette,
        setPalette,
        font,
        setFont,
        motionMode,
        setMotionMode,
        resetToDefaults,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
