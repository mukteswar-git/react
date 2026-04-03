import ProductCard from "./6 - Practical Props";

function ProductList() {
  const handleAddToCart = (productName) => {
    alert(`Added ${productName} to cart`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <ProductCard
        image="laptop.png"
        name="Laptop"
        price={999}
        inStock={true}
        onAddtoCart={() => handleAddToCart('Laptop')}
      />

      <ProductCard 
        image="phone.png"
        name="Phone"
        price={699}
        inStock={false}
        onAddToCart={() => handleAddToCart('Phone')}
      />
    </div>
  )
}

export default ProductList;