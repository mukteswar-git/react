// Nested .map()

function NestedMapCategoryList() {
  const categories = [
    {
      id: 1,
      name: 'Electronics',
      products: ['Laptop', 'Phone', 'Tablet']
    },
    {
      id: 2,
      name: 'Clothing',
      products: ['Shirt', 'Pants', 'Shoes']
    }
  ];

  return (
    <div className="text-gray-50">
      {categories.map(category => (
        <div key={category.id} className="py-2">
          <h2>{category.name}</h2>
          <ul className="ml-2">
            {category.products.map((product, index) => (
              <li key={index}>{product}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default NestedMapCategoryList;