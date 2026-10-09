/**
 * ========================================================
 * Smart E-Wallet Single Page Application
 * Interactive Engine: State, UI Reactivity, Modals & Chart
 * ========================================================
 */

// Default Seed Data
const DEFAULT_WALLET_DATA = {
  balance: 14250.00,
  currency: 'SAR',
  isBalanceHidden: false,
  isCardFrozen: false,
  cardNumber: '4829 8831 2940 4829',
  cardHolder: 'SARAH AL-MANSOUR',
  contacts: [
    { id: 1, name: 'خالد السالم', phone: '0551239841', gradient: 'from-blue-500 to-indigo-600', initial: 'خ' },
    { id: 2, name: 'فاطمة الزهراني', phone: '0569871234', gradient: 'from-pink-500 to-rose-600', initial: 'ف' },
    { id: 3, name: 'عمر القرشي', phone: '0543216789', gradient: 'from-emerald-400 to-teal-600', initial: 'ع' },
    { id: 4, name: 'ريم العبدلي', phone: '0509988776', gradient: 'from-amber-400 to-orange-500', initial: 'ر' },
    { id: 5, name: 'ماجد الحربي', phone: '0531122334', gradient: 'from-purple-500 to-indigo-700', initial: 'م' }
  ],
  transactions: [
    {
      id: 'TX-984102',
      type: 'expense',
      title: 'تحويل إلى خالد السالم',
      subtitle: 'تحويل فوري بين المحافظ',
      category: 'تحويل شخصي',
      amount: 450.00,
      date: '2026-10-09 18:30',
      method: 'محفظتي بلاتينيوم',
      note: 'مشاركة تكاليف العشاء',
      status: 'ناجحة',
      icon: 'fa-paper-plane',
      iconBg: 'bg-indigo-500/20 text-indigo-400'
    },
    {
      id: 'TX-984095',
      type: 'income',
      title: 'شحن رصيد المحفظة',
      subtitle: 'Apple Pay • إيداع بنكي',
      category: 'إيداع',
      amount: 2500.00,
      date: '2026-10-09 14:15',
      method: 'Apple Pay',
      note: 'تغذية المحفظة الشهرية',
      status: 'ناجحة',
      icon: 'fa-circle-arrow-down',
      iconBg: 'bg-emerald-500/20 text-emerald-400'
    },
    {
      id: 'TX-983981',
      type: 'bills',
      title: 'فاتورة الكهرباء السعودية',
      subtitle: 'رقم المشترك: 1009845210',
      category: 'فواتير وخدمات',
      amount: 320.00,
      date: '2026-10-08 11:20',
      method: 'محفظتي بلاتينيوم',
      note: 'سداد دوري لشهر أكتوبر',
      status: 'ناجحة',
      icon: 'fa-bolt',
      iconBg: 'bg-amber-500/20 text-amber-400'
    },
    {
      id: 'TX-983820',
      type: 'expense',
      title: 'مكتبة جرير - تسوق إلكتروني',
      subtitle: 'شراء ملحقات وإلكترونيات',
      category: 'تسوق',
      amount: 780.00,
      date: '2026-10-07 20:05',
      method: 'البطاقة الافتراضية',
      note: 'طلب أونلاين #JR8829',
      status: 'ناجحة',
      icon: 'fa-bag-shopping',
      iconBg: 'bg-rose-500/20 text-rose-400'
    },
    {
      id: 'TX-983711',
      type: 'bills',
      title: 'فاتورة باقة إنترنت 5G',
      subtitle: 'شركة الاتصالات STC',
      category: 'فواتير وخدمات',
      amount: 287.50,
      date: '2026-10-06 09:40',
      method: 'محفظتي بلاتينيوم',
      note: 'تجديد اشتراك باقة مفوتر',
      status: 'ناجحة',
      icon: 'fa-wifi',
      iconBg: 'bg-indigo-500/20 text-indigo-400'
    },
    {
      id: 'TX-983602',
      type: 'income',
      title: 'استلام دفعة من ريم العبدلي',
      subtitle: 'حوالة واردة',
      category: 'تحويل شخصي',
      amount: 600.00,
      date: '2026-10-05 16:45',
      method: 'تحويل سريع',
      note: 'سداد مستحقات مشتركة',
      status: 'ناجحة',
      icon: 'fa-circle-arrow-down',
      iconBg: 'bg-emerald-500/20 text-emerald-400'
    }
  ],
  notifications: [
    { id: 1, text: 'تمت ترقية حسابك إلى باقة "برو" بدون رسوم إضافية', time: 'منذ ساعتين', unread: true },
    { id: 2, text: 'استلمت إيداعاً بقيمة 2,500 ر.س عبر Apple Pay', time: 'اليوم 14:15', unread: false },
    { id: 3, text: 'تم سداد فاتورة الكهرباء بنجاح (320 ر.س)', time: 'أمس 11:20', unread: false }
  ]
};

// Currency Config
const CURRENCY_SYMBOLS = {
  SAR: 'ر.س',
  USD: '$',
  EGP: 'ج.م',
  AED: 'د.إ'
};

// Application State
let walletState = {};
let currentFilter = 'all';
let currentSearch = '';
let spendingChartInstance = null;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initUI();
  renderAll();
  initChart();
});

/* ========================================================
   State Management & Local Storage
   ======================================================== */
function loadState() {
  const saved = localStorage.getItem('smart_wallet_data_v2');
  if (saved) {
    try {
      walletState = JSON.parse(saved);
    } catch (e) {
      walletState = JSON.parse(JSON.stringify(DEFAULT_WALLET_DATA));
    }
  } else {
    walletState = JSON.parse(JSON.stringify(DEFAULT_WALLET_DATA));
    saveState();
  }
}

function saveState() {
  localStorage.setItem('smart_wallet_data_v2', JSON.stringify(walletState));
}

function resetDemoData() {
  if (confirm('هل ترغب حقاً في إعادة تعيين المحفظة للبيانات الافتراضية؟')) {
    walletState = JSON.parse(JSON.stringify(DEFAULT_WALLET_DATA));
    saveState();
    renderAll();
    updateChart();
    showToast('تمت استعادة البيانات الافتراضية بنجاح', 'info');
  }
}

/* ========================================================
   UI Setup & Event Listeners
   ======================================================== */
function initUI() {
  // Currency Selector
  const currencySelector = document.getElementById('currencySelector');
  if (currencySelector) {
    currencySelector.value = walletState.currency || 'SAR';
    currencySelector.addEventListener('change', (e) => {
      walletState.currency = e.target.value;
      saveState();
      renderBalance();
      renderTransactions();
      updateCurrencyLabels();
    });
  }

  // Toggle Balance Visibility
  const toggleBalanceBtn = document.getElementById('toggleBalanceBtn');
  if (toggleBalanceBtn) {
    toggleBalanceBtn.addEventListener('click', () => {
      walletState.isBalanceHidden = !walletState.isBalanceHidden;
      saveState();
      renderBalance();
    });
  }

  // Freeze/Unfreeze Card
  const freezeCardBtn = document.getElementById('freezeCardBtn');
  if (freezeCardBtn) {
    freezeCardBtn.addEventListener('click', toggleCardFreeze);
  }

  // Copy Card Number
  const copyCardBtn = document.getElementById('copyCardBtn');
  if (copyCardBtn) {
    copyCardBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(walletState.cardNumber.replace(/\s/g, ''));
      showToast('تم نسخ رقم البطاقة إلى الحافظة 📋', 'success');
    });
  }

  // Notification Bell Dropdown
  const notificationBtn = document.getElementById('notificationBtn');
  const notificationDropdown = document.getElementById('notificationDropdown');
  if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationDropdown.classList.toggle('hidden');
      // Mark all as read
      walletState.notifications.forEach(n => n.unread = false);
      saveState();
      renderNotifications();
    });

    document.addEventListener('click', (e) => {
      if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
        notificationDropdown.classList.add('hidden');
      }
    });
  }

  const clearNotificationsBtn = document.getElementById('clearNotificationsBtn');
  if (clearNotificationsBtn) {
    clearNotificationsBtn.addEventListener('click', () => {
      walletState.notifications = [];
      saveState();
      renderNotifications();
      showToast('تم مسح جميع الإشعارات', 'info');
    });
  }

  // Filter Tabs
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.getAttribute('data-filter');
      renderTransactions();
    });
  });

  // Search Input
  const searchInput = document.getElementById('searchTransactionsInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      renderTransactions();
    });
  }

  // Reset Demo Button
  const resetDemoBtn = document.getElementById('resetDemoBtn');
  if (resetDemoBtn) {
    resetDemoBtn.addEventListener('click', resetDemoData);
  }

  // Export CSV
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', exportTransactionsCSV);
  }

  // Form Submissions
  document.getElementById('transferForm')?.addEventListener('submit', handleTransferSubmit);
  document.getElementById('depositForm')?.addEventListener('submit', handleDepositSubmit);
  document.getElementById('billsForm')?.addEventListener('submit', handleBillsSubmit);
  document.getElementById('addContactForm')?.addEventListener('submit', handleAddContactSubmit);

  // Close modals when clicking backdrop
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.add('hidden');
      }
    });
  });

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(modal => modal.classList.add('hidden'));
      document.getElementById('notificationDropdown')?.classList.add('hidden');
    }
  });

  updateCurrencyLabels();
}

/* ========================================================
   Renderers
   ======================================================== */
function renderAll() {
  renderBalance();
  renderVirtualCard();
  renderContacts();
  renderTransactions();
  renderNotifications();
  updateCurrencyLabels();
}

function renderBalance() {
  const balanceEl = document.getElementById('balanceAmount');
  const currencyEl = document.getElementById('balanceCurrency');
  const iconEl = document.getElementById('toggleBalanceIcon');
  const curr = CURRENCY_SYMBOLS[walletState.currency] || 'ر.س';

  if (!balanceEl) return;

  if (walletState.isBalanceHidden) {
    balanceEl.textContent = '••••••••';
    balanceEl.classList.remove('font-inter');
    if (iconEl) iconEl.className = 'fa-regular fa-eye-slash text-indigo-400';
  } else {
    balanceEl.textContent = Number(walletState.balance).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    balanceEl.classList.add('font-inter');
    if (iconEl) iconEl.className = 'fa-regular fa-eye text-slate-400';
  }

  if (currencyEl) currencyEl.textContent = curr;

  // Calculate totals for summary badges
  let totalIncome = 0;
  let totalExpenses = 0;

  walletState.transactions.forEach(t => {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else {
      totalExpenses += t.amount;
    }
  });

  const incomeEl = document.getElementById('totalIncome');
  const expensesEl = document.getElementById('totalExpenses');

  if (incomeEl) {
    incomeEl.innerHTML = `+${totalIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })} <span class="text-[11px]">${curr}</span>`;
  }
  if (expensesEl) {
    expensesEl.innerHTML = `-${totalExpenses.toLocaleString('en-US', { maximumFractionDigits: 0 })} <span class="text-[11px]">${curr}</span>`;
  }
}

function renderVirtualCard() {
  const virtualCard = document.getElementById('virtualCard');
  const freezeText = document.getElementById('freezeCardText');
  const freezeIcon = document.getElementById('freezeCardIcon');

  if (!virtualCard) return;

  if (walletState.isCardFrozen) {
    virtualCard.classList.add('card-frozen');
    if (freezeText) freezeText.textContent = 'مجمّدة';
    if (freezeIcon) freezeIcon.className = 'fa-solid fa-lock text-rose-400';
  } else {
    virtualCard.classList.remove('card-frozen');
    if (freezeText) freezeText.textContent = 'نشطة';
    if (freezeIcon) freezeIcon.className = 'fa-solid fa-snowflake text-cyan-300';
  }
}

function toggleCardFreeze() {
  walletState.isCardFrozen = !walletState.isCardFrozen;
  saveState();
  renderVirtualCard();
  if (walletState.isCardFrozen) {
    showToast('تم تجميد البطاقة مؤقتاً لحمايتها ❄️', 'info');
  } else {
    showToast('تم إلغاء تجميد البطاقة وتفعيلها بنجاح ⚡', 'success');
  }
}

function renderContacts() {
  const container = document.getElementById('contactsContainer');
  const modalPicker = document.getElementById('modalRecipientsPicker');
  
  if (container) {
    container.innerHTML = walletState.contacts.map(c => `
      <button onclick="quickTransferTo('${c.name}', '${c.phone}')" class="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none">
        <div class="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr ${c.gradient} flex items-center justify-center text-white font-bold text-base shadow-md group-hover:scale-105 group-hover:shadow-indigo-500/30 transition-all">
          ${c.initial}
        </div>
        <span class="text-xs font-semibold text-slate-300 group-hover:text-white truncate max-w-[70px] text-center">${c.name.split(' ')[0]}</span>
      </button>
    `).join('') + `
      <button onclick="openNewContactModal()" class="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none">
        <div class="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-900/50 flex items-center justify-center text-slate-400 group-hover:text-white transition-all">
          <i class="fa-solid fa-plus text-sm"></i>
        </div>
        <span class="text-xs text-slate-400 group-hover:text-indigo-400">إضافة</span>
      </button>
    `;
  }

  if (modalPicker) {
    modalPicker.innerHTML = walletState.contacts.map(c => `
      <button type="button" onclick="selectModalRecipient('${c.name}')" 
              class="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition">
        <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
        <span>${c.name}</span>
      </button>
    `).join('');
  }
}

function renderTransactions() {
  const list = document.getElementById('transactionsList');
  if (!list) return;

  const curr = CURRENCY_SYMBOLS[walletState.currency] || 'ر.س';

  // Filter & Search Logic
  const filtered = walletState.transactions.filter(t => {
    const matchesFilter = (currentFilter === 'all') || (t.type === currentFilter);
    const matchesSearch = !currentSearch || 
      t.title.toLowerCase().includes(currentSearch) ||
      t.subtitle.toLowerCase().includes(currentSearch) ||
      t.category.toLowerCase().includes(currentSearch) ||
      String(t.amount).includes(currentSearch);
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="py-12 text-center text-slate-500">
        <i class="fa-solid fa-receipt text-3xl mb-2 opacity-50"></i>
        <p class="text-sm">لا توجد معاملات مطابقة للبحث أو الفلتر</p>
      </div>
    `;
    return;
  }

  list.innerHTML = filtered.map(t => {
    const isIncome = t.type === 'income';
    const sign = isIncome ? '+' : '-';
    const amountColor = isIncome ? 'text-emerald-400' : 'text-slate-100';

    return `
      <div onclick="showReceiptDetails('${t.id}')" 
           class="group p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700/80 transition-all cursor-pointer flex items-center justify-between">
        
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl ${t.iconBg} flex items-center justify-center text-base group-hover:scale-105 transition-transform flex-shrink-0">
            <i class="fa-solid ${t.icon}"></i>
          </div>
          <div class="overflow-hidden">
            <h4 class="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-white truncate">${t.title}</h4>
            <p class="text-[11px] text-slate-400 truncate mt-0.5">${t.subtitle}</p>
          </div>
        </div>

        <div class="text-left flex-shrink-0 pl-1">
          <p class="text-xs sm:text-sm font-bold ${amountColor} font-inter">
            ${sign}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span class="text-[10px] text-slate-400 font-cairo">${curr}</span>
          </p>
          <span class="text-[10px] text-slate-500 block mt-0.5">${formatDate(t.date)}</span>
        </div>

      </div>
    `;
  }).join('');
}

function renderNotifications() {
  const list = document.getElementById('notificationsList');
  const badge = document.getElementById('unreadBadge');
  if (!list) return;

  const unreadCount = walletState.notifications.filter(n => n.unread).length;
  if (badge) {
    if (unreadCount > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  if (walletState.notifications.length === 0) {
    list.innerHTML = `<p class="text-xs text-slate-500 text-center py-4">لا توجد إشعارات جديدة</p>`;
    return;
  }

  list.innerHTML = walletState.notifications.map(n => `
    <div class="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-800 transition">
      <p class="text-xs text-slate-200 leading-relaxed">${n.text}</p>
      <span class="text-[10px] text-slate-400 mt-1 block">${n.time}</span>
    </div>
  `).join('');
}

function updateCurrencyLabels() {
  const curr = CURRENCY_SYMBOLS[walletState.currency] || 'ر.س';
  document.querySelectorAll('.currentCurrencyLabel').forEach(el => {
    el.textContent = curr;
  });
}

function formatDate(dateStr) {
  try {
    const parts = dateStr.split(' ');
    return parts[1] || parts[0];
  } catch (e) {
    return dateStr;
  }
}

/* ========================================================
   Spending Chart (Chart.js)
   ======================================================== */
function initChart() {
  const canvas = document.getElementById('spendingChart');
  if (!canvas) return;

  const data = calculateCategoryData();

  spendingChartInstance = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.values,
        backgroundColor: [
          '#6366f1', // Indigo - التحويلات
          '#f43f5e', // Rose - التسوق
          '#f59e0b', // Amber - الفواتير
          '#06b6d4', // Cyan - الخدمات
          '#10b981'  // Emerald - أخرى
        ],
        borderWidth: 2,
        borderColor: '#0f172a',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          rtl: true,
          callbacks: {
            label: function(context) {
              const curr = CURRENCY_SYMBOLS[walletState.currency] || 'ر.س';
              return ` ${context.label}: ${context.raw.toLocaleString()} ${curr}`;
            }
          }
        }
      }
    }
  });

  renderCategoryBreakdown(data);
}

function calculateCategoryData() {
  const categoryMap = {
    'تحويل شخصي': 0,
    'تسوق': 0,
    'فواتير وخدمات': 0,
    'أخرى': 0
  };

  walletState.transactions.forEach(t => {
    if (t.type !== 'income') {
      if (categoryMap.hasOwnProperty(t.category)) {
        categoryMap[t.category] += t.amount;
      } else {
        categoryMap['أخرى'] += t.amount;
      }
    }
  });

  return {
    labels: ['تحويل شخصي', 'تسوق', 'فواتير وخدمات', 'أخرى'],
    values: [
      categoryMap['تحويل شخصي'],
      categoryMap['تسوق'],
      categoryMap['فواتير وخدمات'],
      categoryMap['أخرى']
    ]
  };
}

function updateChart() {
  if (!spendingChartInstance) return;
  const data = calculateCategoryData();
  spendingChartInstance.data.datasets[0].data = data.values;
  spendingChartInstance.update();
  renderCategoryBreakdown(data);
}

function renderCategoryBreakdown(data) {
  const container = document.getElementById('categoriesBreakdown');
  if (!container) return;

  const total = data.values.reduce((a, b) => a + b, 0) || 1;
  const colors = [
    'bg-indigo-500',
    'bg-rose-500',
    'bg-amber-500',
    'bg-cyan-500'
  ];

  const curr = CURRENCY_SYMBOLS[walletState.currency] || 'ر.س';

  container.innerHTML = data.labels.map((label, idx) => {
    const val = data.values[idx];
    const percentage = Math.round((val / total) * 100);
    return `
      <div>
        <div class="flex justify-between items-center text-xs mb-1">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full ${colors[idx]}"></span>
            <span class="text-slate-300 font-medium">${label}</span>
          </div>
          <div class="font-inter text-slate-200">
            <span>${val.toLocaleString()} ${curr}</span>
            <span class="text-slate-500 text-[11px] mr-1">(${percentage}%)</span>
          </div>
        </div>
        <div class="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
          <div class="${colors[idx]} h-full rounded-full transition-all duration-500" style="width: ${percentage}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

/* ========================================================
   Transactions Actions
   ======================================================== */

// Handle Send / Transfer
function handleTransferSubmit(e) {
  e.preventDefault();

  if (walletState.isCardFrozen) {
    showToast('البطاقة مجمّدة! يرجى إلغاء تجميدها لإجراء التحويل', 'error');
    return;
  }

  const recipient = document.getElementById('transferRecipient').value.trim();
  const amount = parseFloat(document.getElementById('transferAmount').value);
  const category = document.getElementById('transferCategory').value;
  const note = document.getElementById('transferNote').value.trim() || 'تحويل مالي شخصي';

  if (!recipient || isNaN(amount) || amount <= 0) {
    showToast('يرجى إدخال بيانات تحويل صالحة ومبلغ أكبر من صفر', 'error');
    return;
  }

  if (amount > walletState.balance) {
    showToast('عذراً! الرصيد المتاح غير كافٍ لإتمام العملية', 'error');
    playTone(220, 300); // error sound
    return;
  }

  // Deduct Balance
  walletState.balance -= amount;

  // New Transaction
  const newTx = {
    id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
    type: 'expense',
    title: `تحويل إلى ${recipient}`,
    subtitle: `تحويل فوري • ${category}`,
    category: category,
    amount: amount,
    date: getFormattedCurrentDate(),
    method: 'محفظتي بلاتينيوم',
    note: note,
    status: 'ناجحة',
    icon: 'fa-paper-plane',
    iconBg: 'bg-indigo-500/20 text-indigo-400'
  };

  walletState.transactions.unshift(newTx);
  walletState.notifications.unshift({
    id: Date.now(),
    text: `تم تحويل مبلغ ${amount.toLocaleString()} ${CURRENCY_SYMBOLS[walletState.currency]} إلى ${recipient} بنجاح`,
    time: 'الآن',
    unread: true
  });

  saveState();
  renderAll();
  updateChart();
  closeModal('transferModal');
  document.getElementById('transferForm').reset();

  playSuccessChime();
  triggerConfetti();
  showToast(`تم تحويل ${amount.toLocaleString()} ${CURRENCY_SYMBOLS[walletState.currency]} بنجاح! 🎉`, 'success');

  // Open receipt for the user
  setTimeout(() => {
    showReceiptDetails(newTx.id);
  }, 400);
}

// Handle Top Up / Deposit
function handleDepositSubmit(e) {
  e.preventDefault();

  const amount = parseFloat(document.getElementById('depositAmount').value);
  const methodRadio = document.querySelector('input[name="depositMethod"]:checked');
  const method = methodRadio ? methodRadio.value : 'بطاقة مدى / ائتمان';

  if (isNaN(amount) || amount <= 0) {
    showToast('يرجى إدخال مبلغ شحن صحيح', 'error');
    return;
  }

  walletState.balance += amount;

  const newTx = {
    id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
    type: 'income',
    title: 'شحن رصيد المحفظة',
    subtitle: `إيداع عبر ${method}`,
    category: 'إيداع',
    amount: amount,
    date: getFormattedCurrentDate(),
    method: method,
    note: 'عملية شحن فورية للحساب',
    status: 'ناجحة',
    icon: 'fa-circle-arrow-down',
    iconBg: 'bg-emerald-500/20 text-emerald-400'
  };

  walletState.transactions.unshift(newTx);
  walletState.notifications.unshift({
    id: Date.now(),
    text: `تم إيداع ${amount.toLocaleString()} ${CURRENCY_SYMBOLS[walletState.currency]} في محفظتك عبر ${method}`,
    time: 'الآن',
    unread: true
  });

  saveState();
  renderAll();
  closeModal('depositModal');
  document.getElementById('depositForm').reset();

  playSuccessChime();
  triggerConfetti();
  showToast(`تم شحن رصيدك بمبلغ ${amount.toLocaleString()} بنجاح! 💳`, 'success');
}

// Handle Bill Payment
function handleBillsSubmit(e) {
  e.preventDefault();

  if (walletState.isCardFrozen) {
    showToast('البطاقة مجمّدة! يرجى إلغاء تجميدها لسداد الفواتير', 'error');
    return;
  }

  const billTypeRadio = document.querySelector('input[name="billType"]:checked');
  const billType = billTypeRadio ? billTypeRadio.value : 'فاتورة خدمات';
  const accountNo = document.getElementById('billAccountNo').value.trim();
  const amount = parseFloat(document.getElementById('billAmount').value);

  if (!accountNo || isNaN(amount) || amount <= 0) {
    showToast('يرجى إكمال تفاصيل الفاتورة والمبلغ', 'error');
    return;
  }

  if (amount > walletState.balance) {
    showToast('عذراً! الرصيد المتاح غير كافٍ لسداد هذه الفاتورة', 'error');
    playTone(220, 300);
    return;
  }

  walletState.balance -= amount;

  const newTx = {
    id: 'TX-' + Math.floor(100000 + Math.random() * 900000),
    type: 'bills',
    title: billType,
    subtitle: `رقم المشترك: ${accountNo}`,
    category: 'فواتير وخدمات',
    amount: amount,
    date: getFormattedCurrentDate(),
    method: 'محفظتي بلاتينيوم',
    note: `سداد رقم حساب ${accountNo}`,
    status: 'ناجحة',
    icon: 'fa-bolt',
    iconBg: 'bg-amber-500/20 text-amber-400'
  };

  walletState.transactions.unshift(newTx);
  walletState.notifications.unshift({
    id: Date.now(),
    text: `تم سداد ${billType} بقيمة ${amount.toLocaleString()} ${CURRENCY_SYMBOLS[walletState.currency]} بنجاح`,
    time: 'الآن',
    unread: true
  });

  saveState();
  renderAll();
  updateChart();
  closeModal('billsModal');
  document.getElementById('billsForm').reset();

  playSuccessChime();
  triggerConfetti();
  showToast(`تم سداد ${billType} بنجاح! 📄`, 'success');

  setTimeout(() => {
    showReceiptDetails(newTx.id);
  }, 400);
}

// Handle Add Contact
function handleAddContactSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('contactName').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();
  const colorRadio = document.querySelector('input[name="contactColor"]:checked');
  const gradient = colorRadio ? colorRadio.value : 'from-indigo-500 to-purple-600';

  if (!name || !phone) {
    showToast('يرجى كتابة الاسم ورقم الهاتف', 'error');
    return;
  }

  const newContact = {
    id: Date.now(),
    name: name,
    phone: phone,
    gradient: gradient,
    initial: name.trim()[0] || 'م'
  };

  walletState.contacts.push(newContact);
  saveState();
  renderContacts();
  closeModal('addContactModal');
  document.getElementById('addContactForm').reset();

  showToast(`تمت إضافة ${name} إلى جهات الاتصال 👤`, 'success');
}

/* ========================================================
   Receipt Modal
   ======================================================== */
function showReceiptDetails(txId) {
  const tx = walletState.transactions.find(t => t.id === txId);
  if (!tx) return;

  const curr = CURRENCY_SYMBOLS[walletState.currency] || 'ر.س';
  const isIncome = tx.type === 'income';

  const iconWrapper = document.getElementById('receiptIconWrapper');
  const titleEl = document.getElementById('receiptTitle');
  const amountEl = document.getElementById('receiptAmount');
  const badgeEl = document.getElementById('receiptStatusBadge');
  const refEl = document.getElementById('receiptRef');
  const dateEl = document.getElementById('receiptDate');
  const categoryEl = document.getElementById('receiptCategory');
  const methodEl = document.getElementById('receiptMethod');
  const noteEl = document.getElementById('receiptNote');

  if (iconWrapper) {
    iconWrapper.className = `w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-3 ${tx.iconBg}`;
    iconWrapper.innerHTML = `<i class="fa-solid ${tx.icon}"></i>`;
  }

  if (badgeEl) {
    badgeEl.textContent = 'مكتملة ومؤكدة ✓';
    badgeEl.className = 'text-xs px-2.5 py-0.5 rounded-full font-bold inline-block mb-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
  }

  if (titleEl) titleEl.textContent = tx.title;
  if (amountEl) {
    amountEl.textContent = `${isIncome ? '+' : '-'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${curr}`;
    amountEl.className = `text-3xl font-extrabold font-inter my-2 ${isIncome ? 'text-emerald-400' : 'text-slate-100'}`;
  }

  if (refEl) refEl.textContent = `#${tx.id}`;
  if (dateEl) dateEl.textContent = tx.date;
  if (categoryEl) categoryEl.textContent = tx.category;
  if (methodEl) methodEl.textContent = tx.method;
  if (noteEl) noteEl.textContent = tx.note || 'لا توجد ملاحظات';

  openModal('receiptModal');
}

function printReceipt() {
  window.print();
}

function shareReceipt() {
  if (navigator.share) {
    navigator.share({
      title: 'إيصال معاملة محفظتي الذكية',
      text: `إيصال معاملة من محفظتي الذكية بقيمة ${document.getElementById('receiptAmount')?.textContent}`,
      url: window.location.href
    }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href);
    showToast('تم نسخ رابط الإيصال إلى الحافظة 🔗', 'info');
  }
}

/* ========================================================
   Quick Helper Actions
   ======================================================== */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('hidden');
  }
}

function openNewContactModal() {
  openModal('addContactModal');
}

function quickTransferTo(name, phone) {
  openModal('transferModal');
  const recipientInput = document.getElementById('transferRecipient');
  if (recipientInput) {
    recipientInput.value = `${name} (${phone})`;
  }
  document.getElementById('transferAmount')?.focus();
}

function selectModalRecipient(name) {
  const input = document.getElementById('transferRecipient');
  if (input) {
    input.value = name;
  }
}

function quickFillAmount(inputId, val) {
  const input = document.getElementById(inputId);
  if (input) {
    input.value = val;
  }
}

function copyWalletId() {
  navigator.clipboard.writeText('WLT-SA-8829-01');
  showToast('تم نسخ معرف المحفظة بنجاح 📋', 'success');
}

function getFormattedCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// Export Transactions as CSV with UTF-8 BOM
function exportTransactionsCSV() {
  if (!walletState.transactions || walletState.transactions.length === 0) {
    showToast('لا توجد معاملات لتصديرها', 'error');
    return;
  }

  let csvContent = '\uFEFFرقم المعاملة,النوع,العنوان,التصنيف,المبلغ,التاريخ,طريقة الدفع,ملاحظات\n';
  
  walletState.transactions.forEach(t => {
    const row = [
      t.id,
      t.type,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.amount,
      t.date,
      `"${t.method}"`,
      `"${(t.note || '').replace(/"/g, '""')}"`
    ].join(',');
    csvContent += row + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Wallet_Transactions_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('تم تصدير سجل العمليات بصيغة CSV 📥', 'success');
}

/* ========================================================
   Audio Synthesis & FX (Zero External Audio Dependencies)
   ======================================================== */
function playTone(freq, durationMs) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (durationMs / 1000));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + (durationMs / 1000));
  } catch (e) {
    // AudioContext might be blocked until user gesture, ignore safely
  }
}

function playSuccessChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;

    const playNote = (freq, start, dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.15, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur);
    };

    playNote(587.33, now, 0.2);        // D5
    playNote(880.00, now + 0.12, 0.35); // A5
  } catch (e) {}
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#6366f1', '#10b981', '#38bdf8', '#fbbf24']
    });
  }
}

/* ========================================================
   Toast Notification System
   ======================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto flex items-center gap-3 p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-md border shadow-2xl text-xs text-white transform transition-all duration-300 translate-y-3 opacity-0';

  let icon = 'fa-circle-info text-indigo-400';
  let border = 'border-slate-800';

  if (type === 'success') {
    icon = 'fa-circle-check text-emerald-400';
    border = 'border-emerald-500/40';
  } else if (type === 'error') {
    icon = 'fa-triangle-exclamation text-rose-400';
    border = 'border-rose-500/40';
  }

  toast.classList.add(border);
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-base flex-shrink-0"></i>
    <span class="flex-grow font-medium leading-relaxed">${message}</span>
    <button onclick="this.parentElement.remove()" class="text-slate-500 hover:text-white p-1">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-3', 'opacity-0');
  });

  // Auto remove after 3.5 seconds
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
