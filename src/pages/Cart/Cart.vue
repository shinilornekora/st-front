<template>
  <div :class="$style.page">
    <Header />
    <main :class="$style.main">
      <div :class="$style.emptyCart">
        <img src="../../assets/plain_cart_icon.svg" alt="Empty Cart" :class="$style.cartIcon" />
        <Button type="accent" @click="goToShop" :class="$style.customButton">Перейти к покупкам</Button>
      </div>

      <!-- Similar Products Section -->
      <section :class="$style.similarSection">
        <h5 :class="$style.sectionTitle">Вам может понравиться:</h5>
        
        <div :class="$style.similarProducts">
          <ProductCard
            v-for="similarProduct in similarProducts"
            :key="similarProduct.id"
            :image="similarProduct.images[0]"
            :title="similarProduct.name"
            :price="similarProduct.price"
            :recommendation="true"
            @click="goToProduct(similarProduct.id)"
            @add-to-cart="addSimilarToCart(similarProduct)"
          />
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Header, Footer } from '../../widgets';
import Button from '../../shared/ui/Button.vue';
import ProductCard from '../../shared/ui/ProductCard.vue';

const router = useRouter();

const goToShop = () => {
  router.push('/');
};

// Mock similar products data
const similarProducts = [
  {
    id: 2,
    name: 'Name',
    price: 100500,
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=400&fit=crop'],
  },
  {
    id: 3,
    name: 'Name',
    price: 100500,
    images: ['https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300&h=400&fit=crop'],
  },
  {
    id: 4,
    name: 'Name',
    price: 100500,
    images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=300&h=400&fit=crop'],
  },
  {
    id: 5,
    name: 'Name',
    price: 100500,
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=400&fit=crop'],
  },
  {
    id: 6,
    name: 'Name',
    price: 100500,
    images: ['https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300&h=400&fit=crop'],
  },
];

const addSimilarToCart = (similarProduct: any) => {
  console.log('Add similar to cart:', similarProduct.id);
  // TODO: Implement cart logic
};

const goToProduct = (productId: number) => {
  router.push(`/product/${productId}`);
};
</script>

<style module>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  padding-bottom: 46px; /* Space for mobile footer */
}

.main {
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
}

.emptyCart {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 400px;
  width: 100%;
  margin-top: 0;
  margin-bottom: 48px;
}

.cartIcon {
  width: 320px;
  height: 320px;
  margin-bottom: 32px;
  opacity: 0.7;
}

.customButton {
  width: 270px;
  height: 54px;
}

/* Similar Products */
.similarSection {
  background: white;
  padding: 32px;
  border-radius: 16px;
  margin-top: auto;
}

.sectionTitle {
  font-size: 20px;
  font-weight: 600;
  color: #333333;
  text-align: left;
  margin: 0 0 24px 0;
}

.similarProducts {
  gap: 16px;
  display: flex;
  margin-top: 24px;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.similarProducts::-webkit-scrollbar {
  display: none;
}

.similarProducts :deep(.productCard) {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .similarSection {
    padding: 0;
  }
  .similarProducts {
    gap: 12px;
  }
}
</style>
