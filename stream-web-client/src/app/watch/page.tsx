'use client';

import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

export default function Watch() {
  const videoPrefix = 'https://storage.googleapis.com/processed-video-stream/';
  const videoSrc = useSearchParams().get('v');

  return (
    <div>
      <h1>Watch Page</h1>
      <video controls src={videoPrefix + videoSrc} className={styles.video} />
    </div>
  );
}