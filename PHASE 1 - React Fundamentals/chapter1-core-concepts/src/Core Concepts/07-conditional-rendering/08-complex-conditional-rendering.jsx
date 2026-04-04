/* eslint-disable react-refresh/only-export-components */
// Complex Conditional Rendering

function ProductCard({ product}) {
  // Multiple conditions
  const showDiscount = product.discount > 0;
  const isOutOfStock = product.stock === 0;
  const isFeatured = product.rating >= 4.5;

  return (
    <div>
      {isFeatured && <span>Featured</span>}

      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>

      <div>
        {showDiscount ? (
          <>
            <span>${product.price}</span>
            <span>
              ${product.price - product.discount}
            </span>
          </>
        ) : (
          <span>${product.price}</span>
        )}
      </div>

      {isOutOfStock ? (
        <button disabled>Out of Stock</button>
      ) : (
        <button>Add to Cart</button>
      )}    

      {product.stock < 5 && product.stock > 0 && (
        <p>Only {product.stock} left!</p>
      )}
    </div>
  )
}