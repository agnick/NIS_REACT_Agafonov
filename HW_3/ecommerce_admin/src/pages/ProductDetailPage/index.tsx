import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetProductByIdQuery } from 'features/products/api/productsApi';
import { Loader } from 'shared/ui/Loader';
import { ErrorMessage } from 'shared/ui/ErrorMessage';
import { Button } from 'shared/ui/Button';
import styles from './ProductDetailPage.module.css';

const ProductDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useGetProductByIdQuery(Number(id!));

  if (isLoading) return <Loader />;
  if (isError || !product) {
    return <ErrorMessage message={t('products.error')} onRetry={refetch} />;
  }

  return (
    <div className={styles.page}>
      <Link to="/products" className={styles.back}>
        &larr; {t('products.backToList')}
      </Link>

      <div className={styles.grid}>
        <div className={styles.imageSection}>
          <img
            src={product.thumbnail}
            alt={product.title}
            className={styles.mainImage}
          />
          {product.images.length > 1 && (
            <div className={styles.thumbs}>
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.title} ${idx + 1}`}
                  className={styles.thumb}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.info}>
          <h1 className={styles.title}>{product.title}</h1>
          <span className={styles.category}>{product.category}</span>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>{t('products.price')}</span>
              <span className={styles.price}>${product.price}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>{t('products.rating')}</span>
              <span>{product.rating.toFixed(1)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>{t('products.stock')}</span>
              <span>{product.stock}</span>
            </div>
            {product.brand && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>{t('products.brand')}</span>
                <span>{product.brand}</span>
              </div>
            )}
          </div>

          <div className={styles.descBlock}>
            <h3 className={styles.descTitle}>{t('products.description')}</h3>
            <p className={styles.desc}>{product.description}</p>
          </div>

          <Link to="/products">
            <Button variant="secondary">{t('products.backToList')}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
