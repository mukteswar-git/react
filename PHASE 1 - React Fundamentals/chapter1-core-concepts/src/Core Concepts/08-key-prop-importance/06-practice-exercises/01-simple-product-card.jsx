/* eslint-disable react-refresh/only-export-components */
function ProductCard() {
  const product = {
    name: 'Wireless Headphones',
    price: 79.99,
    image: 'headphones.jpg',
    inStock: true,
    rating: 4.5
  };

  // TODO: 
  // 1. Display product image
  // 2. Show name and price
  // 3. Show "In Stock" or "Out of Stock"
  // 4. Show rating with stars
  // 5. Add "Add to Cart" button

  return (
    <div>
      <img src={product.image} alt={product.name} />
      <p>{product.name} - ${product.price.toFixed(2)}</p>
      <p>{product.inStock ? 'In Stock' : 'Out of Stock'}</p>
      <span>
        {'⭐'.repeat(Math.floor(product.rating))} ({product.rating})
      </span>
      <button disabled={!product.inStock}>
        Add to Cart
      </button>
    </div>
  );
}