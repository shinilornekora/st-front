import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Badge from '@shared/ui/Badge.vue';
import '@shared/ui/theme.module.css';
const meta = {
	title: 'Shared/Badge',
	component: Badge,
	argTypes: {
		type: {
			control: 'select',
			options: ['info', 'success', 'warning', 'error'],
		},
	},
	args: { type: 'info' },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Info: Story = { args: { type: 'info' }, slots: { default: '1' } };
export const Success: Story = {
	args: { type: 'success' },
	slots: { default: '99+' },
};
export const Warning: Story = {
	args: { type: 'warning' },
	slots: { default: '!' },
};
export const Error: Story = {
	args: { type: 'error' },
	slots: { default: '⚡' },
};
