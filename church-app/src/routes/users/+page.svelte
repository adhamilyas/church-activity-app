<script lang="ts">
  import { onMount } from 'svelte';
  import { getUsers } from '$lib/api';
  import { user as currentUser } from '$lib/auth';
  import type { User } from '$lib/types';
  
  let users: User[] = [];
  let loading = true;
  let error = '';
  
  onMount(async () => {
    try {
      users = await getUsers();
    } catch (err) {
      console.error('Error fetching users:', err);
      error = 'Failed to load users';
    } finally {
      loading = false;
    }
  });
  
  // Helper function to get badge color based on role
  function getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'leader':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
</script>

<div>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-2xl font-bold">Users</h1>
    <a 
      href="/register" 
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Add New User
    </a>
  </div>
  
  {#if loading}
    <div class="text-center py-10">
      <p>Loading users...</p>
    </div>
  {:else if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {:else if users.length === 0}
    <div class="text-center py-10 bg-gray-50 rounded-lg">
      <p class="text-gray-500">No users found</p>
    </div>
  {:else}
    <div class="bg-white shadow overflow-hidden rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Username
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            {#if $currentUser?.role === 'admin'}
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            {/if}
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each users as user}
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{user.full_name}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{user.username}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{user.email || '-'}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                  {user.role}
                </span>
              </td>
              {#if $currentUser?.role === 'admin'}
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a href="/users/{user.id}/edit" class="text-blue-600 hover:text-blue-900 mr-3">Edit</a>
                </td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div> 