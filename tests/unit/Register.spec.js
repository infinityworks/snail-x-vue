import { mount, createLocalVue } from '@vue/test-utils';
import Register from '@/components/auth/Register.vue';
import Vuex from 'vuex';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('Register.vue', () => {
    let wrapper;
    let actions;
    let store;
    let registerUser;

    beforeEach(() => {
        global.alert = jest.fn();
        registerUser = jest.fn();
        actions = {
            registerUser
        };
        store = new Vuex.Store({
            state: {},
            actions
        });
        wrapper = mount(Register, { store, localVue });
    });

    describe('invalid form', () => {
        it('does not submit when no details are entered', () => {
            const expect_value = false;
            const login = wrapper.find('#register-button');
            login.trigger('click');

            expect(Register.data.allValid).toBe(expect_value)
        });
    });
});