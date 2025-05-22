import {useEffect, useMemo, useRef} from "react"
import "/src/styles/global.css"
import styles from "/src/styles/CalendarAsistensi.module.css"
import useSyncRowHeights from "./useSyncRowHeights.ts";

interface Props {
    content: Array<{
        name: string;
        person: Array<{ name: string; year?: number; major?: string }>;
        date: Date;
        year: Array<number>;
        major: Array<"elektro" | "komputer" | "biomedik">;
        zoomMeetingsLink?: string;
        recordingsLink?: string;
    }>
    options: {
        year: number | null;
        major: "elektro" | "komputer" | "biomedik" | "";
    }
    ganjil_genap: "genap" | "ganjil";
}

type AsisData = {
    name: string;
    person: Array<{ name: string; year?: number; major?: string }>;
    date: Date;
    year: Array<number>;
    major: Array<"elektro" | "komputer" | "biomedik">;
    zoomMeetingsLink?: string;
    recordingsLink?: string;
}

const getDaysArray = function (start: Date, end: Date) {
    const arr: Array<Date> = [];
    let currentDate = new Date(start);

    currentDate.setHours(0, 0, 0, 0);

    const finalDate = new Date(end);
    finalDate.setHours(0, 0, 0, 0);

    if (currentDate > finalDate) {
        return arr;
    }

    while (currentDate <= finalDate) {
        arr.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return arr;
};

export default function CalendarAsistensi(props: Props) {
    type DisplayData = { date: Date, contents: Array<{ data: AsisData, isHighlighted: boolean }> };

    const groupedData = useMemo(() => {
        const groups = new Map<String, DisplayData>();

        props.content.forEach((element) => {
            const elementDateString = element.date.toISOString();

            if (groups.has(elementDateString)) {
                groups.get(elementDateString)?.contents.push({data: element, isHighlighted: true});
            } else {
                groups.set(elementDateString, {
                    date: element.date,
                    contents: [{data: element, isHighlighted: true}],
                });
            }
        })


        return Array.from(groups.values());
    }, [props.content]);

    const [minHour, maxHour] = useMemo(() => {
        const firstHour = props.content[0].date.getHours();
        return props.content.reduce((acc, cur) => {
            const curHour = cur.date.getHours();
            acc[0] = (curHour < acc[0]) ? curHour : acc[0];
            acc[1] = (curHour > acc[1]) ? curHour : acc[1];
            return acc;
        }, [firstHour, firstHour]);
    }, [props.content]);


    const [minDate, maxDate] = useMemo(() => {
        let firstDate = props.content[0].date;
        firstDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
        return props.content.reduce((acc, cur) => {
            const curDate = new Date(cur.date.getFullYear(), cur.date.getMonth(), cur.date.getDate());
            acc[0] = (curDate.getTime() < acc[0].getTime()) ? curDate : acc[0];
            acc[1] = (curDate.getTime() > acc[1].getTime()) ? curDate : acc[1];
            return acc;
        }, [firstDate, firstDate]);
    }, [props.content]);


    const calendarMatrix = useMemo(() => {
        const dateDiffInDays = (start: Date, end: Date) => {
            const _MS_PER_DAY = 1000 * 60 * 60 * 24;
            const utc1 = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
            const utc2 = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

            return Math.floor((utc2 - utc1) / _MS_PER_DAY);
        }
        const width = dateDiffInDays(minDate, maxDate) + 1;
        const height = maxHour - minHour + 1;

        let output: Array<Array<DisplayData | null>> = [...Array(height)];
        output.forEach((_, i) => {
            output[i] = [...Array(width)].fill(null)
        })

        groupedData.forEach((data) => {
            output[data.date.getHours() - minHour][dateDiffInDays(minDate, data.date)] = data;
        })

        // console.table(output);
        return output;
    }, [props.content]);


    const {
        scrollableAreaRef,
        fixedAreaRef,
        syncRowHeights: _sync
    } = useSyncRowHeights(`.${styles.calendar_header}, .${styles.calendar_item}`, [])

    return (
        <>
            <p>CalendarAsistensi {props.options.year ? props.options.year : "all"} {props.options.major ? props.options.major : "all"}</p>
            <p>{minHour} {maxHour}</p>
            <p>{minDate.toLocaleDateString()} {maxDate.toLocaleDateString()}</p>
            {/*<div className={styles.calendarDiv}>*/}
            {/*    {groupedData.map(item => (*/}
            {/*        <div className={styles.calendarRow}>*/}
            {/*            <p>{item.date.toLocaleDateString("id-ID", {day: "2-digit", month: "long", hour: "2-digit"})}</p>*/}
            {/*            {item.contents.map((el, index) => (*/}
            {/*                <div className={styles.innerCell}>{el.data.name}</div>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}
            <div className={styles.calendar_container}>
                <div className={`${styles.calendar_container_fixed} ${styles.calendar_header_fixed}`}
                     ref={fixedAreaRef}>
                    <div className={`${styles.calendar_header_item} 
                                    ${styles.calendar_header_item_fixed}`}
                    >TEMP
                    </div>
                    <div className={styles.calendar_row}>
                        {Array.from({length: maxHour - minHour + 1}, (_, i) => (minHour + i))
                            .map((hour) => (
                                <div className={`${styles.calendar_item} ${styles.calendar_item_fixed}`}>
                                    {hour}:00
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className={styles.calendar_container_scrollable} ref={scrollableAreaRef}>
                    <div className={styles.calendar_header}>
                        {getDaysArray(minDate, maxDate).map((date) => (
                            <div>{date.toLocaleDateString()}</div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

