const windowsBase = "https://github.com/rsl20011975-arch/omnipdf-releases/releases/download/v0.8.1";
const macBase = "https://github.com/rsl20011975-arch/omnipdf-releases/releases/download/v0.8.0";

export const release = {
  version: "0.8.1",
  date: "2026-10-18",
  web: "/tools/omnipdf/app/index.html",
  windows: {
    file: `${windowsBase}/OmniPDF-Setup-0.8.1-x64.exe`,
    size: "163.68 MiB",
    bytes: 171627311,
    sha256: "49206633F3FAB49A6D024DA3E2C19574189621C6CCB7E69F23B0A556FACA033F",
  },
  macArm: { version: "0.8.0", file: `${macBase}/OmniPDF-0.8.0-mac-arm64.dmg`, size: "162.95 MiB", sha256: "9ab274523a53034afa17cabc8f4ccd230fb2521e2294485cbdede38050895060" },
  macIntel: { version: "0.8.0", file: `${macBase}/OmniPDF-0.8.0-mac-x64.dmg`, size: "168.34 MiB", sha256: "FC749019FD4EBD44634504BBCBDB3611E51AC0C0E6A8F5D2E55E2AE4AD479211" },
};
