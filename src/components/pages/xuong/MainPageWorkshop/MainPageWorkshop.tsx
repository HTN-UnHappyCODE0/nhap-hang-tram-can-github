import React, {useState} from 'react';
import Image from 'next/image';
import {ICustomer, PropsMainPageWorkshop} from './interfaces';
import styles from './MainPageWorkshop.module.scss';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {httpRequest} from '~/services';
import {
	CONFIG_DESCENDING,
	CONFIG_PAGING,
	CONFIG_STATUS,
	CONFIG_TYPE_FIND,
	QUERY_KEY,
	STATUS_CUSTOMER,
	TYPE_CUSTOMER,
	TYPE_PARTNER,
} from '~/constants/config/enum';
import customerServices from '~/services/customerServices';
import {useRouter} from 'next/router';
import Loading from '~/components/common/Loading';
import FilterCustom from '~/components/common/FilterCustom';
import Search from '~/components/common/Search';
import Button from '~/components/common/Button';
import icons from '~/constants/images/icons';
import {PATH} from '~/constants/config';
import DataWrapper from '~/components/common/DataWrapper';
import Noti from '~/components/common/DataWrapper/components/Noti';
import Table from '~/components/common/Table';
import TagStatus from '~/components/common/TagStatus';
import Link from 'next/link';
// import {Lock1, Personalcard, Trash, Unlock} from 'iconsax-react';
import Pagination from '~/components/common/Pagination';
import Dialog from '~/components/common/Dialog';
import partnerServices from '~/services/partnerServices';
import IconCustom from '~/components/common/IconCustom';
import {LuPencil} from 'react-icons/lu';
import {HiOutlineLockClosed, HiOutlineLockOpen} from 'react-icons/hi';

function MainPageWorkshop({}: PropsMainPageWorkshop) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const {_page, _pageSize, _status, _keyword, _partnerUuid} = router.query;
	// const [customerUuid, setCustomerUuid] = useState<string>('');
	const [dataStatusCustomer, setDataStatusCustomer] = useState<ICustomer | null>(null);

	const listCustomer = useQuery([QUERY_KEY.table_khach_hang_doi_tac, _status, _keyword, _page, _pageSize, _partnerUuid], {
		queryFn: () =>
			httpRequest({
				isList: true,
				http: customerServices.listCustomer({
					page: Number(_page) || 1,
					pageSize: Number(_pageSize) || 20,
					keyword: (_keyword as string) || '',
					specUuid: '',
					userUuid: '',
					provinceId: '',
					status: !!_status ? Number(_status) : null,
					typeCus: TYPE_CUSTOMER.NHA_CUNG_CAP,
					partnerUUid: (_partnerUuid as string) || null,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.TABLE,
					isPaging: CONFIG_PAGING.IS_PAGING,
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
					pageSize: 20,
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

	const funcChangeStatusCustomer = useMutation({
		mutationFn: () => {
			return httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: dataStatusCustomer?.status == STATUS_CUSTOMER.HOP_TAC ? 'Khóa thành công' : 'Mở khóa thành công',
				http: customerServices.changeStatus({
					uuid: dataStatusCustomer?.uuid!,
					status: dataStatusCustomer?.status! == STATUS_CUSTOMER.HOP_TAC ? STATUS_CUSTOMER.DUNG_HOP_TAC : STATUS_CUSTOMER.HOP_TAC,
				}),
			});
		},
		onSuccess(data) {
			if (data) {
				setDataStatusCustomer(null);
				queryClient.invalidateQueries([QUERY_KEY.table_khach_hang_doi_tac]);
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_nha_cung_cap]);
			}
		},
	});

	return (
		<div className={styles.container}>
			<Loading loading={funcChangeStatusCustomer.isLoading} />
			<div className={styles.header}>
				<div className={styles.main_search}>
					<div className={styles.search}>
						<Search keyName='_keyword' placeholder='Tìm kiếm theo tên NCC' />
					</div>
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

					<div className={styles.filter}>
						<FilterCustom
							isSearch
							name='Trạng thái'
							query='_status'
							listFilter={[
								{
									id: STATUS_CUSTOMER.DUNG_HOP_TAC,
									name: 'Bị khóa',
								},
								{
									id: STATUS_CUSTOMER.HOP_TAC,
									name: 'Hoạt động',
								},
								{
									id: STATUS_CUSTOMER.DA_XOA,
									name: 'Đã xóa',
								},
							]}
						/>
					</div>
				</div>

				<div className={styles.btn}>
					<Button
						href={PATH.ThemMoiXuong}
						p_8_16
						rounded_2
						icon={<Image alt='icon add' src={icons.add} width={20} height={20} />}
					>
						Thêm NCC
					</Button>
				</div>
			</div>

			<div className={styles.table}>
				<DataWrapper
					data={listCustomer.data?.items || []}
					loading={listCustomer.isLoading}
					noti={<Noti disableButton des='Hiện tại chưa có NCC nào!' />}
				>
					<Table
						data={listCustomer.data?.items || []}
						column={[
							{
								title: 'Mã NCC',
								render: (data: any) => <>{data.code}</>,
							},
							{
								title: 'Tên NCC',
								fixedLeft: true,
								render: (data: any) => (
									<Link href={`/xuong/${data?.uuid}`} className={styles.link}>
										{data?.name || '---'}
									</Link>
								),
							},
							{
								title: 'Tên công ty',
								render: (data: any) => <>{data.partnerUu?.name || '---'}</>,
							},

							{
								title: 'Kho hàng',
								render: (data: any) => <>{data?.warehouseUu?.name || '---'}</>,
							},
							{
								title: 'Số điện thoại',
								render: (data: any) => <>{data.phoneNumber || '---'}</>,
							},
							{
								title: 'Email',
								render: (data: any) => <>{data.email || '---'}</>,
							},
							{
								title: 'Nhân viên',
								render: (data: any) => <>{data?.userUu?.fullName || '---'}</>,
							},
							{
								title: 'Trạng thái',
								render: (data: any) => <TagStatus status={data?.status} />,
							},
							{
								title: 'Tác vụ',
								fixedRight: true,
								render: (data: any) => (
									<div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
										<IconCustom
											edit
											icon={<LuPencil fontSize={20} fontWeight={600} />}
											tooltip='Chỉnh sửa'
											color='#777E90'
											href={`${PATH.ChinhSuaXuong}?_customerUuid=${data?.uuid}`}
										/>

										{/* <IconCustom
											lock
											icon={data?.status == STATUS_CUSTOMER.HOP_TAC ? <Lock1 size={20} /> : <Unlock size={20} />}
											tooltip={data?.status == STATUS_CUSTOMER.HOP_TAC ? '' : ''}
											color='#777E90'
											onClick={() => setDataStatusCustomer(data)}
										/> */}
										<IconCustom
											lock
											icon={
												data?.status == STATUS_CUSTOMER.HOP_TAC ? (
													<HiOutlineLockClosed size='22' />
												) : (
													<HiOutlineLockOpen size='22' />
												)
											}
											tooltip={data.status == STATUS_CUSTOMER.HOP_TAC ? 'Khóa NCC' : 'Mở khóa NCC'}
											color='#777E90'
											onClick={() => {
												setDataStatusCustomer(data);
											}}
										/>
									</div>
								),
							},
						]}
					/>
				</DataWrapper>
				<Pagination
					currentPage={Number(_page) || 1}
					total={listCustomer?.data?.pagination?.totalCount}
					pageSize={Number(_pageSize) || 20}
					dependencies={[_pageSize, _status, _keyword, _partnerUuid]}
				/>
				<Dialog
					danger
					open={!!dataStatusCustomer}
					onClose={() => setDataStatusCustomer(null)}
					title={dataStatusCustomer?.status == STATUS_CUSTOMER.HOP_TAC ? 'Khóa hoạt động' : 'Mở khóa hoạt động'}
					note={
						dataStatusCustomer?.status == STATUS_CUSTOMER.HOP_TAC
							? 'Bạn có chắc chắn muốn khóa hoạt động NCC này?'
							: 'Bạn có chắc chắn muốn mở khóa hoạt động NCC này?'
					}
					onSubmit={funcChangeStatusCustomer.mutate}
				/>
			</div>
		</div>
	);
}

export default MainPageWorkshop;
