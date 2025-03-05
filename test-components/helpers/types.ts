export enum PositionProperty {
  Absolute = 'absolute',
  Fixed = 'fixed',
  Relative = 'relative',
  Static = 'static',
  Sticky = 'sticky',
}

export enum OverflowProperty {
  Auto = 'auto',
  Hidden = 'hidden',
  Scroll = 'scroll',
  Visible = 'visible',
}

export enum ElementPositionOffset {
  Bottom = 'bottom',
  BottomEnd = 'bottom-end',
  BottomStart = 'bottom-start',
  Left = 'left',
  LeftEnd = 'left-end',
  LeftStart = 'left-start',
  None = '',
  Right = 'right',
  RightEnd = 'right-end',
  RightStart = 'right-start',
  Top = 'top',
  TopEnd = 'top-end',
  TopStart = 'top-start',
}

export const getEnumValues = <TEnum extends Record<string, string>>(e: TEnum): string[] => {
  return Object.keys(e)
    .filter((key) => typeof e[key] !== 'number')
    .map((key) => e[key]);
};
