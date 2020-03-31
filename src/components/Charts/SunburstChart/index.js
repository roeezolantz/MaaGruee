import React, { useEffect, useRef } from 'react';
import { Sunburst, LabelSeries } from 'react-vis';
import { useChartBehaviour } from 'Contexts/ChartBehaviourContext'
import useSetState from 'utils/useSetState'
import { decorateData, getKeyPath, sumAttributeValues, validatePath, findNodeByPath } from 'utils/trees'
import { compareArrays } from 'utils/arrays'
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ChooseSwitch from '../Switch'
import config from 'utils/conf'

const labelStyle = {
	fontSize: '12px',
	textAnchor: 'middle'
}

const useStyles = makeStyles(theme => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	switchContainer: {
		display: 'flex',
		padding: '20px',
	},
	switchLeftText: {
		marginRight: '15px',
	},
	switchRightText: {
		marginLeft: '15px',
	},
	switchToggle: {
		margin: 'auto',
	},
	footer: {
		textAlign: 'center',
	},
	title: {
		fontWeight: 'bold',
		fontSize: '16',
	},
}))

const sizesChart = ratioToKB => new Map([
	["KB", ratioToKB],
	["MB", ratioToKB * 1000],
	["GB", ratioToKB * 1000000],
	["PB", ratioToKB * 1000000000]
])

const buildFormattedSize = size => {
	let formattedSize;
	for (const [name, ratio] of sizesChart(config.SIZE_RATIO_TO_KB).entries()) {
		if (size > ratio) {
			formattedSize = Number((size / ratio).toFixed(3)) + name
		}
		else break;
	}
	return formattedSize;
}

const SunburstChart = props => {

	const initialState = {
		byStorage: props.byStorage !== false,   // true is default, false represents byCount
		count: -1,
		storage: -1,
	};
	const [state, setState] = useSetState(initialState);
	const [store, dispatch] = useChartBehaviour()
	const classes = useStyles();

	/**
	 * This ref is used to access the data from the keys events such Esc press
	 */
	const dataRef = useRef();

	/**
	 * This function helps with decorateData function because it does mutable recursions on the data
	 * @param { Object } tree - The data tree to manipulate
	 * @param { Array } path - Path to mark on the tree
	 * @param { Boolean } forcedManipulation 
	 */
	const reloadData = (tree, path) => {
		if (!tree) return {}

		const tempTree = Object.assign({}, tree);
		const ans = decorateData(tempTree, path, config.GENERATE_COLORS);
		dataRef.current = ans;
		return ans;
	}

	const markEntireTree = (tree) => reloadData(tree, false)
	const markPathInTree = (tree, path) => reloadData(tree, path)

	const escFunction = (event) => {
		if (event.keyCode === 27) {
			dispatch({
				type: 'CANCEL_SELECTION',
			})
			setState({
				data: markEntireTree(dataRef.current),
			})
		}
	}

	const handleNodeSelection = (node, pathArr) => {
		let storage, count

		if (node.storage && node.count) {
			({ storage, count } = node)
		} else {
			storage = sumAttributeValues(node, "storage")
			count = sumAttributeValues(node, "files")
		}

		setState({
			data: markPathInTree(state.data, pathArr),
			hoveredLabels: pathArr.length === 3 ? [pathArr[1], pathArr[2]] : [pathArr[1]],
			storage,
			count,
			node,
		})
	}

	const handleNodeHover = (node) => {
		if (clicked) return

		const path = getKeyPath(node).reverse();

		handleNodeSelection(node, path);

		dispatch({
			type: 'NODE_HOVERED',
			payload: {
				node,
				path,
			}
		})
	}

	const handleMouseOut = () => {
		if (!clicked) {
			setState({
				data: markEntireTree(state.data),
			})
			dispatch({
				type: 'MOUSE_OUT'
			})
		}
	}

	const handleNodeClick = (node) => {
		const pathArr = getKeyPath(node).reverse()
		if (store.clicked) {
			dispatch({
				type: 'CANCEL_SELECTION'
			})
		} else {
			dispatch({
				type: 'NODE_SELECTED',
				payload: {
					node,
					path: pathArr,
				}
			})
		}
	}

	// Initialization
	useEffect(() => {
		document.addEventListener("keydown", escFunction);

		setState({
			data: markEntireTree(props.data)
		})

		return () => document.removeEventListener("keydown", escFunction, false); // Cleanup
	}, [])

	useEffect(() => {
		dispatch({
			type: 'CANCEL_SELECTION',
		})

		setState({
			data: markEntireTree(props.data)
		})
	}, [props.data])

	useEffect(() => {
		const { hasActiveNode, network, sensor } = store
		const {
			data: { totalAvailableStorage = false, totalUsedStorage = false } = {},
			count,
			storage } = state

		const labelData = []

		if (hasActiveNode) {
			let hoveredLabels = [...(sensor ? [network, sensor] : [network])]

			// Adds the description of the hovered node to the labels list (comes from handleNodeSelection)
			labelData.push(...hoveredLabels.map((curr, idx) => ({ x: 0, y: 0, label: curr, style: labelStyle, yOffset: (idx - 1) * 20 })));

			// Adds element's size to the labels list
			byStorage && labelData.push({ x: 0, y: 0, label: buildFormattedSize(storage), style: labelStyle, yOffset: (hoveredLabels.length - 1) * 20 })

			// Adds element's files count to the labels list
			!byStorage && labelData.push({ x: 0, y: 0, label: count + " files", style: labelStyle, yOffset: 5 * (hoveredLabels.length + 1), yOffset: hoveredLabels.length * 20 })
		} else if (totalAvailableStorage && totalUsedStorage) {
			const placeholder = buildFormattedSize(totalUsedStorage) + " / " +
				buildFormattedSize(totalAvailableStorage);

			labelData.push({ x: 0, y: 0, label: placeholder, style: labelStyle })
		}

		setState({
			labelData
		})

	}, [state.data, store.hasActiveNode, state.hoveredLabelsPlaceholder, state.storage, state.count])

	useEffect(() => {
		if ((Array.isArray(store.forcedPathArr) && store.forcedPathArr.length > 1) &&
			!compareArrays(state.path, store.forcedPathArr, true, config.ENFORCE_PATH_CASING) &&
			validatePath(state.data, store.forcedPathArr, config.ENFORCE_PATH_CASING)) {

			const node = findNodeByPath(state.data, store.forcedPathArr)

			handleNodeSelection(node, store.forcedPathArr)

			dispatch({
				type: 'NODE_SELECTED',
				payload: {
					node,
					path: store.forcedPathArr,
				}
			})
		}
	}, [store.forcedPathArr])

	const { clicked } = store;
	const { data, byStorage } = state;

	return !data ? null : (
		<div className={classes.container}>
			<Typography className={classes.title}>Cluster Storage Utilization</Typography>
			<div className={classes.switchContainer}>
				<Typography className={classes.switchLeftText}>By Files</Typography>
				<ChooseSwitch
					className={classes.switchToggle}
					checked={byStorage}
					onChange={() => {
						dispatch({
							type: 'FILES_OR_STORAGE_VIEW',
							payload: !state.byStorage
						})
						setState({ byStorage: !byStorage })
					}}
				/>
				<Typography className={classes.switchRightText}>By Storage</Typography>
			</div>
			<Sunburst
				animation
				hideRootNode
				onValueMouseOver={handleNodeHover}
				onValueMouseOut={handleMouseOut}
				onValueClick={handleNodeClick}
				style={{
					stroke: '#ffffff',
					strokeOpacity: "1",
					strokeWidth: "1",
				}}
				colorType="literal"
				getSize={d => byStorage ? d.storage : d.files}
				getColor={d => d.style.fill}
				// getLabel={d=> d.name}
				data={data}
				height={300}
				width={350}
			>
				<LabelSeries data={state.labelData} />
			</Sunburst>
			<p className={classes.footer}>
				{clicked ? 'Esc / Click to unlock selection' : 'Click to lock selection'}
			</p>
		</div >
	);
}

export default SunburstChart;