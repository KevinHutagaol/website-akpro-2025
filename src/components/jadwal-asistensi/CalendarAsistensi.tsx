import {useState, useEffect} from "react"
import "/src/styles/global.css"

interface Props {
    content: Array<{
        name: string;
        person: Array<{ name: string; year: number; major: string }>;
        date: Date;
    }>
    options: {
        year: number | null;
        major: "elektro" | "komputer" | "biomedik" | "";
    }
}

export default function CalendarAsistensi(props: Props) {

    return <p>CalendarAsistensi</p>
}