function Product() {
  const product = {
    name: 'Laptop',
    price: 999,
    image: 'laptop.jpb',
    inStock: true
  };

  return (
    <div className="product">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <p>{product.inStock ? 'In Stock' : 'Out of Stock'}</p>
      <button>Add to Cart</button>
    </div>
  );
}

export default Product;