import type {Dispatch, SetStateAction} from "react";
import "/src/styles/global.css"
import styles from "/src/styles/YearMajorSelector.module.css"

interface Props {
    selectedYear: number;
    setSelectedYear: Dispatch<SetStateAction<number>>;
    selectedMajor: ("elektro" | "komputer" | "biomedik") | "";
    setSelectedMajor: Dispatch<SetStateAction<("elektro" | "komputer" | "biomedik") | "">>;
    ganjil_genap: "ganjil" | "genap";
}

export default function YearMajorSelector(props: Props) {
    const convertToTerm = (year: number): number => props.ganjil_genap === 'genap' ? 2 * year : 2 * year - 1

    return (
        <>
            <label htmlFor="year-option" className="visually-hidden">Pilih Tahun</label>
            <select
                className={styles.select}
                name="year-option"
                id="year-option"
                value={props.selectedYear.toString()}
                onChange={(e) => props.setSelectedYear(parseInt(e.target.value))}
            >
                <option value="0">Semester</option>
                <option value="1">Semester {convertToTerm(1)}</option>
                <option value="2">Semester {convertToTerm(2)}</option>
            </select>
            <label htmlFor="major-option" className="visually-hidden">Pilih Angkatan</label>
            <select
                className={styles.select}
                name="major-option"
                id="major-option"
                value={props.selectedMajor}
                onChange={(e) => props.setSelectedMajor(e.target.value as (("elektro" | "komputer" | "biomedik") | ""))}
            >
                <option value="">Jurusan</option>
                <option value="elektro">Teknik Elektro</option>
                <option value="komputer">Teknik Komputer</option>
                <option value="biomedik">Teknik Biomedik</option>
            </select>
        </>
    )
}