import type { Meta, StoryObj } from '@storybook/react';
import { CtaBanner } from './CtaBanner.js';

const meta: Meta<typeof CtaBanner> = {
  component: CtaBanner,
  title: 'Components/CtaBanner',
};
export default meta;
type Story = StoryObj<typeof CtaBanner>;

export const Verdant: Story = {
  args: {
    heading: 'Ready to See It in Person?',
    body: 'Book a tour with one of our leasing specialists.',
    ctaText: 'Book a Tour',
    ctaUrl: '/verdant/contact',
  },
};
