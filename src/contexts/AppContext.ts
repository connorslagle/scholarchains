import { createContext } from "react";

export type Theme = "dark" | "light" | "system";

export interface AppConfig {
  /** Current theme */
  theme: Theme;
  /** Selected relay URL */
  relayUrl: string;
  /** Selected Blossom servers (comma-separated or array) */
  blossomServers?: string;
}

export interface AppContextType {
  /** Current application configuration */
  config: AppConfig;
  /** Update configuration using a callback that receives current config and returns new config */
  updateConfig: (updater: (currentConfig: Partial<AppConfig>) => Partial<AppConfig>) => void;
  /** Optional list of preset relays to display in the RelaySelector */
  presetRelays?: { name: string; url: string }[];
  /** Optional list of preset Blossom servers to display in the BlossomSelector */
  presetBlossomServers?: { name: string; url: string }[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
