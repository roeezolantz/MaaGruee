
import { removeFirst, compareArrays } from './index'

describe('Checks removeFirst', () => {
    describe('invalid arguments', () => {
        test('array is undefined', () => {
            expect(removeFirst(undefined)).toEqual(false)
        })

        test('array is empty object', () => {
            expect(removeFirst({})).toEqual(false)
        })
    });

    describe('valid arguments', () => {
        test('array is root', () => {
            expect(removeFirst([])).toEqual([])
        });

        test('array contains 1 item', () => {
            expect(removeFirst(['roee'])).toEqual([])
        });

        test('array contains 2 items', () => {
            expect(removeFirst(['roee', 'zolantz'])).toEqual(['zolantz'])
        });

        test('array contains 2 objects', () => {
            expect(removeFirst([{ key: 'value1' }, { key: 'value2' }])).toEqual([{ key: 'value2' }])
        });
    });
});

describe('Checks compareArrays', () => {
    describe('invalid arguments', () => {
        test('nothing given', () => {
            expect(compareArrays()).toEqual(false)
        })

        test('one array only', () => {
            expect(compareArrays([])).toEqual(false)
        })

        test('one is undefined', () => {
            expect(compareArrays([], undefined)).toEqual(false)
            expect(compareArrays(undefined, [])).toEqual(false)
        })

        test('both are undefined', () => {
            expect(compareArrays(undefined, undefined)).toEqual(false)
        })

        test('one is strings', () => {
            expect(compareArrays("roee", [])).toEqual(false)
            expect(compareArrays([], "roee")).toEqual(false)
        })

        test('both are strings', () => {
            expect(compareArrays("roee", "zolantz")).toEqual(false)
        })
    });

    describe('valid arrays with defaults', () => {
        test('empty arrays', () => {
            expect(compareArrays([], [])).toEqual(true)
        });

        test('first is filled and second is empty', () => {
            expect(compareArrays(['roee'], [])).toEqual(false)
        });

        test('same 1 string', () => {
            expect(compareArrays(['roee'], ['roee'])).toEqual(true)
        });

        test('same array, multiple types', () => {
            expect(compareArrays(['roee', 'zolantz', 1, 2], ['roee', 'zolantz', 1, 2])).toEqual(true)
        });

        test('same items, diffrent orders', () => {
            expect(compareArrays(['roee', 'zolantz', 2, 1], ['roee', 'zolantz', 1, 2])).toEqual(false)
        });

        test('diffrent arrays', () => {
            expect(compareArrays(['r', 'z', 3, 100], ['roee', 'zolantz', 1, 2])).toEqual(false)
        });
    });

    describe('options checks', () => {
        test('defaults are ordered and casing', () => {
            expect(compareArrays(["roee", "zolantz"], ["roee", "zolantz"])).toEqual(true)
            expect(compareArrays(["roee", "zolantZ"], ["roee", "zolantz"])).toEqual(false)
            expect(compareArrays(["zolantz", "roee"], ["roee", "zolantz"])).toEqual(false)
        });

        test('should enforce orders', () => {
            expect(compareArrays(["roee", "zolantz"], ["roee", "zolantz"], true)).toEqual(true)
            expect(compareArrays(["zolantz", "roee"], ["roee", "zolantz"], true)).toEqual(false)
        });

        test('should not enforce orders', () => {
            expect(compareArrays(["roee"], ["roee"], false)).toEqual(true)
            expect(compareArrays(["zolantz", "roee"], ["roee", "zolantz"], false)).toEqual(true)
        });

        test('should enforce casing', () => {
            expect(compareArrays(["roee"], ["roeE"], undefined, true)).toEqual(false)
            expect(compareArrays(["Roee", "ZolantZ"], ["rOEe", "zoLanTz"], undefined, true)).toEqual(false)
            expect(compareArrays(["roeE", "A"], ["roeE", "A"], undefined, true)).toEqual(true)
        });

        test('should not enforce casing', () => {
            expect(compareArrays(["roee"], ["roeE"], undefined, false)).toEqual(true)
            expect(compareArrays(["Roee", "ZolantZ"], ["rOEe", "zoLanTz"], undefined, false)).toEqual(true)
        });
    });

    describe('numeric arrays', () => {
        test('same same', () => {
            expect(compareArrays([1, 2, 3, 4], [1, 2, 3, 4])).toEqual(true)
        })

        test('different items', () => {
            expect(compareArrays([1, 2, 3, 4], [1, 2, 3, 4, 5])).toEqual(false)
            expect(compareArrays([1, 2, 3, 4, 5], [1, 2, 3, 4])).toEqual(false)
        })

        test('different order', () => {
            expect(compareArrays([1, 2, 4, 3], [1, 2, 3, 4])).toEqual(false)
        })

        test('regex numeric edge cases', () => {
            expect(compareArrays([11, 0.2, 40, 32], [1, 2, 4, 23])).toEqual(false)
        })
    })
});