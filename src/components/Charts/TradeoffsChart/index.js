import React, { useEffect, useState } from 'react';
import { useChartBehaviour } from 'Contexts/ChartBehaviourContext'
import Chart from "react-apexcharts";
import config from 'utils/conf'
import { hashedTextRGB } from 'utils/colors'

const createOptions = (currentSensor, uniqueSensorsArr, uniqueNetworksColors, resolution) => {
    return {
        title: {
            text: `1 ${resolution} of ${currentSensor}'s storage equals to :`,
            align: 'center',
        },
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                // legend: {
                //     position: 'bottom',
                //     offsetX: -10,
                //     offsetY: 0
                // }
            }
        }],
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
        xaxis: {
            type: 'string',
            categories: uniqueSensorsArr,
        },
        yaxis: {
            title: {
                text: `${resolution}s`
            }
        },
        legend: {
            offsetY: 7
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return `${val} ${resolution}s`
                }
            }
        },
        colors: uniqueNetworksColors
    }
}

const TradeoffsChart = props => {
    const [store, dispatch] = useChartBehaviour()
    const [error, setError] = useState(false)
    const [state, setState] = useState({
        options: createOptions("", [], [], ""),
        series: [],
    })

    const buildApiPath = (network, sensor) => 
        config.API_ADDRESS + `/tradeoffs?network=${encodeURIComponent(network)}&sensor=${encodeURIComponent(sensor)}`

    const fetchDataFromAPI = () => {
        const API_PATH = buildApiPath(store.network, store.sensor)

        fetch(API_PATH)
            .then(res => res.json())
            .then(res => {

                if (Array.isArray(res.tradeoffs) && res.tradeoffs.length > 0) {
                    const [series, options] = getChartData(res)

                    if (!series || !options) {
                        setState({ error: 'Error while loading the data..' })
                    } else {
                        setState({ series, options })
                    }
                    setError(false)
                } else {
                    setError(`Tradeoffs for the current sensor weren't calculated yet`)
                }
            }, error => {
                console.log("Error while fetching tradeoffs : ", error)
                setError('Error while loading the data..')
            })
    }

    /**
     * This function get the raw tradeoffs json from the api and parse it 
     * to a much easier schema
     * @param { JSON } tradeoffs 
     */
    const parseTradeoffs = tradeoffs => {
        // The new schema looks like : 
        // {
        //     "tradeoffs": {
        //         "network1": {
        //             "sensor1": value,
        //             "sensor2": value
        //         },
        //         "network2": {
        //             "sensor1": value,
        //             "sensor3": value,
        //         }
        //     }
        // }

        let jsonAsObject = {}

        tradeoffs.forEach(curr => {

            if (!jsonAsObject[curr.network]) {
                jsonAsObject[curr.network] = {
                    [curr.sensor]: curr.value
                }
            } else {
                jsonAsObject[curr.network][curr.sensor] = curr.value
            }
        })

        return jsonAsObject
    }

    /**
     * This function returns the series list needed for the chart
     * @param { Object } parsedTradeoffs - The parsed tradeoffs object
     * @param { Array } uniqueSensorsArr - Array of all the unique sensors
     */
    const createSeries = (parsedTradeoffs, uniqueSensorsArr) => {

        // The data structure of this charts is : 
        // series: [{
        //     name: 'Network1',
        //     data: [sensor1, sensor2, sensor3...]
        //   },
        //   {
        //     name: 'Network1',
        //     data: [sensor1, sensor2, sensor3...]
        // }]
        // Each network should contain all sensors, and if specific sensor does not exists in a network, then 0 should replace it.

        return Object.keys(parsedTradeoffs).map(network => {
            return {
                "name": network,
                "data": uniqueSensorsArr.map(sensor => !parsedTradeoffs[network][sensor] ?
                    0 :
                    parsedTradeoffs[network][sensor])
            }
        })
    }

    const getChartData = rawTradeoffsData => {
        const parsedData = parseTradeoffs(rawTradeoffsData.tradeoffs)

        const uniqueSensorsArr = Array.from(new Set(Object.keys(parsedData).map(n => Object.keys(parsedData[n])).flat()))
        const uniqueNetworksColors = Object.keys(parsedData).map(n => hashedTextRGB(n))

        const series = createSeries(parsedData, uniqueSensorsArr)
        const options = createOptions(store.sensor, uniqueSensorsArr, uniqueNetworksColors, rawTradeoffsData.resolution)

        return [series, options]
    }

    // Initializations
    useEffect(() => {
        fetchDataFromAPI();
    }, [])

    // When selection changed using the path input
    useEffect(() => {
        fetchDataFromAPI();
    }, [store.sensor])

    const { currentNode, currentPath } = store

    return error ? <p>{error}</p> :
        ((!currentNode || !currentPath) ?
            <p>Please choose something first</p> :
            (
                <div id="chart">
                    <Chart options={state.options} series={state.series} type="bar" />
                </div>
            ))
}

export default TradeoffsChart;