import React, {useState} from 'react';
import {IFormCreateStorage, PropsFormCreateStorage} from './interfaces';
import styles from './FormCreateStorage.module.scss';
import Form, {FormContext, Input} from '~/components/common/Form';
import TextArea from '~/components/common/Form/components/TextArea';
import clsx from 'clsx';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import {useRouter} from 'next/router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {CONFIG_DESCENDING, CONFIG_PAGING, CONFIG_STATUS, CONFIG_TYPE_FIND, QUERY_KEY, TYPE_PRODUCT} from '~/constants/config/enum';
import {httpRequest} from '~/services';
import wareServices from '~/services/wareServices';
import Select, {Option} from '~/components/common/Select';
import storageServices from '~/services/storageServices';
import Loading from '~/components/common/Loading';
import criteriaServices from '~/services/criteriaServices';
import {price} from '~/common/funcs/convertCoin';

function FormCreateStorage({draggedElements, onClose}: PropsFormCreateStorage) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const {_id} = router.query;

	const [form, setForm] = useState<IFormCreateStorage>({
		name: '',
		productUuid: '',
		qualityUuid: '',
		specificationsUuid: '',
		description: '',
		amountKcs: 0,
		drynessAvg: 0,
		specWsValues: [],
	});

	const listProduct = useQuery([QUERY_KEY.dropdown_loai_hang], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listProductType({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					type: [TYPE_PRODUCT.CONG_TY],
				}),
			}),
		select(data) {
			return data;
		},
	});

	const listQuality = useQuery([QUERY_KEY.dropdown_chat_luong], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listQuality({
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

	const listSpecification = useQuery([QUERY_KEY.dropdown_quy_cach, form.qualityUuid, form?.productUuid], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: wareServices.listSpecification({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					qualityUuid: form?.qualityUuid,
					productTypeUuid: form?.productUuid,
				}),
			}),
		select(data) {
			return data;
		},
	});

	useQuery([QUERY_KEY.danh_sach_tieu_chi_quy_cach, form.specificationsUuid], {
		queryFn: () =>
			httpRequest({
				isDropdown: true,
				http: criteriaServices.listCriteriaSpec({
					page: 1,
					pageSize: 50,
					keyword: '',
					isPaging: CONFIG_PAGING.NO_PAGING,
					isDescending: CONFIG_DESCENDING.NO_DESCENDING,
					typeFind: CONFIG_TYPE_FIND.DROPDOWN,
					status: CONFIG_STATUS.HOAT_DONG,
					specificationUuid: form.specificationsUuid,
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm((prev) => ({
					...prev,
					specWsValues: data?.map((v: any) => ({
						uuid: v?.uuid,
						title: v?.title,
						value: !form.amountKcs ? 0 : v?.value,
					})),
				}));
			}
		},
		enabled: !!form.specificationsUuid,
	});

	const handleChange = (rule: {uuid: string; title: string; value: number}, value: any) => {
		setForm((prev) => ({
			...prev,
			specWsValues: prev?.specWsValues?.map((r) =>
				r.uuid === rule.uuid
					? {
							...r,
							value: value,
					  }
					: r
			),
		}));
	};

	const funcCreateStorage = useMutation({
		mutationFn: () =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Thêm mới kho hàng thành công!',
				http: storageServices.upsertStorage({
					uuid: '',
					warehouseUuid: _id as string,
					name: form.name,
					productUuid: form.productUuid,
					qualityUuid: form.qualityUuid,
					specificationsUuid: form.specificationsUuid,
					locationMap: JSON.stringify(draggedElements),
					description: form.description,
					amountKcs: price(form.amountKcs),
					drynessAvg: form.drynessAvg,
					specWsValues: form?.specWsValues?.map((v) => ({
						uuid: v?.uuid,
						value: v?.value,
					})),
				}),
			}),
		onSuccess(data) {
			if (data) {
				setForm({
					name: '',
					productUuid: '',
					qualityUuid: '',
					specificationsUuid: '',
					description: '',
					amountKcs: 0,
					drynessAvg: 48,
					specWsValues: [],
				});
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.chi_tiet_kho_hang, _id]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		return funcCreateStorage.mutate();
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcCreateStorage.isLoading} />
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className={styles.wrapper}>
					<h4>Thêm kho hàng</h4>
					<div className={clsx(styles.main_form)}>
						<div className={styles.col_2}>
							<Input
								name='name'
								value={form.name || ''}
								isRequired
								max={255}
								type='text'
								blur={true}
								placeholder='Nhập tên kho hàng'
								label={
									<span>
										Kho hàng <span style={{color: 'red'}}> *</span>
									</span>
								}
							/>
							<div>
								<Input
									name='amountKcs'
									value={form.amountKcs || ''}
									isMoney
									type='text'
									unit='KG'
									blur={true}
									placeholder='Nhập tồn đầu kỳ'
									label={
										<span>
											Tồn đầu kỳ <span style={{color: 'red'}}> *</span>
										</span>
									}
								/>
							</div>
						</div>

						<div className={clsx('mt', styles.col_2)}>
							<Input
								name='drynessAvg'
								value={form.drynessAvg || ''}
								max={255}
								type='number'
								blur={true}
								placeholder='Nhập độ khô trung bình'
								unit='%'
								label={
									<span>
										Độ khô trung bình <span style={{color: 'red'}}> *</span>
									</span>
								}
							/>
							<Select
								isSearch
								name='productUuid'
								placeholder='Chọn loại hàng'
								value={form?.productUuid}
								label={
									<span>
										Thuộc loại hàng <span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{listProduct?.data?.map((v: any) => (
									<Option
										key={v?.uuid}
										value={v?.uuid}
										title={v?.name}
										onClick={() =>
											setForm((prev: any) => ({
												...prev,
												productUuid: v?.uuid,
												specificationsUuid: '',
											}))
										}
									/>
								))}
							</Select>
						</div>

						<div className={clsx('mt', styles.col_2)}>
							<Select
								isSearch
								name='qualityUuid'
								placeholder='Chọn quốc gia'
								value={form?.qualityUuid}
								label={
									<span>
										Thuộc quốc gia <span style={{color: 'red'}}>*</span>
									</span>
								}
							>
								{listQuality?.data?.map((v: any) => (
									<Option
										key={v?.uuid}
										value={v?.uuid}
										title={v?.name}
										onClick={() =>
											setForm((prev: any) => ({
												...prev,
												qualityUuid: v.uuid,
												specificationsUuid: '',
											}))
										}
									/>
								))}
							</Select>
							<div>
								<Select
									isSearch
									name='specificationsUuid'
									placeholder='Chọn quy cách'
									readOnly={!form.qualityUuid}
									value={form?.specificationsUuid}
									label={
										<span>
											Thuộc quy cách <span style={{color: 'red'}}>*</span>
										</span>
									}
								>
									{listSpecification?.data?.map((v: any) => (
										<Option
											key={v?.uuid}
											value={v?.uuid}
											title={v?.name}
											onClick={() =>
												setForm((prev: any) => ({
													...prev,
													specificationsUuid: v.uuid,
												}))
											}
										/>
									))}
								</Select>
							</div>
						</div>

						{form?.specWsValues?.length > 0 && (
							<div className='mt'>
								<p className={styles.label}>
									Tiêu chí <span style={{color: 'red'}}>*</span>
								</p>
								<div className={clsx(styles.boxRule)}>
									<div className={styles.col_2}>
										{form?.specWsValues?.map((v, i) => (
											<div key={i} className={styles.item}>
												<p>{v?.title}</p>
												<div className={styles.box_input}>
													<input
														className={styles.input}
														type='number'
														step='0.01'
														value={v?.value}
														readOnly={!form.amountKcs}
														disabled={!form.amountKcs}
														onChange={(e) => handleChange(v, e.target.value)}
													/>
													<div className={clsx(styles.unit, {[styles.disabled]: !form.amountKcs})}>%</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						)}
						<div className={clsx('mt')}>
							<TextArea max={5000} placeholder='Thêm mô tả' name='description' label={<span>Mô tả</span>} blur={true} />
						</div>
					</div>

					<div className={styles.btn}>
						<div>
							<Button p_10_24 rounded_2 grey_outline onClick={onClose}>
								Hủy bỏ
							</Button>
						</div>
						<div>
							<FormContext.Consumer>
								{({isDone}) => (
									<Button
										disable={!isDone || !form.productUuid || !form.qualityUuid || !form.specificationsUuid}
										p_10_24
										rounded_2
										primary
									>
										Lưu lại
									</Button>
								)}
							</FormContext.Consumer>
						</div>
					</div>
				</div>
			</Form>
			<div className={styles.close} onClick={onClose}>
				<IoClose />
			</div>
		</div>
	);
}

export default FormCreateStorage;
