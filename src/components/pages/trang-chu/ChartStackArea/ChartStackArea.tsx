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
	TYPE_DATE,
	TYPE_DATE_SHOW,
	TYPE_PRODUCT,
} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import customerServices from '~/services/customerServices';
import userServices from '~/services/userServices';
import regencyServices from '~/services/regencyServices';
import priceTagServices from '~/services/priceTagServices';
import SelectFilterDate from '../SelectFilterDate';
import {timeSubmit} from '~/common/funcs/optionConvert';
import companyServices from '~/services/companyServices';
import moment from 'moment';
import {convertCoin} from '~/common/funcs/convertCoin';
import wareServices from '~/services/wareServices';

function ChartStackArea({}: PropsChartStackArea) {
	const [customerUuid, setCustomerUuid] = useState<string>('');
	const [productUuid, setProductUuid] = useState<string>('');
	const [userUuid, setUserUuid] = useState<string>('');
	const [uuidCompany, setUuidCompanyFilter] = useState<string>('');
	const [typeDate, setTypeDate] = useState<number | null>(TYPE_DATE.LAST_7_DAYS);
	const [date, setDate] = useState<{
		from: Date | null;
		to: Date | null;
	} | null>(null);
	const [dataChart, setDataChart] = useState<any[]>([]);
	const [productTypes, setProductTypes] = useState<any[]>([]);

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

	const listProductType = useQuery([QUERY_KEY.dropdown_loai_go], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listProductType({
					page: 1,
					pageSize: 50,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					type: [TYPE_PRODUCT.CONG_TY],
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listCompany = useQuery([QUERY_KEY.dropdown_cong_ty], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: companyServices.listCompany({
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

	const dataBoardDailyPrice = useQuery(
		[QUERY_KEY.thong_ke_bieu_do_gia_tien_theo_ngay, productUuid, customerUuid, date, userUuid, uuidCompany],
		{
			queryFn: () =>
				httpRequest({
					isData: true,
					http: priceTagServices.dashBoardDailyPrice({
						timeStart: timeSubmit(date?.from)!,
						timeEnd: timeSubmit(date?.to, true)!,
						userOwnerUuid: userUuid,
						partnerUuid: '',
						customerUuid: customerUuid,
						companyUuid: uuidCompany,
						transport_type: null,
						productTypeUuid: productUuid,
					}),
				}),
			onSuccess({data}) {
				// Convert data chart
				const dataConvert = data?.chart?.map((v: any) => {
					const date =
						data?.typeShow == TYPE_DATE_SHOW.HOUR
							? moment(v?.time).format('HH:mm')
							: data?.typeShow == TYPE_DATE_SHOW.DAY
							? moment(v?.time).format('DD/MM')
							: data?.typeShow == TYPE_DATE_SHOW.MONTH
							? moment(v?.time).format('MM-YYYY')
							: moment(v?.time).format('YYYY');

					const obj = {
						[v?.newDaily?.maxAverage?.productTypeDTO?.name]: v?.newDaily?.maxAverage?.sumAmount || 0,
						'Trung bình': v?.newDaily?.averageAmount || 0,
						[v?.newDaily?.minAverage?.productTypeDTO?.name]: v?.newDaily?.minAverage?.sumAmount || 0,
						[v?.newDaily?.customerLine?.productTypeDTO?.name]: v?.customerLine?.minAverage?.sumAmount || 0,
					};

					return {
						name: date,
						...obj,
					};
				});

				// Convert bar chart
				// const productColors = data?.chart
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

				const productColors = data?.chart
					?.flatMap((v: any) => {
						const maxAverage = v?.newDaily?.maxAverage;
						const minAverage = v?.newDaily?.minAverage;
						const customerLine = v?.newDaily?.customerLine;

						return [
							{
								key: maxAverage?.productTypeDTO?.name,
								fill: maxAverage?.productTypeDTO?.colorShow,
							},
							{
								key: 'Trung bình',
								fill: '#3CC3DF',
							},
							{
								key: minAverage?.productTypeDTO?.name,
								fill: minAverage?.productTypeDTO?.colorShow,
							},
							{
								key: customerLine?.productTypeDTO?.name,
								fill: customerLine?.productTypeDTO?.colorShow,
							},
						];
					})
					.reduce((acc: any, {key, fill}: {key: string; fill: string}) => {
						if (key && !acc[key]) {
							acc[key] = fill;
						}
						return acc;
					}, {});

				const productTypes = Object.entries(productColors).map(([key, fill]) => ({
					key,
					fill,
				}));

				setProductTypes(productTypes);
				setDataChart(dataConvert);
				// setDataTotal({
				// 	totalWeight: data?.totalWeight,
				// 	lstProductTotal: data?.lstProductTotal?.map((v: any) => ({
				// 		name: v?.productTypeUu?.name,
				// 		colorShow: v?.productTypeUu?.colorShow,
				// 		weightMT: v?.weightMT,
				// 	})),
				// });
			},
		}
	);

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h3>Biểu đồ giá tiền nhập hàng (VNĐ)</h3>
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
					<SelectFilterOption
						uuid={productUuid}
						setUuid={setProductUuid}
						listData={listProductType?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Tất cả loại hàng'
					/>
					<SelectFilterDate isOptionDateAll={false} date={date} setDate={setDate} typeDate={typeDate} setTypeDate={setTypeDate} />
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
					<SelectFilterOption
						uuid={uuidCompany}
						setUuid={setUuidCompanyFilter}
						listData={listCompany?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Tất cả kv cảng xuất khẩu'
					/>
				</div>
			</div>
			<div className={styles.head_data}>
				{dataBoardDailyPrice?.data?.data?.overview?.map((v: any, i: number) => (
					<p key={i} className={styles.data_total}>
						<div className={styles.wrapper}>
							<div className={styles.line} style={{background: v?.productTypeDTO?.colorShow}}></div>
							<div className={styles.circle} style={{borderColor: v?.productTypeDTO?.colorShow}}></div>
						</div>
						<div>
							{v?.productTypeDTO?.name}: <span>{convertCoin(v?.averageAmount)} (VNĐ)</span>
						</div>
					</p>
				))}
			</div>
			<div className={styles.main_chart}>
				<ResponsiveContainer width='100%' height='100%'>
					<AreaChart
						width={500}
						height={300}
						data={dataChart}
						margin={{
							top: 8,
							right: 8,
							left: 24,
							bottom: 8,
						}}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='name' scale='point' padding={{left: 40}} />
						<YAxis domain={[0, 'dataMax']} tickFormatter={(value): any => convertCoin(value)} />
						<Tooltip formatter={(value): any => convertCoin(Number(value))} />

						{productTypes.map((v) => (
							<>
								<Area
									key={v?.key}
									type='linear'
									dataKey={v?.key}
									stroke={v?.fill}
									fill='none'
									dot={{r: 4, fill: '#fff', stroke: v?.fill, strokeWidth: 2}}
								/>
							</>
						))}
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

export default ChartStackArea;
