<script>
  import { user, logout } from '$lib/auth';
  import { page } from '$app/stores';
</script>

<nav class="bg-blue-600 text-white p-4">
  <div class="container mx-auto flex justify-between items-center">
    <div>
      <a href="/" class="font-bold text-xl">Church Youth App</a>
    </div>
    
    <div class="flex space-x-4">
      {#if $user}
        <a href="/activities" class="hover:text-blue-200 {$page.url.pathname.includes('/activities') ? 'font-bold underline' : ''}">
          Activities
        </a>
        {#if $user.role === 'admin' || $user.role === 'leader'}
          <a href="/users" class="hover:text-blue-200 {$page.url.pathname.includes('/users') ? 'font-bold underline' : ''}">
            Users
          </a>
          <a href="/checklists" class="hover:text-blue-200 {$page.url.pathname.includes('/checklists') ? 'font-bold underline' : ''}">
            Checklists
          </a>
        {/if}
        <button on:click={logout} class="hover:text-blue-200">Logout</button>
        <span class="ml-4 font-medium">Hi, {$user.username}</span>
      {:else}
        <a href="/login" class="hover:text-blue-200 {$page.url.pathname.includes('/login') ? 'font-bold underline' : ''}">
          Login
        </a>
        <a href="/register" class="hover:text-blue-200 {$page.url.pathname.includes('/register') ? 'font-bold underline' : ''}">
          Register
        </a>
      {/if}
    </div>
  </div>
</nav> 