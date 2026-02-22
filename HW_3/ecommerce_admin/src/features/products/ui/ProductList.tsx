import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from 'entities/product/model/types';
import { ProductCard } from 'entities/product/ui/ProductCard';
import { Loader } from 'shared/ui/Loader';
import { ErrorMessage } from 'shared/ui/ErrorMessage';
import styles from './ProductList.module.css';

interface ProductListProps {
  products: Product[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export const ProductList = memo<ProductListProps>(function ProductList({
  products,
  isLoading,
  isError,
  onRetry,
}) {
  const { t } = useTranslation();

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage message={t('products.error')} onRetry={onRetry} />;
  if (!products || products.length === 0) {
    return <p className={styles.empty}>{t('products.noProducts')}</p>;
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
});
