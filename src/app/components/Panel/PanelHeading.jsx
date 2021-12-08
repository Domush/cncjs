import classNames from 'classnames';
import React from 'react';
import * as styles from './index.styl';

const PanelHeading = ({ className, ...props }) => (
  <div {...props} className={classNames(className, styles.panelHeading)} />
);

export default PanelHeading;
