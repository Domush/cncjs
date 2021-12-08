import classNames from 'classnames';
import React from 'react';
import * as styles from './index.styl';

const Panel = ({ className, ...props }) => (
  <div {...props} className={classNames(className, styles.panel, styles.panelDefault)} />
);

export default Panel;
