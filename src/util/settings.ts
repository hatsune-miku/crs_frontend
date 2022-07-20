export default class Settings {
    static getStoredColorScheme(): string {
        return localStorage.getItem("colorScheme") || "dark";
    }

    static setStoredColorScheme(colorScheme: string): void {
        localStorage.setItem("colorScheme", colorScheme);
    }
}
