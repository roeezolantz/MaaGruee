import React, { useState, useEffect } from 'react';
import { useChartBehaviour } from 'Contexts/ChartBehaviourContext'
import { TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { validatePath } from 'utils/trees'
import { compareArrays } from 'utils/arrays'

const NodePathInput = props => {
    const useStyles = makeStyles(theme => ({
        container: {
            display: 'flex',
        },
        text: {
            fontSize: "x-large",
            color: "#5b5b5f",
        },
        button: {
            margin: theme.spacing(1),
        },
        input: {
            height: '45px',
            width: '350px',
            background: '#fff3',
            color: 'primary',
            borderColor: 'white',
            '&.Mui-error': {
                borderColor: 'red',
                background: '#ffffffa6',
                color: 'red'
            },
            '&:hover': {
                background: '#fff3',
                color: 'primary',
                borderColor: 'white',
            },
            '&.Mui-focused': {
                background: '#fff3',
                color: 'primary',
                borderColor: 'white',
                '&.Mui-error': {
                    borderColor: 'red',
                },
            },
        }
    }));

    const classes = useStyles();
    const [store, dispatch] = useChartBehaviour();
    const placeholderText = "First, select a node to inspect it..";
    const [text, setText] = useState('');
    const [error, setError] = useState(false)

    useEffect(() => {
        if (store.currentNode && store.currentPath) {
            setText(store.currentPath.join(' \/ '))
            setError(false)
        } else {
            setText('')
        }
    }, [store.currentNode, store.currentPath])

    const handleChange = event => {
        setText(event.target.value)

        const pathArr = event.target.value.replace(/ /g, '').split('/').filter(c => c)

        if (pathArr.length == 0 || validatePath(props.data, pathArr)) {
            setError(false)

            if (!compareArrays(pathArr, store.currentPath)) {
                dispatch({
                    type: 'FORCE_PATH_SELECT',
                    payload: pathArr,
                })
            }
        } else {
            setError(true)
        }
    }

    return (
        <TextField
            id="path"
            // label="Path" 
            variant="outlined"
            autoFocus
            value={text}
            placeholder={placeholderText}
            error={error}
            // helperText={errorText}
            onChange={handleChange}
            InputProps={{
                className: classes.input
            }}
            onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    // This is a tricky way to fire the onChange event using a fake event object to handle enter press
                    handleChange({ target: { value: text } })
                }
            }} />
    )
}

export default NodePathInput;