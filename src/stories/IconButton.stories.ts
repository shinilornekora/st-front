import type { Meta, StoryObj } from '@storybook/vue3-vite';
import IconButton from '@shared/ui/IconButton.vue';
import '@shared/ui/theme.module.css';
const meta = {
	title: 'Shared/IconButton',
	component: IconButton,
	argTypes: {
		size: { control: 'select', options: ['24', '32'] },
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
		accent: { control: 'boolean' },
		disabled: { control: 'boolean' },
	},
	args: {
		size: '24',
		type: 'main',
		accent: false,
		disabled: false,
		ariaLabel: 'Icon button',
	},
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Main: Story = { args: { type: 'main' }, slots: { default: '🔍' } };
export const Accent: Story = {
	args: { type: 'accent', accent: true },
	slots: { default: '⭐' },
};
export const Disabled: Story = {
	args: { disabled: true },
	slots: { default: '💬' },
};
export const Size32: Story = { args: { size: '32' }, slots: { default: '✉️' } };
