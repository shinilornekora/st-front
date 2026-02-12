<template>
	<label :class="$style.uploader">
		<input
			type="file"
			accept="image/*"
			:multiple="multiple"
			:disabled="disabled"
			:aria-label="$t('ui.uploadFile')"
			:class="$style.input"
			@change="onChange"
		/>
		<span>{{ label }}</span>
		<div v-if="files.length" :class="$style.previewRow">
			<div v-for="(f, i) in files" :key="i" :class="$style.preview">
				<img :src="f.url" alt="preview" :class="$style.img" />
				<span :class="$style.fileName">{{ f.name }}</span>
			</div>
		</div>
	</label>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import theme from './theme.module.css';
	const props = defineProps<{
		label?: string;
		multiple?: boolean;
		disabled?: boolean;
	}>();
	const emit = defineEmits(['change']);
	const files = ref<any[]>([]);
	const onChange = (e: Event) => {
		const input = e.target as HTMLInputElement;
		if (input.files) {
			files.value = Array.from(input.files).map((f) => ({
				name: f.name,
				url: URL.createObjectURL(f),
			}));
			emit('change', input.files);
		}
	};
</script>

<style module>
	@import './theme.module.css';
	.uploader {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 8px;
	}
	.input {
		display: none;
	}
	.uploader span {
		font-size: 15px;
		color: var(--color-primary);
		cursor: pointer;
		background: var(--color-hover);
		padding: 5px 10px;
		border-radius: 4px;
	}
	.previewRow {
		display: flex;
		gap: 8px;
		margin-top: 4px;
		flex-wrap: wrap;
	}
	.preview {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		max-width: 90px;
	}
	.img {
		width: 56px;
		height: 56px;
		object-fit: cover;
		border-radius: 4px;
		box-shadow: 0 0 2px #0002;
	}
	.fileName {
		font-size: 12px;
		color: var(--color-secondary);
	}
</style>
