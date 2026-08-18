/**
 * Logic điều khiển chính của Ứng Dụng Phiếu Khám Khúc Xạ Mắt (Mobile First)
 */

const App = {
  // Trạng thái ứng dụng
  state: {
    currentScreen: 'screen-home',
    activeCase: null,
    activeFormType: 'chuQuan', // 'chuQuan' | 'skiascopy'
    currentStepIndex: 0,
    activeInputId: 'input-mp' // 'input-mp' | 'input-mt' | 'input-custom-mp' | 'input-custom-mt'
  },

  // Khởi tạo ứng dụng
  init() {
    this.bindEvents();
    this.renderCaseList();
    this.showScreen('screen-home');
  },

  // Gắn các sự kiện
  bindEvents() {
    // 1. Màn hình Trang Chủ
    const formStart = document.getElementById('form-start-case');
    if (formStart) {
      formStart.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleStartNewCase();
      });
    }

    const btnClearAll = document.getElementById('btn-clear-all-cases');
    if (btnClearAll) {
      btnClearAll.addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn xóa tất cả các ca nháp trong phiên này?')) {
          StorageManager.clearAll();
          this.renderCaseList();
        }
      });
    }

    // 2. Màn hình Chọn Loại Form
    document.getElementById('btn-select-chuquan')?.addEventListener('click', () => {
      this.openForm('chuQuan');
    });

    document.getElementById('btn-select-skiascopy')?.addEventListener('click', () => {
      this.openForm('skiascopy');
    });

    document.getElementById('btn-back-to-home')?.addEventListener('click', () => {
      this.renderCaseList();
      this.showScreen('screen-home');
    });

    document.getElementById('btn-view-summary-from-choose')?.addEventListener('click', () => {
      this.openFullFormView();
    });

    // 3. Màn hình Điền Step - Lắng nghe focus
    const inputMP = document.getElementById('input-mp');
    const inputMT = document.getElementById('input-mt');
    const inputCustomMP = document.getElementById('input-custom-mp');
    const inputCustomMT = document.getElementById('input-custom-mt');

    inputMP?.addEventListener('focus', () => {
      this.state.activeInputId = 'input-mp';
      this.highlightActiveInput();
    });

    inputMT?.addEventListener('focus', () => {
      this.state.activeInputId = 'input-mt';
      this.highlightActiveInput();
    });

    inputCustomMP?.addEventListener('focus', () => {
      this.state.activeInputId = 'input-custom-mp';
      this.highlightActiveInput();
    });

    inputCustomMT?.addEventListener('focus', () => {
      this.state.activeInputId = 'input-custom-mt';
      this.highlightActiveInput();
    });

    // Tự động lưu khi gõ bàn phím vật lý
    inputMP?.addEventListener('input', () => this.autoSaveCurrentStep());
    inputMT?.addEventListener('input', () => this.autoSaveCurrentStep());
    inputCustomMP?.addEventListener('input', () => this.autoSaveCurrentStep());
    inputCustomMT?.addEventListener('input', () => this.autoSaveCurrentStep());

    // Nút chuyển bước tiếp theo (Đã tách riêng)
    document.getElementById('btn-next-step')?.addEventListener('click', () => {
      this.handleNextStep();
    });

    // Nút quay lại bước trước
    document.getElementById('btn-prev-step')?.addEventListener('click', () => {
      this.handlePrevStep();
    });

    // Nút xem kết quả cuối cùng từ màn hình step
    document.getElementById('btn-view-final-result')?.addEventListener('click', () => {
      this.autoSaveCurrentStep();
      this.openFullFormView();
    });

    // Nút quay lại chọn form từ màn hình step
    document.getElementById('btn-back-to-form-choice')?.addEventListener('click', () => {
      this.autoSaveCurrentStep();
      this.openChooseFormScreen();
    });

    // 4. BÀN PHÍM ẢO MÁY TÍNH KHÚC XẠ
    // Phím ký tự & số thông thường
    document.querySelectorAll('.k-btn[data-key]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const key = btn.getAttribute('data-key');
        this.insertVirtualKey(key);
      });
    });

    // Phím bước nhảy Diop thông minh (.25, .50, .75, .00)
    document.querySelectorAll('.k-btn[data-diopter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const diopterFraction = btn.getAttribute('data-diopter');
        this.handleSmartDiopter(diopterFraction);
      });
    });

    // Phím Xóa lùi Backspace
    document.getElementById('kbtn-backspace')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleBackspace();
    });

    // 5. Màn hình Form Hoàn Chỉnh
    document.getElementById('btn-back-to-stepper')?.addEventListener('click', () => {
      this.openForm(this.state.activeFormType, this.state.currentStepIndex);
    });

    document.getElementById('btn-home-from-full')?.addEventListener('click', () => {
      this.renderCaseList();
      this.showScreen('screen-home');
    });

    document.getElementById('btn-switch-full-chuquan')?.addEventListener('click', () => {
      this.state.activeFormType = 'chuQuan';
      this.renderFullFormContent();
    });

    document.getElementById('btn-switch-full-skiascopy')?.addEventListener('click', () => {
      this.state.activeFormType = 'skiascopy';
      this.renderFullFormContent();
    });
  },

  // Chuyển màn hình
  showScreen(screenId) {
    document.querySelectorAll('.app-screen').forEach(screen => {
      screen.classList.add('hidden');
    });
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.remove('hidden');
      this.state.currentScreen = screenId;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // 1. Xử lý tạo ca mới
  handleStartNewCase() {
    const input = document.getElementById('patient-name-input');
    const name = input ? input.value.trim() : '';
    if (!name) {
      alert('Vui lòng nhập tên bệnh nhân!');
      input?.focus();
      return;
    }

    const newCase = StorageManager.createCase(name);
    this.state.activeCase = newCase;
    this.openChooseFormScreen();
  },

  // Mở màn hình chọn Form
  openChooseFormScreen() {
    if (!this.state.activeCase) return;

    // Cập nhật lại ca mới nhất từ storage
    this.state.activeCase = StorageManager.getCaseById(this.state.activeCase.id);

    // Cập nhật thông tin bệnh nhân
    document.getElementById('display-patient-name-choose').textContent = this.state.activeCase.patientName;
    document.getElementById('display-case-time-choose').textContent = this.state.activeCase.createdAt;

    // Đếm số bước đã điền
    const countCQ = StorageManager.countFilledSteps(this.state.activeCase, 'chuQuan');
    const countSK = StorageManager.countFilledSteps(this.state.activeCase, 'skiascopy');

    const badgeCQ = document.getElementById('badge-cq-status');
    if (badgeCQ) {
      if (countCQ > 0) {
        badgeCQ.innerHTML = `<span class="inline-flex items-center text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">✓ Đã điền ${countCQ}/${FORMS_CONFIG.chuQuan.steps.length} bước</span>`;
      } else {
        badgeCQ.innerHTML = `<span class="text-[10px] sm:text-xs text-slate-500">Chưa điền</span>`;
      }
    }

    const badgeSK = document.getElementById('badge-sk-status');
    if (badgeSK) {
      if (countSK > 0) {
        badgeSK.innerHTML = `<span class="inline-flex items-center text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">✓ Đã điền ${countSK}/${FORMS_CONFIG.skiascopy.steps.length} mục</span>`;
      } else {
        badgeSK.innerHTML = `<span class="text-[10px] sm:text-xs text-slate-500">Chưa điền</span>`;
      }
    }

    // Nút xem kết quả tổng hợp
    const btnSummary = document.getElementById('btn-view-summary-from-choose');
    if (btnSummary) {
      if (countCQ > 0 || countSK > 0) {
        btnSummary.classList.remove('hidden');
      } else {
        btnSummary.classList.add('hidden');
      }
    }

    this.showScreen('screen-choose-form');
  },

  // Mở Form điền từng bước
  openForm(formType, stepIndex = 0) {
    this.state.activeFormType = formType;
    this.state.currentStepIndex = stepIndex;

    const formConfig = FORMS_CONFIG[formType];
    document.getElementById('current-form-title').textContent = formConfig.name;
    document.getElementById('current-patient-badge').textContent = this.state.activeCase ? this.state.activeCase.patientName : 'Khách';

    this.renderLeftStepper();
    this.loadCurrentStepData();
    this.showScreen('screen-stepper');
  },

  // Render danh sách các tab bên trái (Stepper) chia theo Area/Group
  renderLeftStepper() {
    const container = document.getElementById('left-stepper-list');
    if (!container) return;

    const formConfig = FORMS_CONFIG[this.state.activeFormType];
    const caseData = StorageManager.getCaseById(this.state.activeCase?.id);
    const formData = caseData?.forms?.[this.state.activeFormType] || {};

    container.innerHTML = '';

    let currentRenderedGroup = '';

    formConfig.steps.forEach((step, idx) => {
      // Nếu có group/area và khác group trước đó -> Render Header của Area
      if (step.group && step.group !== currentRenderedGroup) {
        currentRenderedGroup = step.group;
        const areaHeader = document.createElement('div');
        areaHeader.className = 'stepper-area-header truncate';
        areaHeader.title = currentRenderedGroup;
        areaHeader.textContent = currentRenderedGroup;
        container.appendChild(areaHeader);
      }

      const stepData = formData[step.id];
      const hasData = stepData && ((stepData.mp && stepData.mp.trim() !== '') || (stepData.mt && stepData.mt.trim() !== ''));
      const isActive = idx === this.state.currentStepIndex;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `step-tab-btn w-full text-left py-1.5 px-1.5 rounded-lg text-xs font-semibold flex items-center justify-between border ${isActive
        ? 'active bg-blue-600 text-white border-blue-600'
        : hasData
          ? 'completed bg-blue-50 text-blue-800 border-blue-200'
          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
        }`;

      // Tên bước sạch sẽ
      let cleanLabel = step.label.replace(' :', '');

      btn.innerHTML = `
        <div class="flex items-center space-x-1 min-w-0 flex-1">
          <span class="w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center rounded-full text-[9px] ${isActive ? 'bg-white text-blue-600 font-bold' : hasData ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-600'
        }">${idx + 1}</span>
          <span class="truncate text-[10.5px] sm:text-xs font-semibold leading-tight">${cleanLabel}</span>
        </div>
        ${hasData && !isActive ? '<span class="text-[9px] text-blue-600 font-bold ml-0.5">✓</span>' : ''}
      `;

      btn.addEventListener('click', () => {
        this.autoSaveCurrentStep();
        this.state.currentStepIndex = idx;
        this.renderLeftStepper();
        this.loadCurrentStepData();
      });

      container.appendChild(btn);
    });

    // Tự động cuộn đến tab đang active
    const activeBtn = container.querySelector('.step-tab-btn.active');
    if (activeBtn) {
      activeBtn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  },

  // Nạp dữ liệu của bước hiện tại vào ô MP / MT
  loadCurrentStepData() {
    const formConfig = FORMS_CONFIG[this.state.activeFormType];
    const currentStep = formConfig.steps[this.state.currentStepIndex];

    if (!currentStep) return;

    // Tiêu đề bước hiện tại
    const titleEl = document.getElementById('step-current-title');
    const groupEl = document.getElementById('step-current-group');
    const counterEl = document.getElementById('step-counter-badge');

    if (titleEl) titleEl.textContent = currentStep.label;
    if (counterEl) counterEl.textContent = `Mục ${this.state.currentStepIndex + 1}/${formConfig.steps.length}`;

    if (groupEl) {
      if (currentStep.group) {
        groupEl.innerHTML = `<span class="text-blue-600 mr-1">📂</span><span class="font-extrabold">${currentStep.group}</span>`;
        groupEl.classList.remove('hidden');
      } else {
        groupEl.classList.add('hidden');
      }
    }

    // Lấy dữ liệu từ storage
    const caseData = StorageManager.getCaseById(this.state.activeCase?.id);
    const stepVal = caseData?.forms?.[this.state.activeFormType]?.[currentStep.id] || { mp: '', mt: '' };

    const inputMP = document.getElementById('input-mp');
    const inputMT = document.getElementById('input-mt');
    const optWrapMP = document.getElementById('options-container-mp');
    const optWrapMT = document.getElementById('options-container-mt');
    const customWrapMP = document.getElementById('custom-wrap-mp');
    const customWrapMT = document.getElementById('custom-wrap-mt');
    const inputCustomMP = document.getElementById('input-custom-mp');
    const inputCustomMT = document.getElementById('input-custom-mt');

    // Kiểm tra nếu bước hiện tại có Options
    if (currentStep.options && currentStep.options.length > 0) {
      inputMP?.classList.add('hidden');
      inputMT?.classList.add('hidden');
      optWrapMP?.classList.remove('hidden');
      optWrapMT?.classList.remove('hidden');

      this.renderEyeOptions('mp', currentStep.options, stepVal.mp || '', optWrapMP, customWrapMP, inputCustomMP);
      this.renderEyeOptions('mt', currentStep.options, stepVal.mt || '', optWrapMT, customWrapMT, inputCustomMT);

      this.state.activeInputId = 'input-custom-mp';
    } else {
      optWrapMP?.classList.add('hidden');
      optWrapMT?.classList.add('hidden');
      customWrapMP?.classList.add('hidden');
      customWrapMT?.classList.add('hidden');
      inputMP?.classList.remove('hidden');
      inputMT?.classList.remove('hidden');

      if (inputMP) {
        inputMP.value = stepVal.mp || '';
        inputMP.placeholder = currentStep.placeholderMP || 'Mắt phải';
      }
      if (inputMT) {
        inputMT.value = stepVal.mt || '';
        inputMT.placeholder = currentStep.placeholderMT || 'Mắt trái';
      }
      this.state.activeInputId = 'input-mp';
    }

    // Highlight ô đang chọn
    this.highlightActiveInput();

    // Cập nhật trạng thái và nhãn nút Next riêng biệt
    const btnNext = document.getElementById('btn-next-step');
    const labelNext = document.getElementById('btn-next-label');
    if (btnNext) {
      if (this.state.currentStepIndex === formConfig.steps.length - 1) {
        btnNext.className = 'flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-lg text-xs sm:text-sm shadow-md shadow-emerald-500/25 touch-press flex items-center justify-center space-x-1 transition-all';
        if (labelNext) labelNext.textContent = 'Hoàn Thành & Xem KQ';
      } else {
        btnNext.className = 'flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg text-xs sm:text-sm shadow-md shadow-blue-500/25 touch-press flex items-center justify-center space-x-1 transition-all';
        if (labelNext) labelNext.textContent = 'Bước Tiếp Theo';
      }
    }
  },

  // Helper render các nút Option + nút Khác cho MP hoặc MT
  renderEyeOptions(eyeKey, optionsList, currentValue, containerEl, customWrapEl, customInputEl) {
    if (!containerEl) return;
    containerEl.innerHTML = '';

    const isOptionMatch = optionsList.includes(currentValue);
    const isCustomFilled = !isOptionMatch && currentValue.trim() !== '';

    optionsList.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isSelected = currentValue === opt;
      btn.className = `quick-opt-btn ${isSelected ? 'active-opt' : ''}`;
      btn.textContent = opt;

      btn.addEventListener('click', () => {
        customWrapEl?.classList.add('hidden');
        if (customInputEl) customInputEl.value = '';

        containerEl.querySelectorAll('.quick-opt-btn').forEach(b => b.classList.remove('active-opt'));
        btn.classList.add('active-opt');

        this.saveOptionChoice(eyeKey, opt);
      });

      containerEl.appendChild(btn);
    });

    // Nút Khác (Cho phép nhập tùy ý)
    const btnOther = document.createElement('button');
    btnOther.type = 'button';
    btnOther.className = `quick-opt-btn ${isCustomFilled ? 'active-opt' : ''}`;
    btnOther.innerHTML = `Khác ✏️`;

    btnOther.addEventListener('click', () => {
      containerEl.querySelectorAll('.quick-opt-btn').forEach(b => b.classList.remove('active-opt'));
      btnOther.classList.add('active-opt');
      customWrapEl?.classList.remove('hidden');

      this.state.activeInputId = eyeKey === 'mp' ? 'input-custom-mp' : 'input-custom-mt';
      this.highlightActiveInput();
      customInputEl?.focus();
    });

    containerEl.appendChild(btnOther);

    if (isCustomFilled) {
      customWrapEl?.classList.remove('hidden');
      if (customInputEl) customInputEl.value = currentValue;
    } else {
      customWrapEl?.classList.add('hidden');
      if (customInputEl) customInputEl.value = '';
    }
  },

  // Lưu lựa chọn Option nhanh
  saveOptionChoice(eyeKey, value) {
    if (!this.state.activeCase) return;
    const formConfig = FORMS_CONFIG[this.state.activeFormType];
    const currentStep = formConfig.steps[this.state.currentStepIndex];
    if (!currentStep) return;

    const caseData = StorageManager.getCaseById(this.state.activeCase.id);
    const currentStepVal = caseData?.forms?.[this.state.activeFormType]?.[currentStep.id] || { mp: '', mt: '' };

    const mpVal = eyeKey === 'mp' ? value : currentStepVal.mp;
    const mtVal = eyeKey === 'mt' ? value : currentStepVal.mt;

    StorageManager.updateStepData(
      this.state.activeCase.id,
      this.state.activeFormType,
      currentStep.id,
      mpVal,
      mtVal
    );

    this.renderLeftStepper();
  },

  // Highlight ô input MP hoặc MT đang trỏ
  highlightActiveInput() {
    const inputs = ['input-mp', 'input-mt', 'input-custom-mp', 'input-custom-mt'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id === this.state.activeInputId) {
          el.classList.add('focused-input');
        } else {
          el.classList.remove('focused-input');
        }
      }
    });
  },

  // Lấy thẻ input đang được active
  getActiveInputElement() {
    let activeInput = document.getElementById(this.state.activeInputId);

    const formConfig = FORMS_CONFIG[this.state.activeFormType];
    const currentStep = formConfig.steps[this.state.currentStepIndex];

    if (currentStep && currentStep.options && currentStep.options.length > 0) {
      if (this.state.activeInputId.includes('mt')) {
        const customWrapMT = document.getElementById('custom-wrap-mt');
        customWrapMT?.classList.remove('hidden');
        this.state.activeInputId = 'input-custom-mt';
        activeInput = document.getElementById('input-custom-mt');
      } else {
        const customWrapMP = document.getElementById('custom-wrap-mp');
        customWrapMP?.classList.remove('hidden');
        this.state.activeInputId = 'input-custom-mp';
        activeInput = document.getElementById('input-custom-mp');
      }
      this.highlightActiveInput();
    }

    return activeInput;
  },

  // Chèn phím thường vào vị trí con trỏ
  insertVirtualKey(key) {
    const activeInput = this.getActiveInputElement();
    if (!activeInput) return;

    const start = activeInput.selectionStart ?? activeInput.value.length;
    const end = activeInput.selectionEnd ?? activeInput.value.length;
    const currentVal = activeInput.value;

    // Chèn ký tự
    activeInput.value = currentVal.substring(0, start) + key + currentVal.substring(end);

    // Đặt lại vị trí con trỏ
    const newCursorPos = start + key.length;
    activeInput.setSelectionRange(newCursorPos, newCursorPos);
    activeInput.focus();

    // Tự động lưu
    this.autoSaveCurrentStep();
  },

  // Xử lý bước nhảy Diop thông minh (.25, .50, .75, .00)
  handleSmartDiopter(fraction) {
    const activeInput = this.getActiveInputElement();
    if (!activeInput) return;

    const start = activeInput.selectionStart ?? activeInput.value.length;
    const end = activeInput.selectionEnd ?? activeInput.value.length;
    const val = activeInput.value;
    const prefix = val.substring(0, start);
    const suffix = val.substring(end);

    // 1. Kiểm tra nếu prefix kết thúc bằng số thập phân đã có (vd "2.25", "2.25D", "-1.50")
    const existingDecimalMatch = prefix.match(/([+-]?\d+)\.\d*D?$/);
    if (existingDecimalMatch) {
      const wholeNumber = existingDecimalMatch[1];
      const newPrefix = prefix.replace(/([+-]?\d+)\.\d*D?$/, wholeNumber + fraction + 'D');
      activeInput.value = newPrefix + suffix;
      const newPos = newPrefix.length;
      activeInput.setSelectionRange(newPos, newPos);
      activeInput.focus();
      this.autoSaveCurrentStep();
      return;
    }

    // 2. Kiểm tra nếu prefix kết thúc bằng số nguyên (vd: "2", "-1", "+3")
    const integerMatch = prefix.match(/([+-]?\d+)$/);
    if (integerMatch) {
      const wholeNumber = integerMatch[1];
      const newPrefix = prefix.replace(/([+-]?\d+)$/, wholeNumber + fraction + 'D');
      activeInput.value = newPrefix + suffix;
      const newPos = newPrefix.length;
      activeInput.setSelectionRange(newPos, newPos);
      activeInput.focus();
      this.autoSaveCurrentStep();
      return;
    }

    // 3. Kiểm tra nếu prefix kết thúc bằng dấu "+" hoặc "-"
    if (/[+-]$/.test(prefix)) {
      const newPrefix = prefix + '0' + fraction + 'D';
      activeInput.value = newPrefix + suffix;
      const newPos = newPrefix.length;
      activeInput.setSelectionRange(newPos, newPos);
      activeInput.focus();
      this.autoSaveCurrentStep();
      return;
    }

    // 4. Mặc định (ô trống, sau dấu cách hoặc ngoặc) -> chèn 0.X0D
    const insertText = '0' + fraction + 'D';
    activeInput.value = prefix + insertText + suffix;
    const newPos = prefix.length + insertText.length;
    activeInput.setSelectionRange(newPos, newPos);
    activeInput.focus();

    this.autoSaveCurrentStep();
  },

  // Xử lý phím xóa lùi Backspace ⌫
  handleBackspace() {
    const activeInput = this.getActiveInputElement();
    if (!activeInput) return;

    const start = activeInput.selectionStart ?? activeInput.value.length;
    const end = activeInput.selectionEnd ?? activeInput.value.length;
    const val = activeInput.value;

    if (start !== end) {
      // Đang bôi đen một đoạn
      activeInput.value = val.substring(0, start) + val.substring(end);
      activeInput.setSelectionRange(start, start);
    } else if (start > 0) {
      // Xóa 1 ký tự phía trước con trỏ
      activeInput.value = val.substring(0, start - 1) + val.substring(start);
      activeInput.setSelectionRange(start - 1, start - 1);
    }

    activeInput.focus();
    this.autoSaveCurrentStep();
  },

  // Tự động lưu giá trị của bước hiện tại
  autoSaveCurrentStep() {
    if (!this.state.activeCase) return;

    const formConfig = FORMS_CONFIG[this.state.activeFormType];
    const currentStep = formConfig.steps[this.state.currentStepIndex];
    if (!currentStep) return;

    let mpVal = '';
    let mtVal = '';

    if (currentStep.options && currentStep.options.length > 0) {
      const optWrapMP = document.getElementById('options-container-mp');
      const activeOptBtnMP = optWrapMP?.querySelector('.quick-opt-btn.active-opt');
      const customWrapMP = document.getElementById('custom-wrap-mp');
      const inputCustomMP = document.getElementById('input-custom-mp');

      if (customWrapMP && !customWrapMP.classList.contains('hidden')) {
        mpVal = inputCustomMP ? inputCustomMP.value : '';
      } else if (activeOptBtnMP && !activeOptBtnMP.textContent.includes('Khác')) {
        mpVal = activeOptBtnMP.textContent.trim();
      }

      const optWrapMT = document.getElementById('options-container-mt');
      const activeOptBtnMT = optWrapMT?.querySelector('.quick-opt-btn.active-opt');
      const customWrapMT = document.getElementById('custom-wrap-mt');
      const inputCustomMT = document.getElementById('input-custom-mt');

      if (customWrapMT && !customWrapMT.classList.contains('hidden')) {
        mtVal = inputCustomMT ? inputCustomMT.value : '';
      } else if (activeOptBtnMT && !activeOptBtnMT.textContent.includes('Khác')) {
        mtVal = activeOptBtnMT.textContent.trim();
      }
    } else {
      const inputMP = document.getElementById('input-mp');
      const inputMT = document.getElementById('input-mt');
      mpVal = inputMP ? inputMP.value : '';
      mtVal = inputMT ? inputMT.value : '';
    }

    StorageManager.updateStepData(
      this.state.activeCase.id,
      this.state.activeFormType,
      currentStep.id,
      mpVal,
      mtVal
    );

    this.renderLeftStepper();
  },

  // Chuyển sang bước tiếp theo
  handleNextStep() {
    this.autoSaveCurrentStep();
    const formConfig = FORMS_CONFIG[this.state.activeFormType];

    if (this.state.currentStepIndex < formConfig.steps.length - 1) {
      this.state.currentStepIndex++;
      this.renderLeftStepper();
      this.loadCurrentStepData();
    } else {
      this.openFullFormView();
    }
  },

  // Quay lại bước trước
  handlePrevStep() {
    this.autoSaveCurrentStep();
    if (this.state.currentStepIndex > 0) {
      this.state.currentStepIndex--;
      this.renderLeftStepper();
      this.loadCurrentStepData();
    }
  },

  // Mở màn hình Form hoàn chỉnh
  openFullFormView() {
    this.state.activeCase = StorageManager.getCaseById(this.state.activeCase?.id);
    if (!this.state.activeCase) return;

    document.getElementById('full-patient-name').textContent = this.state.activeCase.patientName;
    document.getElementById('full-case-time').textContent = this.state.activeCase.createdAt;

    this.renderFullFormContent();
    this.showScreen('screen-full-form');
  },

  // Render bảng form hoàn chỉnh
  renderFullFormContent() {
    const container = document.getElementById('full-form-table-container');
    if (!container || !this.state.activeCase) return;

    const formConfig = FORMS_CONFIG[this.state.activeFormType];
    const formData = this.state.activeCase.forms?.[this.state.activeFormType] || {};

    const btnTabCQ = document.getElementById('btn-switch-full-chuquan');
    const btnTabSK = document.getElementById('btn-switch-full-skiascopy');

    const activeTabClass = 'flex-1 py-1.5 px-2 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-sm transition-all';
    const inactiveTabClass = 'flex-1 py-1.5 px-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all';

    if (this.state.activeFormType === 'chuQuan') {
      if (btnTabCQ) btnTabCQ.className = activeTabClass;
      if (btnTabSK) btnTabSK.className = inactiveTabClass;
    } else {
      if (btnTabSK) btnTabSK.className = activeTabClass;
      if (btnTabCQ) btnTabCQ.className = inactiveTabClass;
    }

    let tableHtml = `
      <div class="mb-2.5 text-center">
        <h2 class="text-base sm:text-xl font-extrabold uppercase text-slate-800 tracking-wide">${formConfig.name}</h2>
        <p class="text-[11px] text-slate-500 italic mt-0.5">💡 Chạm vào bất kỳ dòng nào trong bảng để quay lại sửa bước đó.</p>
      </div>
      <div class="overflow-x-auto rounded-lg shadow-sm border border-slate-400 bg-white">
        <table class="medical-table text-left">
          <thead>
            <tr>
              <th class="w-[32%] py-1 px-1.5 text-slate-900 bg-slate-100 border border-slate-400 text-[10.5px] sm:text-xs font-extrabold">CÁC BƯỚC TIẾN HÀNH</th>
              <th class="w-[34%] py-1 px-1.5 text-center text-slate-900 bg-slate-100 border border-slate-400 text-[10.5px] sm:text-xs font-extrabold">MP (Phải)</th>
              <th class="w-[34%] py-1 px-1.5 text-center text-slate-900 bg-slate-100 border border-slate-400 text-[10.5px] sm:text-xs font-extrabold">MT (Trái)</th>
            </tr>
          </thead>
          <tbody>
    `;

    let currentGroup = '';

    formConfig.steps.forEach((step, idx) => {
      if (step.group && step.group !== currentGroup) {
        currentGroup = step.group;
        tableHtml += `
          <tr class="bg-slate-200">
            <td colspan="3" class="py-0.5 px-1.5 font-bold text-[9.5px] sm:text-[10.5px] uppercase text-slate-800 border border-slate-400 tracking-wider">
              ${currentGroup}
            </td>
          </tr>
        `;
      }

      const cleanLabel = step.label.replace(/\s*:\s*$/, '');
      const val = formData[step.id] || { mp: '', mt: '' };
      const mpDisplay = val.mp && val.mp.trim() !== '' ? `<span class="font-bold text-blue-700">${val.mp}</span>` : '<span class="text-slate-300">-</span>';
      const mtDisplay = val.mt && val.mt.trim() !== '' ? `<span class="font-bold text-indigo-700">${val.mt}</span>` : '<span class="text-slate-300">-</span>';

      tableHtml += `
        <tr class="hover:bg-blue-50/50 cursor-pointer transition-colors" onclick="App.openForm('${this.state.activeFormType}', ${idx})">
          <td class="py-1 px-1.5 font-semibold text-slate-700 border border-slate-400 text-[10px] sm:text-[11px] leading-tight">
            ${cleanLabel}
          </td>
          <td class="py-1 px-1.5 text-center border border-slate-400 font-mono text-[10.5px] sm:text-xs leading-tight break-words">${mpDisplay}</td>
          <td class="py-1 px-1.5 text-center border border-slate-400 font-mono text-[10.5px] sm:text-xs leading-tight break-words">${mtDisplay}</td>
        </tr>
      `;
    });

    tableHtml += `
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = tableHtml;
  },

  // Render danh sách ca đã lưu trong session ở Trang Chủ
  renderCaseList() {
    const container = document.getElementById('session-cases-list');
    const emptyState = document.getElementById('empty-cases-state');
    const countBadge = document.getElementById('cases-count-badge');
    const cases = StorageManager.getCases();

    if (countBadge) countBadge.textContent = `${cases.length} ca`;

    if (!container) return;

    if (cases.length === 0) {
      container.innerHTML = '';
      emptyState?.classList.remove('hidden');
      return;
    }

    emptyState?.classList.add('hidden');
    container.innerHTML = '';

    cases.forEach(c => {
      const countCQ = StorageManager.countFilledSteps(c, 'chuQuan');
      const countSK = StorageManager.countFilledSteps(c, 'skiascopy');

      const card = document.createElement('div');
      card.className = 'bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-blue-300 transition-all';

      card.innerHTML = `
        <div class="flex-1 min-w-0 pr-2 cursor-pointer" onclick="App.selectExistingCase('${c.id}')">
          <div class="flex items-center space-x-1.5">
            <span class="font-bold text-slate-800 truncate text-xs sm:text-sm">${c.patientName}</span>
            <span class="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">${c.createdAt}</span>
          </div>
          <div class="flex items-center space-x-1.5 mt-1">
            ${countCQ > 0 ? `<span class="text-[10px] bg-blue-50 text-blue-700 font-semibold px-1.5 py-0.5 rounded border border-blue-200">📋 Chủ quan: ${countCQ}/17</span>` : ''}
            ${countSK > 0 ? `<span class="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-1.5 py-0.5 rounded border border-indigo-200">👁️ Skiascopy: ${countSK}/${FORMS_CONFIG.skiascopy.steps.length}</span>` : ''}
            ${countCQ === 0 && countSK === 0 ? `<span class="text-[10px] text-slate-500 italic">Chưa điền bước nào</span>` : ''}
          </div>
        </div>
        <div class="flex items-center space-x-1 flex-shrink-0">
          <button type="button" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg touch-press font-semibold text-xs flex items-center" onclick="App.selectExistingCase('${c.id}')">
            Tiếp ➔
          </button>
          <button type="button" class="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg touch-press text-xs" onclick="App.deleteSingleCase('${c.id}', event)">
            ✕
          </button>
        </div>
      `;

      container.appendChild(card);
    });
  },

  // Chọn ca cũ từ danh sách
  selectExistingCase(caseId) {
    const targetCase = StorageManager.getCaseById(caseId);
    if (!targetCase) return;

    this.state.activeCase = targetCase;
    StorageManager.setActiveCaseId(caseId);
    this.openChooseFormScreen();
  },

  // Xóa 1 ca
  deleteSingleCase(caseId, event) {
    event.stopPropagation();
    if (confirm('Xóa ca này khỏi danh sách nháp?')) {
      StorageManager.deleteCase(caseId);
      this.renderCaseList();
    }
  }
};

// Khởi chạy khi tài liệu tải xong
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
