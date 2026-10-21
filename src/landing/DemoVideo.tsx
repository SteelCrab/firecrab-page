import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useI18n } from './i18n/context';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Looping product demo (an MP4 made from the original GIF, about a tenth of its size).
 * It plays only while on screen, starts paused when the visitor asks for reduced motion,
 * and always has a pause / play button (WCAG 2.2.2: moving content longer than 5 s).
 */
export function DemoVideo({
  src,
  poster,
  width,
  height,
  label,
}: {
  src: string;
  poster: string;
  width: number;
  height: number;
  label: string;
}) {
  const { t } = useI18n();
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  // The visitor's choice. The observer below only plays the video when this is true.
  const wantsPlay = useRef(true);

  useEffect(() => {
    const element = video.current;
    if (!element) return undefined;
    wantsPlay.current = !prefersReducedMotion();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && wantsPlay.current) element.play().catch(() => undefined);
        else element.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const element = video.current;
    if (!element) return;
    wantsPlay.current = element.paused;
    if (element.paused) element.play().catch(() => undefined);
    else element.pause();
  };

  return (
    <div className="fc-demo">
      <video
        ref={video}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        width={width}
        height={height}
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={src} type="video/mp4" />
      </video>
      <button
        type="button"
        className="fc-demo-toggle"
        onClick={toggle}
        aria-label={playing ? t('애니메이션 일시정지', 'Pause animation') : t('애니메이션 재생', 'Play animation')}
      >
        {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
      </button>
    </div>
  );
}
