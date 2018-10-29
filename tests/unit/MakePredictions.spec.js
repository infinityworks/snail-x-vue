import { mount, createLocalVue } from '@vue/test-utils';
import MakePredictions from '@/components/predictions/MakePredictions.vue';
import Vuex from 'vuex';

const localVue = createLocalVue();

localVue.use(Vuex);

describe('MakePredictions.vue', () => {
    let wrapper;
    let actions;
    let store;
    let storePredictions;
    let getOpenRound;

    beforeEach(() => {
        storePredictions = jest.fn();
        getOpenRound = jest.fn();
        global.alert = jest.fn();
        actions = {
            storePredictions,
            getOpenRound
        };
        store = new Vuex.Store({
            state: {},
            actions
        });
        wrapper = mount(MakePredictions, {store, localVue});
    });

    describe('valid form', () => {
        it('does not submit when no details are entered', () => {
            MakePredictions.races = [1,2,3];
            MakePredictions.checkedRadios = [1];

            const getOpenRoundMock = jest.fn();
            wrapper.vm.getOpenRound = getOpenRoundMock;

            console.log(getOpenRoundMock.mock.calls.length);

            const submit = wrapper.find('#submit-predictions-button');
            submit.trigger('click');

            expect(global.alert).toHaveBeenCalledWith("You must select a winner for every race.");
        });

        test('all ticked', () => {
            const spy = jest.spyOn(MakePredictions, 'allTicked');
            const isPlaying = MakePredictions.allTicked();

            expect(spy).toHaveBeenCalled();
            expect(isPlaying).toBe(true);

            spy.mockRestore();
        });
    });
});