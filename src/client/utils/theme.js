import {
  cyan500,
  cyan700,
  pinkA200,
  grey100,
  grey300,
  grey400,
  grey500,
  white,
  lightWhite,
  darkBlack,
  fullBlack,
  blue500,
  greenA400,
  black,
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';

const primaryBlue = '#4D97DB';
const darkBlue = '#003359';
const darkGrey = '#393C44';

export default {
  button: {
    textTransform: 'none',
    borderRadius: 4,
  },
  flatButton: {
    fontSize: 12,
    fontWeight: 100,
  },
  raisedButton: {
    fontSize: 12,
    fontWeight: 100,
  },
  fontFamily: "'Roboto', sans-serif",
  palette: {
    darkBlack,
    darkBlue,
    darkGrey,
    white,
    lightWhite,
    /* commented colors are default. keeping them for reference */
    primary1Color: primaryBlue,
    primary2Color: '#074C75',
    primary3Color: '#80A9D8',
    accent1Color: greenA400,
    // accent2Color: grey100,
    // accent3Color: grey500,
    textColor: darkGrey,
    inactiveTabTextColor: '#7F7F7F',
    // alternateTextColor: white,
    // canvasColor: white,
    // borderColor: grey300,
    // disabledColor: fade(darkBlack, 0.3),
    // pickerHeaderColor: cyan500,
    // clockCircleColor: fade(darkBlack, 0.07),
    // shadowColor: fullBlack,
    charcoalBlack: '#2D333A',
    lightGrey: '#9A9EAD',
    borderGrey: '#A2A2A2',
    lightBlue: '#9EE1FF',
    darkBlue: '#00215E',
    lightBlack: '#031728',
    headerGrey: darkGrey,
    veryLightGrey: 'rgba(0, 0, 0, 0.3)',
  },
  customScoringEditor: {
    datapoints: {
      functionTypeSelector: {
        backgroundColor: primaryBlue,
        color: '#FFFFFF',
        minWidth: 200,
        width: '50%',
      },
    },
    pillars: {
      colors: {
        1: { backgroundColor: '#0069A9', color: '#FFFFFF' },
        2: { backgroundColor: primaryBlue, color: '#FFFFFF' },
        3: { backgroundColor: '#007789', color: '#FFFFFF' },
        4: { backgroundColor: '#2A9AAA', color: '#FFFFFF' },
        5: { backgroundColor: '#31708F', color: '#FFFFFF' },
        6: { backgroundColor: '#66CBDC', color: '#FFFFFF' },
        7: { backgroundColor: darkBlue, color: '#FFFFFF' },
        8: { backgroundColor: '#24478C', color: '#FFFFFF' },
        9: { backgroundColor: '#5A72BD', color: '#FFFFFF' },
        10: { backgroundColor: '#00215E', color: '#FFFFFF' },
        default: { backgroundColor: '#C0C0D0', color: '#072837' },
      },
      fonts: {
        1: { fontSize: '2em' },
        2: { fontSize: '1.75em' },
        3: { fontSize: '1.5em' },
        4: { fontSize: '1.25em' },
        default: { fontSize: '1em' },
      },
    },
  },
  /* TODO get the hex colors into palette, if possible */
  tableHeaderColumn: {
    textColor: grey500,
  },
  tableRow: {
    stripeColor: grey100,
  },
  tabs: {
    backgroundColor: '#0069A9',
    textColor: white,
    selectedTextColor: '#031728',
  },
  datePicker: {
    color: blue500,
    selectColor: blue500,
  },
  textField: {
    borderRadius: 4,
    floatingLabelColor: darkGrey,
    floatingLabelFontWeight: 600,
    floatingLabelFontSize: '17px',
  },
  inkBar: {
    backgroundColor: blue500,
  },
  numerics: {
    numberField: {
      backgroundColor: white,
      borderRadius: 4,
      color: black,
      fontSize: '0.75em',
      fontWeight: 500,
      height: '3em',
      marginRight: '0.5em',
      paddingRight: '0.5em',
      width: '5em',
      border: `1px solid ${grey400}`,
    },
    text: {
      textAlign: 'right',
    },
  },
};
