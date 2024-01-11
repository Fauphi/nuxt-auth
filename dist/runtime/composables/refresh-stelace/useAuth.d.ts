import { Ref } from "vue";
import { useAuth as useLocalAuth } from "../refresh/useAuth";
declare const refresh: () => Promise<void>;
type UseAuthReturn = ReturnType<typeof useLocalAuth> & {
    refreshToken: Readonly<Ref<string | null>>;
    stelaceToken: Readonly<Ref<string | null>>;
    stelaceRefreshToken: Readonly<Ref<string | null>>;
    refresh: () => ReturnType<typeof refresh>;
    stelaceStatus: Readonly<Ref<string | null>>;
};
export declare const useAuth: () => UseAuthReturn;
export {};
