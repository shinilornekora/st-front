<template>
  <transition name="fade">
    <div v-if="modelValue" :class="$style.modalBackdrop" @click="close">
      <div :class="$style.discountModal" @click.stop>
        <div :class="$style.modalHeader">
          <h2 :class="$style.modalTitle">{{ t('modal.wantDiscount') }}</h2>
          <button :class="$style.modalClose" @click="close" :aria-label="t('modal.close')">
            <img :src="crossIcon" alt="" :class="$style.closeIcon" />
          </button>
        </div>
        
        <div :class="$style.modalContent">
          <form @submit.prevent="handleSubmit">
            <div :class="$style.formGroup">
              <label :class="$style.formLabel">{{ t('modal.enterPrice') }}</label>
              <Input
                v-model="discountAmount"
                type="number"
                :placeholder="t('modal.enterDiscount')"
                :class="$style.formInput"
                min="1"
                max="100"
              />
            </div>

            <Button
              type="accent"
              typeAttr="submit"
              variant="filled"
              size="large"
              :class="$style.submitButton"
            >
              {{ t('modal.sendToSeller') }}
            </Button>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import crossIcon from '@assets/cross.svg';
import { Input, Button } from './index';

const { t } = useI18n();

interface Props {
  modelValue: boolean;
  productId?: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'submit']);

const discountAmount = ref('');

// Reset form when modal closes
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    resetForm();
  }
});

const close = () => {
  emit('update:modelValue', false);
};

const handleSubmit = () => {
  if (discountAmount.value && parseInt(discountAmount.value) > 0) {
    emit('submit', {
      productId: props.productId,
      discountAmount: parseInt(discountAmount.value)
    });
    close();
  }
};

const resetForm = () => {
  discountAmount.value = '';
};
</script>

<style module>
@import './theme.module.css';

.modalBackdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.discountModal {
  width: 90%;
  max-width: 500px;
  height: 243px;
  background: var(--background-default);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
  display: flex;
  flex-direction: column;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--background-secondary);
  flex-shrink: 0;
}

.modalTitle {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
  flex: 1;
  text-align: left;
}

.modalClose {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.modalClose:hover {
  opacity: 0.7;
}

.closeIcon {
  width: 20px;
  height: 20px;
}

.modalContent {
  padding: 0 24px;
}

.formGroup {
  margin-bottom: 20px;
}

.formLabel {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary);
  text-align: left;
  margin-bottom: 8px;
}

.formInput {
  width: 100%;
}

.submitButton {
  width: 100%;
  max-height: 44px;
  padding: 10px;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .discountModal {
    width: 95%;
  }
  
  .modalHeader {
    padding: 20px;
  }
  
  .modalTitle {
    font-size: 18px;
  }
  
  .modalContent {
    padding: 20px;
  }
}
</style>
