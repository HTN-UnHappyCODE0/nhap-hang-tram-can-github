import Head from 'next/head';
import {ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import CreateFuturePriceTag from '~/components/pages/gia-tien-hang-tuong-lai/CreateFuturePriceTag';
import CheckRegencyCode from '~/components/protected/CheckRegencyCode';
import {REGENCY_CODE} from '~/constants/config/enum';
export default function Page() {
	return (
		<CheckRegencyCode
			isPage={true}
			regencys={[REGENCY_CODE.GIAM_DOC, REGENCY_CODE.PHO_GIAM_DOC, REGENCY_CODE.QUAN_LY_NHAP_HANG, REGENCY_CODE.NHAN_VIEN_THI_TRUONG]}
		>
			<Head>
				<title>Thêm giá tiền hàng tương lai</title>
				<meta name='description' content='Thêm giá tiền hàng tương lai' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<CreateFuturePriceTag />
			</WrapperContainer>
		</CheckRegencyCode>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Thêm giá tiền hàng tương lai'>{Page}</BaseLayout>;
};
