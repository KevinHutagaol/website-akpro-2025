import {defineCollection, z} from "astro:content";
// import {glob, file} from "astro/loaders";
import { fetchDiktatData, fetchAsistensiData } from "./scripts/fetchDiktatAsistensiData.ts";

const diktatAsistensiData = defineCollection({
    loader: fetchDiktatData,
    schema: z.object({
        year: z.number(),
        uts_uas: z.enum(["uts", "uas"]),
        ganjil_genap: z.enum(["ganjil", "genap"]),
        is_published: z.boolean(),
        content:
            z.array(
                z.object({
                    name: z.string(),
                    year: z.array(z.number()),
                    major: z.array(z.enum(["elektro", "komputer", "biomedik"])),
                    img: z.string().optional(),
                    googleDriveLink: z.string(),
                })
            )
    })
})

const jadwalAsisetnsiData = defineCollection({
    loader: fetchAsistensiData,
    schema: z.object({
        year: z.number(),
        uts_uas: z.enum(["uts", "uas"]),
        ganjil_genap: z.enum(["ganjil", "genap"]),
        is_published: z.boolean(),
        content:
            z.array(
                z.object({
                    name: z.string(),
                    person: z.array(z.object({
                        name: z.string(),
                        year: z.number(),
                        major: z.enum(["elektro", "komputer", "biomedik"])
                    })),
                    date: z.date(),
                    year: z.array(z.number()),
                    major: z.array(z.enum(["elektro", "komputer", "biomedik"])),
                    zoomMeetingsLink: z.string().optional(),
                    recordingsLink: z.string().optional(),
                })
            )
    })
})

export const collections = {diktatAsistensiData, jadwalAsisetnsiData};