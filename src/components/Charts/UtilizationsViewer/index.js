import React, { useEffect } from 'react';
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Chart from "react-apexcharts";
import { SelectSwitch } from '../'
import { useChartBehaviour } from 'Contexts/ChartBehaviourContext'
import useSetState from 'utils/useSetState'

const round = number => Math.round((number + Number.EPSILON) * 100) / 100

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
}))

const createOptions = (type) => {
    return {
        title: {
            // text: `${type} Utilization`,
            align: 'center',
            size: 1,
            colors: ['#fff'],
            strokeColor: '#FF4560',
            strokeWidth: 2,
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '70%',
                }
            },
        },
        labels: [type]
    }
};

const UtilizationsViewer = props => {

    const classes = useStyles()
    const [store, dispatch] = useChartBehaviour();
    const [state, setState] = useSetState({
        quotaTypes: [],
        selectedType: "",
        options: createOptions(""),
    })

    const handleTypeSelect = (selectedType) => {
        if (selectedType != state.selectedType)
            setState({ selectedType, options: createOptions(selectedType) })
    }

    const init = () => {
        const quotaTypes = Object.keys(store.currentNode.quotas).filter(curr => !isNaN(store.currentNode[curr]))
        console.log("quotaTypes are : ", quotaTypes)
        const defaultType = quotaTypes[0]
        const options = createOptions(defaultType)

        setState({
            quotaTypes,
            selectedType: defaultType,
            options
        })
    }

    // Initializations
    useEffect(() => {
        init()
    }, [store.currentNode])

    const { selectedType, quotaTypes } = state
    const selectedValue = round(store.currentNode[selectedType] / store.currentNode.quotas[selectedType] * 100)

    return (
        <div className={classes.container}>
            <Typography className={classes.title}>Resources Utilization</Typography>
            {
                quotaTypes && quotaTypes.length > 0 &&
                (<SelectSwitch
                    options={quotaTypes}
                    default={selectedType}
                    onSelected={(curr) => handleTypeSelect(curr)}
                />)
            }
            {
                !isNaN(selectedValue) ? 
                    <Chart options={state.options} series={[selectedValue]} type="radialBar" height={200} /> :
                    <p>This quota type is unavailable</p>
            }
        </div>
    )
}

export default UtilizationsViewer;