import { useCallback, useState } from 'react';

export default function usePagination(allRooms, perPage) {
    const [page, setPage] = useState(1);

    const maxPage = Math.ceil(allRooms.length / perPage);

    function pageData() {
        const start = (page - 1) * perPage;
        const end = start + perPage;

        return allRooms.slice(start, end);
    }

    const jumpPage = useCallback(
        (page) => {
            const pageNumber = Math.max(1, page);
            setPage(Math.min(pageNumber, maxPage));
        },
        [maxPage]
    );

    return { jumpPage, pageData, page }
}