<script lang="ts">
  import { user, logout } from '$lib/auth';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let showDropdown = false;
  let dropdownRef: HTMLDivElement;

  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
      showDropdown = false;
    }
  }

  async function handleLogout() {
    showDropdown = false;
    await logout();
    goto('/login');
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<nav class="bg-primary text-white p-4">
  <div class="container mx-auto flex justify-between items-center">
    <div>
      <a href="/" class="font-bold text-xl">GBI Pondok Gede Plaza</a>
    </div>
    
    <div class="flex space-x-4 items-center">
      {#if $user}
        <a href="/activities" class="hover:text-secondary {$page.url.pathname.includes('/activities') ? 'font-bold underline' : ''}">
          Activities
        </a>
        {#if $user.role === 'admin' || $user.role === 'leader'}
          <a href="/users" class="hover:text-secondary {$page.url.pathname.includes('/users') ? 'font-bold underline' : ''}">
            Users
          </a>
          <a href="/checklists" class="hover:text-secondary {$page.url.pathname.includes('/checklists') ? 'font-bold underline' : ''}">
            Checklists
          </a>
          <!-- <a href="/colors" class="hover:text-secondary {$page.url.pathname.includes('/colors') ? 'font-bold underline' : ''}">
            Colors
          </a> -->
        {/if}
        
        <!-- User Profile Dropdown -->
        <div class="relative" bind:this={dropdownRef}>
          <button
            on:click={() => showDropdown = !showDropdown}
            class="flex items-center space-x-1 font-medium bg-secondary text-primary px-3 py-1.5 rounded hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
          >
            <span>Hi, {$user.username}</span>
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {#if showDropdown}
            <div class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div class="py-1">
                <button
                  on:click={handleLogout}
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  Logout
                </button>
              </div>
            </div>
          {/if}
        </div>
      {:else}
        <a href="/login" class="hover:text-secondary {$page.url.pathname.includes('/login') ? 'font-bold underline' : ''}">
          Login
        </a>
        <a href="/register" class="hover:text-secondary {$page.url.pathname.includes('/register') ? 'font-bold underline' : ''}">
          Register
        </a>
      {/if}
    </div>
  </div>
</nav> 