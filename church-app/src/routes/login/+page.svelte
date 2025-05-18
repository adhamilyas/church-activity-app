<script lang="ts">
  import { loginUser } from '$lib/api';
  import { user } from '$lib/auth';
  import { goto } from '$app/navigation';
  
  let username = '';
  let password = '';
  let error = '';
  let loading = false;
  
  async function handleLogin() {
    if (!username || !password) {
      error = 'Please enter both username and password';
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      const userData = await loginUser(username, password);
      
      if (userData) {
        user.set(userData);
        goto('/activities');
      } else {
        error = 'Invalid username or password';
      }
    } catch (err) {
      console.error('Login error:', err);
      error = 'An error occurred during login';
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
  <h1 class="text-2xl font-bold text-center text-primary mb-6">Login</h1>
  
  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}
  
  <form on:submit|preventDefault={handleLogin} class="space-y-4">
    <div>
      <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
      <input
        type="text"
        id="username"
        bind:value={username}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        placeholder="Username"
      />
    </div>
    
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <input
        type="password"
        id="password"
        bind:value={password}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        placeholder="Password"
      />
    </div>
    
    <button
      type="submit"
      disabled={loading}
      class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
    >
      {loading ? 'Logging in...' : 'Login'}
    </button>
  </form>
  
  <div class="mt-4 text-center text-sm text-gray-600">
    Don't have an account? <a href="/register" class="text-primary hover:underline">Register</a>
  </div>
</div> 