'use client';
import {
  choicesSettings,
  useGetSettings,
  useSetColor,
} from '@/contexts/settingsContext';

export default function ColorPicker() {
  const { color } = useGetSettings();
  const selectColor = useSetColor();
  return (
    <ul className='flex justify-center'>
      {choicesSettings.color.map((c, i) => (
        <button
          onClick={() => {
            selectColor(c);
          }}
          key={`colorSelect-${c}-${i}`}
          style={{ backgroundColor: c }}
          className={`w-8 h-8 rounded m-1 border-2 flex-initial first-of-type:ml-0 last-of-type:mr-0 ${
            color === c ? 'border-black' : 'border-transparent'
          }`}
        />
      ))}
    </ul>
  );
}
