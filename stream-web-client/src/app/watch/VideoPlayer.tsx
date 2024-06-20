'use client';

import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';

export default function VideoPlayer() {
  const videoPrefix = 'https://storage.googleapis.com/processed-video-stream/';
  const searchParams = useSearchParams();
  const videoSrc = searchParams ? searchParams.get('v') : null;

  if (!videoSrc) {
    return <div>No video selected</div>;
  }

  return (
    <div>
      <video controls src={videoPrefix + videoSrc} className={styles.video} />
    </div>
  );
}