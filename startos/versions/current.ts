import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.0.0:18',
  releaseNotes: {
    en_US: `- Manage Websites explains what each Source means.
- The NextExplorer Folder Location names NextExplorer's locations, the top-level folders it lists under Locations.`,
    es_ES: `- Administrar sitios web explica qué significa cada Fuente.
- La Ubicación de la carpeta de NextExplorer nombra las ubicaciones de NextExplorer, las carpetas de nivel superior que muestra en Ubicaciones.`,
    de_DE: `- Websites verwalten erklärt, was jede Quelle bedeutet.
- Der Ordnerpfad für NextExplorer nennt die Speicherorte von NextExplorer, die Ordner der obersten Ebene, die es unter Speicherorte auflistet.`,
    pl_PL: `- Zarządzaj stronami wyjaśnia, co oznacza każde Źródło.
- Lokalizacja folderu dla NextExplorer odnosi się do lokalizacji NextExplorer, czyli folderów najwyższego poziomu wymienionych w sekcji Lokalizacje.`,
    fr_FR: `- Gérer les sites web explique ce que signifie chaque Source.
- L’emplacement du dossier NextExplorer désigne les emplacements de NextExplorer, les dossiers de premier niveau qu’il liste sous Emplacements.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
