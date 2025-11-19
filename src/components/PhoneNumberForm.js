import React from 'react';
import { Phone } from 'lucide-react';
import ErrorMessage from './ErrorMessage';

/**
 * Component form nhập số điện thoại
 */
export default function PhoneNumberForm({
  phoneNumbers,
  setPhoneNumbers,
  onSubmit,
  isLoading,
  error
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Phone Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 rounded-full p-6">
              <Phone className="w-12 h-12 text-blue-600" strokeWidth={2} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-3">
            Tool Phân Tích Số Sim
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Nhập các số sim cần phân tích (mỗi số một dòng)
          </p>

          {/* Form */}
          <form onSubmit={onSubmit}>
            <textarea
              value={phoneNumbers}
              onChange={(e) => setPhoneNumbers(e.target.value)}
              placeholder="0933253456"
              rows={10}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 text-lg"
            />

            {/* Error Message */}
            <ErrorMessage message={error} />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center text-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Phân Tích Sim
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
