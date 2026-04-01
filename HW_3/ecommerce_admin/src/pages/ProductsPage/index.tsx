import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from 'app/store/hooks';
import { selectPageSize } from 'features/settings/model/settingsSlice';
import { useGetProductsQuery, useSearchProductsQuery } from 'features/products/api/productsApi';
import { ProductSearch } from 'features/products/ui/ProductSearch';
import { ProductList } from 'features/products/ui/ProductList';
import { Pagination } from 'features/products/ui/Pagination';
import styles from './ProductsPage.module.css';

const ProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageSize = useAppSelector(selectPageSize);

  const searchQuery = searchParams.get('q') ?? '';
  const skip = Number(searchParams.get('skip') ?? '0');

  const [search, setSearch] = useState(searchQuery);

  const isSearching = search.trim().length > 0;

  const productsResult = useGetProductsQuery(
    { limit: pageSize, skip },
    { skip: isSearching }
  );

  const searchResult = useSearchProductsQuery(
    { q: search, limit: pageSize, skip },
    { skip: !isSearching }
  );

  const activeResult = isSearching ? searchResult : productsResult;

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      const params: Record<string, string> = {};
      if (value) params.q = value;
      setSearchParams(params);
    },
    [setSearchParams]
  );

  const handlePageChange = useCallback(
    (newSkip: number) => {
      const params: Record<string, string> = { skip: String(newSkip) };
      if (search) params.q = search;
      setSearchParams(params);
    },
    [search, setSearchParams]
  );

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('products.title')}</h1>
      <div className={styles.searchRow}>
        <ProductSearch value={search} onChange={handleSearchChange} />
      </div>
      <ProductList
        products={activeResult.data?.products}
        isLoading={activeResult.isLoading}
        isError={activeResult.isError}
        onRetry={activeResult.refetch}
      />
      {activeResult.data && (
        <Pagination
          total={activeResult.data.total}
          limit={pageSize}
          skip={skip}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ProductsPage;
