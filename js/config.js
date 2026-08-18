/**
 * Cấu hình dữ liệu các bước cho 2 loại phiếu khám khúc xạ
 * Bổ sung options chọn nhanh cho các bước Skiascopy
 */

const FORMS_CONFIG = {
  chuQuan: {
    id: 'chuQuan',
    name: 'Phiếu Thực Hành Chủ Quan',
    shortName: 'Chủ Quan',
    icon: '📋',
    steps: [
      { id: 'step_1', label: 'Đặt +1.00 :', placeholderMP: 'Nhập MP...', placeholderMT: 'Nhập MT...' },
      { id: 'step_2', label: 'CT cầu sau đặt +1.00 :', placeholderMP: 'Nhập MP...', placeholderMT: 'Nhập MT...' },
      { id: 'step_3', label: 'Khảo sát đồng hồ :', placeholderMP: 'Nhập MP...', placeholderMT: 'Nhập MT...' },
      { id: 'step_4', label: 'Nhìn được đồng hồ :', placeholderMP: 'Nhập MP...', placeholderMT: 'Nhập MT...' },
      { id: 'step_5', label: 'CT cầu sau hạ TL nhìn đồng hồ :', placeholderMP: 'Nhập MP...', placeholderMT: 'Nhập MT...' },
      { id: 'step_6', label: 'Không nhìn được đồng hồ :', placeholderMP: 'Nhập MP...', placeholderMT: 'Nhập MT...' },
      { id: 'step_7', label: 'CT cầu sau khi tăng TL nhìn ĐH :', placeholderMP: 'Nhập MP...', placeholderMT: 'Nhập MT...' },
      { id: 'step_8', label: 'Xác định trục loạn thị :', placeholderMP: 'Nhập MP...', placeholderMT: 'Nhập MT...' },
      { id: 'step_9', label: 'CT cầu trụ sau khi - đ.chỉnh trụ :', placeholderMP: 'Nhập MP...', placeholderMT: 'Nhập MT...' },
      { id: 'step_10', label: 'Xác định thị lực hiện tại :', placeholderMP: 'Nhập MP...', placeholderMT: 'Nhập MT...' },
      { id: 'step_11', label: 'CT cầu trụ-sau khi đ.chỉnh độ cầu :', placeholderMP: 'Nhập MP...', placeholderMT: 'Nhập MT...' },
      { id: 'step_12', label: 'Hiệu chỉnh trụ chéo bằng JCC :', placeholderMP: 'Nhập MP...', placeholderMT: 'Nhập MT...' },
      { id: 'step_13', label: 'CT kính sau điều chỉnh trục :', placeholderMP: 'Nhập MP...', placeholderMT: 'Nhập MT...' },
      { id: 'step_14', label: 'CT kính sau điều chỉnh công suất :', placeholderMP: 'Nhập MP...', placeholderMT: 'Nhập MT...' },
      { id: 'step_15', label: 'CT kính sau BVS cuối :', placeholderMP: 'Nhập MP...', placeholderMT: 'Nhập MT...' },
      { id: 'step_16', label: 'CT kính sau cân bằng 2 mắt :', placeholderMP: 'Nhập MP...', placeholderMT: 'Nhập MT...' },
      { id: 'step_17', label: 'CT KHÚC XẠ MẮT :', placeholderMP: 'Nhập MP...', placeholderMT: 'Nhập MT...' }
    ]
  },
  skiascopy: {
    id: 'skiascopy',
    name: 'Phiếu Thực Hành Skiascopy',
    shortName: 'Skiascopy',
    icon: '👁️',
    steps: [
      // PHẦN 1: KHẢO SÁT KINH TUYẾN 180
      { 
        id: 'skia_1', 
        group: 'KHẢO SÁT KINH TUYẾN 180', 
        label: 'Chiều di chuyển', 
        options: ['Thuận', 'Ngược'],
        placeholderMP: 'Thuận / Ngược...', 
        placeholderMT: 'Thuận / Ngược...' 
      },
      { 
        id: 'skia_2', 
        group: 'KHẢO SÁT KINH TUYẾN 180', 
        label: 'Mức độ sáng', 
        options: ['Sáng', 'Mờ'],
        placeholderMP: 'Sáng / Mờ...', 
        placeholderMT: 'Sáng / Mờ...' 
      },
      { 
        id: 'skia_3', 
        group: 'KHẢO SÁT KINH TUYẾN 180', 
        label: 'Tốc độ', 
        options: ['Nhanh', 'Chậm'],
        placeholderMP: 'Nhanh / Chậm...', 
        placeholderMT: 'Nhanh / Chậm...' 
      },
      { 
        id: 'skia_4', 
        group: 'KHẢO SÁT KINH TUYẾN 180', 
        label: 'Độ rộng', 
        options: ['Rộng', 'Hẹp'],
        placeholderMP: 'Rộng / Hẹp...', 
        placeholderMT: 'Rộng / Hẹp...' 
      },

      // PHẦN 2: KHẢO SÁT KINH TUYẾN 90
      { 
        id: 'skia_5', 
        group: 'KHẢO SÁT KINH TUYẾN 90', 
        label: 'Chiều di chuyển', 
        options: ['Thuận', 'Ngược'],
        placeholderMP: 'Thuận / Ngược...', 
        placeholderMT: 'Thuận / Ngược...' 
      },
      { 
        id: 'skia_6', 
        group: 'KHẢO SÁT KINH TUYẾN 90', 
        label: 'Mức độ sáng', 
        options: ['Sáng', 'Mờ'],
        placeholderMP: 'Sáng / Mờ...', 
        placeholderMT: 'Sáng / Mờ...' 
      },
      { 
        id: 'skia_7', 
        group: 'KHẢO SÁT KINH TUYẾN 90', 
        label: 'Tốc độ', 
        options: ['Nhanh', 'Chậm'],
        placeholderMP: 'Nhanh / Chậm...', 
        placeholderMT: 'Nhanh / Chậm...' 
      },
      { 
        id: 'skia_8', 
        group: 'KHẢO SÁT KINH TUYẾN 90', 
        label: 'Độ rộng', 
        options: ['Rộng', 'Hẹp'],
        placeholderMP: 'Rộng / Hẹp...', 
        placeholderMT: 'Rộng / Hẹp...' 
      },

      // PHẦN 3: KINH TUYẾN 1
      { id: 'skia_9', group: 'KINH TUYẾN 1', label: 'Kinh tuyến 1', placeholderMP: 'Nhập KT1...', placeholderMT: 'Nhập KT1...' },

      // PHẦN 4: ĐIỂM TRUNG HÒA
      { id: 'skia_10', group: 'ĐIỂM TRUNG HÒA', label: 'Điểm trung hòa', placeholderMP: 'Nhập điểm trung hòa...', placeholderMT: 'Nhập điểm trung hòa...' },
      { id: 'skia_11', group: 'ĐIỂM TRUNG HÒA', label: 'Kinh tuyến 1', placeholderMP: 'Nhập KT1...', placeholderMT: 'Nhập KT1...' },
      { id: 'skia_12', group: 'ĐIỂM TRUNG HÒA', label: 'Kính cầu trung hòa', placeholderMP: 'Nhập kính cầu...', placeholderMT: 'Nhập kính cầu...' },
      { id: 'skia_13', group: 'ĐIỂM TRUNG HÒA', label: 'Kinh tuyến 2', placeholderMP: 'Nhập KT2...', placeholderMT: 'Nhập KT2...' },
      { id: 'skia_14', group: 'ĐIỂM TRUNG HÒA', label: 'Kính trụ trung hòa', placeholderMP: 'Nhập kính trụ...', placeholderMT: 'Nhập kính trụ...' },

      // PHẦN 5: KẾT LUẬN
      { id: 'skia_15', group: 'KẾT LUẬN', label: 'CT CẦU TRỤ TRUNG HÒA', placeholderMP: 'Nhập CT cầu trụ...', placeholderMT: 'Nhập CT cầu trụ...' },
      { id: 'skia_16', group: 'KẾT LUẬN', label: 'ĐỘ KHÚC XẠ CỦA MẮT', placeholderMP: 'Nhập độ khúc xạ...', placeholderMT: 'Nhập độ khúc xạ...' }
    ]
  }
};
