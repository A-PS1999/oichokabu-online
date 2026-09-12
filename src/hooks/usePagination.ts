import { useCallback, useState } from 'react';

export type UsePaginationResult<T> = {
	jumpPage: (page: number) => void;
	pageData: () => T[];
	page: number;
};

export default function usePagination<T>(allRooms: readonly T[], perPage: number): UsePaginationResult<T> {
	const [page, setPage] = useState(1);

	const maxPage = Math.ceil(allRooms.length / perPage);

	function pageData(): T[] {
		const start = (page - 1) * perPage;
		const end = start + perPage;

		return allRooms.slice(start, end);
	}

	const jumpPage = useCallback(
		(pageToJump: number) => {
			const pageNumber = Math.max(1, pageToJump);
			setPage(Math.min(pageNumber, maxPage));
		},
		[maxPage],
	);

	return { jumpPage, pageData, page };
}
