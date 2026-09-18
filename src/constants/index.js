export const PROVINCES = [
  'An Giang',
  'Bạc Liêu',
  'Bến Tre',
  'Cà Mau',
  'Cần Thơ',
  'Đồng Tháp',
  'Hậu Giang',
  'Kiên Giang',
  'Long An',
  'Sóc Trăng',
  'Tiền Giang',
  'Trà Vinh',
  'Vĩnh Long',
];

export const TOUR_TYPES = [
  { value: '', label: 'Tất cả loại tour' },
  { value: 'relaxation', label: 'Nghỉ dưỡng' },
  { value: 'nature', label: 'Khám phá thiên nhiên' },
  { value: 'culture', label: 'Văn hóa lịch sử' },
  { value: 'adventure', label: 'Du lịch mạo hiểm' },
];

export const TOUR_DURATIONS = [
  { value: '', label: 'Tất cả thời gian' },
  { value: '1 ngày', label: '1 Ngày' },
  { value: '2 ngày 1 đêm', label: '2 Ngày 1 Đêm' },
  { value: '3 ngày 2 đêm', label: '3 Ngày 2 Đêm' },
  { value: '4 ngày 3 đêm', label: '4 Ngày 3 Đêm' },
  { value: '5 ngày', label: 'Trên 4 Ngày' },
];

export const SORT_OPTIONS = [
  { value: '-featured -createdAt', label: 'Mặc định' },
  { value: 'price', label: 'Giá thấp đến cao' },
  { value: '-price', label: 'Giá cao đến thấp' },
  { value: '-rating', label: 'Đánh giá cao nhất' },
  { value: '-createdAt', label: 'Mới nhất' },
];

export const CATEGORIES = [
  { value: 'dia-danh', label: 'Địa danh' },
  { value: 'am-thuc', label: 'Ẩm thực' },
  { value: 'le-hoi', label: 'Lễ hội' },
  { value: 'kinh-nghiem', label: 'Kinh nghiệm' },
];

export const SHARED_IMAGES = {
  tour: '/images/shared/tour-shared.svg',
  hotel: '/images/shared/hotel-shared.svg',
  guide: '/images/shared/guide-shared.svg',
};

export const BOOKING_STATUS = {
  pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Đã duyệt', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
  completed: { label: 'Hoàn thành', color: 'bg-blue-100 text-blue-800' },
};

export const PAYMENT_STATUS = {
  unpaid: { label: 'Chưa thanh toán', color: 'bg-orange-100 text-orange-800' },
  paid: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800' },
  refunded: { label: 'Đã hoàn tiền', color: 'bg-slate-100 text-slate-800' },
};

export function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('vi-VN');
}
