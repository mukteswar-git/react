// .map() with Components

function MapProductCard({ name, price }) {
  return (
    <div className="card text-gray-50 py-2">
      <h3>{name}</h3>
      <p>${price}</p>
    </div>
  );
}

function MapProductList() {
  const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Phone', price: 699 },
    { id: 3, name: 'Tablet', price: 499 },
  ];

  return (
    <div className="product-list">
      {products.map((product) => (
        <MapProductCard 
          key={product.id}
          name={product.name}
          price={product.price}
        />
      ))}
    </div>
  );
}

export default MapProductList;