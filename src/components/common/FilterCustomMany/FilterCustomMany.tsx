import {ArrowDown2} from 'iconsax-react';
import {BiCheck} from 'react-icons/bi';
import {PropsFilterCustomMany} from './interfaces';
import TippyHeadless from '@tippyjs/react/headless';
import clsx from 'clsx';
import styles from './FilterCustomMany.module.scss';
import {useRouter} from 'next/router';
import {useRef, useState} from 'react';
import {removeVietnameseTones} from '~/common/funcs/optionConvert';
import Button from '../Button';

function FilterCustomMany({listFilter, name, query, isSearch, disabled = false}: PropsFilterCustomMany) {
	const router = useRouter();
	const {[query]: queryStr, ...rest} = router.query;
	const inputSearchRef = useRef<HTMLInputElement>(null);

	const [open, setOpen] = useState<boolean>(false);
	const [keyword, setKeyword] = useState<string>('');

	function getNameMethod(arr: {id: number | string; name: string}[], id: number | string) {
		const item = arr?.find((v) => v.id == id) || null;
		return item?.name || 'Tất cả';
	}

	const handleSelectClick = () => {
		if (isSearch && inputSearchRef?.current) {
			setTimeout(() => {
				inputSearchRef.current?.focus();
			}, 0);
		}
	};

	return (
		<TippyHeadless
			maxWidth={'100%'}
			interactive
			visible={open}
			onClickOutside={() => setOpen(false)}
			placement='bottom-start'
			render={(attrs: any) => (
				<div className={styles.mainOption}>
					{isSearch ? (
						<input
							ref={inputSearchRef}
							placeholder='Tìm kiếm...'
							className={styles.inputSearch}
							value={keyword}
							onChange={(e) => setKeyword(e.target.value)}
						/>
					) : null}
					<div className={styles.overflow}>
						<div
							className={clsx(styles.option, {
								[styles.option_active]: !queryStr,
							})}
							onClick={() => {
								setOpen(false);
								router.replace(
									{
										query: {
											...rest,
										},
									},
									undefined,
									{
										scroll: false,
									}
								);
							}}
						>
							<p>{'Tất cả'}</p>
							{!queryStr && (
								<div className={styles.icon_check}>
									<BiCheck fontSize={18} color='#5755FF' fontWeight={600} />
								</div>
							)}
						</div>
						{listFilter
							?.filter((v) => removeVietnameseTones(v.name)?.includes(keyword ? removeVietnameseTones(keyword) : ''))
							?.map((v, i) => (
								<div
									key={i}
									className={clsx(styles.option, {
										[styles.option_active]: (queryStr as string) == v.id,
									})}
									onClick={() => {
										setOpen(false);
										router.replace(
											{
												...router,
												query: {
													...router.query,
													[query]: v.id,
												},
											},
											undefined,
											{scroll: false}
										);
									}}
								>
									<p>{v.name}</p>
									{(queryStr as string) == v.id && (
										<div className={styles.icon_check}>
											<BiCheck fontSize={20} fontWeight={600} />
										</div>
									)}
								</div>
							))}
					</div>
					<div className={styles.accessBtn}>
						<Button className={styles.buttonHalf} p_8_24 rounded_8 primary>
							Áp dụng
						</Button>
					</div>
				</div>
			)}
		>
			<div
				className={clsx(styles.dealer, {[styles.active]: open, [styles.disabled]: disabled})}
				onClick={() => {
					if (disabled) {
						setOpen(false);
						return;
					} else {
						setOpen(!open);
						handleSelectClick();
					}
				}}
			>
				<div className={styles.value}>
					<p className={styles.name}>{name && `${name}:`}</p>
					<p className={styles.text}>{getNameMethod(listFilter, queryStr as string)}</p>
				</div>
				<div className={styles.icon_arrow}>
					<ArrowDown2 size={16} />
				</div>
			</div>
		</TippyHeadless>
	);
}

export default FilterCustomMany;
