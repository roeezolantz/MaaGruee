import React from 'react'

const ChartBehaviourContext = React.createContext();

const initialState = {
    clicked: false,
    hasActiveNode: false,
    byStorage: true,
    network: false,
    sensor: false,
    confEditorUnsavedList: [],
    shouldReloadData: false,
}

const nodeHovered = {
    hasActiveNode: true,
}

const nodeSelected = {
    ...nodeHovered,
    clicked: true,
}

/**
 * Returns an object with the network and sensor extracted from the path array
 * @param { Array } pathArr - An array represents the node's path (eg. ['root', 'network', 'sensor'])
 */
export const extractEntitiesFromPath = pathArr => {
    const defaults = {
        network: false,
        sensor: false
    }

    if (!Array.isArray(pathArr)) return defaults;

    // Checks if the path is network (/root/network)
    if (pathArr.length === 2) {
        return {
            network: pathArr[1],
            sensor: false,
        }
    }
    // Else if the path is sensor (/root/network/sensor)
    else if (pathArr.length === 3) {
        return {
            network: pathArr[1],
            sensor: pathArr[2]
        }
    } else return defaults
}

function chartBehaviourReducer(state, action) {
    switch (action.type) {
        case 'SHOULD_RELOAD_DATA': {
            return {
                ...state,
                shouldReloadData: true,
            }
        }
        case 'NEW_DATA_RELOADED': {
            return {
                ...state,
                shouldReloadData: false,
                confEditorUnsavedList: [],
            }
        }
        case 'NODE_HOVERED': {
            return {
                ...state,
                currentNode: action.payload.node,
                currentPath: action.payload.path,
                ...nodeHovered,
                ...extractEntitiesFromPath(action.payload.path)
            }
        }
        case 'MOUSE_OUT': {
            return {
                ...state,
                currentNode: false,
                hasActiveNode: false,
                currentPath: false,
                ...extractEntitiesFromPath([])
            }
        }
        case 'NODE_SELECTED': {
            return {
                ...state,
                currentNode: action.payload.node,
                currentPath: action.payload.path,
                ...nodeSelected,
                ...extractEntitiesFromPath(action.payload.path)
            }
        }
        case 'CANCEL_SELECTION': {
            return {
                ...state,
                currentNode: false,
                hasActiveNode: false,
                clicked: false,
                currentPath: false,
                network: false,
                sensor: false,
            }
        }
        case 'FORCE_PATH_SELECT': {
            return {
                ...state,
                forcedPathArr: action.payload,
            }
        }
        case 'FILES_OR_STORAGE_VIEW': {
            return {
                ...state,
                byStorage: action.payload
            }
        }
        case 'CONF_EDITOR_TOUCHED': {
            const { network, sensor } = action.payload.data
            const unsavedIndex = state.confEditorUnsavedList.findIndex(c => c.network === network && c.sensor === sensor)

            let newList = state.confEditorUnsavedList;

            if (!action.payload.touched && unsavedIndex != -1)
                newList = newList.filter(c => c.network === network && c.sensor === sensor)
            else if (action.payload.touched) {
                if(unsavedIndex === -1)
                    newList.push({ ...action.payload.data })
                else
                    newList[unsavedIndex] = action.payload.data
            }

            return {
                ...state,
                confEditorUnsavedList: newList
            }
        }
        case 'CLEAR_CONF_EDITOR_HISTORY': {
            return {
                ...state,
                confEditorUnsavedList: [],
            }
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}

function ChartBehaviourProvider({ children }) {

    const [state, dispatch] = React.useReducer(chartBehaviourReducer, initialState)

    return (
        <ChartBehaviourContext.Provider value={{ state, dispatch }}>
            {children}
        </ChartBehaviourContext.Provider>
    )
}

function useChartBehaviour() {
    const context = React.useContext(ChartBehaviourContext)

    if (context === undefined) {
        throw new Error('useChartBehaviour must be used within a ChartBehaviourProvider')
    }

    return [context.state, context.dispatch]
}

export { ChartBehaviourProvider, useChartBehaviour }