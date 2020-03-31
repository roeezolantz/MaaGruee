import React, { useEffect, useState, useRef } from 'react';
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import config from 'utils/conf'
import MaterialTable from 'material-table';
import Swal from 'sweetalert2'
import { forwardRef } from 'react';
import {
    Search, ViewColumn, SaveAlt, Remove, LastPage,
    FirstPage, FilterList, Edit, DeleteOutline, Clear, ChevronLeft, ChevronRight,
    Check, ArrowDownward, AddBox
} from '@material-ui/icons'
import ContentLoader from "react-content-loader"
import { showAjaxToast } from 'utils/Toast'

const Loader = () => (
  <ContentLoader 
    speed={0.8}
    viewBox="0 0 800 320"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="20" y="20" rx="0" ry="0" width="1000" height="200" /> 
  </ContentLoader>
)

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    title: {
        flexGrow: 1,
    },
    appBarSpacer: {
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        height: '100vh',
        overflow: 'auto',
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
}));

const JanitorBlacklist = props => {

    const classes = useStyles();

    const API_PATH = config.API_ADDRESS + '/janitorBlacklist'

    const [blackList, setBlackList] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [isValidData, setIsValidData] = useState(false)
    const [error, setError] = useState('')
    const [columns, setColumns] = useState([])
    let tableRef = useRef()

    const isTimed = text => text.includes('Time') || text.includes('time')

    /**
     * This function parses the dates fiels in the raw data from the api to fit them to the table's format
     * @param { Array } rawData - the raw data that fetched from the api
     */
    const parseDateFields = (rawData) => {
        return rawData.map(row => {
            let newKeys = {};
            Object.keys(row).filter(isTimed)
                .forEach(dateKey =>
                    newKeys[dateKey] = new Date(row[dateKey].year,
                        +row[dateKey].month - 1,
                        row[dateKey].day))
            return {
                ...row,
                ...newKeys,
            }
        })
    }

    // TODO : Check if there is any way to update the data without rerendering the entire card

    const fetchDataFromAPI = () => {
        setIsLoading(true)
        fetch(API_PATH)
            .then(res => res.json())
            .then(
                (res) => {
                    const list = res.blacklist
                    setBlackList(parseDateFields(list))
                    setIsLoading(false)

                    if (list && Array.from(list).length > 0) {
                        setIsValidData(true)
                        setError('')
                    } else {
                        setIsValidData(false)
                        setError('There was a problem with the data... Try again later please!')
                    }
                },
                (error) => {
                    console.log(error)
                    setError('Error while loading the data..')
                    setIsLoading(false);
                })
    }

    /**
        * This function converts js date object to our parsed schema
        * @param { Date } date - the date to parse
        */
    const buildDateObject = date => {
        return {
            "year": date.getFullYear(),
            "month": date.getMonth() + 1,
            "day": date.getDate()
        }
    }

    /**
        * This function removes data related to the table and the ui before sending it to the server
        * @param { Object } data 
        */
    const cleanTableDataBeforeSend = data => {
        const attrsToRemove = ['tableData']

        return Object.fromEntries(
            Object.entries(data)
                .filter(curr => !attrsToRemove.includes(curr[0]))
                .map(curr => isTimed(curr[0]) ? [curr[0], buildDateObject(new Date(curr[1]))] : curr))
    }

    const sendData = async (url = '', method, data = {}) => {
        showAjaxToast(
            'Sending data to the server...',
            'Data updated successfully!',
            'Error while updating the data..',
            500,
            url,
            method,
            data,
            () => fetchDataFromAPI()
        )
    }

    const handleUpdate = async (newData, oldData) => {
        try {
            const dataToSend = {
                "old": cleanTableDataBeforeSend(oldData),
                "new": cleanTableDataBeforeSend(newData)
            }
            sendData(API_PATH, 'PUT', dataToSend)
        } catch (err) {
            console.log("There was an error while updating the table", err)
        }
    }

    const handleAdd = async (newData) => {
        sendData(API_PATH, 'POST', cleanTableDataBeforeSend(newData))
    }

    const handleDelete = async (rowsArr) => {
        if (!Array.isArray(rowsArr)) {
            Toast.fire({
                icon: 'Error',
                title: 'There was a problem while deleting, please try again later!!'
            })
        } else {
            const toDelete = { "deletedRows": rowsArr.map(cleanTableDataBeforeSend) }
            sendData(API_PATH, 'DELETE', toDelete)
        }
    }

    // Initializations
    useEffect(() => {
        fetchDataFromAPI()
    }, [])

    useEffect(() => {
        const columns = []

        if (blackList.length === 0) {
            const defaults = ["network", "agent", "type", "start", "end"]
            columns.push(...defaults.map(c => { return { title: c, field: c } }))
        } else {
            columns.push(...Object.keys(blackList[0])
                .map(currKey => {
                    return {
                        title: currKey,
                        field: currKey,
                        type: isTimed(currKey) ? 'date' : 'string',
                    }
                }))
        }
        setColumns(columns)
    }, [blackList])

    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

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
                {isLoading && (<Loader/>)}
                {
                    !isLoading && !error && isValidData && (
                        <MaterialTable
                            title="Janitor Blacklist"
                            columns={columns}
                            data={blackList}
                            icons={tableIcons}
                            options={{
                                exportButton: true,
                                selection: true
                            }}
                            isLoading={isLoading}
                            tableRef={tableRef}
                            editable={{
                                onRowAdd: newData => handleAdd(newData),
                                onRowUpdate: (newData, oldData) => handleUpdate(newData, oldData),
                                onRowDelete: oldData => handleDelete([oldData]),
                            }}
                            actions={[
                                {
                                    tooltip: 'Remove All Selected Rows',
                                    icon: tableIcons.Delete,
                                    onClick: (evt, data) => {
                                        alert('You are about to delete ' + data.length + ' rows')
                                        handleDelete(data)
                                    }
                                }
                            ]}
                        />
                    )
                }
            </Container>
        </main>
    )
}

export default JanitorBlacklist