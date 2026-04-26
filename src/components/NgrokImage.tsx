import { useState, useEffect } from 'react';

interface NgrokImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallback?: React.ReactNode;
}

export const NgrokImage = ({ src, fallback, ...props }: NgrokImageProps) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let isMounted = true;

    if (!src) {
      setLoading(false);
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    // Only do the custom fetch if it's an ngrok URL
    if (src.includes('ngrok-free.app')) {
      fetch(src, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to load image');
          return res.blob();
        })
        .then(blob => {
          if (!isMounted) return;
          objectUrl = URL.createObjectURL(blob);
          setImgSrc(objectUrl);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading ngrok image:', err);
          if (isMounted) {
            setError(true);
            setLoading(false);
          }
        });
    } else {
      setImgSrc(src);
      setLoading(false);
    }

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  if (error || !src) {
    if (fallback) return <>{fallback}</>;
    // If an onError was passed in props, we can simulate it or just let the caller handle the broken image icon
    return <img src="" alt={props.alt || "Image not found"} {...props} style={{ ...props.style, display: 'none' }} />;
  }

  if (loading) {
    // Show a skeleton or just transparent while loading
    return <div className={`animate-pulse bg-secondary ${props.className || ''}`} style={props.style} />;
  }

  return <img src={imgSrc || ''} {...props} />;
};

export default NgrokImage;
