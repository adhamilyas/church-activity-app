import { supabase } from './supabase';
import type { User, Activity, Attendance, ChecklistTemplate, ChecklistItem, ActivityChecklist, ActivityChecklistItem } from './types';

// User Functions
export async function registerUser(userData: Omit<User, 'id' | 'created_at'>): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();
  
  if (error) {
    console.error('Error registering user:', error);
    return null;
  }
  
  return data;
}

export async function loginUser(username: string, password: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('username', username)
    .eq('password', password)
    .single();
  
  if (error || !data) {
    console.error('Error logging in:', error);
    return null;
  }
  
  return data;
}

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase
    .from('users')
    .select()
    .order('full_name', { ascending: true });
  
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  
  return data || [];
}

// Activity Functions
export async function createActivity(activityData: Omit<Activity, 'id' | 'created_at'>): Promise<Activity | null> {
  const { data, error } = await supabase
    .from('activities')
    .insert(activityData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating activity:', error);
    return null;
  }
  
  return data;
}

export async function getActivities(): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select()
    .order('scheduled_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
  
  return data || [];
}

export async function getActivity(id: string): Promise<Activity | null> {
  const { data, error } = await supabase
    .from('activities')
    .select()
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching activity:', error);
    return null;
  }
  
  return data;
}

// Attendance Functions
export async function markAttendance(attendanceData: Omit<Attendance, 'id' | 'created_at'>): Promise<Attendance | null> {
  const { data, error } = await supabase
    .from('attendance')
    .upsert(attendanceData, { onConflict: 'activity_id,user_id' })
    .select()
    .single();
  
  if (error) {
    console.error('Error marking attendance:', error);
    return null;
  }
  
  return data;
}

export async function getAttendanceForActivity(activityId: string): Promise<Attendance[]> {
  const { data, error } = await supabase
    .from('attendance')
    .select(`
      *,
      user:users(id, username, full_name, role)
    `)
    .eq('activity_id', activityId);
  
  if (error) {
    console.error('Error fetching attendance:', error);
    return [];
  }
  
  return data || [];
}

// Checklist Template Functions
export async function createChecklistTemplate(templateData: Omit<ChecklistTemplate, 'id' | 'created_at'>, 
                                             items: Omit<ChecklistItem, 'id' | 'created_at' | 'template_id'>[]): Promise<ChecklistTemplate | null> {
  // Insert template
  const { data: template, error: templateError } = await supabase
    .from('checklist_templates')
    .insert(templateData)
    .select()
    .single();
  
  if (templateError || !template) {
    console.error('Error creating checklist template:', templateError);
    return null;
  }
  
  // Insert items
  if (items.length > 0) {
    const itemsWithTemplateId = items.map(item => ({
      ...item,
      template_id: template.id
    }));
    
    const { error: itemsError } = await supabase
      .from('checklist_items')
      .insert(itemsWithTemplateId);
    
    if (itemsError) {
      console.error('Error creating checklist items:', itemsError);
    }
  }
  
  return template;
}

export async function getChecklistTemplates(): Promise<ChecklistTemplate[]> {
  const { data, error } = await supabase
    .from('checklist_templates')
    .select()
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching checklist templates:', error);
    return [];
  }
  
  return data || [];
}

export async function getChecklistTemplateWithItems(templateId: string): Promise<ChecklistTemplate | null> {
  // Get template
  const { data: template, error: templateError } = await supabase
    .from('checklist_templates')
    .select()
    .eq('id', templateId)
    .single();
  
  if (templateError || !template) {
    console.error('Error fetching checklist template:', templateError);
    return null;
  }
  
  // Get items
  const { data: items, error: itemsError } = await supabase
    .from('checklist_items')
    .select()
    .eq('template_id', templateId)
    .order('order_num', { ascending: true });
  
  if (itemsError) {
    console.error('Error fetching checklist items:', itemsError);
    return template;
  }
  
  return { ...template, items: items || [] };
}

// Activity Checklist Functions
export async function createActivityChecklist(activityId: string, templateId: string): Promise<ActivityChecklist | null> {
  // First insert the activity checklist
  const { data: activityChecklist, error: checklistError } = await supabase
    .from('activity_checklists')
    .insert({
      activity_id: activityId,
      template_id: templateId
    })
    .select()
    .single();
  
  if (checklistError || !activityChecklist) {
    console.error('Error creating activity checklist:', checklistError);
    return null;
  }
  
  // Get template items
  const { data: templateItems, error: itemsError } = await supabase
    .from('checklist_items')
    .select()
    .eq('template_id', templateId)
    .order('order_num', { ascending: true });
  
  if (itemsError) {
    console.error('Error fetching template items:', itemsError);
    return activityChecklist;
  }
  
  // Create activity checklist items
  if (templateItems && templateItems.length > 0) {
    const activityChecklistItems = templateItems.map(item => ({
      activity_checklist_id: activityChecklist.id,
      description: item.description,
      notes: item.notes,
      pic_user_id: item.pic_user_id,
      is_completed: false
    }));
    
    const { error } = await supabase
      .from('activity_checklist_items')
      .insert(activityChecklistItems);
    
    if (error) {
      console.error('Error creating activity checklist items:', error);
    }
  }
  
  return activityChecklist;
}

export async function getActivityChecklist(activityId: string): Promise<ActivityChecklist | null> {
  // Get checklist
  const { data: checklist, error: checklistError } = await supabase
    .from('activity_checklists')
    .select()
    .eq('activity_id', activityId)
    .single();
  
  if (checklistError || !checklist) {
    return null;
  }
  
  // Get checklist items
  const { data: items, error: itemsError } = await supabase
    .from('activity_checklist_items')
    .select()
    .eq('activity_checklist_id', checklist.id);
  
  if (itemsError) {
    console.error('Error fetching checklist items:', itemsError);
    return checklist;
  }
  
  return { ...checklist, items: items || [] };
}

export async function updateChecklistItem(itemId: string, isCompleted: boolean, userId: string): Promise<ActivityChecklistItem | null> {
  const { data, error } = await supabase
    .from('activity_checklist_items')
    .update({
      is_completed: isCompleted,
      completed_by: isCompleted ? userId : null,
      completed_at: isCompleted ? new Date().toISOString() : null
    })
    .eq('id', itemId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating checklist item:', error);
    return null;
  }
  
  return data;
} 