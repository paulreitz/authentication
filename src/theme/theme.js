import { createMuiTheme } from '@material-ui/core/styles';
import colors from './colors';

export default createMuiTheme({
    palette: {
        primary: {
            main: `${colors.DARK_BACKGROUND}`
        },
        secondary: {
            main: `${colors.TITLE_FONT}`
        },
        background: {
            default: `${colors.LIGHT_BACKGROUND}`
        },
        common: {
            lighterBlue: `${colors.LIGHTER_BACKGROUND}`
        }
    }
})