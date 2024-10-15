import React, { useState, useRef, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';

interface YoutubeEmbedProps {
  id: string;
}

export const YoutubeEmbed: React.FC<YoutubeEmbedProps> = ({ id }) => {
  const [width, setWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedWidth = localStorage.getItem(`youtube-width-${id}`);
      return savedWidth ? parseInt(savedWidth, 10) : 560;
    }
    return 560;
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMaxWidth, setIsMaxWidth] = useState(false);
  const [isMinWidth, setIsMinWidth] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      setIsMaxWidth(width >= containerWidth);
      setIsMinWidth(width <= 300);
    }
  }, [width]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`youtube-width-${id}`, width.toString());
    }
  }, [id, width]);

  const handleResize = (increment: number) => {
    const newWidth = width + increment;
    setWidth(newWidth);
  };

  return (
    <div ref={containerRef} className="relative w-full group">
      <div className="flex justify-center">
        <div className="relative" style={{ width: `${width}px`, paddingBottom: `${width * 0.5625}px` }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            width={width}
            height={width * 0.5625}
            src={`https://www.youtube.com/embed/${id}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
      <div className="absolute -right-10 top-0 h-full flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => handleResize(20)}
          disabled={isMaxWidth}
          className="bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-50 mb-2"
        >
          <Plus size={20} />
        </button>
        <button
          onClick={() => handleResize(-20)}
          disabled={isMinWidth}
          className="bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center disabled:opacity-50"
        >
          <Minus size={20} />
        </button>
      </div>
    </div>
  );
};