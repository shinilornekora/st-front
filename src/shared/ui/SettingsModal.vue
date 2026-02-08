<template>
  <transition name="fade">
    <div v-if="modelValue" :class="$style.modalBackdrop" @click="close">
      <div :class="$style.settingsModal" @click.stop>
        <div :class="$style.modalHeader">
          <h2 :class="$style.modalTitle">Настройки</h2>
          <button :class="$style.modalClose" @click="close" aria-label="Закрыть">
            <img :src="crossIcon" alt="" :class="$style.closeIcon" />
          </button>
        </div>
        
        <div :class="$style.modalContent">
          <div v-for="setting in settings" :key="setting.id" :class="$style.settingItem">
            <div :class="$style.settingInfo">
              <div :class="$style.settingLabel">{{ setting.label }}</div>
              <div :class="$style.settingDescription">{{ setting.description }}</div>
            </div>
            <Switch v-model="setting.enabled" />
          </div>
        </div>
        
        <div :class="$style.modalFooter">
          <div :class="$style.leftActions">
            <Button type="accent" @click="handleSave" :class="$style.saveButton">
              Сохранить
            </Button>
            <button :class="$style.logoutLink" @click="handleLogout">
              <img :src="quitIcon" alt="" :class="$style.logoutIcon" />
              Выйти
            </button>
          </div>
          <button :class="$style.deleteLink" @click="handleDeleteAccount">
            Удалить аккаунт
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Switch from './Switch.vue';
import Button from './Button.vue';
import crossIcon from '@assets/cross.svg';
import quitIcon from '@assets/quit.svg';

interface Setting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'save', 'logout', 'delete-account']);

// Default settings
const settings = ref<Setting[]>([
  {
    id: 'notifications',
    label: 'Label',
    description: 'Description',
    enabled: true
  },
  {
    id: 'email',
    label: 'Label',
    description: 'Description',
    enabled: true
  },
  {
    id: 'marketing',
    label: 'Label',
    description: 'Description',
    enabled: false
  },
  {
    id: 'analytics',
    label: 'Label',
    description: 'Description',
    enabled: true
  }
]);

const close = () => {
  emit('update:modelValue', false);
};

const handleSave = () => {
  emit('save', settings.value);
  close();
};

const handleLogout = () => {
  emit('logout');
  close();
};

const handleDeleteAccount = () => {
  emit('delete-account');
  close();
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

.settingsModal {
  width: 90%;
  max-width: 600px;
  background: var(--background-default);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease-out;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
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
  padding: 24px 24px 0px;
}

.modalTitle {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
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
}

.modalClose:hover {
  opacity: 0.7;
}

.closeIcon {
  width: 20px;
  height: 20px;
}

.modalContent {
  padding: 10px 24px 24px;
  overflow-y: auto;
  flex: 1;
}

.settingItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--background-secondary);
}

.settingItem:last-child {
  border-bottom: none;
}

.settingInfo {
  flex: 1;
  margin-right: 16px;
  text-align: left;
}

.settingLabel {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-primary);
  margin-bottom: 4px;
}

.settingDescription {
  font-size: 14px;
  color: var(--color-secondary);
}

.modalFooter {
  padding: 24px;
  border-top: 1px solid var(--background-secondary);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.leftActions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.saveButton {
  flex-shrink: 0;
}

.logoutLink,
.deleteLink {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 8px;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-primary);
  white-space: nowrap;
  flex-shrink: 0;
}

.logoutLink:hover,
.deleteLink:hover {
  opacity: 0.7;
}

.logoutIcon {
  width: 16px;
  height: 16px;
}

.deleteLink {
  color: var(--color-secondary);
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
  .settingsModal {
    width: 95%;
    max-height: 85vh;
  }
  
  .modalHeader {
    padding: 20px;
  }
  
  .modalTitle {
    font-size: 20px;
  }
  
  .modalContent {
    padding: 20px;
  }
  
  .modalFooter {
    padding: 20px;
    flex-direction: column;
    align-items: stretch;
  }
  
  .leftActions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .saveButton {
    width: 100%;
  }
  
  .logoutLink,
  .deleteLink {
    justify-content: center;
  }
}
</style>
