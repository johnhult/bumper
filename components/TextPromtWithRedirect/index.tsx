'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';

interface TextPromptWithRedirectInterface {
  children: string;
  keyPress: string;
  url: string;
}

function TextPromptWithRedirect({
  children,
  keyPress,
  url,
}: TextPromptWithRedirectInterface) {
  const router = useRouter();

  React.useEffect(() => {
    async function runAction(event: KeyboardEvent) {
      event.preventDefault();
      if (event.key === keyPress) {
        router.push(url);
      }
    }

    addEventListener('keydown', runAction);
    return () => {
      removeEventListener('keydown', runAction);
    };
  });

  return <h1 className='font-mono'>{children}</h1>;
}

export default TextPromptWithRedirect;
