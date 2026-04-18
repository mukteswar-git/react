// 2. Complex Calculation

import { useMemo } from "react";

const ProductCalculator = ({ products, taxRate, discount }) => {
  const summary = useMemo(() => {
    const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const discountAmount = subtotal * (discount / 100);
    const afterDiscount = subtotal - discountAmount;
    const tax = afterDiscount * (taxRate / 100);
    const total = afterDiscount + tax;

    return { subtotal, discountAmount, tax, total };
  }, [products, taxRate, discount]);

  return (
    <div>
      <p>Subtotal: ${summary.subtotal.toFixed}</p>
      <p>Discount: -${summary.discountAmount.toFixed(2)}</p>
      <p>Tax: ${summary.tax.toFixed(2)}</p>
      <p>Total: ${summary.total.toFixed}</p>
    </div>
  );
};

export default ProductCalculator;
