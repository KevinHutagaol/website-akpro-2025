import {useState, useEffect} from "react";
import styles from "../../styles/DiktatAsistensiList.module.css"
import "../../styles/global.css"
import {convertYear, currentLatestYear} from "../../scripts/yearUtils.ts";

const img_placeholders = Object.values(import.meta.glob("/src/assets/placeholder_img/*.svg", {eager: true}))

interface Props {
    data: {
        content: Array<{
            name: string;
            year: number[];
            major: ("elektro" | "komputer" | "biomedik")[];
            img?: string;
            googleDriveLink: string;
            includesMeetingLink: boolean;
            zoomMeetingsLink?: string;
        }>;
        year: number;
        uts_uas: "uts" | "uas";
        ganjil_genap: "ganjil" | "genap";
    };
}

export default function DiktatAsistensiList(props: Props) {
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedMajor, setSelectedMajor] = useState<("elektro" | "komputer" | "biomedik") | "">("");

    useEffect(() => {
        setSelectedYear("");
        setSelectedMajor("");
    }, []);

    return (
        <section className={styles.diktatAsistensiList}>
            <div>
                <h2>
                    {props.data.uts_uas.toUpperCase()} {props.data.ganjil_genap} {props.data.year}
                </h2>
                <select
                    className={styles.diktatAsistensiList__select}
                    name="year-option"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                >
                    <option value="" disabled>Angkatan</option>
                    <option value="1">{currentLatestYear}</option>
                    <option value="2">{currentLatestYear - 1}</option>
                </select>
                <select
                    className={styles.diktatAsistensiList__select}
                    name="major-option"
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value as (("elektro" | "komputer" | "biomedik") | ""))}
                >
                    <option value="" disabled>Jurusan</option>
                    <option value="elektro">Teknik Elektro</option>
                    <option value="komputer">Teknik Komputer</option>
                    <option value="biomedik">Teknik Biomedik</option>
                </select>
            </div>
            <div className={styles.diktatAsistensiList__cards}>
                {
                    props.data.content
                        .filter(d => {
                            const sameYear = selectedYear ? d.year.includes(Number(selectedYear)) : true;
                            const sameMajor = selectedMajor ? d.major.includes(selectedMajor) : true;
                            return sameYear && sameMajor;
                        })
                        .map((content, index) => {
                            return (
                                <article className="diktatAsistensiCard" key={index}>
                                    <div>
                                        <h3>{content.name}</h3>
                                        <p className={styles.capitalize}>
                                            {content.major.map(major => `Teknik ${major}`).join(", ")}, {content.year.map(y => convertYear(y)).join(", ")}
                                        </p>
                                    </div>
                                    <img className={`${styles.diktatAsistensiList__img} img-skeleton`}
                                         src={content.img}
                                         loading="lazy"
                                         alt={`Cover Diktat ${content.name}, ${content.major.join(", ")} ${content.year.map(y => convertYear(y)).join(", ")}`}
                                    />
                                    <div className={styles.diktatAsistensiList__btnContainer}>
                                        <a href={content.googleDriveLink} className={styles.diktatAsistensiList__btn}>
                                            <i className="material-symbols-rounded">picture_as_pdf</i> PDF
                                        </a>
                                        <a href={content.zoomMeetingsLink} className={styles.diktatAsistensiList__btn}>
                                            <i className="material-symbols-rounded">videocam</i> Zoom
                                        </a>
                                    </div>
                                </article>
                            )
                        })
                }
            </div>
        </section>
    )
}

