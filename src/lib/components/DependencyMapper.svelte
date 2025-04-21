<script lang="ts">
  import { dependencies } from '$lib/stores';
  import { onMount } from 'svelte';
  
  // Toggle the expansion of a dependency
  function toggleExpand(id: number) {
    $dependencies = $dependencies.map(dep => {
      if (dep.id === id) {
        return { ...dep, expanded: !dep.expanded };
      } else if (dep.children) {
        const updatedChildren = updateChildExpansion(dep.children, id);
        return { ...dep, children: updatedChildren };
      }
      return dep;
    });
  }
  
  // Recursively traverse the dependency tree to update expansion
  function updateChildExpansion(children: any[], id: number): any[] {
    return children.map(child => {
      if (child.id === id) {
        return { ...child, expanded: !child.expanded };
      } else if (child.children) {
        return { ...child, children: updateChildExpansion(child.children, id) };
      }
      return child;
    });
  }
  
  // Generate a random license warning
  function getRandomLicenseWarning() {
    const warnings = [
      "Possible License Violation",
      "Patent Risk",
      "Legal Review Required",
      "License Conflict",
      "Usage Restricted"
    ];
    
    return warnings[Math.floor(Math.random() * warnings.length)];
  }
  
  // Show detailed patent information
  function showPatentDetails(patentId: string) {
    alert(`Patent Details for ${patentId}\n\nStatus: Active\nApplicant: Tech Corp.\nFiling Date: 03/15/2025\nDescription: A comprehensive patent for software dependencies and their management in modern web applications.\n\nWARNING: Use without licensing may have legal consequences.`);
  }

  // Keyboard handler for patent ID elements
  function handleKeyDown(event: KeyboardEvent, patentId: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      showPatentDetails(patentId);
    }
  }

  // Keyboard handler for header elements
  function handleHeaderKeyDown(event: KeyboardEvent, id: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpand(id);
    }
  }
</script>

<div class="dependency-mapper">
  <div class="mapper-header">
    <h3>Dependency Patent Mapper</h3>
    <p class="mapper-subtitle">Identify patented dependencies in your project</p>
  </div>
  
  <div class="dependencies-container">
    {#each $dependencies as dependency}
      <div class="dependency-item">
        <div 
          class="dependency-header" 
          on:click={() => toggleExpand(dependency.id)}
          on:keydown={(e) => handleHeaderKeyDown(e, dependency.id)}
          role="button"
          tabindex="0"
          aria-expanded={dependency.expanded}
          aria-label="Dependency: {dependency.name}"
        >
          <span class="expand-icon">{dependency.expanded ? '▼' : '▶'}</span>
          <span class="dep-name">{dependency.name}</span>
          <span 
            class="patent-id" 
            role="button" 
            tabindex="0"
            on:click|stopPropagation={() => showPatentDetails(dependency.patentId)}
            on:keydown={(e) => handleKeyDown(e, dependency.patentId)}
          >
            {dependency.patentId}
          </span>
          <span class="license-warning">{getRandomLicenseWarning()}</span>
        </div>
        
        {#if dependency.expanded && dependency.children && dependency.children.length > 0}
          <div class="children-container">
            {#each dependency.children as child}
              <div class="dependency-item child-item">
                <div 
                  class="dependency-header" 
                  on:click={() => toggleExpand(child.id)}
                  on:keydown={(e) => handleHeaderKeyDown(e, child.id)}
                  role="button"
                  tabindex="0"
                  aria-expanded={child.expanded}
                  aria-label="Dependency: {child.name}"
                >
                  <span class="expand-icon">{child.expanded ? '▼' : '▶'}</span>
                  <span class="dep-name">{child.name}</span>
                  <span 
                    class="patent-id" 
                    role="button" 
                    tabindex="0"
                    on:click|stopPropagation={() => showPatentDetails(child.patentId)}
                    on:keydown={(e) => handleKeyDown(e, child.patentId)}
                  >
                    {child.patentId}
                  </span>
                  <span class="license-warning">{getRandomLicenseWarning()}</span>
                </div>
                
                {#if child.expanded && child.children && child.children.length > 0}
                  <div class="children-container">
                    {#each child.children as grandchild}
                      <div class="dependency-item grandchild-item">
                        <div class="dependency-header">
                          <span class="expand-icon invisible">▶</span>
                          <span class="dep-name">{grandchild.name}</span>
                          <span 
                            class="patent-id" 
                            role="button" 
                            tabindex="0"
                            on:click|stopPropagation={() => showPatentDetails(grandchild.patentId)}
                            on:keydown={(e) => handleKeyDown(e, grandchild.patentId)}
                          >
                            {grandchild.patentId}
                          </span>
                          <span class="license-warning">{getRandomLicenseWarning()}</span>
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/each}
  </div>
  
  <div class="patent-disclaimer">
    <p>This tool is protected by 24 patents through the Patent Exploitation Company Patent Inc.</p>
    <p class="disclaimer-small">Using this tool implies consent to pay licensing fees.</p>
  </div>
</div>

<style lang="scss">
  .dependency-mapper {
    background-color: #1e1e1e;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 1rem;
    margin-top: 1rem;
  }
  
  .mapper-header {
    margin-bottom: 1rem;
    
    h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
    }
  }
  
  .mapper-subtitle {
    font-size: 0.8rem;
    color: #888;
    margin: 0;
  }
  
  .dependencies-container {
    border: 1px solid #333;
    border-radius: 4px;
    padding: 0.5rem;
    margin-bottom: 1rem;
    max-height: 300px;
    overflow-y: auto;
  }
  
  .dependency-item {
    margin-bottom: 0.5rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .dependency-header {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    background-color: #252525;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: #2a2a2a;
    }
  }
  
  .expand-icon {
    margin-right: 0.5rem;
    font-size: 0.8rem;
    color: #888;
    width: 16px;
    text-align: center;
    
    &.invisible {
      visibility: hidden;
    }
  }
  
  .dep-name {
    flex: 1;
    font-weight: bold;
  }
  
  .patent-id {
    margin-right: 1rem;
    font-family: monospace;
    font-size: 0.8rem;
    color: #0078d4;
    cursor: help;
    padding: 2px 4px;
    border-radius: 3px;
    background-color: rgba(0, 120, 212, 0.1);
    
    &:hover {
      text-decoration: underline;
      background-color: rgba(0, 120, 212, 0.2);
    }
  }
  
  .license-warning {
    font-size: 0.75rem;
    padding: 2px 6px;
    background-color: rgba(255, 152, 0, 0.2);
    color: #ff9800;
    border-radius: 10px;
  }
  
  .children-container {
    margin-left: 1.5rem;
    padding-left: 1rem;
    border-left: 1px dashed #444;
    margin-top: 0.5rem;
  }
  
  .child-item {
    margin-bottom: 0.3rem;
  }
  
  .grandchild-item {
    margin-bottom: 0.2rem;
  }
  
  .patent-disclaimer {
    font-size: 0.8rem;
    color: #888;
    margin-top: 1rem;
    border-top: 1px solid #333;
    padding-top: 1rem;
    
    p {
      margin: 0.2rem 0;
    }
  }
  
  .disclaimer-small {
    font-size: 0.7rem;
    color: #666;
    font-style: italic;
  }
</style>