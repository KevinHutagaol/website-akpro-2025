import {
    type CSSProperties,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react"
import "/src/styles/global.css"
import styles from "/src/styles/CalendarAsistensi.module.css"

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

type DisplayData = { date: Date, contents: Array<{ data: AsisData, isHighlighted: boolean }> };


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

const convertToTerm = (year: number, ganjil_genap: ("ganjil" | "genap")): number => ganjil_genap === 'genap' ? 2 * year : 2 * year - 1;

interface InternalMemberItemProps {
    entry: DisplayData | null;
    ganjil_genap: "genap" | "ganjil";
}

function InternalMemberItem(props: InternalMemberItemProps) {
    type PopupDirection = "up" | "down";

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [popupDirection, setPopupDirection] = useState<PopupDirection>("down");
    const [activeItemData, setActiveItemData] = useState<AsisData | null>(null);
    const [activeElementIndex, setActiveElementIndex] = useState<Number | null>(null);

    const popupRef = useRef<HTMLDivElement | null>(null);
    const elementRef = useRef<HTMLDivElement | null>(null);

    const findPopupDirection = () => {
        if (!elementRef.current || !popupRef.current) return "bottom" as PopupDirection;

        const elementRect = elementRef.current.getBoundingClientRect();

        const upperAvailableSpace = elementRect.top;
        const lowerAvailableSpace = window.innerHeight - elementRect.bottom;

        if (upperAvailableSpace > lowerAvailableSpace) {
            return "up";
        } else {
            return "down";
        }
    }

    const handleMouseEnter = (itemData: AsisData, index: number) => {
        setActiveItemData(itemData);
        setActiveElementIndex(index);

        if (!isPopupVisible) {
            setIsPopupVisible(true);
        } else {
            const newDirection = findPopupDirection();
            if (newDirection !== popupDirection) {
                setPopupDirection(newDirection);
            }
        }
    }

    const handleMouseLeave = () => {
        setIsPopupVisible(false);
        setActiveItemData(null);
        setActiveElementIndex(null);
    }

    useEffect(() => {
        if (isPopupVisible && activeItemData) {
            const reevaluateDirection = () => {
                const newDirection = findPopupDirection();
                if (newDirection !== popupDirection) {
                    setPopupDirection(newDirection);
                }
            };
            reevaluateDirection();

            window.addEventListener("resize", reevaluateDirection);
            window.addEventListener("scroll", reevaluateDirection, true);

            return () => {
                window.removeEventListener("resize", reevaluateDirection);
                window.removeEventListener("scroll", reevaluateDirection, true);
            }
        }
    }, [isPopupVisible, activeItemData, popupDirection]);

    const popupDirectionClass = popupDirection === 'up' ? styles.item__popup_up_cell : styles.item__popup_down_cell;

    return (
        <div className={styles.calendar__contents}
             ref={elementRef}
             onMouseLeave={handleMouseLeave}
        >
            {props.entry === null ? null : (
                props.entry!.contents.map((item, i) => {

                    let triggerElementClass = '';
                    if (isPopupVisible && activeElementIndex === i) {
                        triggerElementClass = popupDirection === "up" ? styles.item__internal_member__active__up : styles.item__internal_member__active__down;
                    }

                    return (
                        // TODO: Border for multi-item currently not fully working (good enough)
                        <div
                            className={`${styles.item__internal_member} ${(isPopupVisible && activeElementIndex === i) ? triggerElementClass : ''}`}
                            style={{
                                "--_side-strip-color": item.isHighlighted ? "orangered" : "",
                                opacity: item.isHighlighted ? 1 : 0.5
                            } as CSSProperties}
                            onMouseEnter={() => handleMouseEnter(item.data, i)}
                            onFocus={() => handleMouseEnter(item.data, i)}
                        >
                            <div className={`${styles.internal_member__contents}`}>
                                <p className={styles.item__internal_member__name}>
                                    {item.data.name}
                                </p>
                                <p className={styles.item__internal_member__details}>
                                    {item.data.date.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })} - Selesai
                                </p>
                                <p className={styles.item__internal_member__details}>
                                    Sem {item.data.year.map(year => `${convertToTerm(year, props.ganjil_genap)}`).join(", ")}
                                </p>
                                <p className={styles.item__internal_member__details}>
                                    {item.data.major.map(maj => {
                                        if (maj === "elektro") {
                                            return "Elektro";
                                        } else if (maj === "komputer") {
                                            return "Tkom";
                                        } else {
                                            return "Biom";
                                        }
                                    }).join(", ")}
                                </p>
                            </div>
                        </div>
                    )
                })
            )}
            {isPopupVisible && activeItemData !== null && (
                <div className={`${popupDirectionClass} ${styles.internal_member__popup}`}
                     onMouseLeave={handleMouseLeave}
                     ref={popupRef}>
                    <div className={styles.internal_member__popup_content}>
                        <div className={styles.popup__text}>
                            <p>{activeItemData.date.toLocaleDateString("id-ID", {
                                weekday: "long",
                                day: "2-digit",
                                month: "long"
                            })}
                            </p>
                            <p> Pengasis:</p>
                            <ul className={styles.popup__contents__person}>
                                {activeItemData.person.map(person => (
                                    <li>
                                        {person.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.popup__seperator}></div>
                        <div className={styles.popup__link}>
                            {activeItemData.recordingsLink
                                ? (<a href={activeItemData.recordingsLink}
                                      target="_blank"
                                      className={`${styles.content__link}`}>
                                    Video
                                    <svg className="svg-icon">
                                        <use href="#youtube-logo"/>
                                    </svg>
                                </a>)
                                : activeItemData.zoomMeetingsLink
                                    ? (<a href={activeItemData.zoomMeetingsLink}
                                          target="_blank"
                                          className={`${styles.content__link}`}>
                                        Zoom
                                        <svg className="svg-icon">
                                            <use href="#video-camera"/>
                                        </svg>
                                    </a>)
                                    : (<div aria-disabled={true}
                                            className={styles.link__No_link}>—</div>)
                            }
                        </div>
                    </div>
                </div>
            )
            }
        </div>
    )
}

export default function CalendarAsistensi(props: Props) {
    const sameMajorAndTerm = (item: AsisData, options: typeof props.options) => {
        const same_year = options.year ? item.year.includes(options.year) : true;
        const same_major = options.major ? item.major.includes(options.major) : true;
        return same_year && same_major;
    }

    const groupedData = useMemo(() => {
        const groups = new Map<String, DisplayData>();

        props.content.forEach((element) => {
            const elementDateString = element.date.toISOString();

            if (groups.has(elementDateString)) {
                groups.get(elementDateString)?.contents.push({
                    data: element,
                    isHighlighted: true
                });
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

    const arrHours = useMemo(() => {
        return Array.from({length: maxHour - minHour + 1}, (_, i) => (minHour + i))
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

    const arrDates = useMemo(() => {
        return getDaysArray(minDate, maxDate);
    }, [props.content])


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

    const calendarMatrixHighlighted = useMemo(() => (
        calendarMatrix.map(row => (
            row.map(col => {
                if (col) {
                    return {
                        ...col,
                        contents: col.contents.map(i => {
                            return {
                                ...i,
                                isHighlighted: sameMajorAndTerm(i.data, props.options),
                            }
                        })
                    }
                } else {
                    return null;
                }
            })
        ))
    ), [props.content, props.options]);


    return (
        <section className={`${styles.calendar_container}`}>
            <div className={`${styles.calendar_container_fixed} `}>
                <div className={`${styles.calendar_header_fixed} ${styles.calendar_header}`}>
                    <div className={`${styles.calendar_header_item_fixed} 
                                        ${styles.resize_handle_container}`}
                    >{"\u00A0"}
                    </div>
                    <div className={styles.resize_handle_dummy}></div>
                </div>
                <div className={styles.calendar_row}>
                    <div className={`${styles.calendar_item_fixed__empty} ${styles.resize_handle_container}`}>
                        <div className={styles.resize_handle_dummy}></div>
                    </div>
                    {arrHours.map((hour) => (
                        <div
                            className={`${styles.calendar_item_fixed} ${styles.resize_handle_container}`}>
                            <div className={`${styles.calendar_item__time} `}>
                                {hour}:00
                            </div>
                            <div className={styles.resize_handle_dummy}></div>
                        </div>
                    ))
                    }
                </div>
            </div>
            <div className={styles.calendar_container_scrollable}>
                {arrDates.map((date, dateIndex) => (
                    <div className={styles.calendar_column}>
                        <div
                            className={`${styles.calendar_header} ${styles.calendar_header__contents} ${styles.calendar_header__dates}`}>
                            {date.toLocaleDateString("id-ID", {weekday: "short"})} - {" "}
                            {date.toLocaleDateString("id-ID", {month: "long", day: "numeric"})}
                        </div>
                        <div className={`${styles.calendar_item__empty}`}>
                            <div className={styles.calendar__contents_empty}></div>
                        </div>
                        {arrHours.map((_, hourIndex) => {
                            const entry = calendarMatrixHighlighted[hourIndex][dateIndex];
                            return (
                                <div className={`${styles.calendar_item}`}>
                                    <InternalMemberItem entry={entry} ganjil_genap={props.ganjil_genap}/>
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>
        </section>
    )
}

