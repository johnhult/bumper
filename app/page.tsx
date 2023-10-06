import Button from '@/components/Button';
import TextPromtWithRedirect from '@/components/TextPromtWithRedirect';
import { redirect } from 'next/navigation';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center'>
      <div className='flex flex-col items-center'>
        <TextPromtWithRedirect keyPress=' ' url={'/lobby'}>
          PRESS SPACE TO START
        </TextPromtWithRedirect>
        <Button className='mt-6' href='/character-creator'>
          SETTINGS
        </Button>
      </div>
    </main>
  );
}
