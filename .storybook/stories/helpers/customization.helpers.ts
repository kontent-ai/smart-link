import { ComplexLayout } from './layout.helpers';
import { BaseZIndex } from '../../../src/web-components/constants/z-index';

const CustomizationTemplate = () => `
    <style>
      :root {
        --ksl-color-background-default: rgba(4, 102, 200, 1);
        --ksl-color-background-default-disabled: rgba(2, 62, 125, 1);
        --ksl-color-background-default-hover: rgba(0, 40, 85, 0.1);
        --ksl-color-background-secondary: rgba(2, 62, 125, 1);
        --ksl-color-background-default-selected: rgba(3, 83, 164, .1);
        --ksl-color-primary: rgba(4, 102, 200, 1);
        --ksl-color-primary-transparent: rgba(4, 102, 200, 0.5);
        --ksl-color-primary-hover: rgba(2, 62, 125, 1);
        --ksl-color-text-default: rgba(255, 255, 255, 1);
        --ksl-color-text-default-disabled: rgba(51, 65, 92, 1);
        --ksl-color-text-secondary: rgba(255, 255, 255, 1);
        --ksl-shadow-default: 0 8px 32px rgba(0, 24, 69, 0.24), 0 0 8px rgba(0, 0, 0, 0.03);
        --ksl-shadow-primary: 0 8px 10px rgba(4, 102, 200, 0.2), 0 6px 20px rgba(4, 102, 200, 0.12), 0 8px 14px rgba(4, 102, 200, 0.14);
        --ksl-z-index: ${BaseZIndex};
      }
    </style>
    ${ComplexLayout({})}
`;

export const Customization = CustomizationTemplate.bind({});
Customization.storyName = 'Customization';
