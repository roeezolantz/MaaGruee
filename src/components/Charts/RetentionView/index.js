import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";
import { useChartBehaviour } from 'Contexts/ChartBehaviourContext'
import config from 'utils/conf'
import { hashedTextRGB } from 'utils/colors'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { SelectSwitch } from '..'
import useSetState from 'utils/useSetState'

const buildOptions = (uniqueColors, uniqueNames) => {
    return {
        chart: {
            height: 350,
            type: 'radar',
        },
        dataLabels: {
            enabled: true
        },
        plotOptions: {
            radar: {
                size: 140,
                polygons: {
                    strokeColor: '#e9e9e9',
                    fill: {
                        colors: ['#f8f8f8', '#fff']
                    }
                }
            }
        },
        title: {
            text: 'Retentions Days by Network',
            align: 'center',
            offsetY: '-10',
            style: {
                fontSize: '16',
                fontWeight: 'bold',
            },
        },
        colors: uniqueColors,
        markers: {
            size: 1,
            colors: ['#fff'],
            strokeColor: '#FF4560',
            strokeWidth: 2,
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val === 0 ? "Doesn\'t exists " : val + " days";
                }
            }
        },
        xaxis: {
            categories: uniqueNames
        },
        yaxis: {
            tickAmount: 7,
            labels: {
                formatter: function (val, i) {
                    if (i % 2 === 0) {
                        return val
                    } else {
                        return ''
                    }
                }
            }
        },
        legend: {
            offsetY: 7
        }
    };
}

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

const RetentionView = props => {

    const classes = useStyles()
    const [store, dispatch] = useChartBehaviour()

    const [state, setState] = useSetState({
        options: buildOptions([], []),
        series: [],
        retentionTypes: [],
        selectedType: "",
        specificNetworkView: false,
    })

    const createSeries = (data, uniqueSensors, retentionType = false) => {
        let series = [];

        data.children.forEach(network => {
            let toAdd = { name: network.name }

            let names = network.children.map(c => c.name)
            let valsArr = [];

            uniqueSensors.forEach(optionalSensor => {
                // If the sensor does not exists in the network, put 0 instead
                if (names.includes(optionalSensor)) {
                    let currSensor = network.children.find(s => s.name === optionalSensor)
                    // If the current retention type does not exists on the current sensor, put 0 instead
                    valsArr.push(!currSensor.retentions || !currSensor.retentions[retentionType] ? 0 : currSensor.retentions[retentionType])
                } else {
                    valsArr.push(0)
                }
            })
            toAdd.data = valsArr;
            series.push(toAdd)
        });

        return series;
    }

    const buildChartData = (data, retentionType) => {
        if (!data) return [false, false];

        const uniqueSensors = Array.from(new Set(data.children.map(n => n.children.map(s => s.name)).flat()))
        const uniqueColorsByNetworks = data.children.map(c => config.GENERATE_COLORS ? hashedTextRGB(c.name) : c.hex)

        const series = createSeries(data, uniqueSensors, retentionType)
        const options = buildOptions(uniqueColorsByNetworks, uniqueSensors)

        return [series, options]
    }

    const getUnifiedSchemaForAllSelections = () => {
        const shouldShowOnlySpecificNetwork = store.currentNode && !store.sensor && store.clicked
        let data;

        // If a network selected, we take only the current network, not the entire tree
        // So in order to simplify the state, we fake existance of only one network
        if (shouldShowOnlySpecificNetwork) {
            data = {
                children: [{
                    ...store.currentNode
                }]
            }
        } else {
            data = props.data
        }

        return data
    }

    const handleTypeSelect = (selectedType) => {
        if (selectedType === state.selectedType) return;

        const data = getUnifiedSchemaForAllSelections()

        const [series, options] = buildChartData(data, selectedType)

        if (!series || !options) {
            setState({ error: 'Error while loading the data..' })
        } else {
            setState({ series, options, selectedType })
        }
    }

    /**
     * This function goes on each network and sensor to gather all unique retention types
     * Returns [] if nothing found
     * @param { Object } data 
     */
    const getAllUniqueRetentionTypes = (data) => {
        let allRetentionTypes = [];
        try {
            allRetentionTypes = Array.from(
                new Set(
                    data.children.map(n =>
                        n.children.map(s => Object.keys(s.retentions || {})).flat()
                    ).flat()
                )
            )
        } catch (err) {
            console.log("Something bad happened with the retentions of the data..")
        }

        return allRetentionTypes;
    }

    const init = () => {
        const allRetentionTypes = getAllUniqueRetentionTypes(props.data);
        const defaultType = allRetentionTypes[0]
        console.log("allRetentionTypes : ", allRetentionTypes, "and default is :", defaultType)

        const [series, options] = buildChartData(props.data, defaultType)

        if (!series || !options) {
            setState({ error: 'Error while loading the data..' })
        } else {
            setState({ series, options, retentionTypes: allRetentionTypes, selectedType: defaultType })
        }
    }

    // Initializations
    useEffect(() => {
        init()
    }, [props.data])

    // When selection is changed
    useEffect(() => {
        if (!store.clicked && !state.specificNetworkView) return;
        const shouldShowOnlySpecificNetwork = store.currentNode && !store.sensor
        let data;

        // If a network selected, we take only the current network, not the entire tree
        // So in order to simplify the state, we fake existance of only one network
        if (shouldShowOnlySpecificNetwork) {
            data = {
                children: [{
                    ...store.currentNode
                }]
            }
        } else {
            data = props.data
        }

        const [series, options] = buildChartData(data, state.selectedType)

        if (!series || !options) {
            setState({ error: 'Error while loading the data..' })
        } else {
            setState({
                series,
                options,
                selectedType: state.selectedType,
                specificNetworkView: shouldShowOnlySpecificNetwork
            })
        }

    }, [store.clicked, store.currentNode, store.sensor])

    return state.error ?
        (
            <p>{state.error}</p>
        ) : (
            <div className={classes.container}>
                <Typography className={classes.title}>Retentions in Days </Typography>
                {
                    state.retentionTypes && state.retentionTypes.length > 0 &&
                    (<SelectSwitch
                        options={state.retentionTypes}
                        default={state.retentionTypes[0]}
                        onSelected={(curr) => handleTypeSelect(curr)}
                    />)
                }
                <Chart options={state.options} series={state.series} type="radar" height={350} />
            </div>
        );
}

export default RetentionView;