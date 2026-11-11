(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all4) => {
    for (var name2 in all4)
      __defProp(target, name2, { get: all4[name2], enumerable: true });
  };

  // node_modules/@tonaljs/pitch/dist/index.mjs
  function isNamedPitch(src) {
    return src !== null && typeof src === "object" && "name" in src && typeof src.name === "string" ? true : false;
  }
  function isPitch(pitch2) {
    return pitch2 !== null && typeof pitch2 === "object" && "step" in pitch2 && typeof pitch2.step === "number" && "alt" in pitch2 && typeof pitch2.alt === "number" && !isNaN(pitch2.step) && !isNaN(pitch2.alt) ? true : false;
  }
  var FIFTHS = [0, 2, 4, -1, 1, 3, 5];
  var STEPS_TO_OCTS = FIFTHS.map(
    (fifths) => Math.floor(fifths * 7 / 12)
  );
  function coordinates(pitch2) {
    const { step, alt, oct, dir = 1 } = pitch2;
    const f = FIFTHS[step] + 7 * alt;
    if (oct === void 0) {
      return [dir * f];
    }
    const o = oct - STEPS_TO_OCTS[step] - 4 * alt;
    return [dir * f, dir * o];
  }
  var FIFTHS_TO_STEPS = [3, 0, 4, 1, 5, 2, 6];
  function pitch(coord) {
    const [f, o, dir] = coord;
    const step = FIFTHS_TO_STEPS[unaltered(f)];
    const alt = Math.floor((f + 1) / 7);
    if (o === void 0) {
      return { step, alt, dir };
    }
    const oct = o + 4 * alt + STEPS_TO_OCTS[step];
    return { step, alt, oct, dir };
  }
  function unaltered(f) {
    const i = (f + 1) % 7;
    return i < 0 ? 7 + i : i;
  }

  // node_modules/@tonaljs/pitch-interval/dist/index.mjs
  var fillStr = (s, n) => Array(Math.abs(n) + 1).join(s);
  var NoInterval = Object.freeze({
    empty: true,
    name: "",
    num: NaN,
    q: "",
    type: "",
    step: NaN,
    alt: NaN,
    dir: NaN,
    simple: NaN,
    semitones: NaN,
    chroma: NaN,
    coord: [],
    oct: NaN
  });
  var INTERVAL_TONAL_REGEX = "([-+]?\\d+)(d{1,4}|m|M|P|A{1,4})";
  var INTERVAL_SHORTHAND_REGEX = "(AA|A|P|M|m|d|dd)([-+]?\\d+)";
  var REGEX = new RegExp(
    "^" + INTERVAL_TONAL_REGEX + "|" + INTERVAL_SHORTHAND_REGEX + "$"
  );
  function tokenizeInterval(str) {
    const m = REGEX.exec(`${str}`);
    if (m === null) {
      return ["", ""];
    }
    return m[1] ? [m[1], m[2]] : [m[4], m[3]];
  }
  var cache = {};
  function interval(src) {
    return typeof src === "string" ? cache[src] || (cache[src] = parse(src)) : isPitch(src) ? interval(pitchName(src)) : isNamedPitch(src) ? interval(src.name) : NoInterval;
  }
  var SIZES = [0, 2, 4, 5, 7, 9, 11];
  var TYPES = "PMMPPMM";
  function parse(str) {
    const tokens = tokenizeInterval(str);
    if (tokens[0] === "") {
      return NoInterval;
    }
    const num = +tokens[0];
    const q = tokens[1];
    const step = (Math.abs(num) - 1) % 7;
    const t = TYPES[step];
    if (t === "M" && q === "P") {
      return NoInterval;
    }
    const type = t === "M" ? "majorable" : "perfectable";
    const name2 = "" + num + q;
    const dir = num < 0 ? -1 : 1;
    const simple = num === 8 || num === -8 ? num : dir * (step + 1);
    const alt = qToAlt(type, q);
    const oct = Math.floor((Math.abs(num) - 1) / 7);
    const semitones = dir * (SIZES[step] + alt + 12 * oct);
    const chroma3 = (dir * (SIZES[step] + alt) % 12 + 12) % 12;
    const coord = coordinates({ step, alt, oct, dir });
    return {
      empty: false,
      name: name2,
      num,
      q,
      step,
      alt,
      dir,
      type,
      simple,
      semitones,
      chroma: chroma3,
      coord,
      oct
    };
  }
  function coordToInterval(coord, forceDescending) {
    const [f, o = 0] = coord;
    const isDescending = f * 7 + o * 12 < 0;
    const ivl = forceDescending || isDescending ? [-f, -o, -1] : [f, o, 1];
    return interval(pitch(ivl));
  }
  function qToAlt(type, q) {
    return q === "M" && type === "majorable" || q === "P" && type === "perfectable" ? 0 : q === "m" && type === "majorable" ? -1 : /^A+$/.test(q) ? q.length : /^d+$/.test(q) ? -1 * (type === "perfectable" ? q.length : q.length + 1) : 0;
  }
  function pitchName(props) {
    const { step, alt, oct = 0, dir } = props;
    if (!dir) {
      return "";
    }
    const calcNum = step + 1 + 7 * oct;
    const num = calcNum === 0 ? step + 1 : calcNum;
    const d = dir < 0 ? "-" : "";
    const type = TYPES[step] === "M" ? "majorable" : "perfectable";
    const name2 = d + num + altToQ(type, alt);
    return name2;
  }
  function altToQ(type, alt) {
    if (alt === 0) {
      return type === "majorable" ? "M" : "P";
    } else if (alt === -1 && type === "majorable") {
      return "m";
    } else if (alt > 0) {
      return fillStr("A", alt);
    } else {
      return fillStr("d", type === "perfectable" ? alt : alt + 1);
    }
  }

  // node_modules/@tonaljs/pitch-note/dist/index.mjs
  var fillStr2 = (s, n) => Array(Math.abs(n) + 1).join(s);
  var NoNote = Object.freeze({
    empty: true,
    name: "",
    letter: "",
    acc: "",
    pc: "",
    step: NaN,
    alt: NaN,
    chroma: NaN,
    height: NaN,
    coord: [],
    midi: null,
    freq: null
  });
  var cache2 = /* @__PURE__ */ new Map();
  var stepToLetter = (step) => "CDEFGAB".charAt(step);
  var altToAcc = (alt) => alt < 0 ? fillStr2("b", -alt) : fillStr2("#", alt);
  var accToAlt = (acc) => acc[0] === "b" ? -acc.length : acc.length;
  function note(src) {
    const stringSrc = JSON.stringify(src);
    const cached = cache2.get(stringSrc);
    if (cached) {
      return cached;
    }
    const value = typeof src === "string" ? parse2(src) : isPitch(src) ? note(pitchName2(src)) : isNamedPitch(src) ? note(src.name) : NoNote;
    cache2.set(stringSrc, value);
    return value;
  }
  var REGEX2 = /^([a-gA-G]?)(#{1,}|b{1,}|x{1,}|)(-?\d*)\s*(.*)$/;
  function tokenizeNote(str) {
    const m = REGEX2.exec(str);
    return m ? [m[1].toUpperCase(), m[2].replace(/x/g, "##"), m[3], m[4]] : ["", "", "", ""];
  }
  function coordToNote(noteCoord) {
    return note(pitch(noteCoord));
  }
  var mod = (n, m) => (n % m + m) % m;
  var SEMI = [0, 2, 4, 5, 7, 9, 11];
  function parse2(noteName) {
    const tokens = tokenizeNote(noteName);
    if (tokens[0] === "" || tokens[3] !== "") {
      return NoNote;
    }
    const letter = tokens[0];
    const acc = tokens[1];
    const octStr = tokens[2];
    const step = (letter.charCodeAt(0) + 3) % 7;
    const alt = accToAlt(acc);
    const oct = octStr.length ? +octStr : void 0;
    const coord = coordinates({ step, alt, oct });
    const name2 = letter + acc + octStr;
    const pc = letter + acc;
    const chroma3 = (SEMI[step] + alt + 120) % 12;
    const height = oct === void 0 ? mod(SEMI[step] + alt, 12) - 12 * 99 : SEMI[step] + alt + 12 * (oct + 1);
    const midi2 = height >= 0 && height <= 127 ? height : null;
    const freq2 = oct === void 0 ? null : Math.pow(2, (height - 69) / 12) * 440;
    return {
      empty: false,
      acc,
      alt,
      chroma: chroma3,
      coord,
      freq: freq2,
      height,
      letter,
      midi: midi2,
      name: name2,
      oct,
      pc,
      step
    };
  }
  function pitchName2(props) {
    const { step, alt, oct } = props;
    const letter = stepToLetter(step);
    if (!letter) {
      return "";
    }
    const pc = letter + altToAcc(alt);
    return oct || oct === 0 ? pc + oct : pc;
  }

  // node_modules/@tonaljs/pitch-distance/dist/index.mjs
  function transpose(noteName, intervalName) {
    const note2 = note(noteName);
    const intervalCoord = Array.isArray(intervalName) ? intervalName : interval(intervalName).coord;
    if (note2.empty || !intervalCoord || intervalCoord.length < 2) {
      return "";
    }
    const noteCoord = note2.coord;
    const tr2 = noteCoord.length === 1 ? [noteCoord[0] + intervalCoord[0]] : [noteCoord[0] + intervalCoord[0], noteCoord[1] + intervalCoord[1]];
    return coordToNote(tr2).name;
  }
  function tonicIntervalsTransposer(intervals, tonic) {
    const len = intervals.length;
    return (normalized) => {
      if (!tonic) return "";
      const index4 = normalized < 0 ? (len - -normalized % len) % len : normalized % len;
      const octaves = Math.floor(normalized / len);
      const root = transpose(tonic, [0, octaves]);
      return transpose(root, intervals[index4]);
    };
  }
  function distance(fromNote, toNote) {
    const from = note(fromNote);
    const to = note(toNote);
    if (from.empty || to.empty) {
      return "";
    }
    const fcoord = from.coord;
    const tcoord = to.coord;
    const fifths = tcoord[0] - fcoord[0];
    const octs = fcoord.length === 2 && tcoord.length === 2 ? tcoord[1] - fcoord[1] : -Math.floor(fifths * 7 / 12);
    const forceDescending = to.height === from.height && to.midi !== null && from.oct === to.oct && from.step > to.step;
    return coordToInterval([fifths, octs], forceDescending).name;
  }

  // node_modules/@tonaljs/chord/dist/index.mjs
  var dist_exports = {};
  __export(dist_exports, {
    chord: () => chord,
    chordScales: () => chordScales,
    default: () => index_default,
    degrees: () => degrees,
    detect: () => detect,
    extended: () => extended,
    get: () => get4,
    getChord: () => getChord,
    notes: () => notes,
    reduced: () => reduced,
    steps: () => steps,
    tokenize: () => tokenize,
    transpose: () => transpose2
  });

  // node_modules/@tonaljs/collection/dist/index.mjs
  function rotate(times, arr) {
    const len = arr.length;
    const n = (times % len + len) % len;
    return arr.slice(n, len).concat(arr.slice(0, n));
  }
  function compact(arr) {
    return arr.filter((n) => n === 0 || n);
  }

  // node_modules/@tonaljs/pcset/dist/index.mjs
  var EmptyPcset = {
    empty: true,
    name: "",
    setNum: 0,
    chroma: "000000000000",
    normalized: "000000000000",
    intervals: []
  };
  var setNumToChroma = (num2) => Number(num2).toString(2).padStart(12, "0");
  var chromaToNumber = (chroma22) => parseInt(chroma22, 2);
  var REGEX3 = /^[01]{12}$/;
  function isChroma(set) {
    return REGEX3.test(set);
  }
  var isPcsetNum = (set) => typeof set === "number" && set >= 0 && set <= 4095;
  var isPcset = (set) => set && isChroma(set.chroma);
  var cache3 = { [EmptyPcset.chroma]: EmptyPcset };
  function get(src) {
    const chroma22 = isChroma(src) ? src : isPcsetNum(src) ? setNumToChroma(src) : Array.isArray(src) ? listToChroma(src) : isPcset(src) ? src.chroma : EmptyPcset.chroma;
    return cache3[chroma22] = cache3[chroma22] || chromaToPcset(chroma22);
  }
  var IVLS = [
    "1P",
    "2m",
    "2M",
    "3m",
    "3M",
    "4P",
    "5d",
    "5P",
    "6m",
    "6M",
    "7m",
    "7M"
  ];
  function chromaToIntervals(chroma22) {
    const intervals2 = [];
    for (let i = 0; i < 12; i++) {
      if (chroma22.charAt(i) === "1") intervals2.push(IVLS[i]);
    }
    return intervals2;
  }
  function modes(set, normalize = true) {
    const pcs = get(set);
    const binary = pcs.chroma.split("");
    return compact(
      binary.map((_, i) => {
        const r = rotate(i, binary);
        return normalize && r[0] === "0" ? null : r.join("");
      })
    );
  }
  function isSubsetOf(set) {
    const s = get(set).setNum;
    return (notes2) => {
      const o = get(notes2).setNum;
      return s && s !== o && (o & s) === o;
    };
  }
  function isSupersetOf(set) {
    const s = get(set).setNum;
    return (notes2) => {
      const o = get(notes2).setNum;
      return s && s !== o && (o | s) === o;
    };
  }
  function chromaRotations(chroma22) {
    const binary = chroma22.split("");
    return binary.map((_, i) => rotate(i, binary).join(""));
  }
  function chromaToPcset(chroma22) {
    const setNum = chromaToNumber(chroma22);
    const normalizedNum = chromaRotations(chroma22).map(chromaToNumber).filter((n) => n >= 2048).sort()[0];
    const normalized = setNumToChroma(normalizedNum);
    const intervals2 = chromaToIntervals(chroma22);
    return {
      empty: false,
      name: "",
      setNum,
      chroma: chroma22,
      normalized,
      intervals: intervals2
    };
  }
  function listToChroma(set) {
    if (set.length === 0) {
      return EmptyPcset.chroma;
    }
    let pitch2;
    const binary = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < set.length; i++) {
      pitch2 = note(set[i]);
      if (pitch2.empty) pitch2 = interval(set[i]);
      if (!pitch2.empty) binary[pitch2.chroma] = 1;
    }
    return binary.join("");
  }

  // node_modules/@tonaljs/chord-type/dist/index.mjs
  var CHORDS = [
    // ==Major==
    ["1P 3M 5P", "major", "M ^  maj"],
    ["1P 3M 5P 7M", "major seventh", "maj7 \u0394 ma7 M7 Maj7 ^7"],
    ["1P 3M 5P 7M 9M", "major ninth", "maj9 \u03949 ^9"],
    ["1P 3M 5P 7M 9M 13M", "major thirteenth", "maj13 Maj13 ^13"],
    ["1P 3M 5P 6M", "sixth", "6 add6 add13 M6"],
    ["1P 3M 5P 6M 9M", "sixth added ninth", "6add9 6/9 69 M69"],
    ["1P 3M 6m 7M", "major seventh flat sixth", "M7b6 ^7b6"],
    [
      "1P 3M 5P 7M 11A",
      "major seventh sharp eleventh",
      "maj#4 \u0394#4 \u0394#11 M7#11 ^7#11 maj7#11"
    ],
    // ==Minor==
    // '''Normal'''
    ["1P 3m 5P", "minor", "m min -"],
    ["1P 3m 5P 7m", "minor seventh", "m7 min7 mi7 -7"],
    [
      "1P 3m 5P 7M",
      "minor/major seventh",
      "m/ma7 m/maj7 mM7 mMaj7 m/M7 -\u03947 m\u0394 -^7 -maj7"
    ],
    ["1P 3m 5P 6M", "minor sixth", "m6 -6"],
    ["1P 3m 5P 7m 9M", "minor ninth", "m9 -9"],
    ["1P 3m 5P 7M 9M", "minor/major ninth", "mM9 mMaj9 -^9"],
    ["1P 3m 5P 7m 9M 11P", "minor eleventh", "m11 -11"],
    ["1P 3m 5P 7m 9M 13M", "minor thirteenth", "m13 -13"],
    // '''Diminished'''
    ["1P 3m 5d", "diminished", "dim \xB0 o"],
    ["1P 3m 5d 7d", "diminished seventh", "dim7 \xB07 o7"],
    ["1P 3m 5d 7m", "half-diminished", "m7b5 \xF8 -7b5 h7 h"],
    // ==Dominant/Seventh==
    // '''Normal'''
    ["1P 3M 5P 7m", "dominant seventh", "7 dom"],
    ["1P 3M 5P 7m 9M", "dominant ninth", "9"],
    ["1P 3M 5P 7m 9M 13M", "dominant thirteenth", "13"],
    ["1P 3M 5P 7m 11A", "lydian dominant seventh", "7#11 7#4"],
    // '''Altered'''
    ["1P 3M 5P 7m 9m", "dominant flat ninth", "7b9"],
    ["1P 3M 5P 7m 9A", "dominant sharp ninth", "7#9"],
    ["1P 3M 7m 9m", "altered", "alt7"],
    // '''Suspended'''
    ["1P 4P 5P", "suspended fourth", "sus4 sus"],
    ["1P 2M 5P", "suspended second", "sus2"],
    ["1P 4P 5P 7m", "suspended fourth seventh", "7sus4 7sus"],
    ["1P 5P 7m 9M 11P", "eleventh", "11"],
    [
      "1P 4P 5P 7m 9m",
      "suspended fourth flat ninth",
      "b9sus phryg 7b9sus 7b9sus4"
    ],
    // ==Other==
    ["1P 5P", "fifth", "5"],
    ["1P 3M 5A", "augmented", "aug + +5 ^#5"],
    ["1P 3m 5A", "minor augmented", "m#5 -#5 m+"],
    ["1P 3M 5A 7M", "augmented seventh", "maj7#5 maj7+5 +maj7 ^7#5"],
    [
      "1P 3M 5P 7M 9M 11A",
      "major sharp eleventh (lydian)",
      "maj9#11 \u03949#11 ^9#11"
    ],
    // ==Legacy==
    ["1P 2M 4P 5P", "", "sus24 sus4add9"],
    ["1P 3M 5A 7M 9M", "", "maj9#5 Maj9#5"],
    ["1P 3M 5A 7m", "", "7#5 +7 7+ 7aug aug7"],
    ["1P 3M 5A 7m 9A", "", "7#5#9 7#9#5 7alt"],
    ["1P 3M 5A 7m 9M", "", "9#5 9+"],
    ["1P 3M 5A 7m 9M 11A", "", "9#5#11"],
    ["1P 3M 5A 7m 9m", "", "7#5b9 7b9#5"],
    ["1P 3M 5A 7m 9m 11A", "", "7#5b9#11"],
    ["1P 3M 5A 9A", "", "+add#9"],
    ["1P 3M 5A 9M", "", "M#5add9 +add9"],
    ["1P 3M 5P 6M 11A", "", "M6#11 M6b5 6#11 6b5"],
    ["1P 3M 5P 6M 7M 9M", "", "M7add13"],
    ["1P 3M 5P 6M 9M 11A", "", "69#11"],
    ["1P 3m 5P 6M 9M", "", "m69 -69"],
    ["1P 3M 5P 6m 7m", "", "7b6"],
    ["1P 3M 5P 7M 9A 11A", "", "maj7#9#11"],
    ["1P 3M 5P 7M 9M 11A 13M", "", "M13#11 maj13#11 M13+4 M13#4"],
    ["1P 3M 5P 7M 9m", "", "M7b9"],
    ["1P 3M 5P 7m 11A 13m", "", "7#11b13 7b5b13"],
    ["1P 3M 5P 7m 13M", "", "7add6 67 7add13"],
    ["1P 3M 5P 7m 9A 11A", "", "7#9#11 7b5#9 7#9b5"],
    ["1P 3M 5P 7m 9A 11A 13M", "", "13#9#11"],
    ["1P 3M 5P 7m 9A 11A 13m", "", "7#9#11b13"],
    ["1P 3M 5P 7m 9A 13M", "", "13#9"],
    ["1P 3M 5P 7m 9A 13m", "", "7#9b13"],
    ["1P 3M 5P 7m 9M 11A", "", "9#11 9+4 9#4"],
    ["1P 3M 5P 7m 9M 11A 13M", "", "13#11 13+4 13#4"],
    ["1P 3M 5P 7m 9M 11A 13m", "", "9#11b13 9b5b13"],
    ["1P 3M 5P 7m 9m 11A", "", "7b9#11 7b5b9 7b9b5"],
    ["1P 3M 5P 7m 9m 11A 13M", "", "13b9#11"],
    ["1P 3M 5P 7m 9m 11A 13m", "", "7b9b13#11 7b9#11b13 7b5b9b13"],
    ["1P 3M 5P 7m 9m 13M", "", "13b9"],
    ["1P 3M 5P 7m 9m 13m", "", "7b9b13"],
    ["1P 3M 5P 7m 9m 9A", "", "7b9#9"],
    ["1P 3M 5P 9M", "", "Madd9 2 add9 add2"],
    ["1P 3M 5P 9m", "", "Maddb9"],
    ["1P 3M 5d", "", "Mb5"],
    ["1P 3M 5d 6M 7m 9M", "", "13b5"],
    ["1P 3M 5d 7M", "", "M7b5"],
    ["1P 3M 5d 7M 9M", "", "M9b5"],
    ["1P 3M 5d 7m", "", "7b5"],
    ["1P 3M 5d 7m 9M", "", "9b5"],
    ["1P 3M 7m", "", "7no5"],
    ["1P 3M 7m 13m", "", "7b13"],
    ["1P 3M 7m 9M", "", "9no5"],
    ["1P 3M 7m 9M 13M", "", "13no5"],
    ["1P 3M 7m 9M 13m", "", "9b13"],
    ["1P 3m 4P 5P", "", "madd4"],
    ["1P 3m 5P 6m 7M", "", "mMaj7b6"],
    ["1P 3m 5P 6m 7M 9M", "", "mMaj9b6"],
    ["1P 3m 5P 7m 11P", "", "m7add11 m7add4"],
    ["1P 3m 5P 9M", "", "madd9"],
    ["1P 3m 5d 6M 7M", "", "o7M7"],
    ["1P 3m 5d 7M", "", "oM7"],
    ["1P 3m 6m 7M", "", "mb6M7"],
    ["1P 3m 6m 7m", "", "m7#5"],
    ["1P 3m 6m 7m 9M", "", "m9#5"],
    ["1P 3m 5A 7m 9M 11P", "", "m11A"],
    ["1P 3m 6m 9m", "", "mb6b9"],
    ["1P 2M 3m 5d 7m", "", "m9b5"],
    ["1P 4P 5A 7M", "", "M7#5sus4"],
    ["1P 4P 5A 7M 9M", "", "M9#5sus4"],
    ["1P 4P 5A 7m", "", "7#5sus4"],
    ["1P 4P 5P 7M", "", "M7sus4"],
    ["1P 4P 5P 7M 9M", "", "M9sus4"],
    ["1P 4P 5P 7m 9M", "", "9sus4 9sus"],
    ["1P 4P 5P 7m 9M 13M", "", "13sus4 13sus"],
    ["1P 4P 5P 7m 9m 13m", "", "7sus4b9b13 7b9b13sus4"],
    ["1P 4P 7m 10m", "", "4 quartal"],
    ["1P 5P 7m 9m 11P", "", "11b9"]
  ];
  var data_default = CHORDS;
  var NoChordType = {
    ...EmptyPcset,
    name: "",
    quality: "Unknown",
    intervals: [],
    aliases: []
  };
  var dictionary = [];
  var index = {};
  function get2(type) {
    return index[type] || NoChordType;
  }
  function all() {
    return dictionary.slice();
  }
  function add(intervals, aliases, fullName) {
    const quality = getQuality(intervals);
    const chord2 = {
      ...get(intervals),
      name: fullName || "",
      quality,
      intervals,
      aliases
    };
    dictionary.push(chord2);
    if (chord2.name) {
      index[chord2.name] = chord2;
    }
    index[chord2.setNum] = chord2;
    index[chord2.chroma] = chord2;
    chord2.aliases.forEach((alias) => addAlias(chord2, alias));
  }
  function addAlias(chord2, alias) {
    index[alias] = chord2;
  }
  function getQuality(intervals) {
    const has = (interval2) => intervals.indexOf(interval2) !== -1;
    return has("5A") ? "Augmented" : has("3M") ? "Major" : has("5d") ? "Diminished" : has("3m") ? "Minor" : "Unknown";
  }
  data_default.forEach(
    ([ivls, fullName, names22]) => add(ivls.split(" "), names22.split(" "), fullName)
  );
  dictionary.sort((a, b) => a.setNum - b.setNum);

  // node_modules/@tonaljs/chord-detect/dist/index.mjs
  var namedSet = (notes2) => {
    const pcToName = notes2.reduce((record, n) => {
      const chroma3 = note(n).chroma;
      if (chroma3 !== void 0) {
        record[chroma3] = record[chroma3] || note(n).name;
      }
      return record;
    }, {});
    return (chroma3) => pcToName[chroma3];
  };
  function detect(source, options = {}) {
    const notes2 = source.map((n) => note(n).pc).filter((x) => x);
    if (note.length === 0) {
      return [];
    }
    const found = findMatches(notes2, 1, options);
    return found.filter((chord2) => chord2.weight).sort((a, b) => b.weight - a.weight).map((chord2) => chord2.name);
  }
  var BITMASK = {
    // 3m 000100000000
    // 3M 000010000000
    anyThirds: 384,
    // 5P 000000010000
    perfectFifth: 16,
    // 5d 000000100000
    // 5A 000000001000
    nonPerfectFifths: 40,
    anySeventh: 3
  };
  var testChromaNumber = (bitmask) => (chromaNumber) => Boolean(chromaNumber & bitmask);
  var hasAnyThird = testChromaNumber(BITMASK.anyThirds);
  var hasPerfectFifth = testChromaNumber(BITMASK.perfectFifth);
  var hasAnySeventh = testChromaNumber(BITMASK.anySeventh);
  var hasNonPerfectFifth = testChromaNumber(BITMASK.nonPerfectFifths);
  function hasAnyThirdAndPerfectFifthAndAnySeventh(chordType) {
    const chromaNumber = parseInt(chordType.chroma, 2);
    return hasAnyThird(chromaNumber) && hasPerfectFifth(chromaNumber) && hasAnySeventh(chromaNumber);
  }
  function withPerfectFifth(chroma3) {
    const chromaNumber = parseInt(chroma3, 2);
    return hasNonPerfectFifth(chromaNumber) ? chroma3 : (chromaNumber | 16).toString(2);
  }
  function findMatches(notes2, weight, options) {
    const tonic = notes2[0];
    const tonicChroma = note(tonic).chroma;
    const noteName = namedSet(notes2);
    const allModes = modes(notes2, false);
    const found = [];
    allModes.forEach((mode, index4) => {
      const modeWithPerfectFifth = options.assumePerfectFifth && withPerfectFifth(mode);
      const chordTypes = all().filter((chordType) => {
        if (options.assumePerfectFifth && hasAnyThirdAndPerfectFifthAndAnySeventh(chordType)) {
          return chordType.chroma === modeWithPerfectFifth;
        }
        return chordType.chroma === mode;
      });
      chordTypes.forEach((chordType) => {
        const chordName = chordType.aliases[0];
        const baseNote = noteName(index4);
        const isInversion = index4 !== tonicChroma;
        if (isInversion) {
          found.push({
            weight: 0.5 * weight,
            name: `${baseNote}${chordName}/${tonic}`
          });
        } else {
          found.push({ weight: 1 * weight, name: `${baseNote}${chordName}` });
        }
      });
    });
    return found;
  }

  // node_modules/@tonaljs/interval/dist/index.mjs
  var IQ = "P m M m M P d P m M m M".split(" ");
  var add2 = combinator((a, b) => [a[0] + b[0], a[1] + b[1]]);
  var subtract = combinator((a, b) => [a[0] - b[0], a[1] - b[1]]);
  function combinator(fn) {
    return (a, b) => {
      const coordA = interval(a).coord;
      const coordB = interval(b).coord;
      if (coordA && coordB) {
        const coord = fn(coordA, coordB);
        return coordToInterval(coord).name;
      }
    };
  }

  // node_modules/@tonaljs/scale-type/dist/index.mjs
  var SCALES = [
    // Basic scales
    ["1P 2M 3M 5P 6M", "major pentatonic", "pentatonic"],
    ["1P 2M 3M 4P 5P 6M 7M", "major", "ionian"],
    ["1P 2M 3m 4P 5P 6m 7m", "minor", "aeolian"],
    // Jazz common scales
    ["1P 2M 3m 3M 5P 6M", "major blues"],
    ["1P 3m 4P 5d 5P 7m", "minor blues", "blues"],
    ["1P 2M 3m 4P 5P 6M 7M", "melodic minor"],
    ["1P 2M 3m 4P 5P 6m 7M", "harmonic minor"],
    ["1P 2M 3M 4P 5P 6M 7m 7M", "bebop"],
    ["1P 2M 3m 4P 5d 6m 6M 7M", "diminished", "whole-half diminished"],
    // Modes
    ["1P 2M 3m 4P 5P 6M 7m", "dorian"],
    ["1P 2M 3M 4A 5P 6M 7M", "lydian"],
    ["1P 2M 3M 4P 5P 6M 7m", "mixolydian", "dominant"],
    ["1P 2m 3m 4P 5P 6m 7m", "phrygian"],
    ["1P 2m 3m 4P 5d 6m 7m", "locrian"],
    // 5-note scales
    ["1P 3M 4P 5P 7M", "ionian pentatonic"],
    ["1P 3M 4P 5P 7m", "mixolydian pentatonic", "indian"],
    ["1P 2M 4P 5P 6M", "ritusen"],
    ["1P 2M 4P 5P 7m", "egyptian"],
    // Source: https://en.wikipedia.org/wiki/Neapolitan_scale
    ["1P 3M 4P 5d 7m", "neapolitan major pentatonic"],
    ["1P 3m 4P 5P 6m", "vietnamese 1"],
    ["1P 2m 3m 5P 6m", "pelog"],
    ["1P 2m 4P 5P 6m", "kumoijoshi"],
    ["1P 2M 3m 5P 6m", "hirajoshi"],
    ["1P 2m 4P 5d 7m", "iwato"],
    ["1P 2m 4P 5P 7m", "in-sen"],
    ["1P 3M 4A 5P 7M", "lydian pentatonic", "chinese"],
    ["1P 3m 4P 6m 7m", "malkos raga"],
    ["1P 3m 4P 5d 7m", "locrian pentatonic", "minor seven flat five pentatonic"],
    ["1P 3m 4P 5P 7m", "minor pentatonic", "vietnamese 2"],
    ["1P 3m 4P 5P 6M", "minor six pentatonic"],
    ["1P 2M 3m 5P 6M", "flat three pentatonic", "kumoi"],
    ["1P 2M 3M 5P 6m", "flat six pentatonic"],
    ["1P 2m 3M 5P 6M", "scriabin"],
    ["1P 3M 5d 6m 7m", "whole tone pentatonic"],
    ["1P 3M 4A 5A 7M", "lydian #5p pentatonic"],
    ["1P 3M 4A 5P 7m", "lydian dominant pentatonic"],
    ["1P 3m 4P 5P 7M", "minor #7m pentatonic"],
    ["1P 3m 4d 5d 7m", "super locrian pentatonic"],
    // 6-note scales
    ["1P 2M 3m 4P 5P 7M", "minor hexatonic"],
    ["1P 2A 3M 5P 5A 7M", "augmented"],
    ["1P 2M 4P 5P 6M 7m", "piongio"],
    // Source: https://en.wikipedia.org/wiki/Neapolitan_scale
    ["1P 2m 3M 4A 6M 7m", "prometheus neapolitan"],
    ["1P 2M 3M 4A 6M 7m", "prometheus"],
    ["1P 2m 3M 5d 6m 7m", "mystery #1"],
    ["1P 2m 3M 4P 5A 6M", "six tone symmetric"],
    ["1P 2M 3M 4A 5A 6A", "whole tone", "messiaen's mode #1"],
    ["1P 2m 4P 4A 5P 7M", "messiaen's mode #5"],
    // 7-note scales
    ["1P 2M 3M 4P 5d 6m 7m", "locrian major", "arabian"],
    ["1P 2m 3M 4A 5P 6m 7M", "double harmonic lydian"],
    [
      "1P 2m 2A 3M 4A 6m 7m",
      "altered",
      "super locrian",
      "diminished whole tone",
      "pomeroy"
    ],
    ["1P 2M 3m 4P 5d 6m 7m", "locrian #2", "half-diminished", "aeolian b5"],
    [
      "1P 2M 3M 4P 5P 6m 7m",
      "mixolydian b6",
      "melodic minor fifth mode",
      "hindu"
    ],
    ["1P 2M 3M 4A 5P 6M 7m", "lydian dominant", "lydian b7", "overtone"],
    ["1P 2M 3M 4A 5A 6M 7M", "lydian augmented"],
    [
      "1P 2m 3m 4P 5P 6M 7m",
      "dorian b2",
      "phrygian #6",
      "melodic minor second mode"
    ],
    [
      "1P 2m 3m 4d 5d 6m 7d",
      "ultralocrian",
      "superlocrian bb7",
      "superlocrian diminished"
    ],
    ["1P 2m 3m 4P 5d 6M 7m", "locrian 6", "locrian natural 6", "locrian sharp 6"],
    ["1P 2A 3M 4P 5P 5A 7M", "augmented heptatonic"],
    // Source https://en.wikipedia.org/wiki/Ukrainian_Dorian_scale
    [
      "1P 2M 3m 4A 5P 6M 7m",
      "dorian #4",
      "ukrainian dorian",
      "romanian minor",
      "altered dorian"
    ],
    ["1P 2M 3m 4A 5P 6M 7M", "lydian diminished"],
    ["1P 2M 3M 4A 5A 7m 7M", "leading whole tone"],
    ["1P 2M 3M 4A 5P 6m 7m", "lydian minor"],
    ["1P 2m 3M 4P 5P 6m 7m", "phrygian dominant", "spanish", "phrygian major"],
    ["1P 2m 3m 4P 5P 6m 7M", "balinese"],
    // Source: https://en.wikipedia.org/wiki/Neapolitan_scale
    ["1P 2m 3m 4P 5P 6M 7M", "neapolitan major"],
    ["1P 2M 3M 4P 5P 6m 7M", "harmonic major"],
    ["1P 2m 3M 4P 5P 6m 7M", "double harmonic major", "gypsy"],
    ["1P 2M 3m 4A 5P 6m 7M", "hungarian minor"],
    ["1P 2A 3M 4A 5P 6M 7m", "hungarian major"],
    ["1P 2m 3M 4P 5d 6M 7m", "oriental"],
    ["1P 2m 3m 3M 4A 5P 7m", "flamenco"],
    ["1P 2m 3m 4A 5P 6m 7M", "todi raga"],
    ["1P 2m 3M 4P 5d 6m 7M", "persian"],
    ["1P 2m 3M 5d 6m 7m 7M", "enigmatic"],
    [
      "1P 2M 3M 4P 5A 6M 7M",
      "major augmented",
      "major #5",
      "ionian augmented",
      "ionian #5"
    ],
    ["1P 2A 3M 4A 5P 6M 7M", "lydian #9"],
    // 8-note scales
    ["1P 2m 2M 4P 4A 5P 6m 7M", "messiaen's mode #4"],
    ["1P 2m 3M 4P 4A 5P 6m 7M", "purvi raga"],
    ["1P 2m 3m 3M 4P 5P 6m 7m", "spanish heptatonic"],
    ["1P 2M 3m 3M 4P 5P 6M 7m", "bebop minor"],
    ["1P 2M 3M 4P 5P 5A 6M 7M", "bebop major"],
    ["1P 2m 3m 4P 5d 5P 6m 7m", "bebop locrian"],
    ["1P 2M 3m 4P 5P 6m 7m 7M", "minor bebop"],
    ["1P 2M 3M 4P 5d 5P 6M 7M", "ichikosucho"],
    ["1P 2M 3m 4P 5P 6m 6M 7M", "minor six diminished"],
    [
      "1P 2m 3m 3M 4A 5P 6M 7m",
      "half-whole diminished",
      "dominant diminished",
      "messiaen's mode #2"
    ],
    ["1P 3m 3M 4P 5P 6M 7m 7M", "kafi raga"],
    ["1P 2M 3M 4P 4A 5A 6A 7M", "messiaen's mode #6"],
    // 9-note scales
    ["1P 2M 3m 3M 4P 5d 5P 6M 7m", "composite blues"],
    ["1P 2M 3m 3M 4A 5P 6m 7m 7M", "messiaen's mode #3"],
    // 10-note scales
    ["1P 2m 2M 3m 4P 4A 5P 6m 6M 7M", "messiaen's mode #7"],
    // 12-note scales
    ["1P 2m 2M 3m 3M 4P 5d 5P 6m 6M 7m 7M", "chromatic"]
  ];
  var data_default2 = SCALES;
  var NoScaleType = {
    ...EmptyPcset,
    intervals: [],
    aliases: []
  };
  var dictionary2 = [];
  var index2 = {};
  function get3(type) {
    return index2[type] || NoScaleType;
  }
  function all2() {
    return dictionary2.slice();
  }
  function add3(intervals, name2, aliases = []) {
    const scale = { ...get(intervals), name: name2, intervals, aliases };
    dictionary2.push(scale);
    index2[scale.name] = scale;
    index2[scale.setNum] = scale;
    index2[scale.chroma] = scale;
    scale.aliases.forEach((alias) => addAlias2(scale, alias));
    return scale;
  }
  function addAlias2(scale, alias) {
    index2[alias] = scale;
  }
  data_default2.forEach(
    ([ivls, name2, ...aliases]) => add3(ivls.split(" "), name2, aliases)
  );

  // node_modules/@tonaljs/chord/dist/index.mjs
  var NoChord = {
    empty: true,
    name: "",
    symbol: "",
    root: "",
    bass: "",
    rootDegree: 0,
    type: "",
    tonic: null,
    setNum: NaN,
    quality: "Unknown",
    chroma: "",
    normalized: "",
    aliases: [],
    notes: [],
    intervals: []
  };
  function tokenize(name2) {
    const [letter, acc, oct, type] = tokenizeNote(name2);
    if (letter === "") {
      return tokenizeBass("", name2);
    } else if (letter === "A" && type === "ug") {
      return tokenizeBass("", "aug");
    } else {
      return tokenizeBass(letter + acc, oct + type);
    }
  }
  function tokenizeBass(note2, chord2) {
    const split = chord2.split("/");
    if (split.length === 1) {
      return [note2, split[0], ""];
    }
    const [letter, acc, oct, type] = tokenizeNote(split[1]);
    if (letter !== "" && oct === "" && type === "") {
      return [note2, split[0], letter + acc];
    } else {
      return [note2, chord2, ""];
    }
  }
  function get4(src) {
    if (Array.isArray(src)) {
      return getChord(src[1] || "", src[0], src[2]);
    } else if (src === "") {
      return NoChord;
    } else {
      const [tonic, type, bass] = tokenize(src);
      const chord2 = getChord(type, tonic, bass);
      return chord2.empty ? getChord(src) : chord2;
    }
  }
  function getChord(typeName, optionalTonic, optionalBass) {
    const type = get2(typeName);
    const tonic = note(optionalTonic || "");
    const bass = note(optionalBass || "");
    if (type.empty || optionalTonic && tonic.empty || optionalBass && bass.empty) {
      return NoChord;
    }
    const bassInterval = distance(tonic.pc, bass.pc);
    const bassIndex = type.intervals.indexOf(bassInterval);
    const hasRoot = bassIndex >= 0;
    const root = hasRoot ? bass : note("");
    const rootDegree = bassIndex === -1 ? NaN : bassIndex + 1;
    const hasBass = bass.pc && bass.pc !== tonic.pc;
    const intervals = Array.from(type.intervals);
    if (hasRoot) {
      for (let i = 1; i < rootDegree; i++) {
        const num = intervals[0][0];
        const quality = intervals[0][1];
        const newNum = parseInt(num, 10) + 7;
        intervals.push(`${newNum}${quality}`);
        intervals.shift();
      }
    } else if (hasBass) {
      const ivl = subtract(distance(tonic.pc, bass.pc), "8P");
      if (ivl) intervals.unshift(ivl);
    }
    const notes2 = tonic.empty ? [] : intervals.map((i) => transpose(tonic.pc, i));
    typeName = type.aliases.indexOf(typeName) !== -1 ? typeName : type.aliases[0];
    const symbol = `${tonic.empty ? "" : tonic.pc}${typeName}${hasRoot && rootDegree > 1 ? "/" + root.pc : hasBass ? "/" + bass.pc : ""}`;
    const name2 = `${optionalTonic ? tonic.pc + " " : ""}${type.name}${hasRoot && rootDegree > 1 ? " over " + root.pc : hasBass ? " over " + bass.pc : ""}`;
    return {
      ...type,
      name: name2,
      symbol,
      tonic: tonic.pc,
      type: type.name,
      root: root.pc,
      bass: hasBass ? bass.pc : "",
      intervals,
      rootDegree,
      notes: notes2
    };
  }
  var chord = get4;
  function transpose2(chordName, interval2) {
    const [tonic, type, bass] = tokenize(chordName);
    if (!tonic) {
      return chordName;
    }
    const tr2 = transpose(bass, interval2);
    const slash = tr2 ? "/" + tr2 : "";
    return transpose(tonic, interval2) + type + slash;
  }
  function chordScales(name2) {
    const s = get4(name2);
    const isChordIncluded = isSupersetOf(s.chroma);
    return all2().filter((scale) => isChordIncluded(scale.chroma)).map((scale) => scale.name);
  }
  function extended(chordName) {
    const s = get4(chordName);
    const isSuperset = isSupersetOf(s.chroma);
    return all().filter((chord2) => isSuperset(chord2.chroma)).map((chord2) => s.tonic + chord2.aliases[0]);
  }
  function reduced(chordName) {
    const s = get4(chordName);
    const isSubset = isSubsetOf(s.chroma);
    return all().filter((chord2) => isSubset(chord2.chroma)).map((chord2) => s.tonic + chord2.aliases[0]);
  }
  function notes(chordName, tonic) {
    const chord2 = get4(chordName);
    const note2 = tonic || chord2.tonic;
    if (!note2 || chord2.empty) return [];
    return chord2.intervals.map((ivl) => transpose(note2, ivl));
  }
  function degrees(chordName, tonic) {
    const chord2 = get4(chordName);
    const note2 = tonic || chord2.tonic;
    const transpose22 = tonicIntervalsTransposer(chord2.intervals, note2);
    return (degree) => degree ? transpose22(degree > 0 ? degree - 1 : degree) : "";
  }
  function steps(chordName, tonic) {
    const chord2 = get4(chordName);
    const note2 = tonic || chord2.tonic;
    return tonicIntervalsTransposer(chord2.intervals, note2);
  }
  var index_default = {
    getChord,
    get: get4,
    detect,
    chordScales,
    extended,
    reduced,
    tokenize,
    transpose: transpose2,
    degrees,
    steps,
    notes,
    chord
  };

  // node_modules/@tonaljs/duration-value/dist/index.mjs
  var DATA = [
    [
      0.125,
      "dl",
      ["large", "duplex longa", "maxima", "octuple", "octuple whole"]
    ],
    [0.25, "l", ["long", "longa"]],
    [0.5, "d", ["double whole", "double", "breve"]],
    [1, "w", ["whole", "semibreve"]],
    [2, "h", ["half", "minim"]],
    [4, "q", ["quarter", "crotchet"]],
    [8, "e", ["eighth", "quaver"]],
    [16, "s", ["sixteenth", "semiquaver"]],
    [32, "t", ["thirty-second", "demisemiquaver"]],
    [64, "sf", ["sixty-fourth", "hemidemisemiquaver"]],
    [128, "h", ["hundred twenty-eighth"]],
    [256, "th", ["two hundred fifty-sixth"]]
  ];
  var data_default3 = DATA;
  var VALUES = [];
  data_default3.forEach(
    ([denominator, shorthand, names22]) => add4(denominator, shorthand, names22)
  );
  function add4(denominator, shorthand, names22) {
    VALUES.push({
      empty: false,
      dots: "",
      name: "",
      value: 1 / denominator,
      fraction: denominator < 1 ? [1 / denominator, 1] : [1, denominator],
      shorthand,
      names: names22
    });
  }

  // node_modules/@tonaljs/key/dist/index.mjs
  var dist_exports3 = {};
  __export(dist_exports3, {
    default: () => index_default3,
    majorKey: () => majorKey,
    majorKeyChords: () => majorKeyChords,
    majorTonicFromKeySignature: () => majorTonicFromKeySignature,
    minorKey: () => minorKey,
    minorKeyChords: () => minorKeyChords
  });

  // node_modules/@tonaljs/note/dist/index.mjs
  var dist_exports2 = {};
  __export(dist_exports2, {
    accidentals: () => accidentals,
    ascending: () => ascending,
    chroma: () => chroma,
    default: () => index_default2,
    descending: () => descending,
    distance: () => distance2,
    enharmonic: () => enharmonic,
    freq: () => freq,
    fromFreq: () => fromFreq,
    fromFreqSharps: () => fromFreqSharps,
    fromMidi: () => fromMidi,
    fromMidiSharps: () => fromMidiSharps,
    get: () => get5,
    midi: () => midi,
    name: () => name,
    names: () => names,
    octave: () => octave,
    pitchClass: () => pitchClass,
    simplify: () => simplify,
    sortedNames: () => sortedNames,
    sortedUniqNames: () => sortedUniqNames,
    tr: () => tr,
    trBy: () => trBy,
    trFifths: () => trFifths,
    trFrom: () => trFrom,
    transpose: () => transpose3,
    transposeBy: () => transposeBy,
    transposeFifths: () => transposeFifths,
    transposeFrom: () => transposeFrom,
    transposeOctaves: () => transposeOctaves
  });

  // node_modules/@tonaljs/midi/dist/index.mjs
  var L2 = Math.log(2);
  var L440 = Math.log(440);
  function freqToMidi(freq2) {
    const v = 12 * (Math.log(freq2) - L440) / L2 + 69;
    return Math.round(v * 100) / 100;
  }
  var SHARPS = "C C# D D# E F F# G G# A A# B".split(" ");
  var FLATS = "C Db D Eb E F Gb G Ab A Bb B".split(" ");
  function midiToNoteName(midi2, options = {}) {
    if (isNaN(midi2) || midi2 === -Infinity || midi2 === Infinity) return "";
    midi2 = Math.round(midi2);
    const pcs = options.sharps === true ? SHARPS : FLATS;
    const pc = pcs[midi2 % 12];
    if (options.pitchClass) {
      return pc;
    }
    const o = Math.floor(midi2 / 12) - 1;
    return pc + o;
  }

  // node_modules/@tonaljs/note/dist/index.mjs
  var NAMES = ["C", "D", "E", "F", "G", "A", "B"];
  var toName = (n) => n.name;
  var onlyNotes = (array) => array.map(note).filter((n) => !n.empty);
  function names(array) {
    if (array === void 0) {
      return NAMES.slice();
    } else if (!Array.isArray(array)) {
      return [];
    } else {
      return onlyNotes(array).map(toName);
    }
  }
  var get5 = note;
  var name = (note2) => get5(note2).name;
  var pitchClass = (note2) => get5(note2).pc;
  var accidentals = (note2) => get5(note2).acc;
  var octave = (note2) => get5(note2).oct;
  var midi = (note2) => get5(note2).midi;
  var freq = (note2) => get5(note2).freq;
  var chroma = (note2) => get5(note2).chroma;
  function fromMidi(midi2) {
    return midiToNoteName(midi2);
  }
  function fromFreq(freq2) {
    return midiToNoteName(freqToMidi(freq2));
  }
  function fromFreqSharps(freq2) {
    return midiToNoteName(freqToMidi(freq2), { sharps: true });
  }
  function fromMidiSharps(midi2) {
    return midiToNoteName(midi2, { sharps: true });
  }
  var distance2 = distance;
  var transpose3 = transpose;
  var tr = transpose;
  var transposeBy = (interval2) => (note2) => transpose3(note2, interval2);
  var trBy = transposeBy;
  var transposeFrom = (note2) => (interval2) => transpose3(note2, interval2);
  var trFrom = transposeFrom;
  function transposeFifths(noteName, fifths) {
    return transpose3(noteName, [fifths, 0]);
  }
  var trFifths = transposeFifths;
  function transposeOctaves(noteName, octaves) {
    return transpose3(noteName, [0, octaves]);
  }
  var ascending = (a, b) => a.height - b.height;
  var descending = (a, b) => b.height - a.height;
  function sortedNames(notes2, comparator) {
    comparator = comparator || ascending;
    return onlyNotes(notes2).sort(comparator).map(toName);
  }
  function sortedUniqNames(notes2) {
    return sortedNames(notes2, ascending).filter(
      (n, i, a) => i === 0 || n !== a[i - 1]
    );
  }
  var simplify = (noteName) => {
    const note2 = get5(noteName);
    if (note2.empty) {
      return "";
    }
    return midiToNoteName(note2.midi || note2.chroma, {
      sharps: note2.alt > 0,
      pitchClass: note2.midi === null
    });
  };
  function enharmonic(noteName, destName) {
    const src = get5(noteName);
    if (src.empty) {
      return "";
    }
    const dest = get5(
      destName || midiToNoteName(src.midi || src.chroma, {
        sharps: src.alt < 0,
        pitchClass: true
      })
    );
    if (dest.empty || dest.chroma !== src.chroma) {
      return "";
    }
    if (src.oct === void 0) {
      return dest.pc;
    }
    const srcChroma = src.chroma - src.alt;
    const destChroma = dest.chroma - dest.alt;
    const destOctOffset = srcChroma > 11 || destChroma < 0 ? -1 : srcChroma < 0 || destChroma > 11 ? 1 : 0;
    const destOct = src.oct + destOctOffset;
    return dest.pc + destOct;
  }
  var index_default2 = {
    names,
    get: get5,
    name,
    pitchClass,
    accidentals,
    octave,
    midi,
    ascending,
    descending,
    distance: distance2,
    sortedNames,
    sortedUniqNames,
    fromMidi,
    fromMidiSharps,
    freq,
    fromFreq,
    fromFreqSharps,
    chroma,
    transpose: transpose3,
    tr,
    transposeBy,
    trBy,
    transposeFrom,
    trFrom,
    transposeFifths,
    transposeOctaves,
    trFifths,
    simplify,
    enharmonic
  };

  // node_modules/@tonaljs/roman-numeral/dist/index.mjs
  var NoRomanNumeral = { empty: true, name: "", chordType: "" };
  var cache4 = {};
  function get6(src) {
    return typeof src === "string" ? cache4[src] || (cache4[src] = parse3(src)) : typeof src === "number" ? get6(NAMES2[src] || "") : isPitch(src) ? fromPitch(src) : isNamedPitch(src) ? get6(src.name) : NoRomanNumeral;
  }
  function fromPitch(pitch2) {
    return get6(altToAcc(pitch2.alt) + NAMES2[pitch2.step]);
  }
  var REGEX4 = /^(#{1,}|b{1,}|x{1,}|)(IV|I{1,3}|VI{0,2}|iv|i{1,3}|vi{0,2})([^IViv]*)$/;
  function tokenize2(str) {
    return REGEX4.exec(str) || ["", "", "", ""];
  }
  var ROMANS = "I II III IV V VI VII";
  var NAMES2 = ROMANS.split(" ");
  var NAMES_MINOR = ROMANS.toLowerCase().split(" ");
  function parse3(src) {
    const [name2, acc, roman, chordType] = tokenize2(src);
    if (!roman) {
      return NoRomanNumeral;
    }
    const upperRoman = roman.toUpperCase();
    const step = NAMES2.indexOf(upperRoman);
    const alt = accToAlt(acc);
    const dir = 1;
    return {
      empty: false,
      name: name2,
      roman,
      interval: interval({ step, alt, dir }).name,
      acc,
      chordType,
      alt,
      step,
      major: roman === upperRoman,
      oct: 0,
      dir
    };
  }

  // node_modules/@tonaljs/key/dist/index.mjs
  var Empty = Object.freeze([]);
  var NoKey = {
    type: "major",
    tonic: "",
    alteration: 0,
    keySignature: ""
  };
  var NoKeyScale = {
    tonic: "",
    grades: Empty,
    intervals: Empty,
    scale: Empty,
    triads: Empty,
    chords: Empty,
    chordsHarmonicFunction: Empty,
    chordScales: Empty,
    secondaryDominants: Empty,
    secondaryDominantSupertonics: Empty,
    substituteDominantsMinorRelative: Empty,
    substituteDominants: Empty,
    substituteDominantSupertonics: Empty,
    secondaryDominantsMinorRelative: Empty
  };
  var NoMajorKey = {
    ...NoKey,
    ...NoKeyScale,
    type: "major",
    minorRelative: "",
    scale: Empty,
    substituteDominants: Empty,
    secondaryDominantSupertonics: Empty,
    substituteDominantsMinorRelative: Empty
  };
  var NoMinorKey = {
    ...NoKey,
    type: "minor",
    relativeMajor: "",
    natural: NoKeyScale,
    harmonic: NoKeyScale,
    melodic: NoKeyScale
  };
  var mapScaleToType = (scale, list, sep = "") => list.map((type, i) => `${scale[i]}${sep}${type}`);
  function keyScale(grades, triads3, chordTypes, harmonicFunctions, chordScales2) {
    return (tonic) => {
      const intervals = grades.map((gr) => get6(gr).interval || "");
      const scale = intervals.map((interval2) => transpose3(tonic, interval2));
      const chords2 = mapScaleToType(scale, chordTypes);
      const secondaryDominants = scale.map((note2) => transpose3(note2, "5P")).map(
        (note2) => (
          // A secondary dominant is a V chord which:
          // 1. is not diatonic to the key,
          // 2. it must have a diatonic root.
          scale.includes(note2) && !chords2.includes(note2 + "7") ? note2 + "7" : ""
        )
      );
      const secondaryDominantSupertonics = supertonics(
        secondaryDominants,
        triads3
      );
      const substituteDominants = secondaryDominants.map((chord2) => {
        if (!chord2) return "";
        const domRoot = chord2.slice(0, -1);
        const subRoot = transpose3(domRoot, "5d");
        return subRoot + "7";
      });
      const substituteDominantSupertonics = supertonics(
        substituteDominants,
        triads3
      );
      return {
        tonic,
        grades,
        intervals,
        scale,
        triads: mapScaleToType(scale, triads3),
        chords: chords2,
        chordsHarmonicFunction: harmonicFunctions.slice(),
        chordScales: mapScaleToType(scale, chordScales2, " "),
        secondaryDominants,
        secondaryDominantSupertonics,
        substituteDominants,
        substituteDominantSupertonics,
        // @deprecated use secondaryDominantsSupertonic
        secondaryDominantsMinorRelative: secondaryDominantSupertonics,
        // @deprecated use secondaryDominantsSupertonic
        substituteDominantsMinorRelative: substituteDominantSupertonics
      };
    };
  }
  var supertonics = (dominants, targetTriads) => {
    return dominants.map((chord2, index4) => {
      if (!chord2) return "";
      const domRoot = chord2.slice(0, -1);
      const minorRoot = transpose3(domRoot, "5P");
      const target = targetTriads[index4];
      const isMinor = target.endsWith("m");
      return isMinor ? minorRoot + "m7" : minorRoot + "m7b5";
    });
  };
  var distInFifths = (from, to) => {
    const f = note(from);
    const t = note(to);
    return f.empty || t.empty ? 0 : t.coord[0] - f.coord[0];
  };
  var MajorScale = keyScale(
    "I II III IV V VI VII".split(" "),
    " m m   m dim".split(" "),
    "maj7 m7 m7 maj7 7 m7 m7b5".split(" "),
    "T SD T SD D T D".split(" "),
    "major,dorian,phrygian,lydian,mixolydian,minor,locrian".split(",")
  );
  var NaturalScale = keyScale(
    "I II bIII IV V bVI bVII".split(" "),
    "m dim  m m  ".split(" "),
    "m7 m7b5 maj7 m7 m7 maj7 7".split(" "),
    "T SD T SD D SD SD".split(" "),
    "minor,locrian,major,dorian,phrygian,lydian,mixolydian".split(",")
  );
  var HarmonicScale = keyScale(
    "I II bIII IV V bVI VII".split(" "),
    "m dim aug m   dim".split(" "),
    "mMaj7 m7b5 +maj7 m7 7 maj7 o7".split(" "),
    "T SD T SD D SD D".split(" "),
    "harmonic minor,locrian 6,major augmented,lydian diminished,phrygian dominant,lydian #9,ultralocrian".split(
      ","
    )
  );
  var MelodicScale = keyScale(
    "I II bIII IV V VI VII".split(" "),
    "m m aug   dim dim".split(" "),
    "m6 m7 +maj7 7 7 m7b5 m7b5".split(" "),
    "T SD T SD D  ".split(" "),
    "melodic minor,dorian b2,lydian augmented,lydian dominant,mixolydian b6,locrian #2,altered".split(
      ","
    )
  );
  function majorKey(tonic) {
    const pc = note(tonic).pc;
    if (!pc) return NoMajorKey;
    const keyScale2 = MajorScale(pc);
    const alteration = distInFifths("C", pc);
    return {
      ...keyScale2,
      type: "major",
      minorRelative: transpose3(pc, "-3m"),
      alteration,
      keySignature: altToAcc(alteration)
    };
  }
  function majorKeyChords(tonic) {
    const key = majorKey(tonic);
    const chords2 = [];
    keyChordsOf(key, chords2);
    return chords2;
  }
  function minorKeyChords(tonic) {
    const key = minorKey(tonic);
    const chords2 = [];
    keyChordsOf(key.natural, chords2);
    keyChordsOf(key.harmonic, chords2);
    keyChordsOf(key.melodic, chords2);
    return chords2;
  }
  function keyChordsOf(key, chords2) {
    const updateChord = (name2, newRole) => {
      if (!name2) return;
      let keyChord = chords2.find((chord2) => chord2.name === name2);
      if (!keyChord) {
        keyChord = { name: name2, roles: [] };
        chords2.push(keyChord);
      }
      if (newRole && !keyChord.roles.includes(newRole)) {
        keyChord.roles.push(newRole);
      }
    };
    key.chords.forEach(
      (chordName, index4) => updateChord(chordName, key.chordsHarmonicFunction[index4])
    );
    key.secondaryDominants.forEach(
      (chordName, index4) => updateChord(chordName, `V/${key.grades[index4]}`)
    );
    key.secondaryDominantSupertonics.forEach(
      (chordName, index4) => updateChord(chordName, `ii/${key.grades[index4]}`)
    );
    key.substituteDominants.forEach(
      (chordName, index4) => updateChord(chordName, `subV/${key.grades[index4]}`)
    );
    key.substituteDominantSupertonics.forEach(
      (chordName, index4) => updateChord(chordName, `subii/${key.grades[index4]}`)
    );
  }
  function minorKey(tnc) {
    const pc = note(tnc).pc;
    if (!pc) return NoMinorKey;
    const alteration = distInFifths("C", pc) - 3;
    return {
      type: "minor",
      tonic: pc,
      relativeMajor: transpose3(pc, "3m"),
      alteration,
      keySignature: altToAcc(alteration),
      natural: NaturalScale(pc),
      harmonic: HarmonicScale(pc),
      melodic: MelodicScale(pc)
    };
  }
  function majorTonicFromKeySignature(sig) {
    if (typeof sig === "number") {
      return transposeFifths("C", sig);
    } else if (typeof sig === "string" && /^b+|#+$/.test(sig)) {
      return transposeFifths("C", accToAlt(sig));
    }
    return null;
  }
  var index_default3 = { majorKey, majorTonicFromKeySignature, minorKey };

  // node_modules/@tonaljs/mode/dist/index.mjs
  var MODES = [
    [0, 2773, 0, "ionian", "", "Maj7", "major"],
    [1, 2902, 2, "dorian", "m", "m7"],
    [2, 3418, 4, "phrygian", "m", "m7"],
    [3, 2741, -1, "lydian", "", "Maj7"],
    [4, 2774, 1, "mixolydian", "", "7"],
    [5, 2906, 3, "aeolian", "m", "m7", "minor"],
    [6, 3434, 5, "locrian", "dim", "m7b5"]
  ];
  var NoMode = {
    ...EmptyPcset,
    name: "",
    alt: 0,
    modeNum: NaN,
    triad: "",
    seventh: "",
    aliases: []
  };
  var modes2 = MODES.map(toMode);
  var index3 = {};
  modes2.forEach((mode2) => {
    index3[mode2.name] = mode2;
    mode2.aliases.forEach((alias) => {
      index3[alias] = mode2;
    });
  });
  function get7(name2) {
    return typeof name2 === "string" ? index3[name2.toLowerCase()] || NoMode : name2 && name2.name ? get7(name2.name) : NoMode;
  }
  function toMode(mode2) {
    const [modeNum, setNum, alt, name2, triad, seventh, alias] = mode2;
    const aliases = alias ? [alias] : [];
    const chroma3 = Number(setNum).toString(2);
    const intervals = get3(name2).intervals;
    return {
      empty: false,
      intervals,
      modeNum,
      chroma: chroma3,
      normalized: chroma3,
      name: name2,
      setNum,
      alt,
      triad,
      seventh,
      aliases
    };
  }
  function chords(chords2) {
    return (modeName, tonic) => {
      const mode2 = get7(modeName);
      if (mode2.empty) return [];
      const triads22 = rotate(mode2.modeNum, chords2);
      const tonics = mode2.intervals.map((i) => transpose(tonic, i));
      return triads22.map((triad, i) => tonics[i] + triad);
    };
  }
  var triads = chords(MODES.map((x) => x[4]));
  var seventhChords = chords(MODES.map((x) => x[5]));

  // node_modules/@tonaljs/progression/dist/index.mjs
  var dist_exports4 = {};
  __export(dist_exports4, {
    default: () => index_default4,
    fromRomanNumerals: () => fromRomanNumerals,
    toRomanNumerals: () => toRomanNumerals
  });
  function fromRomanNumerals(tonic, chords2) {
    const romanNumerals = chords2.map(get6);
    return romanNumerals.map(
      (rn) => transpose(tonic, interval(rn)) + rn.chordType
    );
  }
  function toRomanNumerals(tonic, chords2) {
    return chords2.map((chord2) => {
      const [note2, chordType] = tokenize(chord2);
      const intervalName = distance(tonic, note2);
      const roman = get6(interval(intervalName));
      return roman.name + chordType;
    });
  }
  var index_default4 = { fromRomanNumerals, toRomanNumerals };

  // node_modules/@tonaljs/voice-leading/dist/index.mjs
  var topNoteDiff = (voicings, lastVoicing) => {
    if (!lastVoicing || !lastVoicing.length) {
      return voicings[0];
    }
    const topNoteMidi = (voicing) => index_default2.midi(voicing[voicing.length - 1]) || 0;
    const diff = (voicing) => Math.abs(topNoteMidi(lastVoicing) - topNoteMidi(voicing));
    return voicings.sort((a, b) => diff(a) - diff(b))[0];
  };
  var index_default5 = {
    topNoteDiff
  };

  // node_modules/@tonaljs/voicing-dictionary/dist/index.mjs
  var triads2 = {
    M: ["1P 3M 5P", "3M 5P 8P", "5P 8P 10M"],
    m: ["1P 3m 5P", "3m 5P 8P", "5P 8P 10m"],
    o: ["1P 3m 5d", "3m 5d 8P", "5d 8P 10m"],
    aug: ["1P 3M 5A", "3M 5A 8P", "5A 8P 10M"]
  };
  var lefthand = {
    m7: ["3m 5P 7m 9M", "7m 9M 10m 12P"],
    "7": ["3M 6M 7m 9M", "7m 9M 10M 13M"],
    "^7": ["3M 5P 7M 9M", "7M 9M 10M 12P"],
    "69": ["3M 5P 6A 9M"],
    m7b5: ["3m 5d 7m 8P", "7m 8P 10m 12d"],
    "7b9": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
    // b9 / b13
    "7b13": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
    // b9 / b13
    o7: ["1P 3m 5d 6M", "5d 6M 8P 10m"],
    "7#11": ["7m 9M 11A 13A"],
    "7#9": ["3M 7m 9A"],
    mM7: ["3m 5P 7M 9M", "7M 9M 10m 12P"],
    m6: ["3m 5P 6M 9M", "6M 9M 10m 12P"]
  };
  var all3 = {
    M: ["1P 3M 5P", "3M 5P 8P", "5P 8P 10M"],
    m: ["1P 3m 5P", "3m 5P 8P", "5P 8P 10m"],
    o: ["1P 3m 5d", "3m 5d 8P", "5d 8P 10m"],
    aug: ["1P 3M 5A", "3M 5A 8P", "5A 8P 10M"],
    m7: ["3m 5P 7m 9M", "7m 9M 10m 12P"],
    "7": ["3M 6M 7m 9M", "7m 9M 10M 13M"],
    "^7": ["3M 5P 7M 9M", "7M 9M 10M 12P"],
    "69": ["3M 5P 6A 9M"],
    m7b5: ["3m 5d 7m 8P", "7m 8P 10m 12d"],
    "7b9": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
    // b9 / b13
    "7b13": ["3M 6m 7m 9m", "7m 9m 10M 13m"],
    // b9 / b13
    o7: ["1P 3m 5d 6M", "5d 6M 8P 10m"],
    "7#11": ["7m 9M 11A 13A"],
    "7#9": ["3M 7m 9A"],
    mM7: ["3m 5P 7M 9M", "7M 9M 10m 12P"],
    m6: ["3m 5P 6M 9M", "6M 9M 10m 12P"]
  };
  var defaultDictionary = lefthand;
  function lookup(symbol, dictionary3 = defaultDictionary) {
    if (dictionary3[symbol]) {
      return dictionary3[symbol];
    }
    const { aliases } = index_default.get("C" + symbol);
    const match = Object.keys(dictionary3).find((_symbol) => aliases.includes(_symbol)) || "";
    if (match !== void 0) {
      return dictionary3[match];
    }
    return void 0;
  }
  var index_default6 = {
    lookup,
    lefthand,
    triads: triads2,
    all: all3,
    defaultDictionary
  };

  // node_modules/@tonaljs/voicing/dist/index.mjs
  var defaultDictionary2 = index_default6.all;
  var defaultVoiceLeading = index_default5.topNoteDiff;

  // node_modules/@tonaljs/core/dist/index.mjs
  function deprecate(original, alternative, fn) {
    return function(...args) {
      console.warn(`${original} is deprecated. Use ${alternative}.`);
      return fn.apply(this, args);
    };
  }
  var isNamed = deprecate("isNamed", "isNamedPitch", isNamedPitch);

  // src/engine/keyContext.ts
  var DEG_INTERVAL = {
    1: "1P",
    2: "2M",
    3: "3M",
    4: "4P",
    5: "5P",
    6: "6M",
    7: "7M"
  };
  var ROMAN_VALUE = {
    I: 1,
    II: 2,
    III: 3,
    IV: 4,
    V: 5,
    VI: 6,
    VII: 7
  };
  function flatten(iv) {
    var _a;
    const map = {
      "2M": "2m",
      "3M": "3m",
      "6M": "6m",
      "7M": "7m",
      "1P": "1d",
      "4P": "4d",
      "5P": "5d"
    };
    return (_a = map[iv]) != null ? _a : iv;
  }
  function sharpen(iv) {
    var _a;
    const map = {
      "1P": "1A",
      "4P": "4A",
      "5P": "5A",
      "2M": "2A",
      "3M": "3A",
      "6M": "6A",
      "7M": "7A"
    };
    return (_a = map[iv]) != null ? _a : iv;
  }
  function parseToken(token) {
    var _a;
    let s = token;
    let accidental = "";
    if (s.startsWith("\u266D")) {
      accidental = "\u266D";
      s = s.slice(1);
    } else if (s.startsWith("#")) {
      accidental = "#";
      s = s.slice(1);
    } else if (s.startsWith("b") && /[ivIV]/.test((_a = s[1]) != null ? _a : "")) {
      accidental = "\u266D";
      s = s.slice(1);
    }
    const m = s.match(/^([ivIV]+)(.*)$/);
    if (!m) throw new Error(`\u7121\u6CD5\u89E3\u6790\u7F85\u99AC\u7D1A\u6578: ${token}`);
    const letters = m[1];
    const degree = ROMAN_VALUE[letters.toUpperCase()];
    if (!degree) throw new Error(`\u672A\u77E5\u7D1A\u6578: ${token}`);
    const isLower = letters[0] === letters[0].toLowerCase();
    return { accidental, degree, isLower, suffix: m[2] };
  }
  function intervalOf(p) {
    let iv = DEG_INTERVAL[p.degree];
    if (p.accidental === "\u266D") iv = flatten(iv);
    else if (p.accidental === "#") iv = sharpen(iv);
    return iv;
  }
  function rootOf(token, key) {
    return dist_exports2.transpose(key, intervalOf(parseToken(token)));
  }
  function qualityFromToken(p) {
    const suf = p.suffix;
    if (suf.includes("\xB0") || /dim/i.test(suf)) return suf.includes("7") ? "dim7" : "dim";
    if (suf.includes("\xF8") || /m7b5/i.test(suf)) return "m7b5";
    if (/sus4/i.test(suf)) return "sus4";
    if (/sus2/i.test(suf)) return "sus2";
    if (/add9/i.test(suf)) return "add9";
    if (/Δ9|maj9/i.test(suf)) return "maj9";
    if (/Δ7|maj7|M7/.test(suf)) return "maj7";
    if (suf.includes("9")) return p.isLower ? "m9" : "9";
    if (suf.includes("7")) return p.isLower ? "m7" : "7";
    if (suf.includes("6")) return p.isLower ? "m6" : "6";
    return p.isLower ? "m" : "";
  }
  function resolveRoman(roman, key) {
    var _a;
    try {
      if (roman.includes("/")) {
        const [head, tail] = roman.split("/");
        if (/^\d/.test(tail)) {
          const base = resolveRoman(head, key);
          const idx = tail.startsWith("3") ? 1 : tail.startsWith("5") ? 2 : tail.startsWith("7") ? 3 : 0;
          const bass = (_a = base.notes[idx]) != null ? _a : base.notes[0];
          if (!bass) return base;
          const reordered = [bass, ...base.notes.filter((n) => n !== bass)];
          return { roman, symbol: `${base.symbol}/${bass}`, notes: reordered };
        }
        const secRoot = dist_exports2.transpose(rootOf(tail, key), "5P");
        const symbol2 = `${secRoot}7`;
        return { roman, symbol: symbol2, notes: dist_exports.get(symbol2).notes };
      }
      const p = parseToken(roman);
      const root = dist_exports2.transpose(key, intervalOf(p));
      const symbol = `${root}${qualityFromToken(p)}`;
      return { roman, symbol, notes: dist_exports.get(symbol).notes };
    } catch {
      return { roman, symbol: roman, notes: [] };
    }
  }
  var MAJOR_DEG = { I: 1, ii: 2, iii: 3, IV: 4, V: 5, vi: 6, vii: 7 };
  var MINOR_DEG = { i: 1, ii: 2, "\u266DIII": 3, iv: 4, v: 5, "\u266DVI": 6, "\u266DVII": 7 };
  function baseRomanKC(roman) {
    var _a;
    const m = roman.match(/^(♭|#|b)?([ivIV]+)/);
    if (!m) return roman;
    return (m[1] === "b" ? "\u266D" : (_a = m[1]) != null ? _a : "") + m[2];
  }
  function extendChord(roman, key, mode, level) {
    const base = resolveRoman(roman, key);
    if (level === "triad" || !/^[♭#]?[ivIV]+$/.test(roman)) return base;
    const deg = (mode === "major" ? MAJOR_DEG : MINOR_DEG)[baseRomanKC(roman)];
    if (!deg) return base;
    try {
      const chords2 = mode === "major" ? dist_exports3.majorKey(key).chords : dist_exports3.minorKey(key).natural.chords;
      const sym = chords2[deg - 1];
      if (sym) {
        const notes2 = dist_exports.get(sym).notes;
        if (notes2.length) return { roman, symbol: sym, notes: notes2 };
      }
    } catch {
    }
    return base;
  }
  var DIATONIC = {
    major: ["I", "ii", "iii", "IV", "V", "vi", "vii\xB0"],
    minor: ["i", "ii\xB0", "\u266DIII", "iv", "v", "\u266DVI", "\u266DVII"]
  };
  function keyChords(key, mode) {
    return DIATONIC[mode].map((r) => resolveRoman(r, key));
  }

  // src/engine/notation.ts
  var STD_OPEN = [40, 45, 50, 55, 59, 64];
  function lowestFret(open, chroma3) {
    for (let f = 0; f <= 12; f++) if ((open + f) % 12 === chroma3) return f;
    return 0;
  }
  function tabVoicing(chordTones, opts = {}) {
    var _a, _b, _c;
    const open = (_a = opts.open) != null ? _a : STD_OPEN;
    const chromas = new Set(chordTones.map((n) => dist_exports2.chroma(n)));
    const rootChroma = (_b = dist_exports2.chroma(chordTones[0])) != null ? _b : 0;
    const frets = open.map(() => null);
    const f0 = lowestFret(open[0], rootChroma);
    const f1 = lowestFret((_c = open[1]) != null ? _c : open[0], rootChroma);
    const bassIdx = f0 <= f1 ? 0 : 1;
    frets[bassIdx] = bassIdx === 0 ? f0 : f1;
    let prev = open[bassIdx] + frets[bassIdx];
    for (let i = bassIdx + 1; i < open.length; i++) {
      const o = open[i];
      let chosen = null;
      for (let f = 0; f <= 12; f++) {
        const p = o + f;
        if (chromas.has(p % 12) && p > prev) {
          chosen = f;
          prev = p;
          break;
        }
      }
      if (chosen == null) {
        for (let f = 0; f <= 12; f++) {
          if (chromas.has((o + f) % 12)) {
            chosen = f;
            prev = o + f;
            break;
          }
        }
      }
      frets[i] = chosen;
    }
    return open.map((m, i) => ({ name: dist_exports2.pitchClass(dist_exports2.fromMidi(m)), fret: frets[i], openMidi: m }));
  }

  // src/engine/tuning.ts
  var TUNINGS = [
    { id: "standard", zh: "\u6A19\u6E96 EADGBE", open: [40, 45, 50, 55, 59, 64] },
    { id: "drop_d", zh: "Drop D", open: [38, 45, 50, 55, 59, 64] },
    { id: "dadgad", zh: "DADGAD", open: [38, 45, 50, 55, 57, 62] }
  ];
  function tuningOf(id) {
    var _a;
    return (_a = TUNINGS.find((t) => t.id === id)) != null ? _a : TUNINGS[0];
  }
  function transposePc(pc, semis) {
    var _a;
    const c = ((((_a = dist_exports2.chroma(pc)) != null ? _a : 0) + semis) % 12 + 12) % 12;
    return dist_exports2.pitchClass(dist_exports2.fromMidi(60 + c));
  }
  function shapeTones(chordTones, capo = 0) {
    return capo ? chordTones.map((n) => transposePc(n, -capo)) : chordTones;
  }
  function guitarShape(chordTones, tuning, capo = 0) {
    return tabVoicing(shapeTones(chordTones, capo), { open: tuning.open });
  }

  // src/engine/fretChord.ts
  function friendly(sym) {
    return sym.replace(/^([A-G][#b]?)M$/, "$1");
  }
  function detectChordFromFrets(frets, tuningId = "standard", capo = 0) {
    const tuning = tuningOf(tuningId);
    const midis = [];
    frets.forEach((f, i) => {
      if (f == null || f < 0) return;
      if (i >= tuning.open.length) return;
      midis.push(tuning.open[i] + f + capo);
    });
    if (midis.length < 2) return [];
    midis.sort((a, b) => a - b);
    const noteNames = midis.map((m) => dist_exports2.fromMidi(m));
    const detected = dist_exports.detect(noteNames, { assumePerfectFifth: true });
    const seen = /* @__PURE__ */ new Set();
    const rootPos = [];
    const inversions = [];
    for (const raw of detected) {
      const sym = friendly(raw);
      if (!sym || seen.has(sym)) continue;
      seen.add(sym);
      (sym.includes("/") ? inversions : rootPos).push(sym);
    }
    return [...rootPos, ...inversions];
  }

  // src/engine/voicing.ts
  function voiceChord(notes2, baseOctave = 4) {
    let prevMidi = -Infinity;
    let oct = baseOctave;
    const out = [];
    for (const n of notes2) {
      let midi2 = dist_exports2.midi(`${n}${oct}`);
      if (midi2 == null) continue;
      while (midi2 <= prevMidi) {
        oct++;
        midi2 = dist_exports2.midi(`${n}${oct}`);
      }
      out.push(`${n}${oct}`);
      prevMidi = midi2;
    }
    return out;
  }

  // src/engine/symbolChord.ts
  function normalizeTonalRoman(r) {
    const m = r.match(/^(b|#)?([IV]+)(.*)$/);
    if (!m) return null;
    const acc = m[1] === "b" ? "\u266D" : m[1] === "#" ? "#" : "";
    const upper = m[2];
    const q = m[3];
    const lower = upper.toLowerCase();
    if (/dim|°/.test(q)) return acc + lower + (q.includes("7") ? "\xB07" : "\xB0");
    if (/m7b5|ø/.test(q)) return acc + lower + "m7b5";
    if (/^m(?!aj)/.test(q) && !/^M/.test(q)) return acc + lower + q.slice(1);
    return acc + upper + q.replace(/^M(?=7)/, "maj");
  }
  function chromaSet(notes2) {
    const s = /* @__PURE__ */ new Set();
    for (const n of notes2) {
      const c = dist_exports2.chroma(n);
      if (c != null) s.add(c);
    }
    return s;
  }
  function sameChroma(a, b) {
    if (a.size === 0 || a.size !== b.size) return false;
    for (const x of a) if (!b.has(x)) return false;
    return true;
  }
  function symbolToRoman(symbol, key, _mode) {
    const clean = symbol.trim();
    if (!clean) return null;
    let cand = null;
    try {
      const r = dist_exports4.toRomanNumerals(key, [clean])[0];
      if (r) cand = normalizeTonalRoman(r);
    } catch {
      cand = null;
    }
    if (!cand) return null;
    const want = chromaSet(dist_exports.get(clean).notes);
    const got = chromaSet(resolveRoman(cand, key).notes);
    return sameChroma(want, got) ? cand : null;
  }
  function chordMidiFromSymbol(symbol, octave2 = 4) {
    const notes2 = dist_exports.get(symbol.trim()).notes;
    if (!notes2.length) return [];
    return voiceChord(notes2, octave2).map((n) => dist_exports2.midi(n)).filter((m) => m != null);
  }

  // data/transitions.json
  var transitions_default = {
    schemaVersion: 1,
    description: "\u6838\u5FC3\u548C\u5F26\u8F49\u79FB\u8868\u3002\u4EE5\u8ABF\u6027\u5167\u7684\u7F85\u99AC\u7D1A\u6578\u8868\u793A\uFF08\u8207\u5BE6\u969B key \u7121\u95DC\uFF0C\u7531 Tonal.js \u5728\u57F7\u884C\u671F\u6620\u5C04\u6210\u771F\u5BE6\u548C\u5F26\uFF09\u3002context \u5206 major / minor\u3002\u6BCF\u500B from \u7D1A\u6578\u5217\u51FA\u5019\u9078 to\uFF0C\u9644 category(safe|surprise|emotional)\u3001strength(0-1\uFF0C\u8D8A\u9AD8\u8D8A\u5E38\u898B/\u5B89\u5168)\u3001cadence(\u7D42\u6B62\u5F0F\u985E\u578B\u6216 null)\u3001feelings(\u5F15\u7528 feelings.json)\u3001note(\u767D\u8A71\u8AAA\u660E)\u3002\u7F85\u99AC\u7D1A\u6578\u6163\u4F8B\uFF1A\u5927\u5BEB=\u5927\u4E09\u548C\u5F26, \u5C0F\u5BEB=\u5C0F\u4E09\u548C\u5F26, \xB0=\u6E1B, 7=\u5C6C\u4E03, \u25B3=\u5927\u4E03; \u266D\u524D\u7DB4=\u964D\u534A\u97F3\u6839\u97F3\u7684\u501F\u7528\u548C\u5F26; V/x=\u6307\u5411 x \u7684\u4E8C\u7D1A\u5C6C\u548C\u5F26\u3002 \u3014v2: safe/surprise \u7684 strength \u5DF2\u7528 Chordonomicon 68\u842C\u9996\u771F\u5BE6\u8A9E\u6599\u91CD\u65B0\u6821\u6E96,\u4E26\u88DC\u5165\u9AD8\u983B\u7F3A\u6F0F\u8F49\u79FB;emotional \u8207 feelings/note \u7DAD\u6301\u624B\u5BEB\u3002\u3015",
    romanRef: {
      major: [
        "I",
        "ii",
        "iii",
        "IV",
        "V",
        "vi",
        "vii\xB0"
      ],
      minor: [
        "i",
        "ii\xB0",
        "\u266DIII",
        "iv",
        "v",
        "V",
        "\u266DVI",
        "\u266DVII",
        "vii\xB0"
      ],
      secondaryDominants: [
        "V/ii",
        "V/iii",
        "V/IV",
        "V/V",
        "V/vi"
      ],
      borrowedInMajor: [
        "iv",
        "\u266DIII",
        "\u266DVI",
        "\u266DVII",
        "ii\xB0",
        "v"
      ]
    },
    major: {
      I: [
        {
          to: "V/IV",
          category: "surprise",
          strength: 0.45,
          cadence: null,
          feelings: [
            "bluesy",
            "tension_pull"
          ],
          note: "\u628A I \u8B8A\u6210\u5C6C\u4E03 (I7)\uFF0C\u786C\u62C9\u53BB IV\uFF0C\u798F\u97F3/\u85CD\u8ABF\u5473\u3002"
        },
        {
          to: "iv",
          category: "emotional",
          strength: 0.35,
          cadence: null,
          feelings: [
            "heartbreak"
          ],
          note: "I \u76F4\u63A5\u63A5\u5C0F\u56DB\uFF0C\u6700\u5FEB\u7684\u50AC\u6DDA\u6377\u5F91\u3002"
        },
        {
          to: "IV",
          category: "safe",
          strength: 0.28,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u96E2\u5BB6\u3001\u5C55\u958B\uFF0C\u6700\u81EA\u7136\u7684\u7B2C\u4E00\u6B65\u3002"
        },
        {
          to: "V",
          category: "safe",
          strength: 0.28,
          cadence: null,
          feelings: [
            "bright_lift"
          ],
          note: "\u76F4\u63A5\u62C9\u9AD8\u5F35\u529B\uFF0C\u6E96\u5099\u885D\u3002"
        },
        {
          to: "ii",
          category: "safe",
          strength: 0.14,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u6EAB\u548C\u92EA\u9673\uFF0C\u901A\u5E38\u6E96\u5099\u63A5 V\u3002"
        },
        {
          to: "vi",
          category: "safe",
          strength: 0.11,
          cadence: null,
          feelings: [
            "gentle_turn",
            "unresolved_loop"
          ],
          note: "\u8F49\u5230\u95DC\u4FC2\u5C0F\u8ABF\uFF0C\u5E36\u9EDE\u611F\u6027\uFF0C\u5F88\u9069\u5408\u5FAA\u74B0\u3002"
        },
        {
          to: "\u266DVII",
          category: "surprise",
          strength: 0.08,
          cadence: null,
          feelings: [
            "bluesy"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 7%)"
        },
        {
          to: "iii",
          category: "surprise",
          strength: 0.07,
          cadence: null,
          feelings: [
            "gentle_turn"
          ],
          note: "\u5C11\u898B\u7684\u6587\u85DD\u8272\u5F69\uFF0CCity Pop \u5E38\u7528\u3002"
        }
      ],
      ii: [
        {
          to: "vii\xB0",
          category: "safe",
          strength: 0.5,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u7D93\u904E\u97F3\uFF0C\u63A8\u5411 I\u3002"
        },
        {
          to: "V/V",
          category: "surprise",
          strength: 0.4,
          cadence: null,
          feelings: [
            "tension_pull"
          ],
          note: "\u52A0\u500D\u5F35\u529B\u518D\u53BB V\u3002"
        },
        {
          to: "I",
          category: "safe",
          strength: 0.31,
          cadence: null,
          feelings: [
            "resolve_home"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 30%)"
        },
        {
          to: "V",
          category: "safe",
          strength: 0.25,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "ii\u2013V \u9EC3\u91D1\u5957\u8DEF\uFF0C\u5F37\u70C8\u63A8\u9032\u3002"
        },
        {
          to: "IV",
          category: "surprise",
          strength: 0.12,
          cadence: null,
          feelings: [
            "bright_lift"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 12%)"
        },
        {
          to: "iii",
          category: "surprise",
          strength: 0.1,
          cadence: null,
          feelings: [
            "gentle_turn"
          ],
          note: "\u67D4\u548C\u5074\u79FB\u3002"
        },
        {
          to: "\u266DVII",
          category: "surprise",
          strength: 0.1,
          cadence: null,
          feelings: [
            "bluesy"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 10%)"
        },
        {
          to: "vi",
          category: "surprise",
          strength: 0.08,
          cadence: null,
          feelings: [
            "gentle_turn"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 7%)"
        }
      ],
      iii: [
        {
          to: "I",
          category: "safe",
          strength: 0.25,
          cadence: null,
          feelings: [
            "resolve_home"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 24%)"
        },
        {
          to: "ii",
          category: "surprise",
          strength: 0.22,
          cadence: null,
          feelings: [
            "gentle_turn"
          ],
          note: "\u4E0B\u884C\u92EA\u9673\u3002"
        },
        {
          to: "vi",
          category: "safe",
          strength: 0.2,
          cadence: null,
          feelings: [
            "gentle_turn"
          ],
          note: "\u9806\u52E2\u843D\u5230 vi\u3002"
        },
        {
          to: "IV",
          category: "safe",
          strength: 0.16,
          cadence: null,
          feelings: [
            "bright_lift"
          ],
          note: "\u7D93\u5178 iii\u2192IV \u62AC\u5347\uFF0C\u4E3B\u6B4C\u9032\u526F\u6B4C\u7684\u6A4B\u3002"
        },
        {
          to: "V",
          category: "surprise",
          strength: 0.11,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 10%)"
        }
      ],
      IV: [
        {
          to: "iv",
          category: "emotional",
          strength: 0.7,
          cadence: null,
          feelings: [
            "heartbreak"
          ],
          note: "\u7D93\u5178\u300E\u60F3\u54ED\u548C\u5F26\u300F\uFF0CIV\u2192iv\u2192I \u77AC\u9593\u63EA\u5FC3\u3002"
        },
        {
          to: "I",
          category: "safe",
          strength: 0.5,
          cadence: "plagal",
          feelings: [
            "resolve_home"
          ],
          note: "Amen \u7D42\u6B62\uFF0C\u67D4\u548C\u56DE\u5BB6\u3002"
        },
        {
          to: "V/V",
          category: "surprise",
          strength: 0.4,
          cadence: null,
          feelings: [
            "tension_pull"
          ],
          note: "\u628A\u63A8\u529B\u5347\u7D1A\u3002"
        },
        {
          to: "\u266DVII",
          category: "emotional",
          strength: 0.4,
          cadence: null,
          feelings: [
            "cinematic",
            "bluesy"
          ],
          note: "\u8F49\u53BB\u96E2\u8ABF\u8272\u5F69\uFF0C\u6416\u6EFE/\u96FB\u5F71\u611F\u3002"
        },
        {
          to: "V",
          category: "safe",
          strength: 0.22,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u6700\u81EA\u7136\u7684\u63A8\u9032\uFF0C\u6E96\u5099\u89E3\u6C7A\u3002"
        },
        {
          to: "ii",
          category: "safe",
          strength: 0.08,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u518D\u92EA\u4E00\u5C64 predominant\u3002"
        },
        {
          to: "vi",
          category: "surprise",
          strength: 0.06,
          cadence: null,
          feelings: [
            "gentle_turn"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 6%)"
        }
      ],
      V: [
        {
          to: "I",
          category: "safe",
          strength: 0.48,
          cadence: "authentic",
          feelings: [
            "resolve_home"
          ],
          note: "\u6B63\u683C\u7D42\u6B62\uFF0C\u6700\u5F37\u7684\u89E3\u6C7A\u611F\u3002"
        },
        {
          to: "IV",
          category: "surprise",
          strength: 0.17,
          cadence: null,
          feelings: [
            "bluesy"
          ],
          note: "\u9000\u56DE IV\uFF0C\u6416\u6EFE/\u85CD\u8ABF\u7684\u9000\u884C\u611F\u3002"
        },
        {
          to: "vi",
          category: "surprise",
          strength: 0.12,
          cadence: "deceptive",
          feelings: [
            "surprise_deceptive"
          ],
          note: "\u5047\u7D42\u6B62\uFF0C\u672C\u4EE5\u70BA\u56DE\u5BB6\u537B\u8F49\u5230 vi\uFF0C\u67F3\u6697\u82B1\u660E\u3002"
        },
        {
          to: "ii",
          category: "surprise",
          strength: 0.12,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 11%)"
        }
      ],
      vi: [
        {
          to: "V/V",
          category: "surprise",
          strength: 0.35,
          cadence: null,
          feelings: [
            "tension_pull"
          ],
          note: "\u52A0\u6599\u63A8\u9032\u3002"
        },
        {
          to: "IV",
          category: "safe",
          strength: 0.28,
          cadence: null,
          feelings: [
            "unresolved_loop",
            "forward_push"
          ],
          note: "Axis \u795E\u5FAA\u74B0 vi\u2013IV\u2013I\u2013V \u7684\u6838\u5FC3\u3002"
        },
        {
          to: "V",
          category: "safe",
          strength: 0.21,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u76F4\u63A5\u62C9\u5F35\u529B\u3002"
        },
        {
          to: "I",
          category: "safe",
          strength: 0.18,
          cadence: null,
          feelings: [
            "resolve_home"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 18%)"
        },
        {
          to: "ii",
          category: "safe",
          strength: 0.16,
          cadence: null,
          feelings: [
            "gentle_turn"
          ],
          note: "\u4E0B\u884C\u92EA\u9673\u5230 ii\u3002"
        },
        {
          to: "iii",
          category: "surprise",
          strength: 0.08,
          cadence: null,
          feelings: [
            "gentle_turn"
          ],
          note: "\u6587\u85DD\u5074\u79FB\u3002"
        }
      ],
      "vii\xB0": [
        {
          to: "I",
          category: "safe",
          strength: 0.41,
          cadence: "authentic",
          feelings: [
            "resolve_home"
          ],
          note: "\u6E1B\u548C\u5F26\u7684\u9818\u97F3\u5F37\u70C8\u89E3\u6C7A\u56DE I\u3002"
        },
        {
          to: "iii",
          category: "safe",
          strength: 0.25,
          cadence: null,
          feelings: [
            "gentle_turn"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 25%)"
        },
        {
          to: "vi",
          category: "surprise",
          strength: 0.13,
          cadence: null,
          feelings: [
            "gentle_turn"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 13%)"
        },
        {
          to: "V",
          category: "safe",
          strength: 0.06,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u7D93\u904E\u3002"
        },
        {
          to: "ii",
          category: "surprise",
          strength: 0.06,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 6%)"
        }
      ],
      iv: [
        {
          to: "I",
          category: "emotional",
          strength: 0.85,
          cadence: "plagal",
          feelings: [
            "heartbreak",
            "resolve_home"
          ],
          note: "\u5C0F\u56DB\u56DE I\uFF0C\u50AC\u6DDA\u5F8C\u843D\u5730\u3002"
        },
        {
          to: "\u266DVII",
          category: "surprise",
          strength: 0.14,
          cadence: null,
          feelings: [
            "bluesy"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 14%)"
        },
        {
          to: "V",
          category: "safe",
          strength: 0.1,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u63EA\u5FC3\u5F8C\u518D\u63A8\u3002"
        }
      ],
      "\u266DVII": [
        {
          to: "I",
          category: "emotional",
          strength: 0.7,
          cadence: null,
          feelings: [
            "cinematic",
            "resolve_home"
          ],
          note: "\u6416\u6EFE/Aeolian \u7D42\u6B62 \u266DVII\u2192I\uFF0C\u660E\u4EAE\u53C8\u5E36\u91CE\u6027\u3002"
        },
        {
          to: "\u266DVI",
          category: "emotional",
          strength: 0.45,
          cadence: null,
          feelings: [
            "cinematic"
          ],
          note: "\u96E2\u8ABF\u5806\u758A\uFF0C\u53F2\u8A69\u611F\u52A0\u91CD\u3002"
        },
        {
          to: "IV",
          category: "safe",
          strength: 0.37,
          cadence: null,
          feelings: [
            "bright_lift"
          ],
          note: "\u7E7C\u7E8C\u5F80\u4EAE\u8655\u8D70\u3002"
        },
        {
          to: "ii",
          category: "surprise",
          strength: 0.09,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 9%)"
        },
        {
          to: "V",
          category: "surprise",
          strength: 0.07,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 6%)"
        }
      ],
      "\u266DVI": [
        {
          to: "\u266DVII",
          category: "emotional",
          strength: 0.7,
          cadence: null,
          feelings: [
            "cinematic"
          ],
          note: "\u266DVI\u2192\u266DVII\u2192I \u7D93\u5178\u53F2\u8A69\u4E09\u9023\u3002"
        },
        {
          to: "I",
          category: "emotional",
          strength: 0.5,
          cadence: null,
          feelings: [
            "cinematic",
            "resolve_home"
          ],
          note: "\u76F4\u63A5\u4EAE\u56DE\u5BB6\uFF0C\u6232\u5287\u6027\u5C0D\u6BD4\u3002"
        },
        {
          to: "V",
          category: "surprise",
          strength: 0.26,
          cadence: null,
          feelings: [
            "tension_pull"
          ],
          note: "\u62C9\u56DE\u5C6C\u548C\u5F26\u88FD\u9020\u5F35\u529B\u3002"
        },
        {
          to: "IV",
          category: "surprise",
          strength: 0.1,
          cadence: null,
          feelings: [
            "bright_lift"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 9%)"
        },
        {
          to: "vi",
          category: "surprise",
          strength: 0.08,
          cadence: null,
          feelings: [
            "gentle_turn"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 8%)"
        },
        {
          to: "\u266DIII",
          category: "surprise",
          strength: 0.08,
          cadence: null,
          feelings: [
            "cinematic"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 8%)"
        }
      ],
      "V/V": [
        {
          to: "V",
          category: "surprise",
          strength: 0.9,
          cadence: null,
          feelings: [
            "tension_pull"
          ],
          note: "\u4E8C\u7D1A\u5C6C\u89E3\u6C7A\u5230 V\uFF0C\u5F37\u70C8\u727D\u5F15\u3002"
        }
      ],
      "V/vi": [
        {
          to: "vi",
          category: "surprise",
          strength: 0.9,
          cadence: null,
          feelings: [
            "tension_pull"
          ],
          note: "\u786C\u62C9\u53BB vi\uFF0C\u8B93\u5C0F\u8ABF\u76EE\u6A19\u66F4\u88AB\u5F37\u8ABF\u3002"
        }
      ],
      "V/IV": [
        {
          to: "IV",
          category: "surprise",
          strength: 0.9,
          cadence: null,
          feelings: [
            "bluesy",
            "tension_pull"
          ],
          note: "I7 \u89E3\u6C7A\u5230 IV\uFF0C\u798F\u97F3/\u85CD\u8ABF\u5473\u3002"
        }
      ],
      "V/ii": [
        {
          to: "ii",
          category: "surprise",
          strength: 0.85,
          cadence: null,
          feelings: [
            "tension_pull"
          ],
          note: "\u5F37\u62C9\u53BB ii\u3002"
        }
      ]
    },
    minor: {
      i: [
        {
          to: "V",
          category: "safe",
          strength: 0.75,
          cadence: null,
          feelings: [
            "tension_pull"
          ],
          note: "\u501F\u548C\u8072\u5C0F\u8ABF\u7684\u5927 V\uFF0C\u88FD\u9020\u56DE\u5BB6\u524D\u7684\u5F37\u5F35\u529B\u3002"
        },
        {
          to: "\u266DVI",
          category: "safe",
          strength: 0.25,
          cadence: null,
          feelings: [
            "cinematic",
            "gentle_turn"
          ],
          note: "\u6EAB\u6696\u53C8\u5E36\u53F2\u8A69\u611F\u7684\u8F49\u6298\u3002"
        },
        {
          to: "iv",
          category: "safe",
          strength: 0.21,
          cadence: null,
          feelings: [
            "dark_turn",
            "forward_push"
          ],
          note: "\u5C0F\u8ABF\u7684\u81EA\u7136\u5C55\u958B\u3002"
        },
        {
          to: "\u266DVII",
          category: "safe",
          strength: 0.19,
          cadence: null,
          feelings: [
            "forward_push",
            "bluesy"
          ],
          note: "\u6416\u6EFE/\u6C11\u8B20\u5473\u63A8\u9032\u3002"
        },
        {
          to: "\u266DIII",
          category: "surprise",
          strength: 0.18,
          cadence: null,
          feelings: [
            "bright_lift"
          ],
          note: "\u8F49\u5230\u95DC\u4FC2\u5927\u8ABF\u7684\u660E\u4EAE\u5C0D\u6BD4\u3002"
        },
        {
          to: "v",
          category: "surprise",
          strength: 0.13,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 13%)"
        }
      ],
      "ii\xB0": [
        {
          to: "V",
          category: "safe",
          strength: 0.9,
          cadence: null,
          feelings: [
            "tension_pull"
          ],
          note: "\u63A8\u5411 V\uFF0C\u5C0F\u8ABF\u7684 ii\u2013V\u3002"
        },
        {
          to: "i",
          category: "safe",
          strength: 0.3,
          cadence: null,
          feelings: [
            "dark_turn"
          ],
          note: "\u76F4\u63A5\u843D\u56DE i\u3002"
        },
        {
          to: "v",
          category: "safe",
          strength: 0.28,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 27%)"
        },
        {
          to: "\u266DIII",
          category: "surprise",
          strength: 0.17,
          cadence: null,
          feelings: [
            "cinematic"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 17%)"
        },
        {
          to: "\u266DVII",
          category: "surprise",
          strength: 0.07,
          cadence: null,
          feelings: [
            "bluesy"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 6%)"
        },
        {
          to: "iv",
          category: "surprise",
          strength: 0.07,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 6%)"
        }
      ],
      "\u266DIII": [
        {
          to: "\u266DVII",
          category: "safe",
          strength: 0.28,
          cadence: null,
          feelings: [
            "bright_lift"
          ],
          note: "\u5F80\u4E0A\u63A8\u3002"
        },
        {
          to: "i",
          category: "safe",
          strength: 0.22,
          cadence: null,
          feelings: [
            "resolve_home"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 22%)"
        },
        {
          to: "\u266DVI",
          category: "safe",
          strength: 0.18,
          cadence: null,
          feelings: [
            "gentle_turn"
          ],
          note: "\u660E\u4EAE\u5074\u79FB\u3002"
        },
        {
          to: "iv",
          category: "surprise",
          strength: 0.17,
          cadence: null,
          feelings: [
            "dark_turn"
          ],
          note: "\u8F49\u56DE\u9670\u6697\u3002"
        },
        {
          to: "v",
          category: "surprise",
          strength: 0.1,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 9%)"
        }
      ],
      iv: [
        {
          to: "V",
          category: "safe",
          strength: 0.85,
          cadence: null,
          feelings: [
            "tension_pull"
          ],
          note: "\u63A8\u5411 V\uFF0C\u6E96\u5099\u5F37\u89E3\u6C7A\u3002"
        },
        {
          to: "i",
          category: "safe",
          strength: 0.34,
          cadence: "plagal",
          feelings: [
            "resolve_home",
            "dark_turn"
          ],
          note: "\u5C0F\u8ABF plagal\uFF0C\u6C89\u7A69\u843D\u5730\u3002"
        },
        {
          to: "\u266DVII",
          category: "surprise",
          strength: 0.18,
          cadence: null,
          feelings: [
            "bluesy"
          ],
          note: "\u9000\u884C\u7684\u6416\u6EFE\u5473\u3002"
        },
        {
          to: "\u266DIII",
          category: "surprise",
          strength: 0.16,
          cadence: null,
          feelings: [
            "cinematic"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 16%)"
        },
        {
          to: "v",
          category: "surprise",
          strength: 0.15,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 14%)"
        },
        {
          to: "\u266DVI",
          category: "surprise",
          strength: 0.14,
          cadence: null,
          feelings: [
            "cinematic"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 14%)"
        }
      ],
      v: [
        {
          to: "i",
          category: "safe",
          strength: 0.59,
          cadence: null,
          feelings: [
            "dark_turn",
            "resolve_home"
          ],
          note: "\u81EA\u7136\u5C0F\u8ABF\u7684\u5F31\u89E3\u6C7A\uFF0C\u6BD4\u8F03\u53E4\u6A38\u3002"
        },
        {
          to: "\u266DVI",
          category: "surprise",
          strength: 0.13,
          cadence: null,
          feelings: [
            "cinematic"
          ],
          note: "\u5074\u79FB\u5230 \u266DVI\u3002"
        },
        {
          to: "iv",
          category: "surprise",
          strength: 0.11,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 11%)"
        },
        {
          to: "\u266DIII",
          category: "surprise",
          strength: 0.07,
          cadence: null,
          feelings: [
            "cinematic"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 7%)"
        }
      ],
      V: [
        {
          to: "i",
          category: "safe",
          strength: 1,
          cadence: "authentic",
          feelings: [
            "resolve_home"
          ],
          note: "\u548C\u8072\u5C0F\u8ABF\u5927 V\u2192i\uFF0C\u6700\u5F37\u89E3\u6C7A\u3002"
        },
        {
          to: "\u266DVI",
          category: "surprise",
          strength: 0.65,
          cadence: "deceptive",
          feelings: [
            "surprise_deceptive",
            "cinematic"
          ],
          note: "\u5C0F\u8ABF\u5047\u7D42\u6B62\uFF0C\u6232\u5287\u6027\u5341\u8DB3\u3002"
        },
        {
          to: "I",
          category: "surprise",
          strength: 0.4,
          cadence: "picardy",
          feelings: [
            "bright_lift",
            "resolve_home"
          ],
          note: "Picardy \u4E09\u5EA6\uFF0C\u7D50\u5C3E\u8F49\u5927\u8ABF\uFF0C\u610F\u5916\u7684\u5149\u660E\u3002"
        }
      ],
      "\u266DVI": [
        {
          to: "V",
          category: "safe",
          strength: 0.6,
          cadence: null,
          feelings: [
            "tension_pull"
          ],
          note: "\u62C9\u53BB V\u3002"
        },
        {
          to: "\u266DVII",
          category: "safe",
          strength: 0.27,
          cadence: null,
          feelings: [
            "cinematic",
            "forward_push"
          ],
          note: "\u266DVI\u2192\u266DVII\u2192i \u53F2\u8A69\u4E09\u9023\u3002"
        },
        {
          to: "\u266DIII",
          category: "safe",
          strength: 0.25,
          cadence: null,
          feelings: [
            "cinematic"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 25%)"
        },
        {
          to: "i",
          category: "safe",
          strength: 0.21,
          cadence: null,
          feelings: [
            "resolve_home"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 21%)"
        },
        {
          to: "iv",
          category: "surprise",
          strength: 0.12,
          cadence: null,
          feelings: [
            "dark_turn"
          ],
          note: "\u56DE\u5230\u9670\u6697\u3002"
        },
        {
          to: "v",
          category: "surprise",
          strength: 0.12,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 11%)"
        }
      ],
      "\u266DVII": [
        {
          to: "i",
          category: "safe",
          strength: 0.42,
          cadence: null,
          feelings: [
            "resolve_home",
            "bluesy"
          ],
          note: "Aeolian \u7D42\u6B62\uFF0C\u56DE\u5BB6\u4F46\u5E36\u91CE\u6027\u3002"
        },
        {
          to: "\u266DIII",
          category: "safe",
          strength: 0.19,
          cadence: null,
          feelings: [
            "bright_lift"
          ],
          note: "\u5F80\u95DC\u4FC2\u5927\u8ABF\u660E\u4EAE\u8655\u8D70\u3002"
        },
        {
          to: "\u266DVI",
          category: "surprise",
          strength: 0.18,
          cadence: null,
          feelings: [
            "cinematic"
          ],
          note: "\u96E2\u8ABF\u5074\u79FB\u3002"
        },
        {
          to: "iv",
          category: "surprise",
          strength: 0.12,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 12%)"
        },
        {
          to: "v",
          category: "surprise",
          strength: 0.07,
          cadence: null,
          feelings: [
            "forward_push"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 6%)"
        }
      ],
      "vii\xB0": [
        {
          to: "i",
          category: "safe",
          strength: 0.31,
          cadence: "authentic",
          feelings: [
            "resolve_home"
          ],
          note: "\u548C\u8072\u5C0F\u8ABF\u9818\u97F3\u6E1B\u548C\u5F26\u5F37\u89E3\u6C7A\u3002"
        },
        {
          to: "\u266DVII",
          category: "surprise",
          strength: 0.17,
          cadence: null,
          feelings: [
            "bluesy"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 16%)"
        },
        {
          to: "IV",
          category: "surprise",
          strength: 0.12,
          cadence: null,
          feelings: [
            "bright_lift"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 11%)"
        },
        {
          to: "\u266DVI",
          category: "surprise",
          strength: 0.12,
          cadence: null,
          feelings: [
            "cinematic"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 11%)"
        },
        {
          to: "\u266DIII",
          category: "surprise",
          strength: 0.11,
          cadence: null,
          feelings: [
            "cinematic"
          ],
          note: "\u771F\u6B4C\u5E38\u898B\u63A5\u6CD5(\u7D04 11%)"
        }
      ],
      I: [
        {
          to: "iv",
          category: "surprise",
          strength: 0.4,
          cadence: null,
          feelings: [
            "bright_lift",
            "dark_turn"
          ],
          note: "Picardy \u5927\u4E3B\u548C\u5F26\u591A\u534A\u4F5C\u7D50\u5C3E\uFF1B\u82E5\u8981\u7E8C\u884C\u5E38\u62C9\u56DE iv \u88FD\u9020\u660E\u6697\u5C0D\u6BD4\u3002"
        },
        {
          to: "\u266DVI",
          category: "surprise",
          strength: 0.35,
          cadence: null,
          feelings: [
            "cinematic"
          ],
          note: "\u660E\u4EAE\u4E3B\u548C\u5F26\u8F49 \u266DVI\uFF0C\u6232\u5287\u6027\u96E2\u8ABF\u3002"
        }
      ]
    }
  };

  // data/feelings.json
  var feelings_default = {
    schemaVersion: 1,
    description: "\u611F\u89BA\u6A19\u7C64\u5B57\u5178\u3002\u6BCF\u500B\u548C\u5F26\u8D70\u5411 (transition) \u6703\u5F15\u7528\u4E00\u5230\u591A\u500B feeling id\uFF0CUI \u7528\u4F86\u986F\u793A\u300E\u6703\u6709\u4EC0\u9EBC\u8072\u97FF\u300F\u8207\u5206\u7D44\u984F\u8272\u3002energy 0-1 \u8D8A\u9AD8\u8D8A\u6FC0\u6602\uFF1Bvalence 0-1 \u8D8A\u9AD8\u8D8A\u660E\u4EAE\u6B63\u5411\uFF1BcolorGroup \u5C0D\u61C9 UI \u4E09\u7C43\u5206\u985E (safe/surprise/emotional)\u3002",
    feelings: {
      resolve_home: {
        zh: "\u5713\u6EFF\u843D\u5730\u3001\u56DE\u5230\u5BB6",
        desc: "\u5F35\u529B\u5B8C\u5168\u91CB\u653E\uFF0C\u50CF\u53E5\u9EDE\u3002\u6700\u5E38\u898B\u65BC V\u2192I\u3001\u266DVII\u2192i\u3002",
        energy: 0.3,
        valence: 0.8,
        colorGroup: "safe"
      },
      forward_push: {
        zh: "\u5F80\u524D\u63A8\u9032\u3001\u88FD\u9020\u671F\u5F85",
        desc: "\u628A\u97F3\u6A02\u5F80\u4E0B\u4E00\u6B65\u63A8\uFF0C\u7522\u751F\u300E\u9084\u6C92\u7D50\u675F\u300F\u7684\u524D\u9032\u611F\u3002\u5982 IV\u2192V\u3001ii\u2192V\u3002",
        energy: 0.6,
        valence: 0.6,
        colorGroup: "safe"
      },
      bright_lift: {
        zh: "\u660E\u4EAE\u62AC\u5347",
        desc: "\u4EAE\u5EA6\u4E0A\u5347\u3001\u60C5\u7DD2\u5F80\u4E0A\u3002\u5E38\u7528\u5728\u4E3B\u6B4C\u9032\u526F\u6B4C\u7684\u6A4B\u6BB5\uFF0C\u5982 iii\u2192IV\u3001I\u2192V\u3002",
        energy: 0.7,
        valence: 0.85,
        colorGroup: "safe"
      },
      gentle_turn: {
        zh: "\u67D4\u548C\u8F49\u6298\u3001\u6587\u85DD",
        desc: "\u4E0D\u5F37\u70C8\u4F46\u6709\u8272\u5F69\u7684\u8F49\u5411\uFF0C\u5E36\u9EDE\u611F\u6027\u8207\u7D30\u81A9\u3002\u5982 I\u2192iii\u3001vi\u2192iii\u3002",
        energy: 0.4,
        valence: 0.55,
        colorGroup: "surprise"
      },
      tension_pull: {
        zh: "\u7DCA\u5F35\u62C9\u529B\uFF08\u5C6C\u548C\u5F26\uFF09",
        desc: "\u5C6C\u4E03/\u4E8C\u7D1A\u5C6C\u7684\u5F37\u70C8\u727D\u5F15\uFF0C\u903C\u8457\u8033\u6735\u60F3\u5F80\u76EE\u6A19\u548C\u5F26\u89E3\u6C7A\u3002\u5982 V/V\u2192V\u3002",
        energy: 0.75,
        valence: 0.45,
        colorGroup: "surprise"
      },
      surprise_deceptive: {
        zh: "\u610F\u5916\u3001\u67F3\u6697\u82B1\u660E",
        desc: "\u672C\u4F86\u9810\u671F\u56DE\u5BB6\u537B\u8F49\u5230\u5225\u8655\uFF0C\u88FD\u9020\u9A5A\u559C\u3002\u7D93\u5178\u5047\u7D42\u6B62 V\u2192vi\u3002",
        energy: 0.6,
        valence: 0.5,
        colorGroup: "surprise"
      },
      heartbreak: {
        zh: "\u63EA\u5FC3\u3001\u60F3\u54ED\uFF08\u5C0F\u56DB\uFF09",
        desc: "\u5927\u8ABF\u4E2D\u501F\u7528\u5C0F\u8ABF\u7684 iv\uFF0C\u77AC\u9593\u63EA\u5FC3\u3002\u6D41\u884C\u6292\u60C5\u7684\u50AC\u6DDA\u795E\u5668\u3002\u5982 IV\u2192iv\u2192I\u3002",
        energy: 0.45,
        valence: 0.2,
        colorGroup: "emotional"
      },
      cinematic: {
        zh: "\u96FB\u5F71\u611F\u3001\u53F2\u8A69\u96E2\u8ABF",
        desc: "\u266DVI/\u266DVII \u7B49\u8ABF\u5F0F\u6DF7\u5408\uFF0C\u5E36\u4F86\u5EE3\u95CA\u3001\u53F2\u8A69\u3001\u5947\u5E7B\u7684\u756B\u9762\u611F\u3002",
        energy: 0.7,
        valence: 0.4,
        colorGroup: "emotional"
      },
      dreamy: {
        zh: "\u5922\u5E7B\u3001\u6F02\u6D6E",
        desc: "\u5927\u4E03\u3001\u52A0\u4E5D\u7B49\u5EF6\u4F38\u97F3\u5E36\u4F86\u6F02\u6D6E\u6175\u61F6\u611F\u3002City Pop / Lo-fi \u7684\u62DB\u724C\u3002",
        energy: 0.35,
        valence: 0.7,
        colorGroup: "emotional"
      },
      dark_turn: {
        zh: "\u8F49\u6697\u3001\u9670\u9B31",
        desc: "\u5F80\u5C0F\u8ABF\u6216\u6E1B\u548C\u5F26\u50BE\u659C\uFF0C\u6C23\u6C1B\u8B8A\u6C89\u3001\u8B8A\u9ED1\u3002",
        energy: 0.5,
        valence: 0.15,
        colorGroup: "emotional"
      },
      bluesy: {
        zh: "\u85CD\u8ABF\u5473\u3001\u7C97\u7377",
        desc: "\u5C6C\u4E03\u9000\u884C\u3001\u964D\u4E09\u97F3\u7684\u85CD\u8ABF\u8272\u5F69\u3002\u5982 V\u2192IV\u3001I7\u2192IV\u3002",
        energy: 0.6,
        valence: 0.45,
        colorGroup: "surprise"
      },
      jazzy_smooth: {
        zh: "\u7235\u58EB\u6ED1\u9806\u3001\u4E16\u6545",
        desc: "\u4E03\u548C\u5F26\u8207\u4E8C\u7D1A\u5C6C\u5E36\u4F86\u7684\u5E73\u9806\u3001\u90FD\u6703\u3001\u4E16\u6545\u611F\u3002\u5982 ii7\u2192V7\u2192I\u03947\u3002",
        energy: 0.45,
        valence: 0.6,
        colorGroup: "surprise"
      },
      unresolved_loop: {
        zh: "\u61F8\u800C\u672A\u6C7A\u3001\u9069\u5408\u5FAA\u74B0",
        desc: "\u523B\u610F\u4E0D\u56DE\u5BB6\uFF0C\u8B93\u6BB5\u843D\u80FD\u7121\u9650\u5FAA\u74B0\u3002\u9069\u5408\u4E3B\u6B4C\u92EA\u5E95\u3002\u5982 vi\u2192IV\u2192I\u2192V\u3002",
        energy: 0.5,
        valence: 0.55,
        colorGroup: "safe"
      }
    }
  };

  // data/genres.json
  var genres_default = {
    schemaVersion: 1,
    description: "\u66F2\u98A8\u8A2D\u5B9A\u6A94\u3002\u5207\u63DB\u66F2\u98A8 = \u63DB\u4E00\u4EFD\u504F\u597D\u8A2D\u5B9A\uFF0C\u7528\u4F86\u91CD\u65B0\u6392\u5E8F transitions\u3001\u5957\u7528\u9810\u8A2D\u548C\u5F26\u5EF6\u4F38\u3001\u63A8\u85A6 voicing \u8207\u5F8B\u52D5\u3002chordQuality=\u8A72\u66F2\u98A8\u548C\u5F26\u9810\u8A2D\u52A0\u5E7E\u5EA6(triad|sixth|seventh|extended)\u3002favorTransitions=\u9019\u4E9B\u8D70\u5411\u52A0\u6B0A\u63D0\u5347\u3002favorBorrowed=\u504F\u597D\u7684\u501F\u7528/\u96E2\u8ABF\u548C\u5F26\u3002scaleDefaults=Solo/\u65CB\u5F8B\u9810\u8A2D\u97F3\u968E(\u5F15\u7528 scales.json id)\u3002tempo=\u5E38\u898B BPM \u5340\u9593\u3002signatureProgressionIds=\u62DB\u724C\u9032\u884C(\u5F15\u7528 progressions.json id\uFF0C\u53EF\u4E00\u9375\u5957\u7528)\u3002",
    genres: {
      pop: {
        zh: "\u6D41\u884C Pop",
        chordQuality: "triad",
        favorTransitions: ["I-V", "V-vi", "vi-IV", "IV-I", "IV-V"],
        favorBorrowed: ["iv"],
        scaleDefaults: ["major_pentatonic", "ionian"],
        tempo: [90, 130],
        signatureProgressionIds: ["axis_1564", "axis_6415"],
        voicingNotes: "\u958B\u653E\u4E09\u548C\u5F26\u3001\u8F49\u4F4D\u8B93\u4F4E\u97F3\u7DDA\u6D41\u66A2\uFF0C\u526F\u6B4C\u53EF\u52A0 sus4 \u91CB\u653E\u3002"
      },
      ballad: {
        zh: "\u6292\u60C5 Ballad",
        chordQuality: "seventh",
        favorTransitions: ["IV-iv", "iv-I", "I-iii", "vi-IV"],
        favorBorrowed: ["iv", "\u266DVII"],
        scaleDefaults: ["ionian", "aeolian"],
        tempo: [60, 80],
        signatureProgressionIds: ["pachelbel", "iii_minor_iv", "minor_1465"],
        voicingNotes: "\u5927\u91CF\u5927\u4E03\u8207\u5C0F\u56DB\u50AC\u6DDA\uFF0C\u92FC\u7434\u7436\u97F3\u3001\u7559\u767D\u7D66\u4EBA\u8072\u3002"
      },
      citypop: {
        zh: "City Pop / J-Pop",
        chordQuality: "extended",
        favorTransitions: ["I-iii", "IV-V", "ii-V", "iii-vi"],
        favorBorrowed: ["V/vi", "V/V", "\u266DIII"],
        scaleDefaults: ["lydian", "dorian", "major_pentatonic"],
        tempo: [95, 118],
        signatureProgressionIds: ["royal_road", "royal_road_7", "lofi_2536"],
        voicingNotes: "maj7/9\u3001II\u25B3\u3001\u8F49\u4F4D\u4F4E\u97F3\u7DDA\uFF0C\u660E\u4EAE\u6F02\u6D6E\uFF0C\u96FB\u92FC\u7434 + \u6ED1\u9806\u8C9D\u65AF\u3002"
      },
      rnb_neosoul: {
        zh: "R&B / Neo-Soul",
        chordQuality: "extended",
        favorTransitions: ["ii-V", "I-IV", "vi-ii"],
        favorBorrowed: ["iv", "\u266DIII", "V/V"],
        scaleDefaults: ["dorian", "minor_pentatonic", "mixolydian"],
        tempo: [60, 95],
        signatureProgressionIds: ["ii_v_i", "maj_to_minoriv", "descending_neosoul", "gospel_turn"],
        voicingNotes: "9/11/13 \u5EF6\u4F38\u3001\u534A\u97F3\u6ED1\u884C\u3001\u6A21\u7CCA\u89E3\u6C7A\uFF0C\u53CD\u62CD\u5207\u5206\u3002"
      },
      jazz: {
        zh: "\u7235\u58EB Jazz",
        chordQuality: "extended",
        favorTransitions: ["ii-V", "V-I", "iii-vi", "vi-ii"],
        favorBorrowed: ["V/ii", "V/V", "V/vi"],
        scaleDefaults: ["dorian", "mixolydian", "altered", "melodic_minor"],
        tempo: [110, 220],
        signatureProgressionIds: ["ii_v_i", "i_vi_ii_v", "circle_of_fifths", "minor_ii_v_i"],
        voicingNotes: "ii\u2013V\u2013I \u70BA\u9AA8\u5E79\u3001\u4E09\u5168\u97F3\u4EE3\u7406\u3001guide tone \u9818\u8072\uFF0C\u9F13\u52F5\u96E2\u8ABF\u5F35\u529B\u97F3\u3002"
      },
      blues: {
        zh: "\u85CD\u8ABF Blues",
        chordQuality: "seventh",
        favorTransitions: ["I-IV", "IV-I", "V-IV", "V-I"],
        favorBorrowed: ["V/IV"],
        scaleDefaults: ["minor_pentatonic", "blues", "mixolydian"],
        tempo: [70, 130],
        signatureProgressionIds: ["twelve_bar_blues", "twelve_bar_quickchange", "minor_blues"],
        voicingNotes: "12 \u5C0F\u7BC0\u3001\u5168\u7528\u5C6C\u4E03\u3001shuffle \u5F8B\u52D5\uFF0CSolo \u6DF7\u85CD\u8ABF\u97F3\u968E\u8207\u5927\u5C0F\u4E09\u5EA6\u3002"
      },
      lofi: {
        zh: "Lo-Fi / Chill",
        chordQuality: "extended",
        favorTransitions: ["ii-V", "I-vi", "iii-vi"],
        favorBorrowed: ["\u266DIII", "iv"],
        scaleDefaults: ["dorian", "major_pentatonic"],
        tempo: [70, 90],
        signatureProgressionIds: ["lofi_2536", "descending_neosoul", "ii_v_i"],
        voicingNotes: "maj7/min7\u3001\u6175\u61F6\u4E0D\u5B8C\u5168\u89E3\u6C7A\u3001\u52A0\u96DC\u8A0A\u8207 swing\uFF0C\u523B\u610F\u9B06\u6563\u3002"
      },
      rock: {
        zh: "\u6416\u6EFE Rock",
        chordQuality: "triad",
        favorTransitions: ["I-\u266DVII", "\u266DVII-IV", "IV-I", "I-IV", "V-IV"],
        favorBorrowed: ["\u266DVII", "\u266DVI", "\u266DIII"],
        scaleDefaults: ["minor_pentatonic", "mixolydian", "aeolian"],
        tempo: [100, 160],
        signatureProgressionIds: ["mixolydian_rock", "minor_rock_loop", "andalusian"],
        voicingNotes: "\u5F37\u529B\u548C\u5F26(power chord)\u3001\u266DVII \u96E2\u8ABF\u3001\u5931\u771F\uFF0CSolo \u4E94\u8072\u70BA\u4E3B\u3002"
      },
      folk: {
        zh: "\u6C11\u8B20 Folk",
        chordQuality: "triad",
        favorTransitions: ["I-IV", "I-V", "vi-IV", "IV-I"],
        favorBorrowed: [],
        scaleDefaults: ["ionian", "major_pentatonic", "mixolydian"],
        tempo: [80, 120],
        signatureProgressionIds: ["folk_1415", "axis_1564", "doowop_50s"],
        voicingNotes: "\u958B\u653E\u548C\u5F26\u3001capo \u53CB\u5584\u3001\u52A0 sus2/sus4 \u8207 add9\uFF0C\u6307\u5F48\u5206\u89E3\u3002"
      },
      cinematic: {
        zh: "\u96FB\u5F71\u611F Cinematic",
        chordQuality: "triad",
        favorTransitions: ["i-\u266DVI", "\u266DVI-\u266DVII", "\u266DVII-i", "I-\u266DVI"],
        favorBorrowed: ["\u266DVI", "\u266DVII", "\u266DIII", "iv"],
        scaleDefaults: ["aeolian", "lydian", "harmonic_minor"],
        tempo: [60, 100],
        signatureProgressionIds: ["minor_axis", "minor_1b7b6b7", "epic_climb", "creep_prog"],
        voicingNotes: "\u8ABF\u5F0F\u6DF7\u5408\u3001\u8E0F\u677F\u4F4E\u97F3\u3001\u5BEC\u5EE3\u5206\u6563\uFF0C\u5F26\u6A02\u5C64\u758A\u5806\u5F35\u529B\u3002"
      },
      funk: {
        zh: "\u653E\u514B Funk",
        chordQuality: "extended",
        favorTransitions: ["I-IV", "IV-I"],
        favorBorrowed: ["\u266DIII", "\u266DVII"],
        scaleDefaults: ["dorian", "mixolydian", "minor_pentatonic"],
        tempo: [95, 120],
        signatureProgressionIds: ["funk_vamp", "funk_1_4"],
        voicingNotes: "\u5C6C\u4E5D/\u5341\u4E09\u548C\u5F26\u3001\u55AE\u548C\u5F26\u5F8B\u52D5\u9760 groove\uFF0C\u7B2C\u4E00\u62CD\u91CD\u97F3\u3001\u5207\u5206\u60B6\u97F3\u5237\u5F26\u3002"
      },
      bossa: {
        zh: "\u5DF4\u85A9\u8AFE\u74E6 Bossa Nova",
        chordQuality: "extended",
        favorTransitions: ["ii-V", "V-I", "I-iii"],
        favorBorrowed: ["V/ii", "V/V"],
        scaleDefaults: ["ionian", "lydian", "dorian"],
        tempo: [120, 140],
        signatureProgressionIds: ["bossa_garota", "ii_v_i"],
        voicingNotes: "\u5927\u4E03/\u516D\u4E5D\u548C\u5F26\u3001\u4E8C\u7D1A\u5C6C\u93C8\u3001\u5207\u5206 bossa \u64A5\u5F26\uFF0C\u8F15\u67D4\u4E0D\u91CD\u62CD\u3002"
      },
      country: {
        zh: "\u9109\u6751 Country",
        chordQuality: "triad",
        favorTransitions: ["I-IV", "I-V", "IV-I", "V-I"],
        favorBorrowed: [],
        scaleDefaults: ["major_pentatonic", "mixolydian", "ionian"],
        tempo: [90, 140],
        signatureProgressionIds: ["country_145", "doowop_50s", "folk_1415"],
        voicingNotes: "\u958B\u653E\u548C\u5F26\u3001I\u2013IV\u2013V \u70BA\u9AA8\u3001Travis picking \u8207 sus \u9EDE\u7DB4\u3002"
      },
      edm: {
        zh: "\u96FB\u5B50\u821E\u66F2 EDM",
        chordQuality: "triad",
        favorTransitions: ["vi-IV", "IV-I", "i-\u266DVI", "\u266DVI-\u266DVII"],
        favorBorrowed: ["\u266DVI", "\u266DVII"],
        scaleDefaults: ["aeolian", "dorian", "minor_pentatonic"],
        tempo: [120, 130],
        signatureProgressionIds: ["minor_axis", "axis_6415"],
        voicingNotes: "\u548C\u5F26\u591A\u70BA supersaw \u92EA\u5E95\uFF0C\u9760\u6FFE\u6CE2/build-up \u88FD\u9020\u5F35\u529B\uFF0Cdrop \u7528\u6700\u5C11\u548C\u5F26\u3002"
      },
      post_rock: {
        zh: "\u5F8C\u6416 Post-Rock",
        chordQuality: "triad",
        favorTransitions: ["I-V", "V-vi", "vi-IV", "IV-I", "I-iii"],
        favorBorrowed: ["\u266DVII", "\u266DVI", "iv"],
        scaleDefaults: ["ionian", "aeolian", "lydian"],
        tempo: [70, 140],
        signatureProgressionIds: ["axis_1564", "pachelbel", "epic_climb"],
        voicingNotes: "\u7C21\u55AE\u4E09\u548C\u5F26 + \u5927\u91CF delay/reverb\uFF0C\u9577\u6BB5\u843D\u7531\u5F31\u5230\u5F37\u6F38\u5F37\u5806\u758A(quiet\u2192loud)\uFF1B\u639B\u7559\u97F3\u3001\u516B\u5EA6\u758A\u52A0\u3001tom \u6EFE\u594F\u63A8\u4E0A\u9AD8\u6F6E\u3002"
      }
    }
  };

  // data/progressions.json
  var progressions_default = {
    schemaVersion: 1,
    description: "\u5404\u66F2\u98A8\u62DB\u724C\u548C\u5F26\u9032\u884C\u5EAB\u3002\u53EF\u5728 UI \u700F\u89BD\u3001\u4F9D\u66F2\u98A8/\u6BB5\u843D\u7BE9\u9078\u3001\u4E00\u9375\u6574\u6BB5\u5957\u7528\u3002\u7F85\u99AC\u7D1A\u6578\u8207 key \u7121\u95DC(\u7531 Tonal \u5957\u4F7F\u7528\u8005\u6240\u9078\u8ABF)\uFF1B\u4FDD\u7559 7/\u03947/9 \u7B49\u54C1\u8CEA\u6A19\u8A18\u4EE5\u5448\u73FE\u8A72\u9032\u884C\u7684\u9053\u5730\u8A9E\u6CD5\uFF0C\u5F15\u64CE\u53EF\u8996 genre.chordQuality \u589E\u6E1B\u3002mode=major|minor\u3002genres \u5F15\u7528 genres.json id\uFF1Bfeeling \u5F15\u7528 feelings.json id\u3002use=\u64FA\u653E/\u7528\u9014\u767D\u8A71\u3002",
    progressions: {
      axis_1564: {
        name: "Axis \u56DB\u548C\u5F26\u9032\u884C",
        roman: [
          "I",
          "V",
          "vi",
          "IV"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "pop",
          "rock",
          "folk",
          "citypop",
          "edm",
          "post_rock"
        ],
        feeling: [
          "bright_lift",
          "unresolved_loop"
        ],
        use: "\u526F\u6B4C\uFF1B\u53EF\u7121\u9650\u5FAA\u74B0",
        note: "\u8FD1\u4EE3\u6D41\u884C\u6700\u5E38\u898B\uFF0C\u6717\u6717\u4E0A\u53E3\u3002\u628A\u5B83\u8A18\u4F4F\u7B49\u65BC\u8A18\u4F4F\u534A\u500B\u6D41\u884C\u6A02\u3002"
      },
      axis_6415: {
        name: "\u60B2\u50B7 Axis (Sensitive)",
        roman: [
          "vi",
          "IV",
          "I",
          "V"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "pop",
          "citypop",
          "ballad",
          "country",
          "edm"
        ],
        feeling: [
          "unresolved_loop",
          "gentle_turn"
        ],
        use: "\u4E3B\u6B4C/\u526F\u6B4C\uFF1B\u5FAA\u74B0",
        note: "\u5F9E vi \u8D77\u982D\uFF0C\u5E36\u611F\u6027\uFF0C\u662F Axis \u7684\u300E\u5148\u82E6\u5F8C\u751C\u300F\u65CB\u8F49\u7248\u3002"
      },
      doowop_50s: {
        name: "50\u5E74\u4EE3 / Doo-Wop \u9032\u884C",
        roman: [
          "I",
          "vi",
          "IV",
          "V"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "pop",
          "ballad",
          "folk",
          "country"
        ],
        feeling: [
          "bright_lift",
          "resolve_home"
        ],
        use: "\u4E3B\u6B4C/\u526F\u6B4C",
        note: "\u61F7\u820A\u7D14\u771F\uFF0C1950s \u6D41\u884C\u8207\u65E9\u671F\u6416\u6EFE\u7684\u9AA8\u5E79\u3002"
      },
      canon_4536251: {
        name: "\u842C\u80FD\u9032\u884C 4536251",
        roman: [
          "IV",
          "V",
          "iii",
          "vi",
          "ii",
          "V",
          "I"
        ],
        mode: "major",
        genres: [
          "pop",
          "ballad",
          "citypop",
          "rnb_neosoul"
        ],
        feeling: [
          "bright_lift",
          "forward_push"
        ],
        use: "\u526F\u6B4C/\u6574\u6BB5;\u5361\u8FB2\u5BB6\u65CF",
        note: "\u83EF\u8A9E\u60C5\u6B4C\u6700\u597D\u7528\u7684\u4E00\u689D,IV \u8D77\u982D\u5C64\u5C64\u63A8\u9032\u56DE I,\u6574\u6BB5\u639B\u4F4F\u4E0D\u51B7\u5834\u3002"
      },
      pop_6451: {
        name: "\u6D41\u884C vi\u2013IV\u2013V\u2013I",
        roman: [
          "vi",
          "IV",
          "V",
          "I"
        ],
        mode: "major",
        genres: [
          "pop",
          "ballad",
          "country",
          "folk"
        ],
        feeling: [
          "bright_lift",
          "resolve_home"
        ],
        use: "\u526F\u6B4C;\u5148\u611F\u6027\u5F8C\u843D\u5730",
        note: "\u5F9E vi \u7684\u611F\u6027\u8D77\u982D,V\u2192I \u6536\u5F97\u4E7E\u8106,\u5148\u63EA\u5FC3\u518D\u7D66\u4E00\u500B\u660E\u4EAE\u7D50\u5C3E\u3002"
      },
      deceptive_cadence: {
        name: "\u5047\u7D42\u6B62 I\u2013IV\u2013V\u2013vi",
        roman: [
          "I",
          "IV",
          "V",
          "vi"
        ],
        mode: "major",
        genres: [
          "pop",
          "ballad",
          "cinematic"
        ],
        feeling: [
          "forward_push",
          "surprise_deceptive"
        ],
        use: "\u6BB5\u5C3E\u88FD\u9020\u610F\u5916",
        note: "\u672C\u4EE5\u70BA V \u8981\u56DE\u5BB6,\u537B\u9583\u5230 vi,\u67F3\u6697\u82B1\u660E,\u9069\u5408\u653E\u6BB5\u5C3E\u52FE\u4F4F\u8033\u6735\u3002"
      },
      pachelbel: {
        name: "\u5361\u8FB2\u9032\u884C",
        roman: [
          "I",
          "V",
          "vi",
          "iii",
          "IV",
          "I",
          "IV",
          "V"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "ballad",
          "pop",
          "cinematic",
          "post_rock"
        ],
        feeling: [
          "bright_lift",
          "forward_push"
        ],
        use: "\u6574\u9996\uFF1B8 \u5C0F\u7BC0\u5FAA\u74B0",
        note: "\u5DF4\u6D77\u8C9D\u723E\u5361\u8FB2\uFF0C\u4E0B\u884C\u4F4E\u97F3\u7DDA (do-ti-la-sol-fa\u2026)\uFF0C\u7562\u696D\u6B4C/\u5A5A\u79AE\u795E\u5668\u3002"
      },
      royal_road: {
        name: "\u738B\u9053\u9032\u884C (\u4E09\u548C\u5F26)",
        roman: [
          "IV",
          "V",
          "iii",
          "vi"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "citypop",
          "pop"
        ],
        feeling: [
          "gentle_turn",
          "bright_lift"
        ],
        use: "\u526F\u6B4C",
        note: "\u65E5\u7CFB\u300E\u738B\u9053\u9032\u884C\u300F\uFF0CIV \u8D77\u982D\u660E\u4EAE\uFF0Ciii\u2192vi \u5E36\u4E00\u7D72\u54C0\u6101\u3002"
      },
      royal_road_7: {
        name: "\u738B\u9053\u9032\u884C (\u4E03\u548C\u5F26)",
        roman: [
          "IV\u03947",
          "V7",
          "iii7",
          "vi7"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "citypop",
          "rnb_neosoul",
          "jazz"
        ],
        feeling: [
          "dreamy",
          "jazzy_smooth"
        ],
        use: "\u526F\u6B4C",
        note: "\u52A0\u4E03\u548C\u5F26\u7684\u738B\u9053\uFF0CCity Pop \u8207\u52D5\u6F2B\u4E3B\u984C\u66F2\u6A19\u914D\uFF0C\u66F4\u6FC3\u66F4\u751C\u3002"
      },
      iii_minor_iv: {
        name: "I\u2013iii\u2013IV\u2013iv \u50AC\u6DDA",
        roman: [
          "I",
          "iii",
          "IV",
          "iv"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "ballad",
          "citypop"
        ],
        feeling: [
          "heartbreak",
          "gentle_turn"
        ],
        use: "\u4E3B\u6B4C\u8F49\u526F\u6B4C",
        note: "\u7D50\u5C3E\u501F\u5C0F\u56DB iv\uFF0C\u4EAE\u2192\u6697\u77AC\u9593\u63EA\u5FC3\u3002"
      },
      creep_prog: {
        name: "\u5347III\u501F\u5C0F\u56DB\u9032\u884C",
        roman: [
          "I",
          "III",
          "IV",
          "iv"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "rock",
          "ballad",
          "cinematic"
        ],
        feeling: [
          "cinematic",
          "heartbreak"
        ],
        use: "\u6574\u9996\uFF1B\u5FAA\u74B0",
        note: "\u5927\u4E09\u7D1A III \u88FD\u9020\u964C\u751F\u758F\u96E2\uFF0C\u518D\u7528\u5C0F\u56DB\u6536\uFF0C\u5F35\u529B\u8207\u5931\u843D\u611F\u6975\u5F37\u3002"
      },
      ii_v_i: {
        name: "ii\u2013V\u2013I \u7D42\u6B62",
        roman: [
          "ii7",
          "V7",
          "I\u03947"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "jazz",
          "rnb_neosoul",
          "lofi",
          "bossa"
        ],
        feeling: [
          "jazzy_smooth",
          "forward_push"
        ],
        use: "\u7D42\u6B62\u5F0F\uFF1B\u4EFB\u4F55\u6BB5\u843D\u6536\u5C3E",
        note: "\u7235\u58EB\u57FA\u77F3\uFF0C\u6700\u5E73\u9806\u7684\u89E3\u6C7A\uFF0C\u5E7E\u4E4E\u6240\u6709\u7235\u58EB\u6A19\u6E96\u66F2\u90FD\u7528\u5B83\u3002"
      },
      i_vi_ii_v: {
        name: "I\u2013vi\u2013ii\u2013V (Rhythm Changes \u982D)",
        roman: [
          "I\u03947",
          "vi7",
          "ii7",
          "V7"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "jazz",
          "pop"
        ],
        feeling: [
          "jazzy_smooth",
          "forward_push"
        ],
        use: "Turnaround\uFF1B\u5FAA\u74B0",
        note: "\u7D93\u5178 turnaround\uFF0C\u6700\u5F8C V \u628A\u4F60\u63A5\u56DE\u958B\u982D\uFF0C\u53EF\u7121\u9650\u8F49\u3002"
      },
      turnaround_6251: {
        name: "\u8FF4\u65CB vi\u2013ii\u2013V\u2013I\uFF08\u4E03\u548C\u5F26\uFF09",
        roman: [
          "vi7",
          "ii7",
          "V7",
          "I\u03947"
        ],
        mode: "major",
        genres: [
          "citypop",
          "rnb_neosoul",
          "jazz",
          "pop"
        ],
        feeling: [
          "jazzy_smooth",
          "resolve_home"
        ],
        use: "turnaround;\u6BB5\u843D\u56DE\u65CB\u63A5\u56DE\u958B\u982D",
        note: "\u5168\u4E03\u548C\u5F26\u7684\u6ED1\u9806\u8FF4\u65CB,vi\u2192ii\u2192V\u2192I \u4E00\u8DEF\u5E73\u9806\u89E3\u6C7A,City Pop \u8207\u7235\u58EB\u90FD\u611B\u3002"
      },
      circle_of_fifths: {
        name: "\u4E94\u5EA6\u5708\u4E0B\u884C",
        roman: [
          "I",
          "IV",
          "vii\xB0",
          "iii",
          "vi",
          "ii",
          "V",
          "I"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "jazz"
        ],
        feeling: [
          "forward_push",
          "jazzy_smooth"
        ],
        use: "\u6574\u6BB5\uFF1B\u793A\u7BC4",
        note: "\u6CBF\u4E94\u5EA6\u5708\u4E00\u8DEF\u89E3\u6C7A\uFF0C\u6BCF\u500B\u548C\u5F26\u90FD\u5F80\u4E0B\u4E00\u500B\u5F37\u62C9\uFF0C\u7406\u8AD6\u6559\u79D1\u66F8\u7D1A\u3002"
      },
      mixolydian_rock: {
        name: "\u266DVII \u6416\u6EFE\u9032\u884C",
        roman: [
          "I",
          "\u266DVII",
          "IV",
          "I"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "rock",
          "cinematic",
          "country"
        ],
        feeling: [
          "bluesy",
          "cinematic"
        ],
        use: "\u4E3B\u6B4C/\u526F\u6B4C",
        note: "Mixolydian \u7684 \u266DVII\uFF0C\u786C\u6D3E\u53C8\u958B\u95CA\uFF0C\u7D93\u5178\u6416\u6EFE riff \u5473\u3002"
      },
      folk_1415: {
        name: "\u6C11\u8B20 I\u2013IV\u2013I\u2013V",
        roman: [
          "I",
          "IV",
          "I",
          "V"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "folk",
          "country",
          "pop"
        ],
        feeling: [
          "forward_push",
          "resolve_home"
        ],
        use: "\u4E3B\u6B4C",
        note: "\u4E09\u548C\u5F26\u6C11\u8B20\u9AA8\u67B6\uFF0C\u5409\u4ED6\u958B\u653E\u548C\u5F26\u3001capo \u53CB\u5584\u3002"
      },
      country_145: {
        name: "\u9109\u6751 I\u2013IV\u2013V",
        roman: [
          "I",
          "IV",
          "V"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "country",
          "folk",
          "blues"
        ],
        feeling: [
          "forward_push",
          "resolve_home"
        ],
        use: "\u6574\u9996",
        note: "\u6700\u6A38\u7D20\u7684\u4E09\u5927\u6B63\u4E09\u548C\u5F26\uFF0C\u9109\u6751\u8207\u4E09\u548C\u5F26\u6416\u6EFE\u7684\u6839\u3002"
      },
      lofi_2536: {
        name: "Lo-Fi \u5FAA\u74B0 ii\u2013V\u2013iii\u2013vi",
        roman: [
          "ii7",
          "V7",
          "iii7",
          "vi7"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "lofi",
          "citypop"
        ],
        feeling: [
          "dreamy",
          "unresolved_loop"
        ],
        use: "\u5FAA\u74B0\u5E95",
        note: "\u6175\u61F6\u4E0D\u5B8C\u5168\u89E3\u6C7A\uFF0C\u8B80\u66F8 Lo-Fi \u7684\u6A19\u914D 4 \u5C0F\u7BC0\u3002"
      },
      descending_neosoul: {
        name: "\u4E0B\u884C Neo-Soul I\u2013iii\u2013vi\u2013ii",
        roman: [
          "I\u03947",
          "iii7",
          "vi7",
          "ii7"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "rnb_neosoul",
          "lofi"
        ],
        feeling: [
          "dreamy",
          "jazzy_smooth"
        ],
        use: "\u4E3B\u6B4C\uFF1B\u5FAA\u74B0",
        note: "\u5E73\u6ED1\u4E0B\u884C\uFF0C\u9748\u9B42\u6A02\u7684\u6ED1\u9806\u6D41\u52D5\u611F\u3002"
      },
      maj_to_minoriv: {
        name: "I\u2013iv \u5922\u5E7B\u8F49\u5C0F\u56DB",
        roman: [
          "I\u03947",
          "iv"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "rnb_neosoul",
          "ballad",
          "citypop"
        ],
        feeling: [
          "heartbreak",
          "dreamy"
        ],
        use: "\u6A4B\u6BB5/\u8F49\u6298",
        note: "\u5927\u4E03\u76F4\u63A5\u63A5\u5C0F\u56DB\uFF0C\u5169\u500B\u548C\u5F26\u5C31\u8B93\u8272\u5F69\u7FFB\u8F49\u3002"
      },
      gospel_turn: {
        name: "\u798F\u97F3\u8F49\u6298 I\u2013III7\u2013vi\u2013IV",
        roman: [
          "I",
          "III7",
          "vi",
          "IV"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "rnb_neosoul",
          "ballad"
        ],
        feeling: [
          "bluesy",
          "forward_push"
        ],
        use: "\u4E3B\u6B4C/\u526F\u6B4C",
        note: "\u798F\u97F3/\u9748\u9B42\u5E38\u898B\u7684\u4E8C\u7D1A\u5C6C (III7\u2192vi) \u8D70\u6CD5\uFF0C\u6EAB\u6696\u6709\u52C1\u3002"
      },
      plagal_amen: {
        name: "Amen \u7D42\u6B62 IV\u2013I",
        roman: [
          "IV",
          "I"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "folk",
          "ballad",
          "rnb_neosoul"
        ],
        feeling: [
          "resolve_home"
        ],
        use: "\u5C3E\u594F\u6536\u675F",
        note: "\u6559\u6703 Amen\uFF0C\u67D4\u548C\u4E0D\u523A\u6FC0\u7684\u843D\u5730\u3002"
      },
      backdoor_cadence: {
        name: "\u5F8C\u9580\u7D42\u6B62 \u266DVII7\u2013IV\u2013I",
        roman: [
          "\u266DVII7",
          "IV",
          "I"
        ],
        mode: "major",
        genres: [
          "rnb_neosoul",
          "jazz",
          "lofi"
        ],
        feeling: [
          "jazzy_smooth",
          "resolve_home"
        ],
        use: "\u7D42\u6B62\u5F0F;\u5F9E\u5074\u9580\u6E9C\u56DE\u4E3B\u548C\u5F26",
        note: "\u4E0D\u8D70\u6B63\u7D71 V,\u6539\u7528 \u266DVII7 \u5F9E\u5F8C\u9580\u6E9C\u56DE I,\u6EAB\u6696\u53C8\u51FA\u5176\u4E0D\u610F,Neo-Soul/\u7235\u58EB\u5E38\u898B\u3002"
      },
      funk_vamp: {
        name: "\u653E\u514B\u55AE\u548C\u5F26 Vamp",
        roman: [
          "I9"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "funk",
          "rnb_neosoul"
        ],
        feeling: [
          "bluesy"
        ],
        use: "\u6574\u6BB5\uFF1B\u9760\u5F8B\u52D5",
        note: "\u505C\u5728\u4E00\u500B\u5C6C\u4E5D\u548C\u5F26\uFF0C\u4E0D\u9760\u548C\u8072\u8B8A\u5316\u3001\u9760 groove \u8207\u5207\u5206\u63A8\u9032\u3002"
      },
      funk_1_4: {
        name: "\u653E\u514B I7\u2013IV7",
        roman: [
          "I7",
          "IV7"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "funk",
          "blues"
        ],
        feeling: [
          "bluesy",
          "forward_push"
        ],
        use: "\u5FAA\u74B0\u5E95",
        note: "\u5169\u500B\u5C6C\u4E03\u4F86\u56DE\u5207\uFF0C\u91CD groove\uFF0CJames Brown \u5F0F\u5F8B\u52D5\u3002"
      },
      funk_dorian_vamp: {
        name: "\u653E\u514B Dorian \u5FAA\u74B0 i7\u2013IV7",
        roman: [
          "i7",
          "IV7"
        ],
        mode: "minor",
        genres: [
          "funk",
          "rnb_neosoul"
        ],
        feeling: [
          "bluesy",
          "unresolved_loop"
        ],
        use: "\u6574\u6BB5;\u5169\u548C\u5F26\u9760 groove",
        note: "\u5728 i7 \u8207 IV7 \u4E4B\u9593\u4F86\u56DE,Dorian \u7684\u5927\u516D\u5EA6\u5E36\u51FA\u653E\u514B\u4EAE\u5EA6,\u9760\u5F8B\u52D5\u4E0D\u9760\u548C\u8072\u63A8\u9032\u3002"
      },
      bossa_garota: {
        name: "Bossa I\u03947\u2013II7\u2013ii7\u2013V7",
        roman: [
          "I\u03947",
          "II7",
          "ii7",
          "V7"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "bossa",
          "jazz"
        ],
        feeling: [
          "jazzy_smooth",
          "dreamy"
        ],
        use: "\u4E3B\u6B4C",
        note: "\u5DF4\u85A9\u8AFE\u74E6\u62DB\u724C\uFF0C\u542B\u4E8C\u7D1A\u5C6C (II7) \u7684\u6ED1\u9806\u4E0B\u884C\u3002"
      },
      twelve_bar_blues: {
        name: "12 \u5C0F\u7BC0\u85CD\u8ABF",
        roman: [
          "I7",
          "I7",
          "I7",
          "I7",
          "IV7",
          "IV7",
          "I7",
          "I7",
          "V7",
          "IV7",
          "I7",
          "V7"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "blues",
          "rock"
        ],
        feeling: [
          "bluesy"
        ],
        use: "\u6574\u9996",
        note: "\u5168\u5C6C\u4E03\u7684 12 \u5C0F\u7BC0\u7D50\u69CB\uFF0C\u85CD\u8ABF\u8207\u65E9\u671F\u6416\u6EFE\u7684\u6839\u672C\u3002"
      },
      twelve_bar_quickchange: {
        name: "12 \u5C0F\u7BC0\u85CD\u8ABF (\u5FEB\u901F\u8B8A\u5316)",
        roman: [
          "I7",
          "IV7",
          "I7",
          "I7",
          "IV7",
          "IV7",
          "I7",
          "I7",
          "V7",
          "IV7",
          "I7",
          "V7"
        ],
        mode: "major",
        meter: "4/4",
        genres: [
          "blues"
        ],
        feeling: [
          "bluesy"
        ],
        use: "\u6574\u9996",
        note: "\u7B2C\u4E8C\u5C0F\u7BC0\u63D0\u65E9\u9032 IV7 \u7684\u5E38\u898B\u8B8A\u9AD4\uFF0C\u66F4\u6709\u52D5\u611F\u3002"
      },
      minor_axis: {
        name: "\u5C0F\u8ABF Axis i\u2013\u266DVI\u2013\u266DIII\u2013\u266DVII",
        roman: [
          "i",
          "\u266DVI",
          "\u266DIII",
          "\u266DVII"
        ],
        mode: "minor",
        meter: "4/4",
        genres: [
          "pop",
          "rock",
          "cinematic",
          "edm",
          "post_rock"
        ],
        feeling: [
          "cinematic",
          "unresolved_loop"
        ],
        use: "\u526F\u6B4C\uFF1B\u5FAA\u74B0",
        note: "\u73FE\u4EE3\u5C0F\u8ABF\u6D41\u884C\u6700\u5E38\u898B\uFF0C\u60B2\u58EF\u53C8\u8D85\u597D\u5FAA\u74B0\u3002"
      },
      minor_1b7b6b7: {
        name: "i\u2013\u266DVII\u2013\u266DVI\u2013\u266DVII",
        roman: [
          "i",
          "\u266DVII",
          "\u266DVI",
          "\u266DVII"
        ],
        mode: "minor",
        meter: "4/4",
        genres: [
          "rock",
          "cinematic",
          "post_rock"
        ],
        feeling: [
          "cinematic",
          "dark_turn"
        ],
        use: "\u4E3B\u6B4C",
        note: "\u5728 i \u8207 \u266DVI \u9593\u64FA\u76EA\uFF0C\u6C23\u6C1B\u6C89\u3001\u9069\u5408\u92EA\u6558\u4E8B\u3002"
      },
      minor_rock_loop: {
        name: "\u5C0F\u8ABF\u6416\u6EFE i\u2013\u266DVI\u2013\u266DVII\u2013i",
        roman: [
          "i",
          "\u266DVI",
          "\u266DVII",
          "i"
        ],
        mode: "minor",
        meter: "4/4",
        genres: [
          "rock",
          "cinematic"
        ],
        feeling: [
          "cinematic",
          "resolve_home"
        ],
        use: "\u526F\u6B4C\uFF1B\u5FAA\u74B0",
        note: "\u266DVI\u2192\u266DVII \u5806\u758A\u5F8C\u843D\u56DE i\uFF0C\u56DE\u5BB6\u4F46\u5E36\u91CE\u6027\u3002"
      },
      andalusian: {
        name: "\u5B89\u9054\u76E7\u897F\u4E9E\u7D42\u6B62 i\u2013\u266DVII\u2013\u266DVI\u2013V",
        roman: [
          "i",
          "\u266DVII",
          "\u266DVI",
          "V"
        ],
        mode: "minor",
        meter: "4/4",
        genres: [
          "rock",
          "cinematic",
          "folk"
        ],
        feeling: [
          "dark_turn",
          "tension_pull"
        ],
        use: "\u6574\u9996",
        note: "\u4F5B\u6717\u660E\u54E5\u4E0B\u884C\u56DB\u97F3\uFF0C\u6700\u5F8C\u843D\u5728\u5927 V \u88FD\u9020\u5F37\u70C8\u5F35\u529B\u3002"
      },
      minor_1465: {
        name: "\u5C0F\u8ABF\u6292\u60C5 i\u2013iv\u2013\u266DVI\u2013V",
        roman: [
          "i",
          "iv",
          "\u266DVI",
          "V"
        ],
        mode: "minor",
        meter: "4/4",
        genres: [
          "ballad",
          "cinematic"
        ],
        feeling: [
          "dark_turn",
          "tension_pull"
        ],
        use: "\u4E3B\u6B4C/\u526F\u6B4C",
        note: "\u266DVI \u7D66\u6EAB\u6696\u3001V \u7D66\u5F37\u89E3\u6C7A\uFF0C\u5C0F\u8ABF\u6292\u60C5\u5E38\u898B\u3002"
      },
      minor_line_cliche: {
        name: "\u5C0F\u8ABF\u4E0B\u884C line clich\xE9",
        roman: [
          "i",
          "i7",
          "i6",
          "iv"
        ],
        mode: "minor",
        genres: [
          "ballad",
          "cinematic",
          "citypop",
          "jazz"
        ],
        feeling: [
          "gentle_turn",
          "heartbreak"
        ],
        use: "\u4E3B\u6B4C\u92EA\u5E95;\u5167\u8072\u90E8\u534A\u97F3\u4E0B\u884C",
        note: "\u5C0F\u8ABF\u4E3B\u548C\u5F26\u5B9A\u4F4F,\u5167\u8072\u90E8\u4E00\u8DEF\u534A\u97F3\u4E0B\u884C(G\u2192F#\u2192F),\u6175\u61F6\u53C8\u63EA\u5FC3,\u4E3B\u6B4C\u92EA\u5E95\u7684\u5E38\u9752\u6A39\u3002"
      },
      harmonic_minor_cadence: {
        name: "\u548C\u8072\u5C0F\u8ABF\u7D42\u6B62 i\u2013iv\u2013V\u2013i",
        roman: [
          "i",
          "iv",
          "V",
          "i"
        ],
        mode: "minor",
        meter: "4/4",
        genres: [
          "cinematic",
          "jazz"
        ],
        feeling: [
          "tension_pull",
          "resolve_home"
        ],
        use: "\u7D42\u6B62\u5F0F",
        note: "\u5927 V \u4F86\u81EA\u548C\u8072\u5C0F\u8ABF\uFF0C\u53E4\u5178\u8207\u7570\u570B\u611F\u3002"
      },
      minor_ii_v_i: {
        name: "\u5C0F\u8ABF ii\u2013V\u2013i",
        roman: [
          "ii\xF87",
          "V7",
          "i"
        ],
        mode: "minor",
        meter: "4/4",
        genres: [
          "jazz",
          "cinematic"
        ],
        feeling: [
          "tension_pull",
          "jazzy_smooth"
        ],
        use: "\u7D42\u6B62\u5F0F",
        note: "\u5C0F\u8ABF\u7248\u7235\u58EB\u7D42\u6B62\uFF0C\u534A\u6E1B ii\xB07 \u8D77\uFF0C\u6BD4\u5927\u8ABF\u7248\u66F4\u6697\u66F4\u7DCA\u3002"
      },
      epic_climb: {
        name: "\u53F2\u8A69\u5806\u758A \u266DVI\u2013\u266DVII\u2013i",
        roman: [
          "\u266DVI",
          "\u266DVII",
          "i"
        ],
        mode: "minor",
        meter: "4/4",
        genres: [
          "cinematic",
          "rock",
          "post_rock"
        ],
        feeling: [
          "cinematic"
        ],
        use: "\u526F\u6B4C\u524D/\u9AD8\u6F6E",
        note: "\u4E09\u9023\u4E0A\u884C\u76F4\u885D\u4E3B\u548C\u5F26\uFF0C\u96FB\u5F71\u9810\u544A\u7247\u6700\u611B\u3002"
      },
      minor_blues: {
        name: "\u5C0F\u8ABF\u85CD\u8ABF 12 \u5C0F\u7BC0",
        roman: [
          "i7",
          "i7",
          "i7",
          "i7",
          "iv7",
          "iv7",
          "i7",
          "i7",
          "V7",
          "iv7",
          "i7",
          "V7"
        ],
        mode: "minor",
        meter: "4/4",
        genres: [
          "blues",
          "jazz"
        ],
        feeling: [
          "bluesy",
          "dark_turn"
        ],
        use: "\u6574\u9996",
        note: "12 \u5C0F\u7BC0\u7684\u5C0F\u8ABF\u7248\u672C\uFF0C\u66F4\u9670\u9B31\u3001\u66F4\u6709\u6545\u4E8B\u611F\u3002"
      },
      waltz_145: {
        name: "\u53E4\u5178\u4E09\u548C\u5F26\u5713\u821E\u66F2",
        roman: [
          "I",
          "IV",
          "V",
          "I"
        ],
        mode: "major",
        meter: "3/4",
        genres: [
          "folk",
          "country",
          "cinematic"
        ],
        feeling: [
          "bright_lift",
          "resolve_home"
        ],
        use: "\u6574\u6BB5;\u6700\u6A38\u5BE6\u7684\u4E09\u62CD",
        note: "I\u2013IV\u2013V \u4E09\u548C\u5F26\u8D70\u5B8C\u4E00\u5708,\u5713\u821E\u66F2\u8207\u5152\u6B4C\u7684\u6839\u3002\u7C21\u55AE\u4F46\u8010\u807D\u3002"
      },
      waltz_jazz_2516: {
        name: "\u7235\u58EB\u83EF\u723E\u6ECB ii\u2013V\u2013I",
        roman: [
          "ii7",
          "V7",
          "I\u03947",
          "vi7"
        ],
        mode: "major",
        meter: "3/4",
        genres: [
          "jazz",
          "bossa"
        ],
        feeling: [
          "resolve_home",
          "gentle_turn"
        ],
        use: "jazz waltz \u4E3B\u984C",
        note: "\u4E09\u62CD\u4E0A\u7684 ii\u2013V\u2013I \u52A0 vi \u56DE\u65CB,\u7235\u58EB\u5713\u821E\u66F2\u7684\u6A19\u6E96\u8A9E\u5F59\u3002"
      },
      rising_68: {
        name: "6/8 \u4E0A\u884C\u6C11\u8B20(\u65E5\u6607)",
        roman: [
          "i",
          "\u266DIII",
          "IV",
          "\u266DVI"
        ],
        mode: "minor",
        meter: "6/8",
        genres: [
          "folk",
          "blues",
          "cinematic"
        ],
        feeling: [
          "gentle_turn",
          "resolve_home"
        ],
        use: "\u4E3B\u6B4C\u6558\u4E8B;6/8",
        note: "\u7D93\u5178 6/8 \u6C11\u8B20\u8D70\u5411,\u5C64\u5C64\u4E0A\u884C,\u9069\u5408\u8AAA\u6545\u4E8B\u7684\u6162\u6B4C\u3002"
      }
    }
  };

  // data/sections.json
  var sections_default = {
    schemaVersion: 1,
    description: "\u6B4C\u66F2\u6BB5\u843D\u6A21\u677F\u8207\u80FD\u91CF\u6307\u5F15\uFF0C\u5C0D\u61C9\u9700\u6C42\u4E2D\u7684\u300E\u4E3B\u6B4C/\u526F\u6B4C/Solo\u600E\u9EBC\u505A\u300F\u3002energy 0-1 \u70BA\u8A72\u6BB5\u76F8\u5C0D\u80FD\u91CF\uFF1BharmonyGuidance=\u548C\u8072\u7B56\u7565\uFF1Bdensity=\u548C\u5F26/\u7DE8\u66F2\u5BC6\u5EA6\u5EFA\u8B70\uFF1BmelodyRange=\u65CB\u5F8B\u97F3\u57DF\u76F8\u5C0D\u4F4D\u7F6E(\u4F9B\u4F5C\u66F2\u8207\u6B4C\u5531\u5C0E\u5531)\uFF1BvocalTip=\u6F14\u5531\u91CD\u9EDE\uFF1Bexamples=\u8A72\u6BB5\u5E38\u7528\u9032\u884C(\u7F85\u99AC\u7D1A\u6578)\u3002",
    sections: {
      intro: {
        zh: "\u524D\u594F Intro",
        energy: 0.3,
        harmonyGuidance: "\u9810\u544A\u4E3B\u6B4C\u6216\u526F\u6B4C\u7684\u6838\u5FC3\u548C\u5F26\uFF0C\u5E38\u53EA\u53D6\u5176\u4E2D 2 \u500B\u5FAA\u74B0\uFF0C\u7559\u61F8\u5FF5\u3002",
        density: "\u7A00\u758F\uFF0C\u55AE\u4E00\u6A02\u5668\u52D5\u6A5F\u3002",
        melodyRange: "\u4F4E-\u4E2D\uFF0C\u5E38\u70BA\u7D14\u6A02\u5668\u3002",
        vocalTip: "\u901A\u5E38\u7121\u4EBA\u8072\uFF0C\u505A\u6C23\u6C1B\u3002",
        examples: [["vi", "IV"], ["I", "V"]]
      },
      verse: {
        zh: "\u4E3B\u6B4C Verse",
        energy: 0.45,
        harmonyGuidance: "\u4F4E\u5F35\u529B\u3001\u7559\u7A7A\u9593\u3001\u6709\u524D\u9032\u611F\u4F46\u4E0D\u6025\u8457\u56DE\u5BB6\u3002\u591A\u7528\u4E0D\u5B8C\u5168\u89E3\u6C7A\u7684\u5FAA\u74B0\uFF0C\u628A\u6700\u4EAE\u7684\u548C\u5F26\u7559\u7D66\u526F\u6B4C\u3002\u504F\u597D vi/ii/iii \u7B49\u8F03\u5167\u6582\u7684\u548C\u5F26\u8D77\u982D\u3002",
        density: "\u548C\u5F26\u5BC6\u5EA6\u4F4E\u3001\u7BC0\u594F\u758F\uFF0C\u7D66\u6B4C\u8A5E\u8207\u6558\u4E8B\u7A7A\u9593\u3002",
        melodyRange: "\u4E2D\u4F4E\u97F3\u57DF\uFF0C\u6558\u4E8B\u53E3\u543B\uFF0C\u97F3\u7B26\u8F03\u5BC6\u4F46\u8D77\u4F0F\u5C0F\u3002",
        vocalTip: "\u6C23\u8072\u3001\u8CBC\u8FD1\u8AAA\u8A71\uFF0C\u63A7\u5236\u97F3\u91CF\u70BA\u526F\u6B4C\u7559\u7206\u767C\u7A7A\u9593\u3002",
        examples: [["vi", "IV", "I", "V"], ["I", "iii", "IV", "ii"], ["i", "\u266DVII", "\u266DVI", "\u266DVII"]]
      },
      prechorus: {
        zh: "\u5C0E\u6B4C Pre-Chorus",
        energy: 0.7,
        harmonyGuidance: "\u88FD\u9020\u300E\u5373\u5C07\u7206\u767C\u300F\u7684\u62C9\u529B\uFF0C\u505C\u5728 V \u6216 V/IV \u4E0D\u89E3\u6C7A\uFF0C\u5E38\u7528\u4E0A\u884C\u4F4E\u97F3\u8207 ii\u2192V\u3002",
        density: "\u9010\u6B65\u52A0\u5C64\uFF0C\u9F13\u9EDE\u958B\u59CB\u5806\u758A\u3002",
        melodyRange: "\u4E2D\u97F3\u57DF\u5F80\u4E0A\u722C\uFF0C\u97F3\u7B26\u62C9\u9577\u3002",
        vocalTip: "\u97F3\u91CF\u8207\u97F3\u9AD8\u6F38\u5F37\uFF0C\u6700\u5F8C\u4E00\u53E5\u628A\u6C23\u9802\u4F4F\u63A5\u526F\u6B4C\u3002",
        examples: [["IV", "V"], ["ii", "V"], ["IV", "V/V", "V"]]
      },
      chorus: {
        zh: "\u526F\u6B4C Chorus",
        energy: 1,
        harmonyGuidance: "\u9AD8\u5F35\u529B\u3001\u660E\u4EAE\u3001\u8A18\u61B6\u9EDE\u3001\u5F37\u89E3\u6C7A\u3002\u7528\u56DB\u548C\u5F26\u795E\u9032\u884C\u8207\u62AC\u5347\u6280\u5DE7(\u8F49\u4F4D\u4E0A\u884C\u4F4E\u97F3\u3001\u526F\u6B4C\u524D\u62C9\u529B\u548C\u5F26\u3001\u5FC5\u8981\u6642\u5347 key)\u3002\u9019\u662F\u5168\u66F2\u6700\u4EAE\u9EDE\u3002",
        density: "\u6EFF\u7DE8\u3001\u548C\u5F26\u660E\u78BA\u3001\u7BC0\u594F\u7D2E\u5BE6\u3002",
        melodyRange: "\u9AD8\u97F3\u57DF\uFF0C\u65CB\u5F8B\u8A18\u61B6\u9EDE(hook)\uFF0C\u91CD\u8907\u53E5\u3002",
        vocalTip: "\u5168\u529B\u653E\u8072\u4F46\u4FDD\u6301\u97F3\u6E96\uFF0Chook \u53E5\u8981\u80FD\u4E00\u807D\u5C31\u8A18\u4F4F\u3001\u8DDF\u8457\u5531\u3002",
        examples: [["I", "V", "vi", "IV"], ["IV", "I", "V", "vi"], ["I", "V/vi", "vi", "IV"]]
      },
      bridge: {
        zh: "\u6A4B\u6BB5 Bridge",
        energy: 0.65,
        harmonyGuidance: "\u63D0\u4F9B\u5C0D\u6BD4\u8207\u65B0\u9BAE\u611F\uFF0C\u53EF\u96E2\u8ABF\u3001\u8F49\u5230\u95DC\u4FC2\u8ABF\u6216\u501F\u7528\u548C\u5F26\uFF0C\u6253\u7834\u524D\u9762\u5FAA\u74B0\u3002",
        density: "\u53EF\u7A81\u7136\u8B8A\u7A00\u6216\u8B8A\u6FC3\uFF0C\u88FD\u9020\u8F49\u6298\u3002",
        melodyRange: "\u523B\u610F\u63DB\u97F3\u57DF\u6216\u63DB\u5531\u6CD5\u3002",
        vocalTip: "\u60C5\u7DD2\u8F49\u6298\u6BB5\uFF0C\u53EF\u7528\u771F\u5047\u97F3\u5C0D\u6BD4\u6216\u7559\u767D\u3002",
        examples: [["iv", "\u266DVII", "\u266DIII", "\u266DVI"], ["IV", "iv", "I"], ["vi", "V/vi", "vi", "V"]]
      },
      solo: {
        zh: "\u7368\u594F Solo",
        energy: 0.8,
        harmonyGuidance: "\u6CBF\u7528\u4E3B\u6B4C\u6216\u526F\u6B4C\u9032\u884C\uFF0C\u91CD\u9EDE\u5728\u300E\u6BCF\u500B\u548C\u5F26\u4E0A\u80FD\u5F48\u4EC0\u9EBC\u97F3\u968E\u300F(\u898B scales.json chordScaleMap)\u3002\u6A19\u51FA\u548C\u5F26\u5167\u97F3(target tones)\u8207\u5F35\u529B\u97F3\uFF0C\u505A\u8D77\u627F\u8F49\u5408\u3002",
        density: "\u4F34\u594F\u9000\u4E00\u6B65\uFF0C\u7368\u594F\u6A02\u5668(\u5409\u4ED6/\u5408\u6210\u5668)\u4E3B\u5C0E\u3002",
        melodyRange: "\u4F9D\u6A02\u5668\uFF0C\u9F13\u52F5\u8DE8\u97F3\u57DF\u5927\u8DF3\u88FD\u9020\u9AD8\u6F6E\u3002",
        vocalTip: "\u82E5\u70BA\u4EBA\u8072\u5373\u8208(ad-lib)\uFF0C\u9396\u5B9A\u7576\u4E0B\u548C\u5F26\u7684\u5167\u97F3\u7576\u843D\u9EDE\uFF0C\u7D93\u904E\u97F3\u7576\u5F35\u529B\u3002",
        examples: [["I", "V", "vi", "IV"], ["i", "iv", "V", "i"]]
      },
      outro: {
        zh: "\u5C3E\u594F Outro",
        energy: 0.4,
        harmonyGuidance: "\u6536\u675F\u3002\u53EF\u91CD\u8907\u526F\u6B4C\u9032\u884C\u6F38\u5F31(fade)\uFF0C\u6216\u7528 plagal(IV\u2192I)\u3001Picardy \u7D66\u7D50\u675F\u611F\u3002",
        density: "\u6F38\u6E1B\uFF0C\u56DE\u5230\u55AE\u4E00\u6A02\u5668\u3002",
        melodyRange: "\u4E0B\u884C\u6536\u5C3E\u3002",
        vocalTip: "\u53EF\u5373\u8208 ad-lib \u5F8C\u6DE1\u51FA\uFF0C\u6216\u4E00\u500B\u9577\u97F3\u6536\u3002",
        examples: [["IV", "I"], ["I", "V", "vi", "IV"]]
      }
    }
  };

  // data/scales.json
  var scales_default = {
    schemaVersion: 1,
    description: "\u97F3\u968E/\u8ABF\u5F0F\u8CC7\u6599\u8868\uFF0C\u4F9B\u4F5C\u66F2(\u4E3B\u6B4C/\u526F\u6B4C\u65CB\u5F8B)\u3001Solo(\u548C\u5F26\u5C0D\u97F3\u968E)\u3001\u6B4C\u5531\u7DF4\u7FD2(\u5C0E\u5531\u97F3\u57DF)\u4F7F\u7528\u3002intervals=\u5F9E\u6839\u97F3\u8D77\u7B97\u7684\u534A\u97F3\u4F4D\u7F6E\u3002chordScaleMap=\u4F9D\u548C\u5F26\u6027\u8CEA/\u529F\u80FD\u63A8\u85A6\u7684\u97F3\u968E(Solo \u7528)\u3002mood=\u60C5\u7DD2\u8272\u5F69\u767D\u8A71\u3002guitarPattern=\u5409\u4ED6\u628A\u4F4D\u6307\u578B\u4EE3\u865F(\u7531 fretboard \u6A21\u7D44\u4F9D\u6B64\u7E6A\u88FD)\u3002",
    scales: {
      ionian: { zh: "\u5927\u8ABF (Ionian)", intervals: [0, 2, 4, 5, 7, 9, 11], mood: "\u660E\u4EAE\u3001\u6B63\u5411\u3001\u6700\u7A69\u5B9A", guitarPattern: "major" },
      dorian: { zh: "\u591A\u5229\u5B89 (Dorian)", intervals: [0, 2, 3, 5, 7, 9, 10], mood: "\u5C0F\u8ABF\u4F46\u5E36\u4E00\u7D72\u5149\u4EAE\uFF0C\u7235\u58EB/\u653E\u514B\u611B\u7528", guitarPattern: "dorian" },
      phrygian: { zh: "\u5F17\u91CC\u5409\u5B89 (Phrygian)", intervals: [0, 1, 3, 5, 7, 8, 10], mood: "\u897F\u73ED\u7259\u3001\u7570\u570B\u3001\u9670\u6697\u7DCA\u5F35", guitarPattern: "phrygian" },
      lydian: { zh: "\u5229\u5730\u5B89 (Lydian)", intervals: [0, 2, 4, 6, 7, 9, 11], mood: "\u5922\u5E7B\u3001\u6F02\u6D6E\u3001\u96FB\u5F71\u914D\u6A02\u7684\u5947\u5E7B\u611F", guitarPattern: "lydian" },
      mixolydian: { zh: "\u7C73\u7D22\u5229\u5730\u5B89 (Mixolydian)", intervals: [0, 2, 4, 5, 7, 9, 10], mood: "\u5C6C\u548C\u5F26\u7684\u5BB6\uFF0C\u85CD\u8ABF/\u6416\u6EFE/\u653E\u514B", guitarPattern: "mixolydian" },
      aeolian: { zh: "\u81EA\u7136\u5C0F\u8ABF (Aeolian)", intervals: [0, 2, 3, 5, 7, 8, 10], mood: "\u6A19\u6E96\u60B2\u50B7\u5C0F\u8ABF", guitarPattern: "minor" },
      locrian: { zh: "\u6D1B\u514B\u5229\u5B89 (Locrian)", intervals: [0, 1, 3, 5, 6, 8, 10], mood: "\u4E0D\u7A69\u5B9A\u3001\u61F8\u7591\uFF0C\u7528\u5728 m7\u266D5", guitarPattern: "locrian" },
      major_pentatonic: { zh: "\u5927\u8ABF\u4E94\u8072", intervals: [0, 2, 4, 7, 9], mood: "\u958B\u6717\u3001\u4E0D\u6703\u932F\u97F3\uFF0C\u6C11\u8B20/\u9109\u6751", guitarPattern: "majPenta" },
      minor_pentatonic: { zh: "\u5C0F\u8ABF\u4E94\u8072", intervals: [0, 3, 5, 7, 10], mood: "\u6416\u6EFE/\u85CD\u8ABF Solo \u7684\u842C\u7528\u76D2", guitarPattern: "minPenta" },
      blues: { zh: "\u85CD\u8ABF\u97F3\u968E", intervals: [0, 3, 5, 6, 7, 10], mood: "\u52A0\u4E86 \u266D5 \u7684\u5C0F\u4E94\u8072\uFF0C\u7C97\u7377\u6709\u5473", guitarPattern: "blues" },
      harmonic_minor: { zh: "\u548C\u8072\u5C0F\u8ABF", intervals: [0, 2, 3, 5, 7, 8, 11], mood: "\u5C0F\u8ABF\u4F46\u6709\u5F37\u70C8\u89E3\u6C7A\uFF0C\u7570\u570B/\u53E4\u5178/\u91D1\u5C6C", guitarPattern: "harmMinor" },
      melodic_minor: { zh: "\u65CB\u5F8B\u5C0F\u8ABF", intervals: [0, 2, 3, 5, 7, 9, 11], mood: "\u5C0F\u8ABF\u537B\u5F80\u4E0A\u660E\u4EAE\uFF0C\u7235\u58EB\u4E3B\u529B", guitarPattern: "melMinor" },
      phrygian_dominant: { zh: "\u5F17\u91CC\u5409\u5B89\u5C6C (HM5)", intervals: [0, 1, 4, 5, 7, 8, 10], mood: "\u4E2D\u6771/\u4F5B\u6717\u660E\u54E5\uFF0C\u7DCA\u5F35\u83EF\u9E97", guitarPattern: "phrygDom" },
      lydian_dominant: { zh: "\u5229\u5730\u5B89\u5C6C (MM4)", intervals: [0, 2, 4, 6, 7, 9, 10], mood: "\u5C6C\u4E03\u52A0 #11\uFF0C\u73FE\u4EE3\u7235\u58EB\u6F02\u6D6E\u611F", guitarPattern: "lydDom" },
      altered: { zh: "\u8B8A\u5316\u97F3\u968E (Super Locrian)", intervals: [0, 1, 3, 4, 6, 8, 10], mood: "\u5C6C\u548C\u5F26\u6700\u5927\u5F35\u529B\uFF0C\u7235\u58EB\u5916\u5074", guitarPattern: "altered" },
      whole_tone: { zh: "\u5168\u97F3\u968E", intervals: [0, 2, 4, 6, 8, 10], mood: "\u61F8\u6D6E\u3001\u8FF7\u5E7B\u3001\u5922\u5883", guitarPattern: "wholeTone" },
      diminished_hw: { zh: "\u6E1B\u97F3\u968E (\u534A\u5168)", intervals: [0, 1, 3, 4, 6, 7, 9, 10], mood: "\u5C6C\u548C\u5F26\u7684\u7DCA\u5F35\u5C0D\u7A31\u97F3\u968E", guitarPattern: "dimHW" },
      diminished_wh: { zh: "\u6E1B\u97F3\u968E (\u5168\u534A)", intervals: [0, 2, 3, 5, 6, 8, 9, 11], mood: "\u6E1B\u548C\u5F26\u7528\uFF0C\u5C0D\u7A31\u4E0D\u5B89\u5B9A", guitarPattern: "dimWH" }
    },
    chordScaleMap: {
      comment: "Solo \u5F15\u64CE\uFF1A\u7D66\u5B9A\u548C\u5F26\u6027\u8CEA\u8207\u5728\u8ABF\u4E2D\u7684\u529F\u80FD\uFF0C\u63A8\u85A6\u53EF\u7528\u97F3\u968E(\u7B2C\u4E00\u500B\u70BA\u9810\u8A2D\u5B89\u5168\u724C\uFF0C\u5F8C\u9762\u70BA\u9032\u968E/\u5F35\u529B\u9078\u9805)\u3002",
      maj7_tonic: { scales: ["ionian", "lydian", "major_pentatonic"], note: "\u4E3B\u548C\u5F26\u5927\u4E03\uFF1AIonian \u7A69\u3001Lydian \u5922\u5E7B\u3002" },
      maj7_IV: { scales: ["lydian", "ionian"], note: "\u4E0B\u5C6C\u5927\u4E03\u504F\u597D Lydian \u7684 #11\u3002" },
      dom7_V: { scales: ["mixolydian", "altered", "diminished_hw", "lydian_dominant"], note: "\u5C6C\u4E03\u9810\u8A2D Mixolydian\uFF1B\u8981\u5F35\u529B\u7528 Altered/\u534A\u5168\u6E1B\u3002" },
      dom7_blues: { scales: ["mixolydian", "blues", "minor_pentatonic"], note: "\u85CD\u8ABF\u60C5\u5883\u5C6C\u4E03\u53EF\u6DF7\u85CD\u8ABF\u97F3\u968E\u3002" },
      min7_ii: { scales: ["dorian", "minor_pentatonic"], note: "ii \u7D1A\u5C0F\u4E03\u504F\u597D Dorian\u3002" },
      min7_vi: { scales: ["aeolian", "minor_pentatonic", "dorian"], note: "vi \u7D1A\u5C0F\u4E03\u504F\u597D Aeolian\u3002" },
      min7_iii: { scales: ["phrygian", "aeolian"], note: "iii \u7D1A\u504F\u6697\uFF0C\u7528 Phrygian\u3002" },
      m7b5: { scales: ["locrian", "melodic_minor"], note: "\u534A\u6E1B\u548C\u5F26\u7528 Locrian \u6216\u6E90\u8ABF\u7684\u65CB\u5F8B\u5C0F\u8ABF(Locrian #2)\u3002" },
      dim7: { scales: ["diminished_wh"], note: "\u5168\u6E1B\u548C\u5F26\u7528\u5168\u534A\u6E1B\u97F3\u968E\u3002" },
      minor_tonic: { scales: ["aeolian", "harmonic_minor", "melodic_minor", "minor_pentatonic"], note: "\u5C0F\u8ABF\u4E3B\u548C\u5F26\uFF1AAeolian \u6A19\u6E96\uFF0C\u548C\u8072/\u65CB\u5F8B\u5C0F\u8ABF\u505A\u8272\u5F69\u8B8A\u5316\u3002" }
    }
  };

  // data/meter-patterns.json
  var meter_patterns_default = {
    schemaVersion: 1,
    description: "\u7BC0\u62CD\u5668\u62CD\u865F\u8207\u91CD\u97F3\u578B\u3002beats=\u6BCF\u5C0F\u7BC0\u62CD\u6578\uFF0CbeatUnit=\u4EE5\u5E7E\u5206\u97F3\u7B26\u70BA\u4E00\u62CD(4=\u56DB\u5206,8=\u516B\u5206)\u3002grouping=\u8907\u62CD\u5B50\u7684\u8108\u52D5\u5206\u7D44(\u5982 6/8 = [3,3])\u3002accents=\u91CD\u97F3\u5F37\u5EA6\u9663\u5217(2=\u5F37\u62CD,1=\u6B21\u5F37,0=\u5F31)\uFF0Csimple \u62CD\u5B50\u5C0D\u9F4A\u62CD\u6578\u3001compound \u5C0D\u9F4A\u57FA\u672C\u8108\u52D5(\u516B\u5206)\u3002subdivisions=\u53EF\u9078\u7684\u7D30\u5206\u3002tapTempo/countIn \u7531\u7A0B\u5F0F\u63A7\u5236\uFF0C\u4E0D\u5728\u6B64\u8868\u3002",
    timeSignatures: {
      "4/4": { zh: "\u56DB\u56DB\u62CD", beats: 4, beatUnit: 4, grouping: null, accents: [2, 0, 1, 0] },
      "3/4": { zh: "\u4E09\u56DB\u62CD(\u83EF\u723E\u6ECB)", beats: 3, beatUnit: 4, grouping: null, accents: [2, 0, 0] },
      "2/4": { zh: "\u4E8C\u56DB\u62CD(\u9032\u884C\u66F2)", beats: 2, beatUnit: 4, grouping: null, accents: [2, 0] },
      "6/8": { zh: "\u516D\u516B\u62CD", beats: 6, beatUnit: 8, grouping: [3, 3], accents: [2, 0, 0, 1, 0, 0] },
      "12/8": { zh: "\u5341\u4E8C\u516B\u62CD(\u6162\u6416\u6EFE/\u85CD\u8ABF)", beats: 12, beatUnit: 8, grouping: [3, 3, 3, 3], accents: [2, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0] },
      "5/4": { zh: "\u4E94\u56DB\u62CD(3+2)", beats: 5, beatUnit: 4, grouping: [3, 2], accents: [2, 0, 0, 1, 0] },
      "7/8": { zh: "\u4E03\u516B\u62CD(2+2+3)", beats: 7, beatUnit: 8, grouping: [2, 2, 3], accents: [2, 0, 1, 0, 1, 0, 0] }
    },
    subdivisions: {
      quarter: { zh: "\u56DB\u5206(\u6BCF\u62CD\u4E00\u4E0B)", perBeat: 1 },
      eighth: { zh: "\u516B\u5206(\u6BCF\u62CD\u5169\u4E0B)", perBeat: 2 },
      triplet: { zh: "\u4E09\u9023\u97F3", perBeat: 3 },
      sixteenth: { zh: "\u5341\u516D\u5206(\u6BCF\u62CD\u56DB\u4E0B)", perBeat: 4 }
    },
    accentLevels: {
      "2": { zh: "\u5F37\u62CD", sound: "high", volume: 1 },
      "1": { zh: "\u6B21\u5F37", sound: "mid", volume: 0.7 },
      "0": { zh: "\u5F31\u62CD", sound: "low", volume: 0.45 }
    }
  };

  // data/drum-patterns.json
  var drum_patterns_default = {
    schemaVersion: 2,
    description: "\u9F13\u7D44\u5F8B\u52D5\u5EAB(\u5404\u66F2\u98A8)\u3002kit=\u9F13\u4EF6\u5B9A\u7FA9\u542B General MIDI \u97F3\u9AD8(\u4F9B MIDI \u532F\u51FA),order=\u9762\u677F\u986F\u793A\u9806\u5E8F,group=\u5206\u5C64(cymbal\u9238/drum\u9F13/perc\u6253\u64CA)\u3002patterns=\u6BCF\u500B\u5F8B\u52D5\u4E00\u5F35 step \u8868\uFF1Arole=\u7528\u9014\u5206\u5C64(basic\u57FA\u672C/verse\u4E3B\u6B4C/chorus\u526F\u6B4C/variation\u8B8A\u5316/fill\u904E\u9580)\uFF1Bsteps(\u6BCF\u5C0F\u7BC0\u683C\u6578,16=16\u5206/4-4,12=\u4E09\u9023\u97F3\u683C)\uFF1Bswing(0\u76F4/0.6\u4E09\u9023 shuffle/0.1~0.15 laid-back)\uFF1Bfeel\uFF1Btempo[lo,hi]BPM\uFF1Bpattern{\u9F13\u4EF6:\u6B65\u9032\u5B57\u4E32}\u3002\u6B65\u9032\u5B57\u5143\uFF1Ax=\u64CA, o=\u91CD\u97F3, g=\u5E7D\u9748(\u8F15), -=\u4F11\u6B62\u3002genres \u5F15\u7528 genres.json id\u3002",
    kit: {
      crash: {
        zh: "Crash \u9238",
        gm: 49,
        group: "cymbal",
        order: 1
      },
      ride: {
        zh: "Ride \u9238",
        gm: 51,
        group: "cymbal",
        order: 2
      },
      openHat: {
        zh: "\u958B\u653E Hi-hat",
        gm: 46,
        group: "cymbal",
        order: 3
      },
      closedHat: {
        zh: "\u9589\u5408 Hi-hat",
        gm: 42,
        group: "cymbal",
        order: 4
      },
      pedalHat: {
        zh: "\u8173\u8E0F Hi-hat",
        gm: 44,
        group: "cymbal",
        order: 5
      },
      hiTom: {
        zh: "\u9AD8 Tom",
        gm: 50,
        group: "drum",
        order: 6
      },
      midTom: {
        zh: "\u4E2D Tom",
        gm: 47,
        group: "drum",
        order: 7
      },
      snare: {
        zh: "\u5C0F\u9F13",
        gm: 38,
        group: "drum",
        order: 8
      },
      rim: {
        zh: "\u908A\u64CA/Cross",
        gm: 37,
        group: "drum",
        order: 9
      },
      clap: {
        zh: "\u62CD\u624B",
        gm: 39,
        group: "drum",
        order: 10
      },
      lowTom: {
        zh: "\u4F4E Tom",
        gm: 45,
        group: "drum",
        order: 11
      },
      kick: {
        zh: "\u5927\u9F13",
        gm: 36,
        group: "drum",
        order: 12
      },
      shaker: {
        zh: "\u6C99\u9234",
        gm: 82,
        group: "perc",
        order: 13
      },
      cowbell: {
        zh: "\u725B\u9234",
        gm: 56,
        group: "perc",
        order: 14
      }
    },
    patterns: {
      pop_basic: {
        name: "\u6D41\u884C \u57FA\u672C 8-beat",
        role: "basic",
        genres: [
          "pop",
          "folk"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          90,
          130
        ],
        pattern: {
          closedHat: "x-x-x-x-x-x-x-x-",
          snare: "----x-------x---",
          kick: "x-------x-------"
        },
        note: "\u6700\u57FA\u672C\u7684\u6D41\u884C\u9F13\uFF1A\u5927\u9F13 1\u30013\uFF0C\u5C0F\u9F13 2\u30014\uFF0Chi-hat \u516B\u5206\u3002\u6574\u9996\u6B4C\u7684\u5730\u57FA\u3002"
      },
      pop_verse: {
        name: "\u6D41\u884C \u4E3B\u6B4C(\u7559\u767D)",
        role: "verse",
        genres: [
          "pop"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          90,
          130
        ],
        pattern: {
          closedHat: "x---x---x---x---",
          rim: "----x-------x---",
          kick: "x-------x-------"
        },
        note: "hi-hat \u53EA\u8D70\u56DB\u5206\u3001\u908A\u64CA\u4EE3\u66FF\u5C0F\u9F13\uFF0C\u4E3B\u6B4C\u5148\u6536\u8457\uFF0C\u7559\u7A7A\u9593\u7D66\u4EBA\u8072\u8207\u548C\u5F26\u3002"
      },
      pop_chorus: {
        name: "\u6D41\u884C \u526F\u6B4C(\u63A8\u9032)",
        role: "chorus",
        genres: [
          "pop",
          "citypop"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          95,
          130
        ],
        pattern: {
          crash: "x---------------",
          openHat: "--------------x-",
          closedHat: "x-x-x-x-x-x-x-x-",
          snare: "----x-------x---",
          kick: "x-----x-x-----x-"
        },
        note: "\u526F\u6B4C\u9032\u4F86\uFF1A\u7B2C\u4E00\u62CD crash\u3001\u5927\u9F13\u52A0\u5207\u5206\u5F80\u524D\u63A8\u3001\u7D50\u5C3E\u958B\u9238\u7529\u51FA\u53BB\uFF0C\u6BD4\u4E3B\u6B4C\u66F4\u6EFF\u3002"
      },
      pop_groove: {
        name: "\u6D41\u884C \u8B8A\u5316(\u5207\u5206\u5927\u9F13)",
        role: "variation",
        genres: [
          "pop",
          "citypop"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          95,
          128
        ],
        pattern: {
          closedHat: "x-x-x-x-x-x-x-x-",
          snare: "----x-------x---",
          kick: "x-----x-x-------"
        },
        note: "\u5927\u9F13\u591A\u4E86\u300E\u8207\u4E8C\u62CD\u300F\u63A8\u9032\uFF0C\u6BD4\u7D14 8-beat \u66F4\u6709\u5F8B\u52D5\u3002"
      },
      pop_dance: {
        name: "\u6D41\u884C \u8B8A\u5316(\u821E\u66F2\u56DB\u8E29)",
        role: "variation",
        genres: [
          "pop",
          "edm"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          110,
          128
        ],
        pattern: {
          kick: "x---x---x---x---",
          clap: "----x-------x---",
          openHat: "--x---x---x---x-"
        },
        note: "four-on-the-floor \u6D41\u884C\u821E\u66F2\uFF1A\u5927\u9F13\u6BCF\u62CD\u8E29\u3001\u62CD\u624B 2/4\u3001\u958B\u9238\u8D70\u53CD\u62CD\u3002"
      },
      ballad_rim: {
        name: "\u6292\u60C5 \u57FA\u672C(\u908A\u64CA)",
        role: "basic",
        genres: [
          "ballad",
          "cinematic"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          60,
          80
        ],
        pattern: {
          closedHat: "x---x---x---x---",
          rim: "----x-------x---",
          kick: "x-------x-------"
        },
        note: "\u908A\u64CA(cross-stick)\u4EE3\u66FF\u5C0F\u9F13\uFF0C\u7A00\u758F\u3001\u7559\u7A7A\u9593\u7D66\u4EBA\u8072\u3002\u6162\u6B4C\u4E3B\u6B4C\u5E38\u7528\u3002"
      },
      ballad_brush: {
        name: "\u6292\u60C5 \u4E3B\u6B4C(\u8F15\u5237)",
        role: "verse",
        genres: [
          "ballad"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          60,
          80
        ],
        pattern: {
          closedHat: "x---x---x---x---",
          snare: "----g-------g---",
          kick: "x-------x-------"
        },
        note: "\u5C0F\u9F13\u6539\u5E7D\u9748\u97F3(\u8F15),\u50CF\u5237\u68D2,\u6700\u5B89\u975C\u7684\u5C64\u6B21\u3002"
      },
      ballad_build: {
        name: "\u6292\u60C5 \u526F\u6B4C(\u5806\u758A)",
        role: "chorus",
        genres: [
          "ballad",
          "cinematic"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          65,
          85
        ],
        pattern: {
          crash: "x---------------",
          closedHat: "x-x-x-x-x-x-x-x-",
          snare: "----x-------x---",
          kick: "x---x---x---x---"
        },
        note: "\u526F\u6B4C\u60C5\u7DD2\u4E0A\u4F86\uFF1A\u5927\u9F13\u56DB\u5206\u9A45\u52D5\u3001\u52A0 crash\uFF0C\u5F9E\u6292\u60C5\u9577\u51FA\u529B\u91CF\u3002"
      },
      ballad_128: {
        name: "\u6292\u60C5 12/8 \u6162\u6416",
        role: "variation",
        genres: [
          "ballad",
          "blues"
        ],
        steps: 12,
        swing: 0,
        feel: "12/8",
        tempo: [
          55,
          75
        ],
        pattern: {
          closedHat: "x-xx-xx-xx-x",
          kick: "x-----x-----",
          snare: "------x-----"
        },
        note: "12/8 \u4E09\u9023\u611F\uFF1A\u6BCF\u62CD\u4E09\u4E0B,\u5C0F\u9F13\u843D\u7B2C 3 \u62CD,\u7D93\u5178\u9748\u9B42\u6162\u6B4C(6/8 ballad)\u3002"
      },
      citypop_groove: {
        name: "City Pop \u57FA\u672C",
        role: "basic",
        genres: [
          "citypop",
          "pop"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          95,
          118
        ],
        pattern: {
          closedHat: "x-x-x-x-x-x-x-x-",
          snare: "----x-------x---",
          kick: "x--x----x-x-----"
        },
        note: "\u7DCA\u5BE6\u7684\u90FD\u6703\u6D41\u884C\u5E95\uFF1A\u5927\u9F13\u5E36\u9EDE\u5207\u5206,\u5C0F\u9F13 2\u30014,\u4E7E\u6DE8\u660E\u4EAE\u3002"
      },
      citypop_16: {
        name: "City Pop \u526F\u6B4C(16\u5206)",
        role: "chorus",
        genres: [
          "citypop",
          "rnb_neosoul"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          100,
          118
        ],
        pattern: {
          closedHat: "xxxxxxxxxxxxxxxx",
          snare: "----o--g----o-g-",
          kick: "x----x-x--x-x---"
        },
        note: "16 \u5206 hi-hat + \u5C0F\u9F13\u5E7D\u9748\u97F3,\u526F\u6B4C\u5F8B\u52D5\u66F4\u5BC6\u3001\u66F4 funky\u3002"
      },
      citypop_half: {
        name: "City Pop \u534A\u62CD",
        role: "variation",
        genres: [
          "citypop",
          "lofi"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          90,
          112
        ],
        pattern: {
          closedHat: "x-x-x-x-x-x-x-x-",
          snare: "--------o-------",
          kick: "x-----x---------"
        },
        note: "\u5C0F\u9F13\u53EA\u843D\u7B2C 3 \u62CD(\u534A\u62CD\u611F),\u901F\u5EA6\u611F\u653E\u6162\u4E00\u500D,\u5BEC\u9B06\u6F02\u6D6E\u3002"
      },
      neosoul_half: {
        name: "Neo-Soul \u534A\u62CD",
        role: "basic",
        genres: [
          "rnb_neosoul"
        ],
        steps: 16,
        swing: 0.12,
        feel: "laid-back",
        tempo: [
          60,
          90
        ],
        pattern: {
          closedHat: "x-x-x-x-x-x-x-x-",
          snare: "--------o-------",
          kick: "x-----x-----x---"
        },
        note: "\u5C0F\u9F13\u843D\u7B2C 3 \u62CD(\u534A\u62CD\u611F),\u6574\u9AD4\u5F80\u5F8C\u9760,\u6175\u61F6 neo-soul \u5730\u57FA\u3002"
      },
      neosoul_ghost: {
        name: "Neo-Soul \u526F\u6B4C(\u5E7D\u9748\u97F3)",
        role: "chorus",
        genres: [
          "rnb_neosoul"
        ],
        steps: 16,
        swing: 0.08,
        feel: "straight",
        tempo: [
          70,
          95
        ],
        pattern: {
          closedHat: "xxxxxxxxxxxxxxxx",
          snare: "g-g-o-g-g-g-o-g-",
          kick: "x--x--x---x-x---"
        },
        note: "\u6EFF\u6EFF\u5C0F\u9F13\u5E7D\u9748\u97F3\u7A7F\u63D2\u91CD\u97F3,16 \u5206 hi-hat,\u6A19\u6E96 D'Angelo \u5F0F groove\u3002"
      },
      neosoul_swung: {
        name: "Neo-Soul \u4E3B\u6B4C(\u6416\u64FA)",
        role: "verse",
        genres: [
          "rnb_neosoul",
          "lofi"
        ],
        steps: 16,
        swing: 0.14,
        feel: "laid-back",
        tempo: [
          60,
          85
        ],
        pattern: {
          closedHat: "x-x-x-x-x-x-x-x-",
          snare: "----o-------o---",
          kick: "x--x--x---x-----"
        },
        note: "\u6416\u64FA hi-hat + \u5207\u5206\u5927\u9F13,\u6BD4\u534A\u62CD\u591A\u4E00\u9EDE\u63A8\u9032,\u4E3B\u6B4C\u7528\u3002"
      },
      jazz_swing: {
        name: "\u7235\u58EB Swing Ride",
        role: "basic",
        genres: [
          "jazz"
        ],
        steps: 12,
        swing: 0,
        feel: "swing",
        tempo: [
          110,
          220
        ],
        pattern: {
          ride: "x--xx-x--xx-",
          pedalHat: "---x-----x--"
        },
        note: "\u4E09\u9023\u97F3\u683C:ride \u6253 spang-a-lang,\u8173\u8E0F hi-hat \u843D 2\u30014\u3002\u7235\u58EB\u547D\u8108\u3002"
      },
      jazz_comp: {
        name: "\u7235\u58EB \u5FEB\u677F(comping)",
        role: "chorus",
        genres: [
          "jazz"
        ],
        steps: 12,
        swing: 0,
        feel: "swing",
        tempo: [
          160,
          220
        ],
        pattern: {
          ride: "x--xx-x--xx-",
          pedalHat: "---x-----x--",
          kick: "x--x--x--x--",
          snare: "------x-----"
        },
        note: "\u5FEB\u677F\u52A0 feathered \u5927\u9F13 + \u5C0F\u9F13 comping \u9EDE\u7DB4,\u63A8\u529B\u66F4\u5F37\u3002"
      },
      jazz_brush: {
        name: "\u7235\u58EB \u6162\u677F(\u5237)",
        role: "verse",
        genres: [
          "jazz"
        ],
        steps: 12,
        swing: 0,
        feel: "swing",
        tempo: [
          80,
          140
        ],
        pattern: {
          ride: "x--x--x--x--",
          pedalHat: "---x-----x--"
        },
        note: "ride \u53EA\u6253\u56DB\u5206\u3001\u6975\u7C21,\u50CF\u5237\u68D2,\u6162\u677F\u6292\u60C5\u7235\u58EB\u3002"
      },
      blues_shuffle: {
        name: "\u85CD\u8ABF Shuffle",
        role: "basic",
        genres: [
          "blues"
        ],
        steps: 12,
        swing: 0,
        feel: "shuffle",
        tempo: [
          70,
          130
        ],
        pattern: {
          closedHat: "x-xx-xx-xx-x",
          snare: "---x-----x--",
          kick: "x-----x-----"
        },
        note: "\u4E09\u9023\u97F3 shuffle:\u6BCF\u62CD\u300E\u9577-\u77ED\u300F,\u85CD\u8ABF/\u6162\u6416\u6EFE\u7684\u6839\u672C\u5F8B\u52D5\u3002"
      },
      blues_slow: {
        name: "\u85CD\u8ABF \u6162\u677F 12/8",
        role: "variation",
        genres: [
          "blues",
          "ballad"
        ],
        steps: 12,
        swing: 0,
        feel: "12/8",
        tempo: [
          50,
          80
        ],
        pattern: {
          closedHat: "x-xx-xx-xx-x",
          snare: "------x-----",
          kick: "x-----------"
        },
        note: "\u6162\u677F 12/8,\u5C0F\u9F13\u53EA\u843D\u7B2C 3 \u62CD,B.B. King \u5F0F\u6162\u85CD\u8ABF\u3002"
      },
      blues_boogie: {
        name: "\u85CD\u8ABF Boogie(\u9A45\u52D5)",
        role: "chorus",
        genres: [
          "blues",
          "rock"
        ],
        steps: 12,
        swing: 0,
        feel: "shuffle",
        tempo: [
          90,
          160
        ],
        pattern: {
          closedHat: "x-xx-xx-xx-x",
          snare: "---x-----x--",
          kick: "x--x--x--x--"
        },
        note: "\u5927\u9F13\u6BCF\u62CD\u8E29\u7684\u9A45\u52D5 shuffle,boogie-woogie / \u5FEB\u85CD\u8ABF\u3002"
      },
      lofi_boombap: {
        name: "Lo-Fi Boom-Bap",
        role: "basic",
        genres: [
          "lofi"
        ],
        steps: 16,
        swing: 0.15,
        feel: "laid-back",
        tempo: [
          70,
          90
        ],
        pattern: {
          closedHat: "x-x-x-x-x-x-x-x-",
          snare: "----x-------x---",
          kick: "x-----x-----x---"
        },
        note: "\u6416\u64FA + \u5F80\u5F8C\u9760\u7684\u300E\u5875\u571F\u611F\u300F,hip-hop \u5E95\u3002"
      },
      lofi_half: {
        name: "Lo-Fi \u534A\u62CD",
        role: "chorus",
        genres: [
          "lofi"
        ],
        steps: 16,
        swing: 0.15,
        feel: "laid-back",
        tempo: [
          70,
          90
        ],
        pattern: {
          closedHat: "x-x-x-x-x-x-x-x-",
          snare: "--------x-------",
          kick: "x-----x---------"
        },
        note: "\u5C0F\u9F13\u843D\u7B2C 3 \u62CD,\u66F4\u9B06\u66F4\u6162,\u8B80\u66F8 chill \u5FC5\u5099\u3002"
      },
      lofi_dusty: {
        name: "Lo-Fi \u4E3B\u6B4C(\u5875\u571F)",
        role: "verse",
        genres: [
          "lofi",
          "rnb_neosoul"
        ],
        steps: 16,
        swing: 0.18,
        feel: "laid-back",
        tempo: [
          68,
          88
        ],
        pattern: {
          closedHat: "x--xx--xx--xx--x",
          snare: "----x-------x---",
          kick: "x-------x---x---"
        },
        note: "hi-hat \u6416\u64FA\u4E0D\u898F\u5247\u3001\u523B\u610F\u9B06\u6563,\u6700\u6709\u9846\u7C92\u611F\u7684\u5C64\u6B21\u3002"
      },
      rock_8: {
        name: "\u6416\u6EFE \u57FA\u672C 8-beat",
        role: "basic",
        genres: [
          "rock",
          "pop",
          "folk"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          100,
          160
        ],
        pattern: {
          closedHat: "x-x-x-x-x-x-x-x-",
          snare: "----x-------x---",
          kick: "x-------x-------"
        },
        note: "\u6416\u6EFE\u5730\u57FA:\u5927\u9F13 1\u30013,\u5C0F\u9F13 2\u30014,hi-hat \u516B\u5206\u3002"
      },
      rock_drive: {
        name: "\u6416\u6EFE \u526F\u6B4C(\u9A45\u52D5)",
        role: "chorus",
        genres: [
          "rock"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          110,
          170
        ],
        pattern: {
          crash: "x---------------",
          closedHat: "x-x-x-x-x-x-x-x-",
          snare: "----x-------x---",
          kick: "x-x-----x-x-----"
        },
        note: "\u5927\u9F13\u52A0\u96D9\u8E29\u63A8\u9032\u3001\u7B2C\u4E00\u62CD crash,\u526F\u6B4C\u529B\u91CF\u5168\u958B\u3002"
      },
      rock_half: {
        name: "\u6416\u6EFE \u534A\u62CD(\u91CD)",
        role: "variation",
        genres: [
          "rock",
          "cinematic"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          80,
          120
        ],
        pattern: {
          crash: "x---------------",
          closedHat: "x-x-x-x-x-x-x-x-",
          snare: "--------x-------",
          kick: "x-----x---------"
        },
        note: "\u5C0F\u9F13\u843D\u7B2C 3 \u62CD,\u6C89\u91CD\u7DE9\u6162,\u9069\u5408\u6A4B\u6BB5\u6216\u91CDriff\u3002"
      },
      rock_punk: {
        name: "\u9F90\u514B \u5FEB\u677F",
        role: "chorus",
        genres: [
          "rock"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          160,
          210
        ],
        pattern: {
          closedHat: "x-x-x-x-x-x-x-x-",
          snare: "----x-------x---",
          kick: "x-x-x-x-x-x-x-x-"
        },
        note: "\u5927\u9F13\u516B\u5206\u9023\u8E29,\u5FEB\u901F\u885D\u523A,\u9F90\u514B / \u786C\u6416\u6EFE\u3002"
      },
      folk_strum: {
        name: "\u6C11\u8B20 \u57FA\u672C",
        role: "basic",
        genres: [
          "folk",
          "country"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          80,
          120
        ],
        pattern: {
          closedHat: "x-x-x-x-x-x-x-x-",
          snare: "----x-------x---",
          kick: "x-------x-------"
        },
        note: "\u8F15\u5FEB\u6728\u5409\u4ED6\u5E95,\u5927\u9F13 1\u30013,\u5C0F\u9F13 2\u30014\u3002"
      },
      folk_finger: {
        name: "\u6C11\u8B20 \u6307\u5F48(\u7559\u767D)",
        role: "verse",
        genres: [
          "folk"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          75,
          110
        ],
        pattern: {
          closedHat: "x---x---x---x---",
          rim: "----x-------x---",
          kick: "x-------x-------"
        },
        note: "\u6700\u7A00\u758F:\u56DB\u5206 hi-hat + \u908A\u64CA,\u7D66\u6307\u5F48\u5409\u4ED6\u547C\u5438\u3002"
      },
      folk_train: {
        name: "\u6C11\u8B20 \u706B\u8ECA(\u5237)",
        role: "variation",
        genres: [
          "folk",
          "country"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          100,
          140
        ],
        pattern: {
          snare: "gxgxgxgxgxgxgxgx",
          kick: "x-------x-------"
        },
        note: "\u5C0F\u9F13\u5237 16 \u5206(train beat),\u5E7D\u9748\u97F3\u92EA\u5E95\u3001\u91CD\u97F3 2\u30014\u3002"
      },
      country_train: {
        name: "\u9109\u6751 \u706B\u8ECA\u7BC0\u594F",
        role: "basic",
        genres: [
          "country"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          100,
          140
        ],
        pattern: {
          snare: "oxoxoxoxoxoxoxox",
          kick: "x-------x-------"
        },
        note: "\u5C0F\u9F13\u5237 16 \u5206(train beat),\u91CD\u97F3\u843D 2\u30014\u3002\u9109\u6751\u62DB\u724C\u3002"
      },
      country_twostep: {
        name: "\u9109\u6751 \u5169\u6B65(boom-chick)",
        role: "variation",
        genres: [
          "country",
          "folk"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          90,
          130
        ],
        pattern: {
          closedHat: "x-x-x-x-x-x-x-x-",
          snare: "----x-------x---",
          kick: "x---x---x---x---"
        },
        note: "\u5927\u9F13\u6BCF\u62CD\u300Eboom\u300F\u3001\u5C0F\u9F13\u300Echick\u300F2\u30014,\u9109\u6751\u5169\u6B65\u821E\u3002"
      },
      country_shuffle: {
        name: "\u9109\u6751 Shuffle",
        role: "variation",
        genres: [
          "country",
          "blues"
        ],
        steps: 12,
        swing: 0,
        feel: "shuffle",
        tempo: [
          90,
          140
        ],
        pattern: {
          closedHat: "x-xx-xx-xx-x",
          snare: "---x-----x--",
          kick: "x-----x-----"
        },
        note: "\u4E09\u9023\u97F3 shuffle \u7684\u9109\u6751\u7248,\u8F15\u5FEB\u6416\u64FA\u3002"
      },
      cinematic_taiko: {
        name: "\u96FB\u5F71\u611F \u592A\u9F13(\u5806\u758A)",
        role: "basic",
        genres: [
          "cinematic"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          60,
          100
        ],
        pattern: {
          crash: "x---------------",
          midTom: "--------x-------",
          lowTom: "x---x-x-x---x-x-"
        },
        note: "\u4F4E\u97F3 tom \u50CF\u6230\u9F13\u5806\u758A\u5F35\u529B,\u9810\u544A\u7247 / \u53F2\u8A69\u611F\u3002"
      },
      cinematic_heart: {
        name: "\u96FB\u5F71\u611F \u5FC3\u8DF3",
        role: "verse",
        genres: [
          "cinematic",
          "ballad"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          55,
          90
        ],
        pattern: {
          closedHat: "x---x---x---x---",
          kick: "x-x-------x-x---"
        },
        note: "\u5927\u9F13\u5169\u4E0B\u4E00\u7D44\u50CF\u5FC3\u8DF3\u300E\u549A-\u549A\u300F,\u61F8\u7591\u3001\u7DCA\u5F35\u92EA\u9673\u3002"
      },
      cinematic_hits: {
        name: "\u96FB\u5F71\u611F \u5927\u9F13\u9EDE",
        role: "chorus",
        genres: [
          "cinematic"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          60,
          100
        ],
        pattern: {
          crash: "x-------x-------",
          lowTom: "x-------x-------",
          snare: "--------x-------"
        },
        note: "\u5927\u9238 + \u4F4E tom \u540C\u6B65\u91CD\u64CA,\u9AD8\u6F6E\u300Ebraam\u300F\u5F0F\u885D\u64CA\u9EDE\u3002"
      },
      funk_16: {
        name: "\u653E\u514B 16th",
        role: "basic",
        genres: [
          "funk",
          "rnb_neosoul"
        ],
        steps: 16,
        swing: 0.08,
        feel: "straight",
        tempo: [
          95,
          120
        ],
        pattern: {
          closedHat: "xxxxxxxxxxxxxxxx",
          snare: "----o--g----o-g-",
          kick: "x--x--x---x-x---"
        },
        note: "16 \u5206 hi-hat + \u5207\u5206\u5927\u9F13 + \u5C0F\u9F13\u5E7D\u9748\u97F3,\u91CD groove\u3002"
      },
      funk_one: {
        name: "\u653E\u514B On The One",
        role: "chorus",
        genres: [
          "funk"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          95,
          115
        ],
        pattern: {
          closedHat: "xxxxxxxxxxxxxxxx",
          snare: "----o-------o---",
          kick: "x------x-x------"
        },
        note: "\u91CD\u97F3\u5168\u58D3\u5728\u7B2C\u4E00\u62CD\u300EThe One\u300F,James Brown \u5F0F\u653E\u514B\u3002"
      },
      funk_half: {
        name: "\u653E\u514B \u534A\u62CD",
        role: "verse",
        genres: [
          "funk"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          90,
          110
        ],
        pattern: {
          closedHat: "xxxxxxxxxxxxxxxx",
          snare: "--------o-------",
          kick: "x--x----x-------"
        },
        note: "\u5C0F\u9F13\u843D\u7B2C 3 \u62CD\u7684\u534A\u62CD\u653E\u514B,\u6C89\u3001\u5BEC\u3001\u597D sample\u3002"
      },
      funk_purdie: {
        name: "\u653E\u514B \u534A\u62CD Shuffle",
        role: "chorus",
        genres: [
          "funk",
          "rnb_neosoul"
        ],
        steps: 16,
        swing: 0.3,
        feel: "shuffle",
        tempo: [
          90,
          110
        ],
        pattern: {
          closedHat: "xxxxxxxxxxxxxxxx",
          snare: "--g-o-g---g-o-g-",
          kick: "x--x----x-------"
        },
        note: "\u50B3\u5947 Purdie Shuffle:\u534A\u62CD + \u6416\u64FA + \u6EFF\u6EFF\u5E7D\u9748\u97F3,\u6700\u96E3\u4E5F\u6700 funky\u3002"
      },
      bossa: {
        name: "Bossa Nova",
        role: "basic",
        genres: [
          "bossa"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          120,
          140
        ],
        pattern: {
          closedHat: "x-x-x-x-x-x-x-x-",
          rim: "x--x--x---x-x---",
          kick: "x------x-x------"
        },
        note: "\u908A\u64CA\u6253 clave \u578B\u3001\u7121\u91CD backbeat,\u8F15\u67D4\u6416\u64FA\u3002"
      },
      samba: {
        name: "Samba",
        role: "chorus",
        genres: [
          "bossa"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          95,
          135
        ],
        pattern: {
          shaker: "xxxxxxxxxxxxxxxx",
          rim: "x--x-x-x--x-x-x-",
          kick: "x--x--x-x--x--x-"
        },
        note: "\u6BD4 bossa \u66F4\u71B1:\u6C99\u9234\u92EA 16 \u5206\u3001\u5927\u9F13 surdo \u5F8B\u52D5,\u5DF4\u897F\u5609\u5E74\u83EF\u3002"
      },
      bossa_clave: {
        name: "Bossa \u8B8A\u5316(\u6C99\u9234)",
        role: "variation",
        genres: [
          "bossa",
          "jazz"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          120,
          140
        ],
        pattern: {
          shaker: "x-x-x-x-x-x-x-x-",
          rim: "x--x--x---x-x---",
          kick: "x------x-x------"
        },
        note: "bossa \u52A0\u6C99\u9234\u516B\u5206,\u66F4\u6709\u7A7A\u6C23\u611F\u7684\u62C9\u4E01\u5F8B\u52D5\u3002"
      },
      edm_four: {
        name: "EDM \u56DB\u8E29",
        role: "basic",
        genres: [
          "edm"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          120,
          130
        ],
        pattern: {
          kick: "x---x---x---x---",
          clap: "----x-------x---",
          openHat: "--x---x---x---x-"
        },
        note: "four-on-the-floor:\u5927\u9F13\u6BCF\u62CD\u8E29\u3001\u62CD\u624B 2/4\u3001\u958B\u9238\u8D70\u53CD\u62CD\u3002"
      },
      house: {
        name: "House \u5F8B\u52D5",
        role: "verse",
        genres: [
          "edm"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          120,
          128
        ],
        pattern: {
          kick: "x---x---x---x---",
          clap: "----x-------x---",
          openHat: "--x---x---x---x-",
          closedHat: "x-x-x-x-x-x-x-x-",
          shaker: "--x---x---x---x-"
        },
        note: "\u56DB\u8E29 + \u9589\u9238\u516B\u5206 + \u6C99\u9234,\u6BD4\u7D14\u56DB\u8E29\u66F4\u5BC6\u66F4\u821E\u3002"
      },
      techno: {
        name: "Techno \u9A45\u52D5",
        role: "chorus",
        genres: [
          "edm"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          125,
          135
        ],
        pattern: {
          kick: "x---x---x---x---",
          ride: "xxxxxxxxxxxxxxxx",
          closedHat: "--x---x---x---x-",
          clap: "----x-------x---"
        },
        note: "\u56DB\u8E29 + \u6301\u7E8C ride \u92EA\u6EFF,\u50AC\u7720\u3001\u6A5F\u68B0\u7684\u5730\u4E0B\u5F8B\u52D5\u3002"
      },
      trap: {
        name: "Trap \u534A\u62CD",
        role: "variation",
        genres: [
          "edm",
          "lofi"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          130,
          150
        ],
        pattern: {
          closedHat: "x-x-xxx-x-x-xx-x",
          snare: "--------x-------",
          kick: "x-----x-x-------"
        },
        note: "hi-hat \u9023\u6253(roll) + \u534A\u62CD 808 \u5927\u9F13,trap / \u563B\u54C8\u3002"
      },
      fill_tom: {
        name: "\u904E\u9580 Tom \u4E0B\u884C",
        role: "fill",
        genres: [
          "rock",
          "pop",
          "folk",
          "country",
          "citypop"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          90,
          160
        ],
        pattern: {
          crash: "x---------------",
          closedHat: "x-x-x-x---------",
          kick: "x-------x-------",
          snare: "----x---xx------",
          hiTom: "----------xx----",
          midTom: "------------xx--",
          lowTom: "--------------xx"
        },
        note: "\u6700\u901A\u7528\u7684\u904E\u9580:\u524D\u5169\u62CD\u6B63\u5E38\u5F8B\u52D5,\u5F8C\u5169\u62CD tom 16 \u5206\u300E\u9AD8\u2192\u4E2D\u2192\u4F4E\u300F\u4E0B\u884C\u6EFE\u594F,\u56DE\u5230\u7B2C\u4E00\u62CD\u843D crash\u3002\u63DB\u6BB5\u524D\u4E00\u5C0F\u7BC0\u7528\u3002"
      },
      fill_snare_build: {
        name: "\u904E\u9580 \u5C0F\u9F13\u6EFE\u594F(riser)",
        role: "fill",
        genres: [
          "pop",
          "rock",
          "edm"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          100,
          140
        ],
        pattern: {
          crash: "x---------------",
          kick: "x-------x-------",
          snare: "x---x---x-x-xxxx"
        },
        note: "\u5C0F\u9F13\u7531\u758F\u5230\u5BC6(4\u5206\u21928\u5206\u219216\u5206)\u7684\u6EFE\u594F,EDM riser / \u526F\u6B4C\u524D\u300E\u62C9\u7DCA\u300F\u6700\u5E38\u7528,\u7D50\u5C3E crash \u70B8\u958B\u3002"
      },
      fill_funk: {
        name: "\u904E\u9580 \u653E\u514B 16\u5206",
        role: "fill",
        genres: [
          "funk",
          "rnb_neosoul",
          "citypop",
          "lofi"
        ],
        steps: 16,
        swing: 0.08,
        feel: "straight",
        tempo: [
          90,
          120
        ],
        pattern: {
          crash: "x---------------",
          closedHat: "xxxxxxxx--------",
          kick: "x--x------------",
          snare: "--g-o-g-oxgxoxgx"
        },
        note: "\u524D\u534A hi-hat,\u5F8C\u534A\u8F49\u6EFF\u6EFF\u5C0F\u9F13\u5E7D\u9748+\u91CD\u97F3 16 \u5206,\u653E\u514B / neo-soul \u7684 turnaround\u3002"
      },
      fill_swing: {
        name: "\u904E\u9580 \u7235\u58EB \u4E09\u9023",
        role: "fill",
        genres: [
          "jazz"
        ],
        steps: 12,
        swing: 0,
        feel: "swing",
        tempo: [
          120,
          220
        ],
        pattern: {
          crash: "x-----------",
          ride: "x--xx-x-----",
          snare: "------xx----",
          midTom: "--------xx--",
          lowTom: "----------xx"
        },
        note: "\u4E09\u9023\u97F3\u683C:\u524D\u5169\u62CD ride,\u5F8C\u5169\u62CD\u5C0F\u9F13\u2192\u4E2D\u2192\u4F4E tom \u4E09\u9023\u4E0B\u884C,\u7235\u58EB turnaround\u3002"
      },
      fill_shuffle: {
        name: "\u904E\u9580 Shuffle",
        role: "fill",
        genres: [
          "blues",
          "country"
        ],
        steps: 12,
        swing: 0,
        feel: "shuffle",
        tempo: [
          80,
          140
        ],
        pattern: {
          closedHat: "x-xx-x------",
          snare: "------x-xx-x",
          kick: "x-----------"
        },
        note: "\u4E09\u9023 shuffle \u904E\u9580:\u5F8C\u5169\u62CD\u5C0F\u9F13\u5207\u5206\u6EFE\u594F,\u85CD\u8ABF / \u9109\u6751\u7684\u8F49\u6298\u3002"
      },
      fill_cinematic: {
        name: "\u904E\u9580 \u592A\u9F13 build",
        role: "fill",
        genres: [
          "cinematic",
          "rock"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          60,
          120
        ],
        pattern: {
          crash: "x-------x-------",
          lowTom: "x-x-x-x-xxxxxxxx",
          midTom: "--------x-x-x-x-"
        },
        note: "\u4F4E tom \u7531 8 \u5206\u52A0\u901F\u5230 16 \u5206\u6EFE\u594F + \u4E2D tom \u758A\u52A0,\u53F2\u8A69 build-up,\u96D9 crash \u63A8\u4E0A\u9AD8\u6F6E\u3002"
      },
      fill_ballad: {
        name: "\u904E\u9580 \u6292\u60C5(\u8F15)",
        role: "fill",
        genres: [
          "ballad",
          "cinematic"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          55,
          90
        ],
        pattern: {
          crash: "x---------------",
          closedHat: "x---x---x-------",
          snare: "----------g-gxx-",
          kick: "x---------------"
        },
        note: "\u8F15\u5DE7\u7684\u6162\u6B4C\u904E\u9580:\u5F8C\u6BB5\u5C0F\u9F13\u5E7D\u9748\u2192\u8F15\u6EFE,\u9EDE\u5230\u70BA\u6B62\u3001\u4E0D\u6436\u4EBA\u8072\u3002"
      },
      fill_bossa: {
        name: "\u904E\u9580 \u62C9\u4E01(\u6253\u64CA)",
        role: "fill",
        genres: [
          "bossa"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          110,
          140
        ],
        pattern: {
          shaker: "xxxxxxxxxxxxxxxx",
          rim: "----x-x-x-xx-xxx",
          kick: "x-------x-------"
        },
        note: "\u6C99\u9234\u92EA\u6EFF + \u908A\u64CA\u5207\u5206\u52A0\u5BC6\u6EFE\u594F,\u62C9\u4E01 / bossa \u7684\u904E\u9580\u3002"
      },
      post_build: {
        name: "\u5F8C\u6416 \u6F38\u5F37 build",
        role: "basic",
        genres: [
          "post_rock",
          "cinematic"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          80,
          140
        ],
        pattern: {
          crash: "x---------------",
          closedHat: "x-x-x-x-x-x-x-x-",
          snare: "----x-------x---",
          kick: "x--x--x-x--x--x-"
        },
        note: "\u5F8C\u6416\u62DB\u724C:\u516B\u5206 hi-hat + \u5207\u5206\u5927\u9F13 + \u7B2C\u4E00\u62CD crash,\u5F9E\u4E7E\u6DE8\u5F80\u4E0A\u5806\u3002"
      },
      post_swell: {
        name: "\u5F8C\u6416 \u4E3B\u6B4C(\u7559\u767D)",
        role: "verse",
        genres: [
          "post_rock",
          "ballad"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          70,
          110
        ],
        pattern: {
          closedHat: "x---x---x---x---",
          rim: "----x-------x---",
          kick: "x-------x-------"
        },
        note: "\u6700\u5B89\u975C\u7684\u5C64:\u56DB\u5206 hi-hat + \u908A\u64CA,\u7559\u5927\u91CF\u7A7A\u9593\u7D66 delay \u5409\u4ED6,\u7B49\u8457\u6F38\u5F37\u3002"
      },
      post_68: {
        name: "\u5F8C\u6416 6/8 \u6D41\u52D5",
        role: "chorus",
        genres: [
          "post_rock"
        ],
        steps: 12,
        swing: 0,
        feel: "6/8",
        tempo: [
          70,
          120
        ],
        pattern: {
          ride: "x-xx-xx-xx-x",
          snare: "------x-----",
          kick: "x-----x-----"
        },
        note: "6/8 \u4E09\u9023\u6D41\u52D5\u611F,ride \u92EA\u6EFF\u3001\u5C0F\u9F13\u843D\u7B2C 3 \u62CD,\u5F8C\u6416\u5E38\u7528\u7684\u64FA\u76EA\u62CD\u3002"
      },
      post_climax: {
        name: "\u5F8C\u6416 \u9AD8\u6F6E(\u6EFF)",
        role: "chorus",
        genres: [
          "post_rock"
        ],
        steps: 16,
        swing: 0,
        feel: "straight",
        tempo: [
          110,
          160
        ],
        pattern: {
          crash: "x-------x-------",
          closedHat: "xxxxxxxxxxxxxxxx",
          snare: "----x-------x---",
          kick: "x-x-x-x-x-x-x-x-",
          lowTom: "x---------------"
        },
        note: "\u7246\u97F3\u9AD8\u6F6E:16 \u5206 hi-hat \u5168\u958B + \u5927\u9F13\u516B\u5206\u9023\u8E29 + \u96D9 crash,quiet-loud \u7684 loud\u3002"
      },
      waltz_basic: {
        name: "\u83EF\u723E\u6ECB 3/4 \u57FA\u672C",
        role: "basic",
        genres: [
          "folk",
          "country",
          "pop",
          "ballad",
          "cinematic"
        ],
        steps: 12,
        swing: 0,
        feel: "3/4",
        tempo: [
          80,
          150
        ],
        pattern: {
          closedHat: "x-x-x-x-x-x-",
          snare: "----x---x---",
          kick: "x-----------"
        },
        note: "3/4 \u5713\u821E\u66F2\uFF1A\u5927\u9F13\u843D\u7B2C 1 \u62CD(\u8E66),\u5C0F\u9F13\u843D\u7B2C 2\u30013 \u62CD(\u6070\u3001\u6070),hi-hat \u8D70\u516B\u5206\u3002\u7D93\u5178\u8E66-\u6070-\u6070\u3002"
      },
      waltz_jazz: {
        name: "\u7235\u58EB\u83EF\u723E\u6ECB 3/4",
        role: "variation",
        genres: [
          "jazz",
          "bossa"
        ],
        steps: 12,
        swing: 0,
        feel: "3/4",
        tempo: [
          90,
          180
        ],
        pattern: {
          ride: "x-xx-xx-xx-x",
          snare: "----x---x---",
          kick: "x-----------"
        },
        note: "\u7235\u58EB\u4E09\u62CD:ride \u5E36\u4E09\u9023\u64FA\u76EA,\u5C0F\u9F13\u8F15\u9EDE 2\u30013 \u62CD,\u9069\u5408 jazz waltz\u3002"
      },
      waltz_rock: {
        name: "\u6416\u6EFE\u83EF\u723E\u6ECB 3/4",
        role: "variation",
        genres: [
          "rock",
          "post_rock",
          "pop"
        ],
        steps: 12,
        swing: 0,
        feel: "3/4",
        tempo: [
          90,
          160
        ],
        pattern: {
          closedHat: "x-x-x-x-x-x-",
          snare: "----x-------",
          kick: "x-------x---"
        },
        note: "3/4 \u6416\u6EFE:\u5927\u9F13 1 \u8207\u7B2C 3 \u62CD\u524D\u588A,\u5C0F\u9F13\u843D\u7B2C 2 \u62CD,\u63A8\u9032\u611F\u7684\u4E09\u62CD\u3002"
      },
      folk_68: {
        name: "\u6C11\u8B20 6/8 \u6416\u64FA",
        role: "basic",
        genres: [
          "folk",
          "pop",
          "country",
          "cinematic"
        ],
        steps: 12,
        swing: 0,
        feel: "6/8",
        tempo: [
          60,
          110
        ],
        pattern: {
          closedHat: "x-xx-xx-xx-x",
          snare: "------x-----",
          kick: "x-----x-----"
        },
        note: "6/8 \u5169\u5927\u62CD\u5404\u4E09\u9023:\u5927\u9F13\u843D\u5169\u5927\u62CD\u982D,\u5C0F\u9F13\u843D\u7B2C 2 \u5927\u62CD,hi-hat \u92EA\u4E09\u9023\u3002\u6C11\u8B20/\u6292\u60C5\u5E38\u7528\u3002"
      },
      ballad_68: {
        name: "\u6292\u60C5 6/8 \u6162\u6416",
        role: "basic",
        genres: [
          "ballad",
          "pop",
          "rnb_neosoul"
        ],
        steps: 12,
        swing: 0,
        feel: "6/8",
        tempo: [
          50,
          85
        ],
        pattern: {
          closedHat: "x-x-x-x-x-x-",
          snare: "------x-----",
          kick: "x-----------"
        },
        note: "6/8 \u6162\u677F:\u5927\u9F13\u843D\u7B2C 1 \u5927\u62CD,\u5C0F\u9F13\u843D\u7B2C 2 \u5927\u62CD,\u7559\u767D\u7D66\u4EBA\u8072\u3002\u9748\u9B42\u6292\u60C5\u3002"
      }
    }
  };

  // data/rhythm-patterns.json
  var rhythm_patterns_default = {
    schemaVersion: 1,
    description: "\u6A02\u5668\u7BC0\u594F\u578B(\u975E\u9F13):\u5409\u4ED6\u5237\u5F26\u3001\u6307\u6CD5\u5206\u89E3\u3001\u9375\u76E4 comping\u3001\u8C9D\u65AF\u3002type=strum|comp|bass|finger\u3002steps=\u6BCF\u5C0F\u7BC0\u683C\u6578(8=\u516B\u5206,16=\u5341\u516D\u5206,6=6/8)\u3002strum \u5B57\u4E32\u5B57\u5143\uFF1AD=\u4E0B\u5237, U=\u4E0A\u5237, x=\u60B6\u97F3(mute), -=\u4F11\u6B62\u3002comp/bass \u5B57\u4E32\uFF1Ax=\u5F48, o=\u91CD\u97F3, -=\u4F11\u6B62\u3002finger(\u5409\u4ED6\u6307\u6CD5)\u5B57\u4E32\uFF1AT=\u62C7\u6307\u64A5\u6700\u4F4E\u97F3(\u6839\u97F3), A=\u62C7\u6307\u4EA4\u66FF\u4F4E\u97F3(\u4E94\u5EA6,Travis), 1=\u64A5\u6700\u9AD8\u97F3\u5F26, 2=\u6B21\u9AD8\u97F3, 3=\u7B2C\u4E09\u9AD8\u97F3, -=\u4F11\u6B62\uFF1B\u4F8B T1213121 \u5373\u53E4\u5178\u6C11\u8B20\u5206\u89E3\u3001T1A2T1A2 \u5373 Travis \u4EA4\u66FF\u4F4E\u97F3\u3002genres \u5F15\u7528 genres.json id\u3002\u4F9B\u5409\u4ED6\u624B\u8207\u7DE8\u66F2\u4F7F\u7528\uFF0C\u53EF\u96A8\u548C\u5F26\u9032\u884C\u64AD\u653E\u8207\u532F\u51FA MIDI\u3002",
    patterns: {
      strum_folk_basic: {
        name: "\u6C11\u8B20\u7D93\u5178\u5237\u6CD5",
        type: "strum",
        genres: ["folk", "pop", "country", "ballad"],
        steps: 8,
        feel: "straight",
        tempo: [80, 130],
        pattern: "D-DU-UDU",
        note: "\u6700\u842C\u7528\u7684\u300E\u4E0B\u4E0B\u4E0A \u4E0A\u4E0B\u4E0A\u300F\uFF0C\u5E7E\u4E4E\u842C\u80FD\u3002"
      },
      strum_down_4: {
        name: "\u5168\u4E0B\u5237",
        type: "strum",
        genres: ["rock", "folk", "country"],
        steps: 8,
        feel: "straight",
        tempo: [70, 140],
        pattern: "D-D-D-D-",
        note: "\u6BCF\u62CD\u4E0B\u5237\uFF0C\u7D2E\u5BE6\u6709\u529B\uFF0C\u6416\u6EFE\u7BC0\u594F\u5409\u4ED6\u3002"
      },
      strum_funk_mute: {
        name: "\u653E\u514B\u60B6\u97F3 16th",
        type: "strum",
        genres: ["funk", "rnb_neosoul"],
        steps: 16,
        feel: "straight",
        tempo: [95, 120],
        pattern: "xxDxxUxxxUxDxxUx",
        note: "16 \u5206\u60B6\u97F3\u70BA\u5E95\u3001\u91CD\u62CD\u958B\u8072\uFF0C\u9760\u53F3\u624B groove\u3002"
      },
      strum_ballad_68: {
        name: "\u6292\u60C5 6/8 \u5206\u89E3\u5237",
        type: "strum",
        genres: ["ballad", "cinematic"],
        steps: 6,
        feel: "straight",
        tempo: [50, 80],
        pattern: "D-DU-U",
        note: "6/8 \u6416\u7C43\u611F\uFF0C\u6292\u60C5\u6162\u6B4C\u5E38\u7528\u3002"
      },
      strum_waltz_3: {
        name: "\u83EF\u723E\u6ECB 3/4",
        type: "strum",
        genres: ["folk", "cinematic"],
        steps: 6,
        feel: "straight",
        tempo: [90, 160],
        pattern: "D-U-U-",
        note: "\u300E\u8E66-\u6070-\u6070\u300F\uFF0C\u4E09\u62CD\u5B50\u5206\u89E3\u3002"
      },
      finger_folk_t1213121: {
        name: "\u6C11\u8B20\u6307\u6CD5 T1213121",
        type: "finger",
        genres: ["folk", "pop", "ballad", "country"],
        steps: 8,
        feel: "straight",
        tempo: [60, 120],
        pattern: "T1213121",
        note: "\u6700\u7D93\u5178\u7684\u5409\u4ED6\u5206\u89E3:\u62C7\u6307\u8D70\u4F4E\u97F3(T)\uFF0C\u98DF/\u4E2D/\u7121\u540D\u8F2A\u6D41\u64A5\u9AD8\u97F3\u5F26\u3002\u5F48\u5531\u842C\u7528\u3002"
      },
      finger_arp_updown: {
        name: "\u4E0A\u4E0B\u5206\u89E3 T123T321",
        type: "finger",
        genres: ["pop", "citypop", "lofi", "ballad"],
        steps: 8,
        feel: "straight",
        tempo: [70, 120],
        pattern: "T123T321",
        note: "\u5206\u89E3\u5148\u4E0A\u884C\u518D\u4E0B\u884C\uFF0C\u50CF\u6CE2\u6D6A\u4E00\u6A23\u6D41\u52D5\uFF0CCity Pop / Lo-fi \u5F88\u611B\u3002"
      },
      finger_ballad_68: {
        name: "\u6292\u60C5 6/8 \u6307\u6CD5 T12321",
        type: "finger",
        genres: ["ballad", "cinematic", "folk"],
        steps: 6,
        feel: "straight",
        tempo: [50, 85],
        pattern: "T12321",
        note: "6/8 \u6416\u7C43\u5F0F\u5206\u89E3\uFF0C\u6162\u6B4C\u50AC\u6DDA\u6A19\u914D\u3002"
      },
      finger_waltz: {
        name: "\u83EF\u723E\u6ECB\u6307\u6CD5 3/4 T12T13",
        type: "finger",
        genres: ["folk", "cinematic"],
        steps: 6,
        feel: "straight",
        tempo: [90, 160],
        pattern: "T12T13",
        note: "\u4E09\u62CD\u5B50\u5206\u89E3\uFF0C\u300E\u4F4E\u97F3-\u64A5-\u64A5\u300F\u5713\u821E\u66F2\u611F\u3002"
      },
      finger_travis: {
        name: "Travis \u4EA4\u66FF\u4F4E\u97F3 T1A2",
        type: "finger",
        genres: ["folk", "country", "blues"],
        steps: 8,
        feel: "straight",
        tempo: [80, 140],
        pattern: "T1A2T1A2",
        note: "\u62C7\u6307\u5728\u6839\u97F3(T)\u2194\u4E94\u5EA6(A)\u9593\u4EA4\u66FF\u3001\u624B\u6307\u593E\u9AD8\u97F3\u5F26 \u2014 Chet Atkins/\u9109\u6751\u6307\u5F48\u7684\u771F Travis\u3002"
      },
      comp_charleston: {
        name: "Charleston \u5207\u5206",
        type: "comp",
        genres: ["jazz", "funk", "rnb_neosoul"],
        steps: 16,
        feel: "swing",
        tempo: [100, 200],
        pattern: "o------x--------",
        note: "\u7B2C 1 \u62CD + \u7B2C 2 \u62CD\u7684\u300E\u8207\u300F\uFF0C\u7235\u58EB\u9375\u76E4/\u5409\u4ED6 comping \u62DB\u724C\u5207\u5206\u3002"
      },
      comp_offbeat: {
        name: "\u53CD\u62CD\u548C\u5F26\u9EDE",
        type: "comp",
        genres: ["pop", "edm", "citypop"],
        steps: 16,
        feel: "straight",
        tempo: [100, 130],
        pattern: "--x---x---x---x-",
        note: "\u548C\u5F26\u53EA\u843D\u5728\u53CD\u62CD(offbeat)\uFF0C\u8F15\u5FEB\u6709\u5F48\u6027\u3002"
      },
      bass_root_8: {
        name: "\u6839\u97F3\u516B\u5206",
        type: "bass",
        genres: ["rock", "pop", "edm"],
        steps: 16,
        feel: "straight",
        tempo: [100, 160],
        pattern: "x-x-x-x-x-x-x-x-",
        note: "\u7A69\u5B9A\u7684\u6839\u97F3\u516B\u5206\uFF0C\u6416\u6EFE/\u6D41\u884C\u5E95\u3002"
      },
      bass_root_fifth: {
        name: "\u6839\u97F3-\u4E94\u5EA6",
        type: "bass",
        genres: ["country", "folk"],
        steps: 16,
        feel: "straight",
        tempo: [90, 140],
        pattern: "o-------x-------",
        note: "\u62CD 1 \u6839\u97F3\u3001\u62CD 3 \u4E94\u5EA6\u4EA4\u66FF(boom-chick)\u3002"
      },
      bass_walking: {
        name: "\u8D70\u8DEF\u8C9D\u65AF Walking",
        type: "bass",
        genres: ["jazz", "blues"],
        steps: 16,
        feel: "swing",
        tempo: [110, 220],
        pattern: "o---x---x---x---",
        note: "\u56DB\u5206\u97F3\u7B26\u7D1A\u9032\u884C\u8D70\uFF0C\u7235\u58EB\u9748\u9B42\u3002"
      },
      bass_funk_synco: {
        name: "\u653E\u514B\u5207\u5206\u8C9D\u65AF",
        type: "bass",
        genres: ["funk", "rnb_neosoul", "edm"],
        steps: 16,
        feel: "straight",
        tempo: [95, 120],
        pattern: "o--o--x---ox--x-",
        note: "\u5207\u5206 + \u91CD\u97F3 + \u4F11\u6B62\uFF0Cpocket \u5168\u9760\u5B83\u3002"
      },
      comp_freddie: {
        name: "Freddie Green \u56DB\u5206 comping",
        type: "comp",
        genres: ["jazz"],
        steps: 16,
        feel: "swing",
        tempo: [100, 220],
        pattern: "x---x---x---x---",
        note: "\u7814\u7A76:freddiegreen.org\u3002\u56DB\u62CD\u6BCF\u62CD\u4E00\u4E0B\u77ED\u548C\u5F26(\u914D shell voicing),\u7235\u58EB\u7BC0\u594F\u5409\u4ED6\u7684\u5730\u57FA\u3002"
      },
      strum_rock_chug: {
        name: "\u6416\u6EFE\u60B6\u5237 Chug",
        type: "strum",
        genres: ["rock", "metal", "punk"],
        steps: 16,
        feel: "straight",
        tempo: [90, 180],
        pattern: "D-m-D-m-D-m-D-m-",
        note: "\u7814\u7A76:acousticguitar.com\u3002\u6BCF\u62CD\u958B\u5237\u3001\u53CD\u62CD\u60B6\u97F3(\u914D power voicing),\u6416\u6EFE\u7BC0\u594F\u5409\u4ED6\u7684\u63A8\u9032\u3002"
      },
      strum_boomchick: {
        name: "\u9109\u6751 Boom-Chick",
        type: "finger",
        genres: ["country"],
        steps: 16,
        feel: "straight",
        tempo: [90, 150],
        pattern: "T---S---T---S---",
        note: "\u7814\u7A76:acousticlife.tv\u3002\u62CD1/3 \u4F4E\u97F3(boom)\u3001\u62CD2/4 \u5237\u548C\u5F26(chick),\u9109\u6751\u62DB\u724C\u3002"
      },
      bass_root5_alt: {
        name: "\u6839\u97F3-\u4E94\u5EA6\u4EA4\u66FF boom",
        type: "bass",
        genres: ["country", "folk"],
        steps: 16,
        feel: "straight",
        tempo: [90, 150],
        pattern: "R---5---R---5---",
        note: "\u7814\u7A76:studybass.com\u3002\u62CD1\u6839\u97F3\u3001\u62CD3\u4E94\u5EA6,\u9109\u6751/\u85CD\u8349 boom-chick \u4F4E\u97F3\u3002"
      },
      strum_shuffle: {
        name: "\u85CD\u8ABF Shuffle \u5237",
        type: "strum",
        genres: ["blues"],
        steps: 16,
        feel: "swing",
        tempo: [70, 130],
        pattern: "D-U-D-U-D-U-D-U-",
        note: "\u7814\u7A76:happybluesman.com\u3002\u516B\u5206\u5237\u914D swing \u4E09\u9023\u611F(\u6416\u64FA\u7531\u5F15\u64CE\u5957)\u3002"
      },
      comp_dilla: {
        name: "Neo-Soul \u6175\u61F6 comping",
        type: "comp",
        genres: ["rnb_neosoul"],
        steps: 16,
        feel: "straight",
        tempo: [65, 95],
        pattern: "x--g-x-gx--g-x-g",
        note: "\u7814\u7A76:BRL Theory J Dilla\u300216 \u5206\u53CD\u62CD + \u5E7D\u9748\u97F3,\u6416\u64FA16\u5206\u8B93\u5B83\u62D6(\u5F15\u64CE\u5957)\u3002"
      },
      finger_bossa: {
        name: "Bossa Batida",
        type: "finger",
        genres: ["bossa"],
        steps: 16,
        feel: "straight",
        tempo: [110, 150],
        pattern: "T-S--S--T-S--S--",
        note: "\u7814\u7A76:tunableapp.com\u3002\u62C7\u6307\u4F4E\u97F3 + \u5207\u5206\u548C\u5F26,\u5DF4\u85A9\u8AFE\u74E6(\u55AE\u5C0F\u7BC0\u8FD1\u4F3C,\u76F4\u62CD\u4E0D\u6416\u64FA)\u3002"
      },
      bass_bossa: {
        name: "Bossa \u4F4E\u97F3",
        type: "bass",
        genres: ["bossa"],
        steps: 16,
        feel: "straight",
        tempo: [110, 150],
        pattern: "R-----5-R-----5-",
        note: "\u7814\u7A76:Wikipedia Bossa nova\u3002\u6839\u97F3 + \u53CD\u62CD\u4E94\u5EA6,\u9644\u9EDE\u611F\u3002"
      },
      comp_kui: {
        name: "City Pop \u5207\u5206 comping",
        type: "comp",
        genres: ["citypop", "lofi"],
        steps: 16,
        feel: "straight",
        tempo: [90, 120],
        pattern: "x---xx--x---xx--",
        note: "\u7814\u7A76:note.com \u57CE\u5E02\u6D41\u884C\u300E\u55B0\u3044\u300F\u6436\u62CD\u3002\u548C\u5F26\u5207\u5206\u63A8\u9032(\u914D extended \u5EF6\u4F38\u97F3)\u3002"
      },
      arp_postrock: {
        name: "\u5F8C\u6416\u5206\u89E3\u7436\u97F3",
        type: "finger",
        genres: ["post_rock", "cinematic"],
        steps: 16,
        feel: "straight",
        tempo: [70, 140],
        pattern: "T1232123T1232123",
        note: "\u7814\u7A76:docs/research-genre-comping.md \u5F8C\u6416\u6BB5(:569-602)\u3002\u4E7E\u6DE8 16 \u5206\u4E0A\u4E0B\u884C\u5206\u89E3\u7436\u97F3,\u5EFA\u7ACB\u5728\u91CD\u8907 riff \u4E0A,\u53D6\u4EE3\u539F\u672C post_rock \u5171\u7528\u7684\u6C11\u8B20\u6307\u5F48\u3002"
      },
      ostinato_cine: {
        name: "\u96FB\u5F71\u9811\u56FA\u97F3\u578B",
        type: "comp",
        genres: ["cinematic", "post_rock"],
        steps: 16,
        feel: "straight",
        tempo: [60, 100],
        pattern: "o-x-x-x-o-x-x-x-",
        note: "\u7814\u7A76:docs/research-genre-comping.md \u96FB\u5F71\u914D\u6A02\u6BB5(:534-566)\u3002\u516B\u5206\u8108\u52D5 ostinato(\u62CD1/3 \u91CD\u97F3),\u6A5F\u68B0\u5F0F\u7CBE\u6E96\u5806\u758A\u5F35\u529B\u3002\u5F15\u64CE comp \u578B\u5F48\u6574\u584A\u548C\u5F26\u8108\u52D5;\u55AE\u97F3 root-5-8 \u52D5\u7DDA\u9700 bass \u578B\u53E6\u4F5C(\u898B\u57F7\u884C\u7D50\u679C\u504F\u96E2)\u3002"
      },
      stab_edm: {
        name: "EDM \u53CD\u62CD stab",
        type: "comp",
        genres: ["edm"],
        steps: 16,
        feel: "straight",
        tempo: [120, 130],
        pattern: "--x---xx--x---xx",
        note: "\u7814\u7A76:docs/research-genre-comping.md EDM \u6BB5(:454-487)\u300216 \u5206\u53CD\u62CD stab,\u523B\u610F\u907F\u958B\u5927\u9F13\u4F54\u64DA\u7684\u6B63\u62CD(0/4/8/12=four-on-the-floor kick)\u3002"
      }
    }
  };

  // data/instruments.json
  var instruments_default = {
    schemaVersion: 1,
    description: "\u6A02\u5668\u8ABF\u8272\u76E4(\u7DE8\u66F2/\u767C\u8072\u7528)\u8207\u8ABF\u97F3\u5668\u9810\u8A2D(tuner)\u3002instruments=\u53EF\u9078\u97F3\u8272\uFF0Cfamily/role \u4F9B\u7DE8\u66F2\u8349\u7A3F\u5206\u5C64\uFF0Csound=\u97F3\u8A0A\u5C64 sampler/synth id\uFF0Cregister=\u5EFA\u8B70\u97F3\u57DF(\u79D1\u5B78\u97F3\u9AD8)\u3002tunerPresets=\u8ABF\u97F3\u5668\u5404\u6A02\u5668\u7A7A\u5F26\uFF0Cnote+hz(A4=440 \u7B49\u5F8B)\uFF1Bchromatic \u7121\u56FA\u5B9A\u5F26\uFF0C\u5075\u6E2C\u6700\u8FD1\u534A\u97F3\u3002referencePitch \u9810\u8A2D 440\uFF0C\u53EF\u8ABF 432\u2013446\u3002",
    referencePitch: { default: 440, min: 432, max: 446, unit: "Hz" },
    instruments: {
      piano: { zh: "\u92FC\u7434", family: "keys", role: "harmony", sound: "piano", register: ["A0", "C8"] },
      epiano: { zh: "\u96FB\u92FC\u7434", family: "keys", role: "harmony", sound: "epiano", register: ["E1", "E6"] },
      nylon_guitar: { zh: "\u53E4\u5178\u5409\u4ED6", family: "string", role: "harmony", sound: "nylonGuitar", register: ["E2", "B5"] },
      steel_guitar: { zh: "\u6C11\u8B20\u5409\u4ED6", family: "string", role: "rhythm", sound: "steelGuitar", register: ["E2", "E6"] },
      clean_elec: { zh: "\u96FB\u5409\u4ED6(\u4E7E\u6DE8)", family: "string", role: "lead", sound: "cleanElec", register: ["E2", "E6"] },
      bass: { zh: "\u96FB\u8C9D\u65AF", family: "string", role: "bass", sound: "fingeredBass", register: ["E1", "G3"] },
      strings: { zh: "\u5F26\u6A02", family: "bowed", role: "pad", sound: "strings", register: ["C2", "C6"] },
      synth_pad: { zh: "\u5408\u6210 Pad", family: "synth", role: "pad", sound: "synthPad", register: ["C2", "C6"] },
      synth_lead: { zh: "\u5408\u6210 Lead", family: "synth", role: "lead", sound: "synthLead", register: ["C3", "C7"] },
      drums: { zh: "\u9F13\u7D44", family: "perc", role: "drums", sound: "drumKit", register: null }
    },
    tunerPresets: {
      guitar_standard: { zh: "\u5409\u4ED6 \u6A19\u6E96 EADGBE", instrument: "guitar", strings: [
        { name: "E2", hz: 82.41 },
        { name: "A2", hz: 110 },
        { name: "D3", hz: 146.83 },
        { name: "G3", hz: 196 },
        { name: "B3", hz: 246.94 },
        { name: "E4", hz: 329.63 }
      ] },
      guitar_drop_d: { zh: "\u5409\u4ED6 Drop D", instrument: "guitar", strings: [
        { name: "D2", hz: 73.42 },
        { name: "A2", hz: 110 },
        { name: "D3", hz: 146.83 },
        { name: "G3", hz: 196 },
        { name: "B3", hz: 246.94 },
        { name: "E4", hz: 329.63 }
      ] },
      guitar_dadgad: { zh: "\u5409\u4ED6 DADGAD", instrument: "guitar", strings: [
        { name: "D2", hz: 73.42 },
        { name: "A2", hz: 110 },
        { name: "D3", hz: 146.83 },
        { name: "G3", hz: 196 },
        { name: "A3", hz: 220 },
        { name: "D4", hz: 293.66 }
      ] },
      bass_4: { zh: "\u8C9D\u65AF 4\u5F26 EADG", instrument: "bass", strings: [
        { name: "E1", hz: 41.2 },
        { name: "A1", hz: 55 },
        { name: "D2", hz: 73.42 },
        { name: "G2", hz: 98 }
      ] },
      ukulele_gcea: { zh: "\u70CF\u514B\u9E97\u9E97 GCEA", instrument: "ukulele", strings: [
        { name: "G4", hz: 392 },
        { name: "C4", hz: 261.63 },
        { name: "E4", hz: 329.63 },
        { name: "A4", hz: 440 }
      ] },
      violin_gdae: { zh: "\u5C0F\u63D0\u7434 GDAE", instrument: "violin", strings: [
        { name: "G3", hz: 196 },
        { name: "D4", hz: 293.66 },
        { name: "A4", hz: 440 },
        { name: "E5", hz: 659.25 }
      ] },
      chromatic: { zh: "\u534A\u97F3(\u4EFB\u610F\u6A02\u5668)", instrument: "any", strings: null }
    }
  };

  // data/frequency-guide.json
  var frequency_guide_default = {
    schemaVersion: 1,
    description: "\u6DF7\u97F3\u6559\u5B78\u7528\u983B\u7387\u6307\u5357\uFF1A\u983B\u6BB5\u5B9A\u7FA9(speech cheat-sheet) + \u5404\u6A02\u5668\u983B\u7387\u7BC4\u570D\u8207\u5E38\u898B EQ \u8655\u7406\u3002\u4F9B\u983B\u7387\u901F\u67E5\u5716\u3001EQ \u6559\u5B78\u3001\u7DF4\u8033\u5DE5\u5177\u4F7F\u7528\u3002range \u55AE\u4F4D Hz\u3002boost/cut=\u5E38\u898B\u589E\u76CA/\u8870\u6E1B\u983B\u9EDE\u3002problem=\u5BB9\u6613\u51FA\u554F\u984C\u8655\u3002tip=\u4E00\u53E5\u64CD\u4F5C\u5EFA\u8B70\u3002\u2605App \u53EA\u6559\u5B78\u8207\u793A\u610F\uFF0C\u5BE6\u969B EQ \u5728\u4F7F\u7528\u8005 DAW \u5957\u7528\u2605",
    bands: [
      { id: "sub_bass", range: [20, 60], zh: "\u6975\u4F4E\u983B Sub", lives: "\u9F13\u7684 sub\u3001808\u3001\u7A7A\u9593\u9686\u9686\u8072", watch: "\u592A\u591A\u6703\u7CCA\u3001\u5403\u6389\u5587\u53ED\u63A8\u529B\uFF1B\u975E\u4F4E\u97F3\u6A02\u5668\u5E38\u9AD8\u901A\u5207\u6389" },
      { id: "bass", range: [60, 250], zh: "\u4F4E\u983B Bass", lives: "\u8C9D\u65AF\u3001\u5927\u9F13\u8EAB\u9AD4\u3001\u6EAB\u6696\u5EA6", watch: "\u80FD\u91CF\u96C6\u4E2D\u5340\uFF0C\u904E\u591A\u6703\u60B6" },
      { id: "low_mid", range: [250, 500], zh: "\u4E2D\u4F4E\u983B", lives: "\u6A02\u5668\u7684\u539A\u5EA6\u8207\u8EAB\u9AD4", watch: "\u6E3E\u6FC1/\u7BB1\u97F3\u5E38\u5728 200\u2013400\uFF0C\u5E38\u505A\u8870\u6E1B" },
      { id: "mid", range: [500, 2e3], zh: "\u4E2D\u983B", lives: "\u4EBA\u8072\u57FA\u983B\u3001\u5409\u4ED6\u3001\u8FA8\u8B58\u5EA6", watch: "500\u2013800 \u6613\u6709\u9F3B\u97F3/\u76D2\u97F3" },
      { id: "high_mid", range: [2e3, 5e3], zh: "\u4E2D\u9AD8\u983B", lives: "\u81E8\u5834\u611F\u3001\u54AC\u5B57\u3001attack", watch: "2.5\u20135k \u904E\u591A\u6703\u523A\u8033\u3001\u807D\u4E45\u75B2\u52DE" },
      { id: "high", range: [5e3, 1e4], zh: "\u9AD8\u983B", lives: "\u6E05\u6670\u5EA6\u3001cymbal\u3001\u9F52\u97F3", watch: "5\u20138k \u4EBA\u8072\u9F52\u97F3(de-ess)" },
      { id: "air", range: [1e4, 2e4], zh: "\u7A7A\u6C23 Air", lives: "\u5149\u6FA4\u3001\u7A7A\u6C23\u611F\u3001\u958B\u95CA", watch: "\u9069\u5EA6\u63D0\u5347\u589E\u9AD8\u7D1A\u611F\uFF0C\u904E\u591A\u6703\u5636" }
    ],
    instruments: {
      kick: { zh: "\u5927\u9F13 Kick", fundamental: [50, 100], presence: [2e3, 4e3], boost: [60, 3e3], cut: [300, 400], problem: "300\u2013500Hz \u7D19\u7BB1\u611F", tip: "60Hz \u7D66\u529B\u91CF\u30012\u20134kHz \u7D66\u6572\u64CA\u9EDE\uFF0C\u6316\u6389 300\u2013400 \u7684\u7BB1\u97F3\u3002" },
      snare: { zh: "\u5C0F\u9F13 Snare", fundamental: [150, 250], presence: [4e3, 6e3], boost: [200, 5e3], cut: [400, 600], problem: "600Hz \u6728\u7BB1\u611F", tip: "200 \u7D66\u8EAB\u9AD4\u30015kHz \u7D66\u8106\u5EA6\u3002" },
      bass: { zh: "\u8C9D\u65AF Bass", fundamental: [60, 250], presence: [700, 1e3], boost: [80, 800], cut: [300, 300], problem: "\u8207\u5927\u9F13\u722D 60\u2013100", tip: "\u548C\u5927\u9F13\u5206\u5DE5\uFF1A\u4E00\u500B\u4F54 60\u3001\u4E00\u500B\u4F54 80\u2013100\uFF1B700Hz\u20131k \u7D66\u8FA8\u8B58\u5EA6\u3002" },
      eguitar: { zh: "\u96FB\u5409\u4ED6", fundamental: [80, 1200], presence: [2e3, 4e3], boost: [3e3, 3e3], cut: [300, 500], problem: "\u8207\u4EBA\u8072\u722D\u4E2D\u983B", tip: "\u9AD8\u901A\u6389 80 \u4EE5\u4E0B\u3001\u6316\u4E00\u9EDE 2\u20134k \u8B93\u4F4D\u7D66\u4EBA\u8072\u3002" },
      aguitar: { zh: "\u6728\u5409\u4ED6", fundamental: [80, 1200], presence: [5e3, 1e4], boost: [8e3, 8e3], cut: [200, 300], problem: "200\u2013300 \u4F4E\u983B\u8F5F\u9CF4", tip: "\u9AD8\u901A + \u8870\u6E1B 200\u2013300 \u53BB boom\u3001\u63D0 8k \u7D66\u4EAE\u6FA4\u3002" },
      vocal: { zh: "\u4EBA\u8072 Vocal", fundamental: [100, 300], presence: [2e3, 5e3], boost: [3e3, 12e3], cut: [200, 400], problem: "5\u20138k \u9F52\u97F3\u3001200\u2013400 \u6E3E\u6FC1", tip: "\u9AD8\u901A 80\u2013100\u3001\u8870\u6E1B 300 \u53BB\u6FC1\u3001\u63D0 3k \u81E8\u5834\u300112k \u7A7A\u6C23\uFF0C\u5FC5\u8981\u6642 de-ess\u3002" },
      piano: { zh: "\u92FC\u7434 Piano", fundamental: [30, 4e3], presence: [5e3, 1e4], boost: [1e4, 1e4], cut: [300, 400], problem: "\u983B\u5BEC\u5EE3\u3001\u6613\u8207\u4E00\u5207\u91CD\u758A", tip: "\u5728\u7DE8\u66F2\u4E2D\u6C7A\u5B9A\u5B83\u4F54\u54EA\u6BB5\uFF0C\u5176\u9918\u8870\u6E1B\u8B93\u4F4D\u3002" },
      cymbals: { zh: "\u9238 / Hi-hat", fundamental: [6e3, 16e3], presence: [1e4, 16e3], boost: [12e3, 12e3], cut: [500, 500], problem: "1k \u4EE5\u4E0B\u6CE5\u5DF4", tip: "\u9AD8\u901A\u6389 500 \u4EE5\u4E0B\uFF0C\u53EA\u7559\u4EAE\u7684\u90E8\u5206\u3002" },
      pad: { zh: "Pad / \u5408\u6210\u92EA\u5E95", fundamental: [80, 8e3], presence: [200, 500], boost: [1e4, 1e4], cut: [200, 500], problem: "\u4F54\u6EFF\u4E2D\u983B\u84CB\u4F4F\u4E3B\u89D2", tip: "\u5927\u5E45\u6316\u4E2D\u983B\u3001\u53EA\u7559\u4F4E\u983B\u92EA\u5E95\u8207\u9AD8\u983B\u7A7A\u6C23\u3002" }
    }
  };

  // data/mix-reference.json
  var mix_reference_default = {
    schemaVersion: 1,
    description: "\u6DF7\u97F3/\u6BCD\u5E36\u6559\u5B78\u53C3\u8003\u901F\u67E5\u8868\uFF1A\u97FF\u5EA6\u76EE\u6A19\u3001\u58D3\u7E2E\u8D77\u624B\u8A2D\u5B9A\u3001\u6B98\u97FF\u985E\u578B\u3001\u6DF7\u97F3\u6D41\u7A0B\u3001\u6BCD\u5E36\u6AA2\u67E5\u6E05\u55AE\u3001\u8853\u8A9E\u3002\u2605\u5168\u90E8\u662F\u300E\u8D77\u9EDE\u8207\u89C0\u5FF5\u300F\u4F9B\u5B78\u7FD2\u8207\u6284\u9032 DAW\uFF0C\u4E0D\u662F App \u5167\u8655\u7406\uFF1B\u6578\u503C\u7528\u8033\u6735\u5FAE\u8ABF\u2605",
    loudnessTargets: {
      comment: "\u6574\u5408\u97FF\u5EA6 Integrated LUFS\uFF1B\u6BCD\u5E36\u771F\u5BE6\u5CF0\u503C\u5EFA\u8B70 \u2264 -1 dBTP\u3002\u4E32\u6D41\u591A\u6703\u6B63\u898F\u5316\u5230\u7D04 -14\u3002",
      spotify: { lufs: -14, truePeak: -1 },
      youtube: { lufs: -14, truePeak: -1 },
      apple_music: { lufs: -16, truePeak: -1 },
      amazon: { lufs: -14, truePeak: -2 },
      tidal: { lufs: -14, truePeak: -1 },
      club_cd: { lufs: -8, truePeak: -0.3, note: "\u591C\u5E97/CD \u6C42\u5927\u8072\uFF0C\u4F46\u72A7\u7272\u52D5\u614B" }
    },
    compressionStarters: {
      comment: "\u8D77\u624B\u8A2D\u5B9A\uFF0C\u4F9D\u7D20\u6750\u5FAE\u8ABF\u3002ratio=\u58D3\u7E2E\u6BD4, attack/release \u6BEB\u79D2, gr=\u76EE\u6A19\u589E\u76CA\u8870\u6E1B dB\u3002",
      vocal: { ratio: "3:1", attack: "5\u201310ms", release: "40\u2013100ms", gr: "3\u20136dB", tip: "\u7A69\u5B9A\u4EBA\u8072\u52D5\u614B\uFF0Cattack \u5225\u592A\u5FEB\u4EE5\u4FDD\u7559\u54AC\u5B57\u3002" },
      bass: { ratio: "4:1", attack: "10\u201330ms", release: "100ms", gr: "4\u20136dB", tip: "\u8B93\u4F4E\u97F3\u7A69\u5B9A\u4E0D\u5FFD\u5927\u5FFD\u5C0F\u3002" },
      drum_bus: { ratio: "4:1", attack: "10\u201330ms", release: "auto", gr: "3\u20135dB", tip: "attack \u7A0D\u6162\u7559\u4F4F\u885D\u64CA\u529B(transient)\u3002" },
      aguitar: { ratio: "2\u20133:1", attack: "15\u201330ms", release: "80ms", gr: "2\u20134dB", tip: "\u8F15\u58D3\u5373\u53EF\uFF0C\u4FDD\u7559\u5F48\u594F\u52D5\u614B\u3002" },
      master_glue: { ratio: "2:1", attack: "30ms", release: "auto", gr: "1\u20132dB", tip: "\u6BCD\u5E36\u81A0\u5408\uFF0C\u6975\u8F15\u5FAE\uFF0C\u53EA\u6C42\u9ECF\u5408\u4E0D\u6C42\u5927\u8072\u3002" }
    },
    reverbTypes: [
      { id: "room", zh: "\u623F\u9593 Room", use: "\u5C0F\u7A7A\u9593\u3001\u81EA\u7136\u9ECF\u5408\uFF0C\u9F13\u5E38\u7528" },
      { id: "plate", zh: "\u9435\u677F Plate", use: "\u4EBA\u8072\u3001\u5C0F\u9F13\uFF0C\u660E\u4EAE\u5BC6\u96C6" },
      { id: "hall", zh: "\u5927\u5EF3 Hall", use: "\u6292\u60C5\u3001\u5F26\u6A02\uFF0C\u5BEC\u5EE3\u9577\u5C3E" },
      { id: "spring", zh: "\u5F48\u7C27 Spring", use: "\u5FA9\u53E4\u5409\u4ED6\u3001Dub" }
    ],
    reverbTip: "\u7528 send/\u532F\u6D41\u6392\u5171\u7528\u4E00\u9846\u6B98\u97FF\u8B93\u6A02\u5668\u8655\u5728\u540C\u4E00\u7A7A\u9593\uFF1Bpre-delay 20\u201340ms \u53EF\u4FDD\u6301\u4EBA\u8072\u6E05\u6670\u4E0D\u7CCA\u3002",
    mixWorkflow: [
      "1. \u589E\u76CA\u7D50\u69CB(gain staging)\uFF1A\u6BCF\u8ECC\u9032\u96FB\u5E73\u7559 headroom\uFF0C\u5225\u4E00\u958B\u59CB\u5C31\u9802\u3002",
      "2. \u5E73\u8861\uFF1A\u53EA\u52D5\u63A8\u5B50\u628A\u6BD4\u4F8B\u8ABF\u5C0D\uFF0C\u5148\u9ED1\u767D(mono)\u807D\u3002",
      "3. \u76F8\u4F4D(pan)\uFF1A\u628A\u6A02\u5668\u64FA\u5230\u7ACB\u9AD4\u8072\u4E0D\u540C\u4F4D\u7F6E\u9A30\u51FA\u7A7A\u9593\u3002",
      "4. EQ\uFF1A\u5148\u505A\u6E1B\u6CD5(\u6316\u6389\u554F\u984C\u983B\u6BB5)\u518D\u505A\u52A0\u6CD5\u3002",
      "5. \u58D3\u7E2E\uFF1A\u7A69\u5B9A\u52D5\u614B\uFF0C\u4E0D\u662F\u628A\u6240\u6709\u6771\u897F\u58D3\u6241\u3002",
      "6. \u6B98\u97FF/\u5EF6\u9072\uFF1A\u7528 send \u71DF\u9020\u7A7A\u9593\u8207\u6DF1\u5EA6\u3002",
      "7. \u81EA\u52D5\u5316\uFF1A\u53E5\u5B50\u9593\u3001\u6BB5\u843D\u9593\u7684\u7D30\u90E8\u97F3\u91CF\u8D77\u4F0F\u3002",
      "8. \u53C3\u8003\u66F2\u5C0D\u7167\uFF1A\u8207\u4F60\u559C\u6B61\u7684\u5546\u696D\u6B4C\u5207\u63DB A/B \u6821\u6B63\u3002"
    ],
    masteringChecklist: [
      "\u6DF7\u97F3\u524D\u7559 -6dB \u5DE6\u53F3 headroom \u7D66\u6BCD\u5E36\u3002",
      "\u5148\u7528\u53C3\u8003\u66F2\u5EFA\u7ACB\u76EE\u6A19(\u97FF\u5EA6/\u4EAE\u5EA6/\u4F4E\u983B\u91CF)\u3002",
      "\u6BCD\u5E36\u93C8\uFF1A\u6821\u6B63 EQ \u2192 \u81A0\u5408\u58D3\u7E2E(1\u20132dB) \u2192 \u9650\u5E45\u5668\u5230\u76EE\u6A19 LUFS\u3002",
      "\u771F\u5BE6\u5CF0\u503C\u63A7\u5728 -1 dBTP\uFF0C\u907F\u514D\u8F49\u6A94\u5931\u771F\u3002",
      "\u9ED1\u767D(mono)\u76F8\u5BB9\u6027\u6AA2\u67E5\uFF0C\u4F4E\u983B\u7F6E\u4E2D\u3002",
      "\u5728\u624B\u6A5F/\u8ECA\u4E0A/\u8033\u6A5F\u591A\u7CFB\u7D71\u8A66\u807D\u3002",
      "\u5225\u904E\u5EA6\u9650\u5E45\uFF1A\u5927\u8072\u2260\u597D\u807D\uFF0C\u52D5\u614B\u624D\u6709\u751F\u547D\u3002",
      "\u767C\u884C\u532F\u51FA\uFF1A\u4E32\u6D41\u76EE\u6A19\u7D04 -14 LUFS\uFF1B\u4EA4\u6BCD\u5E36\u5E2B\u5247\u9001\u672A\u58D3\u7684\u6DF7\u97F3\u3002"
    ],
    glossary: {
      LUFS: "\u97FF\u5EA6\u55AE\u4F4D(\u6574\u5408\u97FF\u5EA6)\uFF0C\u4E32\u6D41\u6B63\u898F\u5316\u7684\u4F9D\u64DA\u3002",
      dBTP: "\u771F\u5BE6\u5CF0\u503C(dB True Peak)\uFF0C\u8F49\u6A94\u5F8C\u53EF\u80FD\u8D85\u904E\u53D6\u6A23\u5CF0\u503C\uFF0C\u6545\u7559 -1 \u9918\u88D5\u3002",
      headroom: "\u8A0A\u865F\u9802\u7AEF\u5230 0dB \u7684\u9918\u88D5\u7A7A\u9593\u3002",
      gain_staging: "\u8B93\u6BCF\u4E00\u7D1A\u96FB\u5E73\u90FD\u843D\u5728\u5408\u7406\u7BC4\u570D\uFF0C\u907F\u514D\u904E\u8F09\u6216\u96DC\u8A0A\u3002",
      transient: "\u8072\u97F3\u6700\u524D\u7AEF\u7684\u77AC\u614B\u885D\u64CA(\u5982\u9F13\u7684\u6572\u64CA\u9EDE)\u3002",
      sidechain: "\u7528\u4E00\u500B\u8A0A\u865F\u63A7\u5236\u53E6\u4E00\u500B\u8655\u7406(\u5982\u9F13\u89F8\u767C\u8C9D\u65AF\u9583\u907F)\u3002"
    }
  };

  // data/voicing-ideas.json
  var voicing_ideas_default = {
    schemaVersion: 1,
    description: "\u5409\u4ED6\u5F48\u6CD5\uFF0F\u97F3\u8272\u9EDE\u5B50\u5361\u3002\u5BEB\u6B4C\u8005\u9304\u5B8C demo\u3001\u8A18\u548C\u5F26\u6642\u5361\u4F4F\u6216\u60F3\u627E\u7368\u7279\u8072\u97FF\u6642\u7FFB\u7684\u62C9\u5F0F\u53C3\u8003\u2014\u2014\u662F\u5FC3\u6CD5\u4E0D\u662F\u7DE8\u66F2\u3002demoFrets=\u516D\u5F26\u793A\u610F\u6309\u6CD5(\u4F4E\u2192\u9AD8\uFF0C-1 \u60B6\u5F26\uFF0F0 \u7A7A\u5F26\uFF0Fn \u54C1)\uFF0C\u6A19\u6E96\u8ABF\u5F26\u53EF\u6309\u3001FretAudio \u80FD\u767C\u8072\uFF1BbeforeFrets=\u524D\u5F8C\u5C0D\u7167\u7528\u7684\u300C\u6539\u4E4B\u524D\u300D\u6309\u6CD5(docs/31 J6)\uFF0C\u898F\u5247\u540C demoFrets\uFF0C\u9078\u586B\u3001\u53EA\u6709\u9700\u8981\u5C0D\u7167\u6559\u5B78\u7684\u5361\u624D\u6709\u503C\uFF1Btuning \u975E standard \u8005\u70BA\u9700\u8ABF\u5F26\u7684\u6587\u5B57\u5361\uFF0CdemoFrets \u8A2D null\u3002\u4E0D\u81EA\u52D5\u6539\u4EFB\u4F55\u6771\u897F\u3002id=kebab\u3002",
    voicingIdeas: {
      "open-drone": {
        name: "\u7A7A\u5F26 Drone",
        idea: "\u8B93\u6700\u9AD8\u7684\u4E00\u5169\u6839\u7A7A\u5F26\u4E00\u76F4\u97FF\uFF0C\u548C\u8072\u5728\u4E0B\u9762\u63DB\uFF0C\u97F3\u7246\u5C31\u6709\u4E86\u5EF6\u97F3\u7684\u7A7A\u9748\u3002",
        how: "\u5F48 A\uFF0FD \u5BB6\u65CF\u6642\uFF0CB \u5F26\u8207\u9AD8\u97F3 E \u5F26\u4FDD\u6301\u7A7A\u5F26\u4E0D\u6309\uFF0C\u53EA\u5728\u4F4E\u628A\u4F4D\u63DB\u4F4E\u97F3\u8207\u5167\u8072\u90E8\uFF08\u793A\u610F\u9019\u5F35\u662F Asus2\uFF1AA \u5F26 0\u3001D\uFF0FG \u5F26 2\u3001B\uFF0F\u9AD8\u97F3 e \u7A7A\u5F26\uFF09\u3002\u6574\u7D44\u5F80\u4E0A\u5E73\u79FB\u6642\u7A7A\u5F26\u4E0D\u52D5\uFF0C\u5C31\u5192\u51FA sus\uFF0Fadd \u7684\u8272\u5F69\u3002",
        demoFrets: [-1, 0, 2, 2, 0, 0],
        beforeFrets: [0, 2, 2, 0, 0, 0],
        context: "\u60F3\u8981\u300C\u4E00\u76F4\u5728\u97FF\u3001\u6368\u4E0D\u5F97\u505C\u300D\u7684\u92EA\u5E95\u6642\uFF1Bindie\uFF0F\u5F8C\u6416\u5206\u89E3\u6700\u611B\u3002",
        tuning: "standard"
      },
      "open-shape-shift": {
        name: "\u958B\u653E\u6307\u578B\u5E73\u79FB",
        idea: "\u628A\u4E00\u500B\u5E36\u7A7A\u5F26\u7684\u548C\u5F26\u6307\u578B\u6574\u7D44\u5F80\u9AD8\u628A\u4F4D\u6ED1\uFF0C\u7559\u5728\u539F\u5730\u7684\u7A7A\u5F26\u5C31\u8B8A\u6210\u65B0\u7684\u8272\u5F69\u97F3\u3002",
        how: "\u9019\u500B\u6309\u6CD5\uFF08A \u5F26 5\u3001D \u5F26 4\u3001B \u5F26 3\u3001G\uFF0F\u9AD8\u97F3 e \u5F26\u7A7A\uFF09detectChordFromFrets \u53CD\u67E5\u51FA\u4F86\u662F\u300CEm9/D\u300D\u2014\u2014\u552F\u4E00\u5019\u9078\uFF0C\u8B80\u4F5C Em9 \u639B\u7559\u5728 D \u97F3\u4E0A\u7684\u659C\u7DDA\u548C\u5F26\u3002\u5169\u6839\u6C92\u88AB\u79FB\u52D5\u7684\u7A7A\u5F26\uFF08G\u3001\u9AD8\u97F3 e\uFF09\u8DDF\u79FB\u4E0A\u53BB\u7684\u97F3\u4E92\u76F8\u78B0\u649E\uFF0C\u624D\u5192\u51FA\u9019\u7A2E\u8AAA\u4E0D\u51FA\u540D\u5B57\u3001\u807D\u611F\u7368\u7279\u7684\u5EF6\u4F38\u548C\u5F26\u3002\u6307\u6CD5\u5176\u5BE6\u662F\u53D6\u81EA\u958B\u653E C \u6307\u578B\uFF08X-3-2-0-1-0\uFF09\uFF1A\u6309\u8457\u7684\u4E09\u6307\uFF08A\uFF0FD\uFF0FB \u5F26\uFF09\u6574\u7D44\u5F80\u4E0A\u79FB\u5169\u683C\uFF08\u4E00\u500B\u5168\u97F3\uFF09\uFF0C\u7A7A\u5F26\u539F\u5730\u4E0D\u52D5\uFF0C\u65B0\u6309\u6CD5\u5C31\u81EA\u7136\u5192\u51FA\u4F86\u4E86\u3002",
        demoFrets: [-1, 5, 4, 0, 3, 0],
        beforeFrets: [-1, 3, 2, 0, 1, 0],
        context: "\u526F\u6B4C\u60F3\u63DB\u500B\u6C92\u807D\u904E\u7684\u548C\u5F26\u8272\u3001\u53C8\u4E0D\u60F3\u5B78\u65B0\u6307\u578B\u6642\u3002",
        tuning: "standard"
      },
      "sus4-hold": {
        name: "sus4 \u639B\u7559",
        idea: "\u628A\u4E09\u5EA6\u63DB\u6210\u56DB\u5EA6\uFF0C\u8072\u97F3\u61F8\u5728\u534A\u7A7A\u3001\u6E34\u671B\u89E3\u6C7A\u56DE\u539F\u548C\u5F26\u3002",
        how: "D \u548C\u5F26\u628A\u9AD8\u97F3 e \u5F26\u591A\u6309\u4E00\u6307\u5230 3 \u683C\uFF08\u2192 Dsus4\uFF09\uFF0C\u5237\u4E00\u4E0B\u518D\u653E\u56DE D\uFF0C\u5C31\u662F\u7D93\u5178\u7684 sus4\u2192\u5927\u4E09\u548C\u5F26\u300C\u5606\u606F\u300D\u3002\u4EFB\u4F55\u548C\u5F26\u90FD\u80FD\u8A66\uFF1A\u627E\u5230\u4E09\u5EA6\u3001\u5F80\u4E0A\u79FB\u4E00\u683C\u8B8A\u56DB\u5EA6\u3002",
        demoFrets: [-1, -1, 0, 2, 3, 3],
        beforeFrets: [-1, -1, 0, 2, 3, 2],
        context: "\u548C\u5F26\u505C\u7559\u5169\u62CD\u4EE5\u4E0A\u6642\uFF0C\u52A0\u4E00\u4E0B sus4 \u518D\u89E3\u6C7A\u5F88\u6293\u8033\u3002",
        tuning: "standard"
      },
      "sus2-open": {
        name: "sus2 \u639B\u7559",
        idea: "\u628A\u4E09\u5EA6\u63DB\u6210\u4E8C\u5EA6\uFF0C\u4E2D\u6027\u3001\u958B\u95CA\uFF0C\u4E0D\u5206\u5927\u5C0F\u8ABF\u7684\u900F\u660E\u611F\u3002",
        how: "D \u548C\u5F26\u628A\u9AD8\u97F3 e \u5F26\u653E\u6210\u7A7A\u5F26\uFF08\u2192 Dsus2\uFF09\u3002sus2 = \u628A\u4E09\u5EA6\u5F80\u4E0B\u79FB\u5169\u683C\u8B8A\u4E8C\u5EA6\u3002\u6728\u5409\u4ED6\u5206\u89E3\u6642\u7279\u5225\u4EAE\u3001\u7279\u5225\u7A7A\u3002",
        demoFrets: [-1, -1, 0, 2, 3, 0],
        beforeFrets: [-1, -1, 0, 2, 3, 2],
        context: "\u60F3\u8981\u7A7A\u6C23\u611F\u3001\u53C8\u4E0D\u60F3\u6C7A\u5B9A\u300C\u958B\u5FC3\u9084\u662F\u96E3\u904E\u300D\u6642\u3002",
        tuning: "standard"
      },
      "add9-color": {
        name: "add9 \u52A0\u4E5D",
        idea: "\u5728\u4E09\u548C\u5F26\u4E0A\u758A\u4E00\u500B\u4E5D\u5EA6\uFF0C\u751C\u3001\u4EAE\u3001\u73FE\u4EE3\u6D41\u884C\u5473\u3002",
        how: "C \u548C\u5F26\u628A B \u5F26\u5F9E\u6309 1 \u683C\u6539\u6309 3 \u683C \u2192 Cadd9\uFF08\u793A\u610F\uFF1B\u9AD8\u97F3 e \u5F26\u672C\u4F86\u5C31\u662F\u7A7A\u5F26\uFF0C\u4E0D\u7528\u52D5\uFF09\u3002\u4E5D\u5EA6\u97F3 = \u6839\u97F3\u4E0A\u65B9\u5169\u683C\u7684\u90A3\u500B\u97F3\uFF0C\u627E\u4E00\u6839\u7A7A\u8457\u7684\u9AD8\u97F3\u5F26\u52A0\u9032\u53BB\u3002",
        demoFrets: [-1, 3, 2, 0, 3, 0],
        beforeFrets: [-1, 3, 2, 0, 1, 0],
        context: "\u5927\u4E09\u548C\u5F26\u807D\u81A9\u4E86\u3001\u60F3\u8981 city pop\uFF0F\u6D41\u884C\u7684\u5149\u6FA4\u6642\u3002",
        tuning: "standard"
      },
      "power-fifth": {
        name: "\u7701\u4E09\u97F3 \xB7 \u958B\u653E\u4E94\u5EA6",
        idea: "\u53EA\u7559\u6839\u97F3\uFF0B\u4E94\u5EA6\u3001\u62FF\u6389\u4E09\u5EA6\uFF0C\u548C\u5F26\u8B8A\u5F97\u4E2D\u7A7A\u3001\u6709\u529B\u3001\u4E0D\u5206\u5927\u5C0F\u8ABF\u3002",
        how: "\u53EA\u6309\u6700\u4F4E\u5169\u4E09\u5F26\u7684\u6839\u97F3\u8207\u4E94\u5EA6\uFF08\u793A\u610F E5\uFF1A\u4F4E E \u7A7A\u5F26\u3001A\uFF0FD \u5F26 2 \u683C\uFF09\uFF0C\u9AD8\u97F3\u5F26\u4E0D\u5F48\u6216\u60B6\u6389\u3002\u7834\u97F3\u4E0B\u6700\u4E7E\u6DE8\uFF1B\u6728\u5409\u4ED6\u4E0A\u5247\u6709\u7A7A\u5FC3\u7684\u6C11\u8B20\u611F\u3002",
        demoFrets: [0, 2, 2, -1, -1, -1],
        beforeFrets: [0, 2, 2, 1, 0, 0],
        context: "\u60F3\u8981\u529B\u91CF\u6216\u7559\u767D\u3001\u6216\u65CB\u5F8B\u8981\u5728\u4E0A\u9762\u81EA\u7531\u8D70\u4E0D\u60F3\u88AB\u4E09\u5EA6\u7D81\u4F4F\u6642\u3002",
        tuning: "standard"
      },
      "partial-top3": {
        name: "\u90E8\u5206\u548C\u5F26 \xB7 \u53EA\u5F48\u4E0A\u4E09\u5F26",
        idea: "\u6574\u7D44\u548C\u5F26\u53EA\u7559\u6700\u9AD8\u4E09\u5F26\uFF0C\u8072\u97F3\u8B8A\u8F15\u3001\u8B8A\u9AD8\u3001\u4E0D\u6436\u4E3B\u5531\u3002",
        how: "\u53EA\u5F48 G\u3001B\u3001\u9AD8\u97F3 E \u4E09\u5F26\uFF08\u793A\u610F 2-3-2 \u2192 \u9AD8\u628A\u4F4D\u7684 D \u4E09\u548C\u5F26\uFF09\u3002\u5DE6\u624B\u5176\u5BE6\u58D3\u8457\u6574\u500B\u548C\u5F26\uFF0C\u53F3\u624B\u53EA\u6383\u4E0A\u534A\uFF1B\u6216\u4E7E\u8106\u53EA\u6309\u4E0A\u4E09\u5F26\u3002",
        demoFrets: [-1, -1, -1, 2, 3, 2],
        beforeFrets: [-1, -1, 0, 2, 3, 2],
        context: "\u4E3B\u6B4C\u60F3\u8B93\u4F34\u594F\u9000\u5230\u5F8C\u9762\u3001\u6216\u96D9\u5409\u4ED6\u5176\u4E2D\u4E00\u628A\u5F48\u9AD8\u97F3\u5C64\u6642\u3002",
        tuning: "standard"
      },
      "capo-color": {
        name: "Capo \u63DB\u8272",
        idea: "\u593E capo\uFF0C\u624B\u9084\u662F\u5F48\u719F\u6089\u7684\u958B\u653E\u6307\u578B\uFF0C\u4F46\u97F3\u9AD8\u8207\u7A7A\u5F26\u7684\u4EAE\u5EA6\u6574\u500B\u63DB\u4E86\u4E00\u500B\u4E16\u754C\u3002",
        how: "\u593E 3 \u683C\u3001\u7167\u6A23\u5F48 G \u6307\u578B\uFF08\u793A\u610F open G\uFF09\uFF0C\u5BE6\u969B\u767C\u8072\u8B8A\u6210 B\u266D\uFF0C\u4F46\u7A7A\u5F26\u7684\u97FF\u5EA6\u8207\u660E\u4EAE\u611F\u662F\u539F\u8ABF\u6309\u4E0D\u51FA\u4F86\u7684\u3002\u4E5F\u53EF\u5169\u628A\u5409\u4ED6\u593E\u4E0D\u540C\u683C\u758A\u8272\u3002",
        demoFrets: [3, 2, 0, 0, 0, 3],
        beforeFrets: [3, 2, 0, 0, 0, 3],
        context: "\u4E3B\u5531\u97F3\u57DF\u4E0D\u5408\u3001\u6216\u60F3\u8981\u66F4\u4EAE\u66F4\u5C0F\u5DE7\u7684\u6728\u5409\u4ED6\u97F3\u8272\u6642\u3002",
        tuning: "standard",
        previewCapo: 3
      },
      "slash-bass": {
        name: "Slash\uFF0F\u4F4E\u97F3\u884C\u9032",
        idea: "\u5728\u5169\u500B\u548C\u5F26\u4E4B\u9593\u63D2\u4E00\u500B\u548C\u5F26\u3001\u501F\u5B83\u7684\u4F4E\u97F3\u7576\u904E\u6E21\uFF0C\u4F4E\u97F3\u7DDA\u5C31\u50CF\u6703\u5531\u6B4C\u4E00\u6A23\u6ED1\u4E0B\u53BB\u3002",
        how: "C \u8207 G \u4E4B\u9593\u63D2\u5165 D\uFF0FF#\uFF08\u793A\u610F\uFF1A\u4F4E E \u5F26 2 \u683C\uFF1DF#\uFF0C\u5176\u9918\u540C D \u6307\u578B\uFF09\uFF0C\u4F4E\u97F3\u7DDA\u8B8A\u6210 C\u2192F#\u2192G\uFF0CF# \u5230 G \u53EA\u5DEE\u534A\u97F3\uFF0C\u6BD4\u76F4\u63A5\u8DF3 C\u2192G \u66F4\u6ED1\u9806\u3002\u5F15\u64CE\u53CD\u67E5\u6703\u5148\u5217\u51FA\u300CGbm#5\u300D\u2014\u2014\u90A3\u662F\u628A F# \u7576\u6839\u97F3\u7B97\u51FA\u7684\u7406\u8AD6\u7570\u540D\uFF0C\u771F\u6B63\u91CD\u9EDE\u662F\u6392\u7B2C\u4E8C\u7684\u300CD/F#\u300D\uFF08DM/Gb\uFF09\uFF1A\u5F48\u8D77\u4F86\u3001\u807D\u8D77\u4F86\u5C31\u662F D \u639B\u7559\u5728 F# \u4F4E\u97F3\u4E0A\uFF0C\u4E0D\u662F\u8B8A\u6210\u5225\u7684\u548C\u5F26\u3002\u9019\u8DDF\u300C\u8F49\u4F4D\u30FB\u540C\u548C\u5F26\u63DB\u4F4E\u97F3\u300D\u4E0D\u540C\uFF1A\u8F49\u4F4D\u662F\u540C\u4E00\u500B\u548C\u5F26\u63DB\u588A\u5E95\u97F3\uFF0C\u9019\u5F35\u662F\u4E0D\u540C\u548C\u5F26\uFF08C\u3001D/F#\u3001G\uFF09\u4E4B\u9593\u7528\u4F4E\u97F3\u7DDA\u4E32\u8D77\u4F86\u3002\u53CD\u904E\u4F86\u300C\u6301\u7E8C\u4F4E\u97F3\uFF08pedal\uFF09\u300D\uFF1A\u4F4E\u97F3\u4E0D\u52D5\u3001\u4E0A\u9762\u548C\u5F26\u4E00\u76F4\u63DB\uFF0C\u4E5F\u5F88\u50AC\u7720\u3002",
        demoFrets: [2, -1, 0, 2, 3, 2],
        beforeFrets: [-1, 3, 2, 0, 1, 0],
        context: "\u5169\u500B\u548C\u5F26\u4E4B\u9593\u89BA\u5F97\u4F4E\u97F3\u8DF3\u592A\u9060\u3001\u60F3\u8981\u5E73\u9806\u4E0B\u884C\u6216\u4E0A\u884C\u6642\u3002",
        tuning: "standard"
      },
      "double-stops": {
        name: "\u96D9\u97F3 3rd\uFF0F6th \u884C\u9032",
        idea: "\u53EA\u7528\u5169\u6839\u5F26\u7684\u97F3\u7A0B\u5E73\u884C\u79FB\u52D5\uFF0C\u6BD4\u55AE\u97F3\u539A\u3001\u6BD4\u548C\u5F26\u8F15\uFF0Csoul\uFF0F\u9109\u6751\u6700\u611B\u3002",
        how: "\u6311\u5169\u97F3\u4E00\u8D77\u79FB\u52D5\u2014\u2014\u4E09\u5EA6\uFF08\u76F8\u9130\u5F26\uFF09\u6216\u516D\u5EA6\uFF08\u9694\u4E00\u5F26\uFF0C\u793A\u610F D \u5F26\u7A7A\uFF0BB \u5F26\u7A7A\uFF1D\u4E00\u500B\u516D\u5EA6\uFF09\u3002\u9806\u8457\u8ABF\u5167\u97F3\u5E73\u884C\u6ED1\uFF0C\u5C31\u662F\u4E00\u689D\u6703\u52D5\u7684\u5167\u8072\u90E8\u3002",
        demoFrets: [-1, -1, 0, -1, 0, -1],
        beforeFrets: [-1, -1, 2, -1, 2, -1],
        context: "\u904E\u9580\u3001\u9593\u594F\u3001\u6216\u60F3\u5728\u4E3B\u5531\u7A7A\u62CD\u585E\u4E00\u53E5\u5C0F\u6A02\u53E5\u6642\u3002",
        tuning: "standard"
      },
      "muted-groove": {
        name: "\u60B6\u97F3\u6253\u677F",
        idea: "\u5DE6\u624B\u8F15\u642D\u3001\u53F3\u624B\u60B6\u8457\u5237\uFF0C\u97F3\u9AD8\u9000\u4F4D\u3001\u7BC0\u594F\u7AD9\u51FA\u4F86\uFF0C\u548C\u5F26\u8B8A\u6210\u6253\u64CA\u6A02\u3002",
        how: "\u6309\u4F4F\u4EFB\u4E00\u548C\u5F26\uFF08\u793A\u610F Em\uFF09\uFF0C\u53F3\u624B\u638C\u5074\u8F15\u9760\u7434\u6A4B\u60B6\u97F3\u5237\uFF08palm mute\uFF09\uFF0C\u6216\u5DE6\u624B\u9B06\u4E00\u9EDE\u53EA\u51FA\u300C\u560E\u560E\u300D\u7684\u60B6\u97F3\uFF0B\u5076\u723E\u653E\u958B\u9732\u51FA\u771F\u548C\u5F26\u3002funk\uFF0F\u6D41\u884C\u526F\u6B4C\u524D\u7684\u92EA\u9673\u3002",
        demoFrets: [0, 2, 2, 0, 0, 0],
        beforeFrets: [0, 2, 2, 0, 0, 0],
        context: "\u7DE8\u66F2\u592A\u6EFF\u60F3\u7559\u7BC0\u594F\u9AA8\u67B6\u3001\u6216\u60F3\u8981\u4E00\u6BB5\u300C\u53EA\u6709\u5F8B\u52D5\u6C92\u6709\u548C\u8072\u300D\u7684\u63A8\u9032\u6642\u3002",
        tuning: "standard"
      },
      harmonics: {
        name: "\u6CDB\u97F3\u9EDE\u7DB4",
        idea: "\u5728\u7B2C 12\uFF08\u6216 7\u30015\uFF09\u683C\u8F15\u89F8\u4E0D\u6309\u4E0B\uFF0C\u9418\u4E00\u822C\u7684\u6CDB\u97F3\uFF0C\u50CF\u6492\u5728\u548C\u5F26\u4E0A\u7684\u5149\u9EDE\u3002",
        how: "\u5DE6\u624B\u6307\u8179\u8F15\u8CBC\u5F26\u6B63\u4E0A\u65B9\u7B2C 12 \u683C\uFF08\u793A\u610F\u4F4E\u4E09\u5F26\uFF09\uFF0C\u64A5\u5B8C\u7ACB\u523B\u96E2\u958B\uFF0C\u6703\u97FF\u51FA\u6BD4\u7A7A\u5F26\u9AD8\u516B\u5EA6\u7684\u6E05\u4EAE\u6CDB\u97F3\u3002\u7528\u5728\u53E5\u5C3E\u6216\u7A7A\u62CD\u7576\u88DD\u98FE\uFF0C\u4E0D\u662F\u4E3B\u5E79\u3002",
        demoFrets: [12, 12, 12, -1, -1, -1],
        context: "\u524D\u594F\u958B\u5834\u3001\u6216\u4E00\u6BB5\u5B89\u975C\u6BB5\u843D\u60F3\u653E\u4E00\u9846\u300C\u53EE\u300D\u7684\u4EAE\u9EDE\u6642\u3002",
        tuning: "standard"
      },
      "dadgad-open": {
        name: "DADGAD \u958B\u653E\u8ABF\u5F26",
        idea: "\u628A\u516D\u5F26\u8ABF\u6210 D-A-D-G-A-D\uFF0C\u7A7A\u5237\u5C31\u662F\u4E00\u7247 Dsus4 \u7684\u8FF7\u9727\uFF0C\u51F1\u723E\u7279\uFF0F\u96FB\u5F71\u611F\u3002",
        how: "\u9700\u8ABF\u5F26\uFF1A\u7B2C 6\uFF0F2\uFF0F1 \u5F26\u5404\u964D\u5168\u97F3\u5230 D\uFF0FA\uFF0FD\u3002\u8ABF\u597D\u5F8C\u516D\u5F26\u5168\u653E\u7A7A\uFF1DDsus4 \u55E1\u9CF4\uFF1B\u98DF\u6307\u6A6B\u58D3\u4E0D\u540C\u628A\u4F4D\u5C31\u6ED1\u51FA\u4E00\u6574\u6392\u5E36\u7A7A\u5F26\u7684\u639B\u7559\u548C\u5F26\u3002\u6B64\u5361\u70BA\u6587\u5B57\u793A\u610F\uFF0C\u6A19\u6E96\u8ABF\u5F26\u6309\u4E0D\u51FA\u9019\u500B\u8072\u97FF\u3002",
        demoFrets: null,
        context: "\u60F3\u8981\u4E00\u6574\u9996\u90FD\u5728\u300C\u9727\u88E1\u300D\u7684\u92EA\u5E95\u3001\u6216\u5BEB\u51F1\u723E\u7279\uFF0F\u53F2\u8A69\u611F\u6642\u3002",
        tuning: "dadgad"
      },
      "inversion-bass": {
        name: "\u8F49\u4F4D\u30FB\u540C\u548C\u5F26\u63DB\u4F4E\u97F3",
        idea: "\u540C\u4E00\u500B\u548C\u5F26\u53EA\u63DB\u6700\u4F4E\u97F3\uFF0C\u7D44\u6210\u97F3\u5B8C\u5168\u4E0D\u8B8A\uFF0C\u807D\u8D77\u4F86\u537B\u50CF\u63DB\u4E86\u500B\u7AD9\u59FF\u3002",
        how: "\u5148\u5F48\u958B\u653E C\uFF08X-3-2-0-1-0\uFF09\uFF0C\u6839\u97F3 C \u5728\u6700\u4F4E\u97F3\uFF0C\u5F88\u7A69\u3001\u5F88\u300C\u5230\u5E95\u300D\u3002\u9019\u500B\u6309\u6CD5\uFF083-X-2-0-1-0\uFF1A\u4F4E\u97F3 E \u5F26 3\u3001A \u5F26\u60B6\u3001D \u5F26 2\u3001G \u5F26\u7A7A\u3001B \u5F26 1\u3001\u9AD8\u97F3 e \u7A7A\uFF09\u7D44\u6210\u97F3\u8DDF\u958B\u653E C \u4E00\u6A21\u4E00\u6A23\uFF0C\u4E00\u6A23\u662F C\u3001E\u3001G \u4E09\u500B\u97F3\u3002detectChordFromFrets \u53CD\u67E5\u6B63\u662F\u300CC/G\u300D\u2014\u2014\u53EA\u662F\u6700\u4F4E\u97F3\u5F9E\u6839\u97F3 C \u63DB\u6210\u4E86\u4E94\u5EA6\u97F3 G\u3002\u9019\u5C31\u662F\u300C\u8F49\u4F4D\u300D\uFF1A\u548C\u5F26\u6C92\u63DB\uFF0C\u53EA\u662F\u63DB\u4E86\u9846\u97F3\u588A\u5E95\uFF0C\u807D\u611F\u5F9E\u300C\u7A69\u7A69\u843D\u5730\u300D\u8B8A\u6210\u300C\u9084\u61F8\u5728\u534A\u7A7A\u300D\u3002\u8DDF\u300CSlash\uFF0F\u4F4E\u97F3\u884C\u9032\u300D\u4E0D\u540C\uFF1A\u90A3\u5F35\u662F\u4E0D\u540C\u548C\u5F26\u4E4B\u9593\u8D70\u4E00\u689D\u4F4E\u97F3\u7DDA\uFF0C\u9019\u5F35\u662F\u540C\u4E00\u500B\u548C\u5F26\u3001\u63DB\u4E0D\u540C\u7684\u97F3\u588A\u5E95\u3002",
        demoFrets: [3, -1, 2, 0, 1, 0],
        beforeFrets: [-1, 3, 2, 0, 1, 0],
        context: "\u548C\u5F26\u8981\u63A5\u4E0B\u4E00\u500B\u548C\u5F26\u3001\u60F3\u8B93\u4F4E\u97F3\u7DDA\u6ED1\u9806\u3001\u6216\u4E0D\u60F3\u540C\u4E00\u500B\u548C\u5F26\u6BCF\u6B21\u807D\u8D77\u4F86\u90FD\u300C\u5230\u5E95\u300D\u6642\u3002",
        tuning: "standard"
      }
    }
  };

  // node_modules/zod/v3/external.js
  var external_exports = {};
  __export(external_exports, {
    BRAND: () => BRAND,
    DIRTY: () => DIRTY,
    EMPTY_PATH: () => EMPTY_PATH,
    INVALID: () => INVALID,
    NEVER: () => NEVER,
    OK: () => OK,
    ParseStatus: () => ParseStatus,
    Schema: () => ZodType,
    ZodAny: () => ZodAny,
    ZodArray: () => ZodArray,
    ZodBigInt: () => ZodBigInt,
    ZodBoolean: () => ZodBoolean,
    ZodBranded: () => ZodBranded,
    ZodCatch: () => ZodCatch,
    ZodDate: () => ZodDate,
    ZodDefault: () => ZodDefault,
    ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
    ZodEffects: () => ZodEffects,
    ZodEnum: () => ZodEnum,
    ZodError: () => ZodError,
    ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
    ZodFunction: () => ZodFunction,
    ZodIntersection: () => ZodIntersection,
    ZodIssueCode: () => ZodIssueCode,
    ZodLazy: () => ZodLazy,
    ZodLiteral: () => ZodLiteral,
    ZodMap: () => ZodMap,
    ZodNaN: () => ZodNaN,
    ZodNativeEnum: () => ZodNativeEnum,
    ZodNever: () => ZodNever,
    ZodNull: () => ZodNull,
    ZodNullable: () => ZodNullable,
    ZodNumber: () => ZodNumber,
    ZodObject: () => ZodObject,
    ZodOptional: () => ZodOptional,
    ZodParsedType: () => ZodParsedType,
    ZodPipeline: () => ZodPipeline,
    ZodPromise: () => ZodPromise,
    ZodReadonly: () => ZodReadonly,
    ZodRecord: () => ZodRecord,
    ZodSchema: () => ZodType,
    ZodSet: () => ZodSet,
    ZodString: () => ZodString,
    ZodSymbol: () => ZodSymbol,
    ZodTransformer: () => ZodEffects,
    ZodTuple: () => ZodTuple,
    ZodType: () => ZodType,
    ZodUndefined: () => ZodUndefined,
    ZodUnion: () => ZodUnion,
    ZodUnknown: () => ZodUnknown,
    ZodVoid: () => ZodVoid,
    addIssueToContext: () => addIssueToContext,
    any: () => anyType,
    array: () => arrayType,
    bigint: () => bigIntType,
    boolean: () => booleanType,
    coerce: () => coerce,
    custom: () => custom,
    date: () => dateType,
    datetimeRegex: () => datetimeRegex,
    defaultErrorMap: () => en_default,
    discriminatedUnion: () => discriminatedUnionType,
    effect: () => effectsType,
    enum: () => enumType,
    function: () => functionType,
    getErrorMap: () => getErrorMap,
    getParsedType: () => getParsedType,
    instanceof: () => instanceOfType,
    intersection: () => intersectionType,
    isAborted: () => isAborted,
    isAsync: () => isAsync,
    isDirty: () => isDirty,
    isValid: () => isValid,
    late: () => late,
    lazy: () => lazyType,
    literal: () => literalType,
    makeIssue: () => makeIssue,
    map: () => mapType,
    nan: () => nanType,
    nativeEnum: () => nativeEnumType,
    never: () => neverType,
    null: () => nullType,
    nullable: () => nullableType,
    number: () => numberType,
    object: () => objectType,
    objectUtil: () => objectUtil,
    oboolean: () => oboolean,
    onumber: () => onumber,
    optional: () => optionalType,
    ostring: () => ostring,
    pipeline: () => pipelineType,
    preprocess: () => preprocessType,
    promise: () => promiseType,
    quotelessJson: () => quotelessJson,
    record: () => recordType,
    set: () => setType,
    setErrorMap: () => setErrorMap,
    strictObject: () => strictObjectType,
    string: () => stringType,
    symbol: () => symbolType,
    transformer: () => effectsType,
    tuple: () => tupleType,
    undefined: () => undefinedType,
    union: () => unionType,
    unknown: () => unknownType,
    util: () => util,
    void: () => voidType
  });

  // node_modules/zod/v3/helpers/util.js
  var util;
  (function(util2) {
    util2.assertEqual = (_) => {
    };
    function assertIs(_arg) {
    }
    util2.assertIs = assertIs;
    function assertNever(_x) {
      throw new Error();
    }
    util2.assertNever = assertNever;
    util2.arrayToEnum = (items) => {
      const obj = {};
      for (const item of items) {
        obj[item] = item;
      }
      return obj;
    };
    util2.getValidEnumValues = (obj) => {
      const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
      const filtered = {};
      for (const k of validKeys) {
        filtered[k] = obj[k];
      }
      return util2.objectValues(filtered);
    };
    util2.objectValues = (obj) => {
      return util2.objectKeys(obj).map(function(e) {
        return obj[e];
      });
    };
    util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
      const keys = [];
      for (const key in object) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
          keys.push(key);
        }
      }
      return keys;
    };
    util2.find = (arr, checker) => {
      for (const item of arr) {
        if (checker(item))
          return item;
      }
      return void 0;
    };
    util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
    function joinValues(array, separator = " | ") {
      return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
    }
    util2.joinValues = joinValues;
    util2.jsonStringifyReplacer = (_, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      }
      return value;
    };
  })(util || (util = {}));
  var objectUtil;
  (function(objectUtil2) {
    objectUtil2.mergeShapes = (first, second) => {
      return {
        ...first,
        ...second
        // second overwrites first
      };
    };
  })(objectUtil || (objectUtil = {}));
  var ZodParsedType = util.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set"
  ]);
  var getParsedType = (data) => {
    const t = typeof data;
    switch (t) {
      case "undefined":
        return ZodParsedType.undefined;
      case "string":
        return ZodParsedType.string;
      case "number":
        return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
      case "boolean":
        return ZodParsedType.boolean;
      case "function":
        return ZodParsedType.function;
      case "bigint":
        return ZodParsedType.bigint;
      case "symbol":
        return ZodParsedType.symbol;
      case "object":
        if (Array.isArray(data)) {
          return ZodParsedType.array;
        }
        if (data === null) {
          return ZodParsedType.null;
        }
        if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
          return ZodParsedType.promise;
        }
        if (typeof Map !== "undefined" && data instanceof Map) {
          return ZodParsedType.map;
        }
        if (typeof Set !== "undefined" && data instanceof Set) {
          return ZodParsedType.set;
        }
        if (typeof Date !== "undefined" && data instanceof Date) {
          return ZodParsedType.date;
        }
        return ZodParsedType.object;
      default:
        return ZodParsedType.unknown;
    }
  };

  // node_modules/zod/v3/ZodError.js
  var ZodIssueCode = util.arrayToEnum([
    "invalid_type",
    "invalid_literal",
    "custom",
    "invalid_union",
    "invalid_union_discriminator",
    "invalid_enum_value",
    "unrecognized_keys",
    "invalid_arguments",
    "invalid_return_type",
    "invalid_date",
    "invalid_string",
    "too_small",
    "too_big",
    "invalid_intersection_types",
    "not_multiple_of",
    "not_finite"
  ]);
  var quotelessJson = (obj) => {
    const json = JSON.stringify(obj, null, 2);
    return json.replace(/"([^"]+)":/g, "$1:");
  };
  var ZodError = class _ZodError extends Error {
    get errors() {
      return this.issues;
    }
    constructor(issues) {
      super();
      this.issues = [];
      this.addIssue = (sub) => {
        this.issues = [...this.issues, sub];
      };
      this.addIssues = (subs = []) => {
        this.issues = [...this.issues, ...subs];
      };
      const actualProto = new.target.prototype;
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(this, actualProto);
      } else {
        this.__proto__ = actualProto;
      }
      this.name = "ZodError";
      this.issues = issues;
    }
    format(_mapper) {
      const mapper = _mapper || function(issue) {
        return issue.message;
      };
      const fieldErrors = { _errors: [] };
      const processError = (error) => {
        for (const issue of error.issues) {
          if (issue.code === "invalid_union") {
            issue.unionErrors.map(processError);
          } else if (issue.code === "invalid_return_type") {
            processError(issue.returnTypeError);
          } else if (issue.code === "invalid_arguments") {
            processError(issue.argumentsError);
          } else if (issue.path.length === 0) {
            fieldErrors._errors.push(mapper(issue));
          } else {
            let curr = fieldErrors;
            let i = 0;
            while (i < issue.path.length) {
              const el = issue.path[i];
              const terminal = i === issue.path.length - 1;
              if (!terminal) {
                curr[el] = curr[el] || { _errors: [] };
              } else {
                curr[el] = curr[el] || { _errors: [] };
                curr[el]._errors.push(mapper(issue));
              }
              curr = curr[el];
              i++;
            }
          }
        }
      };
      processError(this);
      return fieldErrors;
    }
    static assert(value) {
      if (!(value instanceof _ZodError)) {
        throw new Error(`Not a ZodError: ${value}`);
      }
    }
    toString() {
      return this.message;
    }
    get message() {
      return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
      return this.issues.length === 0;
    }
    flatten(mapper = (issue) => issue.message) {
      const fieldErrors = {};
      const formErrors = [];
      for (const sub of this.issues) {
        if (sub.path.length > 0) {
          const firstEl = sub.path[0];
          fieldErrors[firstEl] = fieldErrors[firstEl] || [];
          fieldErrors[firstEl].push(mapper(sub));
        } else {
          formErrors.push(mapper(sub));
        }
      }
      return { formErrors, fieldErrors };
    }
    get formErrors() {
      return this.flatten();
    }
  };
  ZodError.create = (issues) => {
    const error = new ZodError(issues);
    return error;
  };

  // node_modules/zod/v3/locales/en.js
  var errorMap = (issue, _ctx) => {
    let message;
    switch (issue.code) {
      case ZodIssueCode.invalid_type:
        if (issue.received === ZodParsedType.undefined) {
          message = "Required";
        } else {
          message = `Expected ${issue.expected}, received ${issue.received}`;
        }
        break;
      case ZodIssueCode.invalid_literal:
        message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
        break;
      case ZodIssueCode.unrecognized_keys:
        message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
        break;
      case ZodIssueCode.invalid_union:
        message = `Invalid input`;
        break;
      case ZodIssueCode.invalid_union_discriminator:
        message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
        break;
      case ZodIssueCode.invalid_enum_value:
        message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
        break;
      case ZodIssueCode.invalid_arguments:
        message = `Invalid function arguments`;
        break;
      case ZodIssueCode.invalid_return_type:
        message = `Invalid function return type`;
        break;
      case ZodIssueCode.invalid_date:
        message = `Invalid date`;
        break;
      case ZodIssueCode.invalid_string:
        if (typeof issue.validation === "object") {
          if ("includes" in issue.validation) {
            message = `Invalid input: must include "${issue.validation.includes}"`;
            if (typeof issue.validation.position === "number") {
              message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
            }
          } else if ("startsWith" in issue.validation) {
            message = `Invalid input: must start with "${issue.validation.startsWith}"`;
          } else if ("endsWith" in issue.validation) {
            message = `Invalid input: must end with "${issue.validation.endsWith}"`;
          } else {
            util.assertNever(issue.validation);
          }
        } else if (issue.validation !== "regex") {
          message = `Invalid ${issue.validation}`;
        } else {
          message = "Invalid";
        }
        break;
      case ZodIssueCode.too_small:
        if (issue.type === "array")
          message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
        else if (issue.type === "string")
          message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
        else if (issue.type === "number")
          message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
        else if (issue.type === "bigint")
          message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
        else if (issue.type === "date")
          message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
        else
          message = "Invalid input";
        break;
      case ZodIssueCode.too_big:
        if (issue.type === "array")
          message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
        else if (issue.type === "string")
          message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
        else if (issue.type === "number")
          message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
        else if (issue.type === "bigint")
          message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
        else if (issue.type === "date")
          message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
        else
          message = "Invalid input";
        break;
      case ZodIssueCode.custom:
        message = `Invalid input`;
        break;
      case ZodIssueCode.invalid_intersection_types:
        message = `Intersection results could not be merged`;
        break;
      case ZodIssueCode.not_multiple_of:
        message = `Number must be a multiple of ${issue.multipleOf}`;
        break;
      case ZodIssueCode.not_finite:
        message = "Number must be finite";
        break;
      default:
        message = _ctx.defaultError;
        util.assertNever(issue);
    }
    return { message };
  };
  var en_default = errorMap;

  // node_modules/zod/v3/errors.js
  var overrideErrorMap = en_default;
  function setErrorMap(map) {
    overrideErrorMap = map;
  }
  function getErrorMap() {
    return overrideErrorMap;
  }

  // node_modules/zod/v3/helpers/parseUtil.js
  var makeIssue = (params) => {
    const { data, path, errorMaps, issueData } = params;
    const fullPath = [...path, ...issueData.path || []];
    const fullIssue = {
      ...issueData,
      path: fullPath
    };
    if (issueData.message !== void 0) {
      return {
        ...issueData,
        path: fullPath,
        message: issueData.message
      };
    }
    let errorMessage = "";
    const maps = errorMaps.filter((m) => !!m).slice().reverse();
    for (const map of maps) {
      errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
    }
    return {
      ...issueData,
      path: fullPath,
      message: errorMessage
    };
  };
  var EMPTY_PATH = [];
  function addIssueToContext(ctx, issueData) {
    const overrideMap = getErrorMap();
    const issue = makeIssue({
      issueData,
      data: ctx.data,
      path: ctx.path,
      errorMaps: [
        ctx.common.contextualErrorMap,
        // contextual error map is first priority
        ctx.schemaErrorMap,
        // then schema-bound map if available
        overrideMap,
        // then global override map
        overrideMap === en_default ? void 0 : en_default
        // then global default map
      ].filter((x) => !!x)
    });
    ctx.common.issues.push(issue);
  }
  var ParseStatus = class _ParseStatus {
    constructor() {
      this.value = "valid";
    }
    dirty() {
      if (this.value === "valid")
        this.value = "dirty";
    }
    abort() {
      if (this.value !== "aborted")
        this.value = "aborted";
    }
    static mergeArray(status, results) {
      const arrayValue = [];
      for (const s of results) {
        if (s.status === "aborted")
          return INVALID;
        if (s.status === "dirty")
          status.dirty();
        arrayValue.push(s.value);
      }
      return { status: status.value, value: arrayValue };
    }
    static async mergeObjectAsync(status, pairs) {
      const syncPairs = [];
      for (const pair of pairs) {
        const key = await pair.key;
        const value = await pair.value;
        syncPairs.push({
          key,
          value
        });
      }
      return _ParseStatus.mergeObjectSync(status, syncPairs);
    }
    static mergeObjectSync(status, pairs) {
      const finalObject = {};
      for (const pair of pairs) {
        const { key, value } = pair;
        if (key.status === "aborted")
          return INVALID;
        if (value.status === "aborted")
          return INVALID;
        if (key.status === "dirty")
          status.dirty();
        if (value.status === "dirty")
          status.dirty();
        if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
          finalObject[key.value] = value.value;
        }
      }
      return { status: status.value, value: finalObject };
    }
  };
  var INVALID = Object.freeze({
    status: "aborted"
  });
  var DIRTY = (value) => ({ status: "dirty", value });
  var OK = (value) => ({ status: "valid", value });
  var isAborted = (x) => x.status === "aborted";
  var isDirty = (x) => x.status === "dirty";
  var isValid = (x) => x.status === "valid";
  var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

  // node_modules/zod/v3/helpers/errorUtil.js
  var errorUtil;
  (function(errorUtil2) {
    errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
    errorUtil2.toString = (message) => typeof message === "string" ? message : message == null ? void 0 : message.message;
  })(errorUtil || (errorUtil = {}));

  // node_modules/zod/v3/types.js
  var ParseInputLazyPath = class {
    constructor(parent, value, path, key) {
      this._cachedPath = [];
      this.parent = parent;
      this.data = value;
      this._path = path;
      this._key = key;
    }
    get path() {
      if (!this._cachedPath.length) {
        if (Array.isArray(this._key)) {
          this._cachedPath.push(...this._path, ...this._key);
        } else {
          this._cachedPath.push(...this._path, this._key);
        }
      }
      return this._cachedPath;
    }
  };
  var handleResult = (ctx, result) => {
    if (isValid(result)) {
      return { success: true, data: result.value };
    } else {
      if (!ctx.common.issues.length) {
        throw new Error("Validation failed but no issues detected.");
      }
      return {
        success: false,
        get error() {
          if (this._error)
            return this._error;
          const error = new ZodError(ctx.common.issues);
          this._error = error;
          return this._error;
        }
      };
    }
  };
  function processCreateParams(params) {
    if (!params)
      return {};
    const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
    if (errorMap2 && (invalid_type_error || required_error)) {
      throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    }
    if (errorMap2)
      return { errorMap: errorMap2, description };
    const customMap = (iss, ctx) => {
      var _a, _b;
      const { message } = params;
      if (iss.code === "invalid_enum_value") {
        return { message: message != null ? message : ctx.defaultError };
      }
      if (typeof ctx.data === "undefined") {
        return { message: (_a = message != null ? message : required_error) != null ? _a : ctx.defaultError };
      }
      if (iss.code !== "invalid_type")
        return { message: ctx.defaultError };
      return { message: (_b = message != null ? message : invalid_type_error) != null ? _b : ctx.defaultError };
    };
    return { errorMap: customMap, description };
  }
  var ZodType = class {
    get description() {
      return this._def.description;
    }
    _getType(input) {
      return getParsedType(input.data);
    }
    _getOrReturnCtx(input, ctx) {
      return ctx || {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      };
    }
    _processInputParams(input) {
      return {
        status: new ParseStatus(),
        ctx: {
          common: input.parent.common,
          data: input.data,
          parsedType: getParsedType(input.data),
          schemaErrorMap: this._def.errorMap,
          path: input.path,
          parent: input.parent
        }
      };
    }
    _parseSync(input) {
      const result = this._parse(input);
      if (isAsync(result)) {
        throw new Error("Synchronous parse encountered promise.");
      }
      return result;
    }
    _parseAsync(input) {
      const result = this._parse(input);
      return Promise.resolve(result);
    }
    parse(data, params) {
      const result = this.safeParse(data, params);
      if (result.success)
        return result.data;
      throw result.error;
    }
    safeParse(data, params) {
      var _a;
      const ctx = {
        common: {
          issues: [],
          async: (_a = params == null ? void 0 : params.async) != null ? _a : false,
          contextualErrorMap: params == null ? void 0 : params.errorMap
        },
        path: (params == null ? void 0 : params.path) || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data,
        parsedType: getParsedType(data)
      };
      const result = this._parseSync({ data, path: ctx.path, parent: ctx });
      return handleResult(ctx, result);
    }
    "~validate"(data) {
      var _a, _b;
      const ctx = {
        common: {
          issues: [],
          async: !!this["~standard"].async
        },
        path: [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data,
        parsedType: getParsedType(data)
      };
      if (!this["~standard"].async) {
        try {
          const result = this._parseSync({ data, path: [], parent: ctx });
          return isValid(result) ? {
            value: result.value
          } : {
            issues: ctx.common.issues
          };
        } catch (err) {
          if ((_b = (_a = err == null ? void 0 : err.message) == null ? void 0 : _a.toLowerCase()) == null ? void 0 : _b.includes("encountered")) {
            this["~standard"].async = true;
          }
          ctx.common = {
            issues: [],
            async: true
          };
        }
      }
      return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
        value: result.value
      } : {
        issues: ctx.common.issues
      });
    }
    async parseAsync(data, params) {
      const result = await this.safeParseAsync(data, params);
      if (result.success)
        return result.data;
      throw result.error;
    }
    async safeParseAsync(data, params) {
      const ctx = {
        common: {
          issues: [],
          contextualErrorMap: params == null ? void 0 : params.errorMap,
          async: true
        },
        path: (params == null ? void 0 : params.path) || [],
        schemaErrorMap: this._def.errorMap,
        parent: null,
        data,
        parsedType: getParsedType(data)
      };
      const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
      const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
      return handleResult(ctx, result);
    }
    refine(check, message) {
      const getIssueProperties = (val) => {
        if (typeof message === "string" || typeof message === "undefined") {
          return { message };
        } else if (typeof message === "function") {
          return message(val);
        } else {
          return message;
        }
      };
      return this._refinement((val, ctx) => {
        const result = check(val);
        const setError = () => ctx.addIssue({
          code: ZodIssueCode.custom,
          ...getIssueProperties(val)
        });
        if (typeof Promise !== "undefined" && result instanceof Promise) {
          return result.then((data) => {
            if (!data) {
              setError();
              return false;
            } else {
              return true;
            }
          });
        }
        if (!result) {
          setError();
          return false;
        } else {
          return true;
        }
      });
    }
    refinement(check, refinementData) {
      return this._refinement((val, ctx) => {
        if (!check(val)) {
          ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
          return false;
        } else {
          return true;
        }
      });
    }
    _refinement(refinement) {
      return new ZodEffects({
        schema: this,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect: { type: "refinement", refinement }
      });
    }
    superRefine(refinement) {
      return this._refinement(refinement);
    }
    constructor(def) {
      this.spa = this.safeParseAsync;
      this._def = def;
      this.parse = this.parse.bind(this);
      this.safeParse = this.safeParse.bind(this);
      this.parseAsync = this.parseAsync.bind(this);
      this.safeParseAsync = this.safeParseAsync.bind(this);
      this.spa = this.spa.bind(this);
      this.refine = this.refine.bind(this);
      this.refinement = this.refinement.bind(this);
      this.superRefine = this.superRefine.bind(this);
      this.optional = this.optional.bind(this);
      this.nullable = this.nullable.bind(this);
      this.nullish = this.nullish.bind(this);
      this.array = this.array.bind(this);
      this.promise = this.promise.bind(this);
      this.or = this.or.bind(this);
      this.and = this.and.bind(this);
      this.transform = this.transform.bind(this);
      this.brand = this.brand.bind(this);
      this.default = this.default.bind(this);
      this.catch = this.catch.bind(this);
      this.describe = this.describe.bind(this);
      this.pipe = this.pipe.bind(this);
      this.readonly = this.readonly.bind(this);
      this.isNullable = this.isNullable.bind(this);
      this.isOptional = this.isOptional.bind(this);
      this["~standard"] = {
        version: 1,
        vendor: "zod",
        validate: (data) => this["~validate"](data)
      };
    }
    optional() {
      return ZodOptional.create(this, this._def);
    }
    nullable() {
      return ZodNullable.create(this, this._def);
    }
    nullish() {
      return this.nullable().optional();
    }
    array() {
      return ZodArray.create(this);
    }
    promise() {
      return ZodPromise.create(this, this._def);
    }
    or(option) {
      return ZodUnion.create([this, option], this._def);
    }
    and(incoming) {
      return ZodIntersection.create(this, incoming, this._def);
    }
    transform(transform) {
      return new ZodEffects({
        ...processCreateParams(this._def),
        schema: this,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect: { type: "transform", transform }
      });
    }
    default(def) {
      const defaultValueFunc = typeof def === "function" ? def : () => def;
      return new ZodDefault({
        ...processCreateParams(this._def),
        innerType: this,
        defaultValue: defaultValueFunc,
        typeName: ZodFirstPartyTypeKind.ZodDefault
      });
    }
    brand() {
      return new ZodBranded({
        typeName: ZodFirstPartyTypeKind.ZodBranded,
        type: this,
        ...processCreateParams(this._def)
      });
    }
    catch(def) {
      const catchValueFunc = typeof def === "function" ? def : () => def;
      return new ZodCatch({
        ...processCreateParams(this._def),
        innerType: this,
        catchValue: catchValueFunc,
        typeName: ZodFirstPartyTypeKind.ZodCatch
      });
    }
    describe(description) {
      const This = this.constructor;
      return new This({
        ...this._def,
        description
      });
    }
    pipe(target) {
      return ZodPipeline.create(this, target);
    }
    readonly() {
      return ZodReadonly.create(this);
    }
    isOptional() {
      return this.safeParse(void 0).success;
    }
    isNullable() {
      return this.safeParse(null).success;
    }
  };
  var cuidRegex = /^c[^\s-]{8,}$/i;
  var cuid2Regex = /^[0-9a-z]+$/;
  var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
  var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
  var nanoidRegex = /^[a-z0-9_-]{21}$/i;
  var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
  var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
  var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
  var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
  var emojiRegex;
  var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
  var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
  var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
  var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
  var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
  var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
  var dateRegex = new RegExp(`^${dateRegexSource}$`);
  function timeRegexSource(args) {
    let secondsRegexSource = `[0-5]\\d`;
    if (args.precision) {
      secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
    } else if (args.precision == null) {
      secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
    }
    const secondsQuantifier = args.precision ? "+" : "?";
    return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
  }
  function timeRegex(args) {
    return new RegExp(`^${timeRegexSource(args)}$`);
  }
  function datetimeRegex(args) {
    let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
    const opts = [];
    opts.push(args.local ? `Z?` : `Z`);
    if (args.offset)
      opts.push(`([+-]\\d{2}:?\\d{2})`);
    regex = `${regex}(${opts.join("|")})`;
    return new RegExp(`^${regex}$`);
  }
  function isValidIP(ip, version) {
    if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
      return true;
    }
    if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
      return true;
    }
    return false;
  }
  function isValidJWT(jwt, alg) {
    if (!jwtRegex.test(jwt))
      return false;
    try {
      const [header] = jwt.split(".");
      if (!header)
        return false;
      const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
      const decoded = JSON.parse(atob(base64));
      if (typeof decoded !== "object" || decoded === null)
        return false;
      if ("typ" in decoded && (decoded == null ? void 0 : decoded.typ) !== "JWT")
        return false;
      if (!decoded.alg)
        return false;
      if (alg && decoded.alg !== alg)
        return false;
      return true;
    } catch {
      return false;
    }
  }
  function isValidCidr(ip, version) {
    if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
      return true;
    }
    if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
      return true;
    }
    return false;
  }
  var ZodString = class _ZodString extends ZodType {
    _parse(input) {
      if (this._def.coerce) {
        input.data = String(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.string) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.string,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      const status = new ParseStatus();
      let ctx = void 0;
      for (const check of this._def.checks) {
        if (check.kind === "min") {
          if (input.data.length < check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          if (input.data.length > check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "length") {
          const tooBig = input.data.length > check.value;
          const tooSmall = input.data.length < check.value;
          if (tooBig || tooSmall) {
            ctx = this._getOrReturnCtx(input, ctx);
            if (tooBig) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: check.value,
                type: "string",
                inclusive: true,
                exact: true,
                message: check.message
              });
            } else if (tooSmall) {
              addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: check.value,
                type: "string",
                inclusive: true,
                exact: true,
                message: check.message
              });
            }
            status.dirty();
          }
        } else if (check.kind === "email") {
          if (!emailRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "email",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "emoji") {
          if (!emojiRegex) {
            emojiRegex = new RegExp(_emojiRegex, "u");
          }
          if (!emojiRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "emoji",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "uuid") {
          if (!uuidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "uuid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "nanoid") {
          if (!nanoidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "nanoid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "cuid") {
          if (!cuidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "cuid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "cuid2") {
          if (!cuid2Regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "cuid2",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "ulid") {
          if (!ulidRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "ulid",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "url") {
          try {
            new URL(input.data);
          } catch {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "url",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "regex") {
          check.regex.lastIndex = 0;
          const testResult = check.regex.test(input.data);
          if (!testResult) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "regex",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "trim") {
          input.data = input.data.trim();
        } else if (check.kind === "includes") {
          if (!input.data.includes(check.value, check.position)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: { includes: check.value, position: check.position },
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "toLowerCase") {
          input.data = input.data.toLowerCase();
        } else if (check.kind === "toUpperCase") {
          input.data = input.data.toUpperCase();
        } else if (check.kind === "startsWith") {
          if (!input.data.startsWith(check.value)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: { startsWith: check.value },
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "endsWith") {
          if (!input.data.endsWith(check.value)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: { endsWith: check.value },
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "datetime") {
          const regex = datetimeRegex(check);
          if (!regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "datetime",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "date") {
          const regex = dateRegex;
          if (!regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "date",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "time") {
          const regex = timeRegex(check);
          if (!regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_string,
              validation: "time",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "duration") {
          if (!durationRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "duration",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "ip") {
          if (!isValidIP(input.data, check.version)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "ip",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "jwt") {
          if (!isValidJWT(input.data, check.alg)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "jwt",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "cidr") {
          if (!isValidCidr(input.data, check.version)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "cidr",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "base64") {
          if (!base64Regex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "base64",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "base64url") {
          if (!base64urlRegex.test(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              validation: "base64url",
              code: ZodIssueCode.invalid_string,
              message: check.message
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return { status: status.value, value: input.data };
    }
    _regex(regex, validation, message) {
      return this.refinement((data) => regex.test(data), {
        validation,
        code: ZodIssueCode.invalid_string,
        ...errorUtil.errToObj(message)
      });
    }
    _addCheck(check) {
      return new _ZodString({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    email(message) {
      return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
    }
    url(message) {
      return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
    }
    emoji(message) {
      return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
    }
    uuid(message) {
      return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
    }
    nanoid(message) {
      return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
    }
    cuid(message) {
      return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
    }
    cuid2(message) {
      return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
    }
    ulid(message) {
      return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
    }
    base64(message) {
      return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
    }
    base64url(message) {
      return this._addCheck({
        kind: "base64url",
        ...errorUtil.errToObj(message)
      });
    }
    jwt(options) {
      return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
    }
    ip(options) {
      return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
    }
    cidr(options) {
      return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
    }
    datetime(options) {
      var _a, _b;
      if (typeof options === "string") {
        return this._addCheck({
          kind: "datetime",
          precision: null,
          offset: false,
          local: false,
          message: options
        });
      }
      return this._addCheck({
        kind: "datetime",
        precision: typeof (options == null ? void 0 : options.precision) === "undefined" ? null : options == null ? void 0 : options.precision,
        offset: (_a = options == null ? void 0 : options.offset) != null ? _a : false,
        local: (_b = options == null ? void 0 : options.local) != null ? _b : false,
        ...errorUtil.errToObj(options == null ? void 0 : options.message)
      });
    }
    date(message) {
      return this._addCheck({ kind: "date", message });
    }
    time(options) {
      if (typeof options === "string") {
        return this._addCheck({
          kind: "time",
          precision: null,
          message: options
        });
      }
      return this._addCheck({
        kind: "time",
        precision: typeof (options == null ? void 0 : options.precision) === "undefined" ? null : options == null ? void 0 : options.precision,
        ...errorUtil.errToObj(options == null ? void 0 : options.message)
      });
    }
    duration(message) {
      return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
    }
    regex(regex, message) {
      return this._addCheck({
        kind: "regex",
        regex,
        ...errorUtil.errToObj(message)
      });
    }
    includes(value, options) {
      return this._addCheck({
        kind: "includes",
        value,
        position: options == null ? void 0 : options.position,
        ...errorUtil.errToObj(options == null ? void 0 : options.message)
      });
    }
    startsWith(value, message) {
      return this._addCheck({
        kind: "startsWith",
        value,
        ...errorUtil.errToObj(message)
      });
    }
    endsWith(value, message) {
      return this._addCheck({
        kind: "endsWith",
        value,
        ...errorUtil.errToObj(message)
      });
    }
    min(minLength, message) {
      return this._addCheck({
        kind: "min",
        value: minLength,
        ...errorUtil.errToObj(message)
      });
    }
    max(maxLength, message) {
      return this._addCheck({
        kind: "max",
        value: maxLength,
        ...errorUtil.errToObj(message)
      });
    }
    length(len, message) {
      return this._addCheck({
        kind: "length",
        value: len,
        ...errorUtil.errToObj(message)
      });
    }
    /**
     * Equivalent to `.min(1)`
     */
    nonempty(message) {
      return this.min(1, errorUtil.errToObj(message));
    }
    trim() {
      return new _ZodString({
        ...this._def,
        checks: [...this._def.checks, { kind: "trim" }]
      });
    }
    toLowerCase() {
      return new _ZodString({
        ...this._def,
        checks: [...this._def.checks, { kind: "toLowerCase" }]
      });
    }
    toUpperCase() {
      return new _ZodString({
        ...this._def,
        checks: [...this._def.checks, { kind: "toUpperCase" }]
      });
    }
    get isDatetime() {
      return !!this._def.checks.find((ch) => ch.kind === "datetime");
    }
    get isDate() {
      return !!this._def.checks.find((ch) => ch.kind === "date");
    }
    get isTime() {
      return !!this._def.checks.find((ch) => ch.kind === "time");
    }
    get isDuration() {
      return !!this._def.checks.find((ch) => ch.kind === "duration");
    }
    get isEmail() {
      return !!this._def.checks.find((ch) => ch.kind === "email");
    }
    get isURL() {
      return !!this._def.checks.find((ch) => ch.kind === "url");
    }
    get isEmoji() {
      return !!this._def.checks.find((ch) => ch.kind === "emoji");
    }
    get isUUID() {
      return !!this._def.checks.find((ch) => ch.kind === "uuid");
    }
    get isNANOID() {
      return !!this._def.checks.find((ch) => ch.kind === "nanoid");
    }
    get isCUID() {
      return !!this._def.checks.find((ch) => ch.kind === "cuid");
    }
    get isCUID2() {
      return !!this._def.checks.find((ch) => ch.kind === "cuid2");
    }
    get isULID() {
      return !!this._def.checks.find((ch) => ch.kind === "ulid");
    }
    get isIP() {
      return !!this._def.checks.find((ch) => ch.kind === "ip");
    }
    get isCIDR() {
      return !!this._def.checks.find((ch) => ch.kind === "cidr");
    }
    get isBase64() {
      return !!this._def.checks.find((ch) => ch.kind === "base64");
    }
    get isBase64url() {
      return !!this._def.checks.find((ch) => ch.kind === "base64url");
    }
    get minLength() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min;
    }
    get maxLength() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max;
    }
  };
  ZodString.create = (params) => {
    var _a;
    return new ZodString({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodString,
      coerce: (_a = params == null ? void 0 : params.coerce) != null ? _a : false,
      ...processCreateParams(params)
    });
  };
  function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepDecCount = (step.toString().split(".")[1] || "").length;
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
    return valInt % stepInt / 10 ** decCount;
  }
  var ZodNumber = class _ZodNumber extends ZodType {
    constructor() {
      super(...arguments);
      this.min = this.gte;
      this.max = this.lte;
      this.step = this.multipleOf;
    }
    _parse(input) {
      if (this._def.coerce) {
        input.data = Number(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.number) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.number,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      let ctx = void 0;
      const status = new ParseStatus();
      for (const check of this._def.checks) {
        if (check.kind === "int") {
          if (!util.isInteger(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.invalid_type,
              expected: "integer",
              received: "float",
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "min") {
          const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
          if (tooSmall) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "number",
              inclusive: check.inclusive,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
          if (tooBig) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "number",
              inclusive: check.inclusive,
              exact: false,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "multipleOf") {
          if (floatSafeRemainder(input.data, check.value) !== 0) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.not_multiple_of,
              multipleOf: check.value,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "finite") {
          if (!Number.isFinite(input.data)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.not_finite,
              message: check.message
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return { status: status.value, value: input.data };
    }
    gte(value, message) {
      return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
      return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
      return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
      return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
      return new _ZodNumber({
        ...this._def,
        checks: [
          ...this._def.checks,
          {
            kind,
            value,
            inclusive,
            message: errorUtil.toString(message)
          }
        ]
      });
    }
    _addCheck(check) {
      return new _ZodNumber({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    int(message) {
      return this._addCheck({
        kind: "int",
        message: errorUtil.toString(message)
      });
    }
    positive(message) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    negative(message) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    nonpositive(message) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    nonnegative(message) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    multipleOf(value, message) {
      return this._addCheck({
        kind: "multipleOf",
        value,
        message: errorUtil.toString(message)
      });
    }
    finite(message) {
      return this._addCheck({
        kind: "finite",
        message: errorUtil.toString(message)
      });
    }
    safe(message) {
      return this._addCheck({
        kind: "min",
        inclusive: true,
        value: Number.MIN_SAFE_INTEGER,
        message: errorUtil.toString(message)
      })._addCheck({
        kind: "max",
        inclusive: true,
        value: Number.MAX_SAFE_INTEGER,
        message: errorUtil.toString(message)
      });
    }
    get minValue() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min;
    }
    get maxValue() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max;
    }
    get isInt() {
      return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
    }
    get isFinite() {
      let max = null;
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
          return true;
        } else if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        } else if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return Number.isFinite(min) && Number.isFinite(max);
    }
  };
  ZodNumber.create = (params) => {
    return new ZodNumber({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodNumber,
      coerce: (params == null ? void 0 : params.coerce) || false,
      ...processCreateParams(params)
    });
  };
  var ZodBigInt = class _ZodBigInt extends ZodType {
    constructor() {
      super(...arguments);
      this.min = this.gte;
      this.max = this.lte;
    }
    _parse(input) {
      if (this._def.coerce) {
        try {
          input.data = BigInt(input.data);
        } catch {
          return this._getInvalidInput(input);
        }
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.bigint) {
        return this._getInvalidInput(input);
      }
      let ctx = void 0;
      const status = new ParseStatus();
      for (const check of this._def.checks) {
        if (check.kind === "min") {
          const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
          if (tooSmall) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              type: "bigint",
              minimum: check.value,
              inclusive: check.inclusive,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
          if (tooBig) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              type: "bigint",
              maximum: check.value,
              inclusive: check.inclusive,
              message: check.message
            });
            status.dirty();
          }
        } else if (check.kind === "multipleOf") {
          if (input.data % check.value !== BigInt(0)) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.not_multiple_of,
              multipleOf: check.value,
              message: check.message
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return { status: status.value, value: input.data };
    }
    _getInvalidInput(input) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.bigint,
        received: ctx.parsedType
      });
      return INVALID;
    }
    gte(value, message) {
      return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
      return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
      return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
      return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
      return new _ZodBigInt({
        ...this._def,
        checks: [
          ...this._def.checks,
          {
            kind,
            value,
            inclusive,
            message: errorUtil.toString(message)
          }
        ]
      });
    }
    _addCheck(check) {
      return new _ZodBigInt({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    positive(message) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    negative(message) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: false,
        message: errorUtil.toString(message)
      });
    }
    nonpositive(message) {
      return this._addCheck({
        kind: "max",
        value: BigInt(0),
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    nonnegative(message) {
      return this._addCheck({
        kind: "min",
        value: BigInt(0),
        inclusive: true,
        message: errorUtil.toString(message)
      });
    }
    multipleOf(value, message) {
      return this._addCheck({
        kind: "multipleOf",
        value,
        message: errorUtil.toString(message)
      });
    }
    get minValue() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min;
    }
    get maxValue() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max;
    }
  };
  ZodBigInt.create = (params) => {
    var _a;
    return new ZodBigInt({
      checks: [],
      typeName: ZodFirstPartyTypeKind.ZodBigInt,
      coerce: (_a = params == null ? void 0 : params.coerce) != null ? _a : false,
      ...processCreateParams(params)
    });
  };
  var ZodBoolean = class extends ZodType {
    _parse(input) {
      if (this._def.coerce) {
        input.data = Boolean(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.boolean) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.boolean,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  };
  ZodBoolean.create = (params) => {
    return new ZodBoolean({
      typeName: ZodFirstPartyTypeKind.ZodBoolean,
      coerce: (params == null ? void 0 : params.coerce) || false,
      ...processCreateParams(params)
    });
  };
  var ZodDate = class _ZodDate extends ZodType {
    _parse(input) {
      if (this._def.coerce) {
        input.data = new Date(input.data);
      }
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.date) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.date,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      if (Number.isNaN(input.data.getTime())) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_date
        });
        return INVALID;
      }
      const status = new ParseStatus();
      let ctx = void 0;
      for (const check of this._def.checks) {
        if (check.kind === "min") {
          if (input.data.getTime() < check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              message: check.message,
              inclusive: true,
              exact: false,
              minimum: check.value,
              type: "date"
            });
            status.dirty();
          }
        } else if (check.kind === "max") {
          if (input.data.getTime() > check.value) {
            ctx = this._getOrReturnCtx(input, ctx);
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              message: check.message,
              inclusive: true,
              exact: false,
              maximum: check.value,
              type: "date"
            });
            status.dirty();
          }
        } else {
          util.assertNever(check);
        }
      }
      return {
        status: status.value,
        value: new Date(input.data.getTime())
      };
    }
    _addCheck(check) {
      return new _ZodDate({
        ...this._def,
        checks: [...this._def.checks, check]
      });
    }
    min(minDate, message) {
      return this._addCheck({
        kind: "min",
        value: minDate.getTime(),
        message: errorUtil.toString(message)
      });
    }
    max(maxDate, message) {
      return this._addCheck({
        kind: "max",
        value: maxDate.getTime(),
        message: errorUtil.toString(message)
      });
    }
    get minDate() {
      let min = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "min") {
          if (min === null || ch.value > min)
            min = ch.value;
        }
      }
      return min != null ? new Date(min) : null;
    }
    get maxDate() {
      let max = null;
      for (const ch of this._def.checks) {
        if (ch.kind === "max") {
          if (max === null || ch.value < max)
            max = ch.value;
        }
      }
      return max != null ? new Date(max) : null;
    }
  };
  ZodDate.create = (params) => {
    return new ZodDate({
      checks: [],
      coerce: (params == null ? void 0 : params.coerce) || false,
      typeName: ZodFirstPartyTypeKind.ZodDate,
      ...processCreateParams(params)
    });
  };
  var ZodSymbol = class extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.symbol) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.symbol,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  };
  ZodSymbol.create = (params) => {
    return new ZodSymbol({
      typeName: ZodFirstPartyTypeKind.ZodSymbol,
      ...processCreateParams(params)
    });
  };
  var ZodUndefined = class extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.undefined) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.undefined,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  };
  ZodUndefined.create = (params) => {
    return new ZodUndefined({
      typeName: ZodFirstPartyTypeKind.ZodUndefined,
      ...processCreateParams(params)
    });
  };
  var ZodNull = class extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.null) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.null,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  };
  ZodNull.create = (params) => {
    return new ZodNull({
      typeName: ZodFirstPartyTypeKind.ZodNull,
      ...processCreateParams(params)
    });
  };
  var ZodAny = class extends ZodType {
    constructor() {
      super(...arguments);
      this._any = true;
    }
    _parse(input) {
      return OK(input.data);
    }
  };
  ZodAny.create = (params) => {
    return new ZodAny({
      typeName: ZodFirstPartyTypeKind.ZodAny,
      ...processCreateParams(params)
    });
  };
  var ZodUnknown = class extends ZodType {
    constructor() {
      super(...arguments);
      this._unknown = true;
    }
    _parse(input) {
      return OK(input.data);
    }
  };
  ZodUnknown.create = (params) => {
    return new ZodUnknown({
      typeName: ZodFirstPartyTypeKind.ZodUnknown,
      ...processCreateParams(params)
    });
  };
  var ZodNever = class extends ZodType {
    _parse(input) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.never,
        received: ctx.parsedType
      });
      return INVALID;
    }
  };
  ZodNever.create = (params) => {
    return new ZodNever({
      typeName: ZodFirstPartyTypeKind.ZodNever,
      ...processCreateParams(params)
    });
  };
  var ZodVoid = class extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.undefined) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.void,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return OK(input.data);
    }
  };
  ZodVoid.create = (params) => {
    return new ZodVoid({
      typeName: ZodFirstPartyTypeKind.ZodVoid,
      ...processCreateParams(params)
    });
  };
  var ZodArray = class _ZodArray extends ZodType {
    _parse(input) {
      const { ctx, status } = this._processInputParams(input);
      const def = this._def;
      if (ctx.parsedType !== ZodParsedType.array) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.array,
          received: ctx.parsedType
        });
        return INVALID;
      }
      if (def.exactLength !== null) {
        const tooBig = ctx.data.length > def.exactLength.value;
        const tooSmall = ctx.data.length < def.exactLength.value;
        if (tooBig || tooSmall) {
          addIssueToContext(ctx, {
            code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
            minimum: tooSmall ? def.exactLength.value : void 0,
            maximum: tooBig ? def.exactLength.value : void 0,
            type: "array",
            inclusive: true,
            exact: true,
            message: def.exactLength.message
          });
          status.dirty();
        }
      }
      if (def.minLength !== null) {
        if (ctx.data.length < def.minLength.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: def.minLength.value,
            type: "array",
            inclusive: true,
            exact: false,
            message: def.minLength.message
          });
          status.dirty();
        }
      }
      if (def.maxLength !== null) {
        if (ctx.data.length > def.maxLength.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: def.maxLength.value,
            type: "array",
            inclusive: true,
            exact: false,
            message: def.maxLength.message
          });
          status.dirty();
        }
      }
      if (ctx.common.async) {
        return Promise.all([...ctx.data].map((item, i) => {
          return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        })).then((result2) => {
          return ParseStatus.mergeArray(status, result2);
        });
      }
      const result = [...ctx.data].map((item, i) => {
        return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      });
      return ParseStatus.mergeArray(status, result);
    }
    get element() {
      return this._def.type;
    }
    min(minLength, message) {
      return new _ZodArray({
        ...this._def,
        minLength: { value: minLength, message: errorUtil.toString(message) }
      });
    }
    max(maxLength, message) {
      return new _ZodArray({
        ...this._def,
        maxLength: { value: maxLength, message: errorUtil.toString(message) }
      });
    }
    length(len, message) {
      return new _ZodArray({
        ...this._def,
        exactLength: { value: len, message: errorUtil.toString(message) }
      });
    }
    nonempty(message) {
      return this.min(1, message);
    }
  };
  ZodArray.create = (schema, params) => {
    return new ZodArray({
      type: schema,
      minLength: null,
      maxLength: null,
      exactLength: null,
      typeName: ZodFirstPartyTypeKind.ZodArray,
      ...processCreateParams(params)
    });
  };
  function deepPartialify(schema) {
    if (schema instanceof ZodObject) {
      const newShape = {};
      for (const key in schema.shape) {
        const fieldSchema = schema.shape[key];
        newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
      }
      return new ZodObject({
        ...schema._def,
        shape: () => newShape
      });
    } else if (schema instanceof ZodArray) {
      return new ZodArray({
        ...schema._def,
        type: deepPartialify(schema.element)
      });
    } else if (schema instanceof ZodOptional) {
      return ZodOptional.create(deepPartialify(schema.unwrap()));
    } else if (schema instanceof ZodNullable) {
      return ZodNullable.create(deepPartialify(schema.unwrap()));
    } else if (schema instanceof ZodTuple) {
      return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
    } else {
      return schema;
    }
  }
  var ZodObject = class _ZodObject extends ZodType {
    constructor() {
      super(...arguments);
      this._cached = null;
      this.nonstrict = this.passthrough;
      this.augment = this.extend;
    }
    _getCached() {
      if (this._cached !== null)
        return this._cached;
      const shape = this._def.shape();
      const keys = util.objectKeys(shape);
      this._cached = { shape, keys };
      return this._cached;
    }
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.object) {
        const ctx2 = this._getOrReturnCtx(input);
        addIssueToContext(ctx2, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: ctx2.parsedType
        });
        return INVALID;
      }
      const { status, ctx } = this._processInputParams(input);
      const { shape, keys: shapeKeys } = this._getCached();
      const extraKeys = [];
      if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
        for (const key in ctx.data) {
          if (!shapeKeys.includes(key)) {
            extraKeys.push(key);
          }
        }
      }
      const pairs = [];
      for (const key of shapeKeys) {
        const keyValidator = shape[key];
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
      if (this._def.catchall instanceof ZodNever) {
        const unknownKeys = this._def.unknownKeys;
        if (unknownKeys === "passthrough") {
          for (const key of extraKeys) {
            pairs.push({
              key: { status: "valid", value: key },
              value: { status: "valid", value: ctx.data[key] }
            });
          }
        } else if (unknownKeys === "strict") {
          if (extraKeys.length > 0) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.unrecognized_keys,
              keys: extraKeys
            });
            status.dirty();
          }
        } else if (unknownKeys === "strip") {
        } else {
          throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
        }
      } else {
        const catchall = this._def.catchall;
        for (const key of extraKeys) {
          const value = ctx.data[key];
          pairs.push({
            key: { status: "valid", value: key },
            value: catchall._parse(
              new ParseInputLazyPath(ctx, value, ctx.path, key)
              //, ctx.child(key), value, getParsedType(value)
            ),
            alwaysSet: key in ctx.data
          });
        }
      }
      if (ctx.common.async) {
        return Promise.resolve().then(async () => {
          const syncPairs = [];
          for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            syncPairs.push({
              key,
              value,
              alwaysSet: pair.alwaysSet
            });
          }
          return syncPairs;
        }).then((syncPairs) => {
          return ParseStatus.mergeObjectSync(status, syncPairs);
        });
      } else {
        return ParseStatus.mergeObjectSync(status, pairs);
      }
    }
    get shape() {
      return this._def.shape();
    }
    strict(message) {
      errorUtil.errToObj;
      return new _ZodObject({
        ...this._def,
        unknownKeys: "strict",
        ...message !== void 0 ? {
          errorMap: (issue, ctx) => {
            var _a, _b, _c, _d;
            const defaultError = (_c = (_b = (_a = this._def).errorMap) == null ? void 0 : _b.call(_a, issue, ctx).message) != null ? _c : ctx.defaultError;
            if (issue.code === "unrecognized_keys")
              return {
                message: (_d = errorUtil.errToObj(message).message) != null ? _d : defaultError
              };
            return {
              message: defaultError
            };
          }
        } : {}
      });
    }
    strip() {
      return new _ZodObject({
        ...this._def,
        unknownKeys: "strip"
      });
    }
    passthrough() {
      return new _ZodObject({
        ...this._def,
        unknownKeys: "passthrough"
      });
    }
    // const AugmentFactory =
    //   <Def extends ZodObjectDef>(def: Def) =>
    //   <Augmentation extends ZodRawShape>(
    //     augmentation: Augmentation
    //   ): ZodObject<
    //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
    //     Def["unknownKeys"],
    //     Def["catchall"]
    //   > => {
    //     return new ZodObject({
    //       ...def,
    //       shape: () => ({
    //         ...def.shape(),
    //         ...augmentation,
    //       }),
    //     }) as any;
    //   };
    extend(augmentation) {
      return new _ZodObject({
        ...this._def,
        shape: () => ({
          ...this._def.shape(),
          ...augmentation
        })
      });
    }
    /**
     * Prior to zod@1.0.12 there was a bug in the
     * inferred type of merged objects. Please
     * upgrade if you are experiencing issues.
     */
    merge(merging) {
      const merged = new _ZodObject({
        unknownKeys: merging._def.unknownKeys,
        catchall: merging._def.catchall,
        shape: () => ({
          ...this._def.shape(),
          ...merging._def.shape()
        }),
        typeName: ZodFirstPartyTypeKind.ZodObject
      });
      return merged;
    }
    // merge<
    //   Incoming extends AnyZodObject,
    //   Augmentation extends Incoming["shape"],
    //   NewOutput extends {
    //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
    //       ? Augmentation[k]["_output"]
    //       : k extends keyof Output
    //       ? Output[k]
    //       : never;
    //   },
    //   NewInput extends {
    //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
    //       ? Augmentation[k]["_input"]
    //       : k extends keyof Input
    //       ? Input[k]
    //       : never;
    //   }
    // >(
    //   merging: Incoming
    // ): ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"],
    //   NewOutput,
    //   NewInput
    // > {
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    setKey(key, schema) {
      return this.augment({ [key]: schema });
    }
    // merge<Incoming extends AnyZodObject>(
    //   merging: Incoming
    // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
    // ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"]
    // > {
    //   // const mergedShape = objectUtil.mergeShapes(
    //   //   this._def.shape(),
    //   //   merging._def.shape()
    //   // );
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    catchall(index4) {
      return new _ZodObject({
        ...this._def,
        catchall: index4
      });
    }
    pick(mask) {
      const shape = {};
      for (const key of util.objectKeys(mask)) {
        if (mask[key] && this.shape[key]) {
          shape[key] = this.shape[key];
        }
      }
      return new _ZodObject({
        ...this._def,
        shape: () => shape
      });
    }
    omit(mask) {
      const shape = {};
      for (const key of util.objectKeys(this.shape)) {
        if (!mask[key]) {
          shape[key] = this.shape[key];
        }
      }
      return new _ZodObject({
        ...this._def,
        shape: () => shape
      });
    }
    /**
     * @deprecated
     */
    deepPartial() {
      return deepPartialify(this);
    }
    partial(mask) {
      const newShape = {};
      for (const key of util.objectKeys(this.shape)) {
        const fieldSchema = this.shape[key];
        if (mask && !mask[key]) {
          newShape[key] = fieldSchema;
        } else {
          newShape[key] = fieldSchema.optional();
        }
      }
      return new _ZodObject({
        ...this._def,
        shape: () => newShape
      });
    }
    required(mask) {
      const newShape = {};
      for (const key of util.objectKeys(this.shape)) {
        if (mask && !mask[key]) {
          newShape[key] = this.shape[key];
        } else {
          const fieldSchema = this.shape[key];
          let newField = fieldSchema;
          while (newField instanceof ZodOptional) {
            newField = newField._def.innerType;
          }
          newShape[key] = newField;
        }
      }
      return new _ZodObject({
        ...this._def,
        shape: () => newShape
      });
    }
    keyof() {
      return createZodEnum(util.objectKeys(this.shape));
    }
  };
  ZodObject.create = (shape, params) => {
    return new ZodObject({
      shape: () => shape,
      unknownKeys: "strip",
      catchall: ZodNever.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params)
    });
  };
  ZodObject.strictCreate = (shape, params) => {
    return new ZodObject({
      shape: () => shape,
      unknownKeys: "strict",
      catchall: ZodNever.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params)
    });
  };
  ZodObject.lazycreate = (shape, params) => {
    return new ZodObject({
      shape,
      unknownKeys: "strip",
      catchall: ZodNever.create(),
      typeName: ZodFirstPartyTypeKind.ZodObject,
      ...processCreateParams(params)
    });
  };
  var ZodUnion = class extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const options = this._def.options;
      function handleResults(results) {
        for (const result of results) {
          if (result.result.status === "valid") {
            return result.result;
          }
        }
        for (const result of results) {
          if (result.result.status === "dirty") {
            ctx.common.issues.push(...result.ctx.common.issues);
            return result.result;
          }
        }
        const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union,
          unionErrors
        });
        return INVALID;
      }
      if (ctx.common.async) {
        return Promise.all(options.map(async (option) => {
          const childCtx = {
            ...ctx,
            common: {
              ...ctx.common,
              issues: []
            },
            parent: null
          };
          return {
            result: await option._parseAsync({
              data: ctx.data,
              path: ctx.path,
              parent: childCtx
            }),
            ctx: childCtx
          };
        })).then(handleResults);
      } else {
        let dirty = void 0;
        const issues = [];
        for (const option of options) {
          const childCtx = {
            ...ctx,
            common: {
              ...ctx.common,
              issues: []
            },
            parent: null
          };
          const result = option._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          });
          if (result.status === "valid") {
            return result;
          } else if (result.status === "dirty" && !dirty) {
            dirty = { result, ctx: childCtx };
          }
          if (childCtx.common.issues.length) {
            issues.push(childCtx.common.issues);
          }
        }
        if (dirty) {
          ctx.common.issues.push(...dirty.ctx.common.issues);
          return dirty.result;
        }
        const unionErrors = issues.map((issues2) => new ZodError(issues2));
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union,
          unionErrors
        });
        return INVALID;
      }
    }
    get options() {
      return this._def.options;
    }
  };
  ZodUnion.create = (types, params) => {
    return new ZodUnion({
      options: types,
      typeName: ZodFirstPartyTypeKind.ZodUnion,
      ...processCreateParams(params)
    });
  };
  var getDiscriminator = (type) => {
    if (type instanceof ZodLazy) {
      return getDiscriminator(type.schema);
    } else if (type instanceof ZodEffects) {
      return getDiscriminator(type.innerType());
    } else if (type instanceof ZodLiteral) {
      return [type.value];
    } else if (type instanceof ZodEnum) {
      return type.options;
    } else if (type instanceof ZodNativeEnum) {
      return util.objectValues(type.enum);
    } else if (type instanceof ZodDefault) {
      return getDiscriminator(type._def.innerType);
    } else if (type instanceof ZodUndefined) {
      return [void 0];
    } else if (type instanceof ZodNull) {
      return [null];
    } else if (type instanceof ZodOptional) {
      return [void 0, ...getDiscriminator(type.unwrap())];
    } else if (type instanceof ZodNullable) {
      return [null, ...getDiscriminator(type.unwrap())];
    } else if (type instanceof ZodBranded) {
      return getDiscriminator(type.unwrap());
    } else if (type instanceof ZodReadonly) {
      return getDiscriminator(type.unwrap());
    } else if (type instanceof ZodCatch) {
      return getDiscriminator(type._def.innerType);
    } else {
      return [];
    }
  };
  var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.object) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const discriminator = this.discriminator;
      const discriminatorValue = ctx.data[discriminator];
      const option = this.optionsMap.get(discriminatorValue);
      if (!option) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_union_discriminator,
          options: Array.from(this.optionsMap.keys()),
          path: [discriminator]
        });
        return INVALID;
      }
      if (ctx.common.async) {
        return option._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
      } else {
        return option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
      }
    }
    get discriminator() {
      return this._def.discriminator;
    }
    get options() {
      return this._def.options;
    }
    get optionsMap() {
      return this._def.optionsMap;
    }
    /**
     * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
     * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
     * have a different value for each object in the union.
     * @param discriminator the name of the discriminator property
     * @param types an array of object schemas
     * @param params
     */
    static create(discriminator, options, params) {
      const optionsMap = /* @__PURE__ */ new Map();
      for (const type of options) {
        const discriminatorValues = getDiscriminator(type.shape[discriminator]);
        if (!discriminatorValues.length) {
          throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
        }
        for (const value of discriminatorValues) {
          if (optionsMap.has(value)) {
            throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
          }
          optionsMap.set(value, type);
        }
      }
      return new _ZodDiscriminatedUnion({
        typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
        discriminator,
        options,
        optionsMap,
        ...processCreateParams(params)
      });
    }
  };
  function mergeValues(a, b) {
    const aType = getParsedType(a);
    const bType = getParsedType(b);
    if (a === b) {
      return { valid: true, data: a };
    } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
      const bKeys = util.objectKeys(b);
      const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
      const newObj = { ...a, ...b };
      for (const key of sharedKeys) {
        const sharedValue = mergeValues(a[key], b[key]);
        if (!sharedValue.valid) {
          return { valid: false };
        }
        newObj[key] = sharedValue.data;
      }
      return { valid: true, data: newObj };
    } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
      if (a.length !== b.length) {
        return { valid: false };
      }
      const newArray = [];
      for (let index4 = 0; index4 < a.length; index4++) {
        const itemA = a[index4];
        const itemB = b[index4];
        const sharedValue = mergeValues(itemA, itemB);
        if (!sharedValue.valid) {
          return { valid: false };
        }
        newArray.push(sharedValue.data);
      }
      return { valid: true, data: newArray };
    } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
      return { valid: true, data: a };
    } else {
      return { valid: false };
    }
  }
  var ZodIntersection = class extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      const handleParsed = (parsedLeft, parsedRight) => {
        if (isAborted(parsedLeft) || isAborted(parsedRight)) {
          return INVALID;
        }
        const merged = mergeValues(parsedLeft.value, parsedRight.value);
        if (!merged.valid) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_intersection_types
          });
          return INVALID;
        }
        if (isDirty(parsedLeft) || isDirty(parsedRight)) {
          status.dirty();
        }
        return { status: status.value, value: merged.data };
      };
      if (ctx.common.async) {
        return Promise.all([
          this._def.left._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          }),
          this._def.right._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          })
        ]).then(([left, right]) => handleParsed(left, right));
      } else {
        return handleParsed(this._def.left._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }), this._def.right._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }));
      }
    }
  };
  ZodIntersection.create = (left, right, params) => {
    return new ZodIntersection({
      left,
      right,
      typeName: ZodFirstPartyTypeKind.ZodIntersection,
      ...processCreateParams(params)
    });
  };
  var ZodTuple = class _ZodTuple extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.array) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.array,
          received: ctx.parsedType
        });
        return INVALID;
      }
      if (ctx.data.length < this._def.items.length) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: this._def.items.length,
          inclusive: true,
          exact: false,
          type: "array"
        });
        return INVALID;
      }
      const rest = this._def.rest;
      if (!rest && ctx.data.length > this._def.items.length) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: this._def.items.length,
          inclusive: true,
          exact: false,
          type: "array"
        });
        status.dirty();
      }
      const items = [...ctx.data].map((item, itemIndex) => {
        const schema = this._def.items[itemIndex] || this._def.rest;
        if (!schema)
          return null;
        return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
      }).filter((x) => !!x);
      if (ctx.common.async) {
        return Promise.all(items).then((results) => {
          return ParseStatus.mergeArray(status, results);
        });
      } else {
        return ParseStatus.mergeArray(status, items);
      }
    }
    get items() {
      return this._def.items;
    }
    rest(rest) {
      return new _ZodTuple({
        ...this._def,
        rest
      });
    }
  };
  ZodTuple.create = (schemas, params) => {
    if (!Array.isArray(schemas)) {
      throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    }
    return new ZodTuple({
      items: schemas,
      typeName: ZodFirstPartyTypeKind.ZodTuple,
      rest: null,
      ...processCreateParams(params)
    });
  };
  var ZodRecord = class _ZodRecord extends ZodType {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.object) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.object,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const pairs = [];
      const keyType = this._def.keyType;
      const valueType = this._def.valueType;
      for (const key in ctx.data) {
        pairs.push({
          key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
          value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
      if (ctx.common.async) {
        return ParseStatus.mergeObjectAsync(status, pairs);
      } else {
        return ParseStatus.mergeObjectSync(status, pairs);
      }
    }
    get element() {
      return this._def.valueType;
    }
    static create(first, second, third) {
      if (second instanceof ZodType) {
        return new _ZodRecord({
          keyType: first,
          valueType: second,
          typeName: ZodFirstPartyTypeKind.ZodRecord,
          ...processCreateParams(third)
        });
      }
      return new _ZodRecord({
        keyType: ZodString.create(),
        valueType: first,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(second)
      });
    }
  };
  var ZodMap = class extends ZodType {
    get keySchema() {
      return this._def.keyType;
    }
    get valueSchema() {
      return this._def.valueType;
    }
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.map) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.map,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const keyType = this._def.keyType;
      const valueType = this._def.valueType;
      const pairs = [...ctx.data.entries()].map(([key, value], index4) => {
        return {
          key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index4, "key"])),
          value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index4, "value"]))
        };
      });
      if (ctx.common.async) {
        const finalMap = /* @__PURE__ */ new Map();
        return Promise.resolve().then(async () => {
          for (const pair of pairs) {
            const key = await pair.key;
            const value = await pair.value;
            if (key.status === "aborted" || value.status === "aborted") {
              return INVALID;
            }
            if (key.status === "dirty" || value.status === "dirty") {
              status.dirty();
            }
            finalMap.set(key.value, value.value);
          }
          return { status: status.value, value: finalMap };
        });
      } else {
        const finalMap = /* @__PURE__ */ new Map();
        for (const pair of pairs) {
          const key = pair.key;
          const value = pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      }
    }
  };
  ZodMap.create = (keyType, valueType, params) => {
    return new ZodMap({
      valueType,
      keyType,
      typeName: ZodFirstPartyTypeKind.ZodMap,
      ...processCreateParams(params)
    });
  };
  var ZodSet = class _ZodSet extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.set) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.set,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const def = this._def;
      if (def.minSize !== null) {
        if (ctx.data.size < def.minSize.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: def.minSize.value,
            type: "set",
            inclusive: true,
            exact: false,
            message: def.minSize.message
          });
          status.dirty();
        }
      }
      if (def.maxSize !== null) {
        if (ctx.data.size > def.maxSize.value) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: def.maxSize.value,
            type: "set",
            inclusive: true,
            exact: false,
            message: def.maxSize.message
          });
          status.dirty();
        }
      }
      const valueType = this._def.valueType;
      function finalizeSet(elements2) {
        const parsedSet = /* @__PURE__ */ new Set();
        for (const element of elements2) {
          if (element.status === "aborted")
            return INVALID;
          if (element.status === "dirty")
            status.dirty();
          parsedSet.add(element.value);
        }
        return { status: status.value, value: parsedSet };
      }
      const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
      if (ctx.common.async) {
        return Promise.all(elements).then((elements2) => finalizeSet(elements2));
      } else {
        return finalizeSet(elements);
      }
    }
    min(minSize, message) {
      return new _ZodSet({
        ...this._def,
        minSize: { value: minSize, message: errorUtil.toString(message) }
      });
    }
    max(maxSize, message) {
      return new _ZodSet({
        ...this._def,
        maxSize: { value: maxSize, message: errorUtil.toString(message) }
      });
    }
    size(size, message) {
      return this.min(size, message).max(size, message);
    }
    nonempty(message) {
      return this.min(1, message);
    }
  };
  ZodSet.create = (valueType, params) => {
    return new ZodSet({
      valueType,
      minSize: null,
      maxSize: null,
      typeName: ZodFirstPartyTypeKind.ZodSet,
      ...processCreateParams(params)
    });
  };
  var ZodFunction = class _ZodFunction extends ZodType {
    constructor() {
      super(...arguments);
      this.validate = this.implement;
    }
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.function) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.function,
          received: ctx.parsedType
        });
        return INVALID;
      }
      function makeArgsIssue(args, error) {
        return makeIssue({
          data: args,
          path: ctx.path,
          errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
          issueData: {
            code: ZodIssueCode.invalid_arguments,
            argumentsError: error
          }
        });
      }
      function makeReturnsIssue(returns, error) {
        return makeIssue({
          data: returns,
          path: ctx.path,
          errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
          issueData: {
            code: ZodIssueCode.invalid_return_type,
            returnTypeError: error
          }
        });
      }
      const params = { errorMap: ctx.common.contextualErrorMap };
      const fn = ctx.data;
      if (this._def.returns instanceof ZodPromise) {
        const me = this;
        return OK(async function(...args) {
          const error = new ZodError([]);
          const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
            error.addIssue(makeArgsIssue(args, e));
            throw error;
          });
          const result = await Reflect.apply(fn, this, parsedArgs);
          const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
            error.addIssue(makeReturnsIssue(result, e));
            throw error;
          });
          return parsedReturns;
        });
      } else {
        const me = this;
        return OK(function(...args) {
          const parsedArgs = me._def.args.safeParse(args, params);
          if (!parsedArgs.success) {
            throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
          }
          const result = Reflect.apply(fn, this, parsedArgs.data);
          const parsedReturns = me._def.returns.safeParse(result, params);
          if (!parsedReturns.success) {
            throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
          }
          return parsedReturns.data;
        });
      }
    }
    parameters() {
      return this._def.args;
    }
    returnType() {
      return this._def.returns;
    }
    args(...items) {
      return new _ZodFunction({
        ...this._def,
        args: ZodTuple.create(items).rest(ZodUnknown.create())
      });
    }
    returns(returnType) {
      return new _ZodFunction({
        ...this._def,
        returns: returnType
      });
    }
    implement(func) {
      const validatedFunc = this.parse(func);
      return validatedFunc;
    }
    strictImplement(func) {
      const validatedFunc = this.parse(func);
      return validatedFunc;
    }
    static create(args, returns, params) {
      return new _ZodFunction({
        args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
        returns: returns || ZodUnknown.create(),
        typeName: ZodFirstPartyTypeKind.ZodFunction,
        ...processCreateParams(params)
      });
    }
  };
  var ZodLazy = class extends ZodType {
    get schema() {
      return this._def.getter();
    }
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const lazySchema = this._def.getter();
      return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
    }
  };
  ZodLazy.create = (getter, params) => {
    return new ZodLazy({
      getter,
      typeName: ZodFirstPartyTypeKind.ZodLazy,
      ...processCreateParams(params)
    });
  };
  var ZodLiteral = class extends ZodType {
    _parse(input) {
      if (input.data !== this._def.value) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_literal,
          expected: this._def.value
        });
        return INVALID;
      }
      return { status: "valid", value: input.data };
    }
    get value() {
      return this._def.value;
    }
  };
  ZodLiteral.create = (value, params) => {
    return new ZodLiteral({
      value,
      typeName: ZodFirstPartyTypeKind.ZodLiteral,
      ...processCreateParams(params)
    });
  };
  function createZodEnum(values, params) {
    return new ZodEnum({
      values,
      typeName: ZodFirstPartyTypeKind.ZodEnum,
      ...processCreateParams(params)
    });
  }
  var ZodEnum = class _ZodEnum extends ZodType {
    _parse(input) {
      if (typeof input.data !== "string") {
        const ctx = this._getOrReturnCtx(input);
        const expectedValues = this._def.values;
        addIssueToContext(ctx, {
          expected: util.joinValues(expectedValues),
          received: ctx.parsedType,
          code: ZodIssueCode.invalid_type
        });
        return INVALID;
      }
      if (!this._cache) {
        this._cache = new Set(this._def.values);
      }
      if (!this._cache.has(input.data)) {
        const ctx = this._getOrReturnCtx(input);
        const expectedValues = this._def.values;
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_enum_value,
          options: expectedValues
        });
        return INVALID;
      }
      return OK(input.data);
    }
    get options() {
      return this._def.values;
    }
    get enum() {
      const enumValues = {};
      for (const val of this._def.values) {
        enumValues[val] = val;
      }
      return enumValues;
    }
    get Values() {
      const enumValues = {};
      for (const val of this._def.values) {
        enumValues[val] = val;
      }
      return enumValues;
    }
    get Enum() {
      const enumValues = {};
      for (const val of this._def.values) {
        enumValues[val] = val;
      }
      return enumValues;
    }
    extract(values, newDef = this._def) {
      return _ZodEnum.create(values, {
        ...this._def,
        ...newDef
      });
    }
    exclude(values, newDef = this._def) {
      return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
        ...this._def,
        ...newDef
      });
    }
  };
  ZodEnum.create = createZodEnum;
  var ZodNativeEnum = class extends ZodType {
    _parse(input) {
      const nativeEnumValues = util.getValidEnumValues(this._def.values);
      const ctx = this._getOrReturnCtx(input);
      if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
        const expectedValues = util.objectValues(nativeEnumValues);
        addIssueToContext(ctx, {
          expected: util.joinValues(expectedValues),
          received: ctx.parsedType,
          code: ZodIssueCode.invalid_type
        });
        return INVALID;
      }
      if (!this._cache) {
        this._cache = new Set(util.getValidEnumValues(this._def.values));
      }
      if (!this._cache.has(input.data)) {
        const expectedValues = util.objectValues(nativeEnumValues);
        addIssueToContext(ctx, {
          received: ctx.data,
          code: ZodIssueCode.invalid_enum_value,
          options: expectedValues
        });
        return INVALID;
      }
      return OK(input.data);
    }
    get enum() {
      return this._def.values;
    }
  };
  ZodNativeEnum.create = (values, params) => {
    return new ZodNativeEnum({
      values,
      typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
      ...processCreateParams(params)
    });
  };
  var ZodPromise = class extends ZodType {
    unwrap() {
      return this._def.type;
    }
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.promise,
          received: ctx.parsedType
        });
        return INVALID;
      }
      const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
      return OK(promisified.then((data) => {
        return this._def.type.parseAsync(data, {
          path: ctx.path,
          errorMap: ctx.common.contextualErrorMap
        });
      }));
    }
  };
  ZodPromise.create = (schema, params) => {
    return new ZodPromise({
      type: schema,
      typeName: ZodFirstPartyTypeKind.ZodPromise,
      ...processCreateParams(params)
    });
  };
  var ZodEffects = class extends ZodType {
    innerType() {
      return this._def.schema;
    }
    sourceType() {
      return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
    }
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      const effect = this._def.effect || null;
      const checkCtx = {
        addIssue: (arg) => {
          addIssueToContext(ctx, arg);
          if (arg.fatal) {
            status.abort();
          } else {
            status.dirty();
          }
        },
        get path() {
          return ctx.path;
        }
      };
      checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
      if (effect.type === "preprocess") {
        const processed = effect.transform(ctx.data, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(processed).then(async (processed2) => {
            if (status.value === "aborted")
              return INVALID;
            const result = await this._def.schema._parseAsync({
              data: processed2,
              path: ctx.path,
              parent: ctx
            });
            if (result.status === "aborted")
              return INVALID;
            if (result.status === "dirty")
              return DIRTY(result.value);
            if (status.value === "dirty")
              return DIRTY(result.value);
            return result;
          });
        } else {
          if (status.value === "aborted")
            return INVALID;
          const result = this._def.schema._parseSync({
            data: processed,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        }
      }
      if (effect.type === "refinement") {
        const executeRefinement = (acc) => {
          const result = effect.refinement(acc, checkCtx);
          if (ctx.common.async) {
            return Promise.resolve(result);
          }
          if (result instanceof Promise) {
            throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
          }
          return acc;
        };
        if (ctx.common.async === false) {
          const inner = this._def.schema._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          executeRefinement(inner.value);
          return { status: status.value, value: inner.value };
        } else {
          return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
            if (inner.status === "aborted")
              return INVALID;
            if (inner.status === "dirty")
              status.dirty();
            return executeRefinement(inner.value).then(() => {
              return { status: status.value, value: inner.value };
            });
          });
        }
      }
      if (effect.type === "transform") {
        if (ctx.common.async === false) {
          const base = this._def.schema._parseSync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (!isValid(base))
            return INVALID;
          const result = effect.transform(base.value, checkCtx);
          if (result instanceof Promise) {
            throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
          }
          return { status: status.value, value: result };
        } else {
          return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
            if (!isValid(base))
              return INVALID;
            return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
              status: status.value,
              value: result
            }));
          });
        }
      }
      util.assertNever(effect);
    }
  };
  ZodEffects.create = (schema, effect, params) => {
    return new ZodEffects({
      schema,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect,
      ...processCreateParams(params)
    });
  };
  ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
    return new ZodEffects({
      schema,
      effect: { type: "preprocess", transform: preprocess },
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      ...processCreateParams(params)
    });
  };
  var ZodOptional = class extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType === ZodParsedType.undefined) {
        return OK(void 0);
      }
      return this._def.innerType._parse(input);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
  ZodOptional.create = (type, params) => {
    return new ZodOptional({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodOptional,
      ...processCreateParams(params)
    });
  };
  var ZodNullable = class extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType === ZodParsedType.null) {
        return OK(null);
      }
      return this._def.innerType._parse(input);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
  ZodNullable.create = (type, params) => {
    return new ZodNullable({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodNullable,
      ...processCreateParams(params)
    });
  };
  var ZodDefault = class extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      let data = ctx.data;
      if (ctx.parsedType === ZodParsedType.undefined) {
        data = this._def.defaultValue();
      }
      return this._def.innerType._parse({
        data,
        path: ctx.path,
        parent: ctx
      });
    }
    removeDefault() {
      return this._def.innerType;
    }
  };
  ZodDefault.create = (type, params) => {
    return new ZodDefault({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodDefault,
      defaultValue: typeof params.default === "function" ? params.default : () => params.default,
      ...processCreateParams(params)
    });
  };
  var ZodCatch = class extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const newCtx = {
        ...ctx,
        common: {
          ...ctx.common,
          issues: []
        }
      };
      const result = this._def.innerType._parse({
        data: newCtx.data,
        path: newCtx.path,
        parent: {
          ...newCtx
        }
      });
      if (isAsync(result)) {
        return result.then((result2) => {
          return {
            status: "valid",
            value: result2.status === "valid" ? result2.value : this._def.catchValue({
              get error() {
                return new ZodError(newCtx.common.issues);
              },
              input: newCtx.data
            })
          };
        });
      } else {
        return {
          status: "valid",
          value: result.status === "valid" ? result.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      }
    }
    removeCatch() {
      return this._def.innerType;
    }
  };
  ZodCatch.create = (type, params) => {
    return new ZodCatch({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodCatch,
      catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
      ...processCreateParams(params)
    });
  };
  var ZodNaN = class extends ZodType {
    _parse(input) {
      const parsedType = this._getType(input);
      if (parsedType !== ZodParsedType.nan) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_type,
          expected: ZodParsedType.nan,
          received: ctx.parsedType
        });
        return INVALID;
      }
      return { status: "valid", value: input.data };
    }
  };
  ZodNaN.create = (params) => {
    return new ZodNaN({
      typeName: ZodFirstPartyTypeKind.ZodNaN,
      ...processCreateParams(params)
    });
  };
  var BRAND = Symbol("zod_brand");
  var ZodBranded = class extends ZodType {
    _parse(input) {
      const { ctx } = this._processInputParams(input);
      const data = ctx.data;
      return this._def.type._parse({
        data,
        path: ctx.path,
        parent: ctx
      });
    }
    unwrap() {
      return this._def.type;
    }
  };
  var ZodPipeline = class _ZodPipeline extends ZodType {
    _parse(input) {
      const { status, ctx } = this._processInputParams(input);
      if (ctx.common.async) {
        const handleAsync = async () => {
          const inResult = await this._def.in._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: ctx
          });
          if (inResult.status === "aborted")
            return INVALID;
          if (inResult.status === "dirty") {
            status.dirty();
            return DIRTY(inResult.value);
          } else {
            return this._def.out._parseAsync({
              data: inResult.value,
              path: ctx.path,
              parent: ctx
            });
          }
        };
        return handleAsync();
      } else {
        const inResult = this._def.in._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return {
            status: "dirty",
            value: inResult.value
          };
        } else {
          return this._def.out._parseSync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      }
    }
    static create(a, b) {
      return new _ZodPipeline({
        in: a,
        out: b,
        typeName: ZodFirstPartyTypeKind.ZodPipeline
      });
    }
  };
  var ZodReadonly = class extends ZodType {
    _parse(input) {
      const result = this._def.innerType._parse(input);
      const freeze = (data) => {
        if (isValid(data)) {
          data.value = Object.freeze(data.value);
        }
        return data;
      };
      return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
    }
    unwrap() {
      return this._def.innerType;
    }
  };
  ZodReadonly.create = (type, params) => {
    return new ZodReadonly({
      innerType: type,
      typeName: ZodFirstPartyTypeKind.ZodReadonly,
      ...processCreateParams(params)
    });
  };
  function cleanParams(params, data) {
    const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
    const p2 = typeof p === "string" ? { message: p } : p;
    return p2;
  }
  function custom(check, _params = {}, fatal) {
    if (check)
      return ZodAny.create().superRefine((data, ctx) => {
        var _a, _b;
        const r = check(data);
        if (r instanceof Promise) {
          return r.then((r2) => {
            var _a2, _b2;
            if (!r2) {
              const params = cleanParams(_params, data);
              const _fatal = (_b2 = (_a2 = params.fatal) != null ? _a2 : fatal) != null ? _b2 : true;
              ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
            }
          });
        }
        if (!r) {
          const params = cleanParams(_params, data);
          const _fatal = (_b = (_a = params.fatal) != null ? _a : fatal) != null ? _b : true;
          ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
        }
        return;
      });
    return ZodAny.create();
  }
  var late = {
    object: ZodObject.lazycreate
  };
  var ZodFirstPartyTypeKind;
  (function(ZodFirstPartyTypeKind2) {
    ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
    ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
    ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
    ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
    ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
    ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
    ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
    ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
    ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
    ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
    ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
    ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
    ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
    ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
    ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
    ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
    ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
    ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
    ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
    ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
    ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
    ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
    ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
    ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
    ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
    ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
    ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
    ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
    ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
    ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
    ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
    ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
    ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
    ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
    ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
    ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
  })(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
  var instanceOfType = (cls, params = {
    message: `Input not instance of ${cls.name}`
  }) => custom((data) => data instanceof cls, params);
  var stringType = ZodString.create;
  var numberType = ZodNumber.create;
  var nanType = ZodNaN.create;
  var bigIntType = ZodBigInt.create;
  var booleanType = ZodBoolean.create;
  var dateType = ZodDate.create;
  var symbolType = ZodSymbol.create;
  var undefinedType = ZodUndefined.create;
  var nullType = ZodNull.create;
  var anyType = ZodAny.create;
  var unknownType = ZodUnknown.create;
  var neverType = ZodNever.create;
  var voidType = ZodVoid.create;
  var arrayType = ZodArray.create;
  var objectType = ZodObject.create;
  var strictObjectType = ZodObject.strictCreate;
  var unionType = ZodUnion.create;
  var discriminatedUnionType = ZodDiscriminatedUnion.create;
  var intersectionType = ZodIntersection.create;
  var tupleType = ZodTuple.create;
  var recordType = ZodRecord.create;
  var mapType = ZodMap.create;
  var setType = ZodSet.create;
  var functionType = ZodFunction.create;
  var lazyType = ZodLazy.create;
  var literalType = ZodLiteral.create;
  var enumType = ZodEnum.create;
  var nativeEnumType = ZodNativeEnum.create;
  var promiseType = ZodPromise.create;
  var effectsType = ZodEffects.create;
  var optionalType = ZodOptional.create;
  var nullableType = ZodNullable.create;
  var preprocessType = ZodEffects.createWithPreprocess;
  var pipelineType = ZodPipeline.create;
  var ostring = () => stringType().optional();
  var onumber = () => numberType().optional();
  var oboolean = () => booleanType().optional();
  var coerce = {
    string: (arg) => ZodString.create({ ...arg, coerce: true }),
    number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
    boolean: (arg) => ZodBoolean.create({
      ...arg,
      coerce: true
    }),
    bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
    date: (arg) => ZodDate.create({ ...arg, coerce: true })
  };
  var NEVER = INVALID;

  // src/data/schemas.ts
  var CandidateSchema = external_exports.object({
    to: external_exports.string(),
    category: external_exports.enum(["safe", "surprise", "emotional"]),
    strength: external_exports.number(),
    cadence: external_exports.string().nullable(),
    feelings: external_exports.array(external_exports.string()),
    note: external_exports.string()
  });
  var TransitionsSchema = external_exports.object({
    major: external_exports.record(external_exports.array(CandidateSchema)),
    minor: external_exports.record(external_exports.array(CandidateSchema))
  });
  var FeelingsSchema = external_exports.object({
    feelings: external_exports.record(
      external_exports.object({
        zh: external_exports.string(),
        desc: external_exports.string().optional(),
        energy: external_exports.number().optional(),
        valence: external_exports.number().optional(),
        colorGroup: external_exports.string().optional()
      })
    )
  });
  var GenresSchema = external_exports.object({
    genres: external_exports.record(
      external_exports.object({
        zh: external_exports.string(),
        chordQuality: external_exports.string(),
        favorTransitions: external_exports.array(external_exports.string()),
        favorBorrowed: external_exports.array(external_exports.string()),
        scaleDefaults: external_exports.array(external_exports.string()),
        tempo: external_exports.tuple([external_exports.number(), external_exports.number()]),
        signatureProgressionIds: external_exports.array(external_exports.string()),
        voicingNotes: external_exports.string()
      })
    )
  });
  var ProgressionsSchema = external_exports.object({
    progressions: external_exports.record(
      external_exports.object({
        name: external_exports.string(),
        roman: external_exports.array(external_exports.string()),
        mode: external_exports.enum(["major", "minor"]),
        meter: external_exports.enum(["4/4", "3/4", "6/8"]).optional(),
        genres: external_exports.array(external_exports.string()),
        feeling: external_exports.array(external_exports.string()),
        use: external_exports.string(),
        note: external_exports.string()
      })
    )
  });
  var SectionsSchema = external_exports.object({
    sections: external_exports.record(
      external_exports.object({
        zh: external_exports.string(),
        energy: external_exports.number(),
        harmonyGuidance: external_exports.string(),
        density: external_exports.string(),
        melodyRange: external_exports.string(),
        vocalTip: external_exports.string(),
        examples: external_exports.array(external_exports.array(external_exports.string()))
      })
    )
  });
  var ScalesSchema = external_exports.object({
    scales: external_exports.record(
      external_exports.object({
        zh: external_exports.string(),
        intervals: external_exports.array(external_exports.number()),
        mood: external_exports.string(),
        guitarPattern: external_exports.string()
      })
    ),
    chordScaleMap: external_exports.record(
      external_exports.object({ scales: external_exports.array(external_exports.string()), note: external_exports.string() }).or(external_exports.any())
    )
  });
  var MeterPatternsSchema = external_exports.object({
    timeSignatures: external_exports.record(
      external_exports.object({
        zh: external_exports.string(),
        beats: external_exports.number(),
        beatUnit: external_exports.number(),
        grouping: external_exports.array(external_exports.number()).nullable(),
        accents: external_exports.array(external_exports.number())
      })
    ),
    subdivisions: external_exports.record(external_exports.object({ zh: external_exports.string(), perBeat: external_exports.number() })),
    accentLevels: external_exports.record(external_exports.object({ zh: external_exports.string(), sound: external_exports.string(), volume: external_exports.number() }))
  });
  var DrumPatternsSchema = external_exports.object({
    kit: external_exports.record(
      external_exports.object({
        zh: external_exports.string(),
        gm: external_exports.number(),
        group: external_exports.enum(["cymbal", "drum", "perc"]).optional(),
        order: external_exports.number().optional()
      })
    ),
    patterns: external_exports.record(
      external_exports.object({
        name: external_exports.string(),
        role: external_exports.enum(["basic", "verse", "chorus", "variation", "fill"]).optional(),
        genres: external_exports.array(external_exports.string()),
        steps: external_exports.number(),
        swing: external_exports.number(),
        feel: external_exports.string(),
        tempo: external_exports.tuple([external_exports.number(), external_exports.number()]),
        pattern: external_exports.record(external_exports.string()),
        note: external_exports.string()
      })
    )
  });
  var RhythmPatternsSchema = external_exports.object({
    patterns: external_exports.record(
      external_exports.object({
        name: external_exports.string(),
        type: external_exports.enum(["strum", "comp", "bass", "finger"]),
        genres: external_exports.array(external_exports.string()),
        steps: external_exports.number(),
        feel: external_exports.string(),
        tempo: external_exports.tuple([external_exports.number(), external_exports.number()]),
        pattern: external_exports.string(),
        note: external_exports.string()
      })
    )
  });
  var InstrumentsSchema = external_exports.object({
    referencePitch: external_exports.object({ default: external_exports.number(), min: external_exports.number(), max: external_exports.number(), unit: external_exports.string() }),
    instruments: external_exports.record(external_exports.any()),
    tunerPresets: external_exports.record(
      external_exports.object({
        zh: external_exports.string(),
        instrument: external_exports.string(),
        strings: external_exports.array(external_exports.object({ name: external_exports.string(), hz: external_exports.number() })).nullable()
      })
    )
  });
  var FrequencyGuideSchema = external_exports.object({
    bands: external_exports.array(
      external_exports.object({ id: external_exports.string(), range: external_exports.tuple([external_exports.number(), external_exports.number()]), zh: external_exports.string(), lives: external_exports.string(), watch: external_exports.string() })
    ),
    instruments: external_exports.record(external_exports.any())
  });
  var VoicingIdeasSchema = external_exports.object({
    voicingIdeas: external_exports.record(
      external_exports.object({
        name: external_exports.string(),
        idea: external_exports.string(),
        how: external_exports.string(),
        // 六弦示意按法(低→高，-1 悶弦／0 空弦／n 品)；開放調弦文字卡設 null。
        demoFrets: external_exports.array(external_exports.number().int().min(-1).max(24)).length(6).nullable(),
        context: external_exports.string(),
        tuning: external_exports.enum(["standard", "drop_d", "dadgad"]).default("standard"),
        // 試聽時要套用的 capo 格數(docs/30 B1);只有 capo-color 這類「demoFrets 是開放指型、
        // 實際發聲靠夾 capo 位移」的卡需要非 0，其餘卡預設 0(不影響試聽)。
        previewCapo: external_exports.number().int().min(0).max(12).default(0),
        // 前後對照用的「改之前」按法(docs/31 J6)；規則同 demoFrets，選填，只有需要對照教學的
        // 卡才有值(如 sus4-hold 對照普通大三和弦)；固定不套 previewCapo，試聽一律 capo=0。
        beforeFrets: external_exports.array(external_exports.number().int().min(-1).max(24)).length(6).nullable().optional()
      })
    )
  });
  var MixReferenceSchema = external_exports.object({
    loudnessTargets: external_exports.record(external_exports.any()),
    compressionStarters: external_exports.record(external_exports.any()),
    reverbTypes: external_exports.array(external_exports.object({ id: external_exports.string(), zh: external_exports.string(), use: external_exports.string() })),
    reverbTip: external_exports.string(),
    mixWorkflow: external_exports.array(external_exports.string()),
    masteringChecklist: external_exports.array(external_exports.string()),
    glossary: external_exports.record(external_exports.string())
  });

  // src/data/index.ts
  var transitions = TransitionsSchema.parse(transitions_default);
  var feelings = FeelingsSchema.parse(feelings_default);
  var genres = GenresSchema.parse(genres_default);
  var progressions = ProgressionsSchema.parse(progressions_default);
  var sections = SectionsSchema.parse(sections_default);
  var scales = ScalesSchema.parse(scales_default);
  var meterPatterns = MeterPatternsSchema.parse(meter_patterns_default);
  var drumPatterns = DrumPatternsSchema.parse(drum_patterns_default);
  var rhythmPatterns = RhythmPatternsSchema.parse(rhythm_patterns_default);
  var instruments = InstrumentsSchema.parse(instruments_default);
  var frequencyGuide = FrequencyGuideSchema.parse(frequency_guide_default);
  var mixReference = MixReferenceSchema.parse(mix_reference_default);
  var voicingIdeas = VoicingIdeasSchema.parse(voicing_ideas_default);
  var voicingIdeasList = Object.entries(voicingIdeas.voicingIdeas).map(([id, v]) => ({ id, ...v }));
  var genreList = Object.entries(genres.genres).map(([id, g]) => ({
    id,
    zh: g.zh,
    tempo: g.tempo,
    signatureProgressionIds: g.signatureProgressionIds
  }));
  function progressionsFor(genreId, mode) {
    return Object.entries(progressions.progressions).filter(([, p]) => (!genreId || p.genres.includes(genreId)) && (!mode || p.mode === mode)).map(([id, p]) => ({ id, ...p }));
  }
  var sectionList = Object.entries(sections.sections).map(([id, s]) => ({ id, ...s }));
  var DRUM_ROLE_RANK = { basic: 0, verse: 1, chorus: 2, variation: 3, fill: 4 };
  function drumPatternsFor(genreId) {
    const list = Object.entries(drumPatterns.patterns).filter(([, p]) => !genreId || p.genres.includes(genreId)).map(([id, p]) => ({ id, ...p }));
    if (!genreId) return list;
    return list.sort((a, b) => {
      var _a, _b, _c, _d;
      const own = (a.genres[0] === genreId ? 0 : 1) - (b.genres[0] === genreId ? 0 : 1);
      if (own !== 0) return own;
      return ((_b = DRUM_ROLE_RANK[(_a = a.role) != null ? _a : "basic"]) != null ? _b : 9) - ((_d = DRUM_ROLE_RANK[(_c = b.role) != null ? _c : "basic"]) != null ? _d : 9);
    });
  }

  // src/nativeBridge.ts
  var feelingList = Object.entries(feelings.feelings).map(([id, f]) => ({ id, zh: f.zh }));
  var fns = {
    keyChords: (key, mode) => keyChords(key, mode),
    extendChord: (roman, key, mode, level) => extendChord(roman, key, mode, level),
    // 樂譜用:吉他六弦把位(低→高,null=悶弦)
    guitarFrets: (roman, key, mode, level = "triad") => {
      const ch = extendChord(roman, key, mode, level);
      return guitarShape(ch.notes, tuningOf("standard"), 0).map((s) => s.fret);
    },
    // 反查:六弦把位(低→高,-1/null=悶弦)→ 和弦名候選(自訂按法用)
    detectChordFromFrets: (frets, tuningId, capo = 0) => detectChordFromFrets(frets, tuningId, capo),
    // 文件式寫歌(docs/17):和弦符號 ↔ 羅馬級數 / 符號直接取 MIDI
    symbolToRoman: (symbol, key, mode) => symbolToRoman(symbol, key, mode),
    chordMidiFromSymbol: (symbol, octave2 = 4) => chordMidiFromSymbol(symbol, octave2),
    progressionsFor: (genreId) => progressionsFor(genreId),
    genreList: () => genreList,
    drumPatternsFor: (genreId) => drumPatternsFor(genreId),
    feelings: () => feelingList,
    voicingIdeas: () => voicingIdeasList
  };
  function call(name2, argsJson) {
    const args = argsJson ? JSON.parse(argsJson) : [];
    const fn = fns[name2];
    if (!fn) throw new Error("unknown engine fn: " + name2);
    return JSON.stringify(fn(...args));
  }
  globalThis.ChordEngine = { call };
})();
