<template>
  <div :class="$style.page">
    <Header :lightHeader="true" />
    <main :class="$style.main">
      <div :class="$style.menuContainer">
        <div :class="$style.menuHeader">
          <h1 :class="$style.menuTitle"></h1>
        </div>
        
        <div :class="$style.menuSections">
          <!-- Categories Section -->
          <div :class="$style.menuSection">
            <h2 :class="$style.sectionTitle">Каталог</h2>
            <div :class="$style.menuItems">
              <router-link to="/?category=new" :class="$style.menuItem">
                <span :class="$style.itemText">Новинки</span>
                <span :class="$style.itemArrow">›</span>
              </router-link>
              <router-link to="/?category=women" :class="$style.menuItem">
                <span :class="$style.itemText">Женщинам</span>
                <span :class="$style.itemArrow">›</span>
              </router-link>
              <router-link to="/?category=men" :class="$style.menuItem">
                <span :class="$style.itemText">Мужчинам</span>
                <span :class="$style.itemArrow">›</span>
              </router-link>
              <router-link to="/?category=sale" :class="$style.menuItem">
                <span :class="$style.itemText">Распродажа (Sale)</span>
                <span :class="$style.itemArrow">›</span>
              </router-link>
            </div>
          </div>
          
          <!-- Customer Service Section -->
          <div :class="$style.menuSection">
            <h2 :class="$style.sectionTitle">Покупателям</h2>
            <div :class="$style.menuItems">
              <router-link to="/delivery" :class="$style.menuItem">
                <span :class="$style.itemText">Доставка и оплата</span>
                <span :class="$style.itemArrow">›</span>
              </router-link>
              <router-link to="/returns" :class="$style.menuItem">
                <span :class="$style.itemText">Обмен и возврат</span>
                <span :class="$style.itemArrow">›</span>
              </router-link>
              <router-link to="/faq" :class="$style.menuItem">
                <span :class="$style.itemText">Вопросы и ответы (FAQ)</span>
                <span :class="$style.itemArrow">›</span>
              </router-link>
            </div>
          </div>
          
          <!-- Company Section -->
          <div :class="$style.menuSection">
            <h2 :class="$style.sectionTitle">О компании</h2>
            <div :class="$style.menuItems">
              <router-link to="/about" :class="$style.menuItem">
                <span :class="$style.itemText">О бренде Stivalli</span>
                <span :class="$style.itemArrow">›</span>
              </router-link>
              <router-link to="/contacts" :class="$style.menuItem">
                <span :class="$style.itemText">Контакты</span>
                <span :class="$style.itemArrow">›</span>
              </router-link>
              <router-link to="/partners" :class="$style.menuItem">
                <span :class="$style.itemText">Партнерам (B2B)</span>
                <span :class="$style.itemArrow">›</span>
              </router-link>
              <router-link to="/offer" :class="$style.menuItem">
                <span :class="$style.itemText">Публичная оферта</span>
                <span :class="$style.itemArrow">›</span>
              </router-link>
              <router-link to="/privacy" :class="$style.menuItem">
                <span :class="$style.itemText">Политика конфиденциальности</span>
                <span :class="$style.itemArrow">›</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { Header, Footer } from '@widgets';
</script>

<style module>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
}

@media (max-width: 480px) {
  .page {
    padding-bottom: 46px; /* Space for mobile footer */
  }
}

.main {
  flex: 1;
  padding: 0;
}

.menuContainer {
  max-width: 100%;
  margin: 0 auto;
}

.menuHeader {
  padding: 24px 16px;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.menuTitle {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #1a1a1a;
}

.menuSections {
  padding: 16px 0;
  text-align: left;
}

.menuSection {
  margin-bottom: 24px;
}

.sectionTitle {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  padding: 0 16px;
  color: #1a1a1a;
}

.menuItems {
  background: #fff;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.menuItem {
  display: flex;
  align-items: center;
  padding: 16px;
  text-decoration: none;
  color: #333;
  transition: background-color 0.2s;
}

.menuItem:hover {
  background-color: #f9f9f9;
}

.itemIcon {
  font-size: 20px;
  margin-right: 16px;
  width: 24px;
  text-align: center;
}

.itemText {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
}

.itemArrow {
  font-size: 20px;
  color: #999;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .menuHeader {
    padding: 20px 16px;
  }
  
  .menuTitle {
    font-size: 22px;
  }
  
  .sectionTitle {
    font-size: 16px;
    margin-bottom: 8px;
  }
  
  .menuItem {
    padding: 14px 16px;
  }
  
  .itemText {
    font-size: 15px;
  }
}
</style>
