import {useEffect} from 'react';

export const usePreloadAssets = (urls: string[] = []) => {

  useEffect(() => {

    urls.forEach((u) => { const i = new Image(); i.src = u; });

  }, [JSON.stringify(urls)]);

};

