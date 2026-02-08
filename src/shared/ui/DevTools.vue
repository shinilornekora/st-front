<template>
	<Teleport to="body">
		<div v-if="isVisible" :class="$style.devTools">
			<div :class="$style.header">
				<h3 :class="$style.title">🛠️ Dev Tools</h3>
				<button :class="$style.closeBtn" @click="close">✕</button>
			</div>
			
			<div :class="$style.content">
				<!-- Mock API Settings -->
				<section :class="$style.section">
					<h4 :class="$style.sectionTitle">Mock API</h4>
					
					<div :class="$style.setting">
						<label :class="$style.label">
							<input 
								type="checkbox" 
								v-model="settings.mockEnabled"
								@change="saveSettings"
								:class="$style.checkbox"
							/>
							<span>Enable Mock API</span>
						</label>
					</div>
					
					<div :class="$style.setting">
						<label :class="$style.label">
							<span>Network Delay (ms)</span>
							<input 
								type="number" 
								v-model.number="settings.mockDelay"
								@input="saveSettings"
								:class="$style.input"
								min="0"
								max="5000"
								step="100"
							/>
						</label>
						<input 
							type="range" 
							v-model.number="settings.mockDelay"
							@input="saveSettings"
							:class="$style.slider"
							min="0"
							max="5000"
							step="100"
						/>
					</div>
				</section>
				
				<!-- Info -->
				<section :class="$style.section">
					<div :class="$style.info">
						<p>💡 Mock API позволяет работать без backend</p>
						<p>⚡ Задержка имитирует реальные сетевые запросы</p>
						<p>🔄 Изменения применяются сразу</p>
					</div>
				</section>
			</div>
		</div>
		
		<!-- Toggle Button -->
		<button 
			v-if="isDev"
			:class="$style.toggleBtn" 
			@click="toggle"
			:title="isVisible ? 'Hide Dev Tools' : 'Show Dev Tools'"
		>
			🛠️
		</button>
	</Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

interface DevSettings {
	mockEnabled: boolean;
	mockDelay: number;
}

const isVisible = ref(false);
const isDev = ref(false);

const settings = ref<DevSettings>({
	mockEnabled: true,
	mockDelay: 0
});

// Check if dev mode is enabled via URL parameter or localStorage
const checkDevMode = () => {
	const params = new URLSearchParams(window.location.search);
	const urlParam = params.get('isDev');
	
	// If URL has isDev parameter, save it to localStorage
	if (urlParam !== null) {
		const isDevMode = urlParam === '1';
		localStorage.setItem('__dev_mode', isDevMode ? '1' : '0');
		isDev.value = isDevMode;
	} else {
		// Otherwise check localStorage
		const stored = localStorage.getItem('__dev_mode');
		isDev.value = stored === '1';
	}
};

// Load settings from localStorage
const loadSettings = () => {
	try {
		const stored = localStorage.getItem('__dev_mock_settings');
		if (stored) {
			const parsed = JSON.parse(stored);
			settings.value = {
				mockEnabled: parsed.enabled ?? true,
				mockDelay: parsed.delay ?? 0
			};
		}
	} catch (e) {
		console.error('Failed to load dev settings:', e);
	}
};

// Save settings to localStorage
const saveSettings = () => {
	try {
		const toSave = {
			enabled: settings.value.mockEnabled,
			delay: settings.value.mockDelay
		};
		localStorage.setItem('__dev_mock_settings', JSON.stringify(toSave));
	} catch (e) {
		console.error('Failed to save dev settings:', e);
	}
};

const toggle = () => {
	isVisible.value = !isVisible.value;
};

const close = () => {
	isVisible.value = false;
};

// Keyboard shortcut: Ctrl+Shift+D
const handleKeyboard = (e: KeyboardEvent) => {
	if (e.ctrlKey && e.shiftKey && e.key === 'D') {
		e.preventDefault();
		toggle();
	}
};

onMounted(() => {
	checkDevMode();
	loadSettings();
	
	if (isDev.value) {
		window.addEventListener('keydown', handleKeyboard);
	}
});
</script>

<style module>
.devTools {
	position: fixed;
	bottom: 80px;
	right: 20px;
	width: 320px;
	background: var(--background-default);
	border-radius: 12px;
	box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
	z-index: 10000;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px 20px;
	border-bottom: 1px solid #e5e7eb;
}

.title {
	margin: 0;
	font-size: 16px;
	font-weight: 600;
	color: #1f2937;
}

.closeBtn {
	background: none;
	border: none;
	font-size: 20px;
	color: #6b7280;
	cursor: pointer;
	padding: 4px 8px;
	border-radius: 4px;
	transition: all 0.2s;
}

.closeBtn:hover {
	background: #f3f4f6;
	color: #1f2937;
}

.content {
	padding: 20px;
	max-height: 400px;
	overflow-y: auto;
}

.section {
	margin-bottom: 24px;
}

.section:last-child {
	margin-bottom: 0;
}

.sectionTitle {
	margin: 0 0 12px 0;
	font-size: 14px;
	font-weight: 600;
	color: #374151;
}

.setting {
	margin-bottom: 16px;
}

.setting:last-child {
	margin-bottom: 0;
}

.label {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;
	color: #4b5563;
	cursor: pointer;
}

.checkbox {
	width: 18px;
	height: 18px;
	cursor: pointer;
}

.input {
	width: 80px;
	padding: 6px 10px;
	border: 1px solid #d1d5db;
	border-radius: 6px;
	font-size: 14px;
	margin-left: auto;
}

.input:focus {
	outline: none;
	border-color: #3b82f6;
}

.slider {
	width: 100%;
	margin-top: 8px;
	cursor: pointer;
}

.info {
	background: #f9fafb;
	border-radius: 8px;
	padding: 12px;
}

.info p {
	margin: 0 0 8px 0;
	font-size: 13px;
	color: #6b7280;
	line-height: 1.5;
}

.info p:last-child {
	margin-bottom: 0;
}

.toggleBtn {
	position: fixed;
	bottom: 20px;
	right: 20px;
	width: 48px;
	height: 48px;
	border-radius: 50%;
	background: var(--color-accent);
	border: none;
	font-size: 24px;
	cursor: pointer;
	box-shadow: 0 4px 12px rgba(48, 109, 104, 0.4);
	transition: all 0.2s;
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.toggleBtn:hover {
	transform: scale(1.1);
	box-shadow: 0 6px 16px rgba(48, 109, 104, 0.5);
}

.toggleBtn:active {
	transform: scale(0.95);
}

@media (max-width: 768px) {
	.devTools {
		width: calc(100% - 40px);
		right: 20px;
		left: 20px;
		bottom: 70px;
	}
	
	.toggleBtn {
		bottom: 70px;
	}
}
</style>
