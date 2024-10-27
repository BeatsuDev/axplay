import { ref, type Ref, watch } from "vue";
import { useMediaControls } from "@vueuse/core";

export function useReactiveSourceMedia(
    mediaElement: Parameters<typeof useMediaControls>[0],
    source: Ref<string | undefined>,
    options?: Parameters<typeof useMediaControls>[1]
) {
    let data = useMediaControls(mediaElement, {
        ...options,
        src: source.value,
    });

    const trulyReactive = ref(data);

    watch(source, (newSource) => {
        trulyReactive.value = useMediaControls(mediaElement, {
            ...options,
            src: newSource,
        });
    });

    return trulyReactive.value;
}
