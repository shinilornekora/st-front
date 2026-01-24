import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';
// Импортируем именно from shared/ui/Button.vue, а не локальный stories/Button.vue
import Button from '@shared/ui/Button.vue';
import '@shared/ui/theme.module.css';

const meta = {
	title: 'Shared/Button',
	component: Button,
	tags: ['autodocs'],
	argTypes: {
		primary: { control: 'boolean' },
		type: {
			control: 'select',
			options: [
				'main',
				'accent',
				'secondary',
				'error',
				'success',
				'warning',
			],
		},
		disabled: { control: 'boolean' },
		size: { control: 'select', options: ['s', 'm', 'l'] },
	},
	args: {
		primary: false,
		type: 'main',
		size: 'm',
		disabled: false,
		onClick: fn(),
		label: 'Button',
	},
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Main: Story = { args: { type: 'main', label: 'Main' } };
export const Accent: Story = { args: { type: 'accent', label: 'Accent' } };
export const Secondary: Story = {
	args: { type: 'secondary', label: 'Secondary' },
};
export const Error: Story = { args: { type: 'error', label: 'Error' } };
export const Success: Story = { args: { type: 'success', label: 'Success' } };
export const Warning: Story = { args: { type: 'warning', label: 'Warning' } };
// Демонстрация состояния disabled и размеров:
export const Disabled: Story = {
	args: { type: 'main', label: 'Disabled', disabled: true },
};
export const Small: Story = { args: { size: 's', label: 'Small' } };
export const Large: Story = { args: { size: 'l', label: 'Large' } };
