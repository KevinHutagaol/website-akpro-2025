import parseCsv from "./parseCsv";

const DATA_DIKTAT_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQT3zuplCOCJpIet9N6X6bbYBEdJ0uoLC-h5eVrylZcjUvCQS0pliMVAGdFhYGgiGp0RV2SQiK-1XqR/pub?gid=0&single=true&output=csv"

interface DiktatAsistensiData {
    id: string;
    year: number;
    uts_uas: "uts" | "uas";
    ganjil_genap: "ganjil" | "genap";
    content: Array<{
        name: string;
        year: number[];
        major: ("elektro" | "komputer" | "biomedik")[];
        img?: string;
        googleDriveLink: string;
        zoomMeetingsLink?: string;
    }>;
}

async function fetchAndParseContent(url: string): Promise<DiktatAsistensiData["content"]> {
    const response = await fetch(url);
    const data = await response.text();
    const csvParsed: Array<Array<string>> = parseCsv(data);

    let contentArr: DiktatAsistensiData["content"] = [];

    const STARTING_ROW = 1;

    const NAME_COL = 0;
    const MAJOR_COL = 1;
    const YEAR_COL = 2;
    const GOOGLE_DRIVE_LINK_COL = 3;
    const ZOOM_MEETINGS_LINK_COL = 4;
    const IMG_COL = 5;

    for (let row = STARTING_ROW; row < csvParsed.length; row++) {
        const currentRow = csvParsed[row];
        const major: Array<"elektro" | "komputer" | "biomedik"> = [];

        currentRow[MAJOR_COL].toLowerCase().split("").forEach(char => {
            if (char === "e") major.push("elektro");
            if (char === "t") major.push("komputer");
            if (char === "b") major.push("biomedik");
        })

        if (currentRow[NAME_COL]) {
            contentArr.push({
                name: currentRow[NAME_COL],
                year: [parseInt(currentRow[YEAR_COL])],
                major: major,
                googleDriveLink: currentRow[GOOGLE_DRIVE_LINK_COL],
                zoomMeetingsLink: currentRow[ZOOM_MEETINGS_LINK_COL] ? currentRow[ZOOM_MEETINGS_LINK_COL] : undefined
            })
        }
    }

    return contentArr;
}

async function parseDiktatAsistensiCsv(data: string): Promise<Array<DiktatAsistensiData>> {
    const csvParsed: Array<Array<string>> = parseCsv(data);

    let outputArr: Array<DiktatAsistensiData> = [];

    const STARTING_ROW = 1;

    const YEAR_COL = 1;
    const GANJIL_GENAP_COL = 2;
    const UTS_UAS_COL = 3;
    const CONTENT_CSV_COL = 9;


    for (let row = STARTING_ROW; row < csvParsed.length; row++) {
        const currentRow = csvParsed[row];
        const contentUrl = currentRow[CONTENT_CSV_COL];
        if (contentUrl) {
            outputArr.push({
                id: `Diktat_${currentRow[UTS_UAS_COL]}_${currentRow[GANJIL_GENAP_COL]}_${currentRow[YEAR_COL]}`,
                year: parseInt(currentRow[YEAR_COL]),
                uts_uas: currentRow[UTS_UAS_COL] as "uts" | "uas",
                ganjil_genap: currentRow[GANJIL_GENAP_COL] as "ganjil" | "genap",
                content: await fetchAndParseContent(contentUrl)
            })
        }
    }

    return outputArr;
}

export default async function fetchDiktatAsistensiData(): Promise<Array<DiktatAsistensiData>> {
    const response = await fetch(DATA_DIKTAT_URL);
    const data = await response.text();
    // console.log(parseCsv(data));
    return await parseDiktatAsistensiCsv(data);
}

// const test = await fetchDiktatAsistensiData();
// console.log(JSON.stringify(test, null, 2));