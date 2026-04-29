import { useCallback, useEffect, useRef } from "react";
import { useInfiniteScroll } from "./useInfiniteScroll";
import ImageCard from "./components/ImageCard";

function App() {
  const fetchImage = useCallback(async (page) => {
    const res = await fetch(
      `https://picsum.photos/v2/list?page=${page}&limit=20`,
    );
    if(!res.ok) throw new Error("Failed to fetch");
    return res.json();
  }, []);

  const { data: images, loading, loadMore } = useInfiniteScroll(fetchImage);

  const observerRef = useRef();

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  const lastImageRef = useCallback(
    (node) => {
      if (loading) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMore();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, loadMore],
  );

  return (
    <div className="flex flex-wrap gap-4">
      {images.map((img, index) => {
        if (index === images.length - 1) {
          return (
            <ImageCard
              ref={lastImageRef}
              key={img.id}
              src={img.download_url}
              alt={img.author}
            />
          );
        }

        return (
          <ImageCard
            key={img.id}
            src={img.download_url}
            alt={img.author}
          />
        );
      })}
    </div>
  );
}

export default App;
