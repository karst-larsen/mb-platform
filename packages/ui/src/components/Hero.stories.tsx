import type { Meta, StoryObj } from '@storybook/react';
import { Hero } from './Hero.js';

const meta: Meta<typeof Hero> = {
  component: Hero,
  title: 'Components/Hero',
};
export default meta;
type Story = StoryObj<typeof Hero>;

export const Verdant: Story = {
  args: {
    heading: 'Find Your Place in the City',
    subheading: 'Modern rental apartments in the neighbourhoods you love.',
    ctaText: 'Explore Properties',
    ctaUrl: '/verdant/properties',
  },
};

export const NoSubheading: Story = {
  args: {
    heading: 'Find Your Place in the City',
    ctaText: 'Explore Properties',
    ctaUrl: '/verdant/properties',
  },
};
