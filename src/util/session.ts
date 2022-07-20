import Network from "./network";

export default class Session {
    static getStoredSessionId(): string | null {
        return localStorage.getItem("sessionId");
    }

    static getStoredaccountNumber(): string | null {
        return localStorage.getItem("accountNumber");
    }

    static getStoredName(): string | null {
        return localStorage.getItem("name");
    }

    static getStoredRole(): string | null {
        return localStorage.getItem("role");
    }

    static setStoredSessionId(sessionId: string): void {
        localStorage.setItem("sessionId", sessionId);
    }

    static setStoredAccountNumber(accountNumber: string): void {
        localStorage.setItem("accountNumber", accountNumber);
    }

    static setStoredName(name: string): void {
        localStorage.setItem("name", name);
    }

    static setStoredRole(role: string): void {
        localStorage.setItem("role", role);
    }

    static clearStoredSessionId(): void {
        localStorage.removeItem("sessionId");
    }

    static clearStoredaccountNumber(): void {
        localStorage.removeItem("accountNumber");
    }

    static clearStoredName(): void {
        localStorage.removeItem("name");
    }

    static clearStoredRole(): void {
        localStorage.removeItem("role");
    }

    static async isCurrentSessionValid(): Promise<boolean> {
        const sessionId = Session.getStoredSessionId();
        if (sessionId === null) {
            return false;
        }
        const accountNumber = Session.getStoredaccountNumber();
        if (accountNumber === null) {
            return false;
        }
        const response = await Network.login({
            role: Session.getStoredRole() || "user",
            sessionId: sessionId,
            accountNumber: accountNumber,
            password: null,
        });
        return response.success;
    }
}
