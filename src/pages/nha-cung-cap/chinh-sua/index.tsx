import Head from 'next/head';
import {ReactElement} from 'react';
import BaseLayout from '~/components/layouts/BaseLayout';
import WrapperContainer from '~/components/layouts/WrapperContainer';
import PageUpdatePartner from '~/components/pages/nha-cung-cap/PageUpdatePartner';
import CheckRegencyCode from '~/components/protected/CheckRegencyCode';
import {REGENCY_CODE} from '~/constants/config/enum';

export default function Page() {
	return (
		<CheckRegencyCode
			isPage={true}
			regencys={[REGENCY_CODE.GIAM_DOC, REGENCY_CODE.PHO_GIAM_DOC, REGENCY_CODE.QUAN_LY_NHAP_HANG, REGENCY_CODE.NHAN_VIEN_THI_TRUONG]}
		>
			<Head>
				<title>Chỉnh sửa công ty</title>
				<meta name='description' content='Chỉnh sửa công ty' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<WrapperContainer bg={true}>
				<PageUpdatePartner />
			</WrapperContainer>
		</CheckRegencyCode>
	);
}

Page.getLayout = function (Page: ReactElement) {
	return (
		<BaseLayout bgLight={true} title='Chỉnh sửa công ty'>
			{Page}
		</BaseLayout>
	);
};
