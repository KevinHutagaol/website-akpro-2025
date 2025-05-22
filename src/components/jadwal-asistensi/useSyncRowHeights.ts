import {useRef, useCallback, useLayoutEffect} from "react";

function debounceUtil<F extends (...args: any[]) => any>(func: F, wait: number) {
    let timeoutID: ReturnType<typeof setTimeout> | null = null;
    return function (this: any, ...args: Parameters<F>) {
        if (timeoutID) {
            clearTimeout(timeoutID);
        }
        timeoutID = setTimeout(() => {
            func.apply(this, args);
            timeoutID = null;
        }, wait);
    }
}


export default function useSyncRowHeights(rowSelector: string, dependencies: any[] = []) {
    const scrollableAreaRef = useRef<HTMLDivElement>(null);
    const fixedAreaRef = useRef<HTMLDivElement>(null);

    const syncRowHeights = useCallback(() => {
        if (!scrollableAreaRef.current || !fixedAreaRef.current) {
            return;
        }

        const scrollableRows: NodeListOf<HTMLDivElement> = scrollableAreaRef.current!.querySelectorAll(rowSelector);
        const fixedRows: NodeListOf<HTMLDivElement> = fixedAreaRef.current!.querySelectorAll(rowSelector);
        if (scrollableRows.length !== fixedRows.length) {
            console.warn("Error while syncing row heights: different number of scrollable rows, fixed rows", scrollableRows.length, fixedRows.length);
            return;
        }

        for (let i = 0; i < scrollableRows.length; i++) {
            const scrollableRow = scrollableRows[i];
            const fixedRow = fixedRows[i];


            scrollableRow.style.height = '';
            fixedRow.style.height = '';

            const maxHeight = Math.max(scrollableRow.scrollHeight, fixedRow.scrollHeight);

            scrollableRow.style.height = `${maxHeight}px`;
            fixedRow.style.height = `${maxHeight}px`;
        }
    }, [rowSelector]);

    useLayoutEffect(() => {
        syncRowHeights();



        const handleResize = debounceUtil(syncRowHeights, 100);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [syncRowHeights, ...dependencies]);


    return {scrollableAreaRef, fixedAreaRef, syncRowHeights};
}