// 만들어진 파일 — lab-site/tools/export_content.py. 직접 고치지 않는다
/* eslint-disable */
export type Loader = () => Promise<{ default: any }>;
export const LOADERS: Record<string, Record<string, Loader>> = {
  d00: {
    base: () => import("./d00.js"),
    "unify": () => import("./d00_unify.js"),
    "longer": () => import("./d00_longer.js")
  },
  d01: {
    base: () => import("./d01.js"),
    "slower": () => import("./d01_slower.js"),
    "color": () => import("./d01_color.js")
  },
  d02: {
    base: () => import("./d02.js"),
    "slower": () => import("./d02_slower.js"),
    "nobar": () => import("./d02_nobar.js")
  },
  d03: {
    base: () => import("./d03.js"),
    "countslow": () => import("./d03_countslow.js"),
    "stagger": () => import("./d03_stagger.js")
  },
  d04: {
    base: () => import("./d04.js"),
    "half": () => import("./d04_half.js"),
    "slower": () => import("./d04_slower.js")
  },
  d05: {
    base: () => import("./d05.js"),
    "lighter": () => import("./d05_lighter.js"),
    "pad": () => import("./d05_pad.js")
  },
  d06: {
    base: () => import("./d06.js"),
    "deeper": () => import("./d06_deeper.js"),
    "haze": () => import("./d06_haze.js")
  },
  d07: {
    base: () => import("./d07.js"),
    "slower": () => import("./d07_slower.js"),
    "dim": () => import("./d07_dim.js")
  },
  d08: {
    base: () => import("./d08.js"),
    "softlight": () => import("./d08_softlight.js"),
    "slowsweep": () => import("./d08_slowsweep.js")
  },
  d09: {
    base: () => import("./d09.js"),
    "calm": () => import("./d09_calm.js"),
    "scrim": () => import("./d09_scrim.js")
  },
  d10: {
    base: () => import("./d10.js"),
    "slowsweep": () => import("./d10_slowsweep.js"),
    "decode": () => import("./d10_decode.js")
  },
};
