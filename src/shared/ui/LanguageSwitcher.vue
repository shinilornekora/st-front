<template>
  <div :class="$style.languageSwitcher">
    <button
      v-for="lang in languages"
      :key="lang.code"
      :class="[$style.langBtn, { [$style.active]: currentLocale === lang.code }]"
      @click="switchLanguage(lang.code)"
      :aria-label="`Switch to ${lang.name}`"
    >
      {{ lang.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'effector-vue/composition';
import { useI18n } from 'vue-i18n';
import { $locale, setLocale, type Locale } from '@shared/i18n/locale.store';

const { locale } = useI18n();
const currentLocale = useStore($locale);

const languages = [
  { code: 'ru' as Locale, label: 'RU', name: 'Russian' },
  { code: 'en' as Locale, label: 'EN', name: 'English' },
];

const switchLanguage = (lang: Locale) => {
  setLocale(lang);
};
</script>

<style module>
.languageSwitcher {
  display: flex;
  gap: 4px;
  align-items: center;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 4px;
}

.langBtn {
  padding: 6px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-secondary);
  transition: all 0.2s;
  min-width: 40px;
}

.langBtn:hover {
  background: rgba(0, 0, 0, 0.05);
}

.langBtn.active {
  background: var(--background-default);
  color: var(--color-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .languageSwitcher {
    padding: 2px;
  }
  
  .langBtn {
    padding: 4px 8px;
    font-size: 12px;
    min-width: 32px;
  }
}
</style>
