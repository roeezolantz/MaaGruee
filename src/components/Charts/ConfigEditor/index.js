import React, { useState, useEffect } from 'react';
import { useChartBehaviour } from 'Contexts/ChartBehaviourContext'
import { Button, Typography, TextField, InputAdornment } from '@material-ui/core'
import { Save } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles';
import config from 'utils/conf'
import useSetState from 'utils/useSetState'
import { compareArrays } from 'utils/arrays'
import { showAjaxToast } from 'utils/Toast'

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: '16',
    },
    root: {
        '& .MuiTextField-root': {
            margin: '10px',
        },
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        marginRight: '10px',
    },
    unsaved: {
        marginRight: '15px',
        alignSelf: 'center',
        color: 'red',
    }
}))

const API_PATH = config.API_ADDRESS + '/data'

const ConfigEditor = props => {

    const classes = useStyles()

    const [store, dispatch] = useChartBehaviour()
    const [error, setError] = useState(false)
    const [formDirty, setFormDirty] = useState(false);
    const [state, setState] = useSetState({
        quotas: store.currentNode.quotas || {},
        retentions: store.currentNode.retentions || {}
    })

    /**
     * If the current's node history exists, set it in the state, otherwise get the original data
     */
    const getFormFromHistory = () => {
        if (!config.ALLOW_UNSAVED_CONFIGURATIONS_HISTORY) {
            setState({
                quotas: store.currentNode.quotas || {},
                retentions: store.currentNode.retentions || {}
            })
        } else {
            const selfUnsavedIndex = store.confEditorUnsavedList.findIndex(c =>
                c.network === store.network &&
                c.sensor === store.sensor)

            if (selfUnsavedIndex != -1) {
                setState({
                    quotas: store.confEditorUnsavedList[selfUnsavedIndex].quotas,
                    retentions: store.confEditorUnsavedList[selfUnsavedIndex].retentions
                })
            } else {
                setState({
                    quotas: store.currentNode.quotas,
                    retentions: store.currentNode.retentions
                })
            }
        }
    }

    /**
     * This function saves any changes in the form to the store
     */
    const handleFormHistory = () => {
        const { quotas, retentions } = state

        const sameRetentions = retentions && compareArrays(Object.values(store.currentNode.retentions), Object.values(retentions))
        const sameQuotas = quotas && compareArrays(Object.values(store.currentNode.quotas), Object.values(quotas))
        const isDirty = (retentions && !sameRetentions) || (quotas && !sameQuotas)

        setFormDirty(isDirty)
        dispatch({
            type: 'CONF_EDITOR_TOUCHED',
            payload: {
                touched: isDirty,
                data: {
                    network: store.network,
                    sensor: store.sensor,
                    quotas,
                    retentions
                }
            }
        })
    }

    useEffect(() => {
        getFormFromHistory()
    }, [])

    useEffect(() => {
        getFormFromHistory()
    }, [store.currentNode])

    useEffect(() => {
        handleFormHistory()
    }, [state])

    const clearForm = () => {
        setState({
            quotas: store.currentNode.quotas || {},
            retentions: store.currentNode.retentions || {}
        })
    }

    const editRetentions = vals => {
        if (Object.values(vals).filter(curr => isNaN(curr)).length === 0) {
            setState({
                retentions: {
                    ...state.retentions,
                    ...vals
                }
            })
        }
    }

    const editQuotas = vals => {
        if (Object.values(vals).filter(curr => isNaN(curr)).length === 0) {
            setState({
                quotas: {
                    ...state.quotas,
                    ...vals
                }
            })
        }
    }

    const handleSumbit = async () => {
        const numericQuotas = Object.fromEntries(Object.entries(state.quotas).map(pair => [pair[0], +pair[1]]))
        const numericRetentions = Object.fromEntries(Object.entries(state.retentions).map(pair => [pair[0], +pair[1]]))

        const dataToSend = {
            path: store.currentPath,
            network: store.network,
            sensor: store.sensor,
            quotas: {
                ...numericQuotas
            },
            retentions: {
                ...numericRetentions
            },
            metadata: {
                changeDate: Date.now(),
                user: 'zolantz the gever',
            }
        }

        showAjaxToast(
            'Sending data to the server...',
            'Data updated successfully!',
            'Error while updating the data..',
            2000,
            API_PATH,
            'PUT',
            dataToSend,
            () => dispatch({ type: 'SHOULD_RELOAD_DATA' })
        )
    }

    return error ?
        (
            <p>{error}</p>
        ) : (
            <div className={classes.container}>
                <Typography className={classes.title}> Configurations Editor </Typography>
                <form className={classes.root} autoComplete="off">
                    {state.quotas && (<Typography className={classes.title}> Quotas : </Typography>)}
                    {
                        Object.keys(state.quotas || {}).map(quotaType =>
                            <TextField
                                key={quotaType}
                                label={quotaType}
                                variant="outlined"
                                id={quotaType}
                                value={state.quotas[quotaType]}
                                onChange={(e) => editQuotas({ [quotaType]: e.target.value })}
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">KB</InputAdornment>,
                                }}
                            />
                        )
                    }
                    {state.retentions && (<Typography className={classes.title}> Retentions : </Typography>)}
                    {
                        Object.keys(state.retentions || {}).map(retType =>
                            <TextField
                                key={retType}
                                label={retType}
                                variant="outlined"
                                id={retType}
                                value={state.retentions[retType]}
                                onChange={(e) => editRetentions({ [retType]: e.target.value })}
                                InputProps={{
                                    endAdornment: <InputAdornment position="start">days</InputAdornment>,
                                }}
                            />
                        )
                    }

                    {!error && (
                        <div className={classes.buttonsContainer}>
                            {formDirty && <Typography className={classes.unsaved}> * Unsaved Configurations *</Typography>}
                            <Button
                                disabled={!formDirty}
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                startIcon={<Save />}
                                onClick={handleSumbit}>
                                Save
                            </Button>
                            <Button disabled={!formDirty} color="secondary" onClick={clearForm}>Cancel</Button>
                        </div>
                    )}
                </form>
            </div>
        );
}

export default ConfigEditor;