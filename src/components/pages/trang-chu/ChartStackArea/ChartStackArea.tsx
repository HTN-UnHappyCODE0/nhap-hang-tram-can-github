import React, {useState} from 'react';

import {PropsChartStackArea} from './interfaces';
import styles from './ChartStackArea.module.scss';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import CheckRegencyCode from '~/components/protected/CheckRegencyCode';
import SelectFilterOption from '../SelectFilterOption';
import {useQuery} from '@tanstack/react-query';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	REGENCY_CODE,
	REGENCY_NAME,
	STATUS_CUSTOMER,
	TYPE_CUSTOMER,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import userServices from '~/services/userServices';
import regencyServices from '~/services/regencyServices';
import priceTagServices from '~/services/priceTagServices';

function ChartStackArea({}: PropsChartStackArea) {
	const [customerUuid, setCustomerUuid] = useState<string>('');
	const [userUuid, setUserUuid] = useState<string>('');

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

	const listCustomer = useQuery([QUERY_KEY.dropdown_khach_hang_nhap], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: customerServices.listCustomer({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					partnerUUid: '',
					userUuid: '',
					status: STATUS_CUSTOMER.HOP_TAC,
					typeCus: TYPE_CUSTOMER.NHA_CUNG_CAP,
					provinceId: '',
					specUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listRegency = useQuery([QUERY_KEY.dropdown_chuc_vu], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: regencyServices.listRegency({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			return data;
		},
	});
	const listUser = useQuery([QUERY_KEY.dropdown_nguoi_quan_ly], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: userServices.listUser({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					provinceIDOwer: '',
					regencyUuid: listRegency?.data?.find((v: any) => v?.code == REGENCY_NAME['Quản lý nhập hàng'])
						? listRegency?.data?.find((v: any) => v?.code == REGENCY_NAME['Quản lý nhập hàng'])?.uuid
						: null,
					regencyUuidExclude: '',
				}),
			}),
		select(data) {
			return data;
		},
		enabled: listRegency.isSuccess,
	});

	useQuery([QUERY_KEY.thong_ke_bieu_do_duong_loai_hang], {
		queryFn: () =>
			httpRequest({
				isData: true,
				http: priceTagServices.dashBoardDailyPrice({
					timeStart: '',
					timeEnd: '',
					userOwnerUuid: [],
					partnerUuid: [],
					customerUuid: [],
					companyUuid: [],
					transport_type: null,
					productTypeUuid: '',
				}),
			}),
		onSuccess(data) {
			if (data) {
				console.log(data);
			}

			// Convert data chart
			// const dataConvert = data?.lstProductDay?.map((v: any) => {
			// 	const date =
			// 		data?.typeShow == TYPE_DATE_SHOW.HOUR
			// 			? moment(v?.timeScale).format('HH:mm')
			// 			: data?.typeShow == TYPE_DATE_SHOW.DAY
			// 			? moment(v?.timeScale).format('DD/MM')
			// 			: data?.typeShow == TYPE_DATE_SHOW.MONTH
			// 			? moment(v?.timeScale).format('MM-YYYY')
			// 			: moment(v?.timeScale).format('YYYY');

			// 	const obj = v?.productDateWeightUu?.reduce((acc: any, item: any) => {
			// 		acc[item.productTypeUu.name] = item.weightMT;

			// 		return acc;
			// 	}, {});

			// 	return {
			// 		name: date,
			// 		...obj,
			// 	};
			// });

			// // Convert bar chart
			// const productColors = data?.lstProductDay
			// 	?.flatMap((item: any) =>
			// 		item.productDateWeightUu.map((product: any) => ({
			// 			name: product.productTypeUu.name,
			// 			color: product.productTypeUu.colorShow,
			// 		}))
			// 	)
			// 	.reduce((acc: any, {name, color}: {name: string; color: string}) => {
			// 		if (!acc[name]) {
			// 			acc[name] = color;
			// 		}
			// 		return acc;
			// 	}, {});

			// const productTypes = Object.keys(productColors).map((key) => ({
			// 	key,
			// 	fill: productColors[key],
			// }));

			// setDataChart(dataConvert);
			// setProductTypes(productTypes);
			// setDataTotal({
			// 	totalWeight: data?.totalWeight,
			// 	lstProductTotal: data?.lstProductTotal?.map((v: any) => ({
			// 		name: v?.productTypeUu?.name,
			// 		colorShow: v?.productTypeUu?.colorShow,
			// 		weightMT: v?.weightMT,
			// 	})),
			// });
		},
	});

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h3>Biểu đồ giá tiền nhập hàng (VND)</h3>
				<div className={styles.filter}>
					<SelectFilterOption
						uuid={customerUuid}
						setUuid={setCustomerUuid}
						listData={listCustomer?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Tất cả nhà cung cấp'
					/>
					<CheckRegencyCode
						isPage={false}
						regencys={[REGENCY_CODE.GIAM_DOC, REGENCY_CODE.PHO_GIAM_DOC, REGENCY_CODE.QUAN_LY_NHAP_HANG]}
					>
						<SelectFilterOption
							uuid={userUuid}
							setUuid={setUserUuid}
							listData={listUser?.data?.map((v: any) => ({
								uuid: v?.uuid,
								name: v?.fullName,
							}))}
							placeholder='Tất cả người quản lý mua hàng'
						/>
					</CheckRegencyCode>
				</div>
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
						<YAxis domain={[0, 'dataMax']} />
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
