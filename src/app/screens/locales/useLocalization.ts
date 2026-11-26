import { useCallback } from 'react';

import { useLanguage } from './useLanguage';
import { getUILabels } from './uiLabels';
import { getLocalizedField } from './localizedField';

export function useLocalization() {
  const lang = useLanguage();

  const labels = getUILabels(lang);

  const tField = useCallback(
    (
      data: object | null | undefined,
      field: string,
      fallback = '',
    ) => {
      return getLocalizedField(
        data,
        field,
        lang,
        fallback,
      );
    },
    [lang],
  );

  return {
    lang,
    labels,
    tField,
  };
}