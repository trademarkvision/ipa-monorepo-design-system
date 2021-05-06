/* eslint-disable import/no-extraneous-dependencies */
import {withA11y} from '@storybook/addon-a11y';
import {action} from '@storybook/addon-actions';
import {boolean, number, select, text, withKnobs} from '@storybook/addon-knobs';
import {addDecorator, storiesOf, StoryDecorator} from '@storybook/vue';
import Card from '../components/card.vue';
import UikPopup from '../components/popup/popup.vue';
import Toast from '../components/toast.vue';

addDecorator(withA11y as StoryDecorator);
addDecorator((withKnobs as any) as StoryDecorator);

storiesOf('Popup', module)
  .add('with title', () => ({
    components: {UikPopup},
    template: `<div style="padding: 1rem;">
  <button @click="showPopup = true">Show popup</button>
  <uik-popup v-if="showPopup"
              :size="size"
              :title="title"
              :mobile-mode="mobileMode"
              :no-header="noHeader"
              :closable="closable"
              :no-buttons="noButtons"
              :no-padding="noPadding"
              @close="showPopup = false">
    <template #content>Popup content</template>
    <template #buttons>
      <button class="no-fill secondary clear">
        Cancel
      </button>

      <button class="fill secondary">
        Confirm
      </button>
    </template>
  </uik-popup>
</div>`,
    props: {
      size: {
        default: select('size', ['auto', 'small', 'medium', 'large', 'full'], 'auto')
      },
      title: {
        default: text('title', 'Popup title')
      },
      mobileMode: {
        default: boolean('mobileMode', false)
      },
      noHeader: {
        default: boolean('noHeader', false)
      },
      closable: {
        default: boolean('closable', true)
      },
      noButtons: {
        default: boolean('noButtons', false)
      },
      noPadding: {
        default: boolean('noPadding', false)
      }
    },
    data: () => ({
      showPopup: false
    })
  }))
  .add('with custom header', () => ({
    components: {UikPopup},
    template: `<div style="padding: 1rem;">
  <button @click="showPopup = true">Show popup</button>
  <uik-popup v-if="showPopup"
              :size="size"
              :title="title"
              :mobile-mode="mobileMode"
              :no-buttons="true"
              @close="showPopup = false">
    <template #header>
      <button style="margin: 0 1rem;">
          Action
      </button>
    </template>
    <template #content>Popup content</template>
  </uik-popup>
</div>`,
    props: {
      size: {
        default: select('size', ['auto', 'small', 'medium', 'large', 'full'], 'auto')
      },
      title: {
        default: text('title', 'Popup title')
      },
      mobileMode: {
        default: boolean('mobileMode', false)
      }
    },
    data: () => ({
      showPopup: false
    })
  }))
  .add('with scollable body', () => ({
    components: {UikPopup},
    template: `<div style="padding: 4rem 1rem 1rem;">
  <button @click="showPopup = true" style="position: fixed; top: 1rem; left: 1rem;">Show popup</button>
  <p style="height: 15rem;">Some content</p>
  <p style="height: 15rem;">More content</p>
  <p style="height: 15rem;">Even more content</p>
  <p style="height: 15rem;">Yet even more content</p>
  <p style="height: 15rem;">Final content</p>
  <uik-popup v-if="showPopup"
              size="full"
              title="This should lock body scrolling on the overlay"
              :mobile-mode="mobileMode"
              :no-buttons="true"
              @close="showPopup = false">
    <template #content>
      <div style="height: 100%; overflow-y: auto">
        <p style="height: 15rem;">Some content</p>
        <p style="height: 15rem;">More content</p>
        <p style="height: 15rem;">Even more content</p>
        <p style="height: 15rem;">Yet even more content</p>
        <p style="height: 15rem;">Final content</p>
      </div>
    </template>
  </uik-popup>
</div>`,
    props: {
      mobileMode: {
        default: boolean('mobileMode', false)
      }
    },
    data: () => ({
      showPopup: false
    })
  }))
  .add('with scollable body (horizontal)', () => ({
    components: {UikPopup},
    template: `<div style="padding: 4rem 1rem 1rem;">
  <button @click="showPopup = true" style="position: fixed; top: 1rem; left: 1rem;">Show popup</button>
  <div style="display: flex; height: 15rem; overflow-x: auto;">
    <p style="flex-shrink: 0; width: 15rem;">Some content</p>
    <p style="flex-shrink: 0; width: 15rem;">More content</p>
    <p style="flex-shrink: 0; width: 15rem;">Even more content</p>
    <p style="flex-shrink: 0; width: 15rem;">Yet even more content</p>
    <p style="flex-shrink: 0; width: 15rem;">Final content</p>
  </div>
  <uik-popup v-if="showPopup"
              size="full"
              title="This should lock body scrolling on the overlay"
              :mobile-mode="mobileMode"
              :no-buttons="true"
              @close="showPopup = false">
    <template #content>
      <div style="display: flex; height: 100%; overflow-x: auto">
        <p style="flex-shrink: 0; width: 15rem;">Some content</p>
        <p style="flex-shrink: 0; width: 15rem;">More content</p>
        <p style="flex-shrink: 0; width: 15rem;">Even more content</p>
        <p style="flex-shrink: 0; width: 15rem;">Yet even more content</p>
        <p style="flex-shrink: 0; width: 15rem;">Final content</p>
      </div>
    </template>
  </uik-popup>
</div>`,
    props: {
      mobileMode: {
        default: boolean('mobileMode', false)
      }
    },
    data: () => ({
      showPopup: false
    })
  }));

storiesOf('Card', module)
  .add('with title', () => ({
    components: {Card},
    template: `<card title="Test card" @click="action"></card>`,
    methods: {action: action('clicked')}
  }))
  .add('with content', () => ({
    components: {Card},
    template: `<card title="Test card with content" @click="action">
  <template #card-content>Some content</template>
</card>`,
    methods: {action: action('clicked')}
  }));

storiesOf('Toast', module)
  .add('trigger', () => ({
    components: {Toast},
    template: `<div style="padding: 1rem;">
  <button @click="showToast()">
    Show toast
  </button>
  <toast></toast>
</div>`,
    props: {
      title: {
        default: text('title', 'Toast title')
      },
      message: {
        default: text('message', 'Toast message')
      },
      type: {
        default: select('type', ['info', 'warning', 'error'], 'info')
      },
      duration: {
        default: number('duration', 2)
      }
    },
    methods: {
      showToast() {
        this.$root.$emit('toast', {
          title: (this as any).title,
          message: (this as any).message,
          type: (this as any).type,
          duration: (this as any).duration
        });
      }
    }
  }));

