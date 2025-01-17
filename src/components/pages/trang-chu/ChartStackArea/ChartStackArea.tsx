import React, {useEffect, useMemo, useState} from 'react';

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
import Loading from '~/components/common/Loading';
import commonServices from '~/services/commonServices';

function ChartStackArea({}: PropsChartStackArea) {
	const [customerUuid, setCustomerUuid] = useState<string>('');
	const [productUuid, setProductUuid] = useState<string>('');
	const [userUuid, setUserUuid] = useState<string>('');
	const [uuidCompany, setUuidCompanyFilter] = useState<string>('');
	const [typeDate, setTypeDate] = useState<number | null>(TYPE_DATE.LAST_7_DAYS);
	const [provinceUuid, setProvinceUuid] = useState<string>('');
	const [date, setDate] = useState<{
		from: Date | null;
		to: Date | null;
	} | null>(null);
	const [dataChart, setDataChart] = useState<any[]>([]);
	const [productTypes, setProductTypes] = useState<any[]>([]);

	const listCustomer = useQuery([QUERY_KEY.dropdown_khach_hang_nhap, uuidCompany], {
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
					companyUuid: uuidCompany,
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

	const listProvince = useQuery([QUERY_KEY.dropdown_tinh_thanh_pho], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: commonServices.listProvince({
					keyword: '',
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
		[QUERY_KEY.thong_ke_bieu_do_gia_tien_theo_ngay, productUuid, customerUuid, date, userUuid, uuidCompany, provinceUuid],
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
						provinceId: provinceUuid,
					}),
				}),
			onSuccess({data}) {
				console.log('data', data);
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
						'Lớn nhất': v?.newDaily?.max || 0,
						'Trung bình': v?.newDaily?.average || 0,
						'Nhó nhất': v?.newDaily?.min || 0,
						'Khách hàng': v?.newDaily?.customerLine || 0,
						// [v?.newDaily?.customerLine?.productTypeDTO?.name]: v?.customerLine?.minAverage?.sumAmount || 0,
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
								key: 'Lớn nhất',
								fill: '#2A85FF',
							},
							{
								key: 'Trung bình',
								fill: '#FF6838',
							},
							{
								key: 'Nhó nhất',
								fill: '#2DA2BC',
							},
							{
								key: 'Khách hàng',
								fill: '#2CAE39',
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

	const filteredProductTypes = useMemo(() => {
		if (customerUuid === '') {
			return productTypes.filter((v) => v.key !== 'Khách hàng');
		}
		return productTypes;
	}, [customerUuid, productTypes]);

	const filteredDataChart = useMemo(() => {
		if (customerUuid === '') {
			return dataChart.map((item) => {
				const {'Khách hàng': _, ...rest} = item;
				return rest;
			});
		}
		return dataChart;
	}, [customerUuid, dataChart]);

	useEffect(() => {
		if (uuidCompany) {
			setCustomerUuid('');
		}
	}, [uuidCompany]);

	useEffect(() => {
		if (listProductType?.data?.length > 0) {
			setProductUuid(listProductType.data[listProductType.data.length - 1].uuid);
		}
	}, [listProductType.data]);

	return (
		<div className={styles.container}>
			<div className={styles.head}>
				<h3>Biểu đồ giá tiền nhập hàng (VNĐ)</h3>
				<div className={styles.filter}>
					<SelectFilterOption
						uuid={uuidCompany}
						setUuid={setUuidCompanyFilter}
						listData={listCompany?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Tất cả kv cảng xuất khẩu'
					/>
					<SelectFilterOption
						uuid={customerUuid}
						setUuid={setCustomerUuid}
						listData={listCustomer?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Nhà cung cấp'
					/>
					<SelectFilterOption
						isShowAll={false}
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
						uuid={provinceUuid}
						setUuid={setProvinceUuid}
						listData={listProvince?.data?.map((v: any) => ({
							uuid: v?.matp,
							name: v?.name,
						}))}
						placeholder='Tất cả tỉnh thành'
					/>
				</div>
			</div>
			<div className={styles.head_data}>
				<p className={styles.data_total}>
					<div className={styles.wrapper}>
						<div className={styles.line} style={{background: '#2A85FF'}}></div>
						<div className={styles.circle} style={{borderColor: '#2A85FF'}}></div>
					</div>
					<div>
						Lớn nhất:<span>{convertCoin(dataBoardDailyPrice?.data?.data?.overview?.max)} (VNĐ)</span>
					</div>
				</p>
				<p className={styles.data_total}>
					<div className={styles.wrapper}>
						<div className={styles.line} style={{background: '#FF6838'}}></div>
						<div className={styles.circle} style={{borderColor: '#FF6838'}}></div>
					</div>
					<div>
						Trung bình:<span>{convertCoin(dataBoardDailyPrice?.data?.data?.overview?.averageAmount)} (VNĐ)</span>
					</div>
				</p>
				<p className={styles.data_total}>
					<div className={styles.wrapper}>
						<div className={styles.line} style={{background: '#2DA2BC'}}></div>
						<div className={styles.circle} style={{borderColor: '#2DA2BC'}}></div>
					</div>
					<div>
						Nhỏ nhất:<span>{convertCoin(dataBoardDailyPrice?.data?.data?.overview?.min)} (VNĐ)</span>
					</div>
				</p>
				<p className={styles.data_total}>
					<div className={styles.wrapper}>
						<div className={styles.line} style={{background: '#2CAE39'}}></div>
						<div className={styles.circle} style={{borderColor: '#2CAE39'}}></div>
					</div>
					<div>
						Khách hàng:<span>{convertCoin(dataBoardDailyPrice?.data?.data?.overview?.customerLine)} (VNĐ)</span>
					</div>
				</p>
			</div>
			<div className={styles.main_chart}>
				<ResponsiveContainer width='100%' height='100%'>
					<AreaChart
						width={500}
						height={300}
						data={filteredDataChart}
						margin={{
							top: 8,
							right: 8,
							left: 24,
							bottom: 8,
						}}
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='name' scale='point' padding={{left: 40}} />
						<YAxis domain={[2000000, 'dataMax']} tickFormatter={(value) => convertCoin(value)} />
						<Tooltip formatter={(value) => convertCoin(Number(value))} />

						{filteredProductTypes.map((v) => (
							<Area
								key={v.key}
								type='linear'
								dataKey={v.key}
								stroke={v.fill}
								fill='none'
								dot={{r: 4, fill: '#fff', stroke: v.fill, strokeWidth: 2}}
							/>
						))}
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

export default ChartStackArea;
