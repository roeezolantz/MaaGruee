import { decorateData, getKeyPath, sumAttributeValues, validatePath, getAttributeValueByPath, findNodeByPath, getNodesPath } from './index'
import mockTree from '../mocks/tree'
import { specificPathMarkedTree, unmarkedFullTree, markedFullTree } from '../mocks/decoratedPathTree'
import { halfPathExistsMock, pathDoesNotExistsMock, pathExistsMock } from '../mocks/pathExistanceChecks'
import { level1Node, level2Node, level1TreeNode, level2TreeNode } from '../mocks/node';

describe('Checks sumAttributeValues', () => {
    describe('invalid arguments', () => {
        test('undefined tree', () => {
            expect(sumAttributeValues(undefined, 'roee')).toBe(0);
        });

        test('empty tree', () => {
            expect(sumAttributeValues({}, 'roee')).toBe(0);
        });

        test('no attribute to sum', () => {
            expect(sumAttributeValues(mockTree)).toBe(0);
        });

        test('attribute to sum is undefined', () => {
            expect(sumAttributeValues(mockTree, undefined)).toBe(0);
        });

        test('attribute is text', () => {
            expect(sumAttributeValues(mockTree, "name")).toBe(0);
        });

        test('attribute is not summable (object with children)', () => {
            expect(sumAttributeValues(mockTree, "children")).toBe(0);
        });
    });

    describe('valid arguments', () => {
        test('attribute to sum does not exists in the tree', () => {
            expect(sumAttributeValues(mockTree, 'roee')).toBe(0);
        });

        test('attribute exists only in root', () => {
            expect(sumAttributeValues(mockTree, "totalAvailableStorage")).toBe(1500000000);
        });

        test('attribute exists somewhere once in tree', () => {
            expect(sumAttributeValues(mockTree, "randomNumber")).toBe(1000);
        });

        test('attribute exists on every children', () => {
            expect(sumAttributeValues(mockTree, "files")).toBe(950);
        });

        test('attribute exists on every children', () => {
            expect(sumAttributeValues(mockTree, "storage")).toBe(607600);
        });
    });
});

describe('Checks getKeyPath', () => {
    describe('invalid arguments', () => {
        test('node is undefined', () => {
            expect(getKeyPath(undefined)).toEqual([])
        })

        test('node is empty object', () => {
            expect(getKeyPath({})).toEqual(['root'])
        })
    });

    describe('valid arguments', () => {
        test('node is root', () => {
            expect(getKeyPath(mockTree).reverse()).toEqual(['root'])
        });

        test('node has children and parent', () => {
            expect(getKeyPath(level1Node).reverse()).toEqual(['beresh!t', 'network3'])
        });

        test('node has no childrens', () => {
            expect(getKeyPath(level2Node).reverse()).toEqual(['beresh!t', 'network3', 'sensor2'])
        });
    });
});

describe('Checks decorateData', () => {
    describe('invalid arguments', () => {
        test('tree is undefined and path is []', () => {
            expect(decorateData(undefined, [])).toEqual({})
        })

        test('tree is undefined and path is valid', () => {
            expect(decorateData(undefined, ['root', 'test'])).toEqual({})
        })

        test('tree is undefined and no path', () => {
            expect(decorateData(undefined)).toEqual({})
        })
    });

    describe('valid arguments', () => {
        let data;

        beforeEach(() => {
            data = Object.assign({}, mockTree);
        });

        test('specific path manipulation', () => {
            expect(decorateData(data, specificPathMarkedTree.path, false)).toEqual(specificPathMarkedTree.tree)
        });

        test('decorateData does mutate specific path in given tree', () => {
            expect(decorateData(data, specificPathMarkedTree.path, false)).toEqual(specificPathMarkedTree.tree)
            expect(data).toEqual(specificPathMarkedTree.tree)
        });

        test('no path', () => {
            expect(decorateData(data, false, false)).toEqual(markedFullTree)
        });

        test('hide the entire tree', () => {
            expect(decorateData(data, [], false)).toEqual(unmarkedFullTree)
        });

        test('decorateData does mutate all the given tree', () => {
            expect(decorateData(data, [], false)).toEqual(unmarkedFullTree)
            expect(data).toEqual(unmarkedFullTree)
        });

        test('show the entire tree', () => {
            expect(decorateData(data, false, false)).toEqual(markedFullTree)
        });

        test('decorateData does mutate all the given tree', () => {
            expect(decorateData(data, false, false)).toEqual(markedFullTree)
            expect(data).toEqual(markedFullTree)
        });
    });
});

describe('Checks validatePath', () => {
    describe('invalid arguments', () => {
        test('tree is undefined and path is []', () => {
            expect(validatePath(undefined, [])).toEqual(false)
        })

        test('tree is undefined and path is valid', () => {
            expect(validatePath(undefined, ['root', 'test'])).toEqual(false)
        })

        test('tree is undefined and no path', () => {
            expect(validatePath(undefined)).toEqual(false)
        })
    });

    describe('valid arguments', () => {
        test('half of path exists', () => {
            expect(validatePath(halfPathExistsMock.tree, halfPathExistsMock.path)).toEqual(false)
        });

        test('path does not exists', () => {
            expect(validatePath(pathDoesNotExistsMock.tree, pathDoesNotExistsMock.path)).toEqual(false)
        });

        test('path does exist', () => {
            expect(validatePath(pathExistsMock.tree, pathExistsMock.path)).toEqual(true)
        });
    });
});

describe('Checks getAttributeValueByPath', () => {
    let data;

    beforeAll(() => {
        data = Object.assign({}, mockTree);
    });

    describe('invalid arguments', () => {
        test('nothing given', () => {
            expect(getAttributeValueByPath()).toEqual(false)
        })
        
        test('bad data', () => {
            expect(getAttributeValueByPath(undefined)).toEqual(false)
            expect(getAttributeValueByPath(undefined, undefined)).toEqual(false)
            expect(getAttributeValueByPath(undefined, undefined, undefined)).toEqual(false)
            expect(getAttributeValueByPath(undefined, undefined, {})).toEqual(false)
        })

        test('empty data', () => {
            expect(getAttributeValueByPath({}, [])).toEqual(false)
        })
    });

    describe('valid arguments', () => {
        test('no attr given', () => {
            expect(getAttributeValueByPath(data, ['root'])).toEqual([ "name", "hex", "totalAvailableStorage", "totalUsedStorage", "children" ])
        });

        test('valid attr given', () => {
            expect(getAttributeValueByPath(data, ['root'], "name")).toEqual('root')
        });

        test('invalid attr given', () => {
            expect(getAttributeValueByPath(data, ['root'], "kaki")).toEqual(false)
        });

        test('long path given', () => {
            expect(getAttributeValueByPath(data, ['root', 'network2', 'sensor1'], "storage")).toEqual(15800)
        });

        test('value of attr is object', () => {
            expect(getAttributeValueByPath(data, ['root', 'network3', 'sensor1'], "test")).toEqual({"value": "obj"})
        });
    });
});

describe('Checks findNodeByPath', () => {
    let data;

    beforeAll(() => {
        data = Object.assign({}, mockTree);
    });

    describe('invalid arguments', () => {
        test('nothing given', () => {
            expect(findNodeByPath()).toEqual(false)
        })
        
        test('bad data', () => {
            expect(findNodeByPath(undefined)).toEqual(false)
            expect(findNodeByPath(undefined, undefined)).toEqual(false)
        })

        test('empty data', () => {
            expect(findNodeByPath({}, [])).toEqual(false)
        })
    });

    describe('valid arguments', () => {
        test('node does not exists', () => {
            expect(findNodeByPath(data, ['zolantz'])).toEqual(false)
        });

        test('node is root', () => {
            expect(findNodeByPath(data, ['root'])).toEqual(data)
        });

        test('node is in level 1', () => {
            expect(findNodeByPath(data, ['root', 'network2'])).toEqual(level1TreeNode)
        });

        test('deep node does not exists', () => {
            expect(findNodeByPath(data, ['root', 'zolantz'])).toEqual(false)
        });

        test('node is in level 2', () => {
            expect(findNodeByPath(data, ['root', 'network3', 'sensor1'])).toEqual(level2TreeNode)
        });
    });
})