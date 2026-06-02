import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:8',
  releaseNotes: {
    en_US: `**Features**

- Adds a per-website "Allow CORS" toggle (e.g. for Nostr NIP-05 verification).

**Internal**

- Bumps start-sdk to 1.5.2.`,
    es_ES: `**Funcionalidades**

- Añade un interruptor "Permitir CORS" por sitio web (p. ej. para la verificación Nostr NIP-05).

**Interno**

- Actualiza start-sdk a 1.5.2.`,
    de_DE: `**Funktionen**

- Fügt einen "CORS zulassen"-Schalter pro Website hinzu (z. B. für die Nostr NIP-05-Verifizierung).

**Intern**

- Aktualisiert start-sdk auf 1.5.2.`,
    pl_PL: `**Funkcje**

- Dodaje przełącznik "Zezwalaj na CORS" dla każdej strony (np. do weryfikacji Nostr NIP-05).

**Wewnętrzne**

- Aktualizuje start-sdk do 1.5.2.`,
    fr_FR: `**Fonctionnalités**

- Ajoute un interrupteur "Autoriser CORS" par site (par ex. pour la vérification Nostr NIP-05).

**Interne**

- Met à jour start-sdk vers 1.5.2.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
