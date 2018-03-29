/**
 * This file imports all the variables defined inside the native-base material
 * theme than overwrites or add more variables. The combined variables are
 * exported to be used in our components theme files (check `./components` directory).
 *
 * @flow
 */

import materialVariables from 'native-base/src/theme/variables/material'

import { type ThemeSimpleValue } from './types'

const customVariables = Object.assign(materialVariables, {
  // Android
  btnUppercaseAndroidText: false,

  // Button
  btnFontFamily: 'Titillium Web',
  btnTextFontWeight: '600',
  btnHeight: 48,
  btnSmallHeight: 39,
  get btnLightTextColor(): ThemeSimpleValue {
    return this.textColor
  },
  btnLightBorderColor: '#E6E9F2',

  // Color
  brandPrimary: '#0066CC',
  brandPrimaryInverted: '#FFFFFF',
  brandGray: '#F5F6F7',
  brandLight: '#FCFDFF',

  // Font
  fontFamily: 'Titillium Web',
  fontSizeBase: 16,

  // Icon
  iconFamily: 'Entypo',

  // Content
  contentPadding: 24,
  contentBackground: '#FFFFFF',
  get contentInvertedBackground(): ThemeSimpleValue {
    return this.brandGray
  },

  // Footer
  footerBackground: '#FFFFFF',
  footerShadowWidth: 1,
  footerShadowColor: '#D8D8D8',
  footerPaddingTop: 24,
  footerPaddingLeft: 24,
  footerPaddingBottom: 16,
  footerPaddingRight: 24,

  // H1
  h1FontWeight: '600',

  // Header
  toolbarDefaultBg: '#FFFFFF',
  get toolbarTextColor(): ThemeSimpleValue {
    return this.textColor
  },
  get toolbarBtnColor(): ThemeSimpleValue {
    return this.textColor
  },

  // Text
  textColor: '#5C6F82',

  // Spacer
  spacerHeight: 16,
  spacerLargeHeight: 24,

  borderRadiusBase: 4
})

export default customVariables
