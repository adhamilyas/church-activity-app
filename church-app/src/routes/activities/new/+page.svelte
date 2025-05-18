<script lang="ts">
  import { createActivity } from '$lib/api';
  import { user } from '$lib/auth';
  import { goto } from '$app/navigation';
  
  let title = '';
  let description = '';
  let scheduledDate = '';
  let scheduledTime = '';
  let location = '';
  let error = '';
  let loading = false;
  
  async function handleSubmit() {
    if (!title || !scheduledDate || !scheduledTime) {
      error = 'Please fill in all required fields';
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      // Combine date and time
      const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      
      if ($user) {
        const activityData = await createActivity({
          title,
          description,
          scheduled_date: dateTime.toISOString(),
          location,
          created_by: $user.id
        });
        
        if (activityData) {
          goto('/activities');
        } else {
          error = 'Failed to create activity';
        }
      }
    } catch (err) {
      console.error('Error creating activity:', err);
      error = 'An error occurred while creating the activity';
    } finally {
      loading = false;
    }
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
  
  <h1 class="text-2xl font-bold mb-6">Create New Activity</h1>
  
  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}
  
  <form on:submit|preventDefault={handleSubmit} class="bg-white p-6 rounded-lg shadow-md">
    <div class="space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700">Title*</label>
        <input
          type="text"
          id="title"
          bind:value={title}
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          bind:value={description}
          rows={3}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        ></textarea>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="scheduledDate" class="block text-sm font-medium text-gray-700">Date*</label>
          <input
            type="date"
            id="scheduledDate"
            bind:value={scheduledDate}
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label for="scheduledTime" class="block text-sm font-medium text-gray-700">Time*</label>
          <input
            type="time"
            id="scheduledTime"
            bind:value={scheduledTime}
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label for="location" class="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          id="location"
          bind:value={location}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div class="flex justify-end pt-4">
        <button
          type="button"
          on:click={() => goto('/activities')}
          class="mr-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Activity'}
        </button>
      </div>
    </div>
  </form>
</div> 