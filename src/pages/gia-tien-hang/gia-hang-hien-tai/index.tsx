import Head from 'next/head';
import {ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import LayoutPages from '~/components/layouts/LayoutPages';
import MainPriceTagCurrent from '~/components/pages/gia-tien-hang/MainPriceTagCurrent';
import CheckRegencyCode from '~/components/protected/CheckRegencyCode';
import {PATH} from '~/constants/config';
import {REGENCY_CODE} from '~/constants/config/enum';

export default function Page() {
	return (
		<CheckRegencyCode
			isPage={true}
			regencys={[REGENCY_CODE.GIAM_DOC, REGENCY_CODE.PHO_GIAM_DOC, REGENCY_CODE.QUAN_LY_NHAP_HANG, REGENCY_CODE.NHAN_VIEN_THI_TRUONG]}
		>
			<Head>
				<title>Quản lý giá tiền hàng</title>
				<meta name='description' content='Quản lý giá tiền hàng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LayoutPages
				listPages={[
					{
						title: 'Giá hàng hiện tại',
						url: PATH.GiaTienHangHienTai,
					},
					{
						title: 'Lịch sử giá hàng',
						url: PATH.GiaTienHangLichSu,
					},
				]}
			>
				<MainPriceTagCurrent />
			</LayoutPages>
		</CheckRegencyCode>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight title='Quản lý giá tiền hàng'>
			{Page}
		</BaseLayout>
	);
};
