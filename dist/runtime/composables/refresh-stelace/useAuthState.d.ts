import { ComputedRef } from "vue";
import { CookieRef } from "#app";
import { useAuthState as useRefreshAuthState } from "../refresh/useAuthState";
import { SessionStatus } from "../../types";
type UseAuthStateReturn = ReturnType<typeof useRefreshAuthState> & {
    rawStelaceToken: CookieRef<string | null>;
    stelaceToken: ComputedRef<string | null>;
    rawStelaceRefreshToken: ComputedRef<string | null>;
    stelaceRefreshToken: ComputedRef<string | null>;
    stelaceStatus: ComputedRef<SessionStatus>;
};
export declare const useAuthState: () => UseAuthStateReturn;
export default useAuthState;
