export type Role = 'admin' | 'leader' | 'member';
export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface User {
  id: string;
  username: string;
  password?: string; // Only included during registration/login
  full_name: string;
  email?: string;
  role: Role;
  created_at: string;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  scheduled_date: string;
  location?: string;
  created_by: string;
  created_at: string;
}

export interface Attendance {
  id: string;
  activity_id: string;
  user_id: string;
  status: AttendanceStatus;
  notes?: string;
  created_at: string;
  user?: User; // Joined data
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  items?: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  template_id: string;
  description: string;
  order_num: number;
  created_at: string;
}

export interface ActivityChecklist {
  id: string;
  activity_id: string;
  template_id: string;
  created_at: string;
  items?: ActivityChecklistItem[];
}

export interface ActivityChecklistItem {
  id: string;
  activity_checklist_id: string;
  description: string;
  is_completed: boolean;
  completed_by?: string;
  completed_at?: string;
  created_at: string;
} 