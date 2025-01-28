interface DiktatAsistensiData {
    year: number,
    uts_uas: "uts" | "uas",
    ganjil_genap: "ganjil" | "genap",
    content: any
}

function isEntryLatest(acc: DiktatAsistensiData, cur: DiktatAsistensiData): boolean  {
    if (cur.year != acc.year) {
        return cur.year > acc.year;
    }
    if (cur.ganjil_genap != acc.ganjil_genap) {
        return cur.ganjil_genap === "ganjil";
    }
    if (cur.uts_uas != acc.uts_uas) {
        return cur.uts_uas === "uas";
    }
    return false;
}

export default isEntryLatest;