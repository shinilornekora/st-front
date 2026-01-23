<template>
	<!-- Desktop Footer -->
	<footer :class="$style.footer" v-if="!isMobile">
		<div :class="$style.footerContent">
			<div :class="$style.footerColumn">
				<img src="../assets/logo_white.svg" alt="Stivalli" :class="$style.footerLogo" />
			</div>
			<div :class="$style.footerColumn">
				<h3 :class="$style.footerTitle">Каталог</h3>
				<a href="#" :class="$style.footerLink">Новинки</a>
				<a href="#" :class="$style.footerLink">Женщинам</a>
				<a href="#" :class="$style.footerLink">Мужчинам</a>
				<a href="#" :class="$style.footerLink">Распродажа (Sale)</a>
			</div>
			<div :class="$style.footerColumn">
				<h3 :class="$style.footerTitle">Покупателям</h3>
				<a href="#" :class="$style.footerLink">Доставка и оплата</a>
				<a href="#" :class="$style.footerLink">Обмен и возврат</a>
				<a href="#" :class="$style.footerLink">Вопросы и ответы (FAQ)</a>
			</div>
			<div :class="$style.footerColumn">
				<h3 :class="$style.footerTitle">О компании</h3>
				<a href="#" :class="$style.footerLink">О бренде Stivalli</a>
				<a href="#" :class="$style.footerLink">Контакты</a>
				<a href="#" :class="$style.footerLink">Партнерам (B2B)</a>
				<a href="#" :class="$style.footerLink">Публичная оферта</a>
				<a href="#" :class="$style.footerLink">Политика</a>
				<a href="#" :class="$style.footerLink">Конфиденциальности</a>
			</div>
		</div>
	</footer>

	<!-- Mobile Footer Menu -->
	<footer :class="$style.mobileFooter" v-else>
		<div :class="$style.mobileFooterContent">
			<router-link to="/profile" :class="$style.mobileFooterBtn">
				<img src="../assets/user_circle.svg" alt="Profile" :class="$style.mobileFooterIcon" />
			</router-link>
			<router-link to="/menu" :class="$style.mobileFooterBtn">
				<img src="../assets/hamburger.svg" alt="Menu" :class="$style.mobileFooterIcon" />
			</router-link>
			<router-link to="/cart" :class="$style.mobileFooterBtn">
				<img src="../assets/dark_shopping_cart.svg" alt="Cart" :class="$style.mobileFooterIcon" />
			</router-link>
			<router-link to="/notifications" :class="$style.mobileFooterBtn">
				<img src="../assets/notification_icon.svg" alt="Notifications" :class="$style.mobileFooterIcon" />
			</router-link>
		</div>
	</footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isMobile = ref(window.innerWidth <= 768);

const updateIsMobile = () => {
	isMobile.value = window.innerWidth <= 768;
};

onMounted(() => {
	window.addEventListener('resize', updateIsMobile);
});

onUnmounted(() => {
	window.removeEventListener('resize', updateIsMobile);
});
</script>

<style module>
.footer {
	background: #2c2c2c;
	color: white;
	padding: 40px 120px;
	margin-top: 84px;
}

.footerContent {
	width: 100%;
	margin: 0 auto;
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
	gap: 32px;
}

.footerColumn {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.footerLogo {
	height: 35px;
	width: 135px;
	object-fit: contain;
}

.footerTitle {
	font-size: 16px;
	font-weight: 600;
	text-align: left;
	margin: 0 0 8px 0;
	color: white;
}

.footerLink {
	color: #9ca3af;
	text-align: left;
	text-decoration: none;
	font-size: 14px;
	transition: color 0.2s;
}

.footerLink:hover {
	color: white;
}

/* Responsive */
@media (max-width: 768px) {
	.footer {
		padding: 32px 16px;
		margin-top: 48px;
	}

	.footerContent {
		grid-template-columns: repeat(2, 1fr);
		gap: 20px;
	}
}

@media (max-width: 480px) {
	.footer {
		padding: 24px 16px;
	}

	.footerContent {
		grid-template-columns: 1fr;
		gap: 16px;
	}
}

/* Mobile Footer Menu */
.mobileFooter {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #F8FAFC;
	border-top: 1px solid #e5e5e5;
	z-index: 1000;
	height: 46px;
	width: 100%;
	max-width: 393px;
	margin: 0 auto;
}

/* Add bottom padding to main content when mobile footer is visible */
:global(.page) {
	padding-bottom: 46px;
}

@media (min-width: 769px) {
	:global(.page) {
		padding-bottom: 0;
	}
}

.mobileFooterContent {
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 100%;
	width: 100%;
}

.mobileFooterBtn {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-decoration: none;
	padding: 4px;
	border-radius: 8px;
	transition: background-color 0.2s;
	min-width: 50px;
	height: 100%;
}

.mobileFooterBtn:hover {
	background-color: rgba(0, 0, 0, 0.05);
}

.mobileFooterIcon {
	width: 20px;
	height: 20px;
	color: #6b7280;
}
</style>
