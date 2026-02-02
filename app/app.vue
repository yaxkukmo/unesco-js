<template>
  <div class="app">
    <header class="app-header">
      <div class="header-content">
        <NuxtLink to="/" class="logo">
          <span class="logo-icon">UNESCO</span>
          <span class="logo-text">World Heritage</span>
        </NuxtLink>
        <nav class="main-nav">
          <NuxtLink to="/sites" class="nav-link">Sites</NuxtLink>
          <NuxtLink to="/countries" class="nav-link">Countries</NuxtLink>
          <NuxtLink to="/categories" class="nav-link">Categories</NuxtLink>
        </nav>
      </div>
    </header>

    <main class="app-main">
      <NuxtPage />
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <p>UNESCO World Heritage Sites Explorer</p>
        <p class="copyright">Built with Nuxt 3</p>
      </div>
    </footer>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: #f5f5f5;
  color: #1a1a2e;
  line-height: 1.5;
}

a {
  color: inherit;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: white;
}

.logo-icon {
  background: #1976d2;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 1px;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
}

.main-nav {
  display: flex;
  gap: 0.5rem;
}

.nav-link {
  padding: 0.6rem 1.2rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-link.router-link-active {
  background: rgba(25, 118, 210, 0.3);
  color: white;
}

.app-main {
  flex: 1;
}

.app-footer {
  background: #1a1a2e;
  color: rgba(255, 255, 255, 0.7);
  padding: 2rem;
  margin-top: 3rem;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
}

.footer-content p {
  margin: 0.25rem 0;
}

.copyright {
  font-size: 0.85rem;
  opacity: 0.6;
}

@media (max-width: 600px) {
  .header-content {
    padding: 0 1rem;
    height: 60px;
  }

  .logo-text {
    display: none;
  }

  .nav-link {
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>
