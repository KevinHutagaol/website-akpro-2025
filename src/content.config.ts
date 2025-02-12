import {defineCollection, z} from "astro:content";
// import {glob, file} from "astro/loaders";
import fetchAsistensiScheduleData from "./scripts/fetchAsistensiScheduleData.ts";
import fetchDiktatAsistensiData from "./scripts/fetchDiktatAsistensiData.ts";

const diktatAsistensiData = defineCollection({
    loader: fetchDiktatAsistensiData,
    schema: z.object({
        year: z.number(),
        uts_uas: z.enum(["uts", "uas"]),
        ganjil_genap: z.enum(["ganjil", "genap"]),
        content:
            z.array(
                z.object({
                    name: z.string(),
                    year: z.array(z.number()),
                    major: z.array(z.enum(["elektro", "komputer", "biomedik"])),
                    img: z.string().optional(),
                    googleDriveLink: z.string(),
                    zoomMeetingsLink: z.string().optional(),
                })
            )
    })
})

const jadwalAsisetnsiData = defineCollection({
    loader: fetchAsistensiScheduleData,
    schema: z.object({
        name: z.string(),
        person: z.string(),
        date: z.date()
    })
})

export const collections = {diktatAsistensiData, jadwalAsisetnsiData};