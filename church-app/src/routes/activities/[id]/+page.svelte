<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getActivity, getAttendanceForActivity, getUsers, markAttendance, getActivityChecklist, createActivityChecklist, getChecklistTemplates, updateChecklistItem } from '$lib/api';
  import { user } from '$lib/auth';
  import type { Activity, Attendance, User, ActivityChecklist, ChecklistTemplate, AttendanceStatus } from '$lib/types';
  
  const activityId = $page.params.id;
  
  let activity: Activity | null = null;
  let attendanceList: Attendance[] = [];
  let allUsers: User[] = [];
  let activityChecklist: ActivityChecklist | null = null;
  let checklistTemplates: ChecklistTemplate[] = [];
  let selectedTemplateId = '';
  
  let loading = {
    activity: true,
    attendance: true,
    checklist: true,
    templates: false
  };
  
  let error = {
    activity: '',
    attendance: '',
    checklist: '',
    templates: ''
  };
  
  onMount(async () => {
    // Load activity details
    try {
      activity = await getActivity(activityId);
      loading.activity = false;
    } catch (err) {
      console.error('Error loading activity:', err);
      error.activity = 'Failed to load activity details';
      loading.activity = false;
    }
    
    // Load attendance
    try {
      attendanceList = await getAttendanceForActivity(activityId);
      allUsers = await getUsers();
      loading.attendance = false;
    } catch (err) {
      console.error('Error loading attendance:', err);
      error.attendance = 'Failed to load attendance data';
      loading.attendance = false;
    }
    
    // Load checklist
    try {
      activityChecklist = await getActivityChecklist(activityId);
      loading.checklist = false;
      
      // If no checklist exists and user is admin/leader, load templates
      if (!activityChecklist && $user && ($user.role === 'admin' || $user.role === 'leader')) {
        loading.templates = true;
        checklistTemplates = await getChecklistTemplates();
        loading.templates = false;
      }
    } catch (err) {
      console.error('Error loading checklist:', err);
      error.checklist = 'Failed to load checklist data';
      loading.checklist = false;
    }
  });
  
  async function handleAttendanceChange(userId: string, status: AttendanceStatus) {
    if (!$user) return;
    
    try {
      const result = await markAttendance({
        activity_id: activityId,
        user_id: userId,
        status
      });
      
      if (result) {
        // Update attendance list
        attendanceList = attendanceList.map(item => 
          item.user_id === userId ? { ...item, status } : item
        );
        
        // If the user wasn't in the list, add them
        if (!attendanceList.some(item => item.user_id === userId)) {
          const userDetails = allUsers.find(u => u.id === userId);
          if (userDetails) {
            attendanceList = [...attendanceList, {
              id: result.id,
              activity_id: activityId,
              user_id: userId,
              status,
              created_at: result.created_at,
              user: userDetails
            }];
          }
        }
      }
    } catch (err) {
      console.error('Error marking attendance:', err);
    }
  }
  
  async function handleCreateChecklist() {
    if (!selectedTemplateId || !$user) return;
    
    try {
      activityChecklist = await createActivityChecklist(activityId, selectedTemplateId);
      if (activityChecklist) {
        // Reload checklist to get items
        activityChecklist = await getActivityChecklist(activityId);
      }
    } catch (err) {
      console.error('Error creating checklist:', err);
      error.checklist = 'Failed to create checklist';
    }
  }
  
  async function toggleChecklistItem(itemId: string, isCompleted: boolean) {
    if (!$user) return;
    
    try {
      const result = await updateChecklistItem(itemId, isCompleted, $user.id);
      
      if (result && activityChecklist?.items) {
        // Update the item in the list
        activityChecklist.items = activityChecklist.items.map(item => 
          item.id === itemId ? { ...item, is_completed: isCompleted } : item
        );
      }
    } catch (err) {
      console.error('Error updating checklist item:', err);
    }
  }
  
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Get users not in attendance list
  $: usersNotInAttendance = allUsers.filter(
    user => !attendanceList.some(attendance => attendance.user_id === user.id)
  );

  // Event handlers with proper type checking
  function handleCheckboxChange(event: Event, itemId: string) {
    const target = event.target as HTMLInputElement;
    toggleChecklistItem(itemId, target.checked);
  }

  function handleStatusChange(event: Event, userId: string) {
    const target = event.target as HTMLSelectElement;
    handleAttendanceChange(userId, target.value as AttendanceStatus);
  }
</script>

<div>
  <div class="mb-6">
    <a href="/activities" class="text-blue-600 hover:underline flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
      Back to Activities
    </a>
  </div>
  
  <!-- Activity Details -->
  {#if loading.activity}
    <div class="text-center py-10">
      <p>Loading activity details...</p>
    </div>
  {:else if error.activity}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error.activity}
    </div>
  {:else if activity}
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h1 class="text-2xl font-bold mb-2">{activity.title}</h1>
      
      <div class="flex flex-wrap text-gray-600 mb-4">
        <div class="mr-6 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(activity.scheduled_date)}
        </div>
        
        {#if activity.location}
          <div class="mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {activity.location}
          </div>
        {/if}
      </div>
      
      {#if activity.description}
        <div class="prose max-w-none">
          <p>{activity.description}</p>
        </div>
      {/if}
    </div>
  {/if}
  
  <!-- Checklist Section -->
  <div class="bg-white p-6 rounded-lg shadow-md mb-8">
    <h2 class="text-xl font-bold mb-4">Preparation Checklist</h2>
    
    {#if loading.checklist}
      <p class="text-center py-4">Loading checklist...</p>
    {:else if error.checklist}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error.checklist}
      </div>
    {:else if activityChecklist && activityChecklist.items && activityChecklist.items.length > 0}
      <ul class="space-y-2">
        {#each activityChecklist.items as item}
          <li class="flex items-center p-2 hover:bg-gray-50 rounded">
            <input
              type="checkbox"
              checked={item.is_completed}
              on:change={(e) => handleCheckboxChange(e, item.id)}
              class="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded"
              id={`item-${item.id}`}
            />
            <label for={`item-${item.id}`} class="ml-2 block text-sm text-gray-900 {item.is_completed ? 'line-through text-gray-500' : ''}">
              {item.description}
            </label>
          </li>
        {/each}
      </ul>
    {:else if $user && ($user.role === 'admin' || $user.role === 'leader')}
      <div class="text-center py-4 bg-gray-50 rounded-lg">
        <p class="text-gray-500 mb-4">No checklist has been created for this activity yet.</p>
        
        {#if loading.templates}
          <p>Loading templates...</p>
        {:else}
          <div class="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <select
              bind:value={selectedTemplateId}
              class="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a template</option>
              {#each checklistTemplates as template}
                <option value={template.id}>{template.name}</option>
              {/each}
            </select>
            
            <button
              on:click={handleCreateChecklist}
              disabled={!selectedTemplateId}
              class="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Create Checklist
            </button>
          </div>
        {/if}
      </div>
    {:else}
      <p class="text-center py-4 text-gray-500">No checklist available for this activity.</p>
    {/if}
  </div>
  
  <!-- Attendance Section -->
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Attendance</h2>
    
    {#if loading.attendance}
      <p class="text-center py-4">Loading attendance data...</p>
    {:else if error.attendance}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error.attendance}
      </div>
    {:else}
      <!-- Current Attendance -->
      {#if attendanceList.length > 0}
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {#if $user && ($user.role === 'admin' || $user.role === 'leader')}
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                {/if}
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each attendanceList as attendance}
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {attendance.user?.full_name || 'Unknown User'}
                    </div>
                    <div class="text-sm text-gray-500">
                      {attendance.user?.username || ''}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${attendance.status === 'present' ? 'bg-green-100 text-green-800' : 
                        attendance.status === 'absent' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {attendance.status}
                    </span>
                  </td>
                  {#if $user && ($user.role === 'admin' || $user.role === 'leader')}
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={attendance.status}
                        on:change={(e) => handleStatusChange(e, attendance.user_id)}
                        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                      </select>
                    </td>
                  {/if}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <p class="text-center py-4 text-gray-500">No attendance records yet.</p>
      {/if}
      
      <!-- Add Attendance (for admin/leader) -->
      {#if $user && ($user.role === 'admin' || $user.role === 'leader') && usersNotInAttendance.length > 0}
        <div class="mt-6 pt-6 border-t border-gray-200">
          <h3 class="text-lg font-medium mb-4">Add Attendance</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each usersNotInAttendance as user}
              <div class="p-4 border border-gray-200 rounded-lg">
                <div class="font-medium">{user.full_name}</div>
                <div class="text-sm text-gray-500 mb-2">{user.username}</div>
                
                <div class="flex space-x-2">
                  <button 
                    on:click={() => handleAttendanceChange(user.id, 'present')}
                    class="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
                  >
                    Present
                  </button>
                  <button 
                    on:click={() => handleAttendanceChange(user.id, 'absent')}
                    class="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
                  >
                    Absent
                  </button>
                  <button 
                    on:click={() => handleAttendanceChange(user.id, 'late')}
                    class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm hover:bg-yellow-200"
                  >
                    Late
                  </button>
                </div>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    {/if}
  </div>
</div> 