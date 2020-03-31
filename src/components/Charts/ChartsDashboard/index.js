import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
    Container, Grid, Paper, Typography
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { SunburstChart, RetentionView, TradeoffsChart, NodePathInput, UtilizationsViewer, ConfigEditor } from '..'
import { useChartBehaviour } from 'Contexts/ChartBehaviourContext'
import config from 'utils/conf'
import { validateData } from 'utils/data-validator'
import ContentLoader from "react-content-loader"

const Loader = () => (
    <ContentLoader
        speed={0.8}
        // width={400}
        // height={160}
        viewBox="0 0 800 320"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
    >
        <rect x="-8" y="4" rx="0" ry="0" width="184" height="21" />
        <circle cx="97" cy="135" r="94" />
        <rect x="234" y="45" rx="0" ry="0" width="200" height="184" />
    </ContentLoader>
)

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    drawerToolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        // flexGrow: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    container: {
        marginTop: '35px',
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    fixedHeight: {
        height: 240,
    },
    placeholderText: {
        margin: 'auto',
        textAlign: 'center',
    },
    placeHolderTextContainer: {
        alignItems: 'center',
        height: '100%',
    },
    navigationHelperText: {
        textAlign: 'left',
        marginLeft: '25px',
        color: "gray"
    }
}));

const ChartsDashboard = props => {

    const theme = useTheme();
    const classes = useStyles(theme);

    const [store, dispatch] = useChartBehaviour()
    const [data, setData] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [isValidData, setIsValidData] = useState(false)
    const [error, setError] = useState('')

    // TODO : Finish and remove all the comments

    const updateData = (newData) => {
        console.log("updateData with :", newData)
        setIsLoading(false)

        if (validateData(newData)) {
            console.log("Changing the data to :", newData)
            setData(newData)
            setIsValidData(true)
            setError('')

            dispatch({
                type: 'NEW_DATA_RELOADED',
            })
        } else {
            setIsValidData(false)
            setError('There was a problem with the data... Try again later please!')
        }
    }

    const fetchData = () => {
        setIsLoading(true)
        fetch(config.API_ADDRESS + '/data')
            .then(res => res.json())
            .then(
                (res) => updateData(res),
                (error) => {
                    console.log("F@CK ! ERROR! ", error)
                    setError('Error while loading the data..')
                    setIsLoading(false);
                })
    }

    // load initial data
    useEffect(() => {
        fetchData();
    }, [])

    // This effect will update the ui when new data comes only if it's not the same as the current data
    useEffect(() => {
        dispatch({
            type: 'CANCEL_SELECTION'
        })
        fetchData();
    }, [store.shouldReloadData])

    useEffect(() => {
        console.log("Data has changed to :", data)
    }, [data])

    const tradeoffClasses = clsx(classes.paper, !store.currentNode && classes.placeHolderTextContainer);

    return (
        <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="xlg" className={classes.container}>
                {
                    error && (
                        <h4 className={classes.placeholderText}>
                            {error}
                        </h4>
                    )
                }
                {
                    isLoading && (<Loader />)}
                {
                    !isLoading && !error && isValidData && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12} lg={12}>
                                <div style={{ display: "flex", alignItems: 'center' }}>
                                    <NodePathInput data={data} />
                                    <Typography variant="h6" align="center" className={classes.navigationHelperText}>
                                        {store.clicked ? 'Esc / Click to unlock selection' : 'Click on the chart for deeper analysis'}
                                    </Typography>
                                </div>
                            </Grid>
                            {data && <Grid item xs={12} md={6} lg={3}>
                                <Paper className={classes.paper}>
                                    <SunburstChart data={data} byStorage={true} />
                                </Paper>
                            </Grid>
                            }
                            {data && (<Grid item xs={12} md={6} lg={4}>
                                <Paper className={classes.paper}>
                                    <RetentionView data={data} />
                                </Paper>
                            </Grid>)
                            }
                            {store.clicked && store.sensor && (
                                <Grid item xs={12} md={5} lg={3}>
                                    <Paper className={classes.paper}>
                                        <UtilizationsViewer data={data} />
                                    </Paper>
                                </Grid>
                            )}
                            {store.clicked && store.sensor && (
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6} lg={6}>
                                        <Paper className={tradeoffClasses}>
                                            <TradeoffsChart />
                                        </Paper>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={6}>
                                        <Paper className={tradeoffClasses}>
                                            <ConfigEditor data={data} />
                                        </Paper>
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                    )
                }
            </Container>
        </main >
    )
}

export default ChartsDashboard