/**
 * Module quản lý lưu trữ phiên làm việc bằng sessionStorage
 * Dữ liệu tồn tại trong phiên làm việc của trình duyệt, đóng tab/trình duyệt sẽ tự dọn sạch
 */

const STORAGE_KEY = 'OPTOMETRY_PRACTICE_CASES';
const ACTIVE_ID_KEY = 'OPTOMETRY_ACTIVE_CASE_ID';

const StorageManager = {
  // Lấy danh sách tất cả các ca
  getCases() {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Lỗi khi đọc sessionStorage:', e);
      return [];
    }
  },

  // Lưu danh sách ca
  saveCases(cases) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    } catch (e) {
      console.error('Lỗi khi ghi sessionStorage:', e);
    }
  },

  // Lấy ID ca đang chọn
  getActiveCaseId() {
    return sessionStorage.getItem(ACTIVE_ID_KEY) || null;
  },

  // Đặt ID ca đang chọn
  setActiveCaseId(id) {
    if (id) {
      sessionStorage.setItem(ACTIVE_ID_KEY, id);
    } else {
      sessionStorage.removeItem(ACTIVE_ID_KEY);
    }
  },

  // Lấy thông tin một ca theo ID
  getCaseById(id) {
    const cases = this.getCases();
    return cases.find(c => c.id === id) || null;
  },

  // Tạo mới một ca khám
  createCase(patientName) {
    const cases = this.getCases();
    const newCase = {
      id: 'case_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      patientName: patientName.trim() || 'Bệnh nhân chưa đặt tên',
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }),
      forms: {
        chuQuan: {},
        skiascopy: {}
      }
    };
    cases.unshift(newCase);
    this.saveCases(cases);
    this.setActiveCaseId(newCase.id);
    return newCase;
  },

  // Cập nhật giá trị MP / MT của 1 bước
  updateStepData(caseId, formType, stepId, mpValue, mtValue) {
    const cases = this.getCases();
    const caseIndex = cases.findIndex(c => c.id === caseId);
    if (caseIndex === -1) return null;

    if (!cases[caseIndex].forms) {
      cases[caseIndex].forms = { chuQuan: {}, skiascopy: {} };
    }
    if (!cases[caseIndex].forms[formType]) {
      cases[caseIndex].forms[formType] = {};
    }

    cases[caseIndex].forms[formType][stepId] = {
      mp: mpValue || '',
      mt: mtValue || ''
    };

    this.saveCases(cases);
    return cases[caseIndex];
  },

  // Đếm số bước đã điền của 1 form trong ca
  countFilledSteps(caseObj, formType) {
    if (!caseObj || !caseObj.forms || !caseObj.forms[formType]) return 0;
    const formData = caseObj.forms[formType];
    let count = 0;
    Object.values(formData).forEach(step => {
      if ((step.mp && step.mp.trim() !== '') || (step.mt && step.mt.trim() !== '')) {
        count++;
      }
    });
    return count;
  },

  // Xóa 1 ca
  deleteCase(id) {
    let cases = this.getCases();
    cases = cases.filter(c => c.id !== id);
    this.saveCases(cases);
    if (this.getActiveCaseId() === id) {
      this.setActiveCaseId(null);
    }
    return cases;
  },

  // Xóa tất cả các ca
  clearAll() {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(ACTIVE_ID_KEY);
  }
};
