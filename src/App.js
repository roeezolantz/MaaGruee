import React from 'react';
import clsx from 'clsx';
import {
	CssBaseline, AppBar, Toolbar, Typography,
	IconButton, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core'
import { ChartsDashboard, JanitorBlacklist } from './components'
import NotificationsIcon from '@material-ui/icons/Notifications';
import DonutSmallIcon from '@material-ui/icons/DonutSmall';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
	},
	toolbar: {
		// paddingRight: 24, // keep right padding when drawer closed
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
	toolbarTitle: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
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
		marginLeft: '4px'
	},
	menuButtonHidden: {
		display: 'none',
	},
	paper: {
		padding: theme.spacing(2),
		display: 'flex',
		overflow: 'auto',
		flexDirection: 'column',
	},
	notifications: {
		position: 'absolute',
		right: '0',
		marginRight: '15px',
	},
	hide: {
		display: 'none',
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
	},
	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: 'hidden',
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9) + 1,
		},
	},
}));

const App = props => {

	const classes = useStyles();

	const [open, setOpen] = React.useState(false);

	return (
		<div className={classes.root}>
			<Router>
				<CssBaseline />
				<AppBar position="fixed"
					className={clsx(classes.appBar, { [classes.appBarShift]: open })}>
					<Toolbar className={classes.toolbar}>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={() => setOpen(true)}
							edge="start"
							className={clsx(classes.menuButton, {
								[classes.hide]: open,
							})}
						>
							<MenuIcon />
						</IconButton>
						<div className={classes.toolbarTitle}>
							<Typography variant="h6">
								Welcome to MaaGruee!
          					</Typography>
							<NotificationsIcon style={{marginRight: '15px'}}/>
						</div>
					</Toolbar>
				</AppBar>
				<Drawer
					variant="permanent"
					className={clsx(classes.drawer, {
						[classes.drawerOpen]: open,
						[classes.drawerClose]: !open,
					})}
					classes={{
						paper: clsx({
							[classes.drawerOpen]: open,
							[classes.drawerClose]: !open,
						}),
					}}
				>
					<div className={classes.drawerToolbar}>
						<IconButton onClick={() => setOpen(false)}>
							<ChevronLeftIcon />
						</IconButton>
					</div>
					<Divider />
					<List>
						<Link to="/charts" style={{ textDecoration: 'none' }}>
							<ListItem button>
								<ListItemIcon>
									<DonutSmallIcon color="primary" fontSize="large"/>
								</ListItemIcon>
								<ListItemText primary={"Charts"} color={"black"} />
							</ListItem>
						</Link>
						<Link to="/janitorBlacklist" style={{ textDecoration: 'none' }}>
							<ListItem button>
								<ListItemIcon>
									<DeleteForeverIcon color="primary" fontSize="large" />
								</ListItemIcon>
								<ListItemText primary={"Janitor Blacklist"} />
							</ListItem>
						</Link>
					</List>
				</Drawer>
				<Switch>
					<Redirect exact from="/" to="charts" />
					<Route default path="/charts">
						<ChartsDashboard />
					</Route>
					<Route path="/janitorBlacklist">
						<JanitorBlacklist />
					</Route>
				</Switch>
			</Router>
		</div >
	);
}

export default App;