import React, { useState, useMemo } from 'react';
import { analyzePhoneNumbers } from './services/simAnalysisService';
import { PhoneNumberForm, FilterBar, ResultsTable } from './components';
import {
  getNetworkProvider,
  getPhonePrefix,
  containsAvoidChars,
  containsRequiredChars,
  containsSaoCat
} from './utils/phoneUtils';

export default function App() {
  // State for phone numbers input
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  // State cho các bộ lọc
  const [filters, setFilters] = useState({
    nhaMang: '',
    dauSo: '',
    saoCat: '',
    tranh: '',
    chua: ''
  });

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Split phone numbers by line and filter empty lines
      const numbers = phoneNumbers
        .split('\n')
        .map(num => num.trim())
        .filter(num => num.length > 0);

      if (numbers.length === 0) {
        setError('Vui lòng nhập ít nhất một số điện thoại');
        setIsLoading(false);
        return;
      }

      // Call API using service
      const response = await analyzePhoneNumbers(numbers);
      // Extract the data array from the response
      setResults(response.data || []);
    } catch (err) {
      if (err.message === 'CORS_ERROR') {
        setError('Không thể kết nối đến API. Lỗi CORS hoặc mạng. Kiểm tra: (1) API có cho phép CORS không? (2) URL API có đúng không? (3) Kết nối mạng?');
      } else {
        setError(`Lỗi: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setPhoneNumbers('');
    setError('');
  };

  const handleResetFilters = () => {
    setFilters({
      nhaMang: '',
      dauSo: '',
      saoCat: '',
      tranh: '',
      chua: ''
    });
  };

  // Filter results based on client-side filters
  const filteredResults = useMemo(() => {
    if (!results) return null;

    return results.filter(result => {
      const simNumber = result.sim_number || '';
      const luanGiai = result.luan_giai || '';

      // Filter by nhà mạng (network provider)
      if (filters.nhaMang) {
        const network = getNetworkProvider(simNumber);
        if (network !== filters.nhaMang) {
          return false;
        }
      }

      // Filter by đầu số (prefix)
      if (filters.dauSo) {
        const prefix = getPhonePrefix(simNumber);
        if (prefix !== filters.dauSo) {
          return false;
        }
      }

      // Filter by sao cát (good stars)
      if (filters.saoCat) {
        if (!containsSaoCat(luanGiai, filters.saoCat)) {
          return false;
        }
      }

      // Filter by tránh (avoid numbers)
      if (filters.tranh) {
        if (containsAvoidChars(simNumber, filters.tranh)) {
          return false;
        }
      }

      // Filter by chứa (contains numbers)
      if (filters.chua) {
        if (!containsRequiredChars(simNumber, filters.chua)) {
          return false;
        }
      }

      return true;
    });
  }, [results, filters]);

  // Show form if no results yet
  if (!results) {
    return (
      <PhoneNumberForm
        phoneNumbers={phoneNumbers}
        setPhoneNumbers={setPhoneNumbers}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  // Show results table
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Kết Quả Phân Tích Sim</h1>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Phân tích lại
          </button>
        </div>

        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        <ResultsTable
          results={filteredResults}
          totalCount={results?.length || 0}
          filteredCount={filteredResults?.length || 0}
        />
      </div>
    </div>
  );
}