import { setupManifest } from "@start9labs/start-sdk/lib/manifest/setupManifest";

/**
 * In this function you define static properties of the service
 */
export const manifest = setupManifest({
  id: "embassy-pages",
  title: "Start9 Pages",
  version: "0.2.0",
  releaseNotes: "Updated to use StartOS 0.4.0 SDK APIs",
  license: "mit",
  replaces: Array<string>(
    "Github Pages",
    "Netlify",
    "Cloudfare Pages",
    "Firebase",
    "Amazon S3",
    "Zeit",
    "Forge",
  ),
  wrapperRepo: "https://github.com/Start9Labs/embassy-pages-wrapper",
  upstreamRepo: "https://github.com/Start9Labs/embassy-pages-wrapper",
  supportSite:
    "https://matrix.to/#/#s9-testing-embassy-pages:matrix.start9labs.com",
  marketingSite: "",
  donationUrl: "https://donate.start9.com/",
  description: {
    short: "Create Tor websites, hosted on your personal server.",
    long:
      "Start9 Pages is a simple web server that uses folders hosted on other internal services to serve Tor websites.",
  },
  assets: {
    license: "LICENSE",
    icon: "assets/icon.png",
    instructions: "assets/instructions.md",
  },
  volumes: {
    // This is the image where files from the project asset directory will go
    main: "data",
    mnt: "assets",
  },
  containers: {
    main: {
      // Identifier for the main image volume, which will be used when other actions need to mount to this volume.
      image: "main",
      // Specifies where to mount the data volume(s), if there are any. Mounts for pointer dependency volumes are also denoted here. These are necessary if data needs to be read from / written to these volumes.
      mounts: {
        // Specifies where on the service's file system its persistence directory should be mounted prior to service startup
        main: "/root",
        mnt: "/mnt",
      },
    },
  },
  alerts: {
    install: null,
    update: "This major release completely changes the configuration to utilize new OS functionality. Your previous configurations will be lost, but your website data will still exist. Please reconfigure your pages using the new options.",
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {
    filebrowser: {
      version: "^2.22.4",
      description: "Used to upload files to serve.",
      requirement: { type: "opt-out", how: "Enable in config" },
    },
    nextcloud: {
      version: "^25.0.2",
      description: "Used to upload files to serve.",
      requirement: { type: "opt-out", how: "Enable in config" },
    },
  },
});

export type Manifest = typeof manifest;
