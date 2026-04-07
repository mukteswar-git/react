// Real-World Example: Shopping Cart

import { useState } from "react";

function Product({ product, onAddToCart }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => onAddToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}

function ProductList({ products, onAddToCart }) {
  return (
    <div>
      {products.map(product => (
        <Product
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

function Cart({ items, onRemoveFromCart }) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h2>Shopping Cart</h2>
      {items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item.name} - ${item.price}
                <button onClick={() => onRemoveFromCart(index)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <p>Total: ${total.toFixed(2)}</p>
        </>
      )}
    </div>
  );
}

function ShoppingApp() {
  const [products] = useState([
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 25 },
    { id: 3, name: 'Keyboard', price: 75 }
  ]);

  const [cartItems, setCartItems] = useState([]);

  const handleAddToCart = (product) => {
    setCartItems(prev => [...prev, product]);
  };

  const handleRemoveFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <ProductList 
        products={products}
        onAddToCart={handleAddToCart}
      />
      <Cart 
        items={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
      />
    </div>
  );
}