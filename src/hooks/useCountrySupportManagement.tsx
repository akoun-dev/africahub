
import { useEffect } from 'react';
import { useCountryDataLoader } from './countrySupportManagement/useCountryDataLoader';
import { useCountryStatusOperations } from './countrySupportManagement/useCountryStatusOperations';
import { useCountryGroupOperations } from './countrySupportManagement/useCountryGroupOperations';
import { useCountryImportExport } from './countrySupportManagement/useCountryImportExport';

export * from './countrySupportManagement/types';

export const useCountrySupportManagement = () => {
  const { countries, groups, loading, loadCountriesSupport } = useCountryDataLoader();
  const { updateCountryStatus, bulkUpdateStatus } = useCountryStatusOperations();
  const { createCountryGroup } = useCountryGroupOperations();
  const { exportCountryConfigurations, importCountryConfigurations } = useCountryImportExport();

  useEffect(() => {
    loadCountriesSupport();
  }, [loadCountriesSupport]);

  return {
    countries,
    groups,
    loading,
    updateCountryStatus,
    bulkUpdateStatus,
    createCountryGroup,
    exportCountryConfigurations,
    importCountryConfigurations,
    refreshData: loadCountriesSupport
  };
};
