<script lang="ts">
  import { onMount } from 'svelte';
  import { getActivities } from '$lib/api';
  import { user } from '$lib/auth';
  import type { Activity } from '$lib/types';
  
  let activities: Activity[] = [];
  let loading = true;
  let error = '';
  
  onMount(async () => {
    try {
      activities = await getActivities();
    } catch (err) {
      console.error('Error fetching activities:', err);
      error = 'Failed to load activities';
    } finally {
      loading = false;
    }
  });
  
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
</script>

<div>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold text-primary">Youth Activities</h1>
    {#if $user && ($user.role === 'admin' || $user.role === 'leader')}
      <a 
        href="/activities/new" 
        class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
      >
        Create New Activity
      </a>
    {/if}
  </div>
  
  {#if loading}
    <div class="text-center py-10">
      <p>Loading activities...</p>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {:else if activities.length === 0}
    <div class="text-center py-10 bg-background rounded-lg">
      <p class="text-gray-500">No activities found</p>
      {#if $user && ($user.role === 'admin' || $user.role === 'leader')}
        <p class="mt-2">
          <a href="/activities/new" class="text-primary hover:underline">Create your first activity</a>
        </p>
      {/if}
    </div>
  {:else}
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each activities as activity}
        <a 
          href="/activities/{activity.id}" 
          class="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-background"
        >
          <h5 class="mb-2 text-xl font-bold tracking-tight text-primary">
            {activity.title}
          </h5>
          <p class="font-normal text-gray-700 mb-3">
            {activity.description || 'No description'}
          </p>
          <div class="flex items-center text-sm text-gray-500 space-x-4">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(activity.scheduled_date)}
            </div>
            {#if activity.location}
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {activity.location}
              </div>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  {/if}
</div> 