import React from 'react';
import { TypeAnimation } from 'react-type-animation';

interface StreamTextProps {
  /**
   * Urutan teks dan jeda (dalam ms) atau fungsi callback.
   * Contoh: ['Halo', 1000, 'Dunia', 1000, () => console.log('Selesai!')]
   */
  sequence: (string | number | (() => void))[];
  /** Kecepatan mengetik dalam milidetik. Default: 40 */
  speed?: number;
  /** Elemen HTML untuk membungkus teks. Default: 'span' */
  wrapper?: React.ElementType;
  /** Apakah akan menampilkan kursor. Default: true */
  cursor?: boolean;
  /** Berapa kali animasi akan diulang. Default: 0 (tidak diulang). Gunakan Infinity untuk pengulangan tak terbatas. */
  repeat?: number;
  /** ClassName CSS tambahan untuk styling */
  className?: string;
  /** Gaya inline tambahan */
  style?: React.CSSProperties;
}

/**
 * Komponen untuk menampilkan teks dengan efek ketikan menggunakan react-type-animation.
 */
export const StreamText: React.FC<StreamTextProps> = ({
  sequence,
  speed, // Library akan menggunakan defaultnya jika tidak disediakan
  wrapper = 'span',
  cursor = true,
  repeat = 0,
  className,
  style,
}) => {
  if (!sequence || sequence.length === 0) {
    // Tidak ada yang ditampilkan jika sequence kosong
    return null;
  }

  return (
    <TypeAnimation
      sequence={sequence}
      speed={speed as any}
      wrapper={wrapper as any}
      cursor={cursor}
      repeat={repeat}
      className={className}
      style={style}
    />
  );
};
