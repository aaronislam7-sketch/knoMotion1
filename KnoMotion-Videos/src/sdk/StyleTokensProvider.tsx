import React, {createContext, useContext, useEffect} from 'react';



type Tokens = {

  colors?: { bg?: string; accent?: string };

  fonts?: {

    title?: { family?: string; size?: number };

    body?: { family?: string; size?: number };

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



    if (colors.bg) r.setProperty('--kn-bg', colors.bg);

    if (colors.accent) r.setProperty('--kn-accent', colors.accent);



    if (fonts.title?.family) r.setProperty('--kn-font-title', fonts.title.family);

    if (fonts.body?.family) r.setProperty('--kn-font-body', fonts.body.family || 'system-ui');



    r.setProperty('--kn-imp', String(motion.imperfection ?? 0.12));      // 0..1

    r.setProperty('--kn-texture-paper', texture.paper ? '1' : '0');       // 0/1

  }, [tokens]);



  return <Ctx.Provider value={tokens}>{children}</Ctx.Provider>;

}



export const useStyleTokens = () => useContext(Ctx);
