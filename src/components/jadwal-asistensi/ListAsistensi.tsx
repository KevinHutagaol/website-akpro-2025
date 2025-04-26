import {useState, useRef, useMemo} from "react"
import "/src/styles/global.css"
import styles from "/src/styles/ListAsistensi.module.css"

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

export default function ListAsistensi(props: Props) {
    const convertToTerm = (year: number): number => props.ganjil_genap === 'genap' ? 2 * year : 2 * year - 1
    type SortOption = "year" | "major" | "date" | "alphabetical"

    const [sortBy, setSortBy] = useState<{ option: SortOption, ascending: boolean }>({option: "date", ascending: true});

    const filter_list = () => props.content.filter((item) => {
        const same_year = props.options.year ? item.year.includes(props.options.year) : true;
        const same_major = props.options.major ? item.major.includes(props.options.major) : true;
        return same_year && same_major;
    })

    const filtered_list = useMemo(filter_list, [props.options]);

    const sort_list = () => filtered_list.sort((a, b) => {
        const isAscending = sortBy.ascending ? 1 : -1
        if (sortBy.option === "date") {
            return (a.date.getTime() - b.date.getTime()) * isAscending;
        }
        if (sortBy.option === "major") {
            return (a.major[0].localeCompare(b.major[0])) * isAscending;
        }
        if (sortBy.option === "year") {
            return (a.year[0] - b.year[0]) * isAscending;
        }
        if (sortBy.option === "alphabetical") {
            return (a.name.localeCompare(b.name)) * isAscending;
        }
        return 1
    })

    const sorted_list = useMemo(sort_list, [sortBy, props.options])

    const handleSortClick = (option: SortOption) => {
        setSortBy(prev => {
            if (option !== prev.option) {
                return {
                    ...prev,
                    option: option,
                };
            }
            return {
                ...prev,
                ascending: !prev.ascending,
            };
        })
    }

    // TODO: Implement resizing, remove flex-grow: 1 when needed
    type ColumnNames = "date" | "name" | "major" | "year" | "time" | "person" | "link";
    const initial_widths = new Map<ColumnNames, number>();
    initial_widths.set("date", 100);
    initial_widths.set("name", 150);
    initial_widths.set("major", 100);
    initial_widths.set("year", 100);
    initial_widths.set("time", 100);
    initial_widths.set("person", 200);
    initial_widths.set("link", 100);
    // @ts-ignore
    const [tableColumnWidths, setTableColumnWidths] = useState<Map<ColumnNames, number>>(initial_widths);

    const svgChevronUpDown = (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
             strokeWidth={1.5} stroke="currentColor" width={20} height={20}>
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"/>
        </svg>
    )


    return (
        <div className={styles.list_container_TESTING}>
            <div className={styles.list_container}>
                <div className={styles.list_header}>
                    <div className={`${styles.list_header__Name} ${styles.list_header_item}`}
                         style={{flexBasis: `${tableColumnWidths.get("name")!.toString()}px`}}>
                        Mata Kuliah
                        <button
                            type="button"
                            onClick={() => handleSortClick("alphabetical")}
                            aria-label="sort alphabetical"
                            style={sortBy.option !== "alphabetical" ? {opacity: 0} : undefined}>
                            {svgChevronUpDown}
                        </button>
                        <div className={styles.resize_handle}></div>
                    </div>
                    <div className={`${styles.list_header__Day} ${styles.list_header_item}`}
                         style={{flexBasis: `${tableColumnWidths.get("date")!.toString()}px`}}>
                        Tanggal
                        <button
                            type="button"
                            onClick={() => handleSortClick("date")}
                            aria-label="sort by date"
                            style={sortBy.option !== "date" ? {opacity: 0} : undefined}>
                            {svgChevronUpDown}
                        </button>
                        <div className={styles.resize_handle}></div>
                    </div>
                    <div className={`${styles.list_header__Major} ${styles.list_header_item}`}
                         style={{flexBasis: `${tableColumnWidths.get("major")!.toString()}px`}}>
                        Jurusan
                        <button
                            type="button"
                            onClick={() => handleSortClick("major")}
                            aria-label="sort by major"
                            style={sortBy.option !== "major" ? {opacity: 0} : undefined}>
                            {svgChevronUpDown}
                        </button>
                        <div className={styles.resize_handle}></div>
                    </div>
                    <div className={`${styles.list_header__Year} ${styles.list_header_item}`}
                         style={{flexBasis: `${tableColumnWidths.get("year")!.toString()}px`}}>
                        Semester
                        <button
                            type="button"
                            onClick={() => handleSortClick("year")}
                            aria-label="sort by year"
                            style={sortBy.option !== "year" ? {opacity: 0} : undefined}>
                            {svgChevronUpDown}
                        </button>
                        <div className={styles.resize_handle}></div>
                    </div>
                    <div className={`${styles.list_header__Time} ${styles.list_header_item}`}
                         style={{flexBasis: `${tableColumnWidths.get("time")!.toString()}px`}}>
                        Jam
                        <div className={styles.resize_handle}></div>
                    </div>
                    <div className={`${styles.list_header__Person} ${styles.list_header_item}`}
                         style={{flexBasis: `${tableColumnWidths.get("person")!.toString()}px`}}>
                        Pengajar
                        <div className={styles.resize_handle}></div>
                    </div>
                    <div className={`${styles.list_header__Link} ${styles.list_header_item}`}
                         style={{flexBasis: `${tableColumnWidths.get("link")!.toString()}px`}}>
                        Link
                    </div>
                </div>
                <ul className={styles.list}>
                    {sorted_list.map((item, i) => (
                        <li key={i} className={styles.list_item}>
                            <div className={styles.list__Name}
                                 style={{flexBasis: `${tableColumnWidths.get("name")!.toString()}px`}}>
                                {item.name}
                            </div>
                            <div className={styles.list__Day}
                                 style={{flexBasis: `${tableColumnWidths.get("date")!.toString()}px`}}>
                                <p>{item.date.toLocaleDateString("id-ID", {day: "2-digit", month: "long"})}</p>
                                <p>{item.date.toLocaleDateString("id-ID", {weekday: "long"})}</p>
                            </div>
                            <div className={styles.list__Major}
                                 style={{flexBasis: `${tableColumnWidths.get("major")!.toString()}px`}}>
                                {item.major.map(item => (
                                    <div className={styles.item__internal_member}>{item}</div>
                                ))}
                            </div>
                            <div className={styles.list__Year}
                                 style={{flexBasis: `${tableColumnWidths.get("year")!.toString()}px`}}>
                                {item.year.sort((a, b) => a - b).map((year, i) => (
                                    i === item.year.length - 1 ? `${convertToTerm(year)}` : `${convertToTerm(year)}, `
                                ))}
                            </div>
                            <div className={styles.list__Time}
                                 style={{flexBasis: `${tableColumnWidths.get("time")!.toString()}px`}}>
                                {item.date.toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                })}
                            </div>
                            <div className={styles.list__Person}
                                 style={{flexBasis: `${tableColumnWidths.get("person")!.toString()}px`}}>
                                {item.person.map((person) => (
                                    <div className={styles.item__internal_member}>{person.name}</div>
                                ))}
                            </div>
                            <div className={styles.list__Link}>
                                {item.recordingsLink
                                    ? (<a href={item.recordingsLink} target="_blank"
                                          className={`${styles.content__link} ${styles.link__Recordings}`}>
                                        <p className={`large-icon-wrapper`}>
                                            Video
                                            <svg className="svg-icon">
                                                <use href="#youtube-logo"/>
                                            </svg>
                                        </p>
                                    </a>)
                                    : item.zoomMeetingsLink
                                        ? (<a href={item.zoomMeetingsLink} target="_blank"
                                              className={`${styles.content__link} ${styles.link__Zoom_meetings}`}>
                                            <p className={`large-icon-wrapper`}>
                                                Zoom
                                                <svg className="svg-icon">
                                                    <use href="#video-camera"/>
                                                </svg>
                                            </p>
                                        </a>)
                                        : (<div aria-disabled={true} className={styles.link__No_link}>—</div>)
                                }
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    )
}
