import type { Session } from 'next-auth';
import { CommonUseAuthStateReturn } from '../../types';
export type SessionData = Session;
interface UseAuthStateReturn extends CommonUseAuthStateReturn<SessionData> {
}
export declare const useAuthState: () => UseAuthStateReturn;
export default useAuthState;
