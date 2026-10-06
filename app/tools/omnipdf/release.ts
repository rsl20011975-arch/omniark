const base = "https://github.com/rsl20011975-arch/omnipdf-releases/releases/download/v0.6.0";

export const release = {
  version: "0.6.0",
  date: "2026-10-06",
  web: "/tools/omnipdf/app/index.html",
  windows: {
    file: `${base}/OmniPDF-Setup-0.6.0-x64.exe`,
    size: "138.03 MiB",
    bytes: 144736664,
    sha256: "D6D7836AD8964D2A008195A54C7CFB0A527D84A3740B67FB1B53F091C6015450",
  },
  macArm: { file: `${base}/OmniPDF-0.6.0-mac-arm64.dmg`, size: "150.66 MiB", sha256: "FF8003FAF125EF82323313777DCA6CB9FCC8B5ED8235D84D7511B06951F9B981" },
  macIntel: { file: `${base}/OmniPDF-0.6.0-mac-x64.dmg`, size: "156.01 MiB", sha256: "F850DBF723D6AE5152C5A5F7B8F4FF98F73749983016B77D81120E48A5A42472" },
};
