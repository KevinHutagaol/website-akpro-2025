import parseCsv from "./parseCsv"

const JADWAL_ASISTENSI_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRuw6QZ15goDsjqT9gnnuppvi_1G2-4Phl18-aBzv-eiyiMpIsLZB3nFoTUKAi9KJNH8Xa3dd-bPyIh/pub?gid=0&single=true&output=csv"

interface AsistensiScheduleData {
    id: string;
    name: string;
    person: string;
    date: Date;
}

function parseAsistensiScheduleCsv(data: string): Array<AsistensiScheduleData> {
    const csvParsed: Array<Array<string>> = parseCsv(data);

    let outputArr: Array<AsistensiScheduleData> = [];

    const starting_row = 3; // 4 - 1
    const starting_col = 1; // 2 - 1

    for (let i = starting_row; i < csvParsed.length - 3; i += 3) {
        for (let j = starting_col; j < csvParsed[0].length; j++) {
            if (csvParsed[i][j] != "") {
                const [day, month, year] = csvParsed[2][j].split('-').map(d => parseInt(d));
                const [hour, minute] = csvParsed[i + 2][j].split(':').map(d => parseInt(d));
                outputArr.push({
                    id: `${csvParsed[i][j]}_${csvParsed[i + 1][j]}`.replace(/\s/g, '_'),
                    name: csvParsed[i][j],
                    person: csvParsed[i + 1][j],
                    date: new Date(year, month, day, hour, minute),
                });
            }
        }
    }
    return outputArr;
}

export default async function fetchAsistensiScheduleData(): Promise<Array<AsistensiScheduleData>> {
    const response = await fetch(JADWAL_ASISTENSI_URL);
    const data = await response.text();
    return parseAsistensiScheduleCsv(data);
}

// console.log(await fetchAsistensiScheduleData());

