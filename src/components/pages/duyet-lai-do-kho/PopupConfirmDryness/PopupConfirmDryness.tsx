import {useMutation, useQueryClient} from '@tanstack/react-query';
import {PropsPopupConfirmDryness} from './interfaces';
import {useState} from 'react';
import Form, {FormContext} from '~/components/common/Form';

import styles from './PopupConfirmDryness.module.scss';
import Button from '~/components/common/Button';
import {IoClose} from 'react-icons/io5';
import {httpRequest} from '~/services';
import {QUERY_KEY} from '~/constants/config/enum';
import Loading from '~/components/common/Loading';
import TextArea from '~/components/common/Form/components/TextArea';
import fixDrynessServices from '~/services/fixDrynessServices';

function PopupConfirmDryness({dataBillChangeDryness, onClose}: PropsPopupConfirmDryness) {
	const queryClient = useQueryClient();

	const [form, setForm] = useState<{description: string}>({
		description: '',
	});

	const funcRemoveFixDryness = useMutation({
		mutationFn: (body: {uuids: string[]; description: string}) =>
			httpRequest({
				showMessageFailed: true,
				showMessageSuccess: true,
				msgSuccess: 'Xác nhận duyệt thay đổi độ khô thành công!',
				http: fixDrynessServices.acceptFixDryness({
					uuid: body.uuids,
					description: body.description,
				}),
			}),
		onSuccess(data) {
			if (data) {
				onClose();
				queryClient.invalidateQueries([QUERY_KEY.table_do_kho_doi_duyet]);
			}
		},
		onError(error) {
			console.log({error});
			return;
		},
	});

	const handleSubmit = async () => {
		return funcRemoveFixDryness.mutate({
			uuids: dataBillChangeDryness?.length > 1 ? dataBillChangeDryness : dataBillChangeDryness?.map((v: any) => v?.uuid),
			description: form.description,
		});
	};

	return (
		<div className={styles.container}>
			<Loading loading={funcRemoveFixDryness.isLoading} />
			<h4>Xác nhận cập nhật lại độ khô</h4>
			<Form form={form} setForm={setForm} onSubmit={handleSubmit}>
				<div className='mt'>
					<TextArea
						label={
							<span>
								Lý do thay đổi <span style={{color: 'red'}}>*</span>
							</span>
						}
						isRequired
						name='description'
						max={5000}
						blur
						placeholder='Nhập lý do hủy'
					/>
				</div>

				<div className={styles.btn}>
					<div>
						<Button p_10_24 rounded_2 grey_outline onClick={onClose}>
							Hủy bỏ
						</Button>
					</div>
					<FormContext.Consumer>
						{({isDone}) => (
							<div>
								<Button disable={!isDone} p_10_24 rounded_2 primary>
									Gửi yêu cầu cập nhật độ khô
								</Button>
							</div>
						)}
					</FormContext.Consumer>
				</div>

				<div className={styles.close} onClick={onClose}>
					<IoClose />
				</div>
			</Form>
		</div>
	);
}

export default PopupConfirmDryness;
