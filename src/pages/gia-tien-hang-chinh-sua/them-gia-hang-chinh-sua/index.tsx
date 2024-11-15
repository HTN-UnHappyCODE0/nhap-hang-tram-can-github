import Head from 'next/head';
import {ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import CreatePriceTagUpdate from '~/components/pages/gia-tien-hang-chinh-sua/CreatePriceTagUpdate';
import CheckRegencyCode from '~/components/protected/CheckRegencyCode';
import {REGENCY_CODE} from '~/constants/config/enum';
export default function Page() {
	return (
		<CheckRegencyCode isPage={true} regencys={[REGENCY_CODE.GIAM_DOC, REGENCY_CODE.PHO_GIAM_DOC, REGENCY_CODE.QUAN_LY_NHAP_HANG]}>
			<Head>
				<title>Thay đổi giá tiền hàng chỉnh sửa</title>
				<meta name='description' content='Thay đổi giá tiền hàng chỉnh sửa' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<CreatePriceTagUpdate />
			</WrapperContainer>
		</CheckRegencyCode>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Thay đổi giá tiền hàng chỉnh sửa'>{Page}</BaseLayout>;
};
