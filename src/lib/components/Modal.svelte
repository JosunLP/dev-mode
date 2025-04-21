<script lang="ts">
  import { modalStore } from '$lib/stores';
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';

  let modalElement: HTMLDivElement;

  function closeModal() {
    modalStore.close();
  }
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }
  
  onMount(() => {
    if (modalElement) {
      modalElement.focus();
    }
  });
</script>

{#if $modalStore.open}
  <!-- Overlay -->
  <div 
    class="modal-overlay" 
    on:click={closeModal}
    on:keydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
    transition:fade={{ duration: 200 }}
  >
    <!-- Modal Content -->
    <div 
      class="modal-content" 
      bind:this={modalElement}
      transition:fly={{ y: -30, duration: 300 }}
      on:click|stopPropagation={() => {}}
      tabindex="0"
      aria-labelledby="modal-title"
      role="document"
    >
      <div class="modal-header">
        <h2 id="modal-title" class="trademark-text">{$modalStore.title}</h2>
        <button 
          class="modal-close" 
          on:click={closeModal} 
          aria-label="Schließen"
        >&times;</button>
      </div>
      
      <div class="modal-body">
        {#if $modalStore.isHtml}
          {@html $modalStore.message}
        {:else}
          <p>{$modalStore.message}</p>
        {/if}
      </div>
      
      <div class="modal-footer">
        {#if $modalStore.showCancel}
          <button class="btn" on:click={closeModal}>Abbrechen</button>
        {/if}
        <button class="btn btn-primary" on:click={closeModal}>OK</button>
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(2px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-content {
    background-color: #252526;
    border-radius: 6px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 450px;
    max-height: 90vh;
    overflow-y: auto;
    border: 1px solid #474747;
  }
  
  .modal-header {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #474747;
    background-color: #333333;
    
    h2 {
      margin: 0;
      color: #f14c4c;
      font-size: 1.25rem;
    }
  }
  
  .modal-close {
    background: transparent;
    border: none;
    color: #a0a0a0;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    
    &:hover {
      color: #e0e0e0;
    }
  }
  
  .modal-body {
    padding: 1.5rem;
    max-height: 60vh;
    overflow-y: auto;
    
    p {
      margin: 0 0 1rem 0;
      line-height: 1.6;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    // Stile für die Protestnote
    .protest-paragraph {
      margin-bottom: 1rem;
      line-height: 1.6;
    }
    
    .protest-highlight {
      font-weight: bold;
      padding: 0.5rem;
      background-color: rgba(0, 120, 212, 0.1);
      border-left: 3px solid #0078d4;
      margin-left: -0.5rem;
      margin-right: -0.5rem;
    }
    
    .protest-demand {
      font-weight: bold;
      color: #f14c4c;
    }
    
    .protest-signature {
      margin-top: 2rem;
      font-style: italic;
      border-top: 1px solid #333;
      padding-top: 1rem;
    }
  }
  
  .modal-footer {
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    border-top: 1px solid #474747;
  }
</style>