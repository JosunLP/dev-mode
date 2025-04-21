<script lang="ts">
  import { onMount } from 'svelte';
  
  // Animation for blinking error code
  let blinking = false;
  
  onMount(() => {
    // Start the blinking effect for the error code
    const blinkInterval = setInterval(() => {
      blinking = !blinking;
    }, 800);
    
    return () => {
      clearInterval(blinkInterval);
    };
  });
</script>

<div class="feature-not-found">
  <div class="error-code" class:blinking>
    404
  </div>
  
  <div class="error-image">
    <svg width="200" height="200" viewBox="0 0 200 200">
      <g fill="none" stroke="#f14c4c" stroke-width="2">
        <path d="M50,50 L150,150 M150,50 L50,150" />
        <circle cx="100" cy="100" r="80" />
        <path d="M60,140 C80,120 120,120 140,140" stroke-dasharray="5,5" />
      </g>
    </svg>
  </div>
  
  <div class="error-message">
    <p>This feature has unfortunately been lost at the patent office.</p>
    <p>Our patent attorneys are frantically searching for it, but it might have been buried under a stack of applications.</p>
    <p>Please try again later, or submit a new feature request with 37 signatures in triplicate.</p>
  </div>
  
  <a href="/" class="back-link">Back to Dashboard</a>
</div>

<style lang="scss">
  .feature-not-found {
    text-align: center;
    padding: 4rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
  }
  
  .error-code {
    font-size: 8rem;
    font-weight: bold;
    color: #f14c4c;
    margin-bottom: 2rem;
    line-height: 1;
    transition: opacity 0.3s ease;
    
    &::after {
      content: "Feature Not Found";
      display: block;
      font-size: 2rem;
      margin-top: 1rem;
    }
    
    &.blinking {
      opacity: 0.7;
    }
  }
  
  .error-image {
    max-width: 300px;
    margin: 0 auto 2rem;
    opacity: 0.7;
  }
  
  .error-message {
    max-width: 600px;
    margin: 0 auto;
    font-size: 1.2rem;
    color: #a0a0a0;
    
    p {
      margin-bottom: 1rem;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  
  .back-link {
    display: inline-block;
    margin-top: 2rem;
    color: #0078d4;
    text-decoration: underline;
    font-size: 1rem;
    
    &:hover {
      color: lighten(#0078d4, 10%);
    }
  }
</style>