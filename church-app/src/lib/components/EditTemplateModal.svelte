<script lang="ts">
  import type { ChecklistTemplate, ChecklistItem, User } from '$lib/types';
  import { updateChecklistTemplate } from '$lib/api';
  
  export let template: ChecklistTemplate & { items?: ChecklistItem[] };
  export let show: boolean;
  export let onClose: () => void;
  export let onUpdate: () => void;
  export let users: User[] = [];
  
  let loading = false;
  let error = '';
  let formData = {
    name: template.name,
    items: template.items?.map(item => ({
      description: item.description,
      notes: item.notes || '',
      pic_user_id: item.pic_user_id || '',
      order_num: item.order_num
    })) || []
  };

  function addItem() {
    formData.items = [
      ...formData.items,
      {
        description: '',
        notes: '',
        pic_user_id: '',
        order_num: formData.items.length + 1
      }
    ];
  }

  function removeItem(index: number) {
    formData.items = formData.items.filter((_, i) => i !== index)
      .map((item, i) => ({ ...item, order_num: i + 1 }));
  }

  function moveItemUp(index: number) {
    if (index === 0) return;
    const newItems = [...formData.items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    formData.items = newItems.map((item, i) => ({ ...item, order_num: i + 1 }));
  }

  function moveItemDown(index: number) {
    if (index === formData.items.length - 1) return;
    const newItems = [...formData.items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    formData.items = newItems.map((item, i) => ({ ...item, order_num: i + 1 }));
  }

  async function handleSubmit() {
    loading = true;
    error = '';
    
    try {
      // Filter out empty items
      const validItems = formData.items.filter(item => item.description.trim() !== '');
      
      await updateChecklistTemplate(template.id, {
        name: formData.name,
        items: validItems
      });
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Error updating template:', err);
      error = 'Failed to update template';
    } finally {
      loading = false;
    }
  }

  function handleClose(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
</script>

{#if show}
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    on:click={handleClose}
  >
    <div class="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Edit Template</h2>
        <button 
          on:click={onClose}
          class="text-gray-500 hover:text-gray-700"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {#if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      {/if}

      <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Template Name</label>
          <input
            type="text"
            id="name"
            bind:value={formData.name}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            required
          />
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <label class="block text-sm font-medium text-gray-700">Checklist Items</label>
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
            {#each formData.items as item, index}
              <div class="p-4 border rounded-md bg-gray-50">
                <div class="flex items-start gap-4">
                  <span class="text-gray-500 w-6">{index + 1}.</span>
                  <div class="flex-grow space-y-4">
                    <input
                      type="text"
                      bind:value={item.description}
                      placeholder="Item description"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      required
                    />
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                          bind:value={item.notes}
                          placeholder="Additional notes"
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
                  <div class="flex flex-col space-y-1">
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
                      disabled={index === formData.items.length - 1}
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
              </div>
            {/each}
          </div>
        </div>

        <div class="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            on:click={onClose}
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if} 