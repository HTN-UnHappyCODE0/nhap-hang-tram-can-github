import React from 'react';

import {PropsMainDashboard} from './interfaces';
import styles from './MainDashboard.module.scss';
import ChartImportCompany from '../ChartImportCompany';
import ChartStackArea from '../ChartStackArea';

function MainDashboard({}: PropsMainDashboard) {
	return (
		<div className={styles.container}>
			<ChartImportCompany />
			<ChartStackArea />
		</div>
	);
}

export default MainDashboard;
