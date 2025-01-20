export const formatTime = (seconds: number): string => {
    // Làm tròn giá trị thời gian tổng thể (seconds)
    const roundedSeconds = Math.floor(seconds); // Chỉ lấy phần nguyên của seconds
  
    // Nếu thời gian nhỏ hơn 60 giây, chỉ cần trả về số giây
    if (roundedSeconds < 60) {
      return `${roundedSeconds}s`;
    }
  
    // Làm tròn giá trị giờ, phút, giây (không có thập phân)
    const hours = Math.floor(roundedSeconds / 3600);
    const minutes = Math.floor((roundedSeconds % 3600) / 60);
    const remainingSeconds = Math.floor(roundedSeconds % 60); // Làm tròn giây
  
    let formatted = '';
  
    // Nếu có giờ, thêm vào chuỗi kết quả
    if (hours > 0) {
      formatted += `${hours}h`;
    }
  
    // Nếu có phút, thêm vào chuỗi kết quả
    if (minutes > 0) {
      formatted += `${minutes}m `;
    }
  
    // Nếu có giây hoặc không có giờ và phút, hiển thị giây
    if (remainingSeconds > 0 || formatted === '') {
      formatted += `${remainingSeconds}s`;
    }
  
    return formatted.trim(); // Loại bỏ các khoảng trắng thừa
  };
  