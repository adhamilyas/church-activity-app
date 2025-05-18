<script>
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
</script>

<div class="min-h-screen flex flex-col">
  <Navbar />
  
  <main class="flex-grow container mx-auto px-4 py-6">
    <slot />
  </main>
  
  <footer class="bg-gray-100 p-4 text-center text-gray-600 text-sm">
    <div class="container mx-auto">
      Church Youth Activity App &copy; {new Date().getFullYear()}
    </div>
  </footer>
</div> 