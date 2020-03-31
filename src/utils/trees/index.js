import { removeFirst } from '../arrays'
import { hashedTextRGB } from '../colors'

/**
 * Recursively work backwards from highlighted node to find path of valud nodes
 * @param {Object} node - the current node being considered
 */
export function getKeyPath(node) {
    if (!node) return [];

    if (!node.parent) {
        return node.data && node.data.name ? [node.data.name] : ['root'];
    }

    return [(node.data && node.data.name) || node.name].concat(
        getKeyPath(node.parent)
    );
}

export function getNodesPath(node) {
    if (!node) return [];

    if (!node.parent) {
        return [node.data];
    }

    console.log("node.data is ;", node);

    return [(node.data && node.data.name) || node.data].concat(
        getNodesPath(node.parent)
    );
}

// /**
//  * Recursively work backwards from highlighted node to sum count of valud nodes
//  * @param {Object} node - The current node being considered
//  * @returns {String} valueName - The value to sum in each node
//  */
// export function getKeyCount(node, valueName) {
//     if (!node.parent) {
//         return 0;
//     }
//     // console.log("node is : ", node)
//     return ((node.data && node.data[valueName]) || node[valueName]) + getKeyCount(node.parent, valueName)
// }

const manipulateNode = (node, isActive, generateColor = true) => {
    // Manipulate the opacity of the hovered path
    node.style = {
        ...node.style,
        fill: (!node.hex || generateColor) ? hashedTextRGB(node.name) : node.hex,
        fillOpacity: isActive ? 1 : 0.3
    };
}

/**
 * This function goes over the given tree recursively and (MUTATELY) manipulate every node from the given path
 * Is is also returns the mutated tree
 * @param { Object } tree - the tree to manipulate over (nodes may contain children array attribute)
 * @param { Array } path - the given path array will be manipulated. nothing == show all, [] == hide all
 */
export const decorateData = (tree, path = false, generateColor) => {
    if (!tree || !tree.name) return {}

    const hasToActivate = !path || path[0] == 'root' || tree.name == path[0]

    manipulateNode(tree, hasToActivate, generateColor)
    tree.children && tree.children.forEach(curr => decorateData(curr, hasToActivate ? removeFirst(path) : [], generateColor))

    return tree;
}

export const validateStringPath = (tree, path = false) => {
    // TODO : Remove the first char if it is '/' by regex, to trim to /beresh!t and beresh!t 
    if (!path) return false;

    const pathArr = path.replace(/ /g, '').split('/')

    return validatePath(tree, pathArr);
}

// export const validatePath = (tree, path = false, enforceCasing = true) => {
    

//     if (!tree || !path || (!tree.children && path.length > 1))
//         return false;
//     else {
//         let name = tree.name,
//             path0 = path[0]

//         if (enforceCasing && 
//             typeof tree.name === "string" && 
//             typeof path[0] === "string") {
//             name = tree.name.toLowerCase()
//             path0 = path[0].toLowerCase()
//         }

//     if (tree.name != path[0])) {
//         return false
//     } else if (name === path[0] && path.length === 1) {
//         return true
//     } else if (name === path[0] && path.length > 1 && tree.children) {
//         return validatePath(children.find(c => c.name === path[1]), removeFirst(path))
//     } else {
//         return false
//     }
// }

// TODO : Upgrade the tests

export const validatePath = (tree, path = false, enforceCasing = true) => {
    const casingEq = (text1, text2, enforceCasing = true) => 
        new RegExp(text1, enforceCasing ? "i" : "").test(text2)
    
    if (!tree || !path || (!tree.children && path.length > 1) || !casingEq(tree.name, path[0])) {
        return false
    } else if (casingEq(tree.name, path[0]) && path.length === 1) {
        return true
    } else if (casingEq(tree.name, path[0]) && path.length > 1 && tree.children) {
        return validatePath(tree.children.find(c => casingEq(c.name, path[1])), removeFirst(path), enforceCasing)
    } else {
        return false
    }
}

export const sumAttributeValues = (node, attr) => {
    if (node && node.hasOwnProperty(attr) && !Number.isNaN(+node[attr])) {
        return +node[attr]
    } else if (node && node.children) {
        return node.children.map(curr => sumAttributeValues(curr, attr)).reduce((a, b) => a + b)
    } else return 0;
}

export const getAttributeValueByPath = (tree, path, attr = false) => {
    if (!tree || !path || (!tree.children && path.length > 1) || (tree.name != path[0])) {
        return false
    } else if (tree.name == path[0] && path.length == 1) {
        if (!attr) {
            return Object.keys(tree)
        } else if (tree.hasOwnProperty(attr)) {
            return tree[attr]
        } else {
            return false
        }
    } else if (tree.name === path[0] && path.length > 1 && tree.children) {
        return getAttributeValueByPath(tree.children.find(c => c.name === path[1]), removeFirst(path), attr)
    } else {
        return false
    }
}

export const findNodeByPath = (tree, path) => {
    if (!tree || !path || !path.length || path.length == 0) return false

    if (path.length === 1) {
        if (tree.name === path[0]) return tree;
        else return false;
    }

    return findNodeByPath(tree.children.find(c => c.name === path[1]), removeFirst(path))
}