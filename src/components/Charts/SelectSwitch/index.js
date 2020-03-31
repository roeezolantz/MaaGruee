import React, { useState, useEffect } from 'react';
import { Typography, FormControl, RadioGroup, FormLabel, FormControlLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
        margin: '10',
    },
    switchOff: {
    },
    switchOn: {
        color:'#3f51b5',
        cursor: 'pointer',
        textAlign: 'center',
        fontWeight: 'bold',
        textDecoration: 'underline'
    },
}))

const SelectSwitch = props => {

    const classes = useStyles()
    const [selected, setSelected] = useState(props.default)
    const [options, setOptions] = useState([])

    const getControl = (curr) => {
        const isSelected = selected === curr
        return (<Typography className={isSelected ? classes.switchOn : classes.switchOff} onClick={() => handleSelect(curr)}>{curr}</Typography>)
    }

    const handleSelect = curr => {
        console.log("Changing selection to :", curr)
        setSelected(curr)
        props.onSelected(curr)
    }

    useEffect(() => {
        setOptions(props.options)
    }, [props.options])

    useEffect(() => {
        handleSelect(props.default)
    }, [props.default])

    return (

        <FormControl component="fieldset">
            <RadioGroup defaultValue="female" aria-label="gender" name="customized-radios" style={{ flexDirection: 'row' }}>
                {
                    options.map(curr => <FormControlLabel key={curr} style={{ margin: '5px' }} value={curr} control={getControl(curr)} />)
                }
            </RadioGroup>
        </FormControl>
    )
}

export default SelectSwitch;