import { bet } from './bet';

describe('bet function', () => {
    it('get a bet', () => {
        expect(bet()).toEqual('bet');
    });
});