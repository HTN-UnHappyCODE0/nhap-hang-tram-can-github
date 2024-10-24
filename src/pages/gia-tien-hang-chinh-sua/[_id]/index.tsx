import Head from 'next/head';
import {ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import MainDetailPriceTagUpdate from '~/components/pages/gia-tien-hang-chinh-sua/MainDetailPriceTagUpdate';
import CheckRegencyCode from '~/components/protected/CheckRegencyCode';
import {REGENCY_CODE} from '~/constants/config/enum';

export default function Page() {
	return (
		<CheckRegencyCode isPage={true} regencys={[REGENCY_CODE.GIAM_DOC, REGENCY_CODE.PHO_GIAM_DOC, REGENCY_CODE.QUAN_LY_NHAP_HANG]}>
			<Head>
				<title>Chi tiết giá tiền hàng cập nhật</title>
				<meta name='description' content='Chi tiết giá tiền hàng cập nhật' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<MainDetailPriceTagUpdate />
			</WrapperContainer>
		</CheckRegencyCode>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return <BaseLayout title='Chi tiết giá tiền hàng cập nhật'>{Page}</BaseLayout>;
};
