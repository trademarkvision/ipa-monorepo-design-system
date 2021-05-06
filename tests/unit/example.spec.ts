import {shallowMount} from '@vue/test-utils';
import Card from '../../src/components/card.vue';

describe('Card.vue', () => {
  it('renders title when passed', () => {
    const title = 'Card title';
    const wrapper = shallowMount(Card, {
      propsData: {title}
    });
    expect(wrapper.text()).toContain(title);
  });
});
