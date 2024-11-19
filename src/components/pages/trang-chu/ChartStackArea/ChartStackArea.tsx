import React from 'react';

import {PropsChartStackArea} from './interfaces';
import styles from './ChartStackArea.module.scss';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

function ChartStackArea({}: PropsChartStackArea) {
	const data = [
		{
			name: 'Page A',
			uv: 4000,
			pv: 2400,
			amt: 2400,
		},
		{
			name: 'Page B',
			uv: 3000,
			pv: 1398,
			amt: 2210,
		},
		{
			name: 'Page C',
			uv: 2000,
			pv: 9800,
			amt: 2290,
		},
		{
			name: 'Page D',
			uv: 2780,
			pv: 3908,
			amt: 2000,
		},
		{
			name: 'Page E',
			uv: 1890,
			pv: 4800,
			amt: 2181,
		},
		{
			name: 'Page F',
			uv: 2390,
			pv: 3800,
			amt: 2500,
		},
		{
			name: 'Page G',
			uv: 3490,
			pv: 4300,
			amt: 2100,
		},
		{
			name: 'Page H',
			uv: 3490,
			pv: 4300,
			amt: 2100,
		},
	];
	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h3>Biểu đồ giá tiền nhập hàng (VND)</h3>
			</div>
			<div className={styles.head_data}>
				<p className={styles.data_total}>
					<div className={styles.wrapper}>
						<div className={styles.line} style={{background: '#2d74ff'}}></div>
						<div className={styles.circle} style={{borderColor: '#2d74ff'}}></div>
					</div>
					<div>
						Dăm gỗ đường bộ: <span>100</span>
					</div>
				</p>
			</div>
			<div className={styles.main_chart}>
				<ResponsiveContainer width='100%' height='100%'>
					<AreaChart
						width={500}
						height={300}
						data={data}
						margin={{
							top: 8,
							right: 8,
							left: 24,
							bottom: 8,
						}}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='name' scale='point' padding={{left: 40}} />
						<YAxis />
						<Tooltip />
						<defs>
							<linearGradient id='colorUv' x1='0' y1='0' x2='0' y2='1'>
								<stop offset='0%' stopColor='#3CC3DF' stopOpacity={1} />
								<stop offset='100%' stopColor='#3CC3DF' stopOpacity={0.05} />
							</linearGradient>
						</defs>
						<defs>
							<linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
								<stop offset='0%' stopColor='#82ca9d' stopOpacity={1} />
								<stop offset='100%' stopColor='#82ca9d' stopOpacity={0.05} />
							</linearGradient>
						</defs>
						<defs>
							<linearGradient id='colorAmt' x1='0' y1='0' x2='0' y2='1'>
								<stop offset='0%' stopColor='#ffc658' stopOpacity={1} />
								<stop offset='100%' stopColor='#ffc658' stopOpacity={0.05} />
							</linearGradient>
						</defs>

						<Area
							type='linear'
							dataKey='uv'
							stackId='1'
							stroke='#3CC3DF'
							fill='url(#colorUv)'
							dot={{
								r: 4,
								fill: '#fff',
								stroke: '#3CC3DF',
								strokeWidth: 2,
							}}
						/>
						<Area
							type='linear'
							dataKey='pv'
							stackId='1'
							stroke='#82ca9d'
							fill='url(#colorPv)'
							dot={{
								r: 4,
								fill: '#fff',
								stroke: '#82ca9d',
								strokeWidth: 2,
							}}
						/>
						<Area
							type='linear'
							dataKey='amt'
							stackId='1'
							stroke='#ffc658'
							fill='url(#colorAmt)'
							dot={{
								r: 4,
								fill: '#fff',
								stroke: '#ffc658',
								strokeWidth: 2,
							}}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

export default ChartStackArea;
