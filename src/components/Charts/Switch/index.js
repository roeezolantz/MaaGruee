import { Switch } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';

const ChooseSwitch = withStyles(theme => ({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: 'flex',
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      backgroundColor: theme.palette.common.green,
      '&$checked': {
        transform: 'translateX(12px)',
        color: theme.palette.common.white,
        backgroundColor: theme.palette.common.green,
        '& + $track': {
          opacity: 1,
          backgroundColor: theme.palette.common.green,
        },
      },
    },
    // switchBase: {
    //   padding: 2,
    //   color: theme.DISCRETE_COLOR_RANGE[0],
    //   '&$checked': {
    //     transform: 'translateX(12px)',
    //     color: theme.DISCRETE_COLOR_RANGE[1],
    //   },
    //   '&$checked + $track': {
    //     backgroundColor: theme.DISCRETE_COLOR_RANGE[2],
    //   },
    // },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: 'none',
    },
    track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white,
    },
    checked: {},
  }))(Switch);

  export default ChooseSwitch;