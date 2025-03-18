import React, {useEffect, useState} from 'react';

import {PropsMainPageStatisticsByDay} from './interfaces';
import styles from './MainPageStatisticsByDay.module.scss';
import Pagination from '~/components/common/Pagination';
import DataWrapper from '~/components/common/DataWrapper';
import FilterCustom from '~/components/common/FilterCustom';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_CONFIRM,
	TYPE_BATCH,
	TYPE_CUSTOMER,
	TYPE_DATE,
	TYPE_DATE_SHOW,
	TYPE_PARTNER,
	TYPE_PRODUCT,
} from '~/constants/config/enum';
import Search from '~/components/common/Search';
import Button from '~/components/common/Button';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import wareServices from '~/services/wareServices';
import customerServices from '~/services/customerServices';
import {useRouter} from 'next/router';
import Table from '~/components/common/Table';
import Noti from '~/components/common/DataWrapper/components/Noti';
import {convertWeight, formatDrynessAvg, timeSubmit} from '~/common/funcs/optionConvert';
import TippyHeadless from '@tippyjs/react/headless';
import Moment from 'react-moment';
import {convertCoin} from '~/common/funcs/convertCoin';
import Link from 'next/link';
import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';
import IconCustom from '~/components/common/IconCustom';
import {CloseCircle, TickCircle} from 'iconsax-react';
import Dialog from '~/components/common/Dialog';
import batchBillServices from '~/services/batchBillServices';
import fixDrynessServices from '~/services/fixDrynessServices';
import Popup from '~/components/common/Popup';
import StateActive from '~/components/common/StateActive';
import SelectFilterState from '~/components/common/SelectFilterState';
import companyServices from '~/services/companyServices';
import SelectFilterMany from '~/components/common/SelectFilterMany';
import partnerServices from '~/services/partnerServices';
import storageServices from '~/services/storageServices';
import DateRangerCustom from '~/components/common/DateRangerCustom';
import moment from 'moment';
import Loading from '~/components/common/Loading';

function MainPageStatisticsByDay({}: PropsMainPageStatisticsByDay) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_userOwnerUuid, _partnerUuid, _dateFrom, _dateTo} = router.query;

	const [uuidDescription, setUuidDescription] = useState<string>('');
	const [listStatisticsByDay, setListStatisticsByDay] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [uuidCompany, setUuidCompany] = useState<string>('');
	const [customerUuid, setCustomerUuid] = useState<string[]>([]);
	const [uuidStorage, setUuidStorage] = useState<string>('');
	const [total, setTotal] = useState<number>(0);

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

	const listPartner = useQuery([QUERY_KEY.dropdown_nha_cung_cap], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: partnerServices.listPartner({
					pageSize: 50,
					page: 1,
					keyword: '',
					status: CONFIG_STATUS.HOAT_DONG,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					isPaging: CONFIG_PAGING.NO_PAGING,
					userUuid: '',
					provinceId: '',
					type: TYPE_PARTNER.NCC,
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listCustomer = useQuery([QUERY_KEY.dropdown_khach_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: customerServices.listCustomer({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					partnerUUid: '',
					userUuid: '',
					status: null,
					typeCus: null,
					provinceId: '',
					specUuid: '',
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listStorage = useQuery([QUERY_KEY.table_bai], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: storageServices.listStorage({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.IS_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					warehouseUuid: '',
					productUuid: '',
					qualityUuid: '',
					specificationsUuid: '',
					status: CONFIG_STATUS.HOAT_DONG,
				}),
			}),
		select(data) {
			if (data) {
				return data;
			}
		},
	});

	const formatTimeScale = (timeScale: string, typeShow: number) => {
		if (typeShow === TYPE_DATE_SHOW.HOUR) {
			return moment(timeScale).format('HH:mm');
		} else if (typeShow === TYPE_DATE_SHOW.DAY) {
			return moment(timeScale).format('DD/MM');
		} else if (typeShow === TYPE_DATE_SHOW.MONTH) {
			return moment(timeScale).format('MM-YYYY');
		}
		return moment(timeScale).format('YYYY');
	};

	const convertData = (data: any) => {
		return data?.lstProductDay?.reduce((acc: any, item: any) => {
			item?.customerDateWeightUu?.forEach((entry: any) => {
				const existingCustomer = acc.find((customer: any) => customer.customerUu?.uuid === entry.customerUu?.uuid);

				const timeEntry = {
					timeScale: formatTimeScale(item?.timeScale, data?.typeShow),
					weightMT: entry?.weightMT,
					weightBDMT: entry?.weightBDMT,
					drynessAvg: entry?.drynessAvg,
				};

				const totalInfo = data?.lstProductTotal?.find((total: any) => total?.customerUu?.uuid === entry?.customerUu?.uuid);

				if (existingCustomer) {
					existingCustomer.timeList.push(timeEntry);
				} else {
					acc.push({
						customerUu: entry?.customerUu,
						timeList: [timeEntry],
						weightMT: totalInfo?.weightMT || 0,
						weightBDMT: totalInfo?.weightBDMT || 0,
						drynessAvg: totalInfo?.drynessAvg || 0,
					});
				}
			});
			return acc;
		}, []);
	};

	

	const getListDashbroadCustomerBillIn = useQuery(
		[QUERY_KEY.table_thong_ke_theo_ngay, _userOwnerUuid, uuidCompany, customerUuid, _partnerUuid, uuidStorage, _dateFrom, _dateTo],
		{
			queryFn: () =>
				httpRequest({
					isList: true,
					setLoading: setLoading,
					http: batchBillServices.dashbroadCustomerBillIn({
						companyUuid: uuidCompany,
						customerUuid: customerUuid,
						isShowBDMT: 0,
						partnerUuid: _partnerUuid as string,
						provinceId: '',
						storageUuid: uuidStorage,
						timeStart: _dateFrom ? (_dateFrom as string) : null,
						timeEnd: _dateTo ? (_dateTo as string) : null,
						transportType: 0,
						typeFindDay: 0,
						typeShow: 0,
						userOwnerUuid: (_userOwnerUuid as string) || '',
						warehouseUuid: '',
					}),
				}),
			onSuccess(data) {
				if (data) {
					const newData = convertData(data);
					setListStatisticsByDay(newData);
					// setTotal(data?.pagination?.totalCount);
					console.log('acb', data)
				}
			},
			select(data) {
				if (data) {
					return data;
				}
			},
		}
	);

	// useEffect(() => {
	// 	if(getListDashbroadCustomerBillIn){
	// 		setListStatisticsByDay(convertData(getListDashbroadCustomerBillIn?.data || []));}
	// }, [getListDashbroadCustomerBillIn]);


	
	const dynamicColumns =
		listStatisticsByDay?.[0]?.timeList?.map((item: any) => ({
			title: item?.timeScale,
			render: (data: any) => {
				const matchedTime = data?.timeList?.find((t: any) => t?.timeScale === item?.timeScale);
				return <span> <p>{convertWeight(matchedTime?.weightBDMT)} (tấn)</p> <p>{matchedTime?.drynessAvg!?.toFixed(2) || '---'} %</p></span>;
			},
		})) || [];

	return (
		<div className={styles.container}>
			{/* <Loading loading={getListDashbroadCustomerBillIn.isLoading} /> */}
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm ...' />
					</div>
					<div className={styles.filter}>
						<SelectFilterState
							uuid={uuidCompany}
							setUuid={setUuidCompany}
							listData={listCompany?.data?.map((v: any) => ({
								uuid: v?.uuid,
								name: v?.name,
							}))}
							placeholder='Kv cảng xuất khẩu'
						/>
					</div>

					<SelectFilterMany
						selectedIds={customerUuid}
						setSelectedIds={setCustomerUuid}
						listData={listCustomer?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						name='Khách hàng'
					/>

					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Công ty'
							query='_partnerUuid'
							listFilter={listPartner?.data?.map((v: any) => ({
								id: v?.uuid,
								name: v?.name,
							}))}
						/>
					</div>
					<SelectFilterState
						uuid={uuidStorage}
						setUuid={setUuidStorage}
						listData={listStorage?.data?.map((v: any) => ({
							uuid: v?.uuid,
							name: v?.name,
						}))}
						placeholder='Bãi'
					/>

					<div className={styles.filter}>
						<DateRangerCustom titleTime='Thời gian' typeDateDefault={TYPE_DATE.YESTERDAY} />
					</div>
				</div>
			</div>
			<div className={styles.table}>
				<DataWrapper
					data={listStatisticsByDay || []}
					loading={loading}
					noti={<Noti des='Hiện tại chưa có danh sách thống kê theo ngày nào!' disableButton />}
				>
					<Table
						data={listStatisticsByDay || []}
						onSetData={setListStatisticsByDay}
						column={[
							{
								title: 'STT',
								render: (data: any, index: number) => <>{index + 1}</>,
							},
							{
								title: 'Xưởng sản xuất',
								fixedLeft: true,
								render: (data: any) => <p className={styles.link}>{data?.customerUu?.name}</p>,
							},

							{
								title: 'Sản lượng TB (Tấn)',
								render: (data: any) => <>{convertWeight(data?.abc)}</>,
							},
							{
								title: 'Độ khô TB (%)',
								render: (data: any) => <>{data?.drynessAvg!?.toFixed(2)}</>,
							},
							{
								title: 'Tổng lượng (Tấn)',
								render: (data: any) => <>{convertWeight(data?.weightBDMT)}</>,
							},
							// {
							// 	groupTitle: 'Thông tin sản xuất', // ✅ Tiêu đề nhóm
							// 	children: [
							// 		{
							// 			title: 'Xưởng sản xuất',
							// 			fixedLeft: true,
							// 			render: (data: any) => <p className={styles.link}>{data?.customerUu?.name}</p>,
							// 		},
							// 		{
							// 			title: 'Sản lượng trung bình (Tấn)',
							// 			render: (data: any) => <>{convertWeight(data?.abc)}</>,
							// 		},
							// 	],
							// },

							...dynamicColumns,
						]}
					/>
				</DataWrapper>

				{/* {!queryWeightsession.isFetching && ( */}
			</div>
		</div>
	);
}

export default MainPageStatisticsByDay;
