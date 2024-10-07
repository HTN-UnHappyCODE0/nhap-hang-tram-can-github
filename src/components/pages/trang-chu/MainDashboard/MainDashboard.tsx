import React from 'react';

import {PropsMainDashboard} from './interfaces';
import styles from './MainDashboard.module.scss';
import ChartImportCompany from '../ChartImportCompany';

function MainDashboard({}: PropsMainDashboard) {
	return (
		<div className={styles.container}>
			<ChartImportCompany />
		</div>
	);
}

export default MainDashboard;
