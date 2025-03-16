import {useState, useEffect} from "react"
import "/src/styles/global.css"
import ListAsistensi from "./ListAsistensi.tsx";
import CalendarAsistensi from "./CalendarAsistensi.tsx";
import YearMajorSelector from "../YearMajorSelector.tsx";
import styles from "/src/styles/AsistensiSchedule.module.css";
import { YOUTUBE_URL } from "astro:env/client";

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
    const [viewMode, setViewMode] = useState<string>("calendar");

    useEffect(() => {
        setSelectedYear(0);
        setSelectedMajor("");
    }, []);

    if (!props.data.is_published) {
        return (
            <section className={styles.comingSoon}>
                <h2 className={`${styles.h2} ${styles.capitalize} `}>
                    Asistensi {props.data.uts_uas.toUpperCase()} {props.data.ganjil_genap} {props.data.year}
                </h2>
                <h3>Coming Soon</h3>
                <p>Check out rekaman asistensi sebelumnya <a href={YOUTUBE_URL}>disini</a></p>
            </section>
        )
    }

    return (
        <section>
            <div>
                <h2 className={`${styles.h2} ${styles.capitalize}`}>
                    Jadwal Asistensi {props.data.uts_uas.toUpperCase()} {props.data.ganjil_genap} {props.data.year}
                </h2>
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