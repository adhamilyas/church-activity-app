<script>
  // Color palette
  const colors = [
    { name: 'Primary', class: 'bg-primary', hex: '#900C27' },
    { name: 'Primary Light', class: 'bg-primary-light', hex: '#B01030' },
    { name: 'Primary Dark', class: 'bg-primary-dark', hex: '#700920' },
    { name: 'Secondary', class: 'bg-secondary', hex: '#F6C667' },
    { name: 'Secondary Light', class: 'bg-secondary-light', hex: '#F8D288' },
    { name: 'Secondary Dark', class: 'bg-secondary-dark', hex: '#E5B656' },
    { name: 'Background', class: 'bg-background', hex: '#F1F8FD' },
  ];
</script>

<div class="p-8">
  <h1 class="text-3xl font-bold text-primary mb-8">Color Palette</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each colors as color}
      <div class="rounded-lg overflow-hidden shadow-md">
        <div class={`${color.class} h-32 flex items-end p-4`}>
          <span class={color.name === 'Background' ? 'text-primary font-medium' : 'text-white font-medium'}>
            {color.name}
          </span>
        </div>
        <div class="bg-white p-4">
          <p class="font-mono text-sm">{color.hex}</p>
          <p class="font-mono text-sm text-gray-600">{color.class}</p>
        </div>
      </div>
    {/each}
  </div>
  
  <div class="mt-12 space-y-8">
    <div>
      <h2 class="text-2xl font-bold text-primary mb-4">Button Examples</h2>
      <div class="flex flex-wrap gap-4">
        <button class="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded">
          Primary Button
        </button>
        <button class="bg-secondary hover:bg-secondary-dark text-primary font-bold py-2 px-4 rounded">
          Secondary Button
        </button>
        <button class="bg-white border-2 border-primary hover:bg-primary hover:text-white text-primary font-bold py-2 px-4 rounded">
          Outlined Button
        </button>
      </div>
    </div>
    
    <div>
      <h2 class="text-2xl font-bold text-primary mb-4">Text Examples</h2>
      <p class="text-primary text-lg mb-2">This is primary text</p>
      <p class="text-secondary-dark text-lg mb-2">This is secondary dark text</p>
      <p class="text-gray-700 text-lg">This is regular text</p>
    </div>
    
    <div>
      <h2 class="text-2xl font-bold text-primary mb-4">Card Example</h2>
      <div class="bg-white rounded-lg shadow-md p-6 border-t-4 border-primary max-w-md">
        <h3 class="text-xl font-bold text-primary mb-2">Card Title</h3>
        <p class="text-gray-700 mb-4">This is a sample card using your color palette. The border at the top uses your primary color.</p>
        <button class="bg-secondary hover:bg-secondary-dark text-primary font-bold py-2 px-4 rounded">
          Learn More
        </button>
      </div>
    </div>
  </div>
</div> 