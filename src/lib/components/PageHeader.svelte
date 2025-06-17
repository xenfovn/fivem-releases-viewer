<script lang="ts">
  import { onMount } from 'svelte';
  
  let mounted = false;
  
  onMount(() => {
    mounted = true;
  });
</script>

<header class="page-header">
  <div class="header-background">
    <div class="gradient-overlay"></div>
    <div class="pattern-overlay"></div>
  </div>
  
  <div class="header-content" class:animate={mounted}>
    <div class="header-main">
      <div class="header-icon">

        <span class="icon-stars">✨</span>
      </div>
      
      <div class="header-text">
        <h1 class="header-title">
          <span class="title-main">FiveM</span>
          <span class="title-accent">Releases</span>
        </h1>
        <p class="header-subtitle">
          Discover the latest and greatest resources from the CFX community
        </p>
      </div>
    </div>
    
    <div class="header-stats">
      <div class="stat-item">
        <span class="stat-icon">📦</span>
        <span class="stat-text">Fresh Resources</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">👥</span>
        <span class="stat-text">Active Community</span>
      </div>
      <div class="stat-item">
        <span class="stat-icon">🚀</span>
        <span class="stat-text">Ready to Use</span>
      </div>
    </div>
  </div>
  
  <div class="header-decoration">
    <div class="floating-element" style="--delay: 0s; --duration: 3s;">💻</div>
    <div class="floating-element" style="--delay: 1s; --duration: 4s;">🔧</div>
    <div class="floating-element" style="--delay: 2s; --duration: 3.5s;">⚡</div>
  </div>
</header>

<style>
  .page-header {
    position: relative;
    overflow: hidden;
    padding: 2rem 2rem;
    margin-bottom: 2rem;
    border-radius: 0 0 10px 10px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  
  .header-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
  
  .gradient-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    opacity: 0.9;
  }
  
  .pattern-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 50px 50px, 30px 30px;
    animation: patternFloat 20s ease-in-out infinite;
  }
  
  @keyframes patternFloat {
    0%, 100% { transform: translate(0, 0); }
    33% { transform: translate(20px, -10px); }
    66% { transform: translate(-10px, 20px); }
  }
  
  .header-content {
    position: relative;
    z-index: 2;
    text-align: center;
    color: white;
    max-width: 900px;
    margin: 0 auto;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease-out;
  }
  
  .header-content.animate {
    opacity: 1;
    transform: translateY(0);
  }
  
  .header-main {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .header-icon {
    position: relative;
    flex-shrink: 0;
  }
  
  .icon-game {
    font-size: 3rem;
    display: inline-block;
    animation: bounce 2s ease-in-out infinite;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  }
  
  .icon-stars {
    font-size: 1.5rem;
    position: absolute;
    top: -10px;
    right: -20px;
    animation: twinkle 1.5s ease-in-out infinite alternate;
  }
  
  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
    40%, 43% { transform: translateY(-15px); }
    70% { transform: translateY(-8px); }
  }
  
  @keyframes twinkle {
    0% { opacity: 0.5; transform: scale(0.8); }
    100% { opacity: 1; transform: scale(1.2); }
  }
  

  .header-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    margin: 0 0 0.25rem 0;
    line-height: 1.1;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  .title-main {
    display: inline-block;
    background: linear-gradient(45deg, #ffffff, #f0f8ff);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s ease-in-out infinite;
  }
  
  .title-accent {
    display: inline-block;
    background: linear-gradient(45deg, #ffd700, #ffeb3b);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-left: 0.5rem;
    animation: shimmer 3s ease-in-out infinite 0.5s;
  }
  
  @keyframes shimmer {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  .header-subtitle {
    font-size: clamp(0.85rem, 1.8vw, 1rem);
    margin: 0;
    opacity: 0.95;
    font-weight: 400;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    line-height: 1.3;
  }
  
  .header-stats {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-top: 0;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    padding: 0.5rem 1rem;
    border-radius: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    cursor: default;
  }
  
  .stat-item:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  .stat-icon {
    font-size: 1rem;
  }
  
  .stat-text {
    font-size: 0.8rem;
    font-weight: 500;
    white-space: nowrap;
  }
  
  .header-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    pointer-events: none;
  }
  
  .floating-element {
    position: absolute;
    font-size: 2rem;
    opacity: 0.3;
    animation: float var(--duration) ease-in-out infinite var(--delay);
  }
  
  .floating-element:nth-child(1) {
    top: 20%;
    left: 10%;
  }
  
  .floating-element:nth-child(2) {
    top: 60%;
    right: 15%;
  }
  
  .floating-element:nth-child(3) {
    bottom: 30%;
    left: 20%;
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    33% {
      transform: translateY(-20px) rotate(5deg);
    }
    66% {
      transform: translateY(10px) rotate(-3deg);
    }
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .page-header {
      padding: 1.5rem 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .header-main {
      gap: 1rem;
      margin-bottom: 0.75rem;
    }
    
    .header-stats {
      gap: 1rem;
    }
    
    .stat-item {
      padding: 0.4rem 0.8rem;
      font-size: 0.75rem;
    }
    
    .stat-text {
      font-size: 0.7rem;
    }
    
    .floating-element {
      font-size: 1.5rem;
    }
  }
  
  @media (max-width: 600px) {
    .header-main {
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    
    .header-text {
      text-align: center;
    }
    
    .header-title {
      margin-bottom: 0.2rem;
    }
  }
  
  @media (max-width: 480px) {
    .page-header {
      padding: 1.25rem 1rem;
    }
    
    .header-stats {
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
    
    .title-accent {
      margin-left: 0.25rem;
    }
  }
</style> 