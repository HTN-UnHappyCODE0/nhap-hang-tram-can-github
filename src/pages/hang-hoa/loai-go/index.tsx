import Head from 'next/head';
import {ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import LayoutPages from '~/components/layouts/LayoutPages';
import MainProductType from '~/components/pages/hang-hoa/loai-go/MainProductType';
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
				<title>Quản lý loại hàng</title>
				<meta name='description' content='Quản lý loại hàng' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<LayoutPages
				listPages={[
					{
						title: 'Loại hàng',
						url: PATH.HangHoaLoaiGo,
					},
					{
						title: 'Quốc gia',
						url: PATH.HangHoaQuocGia,
					},
					{
						title: 'Quy cách',
						url: PATH.HangHoaQuyCach,
					},
				]}
			>
				<MainProductType />
			</LayoutPages>
		</CheckRegencyCode>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight title='Quản lý loại hàng'>
			{Page}
		</BaseLayout>
	);
};
