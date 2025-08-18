export const testData = {
  users: {
    admin: {
      email: 'admin@company.com',
      name: 'Admin User',
      role: 'administrator'
    },
    manager: {
      email: 'manager@company.com',
      name: 'Manager User',
      role: 'manager'
    },
    employee: {
      email: 'employee@company.com',
      name: 'Employee User',
      role: 'employee'
    }
  },

  reportCriteria: {
    monthly: {
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      reportType: 'Monthly Summary'
    },
    quarterly: {
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      reportType: 'Quarterly Report'
    },
    custom: {
      startDate: '2025-01-15',
      endDate: '2025-01-25',
      reportType: 'Custom Range'
    }
  },

  departments: [
    'Engineering',
    'Marketing',
    'Sales',
    'Human Resources',
    'Finance'
  ],

  reportTypes: [
    'Monthly Summary',
    'Quarterly Report',
    'Annual Review',
    'Custom Range',
    'Department Specific'
  ]
};

export const mockApiResponses = {
  dashboard: {
    stats: {
      totalEmployees: 150,
      activeProjects: 12,
      completedTasks: 342,
      pendingReports: 5
    }
  },

  reports: {
    sampleData: [
      {
        id: 1,
        employee: 'John Doe',
        department: 'Engineering',
        hoursWorked: 40,
        tasksCompleted: 8,
        efficiency: 95
      },
      {
        id: 2,
        employee: 'Jane Smith',
        department: 'Marketing',
        hoursWorked: 38,
        tasksCompleted: 12,
        efficiency: 92
      }
    ]
  }
};
