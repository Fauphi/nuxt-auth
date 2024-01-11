import { ComputedRef } from 'vue';
import type { CookieRef } from '#app';
import { CommonUseAuthStateReturn } from '../../types';
import type { SessionData } from '#auth';
interface UseAuthStateReturn extends CommonUseAuthStateReturn<SessionData> {
    token: ComputedRef<string | null>;
    rawToken: CookieRef<string | null>;
    setToken: (newToken: string | null) => void;
    clearToken: () => void;
}
export declare const useAuthState: () => UseAuthStateReturn;
export default useAuthState;
