import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Product } from 'entities/product/model/types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo<ProductCardProps>(function ProductCard({
  product,
}) {
  const { t } = useTranslation();

  return (
    <Link to={`/products/${product.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={product.thumbnail}
          alt={product.title}
          className={styles.image}
          loading="lazy"
        />
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{product.title}</h3>
        <span className={styles.category}>{product.category}</span>
        <div className={styles.footer}>
          <span className={styles.price}>${product.price}</span>
          <span className={styles.rating}>
            {t('products.rating')}: {product.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
});
