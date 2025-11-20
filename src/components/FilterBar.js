import React from 'react';

/**
 * Component thanh bộ lọc kết quả
 */
export default function FilterBar({ filters, onFilterChange, onResetFilters }) {
  // Check if any filter is active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex gap-3 items-end">
        {/* Nhà mạng */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nhà mạng
          </label>
          <select
            value={filters.nhaMang}
            onChange={(e) => onFilterChange('nhaMang', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value="viettel">Viettel</option>
            <option value="vinaphone">Vinaphone</option>
            <option value="mobifone">Mobifone</option>
            <option value="vietnamobile">Vietnamobile</option>
            <option value="gmobile">Gmobile</option>
          </select>
        </div>

        {/* Đầu số */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đầu số
          </label>
          <select
            value={filters.dauSo}
            onChange={(e) => onFilterChange('dauSo', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value="086">086</option>
            <option value="096">096</option>
            <option value="097">097</option>
            <option value="098">098</option>
            <option value="032">032</option>
            <option value="033">033</option>
            <option value="034">034</option>
            <option value="035">035</option>
            <option value="036">036</option>
            <option value="037">037</option>
            <option value="038">038</option>
            <option value="039">039</option>
          </select>
        </div>

        {/* Trạng thái */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <select
            value={filters.trangThai}
            onChange={(e) => onFilterChange('trangThai', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value="mua">Mua</option>
          </select>
        </div>

        {/* Sao cát */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sao cát
          </label>
          <select
            value={filters.saoCat}
            onChange={(e) => onFilterChange('saoCat', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value="sinh_khi">Sinh Khí</option>
            <option value="thien_y">Thiên Y</option>
            <option value="dien_nien">Diên Niên</option>
            <option value="phuc_vi">Phục Vị</option>
          </select>
        </div>

        {/* Tránh */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tránh
          </label>
          <input
            type="text"
            value={filters.tranh}
            onChange={(e) => onFilterChange('tranh', e.target.value)}
            placeholder="Nhập số cần tránh"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Chứa */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chứa
          </label>
          <input
            type="text"
            value={filters.chua}
            onChange={(e) => onFilterChange('chua', e.target.value)}
            placeholder="Nhập số cần tìm"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Reset Filters Button */}
        {onResetFilters && (
          <div>
            <button
              onClick={onResetFilters}
              disabled={!hasActiveFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              title="Xóa tất cả bộ lọc"
            >
              <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Đặt lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
