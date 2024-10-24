import {useRouter} from 'next/router';
import React, {useEffect, useMemo} from 'react';

import {useSelector} from 'react-redux';
import {PATH} from '~/constants/config';
import {RootState} from '~/redux/store';

interface PropsCheckRegencyCode {
	isPage?: boolean;
	children: React.ReactNode;
	regencys: number[];
}

function CheckRegencyCode({isPage = false, regencys, children}: PropsCheckRegencyCode) {
	const {replace} = useRouter();

	const {infoUser} = useSelector((state: RootState) => state.user);

	const havePermisstion: boolean = useMemo(() => {
		return regencys.some((v) => v == infoUser?.regencyCode);
	}, [regencys, infoUser?.regencyCode]);

	useEffect(() => {
		if (!havePermisstion && isPage) replace(PATH.Home);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [havePermisstion, isPage]);

	if (havePermisstion) {
		return <>{children}</>;
	}

	return null;
}

export default CheckRegencyCode;
