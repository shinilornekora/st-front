<template>
	<footer :class="$style.footer">
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
</template>

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
</style>
