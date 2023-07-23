import {ComponentMeta, Story} from '@storybook/react'
import React from 'react'
import Component from './ActivationButton.js'
export default {
  title: 'Atoms/ActivationButton',
  component: Component,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    story => (
      <>
        <iframe
          src="https://chakra-ui.com/"
          style={{
            width: '100%',
            height: '100vh'
          }}
        />
        {story()}
      </>
    )
  ]
} as ComponentMeta<typeof Component>

type ComponentProps = React.ComponentProps<typeof Component>

// Create a template for the component
const Template: Story<ComponentProps> = args => <Component {...args} />

export const Basic: Story<ComponentProps> = Template.bind({})