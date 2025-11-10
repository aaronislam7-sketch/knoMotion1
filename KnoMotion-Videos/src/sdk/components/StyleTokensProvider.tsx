import React, {createContext, useContext, useEffect} from 'react';



type Tokens = {

  colors?: {
    bg?: string;
    board?: string;
    accent?: string;
    accent2?: string;
    ink?: string;
    highlight?: string;
    success?: string;
    warning?: string;
    danger?: string;
    muted?: string;
  };

  fonts?: {

    title?: { family?: string; size?: number; fallback?: string };

    body?: { family?: string; size?: number };

    accent?: { family?: string };

    utility?: { family?: string };

    mono?: { family?: string };

    size_hero?: number;

    size_display?: number;

    size_title?: number;

    size_headline?: number;

    size_body?: number;

    size_small?: number;

    size_tiny?: number;

  };

  motion?: { imperfection?: number };

  texture?: { paper?: boolean; chalk?: number };

  sfx?: { tick?: boolean };

};



const Ctx = createContext<Tokens | undefined>(undefined);



export function StyleTokensProvider({

  tokens,

  children,

}: {

  tokens?: Tokens;

  children: React.ReactNode;

}) {

  useEffect(() => {

    const r = document.documentElement.style;

    const {colors = {}, fonts = {}, motion = {}, texture = {}} = tokens || {};

    const setVar = (name: string, value: string | number | undefined) => {
      if (value === undefined || value === null) return;
      r.setProperty(name, typeof value === 'number' ? `${value}` : value);
    };

    const setPxVar = (name: string, value: number | undefined) => {
      if (value === undefined || value === null) return;
      r.setProperty(name, `${value}px`);
    };

    // Colors
    setVar('--kn-color-surface', colors.bg);
    setVar('--kn-bg', colors.bg);
    setVar('--kn-color-board', (colors as any).board);
    setVar('--kn-board', (colors as any).board);
    setVar('--kn-color-accent', colors.accent);
    setVar('--kn-accent', colors.accent);
    setVar('--kn-color-accent2', colors.accent2);
    setVar('--kn-accent-support', colors.accent2);
    setVar('--kn-color-ink', colors.ink);
    setVar('--kn-ink', colors.ink);
    setVar('--kn-color-highlight', (colors as any).highlight ?? (colors as any).accent3);
    setVar('--kn-color-success', (colors as any).success);
    setVar('--kn-color-warning', (colors as any).warning);
    setVar('--kn-color-danger', (colors as any).danger);
    setVar('--kn-color-muted', (colors as any).muted);

    // Typography families
    setVar('--kn-font-display', fonts.title?.family);
    setVar('--kn-font-title', fonts.title?.family);
    const bodyFamily = fonts.body?.family || fonts.title?.fallback || 'system-ui';
    setVar('--kn-font-body', bodyFamily);
    setVar('--kn-font-utility', fonts.utility?.family ?? 'Inter, sans-serif');
    setVar('--kn-font-accent', fonts.accent?.family ?? fonts.title?.family ?? 'Caveat, cursive');
    setVar('--kn-font-mono', fonts.mono?.family);

    // Typography scale
    setPxVar('--kn-font-size-hero', fonts.size_hero);
    setPxVar('--kn-font-size-display', fonts.size_display);
    setPxVar('--kn-font-size-title', fonts.size_title);
    setPxVar('--kn-font-size-headline', fonts.size_headline);
    setPxVar('--kn-font-size-body', fonts.size_body);
    setPxVar('--kn-font-size-small', fonts.size_small);
    setPxVar('--kn-font-size-tiny', fonts.size_tiny);

    // Legacy aliases remain in sync
    setPxVar('--kn-text-hero', fonts.size_hero);
    setPxVar('--kn-text-title', fonts.size_title);
    setPxVar('--kn-text-h2', fonts.size_headline);
    setPxVar('--kn-text-body', fonts.size_body);
    setPxVar('--kn-text-small', fonts.size_small);
    setPxVar('--kn-text-tiny', fonts.size_tiny);

    // Motion + texture
    r.setProperty('--kn-imp', String(motion.imperfection ?? 0.12));      // 0..1
    r.setProperty('--kn-texture-paper', texture.paper ? '1' : '0');       // 0/1
    if (texture.chalk !== undefined) {
      r.setProperty('--kn-chalk-opacity', String(texture.chalk));
    }
    if (texture.noise !== undefined) {
      r.setProperty('--kn-noise-opacity', String(texture.noise));
    }

  }, [tokens]);



  return <Ctx.Provider value={tokens}>{children}</Ctx.Provider>;

}



export const useStyleTokens = () => useContext(Ctx);
