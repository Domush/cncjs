import classNames from 'classnames';
import React from 'react';
import * as styles from './index.styl';

const Content = ({ className, ...props }) => <div {...props} className={classNames(className, styles.widgetContent)} />;

export default Content;
