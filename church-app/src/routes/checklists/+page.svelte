<script lang="ts">
  import { onMount } from 'svelte';
  import { getChecklistTemplates, getChecklistTemplateWithItems } from '$lib/api';
  import { user } from '$lib/auth';
  import type { ChecklistTemplate } from '$lib/types';
  
  let templates: ChecklistTemplate[] = [];
  let selectedTemplate: ChecklistTemplate | null = null;
  let loading = true;
  let error = '';
  
  onMount(async () => {
    try {
      templates = await getChecklistTemplates();
    } catch (err) {
      console.error('Error fetching templates:', err);
      error = 'Failed to load checklist templates';
    } finally {
      loading = false;
    }
  });
  
  async function viewTemplate(templateId: string) {
    try {
      selectedTemplate = await getChecklistTemplateWithItems(templateId);
    } catch (err) {
      console.error('Error fetching template details:', err);
    }
  }
</script>

<div>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">Checklist Templates</h1>
    <a 
      href="/checklists/new" 
      class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
    >
      Create New Template
    </a>
  </div>
  
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Templates List -->
    <div class="md:col-span-1 bg-white p-4 rounded-lg shadow">
      <h2 class="font-bold text-lg mb-4">Templates</h2>
      
      {#if loading}
        <p class="text-center py-4">Loading templates...</p>
      {:else if error}
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      {:else if templates.length === 0}
        <p class="text-center py-4 text-gray-500">No templates found</p>
        <p class="text-center">
          <a href="/checklists/new" class="text-blue-600 hover:underline">Create your first template</a>
        </p>
      {:else}
        <ul class="space-y-2">
          {#each templates as template}
            <li>
              <button 
                on:click={() => viewTemplate(template.id)}
                class="w-full text-left p-2 rounded hover:bg-gray-100 {selectedTemplate?.id === template.id ? 'bg-blue-100' : ''}"
              >
                {template.name}
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
    
    <!-- Template Details -->
    <div class="md:col-span-3 bg-white p-6 rounded-lg shadow">
      {#if selectedTemplate}
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">{selectedTemplate.name}</h2>
          <a 
            href="/checklists/{selectedTemplate.id}/edit" 
            class="text-blue-600 hover:underline flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </a>
        </div>
        
        {#if selectedTemplate.items && selectedTemplate.items.length > 0}
          <ul class="space-y-2 mt-4">
            {#each selectedTemplate.items as item}
              <li class="p-2 border-b border-gray-200 flex">
                <span class="w-8 text-gray-400">{item.order_num}.</span>
                <span>{item.description}</span>
              </li>
            {/each}
          </ul>
        {:else}
          <p class="text-center py-4 text-gray-500">No items in this template</p>
        {/if}
      {:else}
        <div class="text-center py-10">
          <p class="text-gray-500">Select a template to view details</p>
        </div>
      {/if}
    </div>
  </div>
</div> 