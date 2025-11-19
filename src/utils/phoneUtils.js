/**
 * Utilities for phone number operations
 */

// Danh sách đầu số theo nhà mạng
const NETWORK_PREFIXES = {
  viettel: ['086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039'],
  vinaphone: ['088', '091', '094', '083', '084', '085', '081', '082'],
  mobifone: ['089', '090', '093', '070', '079', '077', '076', '078'],
  vietnamobile: ['092', '056', '058'],
  gmobile: ['099', '059']
};

/**
 * Xác định nhà mạng từ số điện thoại
 * @param {string} phoneNumber - Số điện thoại
 * @returns {string} - Tên nhà mạng (viettel, vinaphone, mobifone, vietnamobile, gmobile) hoặc ''
 */
export const getNetworkProvider = (phoneNumber) => {
  if (!phoneNumber) return '';

  // Lấy 3 số đầu
  const prefix = phoneNumber.substring(0, 3);

  for (const [network, prefixes] of Object.entries(NETWORK_PREFIXES)) {
    if (prefixes.includes(prefix)) {
      return network;
    }
  }

  return '';
};

/**
 * Lấy đầu số (3 số đầu) từ số điện thoại
 * @param {string} phoneNumber - Số điện thoại
 * @returns {string} - Đầu số (3 số đầu)
 */
export const getPhonePrefix = (phoneNumber) => {
  if (!phoneNumber) return '';
  return phoneNumber.substring(0, 3);
};

/**
 * Kiểm tra số điện thoại có chứa các ký tự cần tránh không
 * @param {string} phoneNumber - Số điện thoại
 * @param {string} avoidChars - Các ký tự cần tránh
 * @returns {boolean} - true nếu chứa ký tự cần tránh
 */
export const containsAvoidChars = (phoneNumber, avoidChars) => {
  if (!avoidChars || !phoneNumber) return false;

  // Loại bỏ khoảng trắng
  const cleanAvoidChars = avoidChars.replace(/\s/g, '');

  // Kiểm tra từng ký tự cần tránh
  for (const char of cleanAvoidChars) {
    if (phoneNumber.includes(char)) {
      return true;
    }
  }

  return false;
};

/**
 * Kiểm tra số điện thoại có chứa các ký tự cần tìm không
 * @param {string} phoneNumber - Số điện thoại
 * @param {string} containChars - Các ký tự cần chứa
 * @returns {boolean} - true nếu chứa ký tự cần tìm
 */
export const containsRequiredChars = (phoneNumber, containChars) => {
  if (!containChars || !phoneNumber) return false;

  // Loại bỏ khoảng trắng
  const cleanContainChars = containChars.replace(/\s/g, '');

  // Kiểm tra xem có chứa chuỗi con không
  return phoneNumber.includes(cleanContainChars);
};

/**
 * Kiểm tra luận giải có chứa sao cát cần tìm không
 * @param {string} luanGiai - Luận giải
 * @param {string} saoCat - Sao cát cần tìm
 * @returns {boolean} - true nếu chứa sao cát
 */
export const containsSaoCat = (luanGiai, saoCat) => {
  if (!saoCat || !luanGiai) return false;

  const saoCatMap = {
    'sinh_khi': 'Sinh Khí',
    'thien_y': 'Thiên Y',
    'dien_nien': 'Diên Niên',
    'phuc_vi': 'Phục Vị'
  };

  const saoCatText = saoCatMap[saoCat];
  return luanGiai.includes(saoCatText);
};
