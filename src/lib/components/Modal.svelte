<script lang="ts">
  import { modalStore } from '$lib/stores';
  import { fade, fly } from 'svelte/transition';

  function closeModal() {
    modalStore.close();
  }
</script>

{#if $modalStore.open}
  <!-- Overlay -->
  <div class="modal-overlay" on:click={closeModal} transition:fade={{ duration: 200 }}>
    <!-- Modal Content -->
    <div 
      class="modal-content" 
      transition:fly={{ y: -30, duration: 300 }}
      on:click|stopPropagation={() => {}}
    >
      <div class="modal-header">
        <h2 class="trademark-text">{$modalStore.title}</h2>
        <button class="modal-close" on:click={closeModal}>&times;</button>
      </div>
      
      <div class="modal-body">
        <p>{$modalStore.message}</p>
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
      margin: 0;
      line-height: 1.6;
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