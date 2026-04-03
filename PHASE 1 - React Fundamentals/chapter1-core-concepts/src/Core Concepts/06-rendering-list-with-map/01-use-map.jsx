// Why use .map()
// In React, you often need to display array of data as UI elements.

// Bad way - repetitive
// function ProductList() {
//   return (
//     <div>
//       <div>Product 1</div>
//       <div>Product 2</div>
//       <div>Product 3</div>
//       {/* What if you have 100 products */}
//     </div>
//   );
// }

// Good way - dynamic with .map()
function ProductList() {
  const products = ['Product 1', 'Product 2', 'Product 3'];

  return (
    <div>
      {products.map((product) => (
        <div>{product}</div>
      ))}
    </div>
  );
}

export default ProductList;