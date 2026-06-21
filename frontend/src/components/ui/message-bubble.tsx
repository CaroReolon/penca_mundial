import { useEffect, useState } from 'react';

const SCROLL_THRESHOLD = 20;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

export function MessageBubble({ message, className }: { message: string; className?: string }) {
  const isMobile = useIsMobile();
  const shouldScroll = isMobile && message.length > SCROLL_THRESHOLD;

  return (
    <div className={`bg-gray-100 text-gray-600 text-xs rounded-2xl rounded-tl-none px-2 py-0.5 overflow-hidden ${className ?? ''}`}>
      {shouldScroll ? (
        <div style={{ display: 'inline-flex', animation: 'marquee 8s linear infinite', whiteSpace: 'nowrap' }}>
          <span style={{ paddingRight: '2rem' }}>{message}</span>
          <span style={{ paddingRight: '2rem' }}>{message}</span>
        </div>
      ) : (
        <span className="block truncate">{message}</span>
      )}
    </div>
  );
}
