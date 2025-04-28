
const translations = {
  common: {
    app: {
      name: "YDM HR",
    },
    actions: {
      save: "حفظ",
      cancel: "إلغاء",
      edit: "تعديل",
      delete: "حذف",
      confirm: "تأكيد",
      back: "رجوع",
      next: "التالي",
      search: "بحث",
      filter: "تصفية",
      logout: "تسجيل خروج",
    },
    status: {
      loading: "جاري التحميل...",
      error: "حدث خطأ",
      success: "تم بنجاح",
    },
  },
  navigation: {
    dashboard: "لوحة التحكم",
    employees: "الموظفين",
    attendance: "الحضور",
    payroll: "الرواتب",
    leaves: "الإجازات",
    users: "المستخدمين",
    settings: "الإعدادات",
  },
  attendance: {
    title: "الحضور",
    subtitle: "إدارة حضور الموظفين اليومي",
    date: {
      today: "اليوم",
      next: "اليوم التالي",
      previous: "اليوم السابق",
    },
    stats: {
      total: "إجمالي الموظفين",
      present: "حاضر",
      absent: "غائب",
    },
    table: {
      employee: "الموظف",
      status: "الحالة",
      startTime: "وقت البدء",
      endTime: "وقت الانتهاء",
      overtime: "الساعات الإضافية",
      notes: "ملاحظات",
    },
    actions: {
      updateAll: "تحديث الكل",
      save: "حفظ التغييرات",
      saving: "جاري الحفظ...",
      modified: "معدل",
      records: "سجلات",
    },
    status: {
      present: "حاضر",
      absent: "غائب",
    },
    delete: {
      title: "حذف سجل الحضور",
      confirmation: "هل أنت متأكد أنك تريد حذف سجل الحضور لـ",
      warning: "لا يمكن التراجع عن هذا الإجراء.",
      deleting: "جاري الحذف...",
      delete: "حذف",
    },
    filters: {
      all: "الكل",
      project: "المشروع",
      location: "الموقع",
      paymentType: "نوع الدفع",
      sponsorship: "الكفالة",
    },
    updateAll: {
      title: "تحديث جميع السجلات",
      description: "تطبيق نفس الحالة والأوقات على جميع الموظفين الظاهرين",
      status: "الحالة",
      startTime: "وقت البدء",
      endTime: "وقت الانتهاء",
      overtime: "الساعات الإضافية",
      apply: "تطبيق على الكل",
      applying: "جاري التطبيق...",
    },
    empty: {
      title: "لم يتم العثور على سجلات حضور",
      description: "لا توجد سجلات حضور للتاريخ والفلاتر المحددة",
    },
  },
  login: {
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    forgotPassword: "نسيت كلمة المرور؟",
    login: "تسجيل الدخول",
    noAccount: "ليس لديك حساب؟",
    signUp: "إنشاء حساب",
  },
  language: {
    ar: "العربية",
    en: "English",
  },
};

export default translations;
