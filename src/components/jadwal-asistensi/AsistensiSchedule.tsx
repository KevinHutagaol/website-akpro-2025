import {useState, useEffect} from "react"
import "/src/styles/global.css"
import ListAsistensi from "./ListAsistensi.tsx";
import CalendarAsistensi from "./CalendarAsistensi.tsx";
import YearMajorSelector from "../YearMajorSelector.tsx";
import styles from "/src/styles/AsistensiSchedule.module.css";
import {YOUTUBE_URL} from "astro:env/client";

interface Props {
    data: {
        year: number;
        uts_uas: "uts" | "uas";
        ganjil_genap: "ganjil" | "genap";
        is_published: boolean;
        content: Array<{
            name: string;
            person: Array<{ name: string; year: number; major: string }>;
            date: Date;
        }>;
    }
}

export default function AsistensiSchedule(props: Props) {
    const convertToTerm = (year: number): number => props.data.ganjil_genap === 'genap' ? 2 * year : 2 * year - 1

    const [selectedYear, setSelectedYear] = useState<number>(0);
    const [selectedMajor, setSelectedMajor] = useState<("elektro" | "komputer" | "biomedik") | "">("");
    const [viewMode, setViewMode] = useState<("calendar" | "list")>("calendar");

    useEffect(() => {
        setSelectedYear(0);
        setSelectedMajor("");
    }, []);

    // if (!props.data.is_published) {
    //     return (
    //         <section className={styles.comingSoon}>
    //             <h2 className={`${styles.h2} ${styles.capitalize} `}>
    //                 Asistensi {props.data.uts_uas.toUpperCase()} {props.data.ganjil_genap} {props.data.year}
    //             </h2>
    //             <h3>Coming Soon</h3>
    //             <p>Check out rekaman asistensi sebelumnya <a href={YOUTUBE_URL}>disini</a></p>
    //         </section>
    //     )
    // }

    return (
        <section>
            <div>
                <div className={styles.title_container}>
                    <h2 className={`${styles.h2} ${styles.capitalize}`}>
                        Jadwal Asistensi {props.data.uts_uas.toUpperCase()} {props.data.ganjil_genap} {props.data.year}
                    </h2>
                    <ul>
                        <li>
                            <label htmlFor="radio-image-1" className="visually-hidden">View As Calendar</label>
                            <label htmlFor="radio-image-1" className={styles.largeIconWrapper}>
                                <input type="radio"
                                       id="radio-image-1"
                                       name="view-type"
                                       checked={viewMode === "calendar"}
                                       value="calendar"
                                       onChange={(e) => {
                                           setViewMode("calendar")
                                       }}/>
                                <div className={styles.svgContainer}>
                                    <svg className="svg-icon">
                                        <use href="#calendar-days"/>
                                    </svg>
                                </div>
                            </label>
                        </li>
                        <li>
                            <label htmlFor="radio-image-2" className="visually-hidden">View As List</label>
                            <label htmlFor="radio-image-2" className={styles.largeIconWrapper}>
                                <input type="radio"
                                       id="radio-image-2"
                                       name="view-type"
                                       checked={viewMode === "list"}
                                       value="list"
                                       onChange={(e) => {
                                           setViewMode("list")
                                       }}/>
                                <div className={styles.svgContainer}>
                                    <svg className="svg-icon">
                                        <use href="#list-bullet"/>
                                    </svg>
                                </div>
                            </label>
                        </li>
                    </ul>
                </div>
                <div className={styles.select_container}>
                    <YearMajorSelector selectedYear={selectedYear} setSelectedYear={setSelectedYear}
                                       selectedMajor={selectedMajor} setSelectedMajor={setSelectedMajor}
                                       ganjil_genap={props.data.ganjil_genap}
                    />
                </div>
            </div>
            {viewMode === "calendar" ?
                <CalendarAsistensi content={props.data.content}
                                   options={{year: selectedYear, major: selectedMajor}}/>
                : <ListAsistensi content={props.data.content}
                                 options={{year: selectedYear, major: selectedMajor}}/>

            }
        </section>
    )
}