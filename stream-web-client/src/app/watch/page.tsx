'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const VideoPlayer = dynamic(() => import('./VideoPlayer'), { ssr: false });

export default function Watch() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VideoPlayer />
    </Suspense>
  );
}