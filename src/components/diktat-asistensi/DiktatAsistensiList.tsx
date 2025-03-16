import {useState, useEffect} from "react";
import styles from "/src/styles/DiktatAsistensiList.module.css"
import "/src/styles/global.css"
import YearMajorSelector from "../YearMajorSelector.tsx";

interface Props {
    data: {
        content: Array<{
            name: string;
            year: number[];
            major: ("elektro" | "komputer" | "biomedik")[];
            img?: string;
            googleDriveLink: string;
            zoomMeetingsLink?: string;
        }>;
        year: number;
        uts_uas: "uts" | "uas";
        ganjil_genap: "ganjil" | "genap";
        is_published: boolean;
    },
    removeMeetingsLink: boolean,
}

export default function DiktatAsistensiList(props: Props) {
    const convertToTerm = (year: number): number => props.data.ganjil_genap === 'genap' ? 2 * year : 2 * year - 1

    const [selectedYear, setSelectedYear] = useState<number>(0);
    const [selectedMajor, setSelectedMajor] = useState<("elektro" | "komputer" | "biomedik") | "">("");

    useEffect(() => {
        setSelectedYear(0);
        setSelectedMajor("");
    }, []);

    const cardsFiltered = props.data.content
        .filter(d => {
            const sameYear = selectedYear ? d.year.includes(selectedYear) : true;
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
                    </div>
                    <img className={`${styles.diktatAsistensiList__img} img-skeleton hide-text`}
                         src={content.img}
                         loading="lazy"
                         alt={`Cover Diktat ${content.name}, ${content.major.join(", ")} ${content.year.map(y => `Term ${convertToTerm(y)}`).join(", ")}`}
                    />
                    <div className={styles.diktatAsistensiList__btnContainer}>
                        <a href={content.googleDriveLink}
                           className={styles.diktatAsistensiList__btn}>
                            <svg className={`svg-icon ${styles.pdf_symbol}`}>
                                <use href="#picture-as-pdf"/>
                            </svg>
                            PDF
                        </a>
                    </div>
                </article>
            )
        })

    if (!props.data.is_published) {
        return (
            <section className={styles.comingSoon}>
                <h2 className={`${styles.diktatAsistensiList__h2} ${styles.capitalize} `}>
                    Diktat {props.data.uts_uas.toUpperCase()} {props.data.ganjil_genap} {props.data.year}
                </h2>
                <h3>Coming Soon</h3>
                <p>Check out diktat-diktat sebelumnya <a href="/diktat-asistensi/kumpulan-diktat">disini</a></p>
            </section>
        )
    }

    return (
        <section className={styles.diktatAsistensiList}>
            <div>
                <h2 className={`${styles.diktatAsistensiList__h2} ${styles.capitalize}`}>
                    Diktat {props.data.uts_uas.toUpperCase()} {props.data.ganjil_genap} {props.data.year}
                </h2>
                <div className={styles.diktatAsistensiList__select_container}>
                    <YearMajorSelector selectedYear={selectedYear} setSelectedYear={setSelectedYear}
                                       selectedMajor={selectedMajor} setSelectedMajor={setSelectedMajor}
                                       ganjil_genap={props.data.ganjil_genap}
                    />
                </div>
            </div>
            {cardsFiltered.length > 0 ?
                <div className={styles.diktatAsistensiList__cards}>{cardsFiltered}</div>
                : <h3 className={styles.noResults}>No results found</h3>

            }
        </section>
    )
}

