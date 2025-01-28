import {defineCollection, z} from "astro:content";

import {glob, file} from "astro/loaders";

const diktatAsistensiData = defineCollection({
    loader: glob({pattern: "*.json", base: "src/content/diktat-asistensi/"}),
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
                    includesMeetingLink: z.boolean(),
                    zoomMeetingsLink: z.string().optional(),
                })
            )
    })
})

export const collections = { diktatAsistensiData };