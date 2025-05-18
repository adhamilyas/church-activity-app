<script lang="ts">
  import { registerUser } from '$lib/api';
  import { user } from '$lib/auth';
  import { goto } from '$app/navigation';
  import type { Role } from '$lib/types';
  
  let username = '';
  let password = '';
  let confirmPassword = '';
  let fullName = '';
  let email = '';
  let role: Role = 'member';
  let error = '';
  let loading = false;
  
  async function handleRegister() {
    // Validate inputs
    if (!username || !password || !confirmPassword || !fullName) {
      error = 'Please fill in all required fields';
      return;
    }
    
    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }
    
    loading = true;
    error = '';
    
    try {
      const userData = await registerUser({
        username,
        password,
        full_name: fullName,
        email: email || undefined,
        role
      });
      
      if (userData) {
        user.set(userData);
        goto('/activities');
      } else {
        error = 'Registration failed. Username may already be taken.';
      }
    } catch (err) {
      console.error('Registration error:', err);
      error = 'An error occurred during registration';
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
  <h1 class="text-2xl font-bold text-center mb-6">Register</h1>
  
  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  {/if}
  
  <form on:submit|preventDefault={handleRegister} class="space-y-4">
    <div>
      <label for="username" class="block text-sm font-medium text-gray-700">Username*</label>
      <input
        type="text"
        id="username"
        bind:value={username}
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
    
    <div>
      <label for="fullName" class="block text-sm font-medium text-gray-700">Full Name*</label>
      <input
        type="text"
        id="fullName"
        bind:value={fullName}
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
    
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        id="email"
        bind:value={email}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
    
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password*</label>
      <input
        type="password"
        id="password"
        bind:value={password}
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
    
    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password*</label>
      <input
        type="password"
        id="confirmPassword"
        bind:value={confirmPassword}
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
    
    <div>
      <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
      <select
        id="role"
        bind:value={role}
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="member">Member</option>
        <option value="leader">Leader</option>
        <option value="admin">Admin</option>
      </select>
    </div>
    
    <button
      type="submit"
      disabled={loading}
      class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
    >
      {loading ? 'Registering...' : 'Register'}
    </button>
  </form>
  
  <div class="mt-4 text-center text-sm text-gray-600">
    Already have an account? <a href="/login" class="text-blue-600 hover:underline">Login</a>
  </div>
</div> 