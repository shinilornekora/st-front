<template>
	<div :class="$style.container" ref="containerRef">
		<span v-if="label" :class="$style.label">{{ label }}</span>
		<div
			:class="[
				$style.selectBox,
				isOpen && $style.open,
				error && $style.error,
				disabled && $style.disabled,
			]"
			@click="toggleDropdown"
			tabindex="0"
			@keydown.enter.prevent="toggleDropdown"
			@keydown.space.prevent="toggleDropdown"
		>
			<div :class="$style.selectedValues">
				<span v-if="selectedOptions.length > 0" :class="$style.text">
					{{ selectedOptions.map((opt) => opt.label).join(', ') }}
				</span>
				<span v-else :class="$style.placeholder">{{ placeholder }}</span>
			</div>
			<div :class="[$style.arrow, isOpen && $style.arrowOpen]">
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M6 9L12 15L18 9"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
		</div>
		<transition name="fade">
			<div v-if="isOpen" :class="$style.dropdown">
				<div
					v-for="option in options"
					:key="option.value"
					:class="[
						$style.option,
						isSelected(option.value) && $style.selected,
					]"
					@click="toggleOption(option.value)"
				>
					<span :class="$style.optionLabel">{{ option.label }}</span>
					<svg
						v-if="isSelected(option.value)"
						:class="$style.checkIcon"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M20 6L9 17L4 12"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
				<div v-if="options.length === 0" :class="$style.noOptions">
					Нет доступных опций
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed, onMounted, onUnmounted } from 'vue';

	type Option = { value: string | number; label: string };

	const props = defineProps<{
		options: Option[];
		modelValue: (string | number)[];
		label?: string;
		placeholder?: string;
		disabled?: boolean;
		error?: boolean;
	}>();

	const emit = defineEmits(['update:modelValue']);

	const isOpen = ref(false);
	const containerRef = ref<HTMLElement | null>(null);

	const selectedOptions = computed(() => {
		return props.options.filter((opt) =>
			props.modelValue.includes(opt.value),
		);
	});

	const isSelected = (val: string | number) => {
		return props.modelValue.includes(val);
	};

	const toggleDropdown = () => {
		if (props.disabled) return;
		isOpen.value = !isOpen.value;
	};

	const toggleOption = (val: string | number) => {
		const newValue = [...props.modelValue];
		const index = newValue.indexOf(val);
		if (index === -1) {
			newValue.push(val);
		} else {
			newValue.splice(index, 1);
		}
		emit('update:modelValue', newValue);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (
			containerRef.value &&
			!containerRef.value.contains(event.target as Node)
		) {
			isOpen.value = false;
		}
	};

	onMounted(() => {
		document.addEventListener('click', handleClickOutside, { capture: true });
	});

	onUnmounted(() => {
		document.removeEventListener('click', handleClickOutside, { capture: true });
	});
</script>

<style module>
	@import './theme.module.css';

	.container {
		position: relative;
		width: 100%;
	}

	.label {
		display: block;
		font-size: 13px;
		color: var(--color-secondary);
		margin-bottom: 5px;
	}

	.selectBox {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-width: 100%;
		padding: 7px 10px;
		border: 1px solid #e5e7eb;
		border-radius: 4px;
		background: var(--background-default);
		cursor: pointer;
		transition: border-color 0.2s, box-shadow 0.2s;
		outline: none;
	}

	.selectBox:focus {
		border-color: var(--color-focus);
	}

	.selectBox.open {
		border-color: var(--color-focus);
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
	}

	.selectBox.error {
		border-color: var(--color-error-main);
	}

	.selectBox.disabled {
		background: #f3f4f6;
		cursor: not-allowed;
		opacity: 0.7;
	}

	.selectedValues {
		display: flex;
		flex: 1;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.text {
		color: var(--color-primary);
		font-size: 15px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.placeholder {
		color: var(--color-primary);
		font-size: 15px;
	}

	.arrow {
		color: var(--color-secondary);
		margin-left: 8px;
		display: flex;
		align-items: center;
		transition: transform 0.2s ease;
	}

	.arrowOpen {
		transform: rotate(180deg);
	}

	.dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: var(--background-default);
		border: 1px solid var(--color-focus);
		border-top: none;
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
		max-height: 240px;
		overflow-y: auto;
		z-index: 100;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.option {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 12px;
		cursor: pointer;
		transition: background 0.15s ease;
	}

	.option:hover {
		background: #f9fafb;
	}

	.option.selected {
		background: #f3f4f6;
		color: var(--color-accent);
	}

	.optionLabel {
		font-size: 15px;
		color: #000;
	}

	.checkIcon {
		color: var(--color-accent);
	}

	.noOptions {
		padding: 12px;
		color: var(--color-secondary);
		font-size: 14px;
		text-align: center;
	}
</style>

<style>
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.2s ease, transform 0.2s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
		transform: translateY(-4px);
	}
</style>
