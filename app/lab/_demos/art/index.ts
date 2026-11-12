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
  d100: {
    base: () => import("./d100.js"),
    "label": () => import("./d100_label.js"),
    "fast": () => import("./d100_fast.js")
  },
  d11: {
    base: () => import("./d11.js"),
    "dense": () => import("./d11_dense.js"),
    "sway": () => import("./d11_sway.js")
  },
  d12: {
    base: () => import("./d12.js"),
    "tail": () => import("./d12_tail.js"),
    "gravity": () => import("./d12_gravity.js")
  },
  d13: {
    base: () => import("./d13.js"),
    "bokeh": () => import("./d13_bokeh.js"),
    "warm": () => import("./d13_warm.js")
  },
  d14: {
    base: () => import("./d14.js"),
    "flash": () => import("./d14_flash.js"),
    "straight": () => import("./d14_straight.js")
  },
  d15: {
    base: () => import("./d15.js"),
    "nodes": () => import("./d15_nodes.js"),
    "reach": () => import("./d15_reach.js")
  },
  d16: {
    base: () => import("./d16.js"),
    "split": () => import("./d16_split.js"),
    "longer": () => import("./d16_longer.js")
  },
  d17: {
    base: () => import("./d17.js"),
    "gap": () => import("./d17_gap.js"),
    "cam": () => import("./d17_cam.js")
  },
  d18: {
    base: () => import("./d18.js"),
    "rough": () => import("./d18_rough.js"),
    "key": () => import("./d18_key.js")
  },
  d19: {
    base: () => import("./d19.js"),
    "shallow": () => import("./d19_shallow.js"),
    "tilt": () => import("./d19_tilt.js")
  },
  d20: {
    base: () => import("./d20.js"),
    "disc": () => import("./d20_disc.js"),
    "near": () => import("./d20_near.js")
  },
  d21: {
    base: () => import("./d21.js"),
    "zoomend": () => import("./d21_zoomend.js"),
    "skyblue": () => import("./d21_skyblue.js")
  },
  d22: {
    base: () => import("./d22.js"),
    "gap": () => import("./d22_gap.js"),
    "contrast": () => import("./d22_contrast.js")
  },
  d23: {
    base: () => import("./d23.js"),
    "curve": () => import("./d23_curve.js"),
    "land": () => import("./d23_land.js")
  },
  d24: {
    base: () => import("./d24.js"),
    "axis": () => import("./d24_axis.js"),
    "faster": () => import("./d24_faster.js")
  },
  d25: {
    base: () => import("./d25.js"),
    "thick": () => import("./d25_thick.js"),
    "nozoom": () => import("./d25_nozoom.js")
  },
  d26: {
    base: () => import("./d26.js"),
    "big": () => import("./d26_big.js"),
    "blue": () => import("./d26_blue.js")
  },
  d27: {
    base: () => import("./d27.js"),
    "spread": () => import("./d27_spread.js"),
    "squash": () => import("./d27_squash.js")
  },
  d28: {
    base: () => import("./d28.js"),
    "bounce": () => import("./d28_bounce.js"),
    "squash": () => import("./d28_squash.js")
  },
  d29: {
    base: () => import("./d29.js"),
    "speed": () => import("./d29_speed.js"),
    "wave": () => import("./d29_wave.js")
  },
  d30: {
    base: () => import("./d30.js"),
    "melt": () => import("./d30_melt.js"),
    "heat": () => import("./d30_heat.js")
  },
  d31: {
    base: () => import("./d31.js"),
    "fast": () => import("./d31_fast.js"),
    "origin": () => import("./d31_origin.js")
  },
  d32: {
    base: () => import("./d32.js"),
    "color": () => import("./d32_color.js"),
    "press": () => import("./d32_press.js")
  },
  d33: {
    base: () => import("./d33.js"),
    "added": () => import("./d33_added.js"),
    "hl": () => import("./d33_hl.js")
  },
  d34: {
    base: () => import("./d34.js"),
    "narrow": () => import("./d34_narrow.js"),
    "blue": () => import("./d34_blue.js")
  },
  d35: {
    base: () => import("./d35.js"),
    "stagger": () => import("./d35_stagger.js"),
    "green": () => import("./d35_green.js")
  },
  d36: {
    base: () => import("./d36.js"),
    "half": () => import("./d36_half.js"),
    "scale": () => import("./d36_scale.js")
  },
  d37: {
    base: () => import("./d37.js"),
    "fill": () => import("./d37_fill.js"),
    "shine": () => import("./d37_shine.js")
  },
  d38: {
    base: () => import("./d38.js"),
    "slowlock": () => import("./d38_slowlock.js"),
    "bigpop": () => import("./d38_bigpop.js")
  },
  d39: {
    base: () => import("./d39.js"),
    "slowstop": () => import("./d39_slowstop.js"),
    "bigwindow": () => import("./d39_bigwindow.js")
  },
  d40: {
    base: () => import("./d40.js"),
    "slowdrop": () => import("./d40_slowdrop.js"),
    "deepextrude": () => import("./d40_deepextrude.js")
  },
  d41: {
    base: () => import("./d41.js"),
    "bigwave": () => import("./d41_bigwave.js"),
    "widespace": () => import("./d41_widespace.js")
  },
  d42: {
    base: () => import("./d42.js"),
    "longflicker": () => import("./d42_longflicker.js"),
    "greenneon": () => import("./d42_greenneon.js")
  },
  d43: {
    base: () => import("./d43.js"),
    "bigcircle": () => import("./d43_bigcircle.js"),
    "greenmarker": () => import("./d43_greenmarker.js")
  },
  d44: {
    base: () => import("./d44.js"),
    "fardolly": () => import("./d44_fardolly.js"),
    "slowdolly": () => import("./d44_slowdolly.js")
  },
  d45: {
    base: () => import("./d45.js"),
    "morefar": () => import("./d45_morefar.js"),
    "slowmove": () => import("./d45_slowmove.js")
  },
  d46: {
    base: () => import("./d46.js"),
    "morehand": () => import("./d46_morehand.js"),
    "bigimpact": () => import("./d46_bigimpact.js")
  },
  d47: {
    base: () => import("./d47.js"),
    "lights": () => import("./d47_lights.js"),
    "bokeh": () => import("./d47_bokeh.js")
  },
  d48: {
    base: () => import("./d48.js"),
    "zoom": () => import("./d48_zoom.js"),
    "tilt": () => import("./d48_tilt.js")
  },
  d49: {
    base: () => import("./d49.js"),
    "fog": () => import("./d49_fog.js"),
    "shake": () => import("./d49_shake.js")
  },
  d50: {
    base: () => import("./d50.js"),
    "golden": () => import("./d50_golden.js"),
    "teal": () => import("./d50_teal.js")
  },
  d51: {
    base: () => import("./d51.js"),
    "title": () => import("./d51_title.js"),
    "accent": () => import("./d51_accent.js")
  },
  d52: {
    base: () => import("./d52.js"),
    "clear": () => import("./d52_clear.js"),
    "frosted": () => import("./d52_frosted.js")
  },
  d53: {
    base: () => import("./d53.js"),
    "spin": () => import("./d53_spin.js"),
    "rim": () => import("./d53_rim.js")
  },
  d54: {
    base: () => import("./d54.js"),
    "stagger": () => import("./d54_stagger.js"),
    "elevate": () => import("./d54_elevate.js")
  },
  d55: {
    base: () => import("./d55.js"),
    "tilt": () => import("./d55_tilt.js"),
    "rainbow": () => import("./d55_rainbow.js")
  },
  d56: {
    base: () => import("./d56.js"),
    "showvideo": () => import("./d56_showvideo.js"),
    "quicker": () => import("./d56_quicker.js")
  },
  d57: {
    base: () => import("./d57.js"),
    "slowswap": () => import("./d57_slowswap.js"),
    "gap": () => import("./d57_gap.js")
  },
  d58: {
    base: () => import("./d58.js"),
    "mildslow": () => import("./d58_mildslow.js"),
    "turbo": () => import("./d58_turbo.js")
  },
  d59: {
    base: () => import("./d59.js"),
    "longj": () => import("./d59_longj.js"),
    "clipcolor": () => import("./d59_clipcolor.js")
  },
  d60: {
    base: () => import("./d60.js"),
    "slowcard": () => import("./d60_slowcard.js"),
    "darkerlogo": () => import("./d60_darkerlogo.js")
  },
  d61: {
    base: () => import("./d61.js"),
    "lowtol": () => import("./d61_lowtol.js"),
    "hardedge": () => import("./d61_hardedge.js")
  },
  d62: {
    base: () => import("./d62.js"),
    "fastq": () => import("./d62_fastq.js"),
    "num10": () => import("./d62_num10.js")
  },
  d63: {
    base: () => import("./d63.js"),
    "fastdraw": () => import("./d63_fastdraw.js"),
    "deepcrisis": () => import("./d63_deepcrisis.js")
  },
  d64: {
    base: () => import("./d64.js"),
    "darker": () => import("./d64_darker.js"),
    "bigbut": () => import("./d64_bigbut.js")
  },
  d65: {
    base: () => import("./d65.js"),
    "bigstar": () => import("./d65_bigstar.js"),
    "dusk": () => import("./d65_dusk.js")
  },
  d66: {
    base: () => import("./d66.js"),
    "close": () => import("./d66_close.js"),
    "think": () => import("./d66_think.js")
  },
  d67: {
    base: () => import("./d67.js"),
    "fastlist": () => import("./d67_fastlist.js"),
    "bigbtn": () => import("./d67_bigbtn.js")
  },
  d68: {
    base: () => import("./d68.js"),
    "tail": () => import("./d68_tail.js"),
    "sublong": () => import("./d68_sublong.js")
  },
  d69: {
    base: () => import("./d69.js"),
    "slowsweep": () => import("./d69_slowsweep.js"),
    "rtl": () => import("./d69_rtl.js")
  },
  d70: {
    base: () => import("./d70.js"),
    "slowtype": () => import("./d70_slowtype.js"),
    "wordpause": () => import("./d70_wordpause.js")
  },
  d71: {
    base: () => import("./d71.js"),
    "attack": () => import("./d71_attack.js"),
    "deepduck": () => import("./d71_deepduck.js")
  },
  d72: {
    base: () => import("./d72.js"),
    "darkpad": () => import("./d72_darkpad.js"),
    "basslate": () => import("./d72_basslate.js")
  },
  d73: {
    base: () => import("./d73.js"),
    "longroom": () => import("./d73_longroom.js"),
    "pluck": () => import("./d73_pluck.js")
  },
  d74: {
    base: () => import("./d74.js"),
    "slow": () => import("./d74_slow.js"),
    "trail": () => import("./d74_trail.js")
  },
  d75: {
    base: () => import("./d75.js"),
    "damp": () => import("./d75_damp.js"),
    "stiff": () => import("./d75_stiff.js")
  },
  d76: {
    base: () => import("./d76.js"),
    "wind": () => import("./d76_wind.js"),
    "over": () => import("./d76_over.js")
  },
  d77: {
    base: () => import("./d77.js"),
    "high": () => import("./d77_high.js"),
    "ease": () => import("./d77_ease.js")
  },
  d78: {
    base: () => import("./d78.js"),
    "wave": () => import("./d78_wave.js"),
    "green": () => import("./d78_green.js")
  },
  d79: {
    base: () => import("./d79.js"),
    "dist": () => import("./d79_dist.js"),
    "snappy": () => import("./d79_snappy.js")
  },
  d80: {
    base: () => import("./d80.js"),
    "ring": () => import("./d80_ring.js"),
    "third": () => import("./d80_third.js")
  },
  d81: {
    base: () => import("./d81.js"),
    "bigdot": () => import("./d81_bigdot.js"),
    "noise": () => import("./d81_noise.js")
  },
  d82: {
    base: () => import("./d82.js"),
    "slowwave": () => import("./d82_slowwave.js"),
    "teal": () => import("./d82_teal.js")
  },
  d83: {
    base: () => import("./d83.js"),
    "slowsort": () => import("./d83_slowsort.js"),
    "hero": () => import("./d83_hero.js")
  },
  d84: {
    base: () => import("./d84.js"),
    "slowstep": () => import("./d84_slowstep.js"),
    "wide": () => import("./d84_wide.js")
  },
  d85: {
    base: () => import("./d85.js"),
    "slowcount": () => import("./d85_slowcount.js"),
    "bignum": () => import("./d85_bignum.js")
  },
  d86: {
    base: () => import("./d86.js"),
    "slowwipe": () => import("./d86_slowwipe.js"),
    "stagger": () => import("./d86_stagger.js")
  },
  d87: {
    base: () => import("./d87.js"),
    "stay": () => import("./d87_stay.js"),
    "laterB": () => import("./d87_laterB.js")
  },
  d88: {
    base: () => import("./d88.js"),
    "slowlines": () => import("./d88_slowlines.js"),
    "bignum": () => import("./d88_bignum.js")
  },
  d89: {
    base: () => import("./d89.js"),
    "slowpen": () => import("./d89_slowpen.js"),
    "thick": () => import("./d89_thick.js")
  },
  d90: {
    base: () => import("./d90.js"),
    "slowflip": () => import("./d90_slowflip.js"),
    "slowspin": () => import("./d90_slowspin.js")
  },
  d91: {
    base: () => import("./d91.js"),
    "slowbars": () => import("./d91_slowbars.js"),
    "bignum": () => import("./d91_bignum.js")
  },
  d92: {
    base: () => import("./d92.js"),
    "short": () => import("./d92_short.js"),
    "white": () => import("./d92_white.js")
  },
  d93: {
    base: () => import("./d93.js"),
    "soft": () => import("./d93_soft.js"),
    "slide": () => import("./d93_slide.js")
  },
  d94: {
    base: () => import("./d94.js"),
    "slow": () => import("./d94_slow.js"),
    "stronger": () => import("./d94_stronger.js")
  },
  d95: {
    base: () => import("./d95.js"),
    "dreamy": () => import("./d95_dreamy.js"),
    "heavy": () => import("./d95_heavy.js")
  },
  d96: {
    base: () => import("./d96.js"),
    "blend": () => import("./d96_blend.js"),
    "still": () => import("./d96_still.js")
  },
  d97: {
    base: () => import("./d97.js"),
    "cool": () => import("./d97_cool.js"),
    "soft": () => import("./d97_soft.js")
  },
  d98: {
    base: () => import("./d98.js"),
    "even": () => import("./d98_even.js"),
    "pip": () => import("./d98_pip.js")
  },
  d99: {
    base: () => import("./d99.js"),
    "slow": () => import("./d99_slow.js"),
    "dissolve": () => import("./d99_dissolve.js")
  },
};
