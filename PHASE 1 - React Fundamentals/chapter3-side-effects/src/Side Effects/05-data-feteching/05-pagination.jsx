/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
// Pagination Example

function PaginatedList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
        );
        const data = await response.json();
        
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setItems(prev => [...prev, ...data]);
        }
      } catch (error) {
        console.error('Failed to fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [page]);

  return (
    <div>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
      
      {loading && <div>Loading more...</div>}
      
      {hasMore && !loading && (
        <button onClick={() => setPage(p => p + 1)}>
          Load More
        </button>
      )}
      
      {!hasMore && <div>No more items</div>}
    </div>
  );
}