<template>
  <div v-if="isOpen" :class="$style.overlay" @click="handleOverlayClick">
    <div :class="$style.modal" @click.stop>
      <div :class="$style.modalContent">
        <!-- Название товара -->
        <div :class="$style.field">
          <label :class="$style.label">Название товара</label>
          <Input
            v-model="formData.name"
            placeholder="Value"
            :class="$style.input"
          />
        </div>

        <!-- Артикул -->
        <div :class="$style.field">
          <label :class="$style.label">Артикул</label>
          <Input
            v-model="formData.article"
            placeholder="Value"
            :class="$style.input"
          />
        </div>

        <!-- Цена -->
        <div :class="$style.field">
          <label :class="$style.label">Цена</label>
          <Input
            v-model="formData.price"
            type="number"
            placeholder="Value"
            :class="$style.input"
          />
        </div>

        <!-- Цена с учетом скидки -->
        <div :class="$style.field">
          <label :class="$style.label">Цена с учетом скидки</label>
          <Input
            v-model="formData.discountPrice"
            type="number"
            placeholder="Value"
            :class="$style.input"
          />
        </div>

        <!-- Размеры -->
        <div :class="$style.field">
          <label :class="$style.label">Размеры</label>
          <div :class="$style.checkboxGroup">
            <label :class="$style.checkboxLabel">
              <input
                type="checkbox"
                v-model="formData.sizes.small"
                :class="$style.checkbox"
              />
              <span :class="$style.checkmark"></span>
              <span>Small (Длина стопы 21.0 - 24.5 см)</span>
            </label>
            <label :class="$style.checkboxLabel">
              <input
                type="checkbox"
                v-model="formData.sizes.medium"
                :class="$style.checkbox"
              />
              <span :class="$style.checkmark"></span>
              <span>Medium (Длина стопы 25.0 - 27.5 см)</span>
            </label>
            <label :class="$style.checkboxLabel">
              <input
                type="checkbox"
                v-model="formData.sizes.large"
                :class="$style.checkbox"
              />
              <span :class="$style.checkmark"></span>
              <span>Large (Длина стопы 28.0 - 30.5 см)</span>
            </label>
          </div>
        </div>

        <!-- Цвет -->
        <div :class="$style.field">
          <label :class="$style.label">Цвет</label>
          <div :class="$style.checkboxGroup">
            <label :class="$style.checkboxLabel">
              <input
                type="checkbox"
                v-model="formData.colors.white"
                :class="$style.checkbox"
              />
              <span :class="$style.checkmark"></span>
              <span>Белый</span>
            </label>
            <label :class="$style.checkboxLabel">
              <input
                type="checkbox"
                v-model="formData.colors.black"
                :class="$style.checkbox"
              />
              <span :class="$style.checkmark"></span>
              <span>Черный</span>
            </label>
            <label :class="$style.checkboxLabel">
              <input
                type="checkbox"
                v-model="formData.colors.red"
                :class="$style.checkbox"
              />
              <span :class="$style.checkmark"></span>
              <span>Красный</span>
            </label>
          </div>
        </div>

        <!-- Состав -->
        <div :class="$style.field">
          <label :class="$style.label">Состав</label>
          <Input
            v-model="formData.composition"
            placeholder="Value"
            :class="$style.input"
          />
        </div>

        <!-- Пол -->
        <div :class="$style.field">
          <label :class="$style.label">Пол</label>
          <Select
            v-model="formData.gender"
            :options="genderOptions"
            placeholder="Value"
            :class="$style.select"
          />
        </div>

        <!-- Добавить изображения -->
        <div :class="$style.field">
          <label :class="$style.label">Добавить изображения</label>
          <div :class="$style.uploadArea">
            <input
              type="file"
              multiple
              accept="image/*"
              @change="handleFileUpload"
              :class="$style.fileInput"
              id="fileUpload"
            />
            <label for="fileUpload" :class="$style.uploadLabel">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <div :class="$style.uploadText">
                <div>Перетащите ваши файлы в эту область</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Кнопки -->
        <div :class="$style.actions">
          <button :class="$style.saveButton" @click="handleSave">
            Сохранить
          </button>
          <button :class="$style.previewButton" @click="handlePreview">
            Посмотреть превью
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Input, Select } from '@shared/ui';
import { setPreviewProduct, setPreviewFormData } from '@entities/product/product.store';

const router = useRouter();

const props = defineProps<{
  isOpen: boolean;
  editData?: any;
}>();

const emit = defineEmits<{
  close: [];
  save: [data: any];
}>();

const formData = reactive({
  name: '',
  article: '',
  price: '',
  discountPrice: '',
  sizes: {
    small: false,
    medium: false,
    large: false,
  },
  colors: {
    white: false,
    black: false,
    red: false,
  },
  composition: '',
  gender: '',
  images: [] as File[],
});

// Watch for editData changes and populate form
watch(() => props.editData, (newData) => {
  if (newData) {
    formData.name = newData.name || '';
    formData.article = newData.article || '';
    formData.price = newData.price?.toString() || '';
    formData.discountPrice = newData.discountPrice?.toString() || '';
    formData.composition = newData.composition || '';
    formData.gender = newData.gender || '';
    
    // Reset sizes and colors if editing
    if (newData.sizes) {
      formData.sizes = { ...newData.sizes };
    }
    if (newData.colors) {
      formData.colors = { ...newData.colors };
    }
  } else {
    // Reset form when no editData (adding new product)
    formData.name = '';
    formData.article = '';
    formData.price = '';
    formData.discountPrice = '';
    formData.composition = '';
    formData.gender = '';
    formData.sizes = { small: false, medium: false, large: false };
    formData.colors = { white: false, black: false, red: false };
    formData.images = [];
  }
}, { immediate: true });

const genderOptions = [
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
  { value: 'unisex', label: 'Унисекс' },
];

const handleOverlayClick = () => {
  emit('close');
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    formData.images = Array.from(target.files);
  }
};

const handleSave = () => {
  emit('save', formData);
  emit('close');
};

const handlePreview = () => {
  console.log('Preview:', formData);
  
  // Создаем объект товара из данных формы для превью
  const previewProduct = {
    id: props.editData?.id || 999999, // Временный ID для превью
    name: formData.name || 'Предпросмотр товара',
    slug: 'preview',
    description: formData.composition || 'Описание товара',
    price: parseFloat(formData.price) || 0,
    currency: '₽' as const,
    inStock: true,
    category: [],
    tags: [],
    images: formData.images.length > 0
      ? formData.images.map(file => URL.createObjectURL(file))
      : ['https://via.placeholder.com/400x600'],
    sizes: [],
    stockStatus: 'in_stock' as const,
    gender: (formData.gender || 'unisex') as 'male' | 'female' | 'unisex',
    seller: { id: 1, name: 'Продавец' },
    discount: formData.discountPrice && formData.price ?
      Math.round((1 - parseFloat(formData.discountPrice) / parseFloat(formData.price)) * 100) :
      undefined,
    article: formData.article || 'ART-000',
  };
  
  console.log('Preview product:', previewProduct);
  
  // Сохраняем товар в Effector store
  setPreviewProduct(previewProduct);
  
  // Сохраняем данные формы для возможности вернуться к редактированию
  setPreviewFormData({
    ...formData,
    editData: props.editData, // Сохраняем также editData если редактируем
  });
  
  // Закрываем модалку
  emit('close');
  
  // Переходим на страницу превью
  router.push('/product/preview');
};
</script>

<style module>
@import '@shared/ui/theme.module.css';

.overlay {
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

.modal {
  background: var(--background-default);
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modalContent {
  padding: 32px;
}

.field {
  margin-bottom: 24px;
}

.label {
  display: block;
  font-size: 16px;
  font-weight: 400;
  color: var(--color-primary);
  margin-bottom: 8px;
  text-align: left;
}

.input {
  width: 100%;
}

.select {
  width: 100%;
}

.checkboxGroup {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkboxLabel {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-primary);
  position: relative;
  padding-left: 32px;
}

.checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: white;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  transition: all 0.2s;
}

.checkboxLabel:hover .checkmark {
  border-color: var(--color-accent);
}

.checkbox:checked ~ .checkmark {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox:checked ~ .checkmark:after {
  display: block;
}

.checkboxLabel .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.uploadArea {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 32px;
  transition: border-color 0.2s;
}

.uploadArea:hover {
  border-color: var(--color-accent);
}

.fileInput {
  display: none;
}

.uploadLabel {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  cursor: pointer;
  color: #9ca3af;
}

.uploadLabel svg {
  color: #d1d5db;
}

.uploadText {
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 32px;
}

.saveButton {
  width: 100%;
  padding: 14px 24px;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.saveButton:hover {
  background: var(--color-focus);
}

.saveButton:active {
  transform: scale(0.98);
}

.previewButton {
  width: 100%;
  padding: 0;
  background: transparent;
  color: var(--color-primary);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
  text-align: left;
}

.previewButton:hover {
  color: var(--color-accent);
}

/* Scrollbar styling */
.modal::-webkit-scrollbar {
  width: 8px;
}

.modal::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 8px;
}

.modal::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 8px;
}

.modal::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

@media (max-width: 768px) {
  .modalContent {
    padding: 24px;
  }

  .label {
    font-size: 14px;
  }

  .uploadArea {
    padding: 24px;
  }

  .uploadText {
    font-size: 13px;
  }
}
</style>
