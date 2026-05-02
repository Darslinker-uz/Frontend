// Super admin'ning assistantlari — kodda hardcoded ro'yxat.
// Yangi assistant qo'shish: ASSISTANTS dict'iga yozing va ruxsatlarni belgilang.
// Parol sha256 hash bilan saqlanadi (auth.ts bilan bir xil sxema).
//
// Hash hisoblash:
//   echo -n "parol" | shasum -a 256 | awk '{print $1}'

import { type Permissions, buildPermissions } from "./permissions";

interface AssistantConfig {
  name: string;
  passwordHash: string; // sha256
  permissions: Permissions;
}

export const ASSISTANTS: Record<string, AssistantConfig> = {
  // Abdulloh — listing manager (e'lon yaratish + boost so'rash)
  "+998958005999": {
    name: "Abdulloh",
    passwordHash: "43208054fc3e08dedf76a318df0178c93fc6b08d821737616e72926d9199d9d8",
    permissions: buildPermissions({
      listing: { view: true, create: true, edit: true },
      user: { view: true },
      boost: { request: true },
    }),
  },
};

export function getAssistant(phone: string): AssistantConfig | null {
  return ASSISTANTS[phone] ?? null;
}
