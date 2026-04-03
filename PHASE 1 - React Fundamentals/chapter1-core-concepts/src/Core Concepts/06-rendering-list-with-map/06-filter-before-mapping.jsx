// Filtering Before Mapping

function FilterProductList() {
  const products = [
    { id: 1, name: 'Laptop', price: 999, inStock: true },
    { id: 2, name: 'Phone', price: 699, inStock: false },
    { id: 3, name: 'Tablet', price: 499, inStock: true }
  ];

  return (
    <div className="text-gray-50">
      <h2>Available Products</h2>
      {products
        .filter(product => product.inStock) // Filter first
        .map(product => (                   // Then map
          <div className="py-1">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))
      }
    </div>
  );
}

export default FilterProductList;