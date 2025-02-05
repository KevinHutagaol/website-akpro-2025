import { useState, useEffect } from "react";
import styles from "/src/styles/DiktatAsistensiList.module.css"
import "/src/styles/global.css"

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
    },
    removeMeetingsLink: boolean,
}

export default function DiktatAsistensiList(props: Props) {
    const convertToTerm = (year: number):number => props.data.ganjil_genap === 'genap' ?  2 * year : 2 * year - 1

    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedMajor, setSelectedMajor] = useState<("elektro" | "komputer" | "biomedik") | "">("");

    useEffect(() => {
        setSelectedYear("");
        setSelectedMajor("");
    }, []);

    const cardsFiltered = props.data.content
        .filter(d => {
            const sameYear = selectedYear ? d.year.includes(Number(selectedYear)) : true;
            const sameMajor = selectedMajor ? d.major.includes(selectedMajor) : true;
            return sameYear && sameMajor;
        })
        .map((content, index) => {
            return (
                <article className={styles.diktatAsistensiList__card} key={index}>
                    <div>
                        <h4>{content.name}</h4>
                        <p className={styles.diktatAsistensiList__details}>
                            {content.major.map(major => `Teknik ${major}`).join(", ")}
                        </p>
                        <p className={styles.diktatAsistensiList__details}>
                            {content.year.map(y => `Term ${convertToTerm(y)}`).join(", ")}
                        </p>
                    </div


                    >
                    <img className={`${styles.diktatAsistensiList__img} img-skeleton`}
                         src={content.img}
                         loading="lazy"
                         alt={`Cover Diktat ${content.name}, ${content.major.join(", ")} ${content.year.map(y => `Term ${convertToTerm(y)}`).join(", ")}`}
                    />
                    <div className={styles.diktatAsistensiList__btnContainer}>
                        <a href={content.googleDriveLink} className={styles.diktatAsistensiList__btn}>
                            <i className="material-symbols-rounded">picture_as_pdf</i> PDF
                        </a>
                        {props.removeMeetingsLink ? null : (
                            <a href={content.zoomMeetingsLink}
                               className={styles.diktatAsistensiList__btn}>
                                <i className="material-symbols-rounded">videocam</i>Zoom</a>
                        )

                        }
                    </div>
                </article>
            )
        })

    return (
        <section className={styles.diktatAsistensiList}>
            <div>
                <h2 className={`${styles.diktatAsistensiList__h2} ${styles.capitalize}`}>
                    {props.data.uts_uas.toUpperCase()} {props.data.ganjil_genap} {props.data.year}
                </h2>
                <label htmlFor="year-option" className="visually-hidden">Pilih Tahun</label>
                <select
                    className={styles.diktatAsistensiList__select}
                    name="year-option"
                    id="year-option"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                >
                    <option value="" disabled>Semester</option>
                    <option value="1">Semester {convertToTerm(1)}</option>
                    <option value="2">Semester {convertToTerm(2)}</option>
                </select>
                <label htmlFor="major-option" className="visually-hidden">Pilih Angkatan</label>
                <select
                    className={styles.diktatAsistensiList__select}
                    name="major-option"
                    id="major-option"
                    value={selectedMajor}
                    onChange={(e) => setSelectedMajor(e.target.value as (("elektro" | "komputer" | "biomedik") | ""))}
                >
                    <option value="" disabled>Jurusan</option>
                    <option value="elektro">Teknik Elektro</option>
                    <option value="komputer">Teknik Komputer</option>
                    <option value="biomedik">Teknik Biomedik</option>
                </select>
            </div>
            {cardsFiltered.length > 0 ?
                <div className={styles.diktatAsistensiList__cards}>{cardsFiltered}</div>
                : <p className={styles.diktatAsistensiList__noResults}>No results found.</p>

            }
        </section>
    )
}

