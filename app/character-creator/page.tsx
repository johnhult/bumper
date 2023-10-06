import Button from '@/components/Button';
import ColorPicker from '@/components/ColorPicker';
import Link from 'next/link';

export default function CharacterCreator() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center'>
      <div className='flex flex-col items-start'>
        <h1 className='font-mono mb-2'>Select color</h1>
        <ColorPicker />
        <Button className='self-center mt-6' href={'/'}>
          Done
        </Button>
      </div>
    </main>
  );
}
