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
  d101: {
    base: () => import("./d101.js"),
    "half": () => import("./d101_half.js"),
    "slow": () => import("./d101_slow.js")
  },
  d102: {
    base: () => import("./d102.js"),
    "slow": () => import("./d102_slow.js"),
    "inout": () => import("./d102_inout.js")
  },
  d103: {
    base: () => import("./d103.js"),
    "longhold": () => import("./d103_longhold.js"),
    "twice": () => import("./d103_twice.js")
  },
  d104: {
    base: () => import("./d104.js"),
    "stronger": () => import("./d104_stronger.js"),
    "during": () => import("./d104_during.js")
  },
  d105: {
    base: () => import("./d105.js"),
    "wide": () => import("./d105_wide.js"),
    "long": () => import("./d105_long.js"),
    "tear": () => import("./d105_tear.js")
  },
  d106: {
    base: () => import("./d106.js"),
    "diamond": () => import("./d106_diamond.js"),
    "hard": () => import("./d106_hard.js")
  },
  d107: {
    base: () => import("./d107.js"),
    "close": () => import("./d107_close.js"),
    "right": () => import("./d107_right.js")
  },
  d108: {
    base: () => import("./d108.js"),
    "few": () => import("./d108_few.js"),
    "big": () => import("./d108_big.js")
  },
  d109: {
    base: () => import("./d109.js"),
    "blur": () => import("./d109_blur.js"),
    "flat": () => import("./d109_flat.js"),
    "slow": () => import("./d109_slow.js")
  },
  d11: {
    base: () => import("./d11.js"),
    "dense": () => import("./d11_dense.js"),
    "sway": () => import("./d11_sway.js")
  },
  d110: {
    base: () => import("./d110.js"),
    "fast": () => import("./d110_fast.js"),
    "center": () => import("./d110_center.js")
  },
  d111: {
    base: () => import("./d111.js"),
    "slower": () => import("./d111_slower.js"),
    "dark": () => import("./d111_dark.js")
  },
  d112: {
    base: () => import("./d112.js"),
    "fast": () => import("./d112_fast.js"),
    "even": () => import("./d112_even.js")
  },
  d113: {
    base: () => import("./d113.js"),
    "long": () => import("./d113_long.js"),
    "late": () => import("./d113_late.js")
  },
  d114: {
    base: () => import("./d114.js"),
    "more": () => import("./d114_more.js"),
    "fog": () => import("./d114_fog.js"),
    "long": () => import("./d114_long.js")
  },
  d115: {
    base: () => import("./d115.js"),
    "lock": () => import("./d115_lock.js"),
    "crop": () => import("./d115_crop.js")
  },
  d116: {
    base: () => import("./d116.js"),
    "longintro": () => import("./d116_longintro.js"),
    "longoutro": () => import("./d116_longoutro.js"),
    "gap": () => import("./d116_gap.js")
  },
  d117: {
    base: () => import("./d117.js"),
    "moremsg": () => import("./d117_moremsg.js"),
    "swing": () => import("./d117_swing.js"),
    "slow": () => import("./d117_slow.js")
  },
  d118: {
    base: () => import("./d118.js"),
    "short": () => import("./d118_short.js"),
    "nohold": () => import("./d118_nohold.js")
  },
  d119: {
    base: () => import("./d119.js"),
    "moreseeds": () => import("./d119_moreseeds.js"),
    "nohook": () => import("./d119_nohook.js")
  },
  d12: {
    base: () => import("./d12.js"),
    "tail": () => import("./d12_tail.js"),
    "gravity": () => import("./d12_gravity.js")
  },
  d120: {
    base: () => import("./d120.js"),
    "sensitive": () => import("./d120_sensitive.js"),
    "nocmp": () => import("./d120_nocmp.js")
  },
  d121: {
    base: () => import("./d121.js"),
    "ymin": () => import("./d121_ymin.js"),
    "nochild": () => import("./d121_nochild.js")
  },
  d122: {
    base: () => import("./d122.js"),
    "nolost": () => import("./d122_nolost.js"),
    "solid": () => import("./d122_solid.js"),
    "wider": () => import("./d122_wider.js")
  },
  d123: {
    base: () => import("./d123.js"),
    "later": () => import("./d123_later.js"),
    "weeks": () => import("./d123_weeks.js")
  },
  d124: {
    base: () => import("./d124.js"),
    "slow": () => import("./d124_slow.js"),
    "nobank": () => import("./d124_nobank.js")
  },
  d125: {
    base: () => import("./d125.js"),
    "steeper": () => import("./d125_steeper.js"),
    "gentler": () => import("./d125_gentler.js")
  },
  d126: {
    base: () => import("./d126.js"),
    "stronger": () => import("./d126_stronger.js"),
    "edge": () => import("./d126_edge.js"),
    "widemore": () => import("./d126_widemore.js")
  },
  d127: {
    base: () => import("./d127.js"),
    "bigger": () => import("./d127_bigger.js"),
    "late": () => import("./d127_late.js")
  },
  d128: {
    base: () => import("./d128.js"),
    "bigger": () => import("./d128_bigger.js"),
    "allbold": () => import("./d128_allbold.js")
  },
  d129: {
    base: () => import("./d129.js"),
    "looser": () => import("./d129_looser.js"),
    "justify": () => import("./d129_justify.js")
  },
  d13: {
    base: () => import("./d13.js"),
    "bokeh": () => import("./d13_bokeh.js"),
    "warm": () => import("./d13_warm.js")
  },
  d130: {
    base: () => import("./d130.js"),
    "murky": () => import("./d130_murky.js"),
    "toodim": () => import("./d130_toodim.js")
  },
  d131: {
    base: () => import("./d131.js"),
    "thick": () => import("./d131_thick.js"),
    "far": () => import("./d131_far.js")
  },
  d132: {
    base: () => import("./d132.js"),
    "manyslices": () => import("./d132_manyslices.js"),
    "higher": () => import("./d132_higher.js"),
    "slowstag": () => import("./d132_slowstag.js")
  },
  d133: {
    base: () => import("./d133.js"),
    "fast": () => import("./d133_fast.js"),
    "widegap": () => import("./d133_widegap.js")
  },
  d134: {
    base: () => import("./d134.js"),
    "far": () => import("./d134_far.js"),
    "tight": () => import("./d134_tight.js")
  },
  d135: {
    base: () => import("./d135.js"),
    "narrower": () => import("./d135_narrower.js"),
    "bigger": () => import("./d135_bigger.js"),
    "startnarrow": () => import("./d135_startnarrow.js")
  },
  d136: {
    base: () => import("./d136.js"),
    "bolder": () => import("./d136_bolder.js"),
    "bigger": () => import("./d136_bigger.js")
  },
  d137: {
    base: () => import("./d137.js"),
    "fill": () => import("./d137_fill.js"),
    "tilecolor": () => import("./d137_tilecolor.js")
  },
  d138: {
    base: () => import("./d138.js"),
    "slow": () => import("./d138_slow.js"),
    "center": () => import("./d138_center.js")
  },
  d139: {
    base: () => import("./d139.js"),
    "three": () => import("./d139_three.js"),
    "blue": () => import("./d139_blue.js"),
    "graybase": () => import("./d139_graybase.js")
  },
  d14: {
    base: () => import("./d14.js"),
    "flash": () => import("./d14_flash.js"),
    "straight": () => import("./d14_straight.js")
  },
  d140: {
    base: () => import("./d140.js"),
    "fewer": () => import("./d140_fewer.js"),
    "mono": () => import("./d140_mono.js"),
    "mixless": () => import("./d140_mixless.js")
  },
  d141: {
    base: () => import("./d141.js"),
    "mild": () => import("./d141_mild.js"),
    "orange": () => import("./d141_orange.js")
  },
  d142: {
    base: () => import("./d142.js"),
    "off": () => import("./d142_off.js"),
    "lag": () => import("./d142_lag.js")
  },
  d143: {
    base: () => import("./d143.js"),
    "stronger": () => import("./d143_stronger.js"),
    "darker": () => import("./d143_darker.js")
  },
  d144: {
    base: () => import("./d144.js"),
    "deeper": () => import("./d144_deeper.js"),
    "below": () => import("./d144_below.js"),
    "fullbar": () => import("./d144_fullbar.js")
  },
  d145: {
    base: () => import("./d145.js"),
    "slowdraw": () => import("./d145_slowdraw.js"),
    "wide": () => import("./d145_wide.js")
  },
  d146: {
    base: () => import("./d146.js"),
    "fast": () => import("./d146_fast.js"),
    "side": () => import("./d146_side.js")
  },
  d147: {
    base: () => import("./d147.js"),
    "strong": () => import("./d147_strong.js"),
    "wide": () => import("./d147_wide.js")
  },
  d148: {
    base: () => import("./d148.js"),
    "early": () => import("./d148_early.js"),
    "few": () => import("./d148_few.js")
  },
  d149: {
    base: () => import("./d149.js"),
    "lively": () => import("./d149_lively.js"),
    "jelly": () => import("./d149_jelly.js")
  },
  d15: {
    base: () => import("./d15.js"),
    "nodes": () => import("./d15_nodes.js"),
    "reach": () => import("./d15_reach.js")
  },
  d150: {
    base: () => import("./d150.js"),
    "slowpop": () => import("./d150_slowpop.js"),
    "thick": () => import("./d150_thick.js")
  },
  d151: {
    base: () => import("./d151.js"),
    "farther": () => import("./d151_farther.js"),
    "slowmove": () => import("./d151_slowmove.js")
  },
  d152: {
    base: () => import("./d152.js"),
    "fewpts": () => import("./d152_fewpts.js"),
    "slowmorph": () => import("./d152_slowmorph.js")
  },
  d153: {
    base: () => import("./d153.js"),
    "hard": () => import("./d153_hard.js"),
    "foamy": () => import("./d153_foamy.js")
  },
  d154: {
    base: () => import("./d154.js"),
    "softer": () => import("./d154_softer.js"),
    "wobbly": () => import("./d154_wobbly.js")
  },
  d155: {
    base: () => import("./d155.js"),
    "quick": () => import("./d155_quick.js"),
    "roll": () => import("./d155_roll.js")
  },
  d156: {
    base: () => import("./d156.js"),
    "stronger": () => import("./d156_stronger.js"),
    "finer": () => import("./d156_finer.js")
  },
  d157: {
    base: () => import("./d157.js"),
    "heavy": () => import("./d157_heavy.js"),
    "lingering": () => import("./d157_lingering.js"),
    "wide": () => import("./d157_wide.js")
  },
  d158: {
    base: () => import("./d158.js"),
    "denser": () => import("./d158_denser.js"),
    "biggerAura": () => import("./d158_biggerAura.js")
  },
  d159: {
    base: () => import("./d159.js"),
    "denser": () => import("./d159_denser.js"),
    "windy": () => import("./d159_windy.js"),
    "streak": () => import("./d159_streak.js")
  },
  d16: {
    base: () => import("./d16.js"),
    "split": () => import("./d16_split.js"),
    "longer": () => import("./d16_longer.js")
  },
  d160: {
    base: () => import("./d160.js"),
    "longtrail": () => import("./d160_longtrail.js"),
    "smalleddy": () => import("./d160_smalleddy.js"),
    "moredots": () => import("./d160_moredots.js")
  },
  d161: {
    base: () => import("./d161.js"),
    "widebluer": () => import("./d161_widebluer.js"),
    "tightecho": () => import("./d161_tightecho.js"),
    "longecho": () => import("./d161_longecho.js")
  },
  d162: {
    base: () => import("./d162.js"),
    "finewave": () => import("./d162_finewave.js"),
    "meltmore": () => import("./d162_meltmore.js")
  },
  d163: {
    base: () => import("./d163.js"),
    "stronger": () => import("./d163_stronger.js"),
    "rougher": () => import("./d163_rougher.js")
  },
  d164: {
    base: () => import("./d164.js"),
    "more": () => import("./d164_more.js"),
    "bigger": () => import("./d164_bigger.js")
  },
  d165: {
    base: () => import("./d165.js"),
    "halfcube": () => import("./d165_halfcube.js"),
    "spikier": () => import("./d165_spikier.js")
  },
  d166: {
    base: () => import("./d166.js"),
    "moon": () => import("./d166_moon.js"),
    "superball": () => import("./d166_superball.js"),
    "manyballs": () => import("./d166_manyballs.js")
  },
  d167: {
    base: () => import("./d167.js"),
    "topdown": () => import("./d167_topdown.js"),
    "tall": () => import("./d167_tall.js")
  },
  d168: {
    base: () => import("./d168.js"),
    "steep": () => import("./d168_steep.js"),
    "sparse": () => import("./d168_sparse.js"),
    "lowcam": () => import("./d168_lowcam.js")
  },
  d169: {
    base: () => import("./d169.js"),
    "tiltmore": () => import("./d169_tiltmore.js"),
    "fastspin": () => import("./d169_fastspin.js")
  },
  d17: {
    base: () => import("./d17.js"),
    "gap": () => import("./d17_gap.js"),
    "cam": () => import("./d17_cam.js")
  },
  d170: {
    base: () => import("./d170.js"),
    "thickbezel": () => import("./d170_thickbezel.js"),
    "stronggloss": () => import("./d170_stronggloss.js")
  },
  d171: {
    base: () => import("./d171.js"),
    "closecam": () => import("./d171_closecam.js"),
    "thickbody": () => import("./d171_thickbody.js"),
    "steeppitch": () => import("./d171_steeppitch.js")
  },
  d172: {
    base: () => import("./d172.js"),
    "slowtab": () => import("./d172_slowtab.js"),
    "slowswitch": () => import("./d172_slowswitch.js")
  },
  d173: {
    base: () => import("./d173.js"),
    "slowdebounce": () => import("./d173_slowdebounce.js"),
    "fewrows": () => import("./d173_fewrows.js"),
    "fasttype": () => import("./d173_fasttype.js")
  },
  d174: {
    base: () => import("./d174.js"),
    "biglift": () => import("./d174_biglift.js"),
    "slowsettle": () => import("./d174_slowsettle.js")
  },
  d175: {
    base: () => import("./d175.js"),
    "bigkeys": () => import("./d175_bigkeys.js"),
    "thickkeys": () => import("./d175_thickkeys.js")
  },
  d176: {
    base: () => import("./d176.js"),
    "shortswipe": () => import("./d176_shortswipe.js"),
    "bigzoom": () => import("./d176_bigzoom.js")
  },
  d177: {
    base: () => import("./d177.js"),
    "bigtext": () => import("./d177_bigtext.js"),
    "darker": () => import("./d177_darker.js"),
    "darkorange": () => import("./d177_darkorange.js")
  },
  d178: {
    base: () => import("./d178.js"),
    "newdata": () => import("./d178_newdata.js"),
    "thickring": () => import("./d178_thickring.js")
  },
  d179: {
    base: () => import("./d179.js"),
    "shorter": () => import("./d179_shorter.js"),
    "longtail": () => import("./d179_longtail.js"),
    "darkstart": () => import("./d179_darkstart.js")
  },
  d18: {
    base: () => import("./d18.js"),
    "rough": () => import("./d18_rough.js"),
    "key": () => import("./d18_key.js")
  },
  d180: {
    base: () => import("./d180.js"),
    "longslice": () => import("./d180_longslice.js"),
    "longgap": () => import("./d180_longgap.js")
  },
  d181: {
    base: () => import("./d181.js"),
    "longnote": () => import("./d181_longnote.js"),
    "brightfail": () => import("./d181_brightfail.js")
  },
  d182: {
    base: () => import("./d182.js"),
    "highpass300": () => import("./d182_highpass300.js"),
    "deepcut": () => import("./d182_deepcut.js")
  },
  d183: {
    base: () => import("./d183.js"),
    "slowattack": () => import("./d183_slowattack.js"),
    "lowthresh": () => import("./d183_lowthresh.js"),
    "slowrelease": () => import("./d183_slowrelease.js")
  },
  d184: {
    base: () => import("./d184.js"),
    "cropleft": () => import("./d184_cropleft.js"),
    "tall34": () => import("./d184_tall34.js")
  },
  d185: {
    base: () => import("./d185.js"),
    "lowcells": () => import("./d185_lowcells.js"),
    "cols32": () => import("./d185_cols32.js")
  },
  d186: {
    base: () => import("./d186.js"),
    "dotp3": () => import("./d186_dotp3.js"),
    "no2020": () => import("./d186_no2020.js")
  },
  d187: {
    base: () => import("./d187.js"),
    "shadow90": () => import("./d187_shadow90.js"),
    "night": () => import("./d187_night.js"),
    "glass80": () => import("./d187_glass80.js")
  },
  d188: {
    base: () => import("./d188.js"),
    "dist300": () => import("./d188_dist300.js"),
    "dur24": () => import("./d188_dur24.js")
  },
  d189: {
    base: () => import("./d189.js"),
    "handleout": () => import("./d189_handleout.js"),
    "clickearly": () => import("./d189_clickearly.js")
  },
  d19: {
    base: () => import("./d19.js"),
    "shallow": () => import("./d19_shallow.js"),
    "tilt": () => import("./d19_tilt.js")
  },
  d190: {
    base: () => import("./d190.js"),
    "dist300": () => import("./d190_dist300.js"),
    "dur24": () => import("./d190_dur24.js"),
    "delay10": () => import("./d190_delay10.js")
  },
  d191: {
    base: () => import("./d191.js"),
    "dist300": () => import("./d191_dist300.js"),
    "dur24": () => import("./d191_dur24.js"),
    "delay10": () => import("./d191_delay10.js")
  },
  d192: {
    base: () => import("./d192.js"),
    "end8": () => import("./d192_end8.js"),
    "handle80": () => import("./d192_handle80.js"),
    "dur32": () => import("./d192_dur32.js")
  },
  d193: {
    base: () => import("./d193.js"),
    "zoom4": () => import("./d193_zoom4.js"),
    "xf05": () => import("./d193_xf05.js"),
    "xfstart": () => import("./d193_xfstart.js")
  },
  d194: {
    base: () => import("./d194.js"),
    "more": () => import("./d194_more.js"),
    "short": () => import("./d194_short.js")
  },
  d195: {
    base: () => import("./d195.js"),
    "zend": () => import("./d195_zend.js"),
    "dur": () => import("./d195_dur.js"),
    "start": () => import("./d195_start.js")
  },
  d196: {
    base: () => import("./d196.js"),
    "five": () => import("./d196_five.js"),
    "thr": () => import("./d196_thr.js"),
    "shot": () => import("./d196_shot.js")
  },
  d197: {
    base: () => import("./d197.js"),
    "maxshot": () => import("./d197_maxshot.js"),
    "speed": () => import("./d197_speed.js"),
    "tight": () => import("./d197_tight.js")
  },
  d198: {
    base: () => import("./d198.js"),
    "gentler": () => import("./d198_gentler.js"),
    "sharper": () => import("./d198_sharper.js")
  },
  d199: {
    base: () => import("./d199.js"),
    "bright": () => import("./d199_bright.js"),
    "margin": () => import("./d199_margin.js"),
    "faster": () => import("./d199_faster.js")
  },
  d20: {
    base: () => import("./d20.js"),
    "disc": () => import("./d20_disc.js"),
    "near": () => import("./d20_near.js")
  },
  d200: {
    base: () => import("./d200.js"),
    "fewer": () => import("./d200_fewer.js"),
    "bigger": () => import("./d200_bigger.js")
  },
  d201: {
    base: () => import("./d201.js"),
    "punch": () => import("./d201_punch.js"),
    "dimmore": () => import("./d201_dimmore.js"),
    "slowin": () => import("./d201_slowin.js")
  },
  d202: {
    base: () => import("./d202.js"),
    "lead30": () => import("./d202_lead30.js"),
    "bigword": () => import("./d202_bigword.js"),
    "lineearly": () => import("./d202_lineearly.js")
  },
  d203: {
    base: () => import("./d203.js"),
    "deeper": () => import("./d203_deeper.js"),
    "slowstart": () => import("./d203_slowstart.js")
  },
  d204: {
    base: () => import("./d204.js"),
    "endzoom": () => import("./d204_endzoom.js"),
    "openbright": () => import("./d204_openbright.js")
  },
  d205: {
    base: () => import("./d205.js"),
    "quick": () => import("./d205_quick.js"),
    "calm": () => import("./d205_calm.js")
  },
  d206: {
    base: () => import("./d206.js"),
    "found": () => import("./d206_found.js"),
    "relabel": () => import("./d206_relabel.js")
  },
  d207: {
    base: () => import("./d207.js"),
    "zoomfar": () => import("./d207_zoomfar.js"),
    "deepsep": () => import("./d207_deepsep.js"),
    "cloudfar": () => import("./d207_cloudfar.js")
  },
  d208: {
    base: () => import("./d208.js"),
    "leadwide": () => import("./d208_leadwide.js"),
    "zoombig": () => import("./d208_zoombig.js")
  },
  d209: {
    base: () => import("./d209.js"),
    "wall60": () => import("./d209_wall60.js"),
    "slowtalk": () => import("./d209_slowtalk.js")
  },
  d21: {
    base: () => import("./d21.js"),
    "zoomend": () => import("./d21_zoomend.js"),
    "skyblue": () => import("./d21_skyblue.js")
  },
  d210: {
    base: () => import("./d210.js"),
    "bottom672": () => import("./d210_bottom672.js"),
    "top380": () => import("./d210_top380.js"),
    "right216": () => import("./d210_right216.js")
  },
  d211: {
    base: () => import("./d211.js"),
    "halves": () => import("./d211_halves.js"),
    "line45": () => import("./d211_line45.js"),
    "linear": () => import("./d211_linear.js")
  },
  d212: {
    base: () => import("./d212.js"),
    "toohigh": () => import("./d212_toohigh.js"),
    "longline": () => import("./d212_longline.js")
  },
  d213: {
    base: () => import("./d213.js"),
    "twowords": () => import("./d213_twowords.js"),
    "narrow": () => import("./d213_narrow.js"),
    "smaller": () => import("./d213_smaller.js")
  },
  d214: {
    base: () => import("./d214.js"),
    "calmrange": () => import("./d214_calmrange.js"),
    "shortnote": () => import("./d214_shortnote.js")
  },
  d215: {
    base: () => import("./d215.js"),
    "quietbed": () => import("./d215_quietbed.js"),
    "otherfactory": () => import("./d215_otherfactory.js"),
    "lowtarget": () => import("./d215_lowtarget.js")
  },
  d216: {
    base: () => import("./d216.js"),
    "stricter": () => import("./d216_stricter.js"),
    "tightfail": () => import("./d216_tightfail.js"),
    "onepick": () => import("./d216_onepick.js")
  },
  d217: {
    base: () => import("./d217.js"),
    "lowfloor": () => import("./d217_lowfloor.js"),
    "wideaxis": () => import("./d217_wideaxis.js")
  },
  d218: {
    base: () => import("./d218.js"),
    "fewer": () => import("./d218_fewer.js"),
    "krlimit": () => import("./d218_krlimit.js")
  },
  d219: {
    base: () => import("./d219.js"),
    "pickfirst": () => import("./d219_pickfirst.js"),
    "smalltitle": () => import("./d219_smalltitle.js"),
    "tinyimg": () => import("./d219_tinyimg.js")
  },
  d22: {
    base: () => import("./d22.js"),
    "gap": () => import("./d22_gap.js"),
    "contrast": () => import("./d22_contrast.js")
  },
  d220: {
    base: () => import("./d220.js"),
    "latestart": () => import("./d220_latestart.js"),
    "oneauthor": () => import("./d220_oneauthor.js")
  },
  d221: {
    base: () => import("./d221.js"),
    "smallbody": () => import("./d221_smallbody.js"),
    "bigtitle": () => import("./d221_bigtitle.js")
  },
  d222: {
    base: () => import("./d222.js"),
    "tight": () => import("./d222_tight.js"),
    "loose": () => import("./d222_loose.js")
  },
  d223: {
    base: () => import("./d223.js"),
    "fatround": () => import("./d223_fatround.js"),
    "deeper": () => import("./d223_deeper.js")
  },
  d224: {
    base: () => import("./d224.js"),
    "midwidth": () => import("./d224_midwidth.js"),
    "cardmin": () => import("./d224_cardmin.js")
  },
  d225: {
    base: () => import("./d225.js"),
    "loadend": () => import("./d225_loadend.js"),
    "filterempty": () => import("./d225_filterempty.js"),
    "rowheight": () => import("./d225_rowheight.js")
  },
  d226: {
    base: () => import("./d226.js"),
    "purplebg": () => import("./d226_purplebg.js"),
    "samebrand": () => import("./d226_samebrand.js")
  },
  d227: {
    base: () => import("./d227.js"),
    "h36": () => import("./d227_h36.js"),
    "pad40": () => import("./d227_pad40.js")
  },
  d228: {
    base: () => import("./d228.js"),
    "fade08": () => import("./d228_fade08.js"),
    "bg05": () => import("./d228_bg05.js")
  },
  d229: {
    base: () => import("./d229.js"),
    "brandcolor": () => import("./d229_brandcolor.js"),
    "main20": () => import("./d229_main20.js")
  },
  d23: {
    base: () => import("./d23.js"),
    "curve": () => import("./d23_curve.js"),
    "land": () => import("./d23_land.js")
  },
  d230: {
    base: () => import("./d230.js"),
    "roomy20": () => import("./d230_roomy20.js"),
    "accentgreen": () => import("./d230_accentgreen.js")
  },
  d231: {
    base: () => import("./d231.js"),
    "cardwide": () => import("./d231_cardwide.js"),
    "darkearly": () => import("./d231_darkearly.js")
  },
  d232: {
    base: () => import("./d232.js"),
    "sketch2": () => import("./d232_sketch2.js"),
    "notop": () => import("./d232_notop.js"),
    "diff30": () => import("./d232_diff30.js")
  },
  d233: {
    base: () => import("./d233.js"),
    "bin2": () => import("./d233_bin2.js"),
    "goal8": () => import("./d233_goal8.js")
  },
  d234: {
    base: () => import("./d234.js"),
    "q6": () => import("./d234_q6.js"),
    "qflat": () => import("./d234_qflat.js"),
    "flag45": () => import("./d234_flag45.js")
  },
  d235: {
    base: () => import("./d235.js"),
    "len20": () => import("./d235_len20.js"),
    "first5": () => import("./d235_first5.js")
  },
  d236: {
    base: () => import("./d236.js"),
    "longresult": () => import("./d236_longresult.js"),
    "longrace": () => import("./d236_longrace.js")
  },
  d237: {
    base: () => import("./d237.js"),
    "fastspeed": () => import("./d237_fastspeed.js"),
    "fiveminutes": () => import("./d237_fiveminutes.js")
  },
  d238: {
    base: () => import("./d238.js"),
    "runshort": () => import("./d238_runshort.js"),
    "sharecap": () => import("./d238_sharecap.js")
  },
  d239: {
    base: () => import("./d239.js"),
    "bigtv": () => import("./d239_bigtv.js"),
    "shelf150": () => import("./d239_shelf150.js"),
    "late": () => import("./d239_late.js")
  },
  d24: {
    base: () => import("./d24.js"),
    "axis": () => import("./d24_axis.js"),
    "faster": () => import("./d24_faster.js")
  },
  d240: {
    base: () => import("./d240.js"),
    "slowmove": () => import("./d240_slowmove.js"),
    "to85": () => import("./d240_to85.js")
  },
  d241: {
    base: () => import("./d241.js"),
    "bwins": () => import("./d241_bwins.js"),
    "smalltext": () => import("./d241_smalltext.js")
  },
  d242: {
    base: () => import("./d242.js"),
    "fold2": () => import("./d242_fold2.js"),
    "lastch": () => import("./d242_lastch.js"),
    "notest": () => import("./d242_notest.js")
  },
  d243: {
    base: () => import("./d243.js"),
    "latelong": () => import("./d243_latelong.js"),
    "slowconn": () => import("./d243_slowconn.js")
  },
  d244: {
    base: () => import("./d244.js"),
    "fewer": () => import("./d244_fewer.js"),
    "still15": () => import("./d244_still15.js"),
    "repmid": () => import("./d244_repmid.js")
  },
  d245: {
    base: () => import("./d245.js"),
    "wide": () => import("./d245_wide.js"),
    "cap20": () => import("./d245_cap20.js"),
    "short": () => import("./d245_short.js")
  },
  d246: {
    base: () => import("./d246.js"),
    "dusk": () => import("./d246_dusk.js"),
    "high": () => import("./d246_high.js")
  },
  d247: {
    base: () => import("./d247.js"),
    "k4": () => import("./d247_k4.js"),
    "feed": () => import("./d247_feed.js")
  },
  d248: {
    base: () => import("./d248.js"),
    "four": () => import("./d248_four.js"),
    "left": () => import("./d248_left.js"),
    "wide": () => import("./d248_wide.js")
  },
  d249: {
    base: () => import("./d249.js"),
    "timeout": () => import("./d249_timeout.js"),
    "free": () => import("./d249_free.js"),
    "skip": () => import("./d249_skip.js")
  },
  d25: {
    base: () => import("./d25.js"),
    "thick": () => import("./d25_thick.js"),
    "nozoom": () => import("./d25_nozoom.js")
  },
  d250: {
    base: () => import("./d250.js"),
    "navy": () => import("./d250_navy.js"),
    "narrow": () => import("./d250_narrow.js")
  },
  d251: {
    base: () => import("./d251.js"),
    "thick": () => import("./d251_thick.js"),
    "limit": () => import("./d251_limit.js"),
    "cols": () => import("./d251_cols.js")
  },
  d252: {
    base: () => import("./d252.js"),
    "flat": () => import("./d252_flat.js"),
    "stone": () => import("./d252_stone.js")
  },
  d253: {
    base: () => import("./d253.js"),
    "eight": () => import("./d253_eight.js"),
    "night": () => import("./d253_night.js"),
    "nodot": () => import("./d253_nodot.js")
  },
  d254: {
    base: () => import("./d254.js"),
    "more": () => import("./d254_more.js"),
    "fewer": () => import("./d254_fewer.js")
  },
  d255: {
    base: () => import("./d255.js"),
    "bigger": () => import("./d255_bigger.js"),
    "face": () => import("./d255_face.js"),
    "slow": () => import("./d255_slow.js")
  },
  d256: {
    base: () => import("./d256.js"),
    "strict": () => import("./d256_strict.js"),
    "twoRules": () => import("./d256_twoRules.js"),
    "judgeDown": () => import("./d256_judgeDown.js")
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
    "stronger": () => import("./d94_stronger.js"),
    "soft": () => import("./d94_soft.js")
  },
  d95: {
    base: () => import("./d95.js"),
    "dreamy": () => import("./d95_dreamy.js"),
    "heavy": () => import("./d95_heavy.js"),
    "zoom": () => import("./d95_zoom.js")
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
    "dissolve": () => import("./d99_dissolve.js"),
    "mono": () => import("./d99_mono.js")
  },
};
