export const FlexBox = ({ children, style, ...otherProps }) => (
  <div {...otherProps} style={merge(style, { display: 'flex' })}>
    {children}
  </div>
);

export const FlexBoxCenter = ({ children, style, ...otherProps }) => (
  <FlexBox {...otherProps} style={merge(style, { alignItems: 'center' })}>
    {children}
  </FlexBox>
);

export const FlexBoxJustify = ({ children, style, ...otherProps }) => (
  <FlexBox {...otherProps} style={merge(style, { justifyContent: 'space-between' })}>
    {children}
  </FlexBox>
);

export const FlexBoxRight = ({ children, style, ...otherProps }) => (
  <FlexBox {...otherProps} style={merge(style, { justifyContent: 'flex-end' })}>
    {children}
  </FlexBox>
);

export const FlexBoxJustifyCenter = ({ children, style, ...otherProps }) => (
  <FlexBox {...otherProps} style={merge(style, { justifyContent: 'center' })}>
    {children}
  </FlexBox>
);

export default FlexBox;
