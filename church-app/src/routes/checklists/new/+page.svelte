<script lang="ts">
  import { createChecklistTemplate } from '$lib/api';
  import { user } from '$lib/auth';
  import { goto } from '$app/navigation';
  import { getUsers } from '$lib/api';
  import { onMount } from 'svelte';
  import type { User } from '$lib/types';
  
  let templateName = '';
  let items: { description: string; notes: string; pic_user_id: string; order_num: number }[] = [{ description: '', notes: '', pic_user_id: '', order_num: 1 }];
  let error = '';
  let loading = false;
  let users: User[] = [];
  
  onMount(async () => {
    try {
      users = await getUsers();
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  });
  
  function addItem() {
    items = [...items, { description: '', notes: '', pic_user_id: '', order_num: items.length + 1 }];
  }
  
  function removeItem(index: number) {
    items = items.filter((_, i) => i !== index).map((item, i) => ({ ...item, order_num: i + 1 }));
  }
  
  function moveItemUp(index: number) {
    if (index === 0) return;
    
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = { ...newItems[index - 1], order_num: index + 1 };
    newItems[index - 1] = { ...temp, order_num: index };
    
    items = newItems;
  }
  
  function moveItemDown(index: number) {
    if (index === items.length - 1) return;
    
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = { ...newItems[index + 1], order_num: index + 1 };
    newItems[index + 1] = { ...temp, order_num: index + 2 };
    
    items = newItems;
  }
  
  async function handleSubmit() {
    if (!templateName) {
      error = 'Please enter a template name';
      return;
    }
    
    // Filter out empty items
    const validItems = items.filter(item => item.description.trim() !== '');
    
    if (validItems.length === 0) {
      error = 'Please add at least one checklist item';
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      if ($user) {
        const template = await createChecklistTemplate(
          { name: templateName, created_by: $user.id },
          validItems
        );
        
        if (template) {
          goto('/checklists');
        } else {
          error = 'Failed to create template';
        }
      }
    } catch (err) {
      console.error('Error creating template:', err);
      error = 'An error occurred while creating the template';
    } finally {
      loading = false;
    }
  }
</script>

<div>
  <div class="mb-6">
    <a href="/checklists" class="text-blue-600 hover:underline flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
      Back to Templates
    </a>
  </div>
  
  <h1 class="text-2xl font-bold mb-6">Create New Checklist Template</h1>
  
  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}
  
  <form on:submit|preventDefault={handleSubmit} class="bg-white p-6 rounded-lg shadow-md">
    <div class="space-y-6">
      <div>
        <label for="templateName" class="block text-sm font-medium text-gray-700">Template Name*</label>
        <input
          type="text"
          id="templateName"
          bind:value={templateName}
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="e.g., Sunday Service Preparation"
        />
      </div>
      
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700">Checklist Items*</label>
          <button
            type="button"
            on:click={addItem}
            class="text-blue-600 hover:text-blue-800 flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add Item
          </button>
        </div>
        
        <div class="space-y-3">
          {#each items as item, index}
            <div class="border p-4 rounded-md bg-gray-50">
              <div class="flex items-center space-x-2 mb-3">
                <span class="text-gray-500 w-6">{index + 1}.</span>
                <input
                  type="text"
                  bind:value={item.description}
                  placeholder="Checklist item description"
                  class="flex-grow rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
                <div class="flex space-x-1">
                  <button
                    type="button"
                    on:click={() => moveItemUp(index)}
                    disabled={index === 0}
                    class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    on:click={() => moveItemDown(index)}
                    disabled={index === items.length - 1}
                    class="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    on:click={() => removeItem(index)}
                    class="p-1 text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    bind:value={item.notes}
                    placeholder="Additional notes or instructions"
                    rows="2"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Person In Charge</label>
                  <select
                    bind:value={item.pic_user_id}
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  >
                    <option value="">-- Select Person --</option>
                    {#each users.filter(u => u.role === 'leader' || u.role === 'admin' || u.role === 'member') as user}
                      <option value={user.id}>{user.full_name}</option>
                    {/each}
                  </select>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
      
      <div class="flex justify-end pt-4">
        <button
          type="button"
          on:click={() => goto('/checklists')}
          class="mr-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Template'}
        </button>
      </div>
    </div>
  </form>
</div> 