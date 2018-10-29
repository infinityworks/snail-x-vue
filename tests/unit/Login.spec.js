import { mount, createLocalVue } from '@vue/test-utils';
import Login from '@/components/auth/Login.vue';
import Vuex from 'vuex';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('Login.vue', () => {
    let wrapper;
    let actions;
    let store;
    let loginUser;

    beforeEach(() => {
        global.alert = jest.fn();
        loginUser = jest.fn();
        actions = {
            loginUser
        };
        store = new Vuex.Store({
            state: {},
            actions
        });
        wrapper = mount(Login, { store, localVue });
    });

    describe('invalid form', () => {
        it('does not submit when no email or password entered', () => {
            const login = wrapper.find('#login-button');
            login.trigger('click');

            expect(global.alert).toHaveBeenCalledWith('Please enter a email and password of valid length (0 to 100 chars)');
        });

        it('does not submit when email too long', () => {
            const login = wrapper.find('#login-button');
            const email = wrapper.find('#email-field');
            const password = wrapper.find('#password-field');

            email.element.value = 'testreallylongemailcscsdjcnsdkjcnsdkjcnsdjcnsdkjcnsdcjsdncjkdsncjdsncjksdncdjskncsjkdcndsjcnsdjcnsdjkcnsd@example.com';
            email.trigger('input');
            password.element.value = 'testpass123';
            password.trigger('input');

            login.trigger('click');

            expect(global.alert).toHaveBeenCalledWith('Please enter a email and password of valid length (0 to 100 chars)');
        });

        it('does not submit when password too long', () => {
            const login = wrapper.find('#login-button');
            const email = wrapper.find('#email-field');
            const password = wrapper.find('#password-field');

            email.element.value = 'test@example.com';
            email.trigger('input');
            password.element.value = 'reallylongpasswordjbvkdbvkdjfbvdvbjvdfkvbndjkfnvdfjkvndfjvndfvjkdnfvjdfnvdkjfvndfkjnvdfkjvndfjkvndfjkvndfjvndfkjnv';
            password.trigger('input');

            login.trigger('click');

            expect(global.alert).toHaveBeenCalledWith('Please enter a email and password of valid length (0 to 100 chars)');
        });
    });

    describe('valid form', () => {
        it('calls login action', () => {
            const login = wrapper.find('#login-button');
            const email = wrapper.find('#email-field');
            const password = wrapper.find('#password-field');

            email.element.value = 'test@example.com';
            email.trigger('input');
            password.element.value = 'testpass123';
            password.trigger('input');

            login.trigger('click');

            expect(loginUser).toHaveBeenCalledWith(
                expect.anything(),
                { email: 'test@example.com', password: 'testpass123' },
                undefined
            );
        });
    });
});
