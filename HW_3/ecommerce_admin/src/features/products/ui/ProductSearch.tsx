import React, { memo, useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'shared/ui/Input';

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProductSearch = memo<ProductSearchProps>(function ProductSearch({
  value,
  onChange,
}) {
  const { t } = useTranslation();
  const [local, setLocal] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (local !== value) onChange(local);
    }, 400);
    return () => clearTimeout(timer);
  }, [local, value, onChange]);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocal(e.target.value);
    },
    []
  );

  return (
    <Input
      id="product-search"
      placeholder={t('products.search')}
      value={local}
      onChange={handleChange}
    />
  );
});
