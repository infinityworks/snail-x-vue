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
        registerUser = jest.fn();
        actions = {
            registerUser
        };
        store = new Vuex.Store({
            state: {},
            actions
        });
        wrapper = mount(Register, {store, localVue});
    });


    describe('invalid form', () => {
        it('returns false when testing with an invalid email string', () => {
            const email_input = wrapper.find('#email-input');
            const register_button = wrapper.find('#register-button');

            let validateEmailMock = jest.fn();
            wrapper.vm.validateEmail = validateEmailMock;

            email_input.value = "something";
            register_button.trigger('click');

            expect(validateEmailMock.mock.calls.length).toBe(0)
        });
    });
});