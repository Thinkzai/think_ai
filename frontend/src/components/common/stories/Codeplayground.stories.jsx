import { ThemeProvider } from '../../ThemeProvider';
import CodePlayground from '../CodePlayground';

const meta = {
  title: 'Playground/CodePlayground',
  component: CodePlayground,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;

export const Default = {};