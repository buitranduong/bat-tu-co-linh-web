import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
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
    trangThai: '',
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
      trangThai: '',
      saoCat: '',
      tranh: '',
      chua: ''
    });
  };

  const handleExportExcel = () => {
    if (!filteredResults || filteredResults.length === 0) {
      alert('Không có dữ liệu để xuất');
      return;
    }

    // Prepare data for Excel
    const excelData = filteredResults.map((result, index) => ({
      'STT': index + 1,
      'Số SIM': result.sim_number || '',
      'Điểm Bát Cục': result.diem_bat_cuc || 0,
      'Điểm Dân Gian': result.diem_dan_gian || 0,
      'Luận Giải': result.luan_giai || '',
      'Kết Luận': result.ket_luan || '',
      'Trạng Thái': result.is_valid ? 'Mua' : 'Không mua',
      'Ghi Chú': result.error_message || ''
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    ws['!cols'] = [
      { wch: 5 },  // STT
      { wch: 15 }, // Số SIM
      { wch: 12 }, // Điểm Bát Cục
      { wch: 12 }, // Điểm Dân Gian
      { wch: 50 }, // Luận Giải
      { wch: 40 }, // Kết Luận
      { wch: 12 }, // Trạng Thái
      { wch: 30 }  // Ghi Chú
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Kết Quả Phân Tích');

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `Phan_Tich_Sim_${timestamp}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
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

      // Filter by trạng thái (status)
      if (filters.trangThai) {
        if (filters.trangThai === 'mua' && !result.is_valid) {
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
          <div className="flex gap-3">
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Xuất Excel
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Phân tích lại
            </button>
          </div>
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