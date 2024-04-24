import {
  LayoutDashboard,
  Newspaper,
  School,
  Users,
  Kanban,
  FileEdit,
  HeartPulse,
  Award,
  Sheet,
  Timer,
  BookOpenCheck,
  LayoutPanelTop,
  GraduationCap,
  ListTodo,
  PieChart,
  CalendarRange,
  Contact,
  HeartHandshake,
  Repeat2,
} from "lucide-react";

import { SideNavItem } from "@/lib/types";

export const ADMIN_SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },

  {
    title: "School",
    path: "/admin",
    icon: <School />,
    submenu: true,
    subMenuItems: [
      {
        // acadmic year or school year both can be used as a name here
        title: "Academic Year",
        path: "/admin/school-calender/manage-year",
      },
      {
        title: "Academic Term",
        path: "/admin/school-calender/manage-term",
      },
      {
        title: "Admission Calendar ",
        path: "/admin/school-calender/manage-admissions",
      },
      { title: "Branch Management", path: "/admin/branch-setup" },
      { title: "Campus Management", path: "/admin/campus-setup" },
      { title: "Department Management", path: "/admin/department-setup" },
      { title: "Grade Management", path: "/admin/grade-setup" },
      { title: "Section Management", path: "/admin/section-setup" },
      { title: "Roll Over", path: "/admin/roll-over" },
    ],
  },
  // {
  //   title: "Roll Over",
  //   path: "/admin/roll-over",
  //   icon: <Repeat2 />,
  // },
  {
    title: "Admissions",
    path: "/admin/admissions",
    icon: <FileEdit />,
    submenu: true,
    subMenuItems: [
      { title: "View Admissions", path: "/admin/admissions/view-admissions" },
      {
        title: "Booking Management",
        path: "/admin/admissions/view-timeslot",
      },
    ],
  },
  {
    title: "User Management",
    path: "/admin/users",
    icon: <Users />,
  },

  {
    title: "Student Management",
    path: "/admin/student-management",
    icon: <Contact />,
    submenu: true,
    subMenuItems: [
      {
        title: "Assign Section",
        path: "/admin/student-management/section-assignment",
      },

      {
        title: "Student Information",
        path: "/admin/student-management/students",
      },
      {
        title: "Import Students",
        path: "/admin/student-management/mid-year-transfer",
      },
    ],
  },
  {
    title: "Lessons",
    path: "/admin/lesson-management",
    icon: <BookOpenCheck />,
    submenu: true,
    subMenuItems: [
      { title: "Lesson Management", path: "/admin/lesson-management/lesson" },
      {
        title: "Assign Lessons",
        path: "/admin/lesson-management/assign-lessons",
      },
    ],
  },

  {
    title: "Attendence",
    path: "/admin/attendence",
    icon: <ListTodo />,
  },
  {
    title: "Grading",
    path: "/admin/grading",
    icon: <GraduationCap />,
    submenu: true,
    subMenuItems: [
      {
        title: "Create Assessments",
        path: "/admin/grading/create-assessments",
      },
      {
        title: "View/Edit Grades",
        path: "/admin/grading/view-grades",
      },
    ],
  },
  {
    title: "Progress",
    path: "/admin/progress",
    icon: <PieChart />,
  },

  {
    title: "Ticket support",
    path: "/admin/support",
    icon: <HeartHandshake />,
  },
  {
    title: "Reports",
    path: "/admin/reports",
    icon: <Kanban />,
  },

  {
    title: "Incident Report",
    path: "/admin/incident-report",
    icon: <HeartPulse />,
  },
  {
    title: "Dismissal",
    path: "/admin/dismissal",
    icon: <Timer />,
  },
  {
    title: "Rewards",
    path: "/admin/rewards",
    icon: <Award />,
  },
  {
    title: "Feed",
    path: "/admin/feed",
    icon: <Newspaper />,
  },
];

export const TEACHER_SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/teacher/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    title: "Attendence",
    path: "/teacher/attendence",
    icon: <Users />,
  },
  {
    title: "Grading",
    path: "/teacher/grading",
    icon: <GraduationCap />,
    submenu: true,
    subMenuItems: [
      {
        title: "View Grades",
        path: "/teacher/grading/view-grades",
      },
      // {
      //   title: "Mark Grades",
      //   path: "/admin/grading/mark-grades",
      // },
      {
        title: "Create Assessments",
        path: "/teacher/grading/create-assessments",
      },
      // {
      //   title: "Grading key",
      //   path: "/admin/grading/grading-key",
      // },
    ],
  },
  {
    title: "Dismissal Request",
    path: "/teacher/dismissal",
    icon: <Timer />,
  },
  {
    title: "Progress",
    path: "/teacher/progress",
    icon: <PieChart />,
  },
  {
    title: "Reports",
    path: "/teacher/reports",
    icon: <Kanban />,
  },

  {
    title: "Rewards",
    path: "/teacher/rewards",
    icon: <Award />,
  },
  {
    title: "Reports",
    path: "/teacher/report",
    icon: <HeartHandshake />,
  },
];

export const PARENT_SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/parent/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    title: "Attendence",
    path: "/parent/attendance",
    icon: <Users />,
  },
  {
    title: "Progress",
    path: "/parent/progress",
    icon: <PieChart />,
  },
  {
    title: "Rewards",
    path: "/parent/rewards",
    icon: <Award />,
  },

  {
    title: "Reports",
    path: "/parent/report",
    icon: <Kanban />,
  },
  {
    title: "Incident Report",
    path: "/parent/incident-report",
    icon: <HeartPulse />,
  },
  {
    title: "Dismissal Request",
    path: "/parent/dismissal",
    icon: <Timer />,
  },

  {
    title: "School Feed",
    path: "/parent/feed",
    icon: <Newspaper />,
  },
  {
    title: "Ticket support",
    path: "/parent/support",
    icon: <HeartHandshake />,
  },
];

export const ACADEMICS_SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/academics/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    title: "School",
    path: "/academics",
    icon: <School />,
    submenu: true,
    subMenuItems: [
      { title: "Department management", path: "/academics/department-setup" },
      { title: "Grade management", path: "/academics/grade-setup" },
      { title: "Section management", path: "/academics/section-setup" },
    ],
  },
  {
    title: "Student Management",
    path: "/academics/student-management",
    icon: <Contact />,
    submenu: true,
    subMenuItems: [
      {
        title: "Assign section",
        path: "/academics/student-management/section-assignment",
      },

      {
        title: "Students",
        path: "/academics/student-management/students",
        icon: <Users />,
      },
    ],
  },
  {
    title: "Admissions",
    path: "/academics/admissions",
    icon: <FileEdit />,
    submenu: true,
    subMenuItems: [
      {
        title: "Time slot management",
        path: "/academics/admissions/view-timeslot",
      },
    ],
  },
  {
    title: "Attendence",
    path: "/academics/attendence",
    icon: <ListTodo />,
  },
  {
    title: "Grading",
    path: "/academics/grading",
    icon: <GraduationCap />,
    submenu: true,
    subMenuItems: [
      {
        title: "View Grades",
        path: "/academics/grading/view-grades",
      },
      // {
      //   title: "Mark Grades",
      //   path: "/admin/grading/mark-grades",
      // },
      {
        title: "Create Assessments",
        path: "/academics/grading/create-assessments",
      },
      // {
      //   title: "Grading key",
      //   path: "/admin/grading/grading-key",
      // },
    ],
  },
  {
    title: "Feed",
    path: "/academics/feed",
    icon: <Newspaper />,
  },
  {
    title: "Progress",
    path: "/academics/progress",
    icon: <PieChart />,
  },
  {
    title: "Dismissal Request",
    path: "/academics/dismissal",
    icon: <Timer />,
  },
];

export const NURSE_SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/nurse/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    title: "Incident Report",
    path: "/nurse/incident-report",
    icon: <HeartPulse />,
  },
];

export const ADMISSION_TEAM_SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/admissionsTeam/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    title: "Admissions",
    path: "/admissionsTeam/admissions",
    icon: <FileEdit />,
    submenu: true,
    subMenuItems: [
      {
        title: "View admissions",
        path: "/admissionsTeam/admissions/view-admissions",
      },
    ],
  },
];
