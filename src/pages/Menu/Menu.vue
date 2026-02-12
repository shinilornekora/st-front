<template>
	<div :class="$style.page">
		<Header :light-header="true" />
		<main :class="$style.main">
			<div :class="$style.menuContainer">
				<div :class="$style.menuHeader">
					<h1 :class="$style.menuTitle"></h1>
				</div>

				<div :class="$style.menuSections">
					<!-- Categories Section -->
					<div :class="$style.menuSection">
						<h2 :class="$style.sectionTitle">
							{{ t('navigation.catalog') }}
						</h2>
						<div :class="$style.menuItems">
							<router-link
								to="/?category=new"
								:class="$style.menuItem"
							>
								<span :class="$style.itemText">{{
									t('navigation.newArrivals')
								}}</span>
								<span :class="$style.itemArrow">›</span>
							</router-link>
							<router-link
								to="/?category=women"
								:class="$style.menuItem"
							>
								<span :class="$style.itemText">{{
									t('navigation.women')
								}}</span>
								<span :class="$style.itemArrow">›</span>
							</router-link>
							<router-link
								to="/?category=men"
								:class="$style.menuItem"
							>
								<span :class="$style.itemText">{{
									t('navigation.men')
								}}</span>
								<span :class="$style.itemArrow">›</span>
							</router-link>
							<router-link
								to="/?category=sale"
								:class="$style.menuItem"
							>
								<span :class="$style.itemText">{{
									t('navigation.sale')
								}}</span>
								<span :class="$style.itemArrow">›</span>
							</router-link>
						</div>
					</div>

					<!-- Customer Service Section -->
					<div :class="$style.menuSection">
						<h2 :class="$style.sectionTitle">
							{{ t('navigation.forCustomers') }}
						</h2>
						<div :class="$style.menuItems">
							<router-link
								to="/delivery"
								:class="$style.menuItem"
							>
								<span :class="$style.itemText">{{
									t('navigation.deliveryAndPayment')
								}}</span>
								<span :class="$style.itemArrow">›</span>
							</router-link>
							<router-link to="/returns" :class="$style.menuItem">
								<span :class="$style.itemText">{{
									t('navigation.exchangeAndReturn')
								}}</span>
								<span :class="$style.itemArrow">›</span>
							</router-link>
							<router-link to="/faq" :class="$style.menuItem">
								<span :class="$style.itemText">{{
									t('navigation.faqFull')
								}}</span>
								<span :class="$style.itemArrow">›</span>
							</router-link>
						</div>
					</div>

					<!-- Company Section -->
					<div :class="$style.menuSection">
						<h2 :class="$style.sectionTitle">
							{{ t('navigation.aboutCompany') }}
						</h2>
						<div :class="$style.menuItems">
							<router-link to="/about" :class="$style.menuItem">
								<span :class="$style.itemText">{{
									t('navigation.aboutBrand')
								}}</span>
								<span :class="$style.itemArrow">›</span>
							</router-link>
							<router-link
								to="/contacts"
								:class="$style.menuItem"
							>
								<span :class="$style.itemText">{{
									t('navigation.contacts')
								}}</span>
								<span :class="$style.itemArrow">›</span>
							</router-link>
							<router-link
								to="/partners"
								:class="$style.menuItem"
							>
								<span :class="$style.itemText">{{
									t('navigation.partnersB2B')
								}}</span>
								<span :class="$style.itemArrow">›</span>
							</router-link>
							<router-link to="/offer" :class="$style.menuItem">
								<span :class="$style.itemText">{{
									t('navigation.publicOffer')
								}}</span>
								<span :class="$style.itemArrow">›</span>
							</router-link>
							<router-link to="/privacy" :class="$style.menuItem">
								<span :class="$style.itemText">{{
									t('navigation.privacyPolicy')
								}}</span>
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
	import { useI18n } from 'vue-i18n';
	import { Header, Footer } from '@widgets/index';

	const { t } = useI18n();
</script>

<style module>
	.page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--background-default);
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
		background: var(--background-default);
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.menuTitle {
		font-size: 24px;
		font-weight: 600;
		margin: 0;
		color: var(--color-primary);
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
		color: var(--color-primary);
	}

	.menuItems {
		background: var(--background-default);
		overflow: hidden;
	}

	.menuItem {
		display: flex;
		align-items: center;
		padding: 16px;
		text-decoration: none;
		color: var(--color-primary);
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
		color: var(--color-secondary);
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.menuHeader {
			padding: 4px 16px;
		}

		.menuTitle {
			font-size: 22px;
		}

		.sectionTitle {
			font-size: 16px;
			margin-bottom: 8px;
		}

		.menuItem {
			padding: 2px 16px;
		}

		.itemText {
			font-size: 15px;
		}
	}
</style>
