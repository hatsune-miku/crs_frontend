export default class Session {
    static getStoredSessionId(): string | null {
        return localStorage.getItem("sessionId");
    }

    static getStoredUserId(): string | null {
        return localStorage.getItem("userId");
    }

    static setStoredSessionId(sessionId: string): void {
        localStorage.setItem("sessionId", sessionId);
    }

    static setStoredUserId(userId: string): void {
        localStorage.setItem("userId", userId);
    }

    static clearStoredSessionId(): void {
        localStorage.removeItem("sessionId");
    }

    static clearStoredUserId(): void {
        localStorage.removeItem("userId");
    }
}
