export interface PropsFilterCustomMany {
	listFilter: {id: number | string; name: string}[];
	name: string;
	query: string;
	isSearch?: boolean;
	disabled?: boolean;
}
