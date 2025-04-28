
const translations = {
  common: {
    app: {
      name: "YDM HR",
    },
    actions: {
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      confirm: "Confirm",
      back: "Back",
      next: "Next",
      search: "Search",
      filter: "Filter",
      logout: "Logout",
    },
    status: {
      loading: "Loading...",
      error: "An error occurred",
      success: "Success",
    },
  },
  navigation: {
    dashboard: "Dashboard",
    employees: "Employees",
    attendance: "Attendance",
    payroll: "Payroll",
    leaves: "Leaves",
    users: "Users",
    settings: "Settings",
  },
  attendance: {
    title: "Attendance",
    subtitle: "Manage daily attendance for employees",
    date: {
      today: "Today",
      next: "Next Day",
      previous: "Previous Day",
    },
    stats: {
      total: "Total Employees",
      present: "Present",
      absent: "Absent",
    },
    table: {
      employee: "Employee",
      status: "Status",
      startTime: "Start Time",
      endTime: "End Time",
      overtime: "Overtime (hrs)",
      notes: "Notes",
    },
    actions: {
      updateAll: "Update All",
      save: "Save Changes",
      saving: "Saving...",
      modified: "Modified",
      records: "records",
    },
    status: {
      present: "Present",
      absent: "Absent",
    },
    delete: {
      title: "Delete Attendance Record",
      confirmation: "Are you sure you want to delete the attendance record for",
      warning: "This action cannot be undone.",
      deleting: "Deleting...",
      delete: "Delete",
    },
    filters: {
      all: "All",
      project: "Project",
      location: "Location",
      paymentType: "Payment Type",
      sponsorship: "Sponsorship",
    },
    updateAll: {
      title: "Update All Records",
      description: "Apply the same status and times to all visible employees",
      status: "Status",
      startTime: "Start Time",
      endTime: "End Time",
      overtime: "Overtime Hours",
      apply: "Apply to All",
      applying: "Applying...",
    },
    empty: {
      title: "No attendance records found",
      description: "There are no attendance records for the selected date and filters",
    },
  },
  login: {
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot Password?",
    login: "Login",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
  },
  language: {
    ar: "العربية",
    en: "English",
  },
};

export default translations;
