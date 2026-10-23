import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:20',
  releaseNotes: {
    en_US: `- A website can be a redirect: choose Redirect as its source in Manage Websites to send every visitor to its address on to another URL.
- Updates nginx to 1.30.6 with security fixes.`,
    es_ES: `- Un sitio web puede ser una redirección: elija Redirección como su fuente en Administrar sitios web para enviar a cada visitante de su dirección a otra URL.
- Actualiza nginx a 1.30.6 con correcciones de seguridad.`,
    de_DE: `- Eine Website kann eine Weiterleitung sein: Wählen Sie in „Websites verwalten“ Weiterleitung als Quelle, um jeden Besucher ihrer Adresse an eine andere URL weiterzuleiten.
- Aktualisiert nginx auf 1.30.6 mit Sicherheitskorrekturen.`,
    pl_PL: `- Strona może być przekierowaniem: wybierz Przekierowanie jako jej źródło w Zarządzaj stronami, aby kierować każdego odwiedzającego jej adres pod inny adres URL.
- Aktualizuje nginx do wersji 1.30.6 z poprawkami bezpieczeństwa.`,
    fr_FR: `- Un site web peut être une redirection : choisissez Redirection comme source dans Gérer les sites web pour envoyer chaque visiteur de son adresse vers une autre URL.
- Met à jour nginx vers 1.30.6 avec des correctifs de sécurité.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
