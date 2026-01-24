import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Input from '@shared/ui/Input.vue';
import '@shared/ui/theme.module.css';
const meta = {
	title: 'Shared/Input',
	component: Input,
	argTypes: {
		type: {
			control: 'select',
			options: ['text', 'email', 'phone', 'password', 'number'],
		},
		placeholder: { control: 'text' },
		error: { control: 'boolean' },
		required: { control: 'boolean' },
		disabled: { control: 'boolean' },
	},
	args: {
		type: 'text',
		placeholder: 'Введите текст',
		error: false,
		required: false,
		disabled: false,
		modelValue: '',
	},
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: {} };
export const Error: Story = { args: { error: true, modelValue: 'Ошибка' } };
export const Disabled: Story = { args: { disabled: true, modelValue: 'Off' } };
