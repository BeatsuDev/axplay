import { readFile, writeFile } from "@tauri-apps/plugin-fs";
import { ref } from "vue";

export type MusicFilePath = `${string}.${"mp3" | "wav" | "flac" | "ogg"}`;
export type MusicData = {
    filePath: MusicFilePath;
    title: string;
    artists?: string[];
    album?: string;
    duration: number;
    sampleRate: number;
};

export function useMusicCollection(collectionPath: `${string}.json`) {
    const data = ref<MusicData[]>([]);

    async function save(): Promise<void> {
        await writeFile(
            collectionPath,
            Buffer.from(JSON.stringify(data.value))
        );
    }

    async function refresh(): Promise<MusicData[]> {
        let collectionData: string;
        try {
            const byteFile = await readFile(collectionPath);
            collectionData = Buffer.from(byteFile).toString();
        } catch (error) {
            console.error(
                "Error loading file " +
                    collectionPath +
                    " when refreshing music data:",
                error
            );
            return [];
        }

        const data = JSON.parse(collectionData);
        if (validateMusicData(data)) return data;
        throw new Error(
            "Invalid music data:\n" + JSON.stringify(data, null, 2)
        );
    }

    refresh().then((newData) => (data.value = newData));

    return { data, save, refresh };
}

function validateMusicData(data: unknown): data is MusicData[] {
    if (!Array.isArray(data)) return false;
    for (const music of data) {
        if (typeof music !== "object") return false;
        if (typeof music.filePath !== "string") return false;
        if (typeof music.title !== "string") return false;
        if (typeof music.duration !== "number") return false;
        if (typeof music.sampleRate !== "number") return false;
        if (music.artists && !Array.isArray(music.artists)) return false;
        if (music.album && typeof music.album !== "string") return false;
    }
    return true;
}
