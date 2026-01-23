<template>
	<header :class="$style.header">
		<div :class="$style.headerContent">
			<router-link :class="$style.logo" to="/">
				<img :src="logoSrc" alt="Stivalli" :class="$style.logo" />
			</router-link>
			<div :class="$style.searchWrapper">
				<SearchField
					v-model="searchQuery"
					placeholder="Value"
					:class="$style.search"
				/>
			</div>
			<div :class="$style.headerIcons">
				<button :class="$style.iconBtn" aria-label="Профиль">
					<img src="../assets/user_circle.svg" alt="" :class="$style.headerIcon" />
				</button>
				<button :class="$style.iconBtn" aria-label="Корзина">
					<img src="../assets/dark_shopping_cart.svg" alt="" :class="$style.headerIcon" />
				</button>
				<button :class="$style.iconBtn" aria-label="Уведомления">
					<img src="../assets/notification_icon.svg" alt="" :class="$style.headerIcon" />
				</button>
			</div>
		</div>
	</header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import SearchField from '../shared/ui/SearchField.vue';
import logoFull from '../assets/logo_full.svg';
import logo from '../assets/logo.svg';

const searchQuery = ref('');
const screenWidth = ref(window.innerWidth);

const logoSrc = computed(() => {
	return screenWidth.value < 1200 ? logo : logoFull;
});

const updateScreenWidth = () => {
	screenWidth.value = window.innerWidth;
};

onMounted(() => {
	window.addEventListener('resize', updateScreenWidth);
});

onUnmounted(() => {
	window.removeEventListener('resize', updateScreenWidth);
});
</script>

<style module>
.header {
	background: white;
	border-bottom: 1px solid #e5e5e5;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	padding: 27px 0;
	position: sticky;
	z-index: 100;
	top: 0;
}

.headerContent {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 120px;
}

.logo {
	height: 35px;
	width: 138px;
	flex-shrink: 0;
	object-fit: contain;
	cursor: pointer;
}

.searchWrapper {
	flex: 1;
	max-width: 600px;
	min-width: 0;
	margin: 0 24px;
}

.search {
	width: 100%;
}

.headerIcons {
	display: flex;
	gap: 12px;
	flex-shrink: 0;
}

.iconBtn {
	background: transparent;
	border: none;
	cursor: pointer;
	padding: 8px;
	transition: background 0.2s;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 8px;
}

.iconBtn:hover {
	background: #f3f4f6;
}

.headerIcon {
	width: 24px;
	height: 24px;
	color: #6b7280;
}

@media (max-width: 1200px) {
	.headerContent {
		padding: 0 15px;
	}
}

/* Responsive */
@media (max-width: 768px) {
	.header {
		padding: 8px 0;
	}

	.headerContent {
		flex-wrap: wrap;
		gap: 8px;
		padding: 0 16px;
	}

	.logo {
		flex: 1;
	}

	.searchWrapper {
		order: 3;
		flex-basis: 100%;
		max-width: none;
		margin: 0;
	}

	.headerIcons {
		display: none;
	}

	.iconBtn {
		padding: 6px;
	}
}
</style>
