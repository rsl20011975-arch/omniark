const windowsBase = "https://github.com/rsl20011975-arch/omnipdf-releases/releases/download/v0.6.2";
const macBase = "https://github.com/rsl20011975-arch/omnipdf-releases/releases/download/v0.6.0";

export const release = {
  version: "0.6.2",
  date: "2026-10-08",
  web: "/tools/omnipdf/app/index.html",
  windows: {
    file: `${windowsBase}/OmniPDF-Setup-0.6.2-x64.exe`,
    size: "139.48 MiB",
    bytes: 146257493,
    sha256: "AF9A98AF0FFC77FA80DC8730DA346636FD32CDF108B732D64774570E2DCB9365",
  },
  macArm: { version: "0.6.0", file: `${macBase}/OmniPDF-0.6.0-mac-arm64.dmg`, size: "150.66 MiB", sha256: "FF8003FAF125EF82323313777DCA6CB9FCC8B5ED8235D84D7511B06951F9B981" },
  macIntel: { version: "0.6.0", file: `${macBase}/OmniPDF-0.6.0-mac-x64.dmg`, size: "156.01 MiB", sha256: "F850DBF723D6AE5152C5A5F7B8F4FF98F73749983016B77D81120E48A5A42472" },
};
