import { appDataDir } from "@tauri-apps/api/path";
import {
    mkdir,
    exists,
    BaseDirectory,
    readFile,
    writeFile,
} from "@tauri-apps/plugin-fs";
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
        if (!(await exists(await appDataDir()))) {
            console.info(
                "App directory does not exist. Creating directory:",
                await appDataDir()
            );
            await mkdir(await appDataDir());
        }
        console.debug("Saving music collection data to file:", collectionPath);
        console.debug("Data:", data.value);
        return writeFile(
            collectionPath,
            new TextEncoder().encode(JSON.stringify(data.value)),
            { baseDir: BaseDirectory.AppData, create: true }
        );
    }

    async function refresh(): Promise<MusicData[]> {
        let collectionData: string;
        try {
            const byteFile = await readFile(collectionPath, {
                baseDir: BaseDirectory.AppData,
            });
            collectionData = new TextDecoder().decode(byteFile);
        } catch (error: unknown) {
            // Probably just haven't saved any data yet
            console.warn("Could not read music collection file:", error);
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
