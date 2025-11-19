import React from 'react';

/**
 * Component bảng hiển thị kết quả phân tích
 */
export default function ResultsTable({ results, totalCount = 0, filteredCount = 0 }) {
  if (!results || results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 text-lg">
          {totalCount > 0
            ? `Không tìm thấy kết quả phù hợp với bộ lọc (Tổng: ${totalCount} sim)`
            : 'Không có kết quả nào'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header with count */}
      {totalCount > 0 && (
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <p className="text-sm text-gray-700">
            Hiển thị <span className="font-semibold text-blue-600">{filteredCount}</span> / {totalCount} sim
            {filteredCount !== totalCount && (
              <span className="ml-2 text-gray-500">(đã lọc)</span>
            )}
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-sm">
              Số Sim
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-sm">
              Điểm SIM
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-sm">
              Luận Giải
            </th>
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-sm">
              Kết luận
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 text-sm">
                {result.sim_number}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm">
                {result.diem_bat_cuc}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm">
                {result.luan_giai || '-'}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-sm">
                {result.ket_luan || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
