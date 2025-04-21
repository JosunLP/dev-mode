<script lang="ts">
  import '$lib/styles/app.scss';
  import { onMount } from 'svelte';
  import { complianceMode, safeMode, modalStore } from '$lib/stores';
  import CookieWall from '$lib/components/CookieWall.svelte';
  
  // Random triggering of the Cease & Desist Alert
  onMount(() => {
    const timeout = setTimeout(() => {
      if (!$modalStore.open) {
        modalStore.set({
          open: true,
          title: 'Cease & Desist!',
          message: 'Unauthorized activity detected. Please refrain from any further innovation.',
          showCancel: false
        });
      }
    }, Math.random() * 60000 + 30000); // Between 30 and 90 seconds
    
    return () => clearTimeout(timeout);
  });

  // Set Compliance Mode class on body
  $: if (typeof document !== 'undefined') {
    if ($complianceMode) {
      document.body.classList.add('compliance-mode');
    } else {
      document.body.classList.remove('compliance-mode');
    }
  }
  
  // Set Safe Mode class on body
  $: if (typeof document !== 'undefined') {
    if ($safeMode) {
      document.body.classList.add('safe-mode');
    } else {
      document.body.classList.remove('safe-mode');
    }
  }
</script>

<div class="app-container">
  <slot />
</div>

<CookieWall />

<style lang="scss">
  .app-container {
    min-height: 100vh;
    background-color: #1e1e1e;
    position: relative;
  }
</style>