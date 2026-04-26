import { useEffect, useState } from "react";

export function useInfiniteScroll(fetchFn) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const newData = await fetchFn(page);

        setData(prev => {
          const combined = [...prev, ...newData];

          const unique = combined.filter(
            (img, index, self) =>
              index === self.findIndex(i => i.id === img.id)
          );

          return unique;
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, fetchFn]);

  return { data, loading, loadMore }
}