import parseCsv from "./parseCsv";

const SHEETS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQT3zuplCOCJpIet9N6X6bbYBEdJ0uoLC-h5eVrylZcjUvCQS0pliMVAGdFhYGgiGp0RV2SQiK-1XqR/pub?gid=0&single=true&output=csv"

interface Data {
    id: string;
    year: number;
    uts_uas: "uts" | "uas";
    ganjil_genap: "ganjil" | "genap";
    is_published: boolean;
}

interface DiktatContent {
    name: string;
    year: Array<number>;
    major: Array<"elektro" | "komputer" | "biomedik">;
    img?: string;
    googleDriveLink: string;
}

interface AsistensiContent {
    name: string;
    person: Array<{ name: string; year?: number; major?: string }>;
    date: Date;
    year: Array<number>;
    major: Array<"elektro" | "komputer" | "biomedik">;
    zoomMeetingsLink?: string;
    recordingsLink?: string;
}

interface DiktatData extends Data {
    content: Array<DiktatContent>;
}

interface AsistensiData extends Data {
    content: Array<AsistensiContent>;
}

const convertMajorCode = (str: string) => {
    if (str.toLowerCase().includes('e')) return "elektro";
    if (str.toLowerCase().includes('t')) return "komputer";
    if (str.toLowerCase().includes('b')) return "biomedik";
}

async function fetchAndParseDiktatContent(url: string): Promise<Array<DiktatContent>> {
    const response = await fetch(url);
    const data = await response.text();
    const csvParsed: Array<Array<string>> = parseCsv(data);

    let contentArr: Array<DiktatContent> = [];

    const STARTING_ROW = 1;

    const COL_NAME = 0;
    const COL_MAJOR = 1;
    const COL_YEAR = 2;
    const COL_GOOGLE_DRIVE_LINK = 3;
    const COL_IMG = 4;

    for (let row = STARTING_ROW; row < csvParsed.length; row++) {
        const currentRow = csvParsed[row];
        const major_arr: DiktatContent["major"] = [];
        const year_arr: DiktatContent["year"] = [];

        currentRow[COL_MAJOR].toLowerCase().split(",").forEach(str => {
            major_arr.push(convertMajorCode(str)!);
        })

        currentRow[COL_YEAR].toLowerCase().split(",").forEach(char => {
            if (char.includes("1")) year_arr.push(1);
            if (char.includes("2")) year_arr.push(2);
        })

        if (currentRow[COL_NAME]) {
            contentArr.push({
                name: currentRow[COL_NAME],
                year: year_arr,
                major: major_arr,
                googleDriveLink: currentRow[COL_GOOGLE_DRIVE_LINK],
                img: currentRow[COL_IMG] ? currentRow[COL_IMG] : undefined
            })
        }
    }

    return contentArr;
}

async function fetchAndParseAsistensiContent(url: string): Promise<Array<AsistensiContent>> {
    const response = await fetch(url);
    const data = await response.text();
    const csvParsed: Array<Array<string>> = parseCsv(data);
    // console.table(csvParsed);

    let outputArr: Array<AsistensiContent> = [];

    const STARTING_ROW = 3; // 4 - 1
    const STARTING_COL = 1; // 2 - 1

    const DATA_HEIGHT = 7;

    const ROW_DATE = 2;

    const RELATIVE_ROW_NAME = 0;
    const RELATIVE_ROW_MAJOR = 1;
    const RELATIVE_ROW_YEAR = 2;
    const RELATIVE_ROW_PERSON = 3;
    const RELATIVE_ROW_TIME = 4;
    const RELATIVE_ROW_ZOOM_LINK = 5;
    const RELATIVE_ROW_RECORDING = 6;

    for (let i = STARTING_ROW; i < csvParsed.length - DATA_HEIGHT; i += DATA_HEIGHT) {
        for (let j = STARTING_COL; j < csvParsed[0].length; j++) {
            if (csvParsed[i][j] != "") {
                let major_arr: AsistensiContent["major"] = [];
                let year_arr: AsistensiContent["year"] = [];
                let person_arr: AsistensiContent["person"] = [];

                csvParsed[i + RELATIVE_ROW_MAJOR][j].toLowerCase().split(",").forEach(str => {
                    major_arr.push(convertMajorCode(str)!);
                })

                csvParsed[i + RELATIVE_ROW_YEAR][j].toLowerCase().split(",").forEach(char => {
                    if (char.includes("1")) year_arr.push(1);
                    if (char.includes("2")) year_arr.push(2);
                })

                csvParsed[i + RELATIVE_ROW_PERSON][j].split(",").forEach(str => {
                    const regexp = /^\s*(.+?)\s*(?:-\s*|\s+)([A-Za-z]+)\s*(\d+)\s*$/g;
                    const matches = [...str.matchAll(regexp)];
                    if (!matches.length) {
                        console.error("Error parsing name: ", str);
                        person_arr.push({name: str.replace("\n", "")});
                    } else {
                        const [_, person_name, person_code, person_year] = matches[0];
                        const person_major = convertMajorCode(person_code)!;
                        person_arr.push({name: person_name, major: person_major, year: parseInt(person_year)});
                    }
                })
                const date_time = new Date(`${csvParsed[ROW_DATE][j]}T${csvParsed[i + RELATIVE_ROW_TIME][j]}:00`);
                if (!date_time) {
                    console.error("Datetime string invalid ", `${csvParsed[ROW_DATE][j]}T${csvParsed[i + RELATIVE_ROW_TIME][j]}:00`);
                }
                outputArr.push({
                    name: csvParsed[i + RELATIVE_ROW_NAME][j],
                    person: person_arr,
                    date: date_time,
                    year: year_arr,
                    major: major_arr,
                    zoomMeetingsLink: csvParsed[i + RELATIVE_ROW_ZOOM_LINK][j],
                    recordingsLink: csvParsed[i + RELATIVE_ROW_RECORDING][j],
                });
            }
        }
    }
    return outputArr;
}

async function parseDiktatAsistensiCsv(data: string): Promise<{
    diktatData: Array<DiktatData>;
    asistensiData: Array<AsistensiData>
}> {
    const csvParsed: Array<Array<string>> = parseCsv(data);

    let outputArrDiktat: Array<DiktatData> = [];
    let outputArrAsistensi: Array<AsistensiData> = [];

    const STARTING_ROW = 1;


    const COL_YEAR = 1;
    const COL_GANJIL_GENAP = 2;
    const COL_UTS_UAS = 3;
    const COL_DIKTAT_CONTENT_CSV = 9;
    const COL_ASISTENSI_CONTENT_CSV = 15;
    const COL_IS_PUBLISHED = 16;


    for (let row = STARTING_ROW; row < csvParsed.length; row++) {
        const currentRow = csvParsed[row];
        const contentUrlDiktat = currentRow[COL_DIKTAT_CONTENT_CSV];
        const contentUrlAsis = currentRow[COL_ASISTENSI_CONTENT_CSV];

        // console.log(contentUrlDiktat);
        // console.log(contentUrlAsis);

        if (contentUrlDiktat) {
            outputArrDiktat.push({
                id: `Diktat_${currentRow[COL_UTS_UAS]}_${currentRow[COL_GANJIL_GENAP]}_${currentRow[COL_YEAR]}`,
                year: parseInt(currentRow[COL_YEAR]),
                uts_uas: currentRow[COL_UTS_UAS] as "uts" | "uas",
                ganjil_genap: currentRow[COL_GANJIL_GENAP] as "ganjil" | "genap",
                is_published: (currentRow[COL_IS_PUBLISHED].toLowerCase() === 'true'),
                content: await fetchAndParseDiktatContent(contentUrlDiktat)
            })
        }

        if (contentUrlAsis) {
            outputArrAsistensi.push({
                id: `Asistensi_${currentRow[COL_UTS_UAS]}_${currentRow[COL_GANJIL_GENAP]}_${currentRow[COL_YEAR]}`,
                year: parseInt(currentRow[COL_YEAR]),
                uts_uas: currentRow[COL_UTS_UAS] as "uts" | "uas",
                ganjil_genap: currentRow[COL_GANJIL_GENAP] as "ganjil" | "genap",
                is_published: (currentRow[COL_IS_PUBLISHED].toLowerCase() === 'true'),
                content: await fetchAndParseAsistensiContent(contentUrlAsis)
            })
        }
    }

    return {diktatData: outputArrDiktat, asistensiData: outputArrAsistensi};
}


export async function fetchDiktatData(): Promise<Array<DiktatData>> {
    const response = await fetch(SHEETS_URL);
    const data = await response.text();
    // console.log(parseCsv(data));
    const {diktatData} = await parseDiktatAsistensiCsv(data);
    return diktatData;
}

export async function fetchAsistensiData(): Promise<Array<AsistensiData>> {
    const response = await fetch(SHEETS_URL);
    const data = await response.text();
    // console.log(parseCsv(data));
    const {asistensiData} = await parseDiktatAsistensiCsv(data);
    return asistensiData;
}

// const test1 = await fetchDiktatData();
// console.log(JSON.stringify(test1, null, 2));

// const test2 = await fetchAsistensiData();
// console.log(JSON.stringify(test2, null, 2))
// console.table(test2[0].content)

