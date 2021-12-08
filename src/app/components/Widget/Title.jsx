import classNames from 'classnames';
import React from 'react';
import * as styles from './index.styl';

const Title = ({ className, ...props }) => <div {...props} className={classNames(className, styles.widgetTitle)} />;

export default Title;
