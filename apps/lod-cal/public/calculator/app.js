(function () {
  const onOff = ["Off", "On"];
  const focusOptions = ["Off", "일반", "업글"];
  const dummyFocusOptions = ["Off", "집중(전사)", "변신마스터", "정신집중(도가)"];
  const zeroToThree = [0, 1, 2, 3];
  const zeroToSix = [0, 1, 2, 3, 4, 5, 6];
  const zeroToTenUpgrade = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "업글"];
  const jobTypes = ["순수", "도전", "직전/법전"];
  const madTypes = ["일반", "업글"];
  const hordeOptions = ["Off", "호드목", "나겔목"];
  const curses = ["없음", "데프", "프라보", "어각", "아나테마"];
  const crasherElements = ["숲철공", "속공", "생암", "생(암)공", "암방", "암암(반속)", "중립속성"];
  const meteorElements = ["숲철공", "속공", "생암", "생(암)공", "암방", "암암(반속)", "중립속성"];
  const reverseElements = ["숲철공", "속공", "생암", "생(암)공", "암방", "암암(반속)", "중립속성"];
  const coefficientElements = [
    { value: "생암", label: "생암" },
    { value: "암암(반속)", label: "암암" },
    { value: "암방", label: "속암" },
  ];
  const coefficientStats = [
    { key: "str", label: "힘" },
    { key: "con", label: "콘" },
    { key: "dex", label: "덱스" },
    { key: "int", label: "인트" },
    { key: "damage", label: "DAM" },
  ];
  const coefficientOperators = [
    { key: "multiply", label: "곱연산" },
    { key: "sum", label: "합연산" },
  ];
  const elementNameMap = { 수토공: "속공", 생공: "생(암)공", 속암: "암방", 암암: "암암(반속)" };
  const hotTimes = ["Off", "평일", "주말"];
  const skillKeys = ["crasher", "martial", "meteor"];
  const tabKeys = [...skillKeys, "dummy"];
  const physicalSkillKeys = new Set(["crasher", "martial"]);
  const skillLabels = { crasher: "전사", martial: "무도가", meteor: "메테오", dummy: "허수아비" };
  const reverseDebuffs = ["호르/자보", "콜라마", "매프"];
  const reverseBuffs = ["속강", "집중", "나르", "트랩"];
  const reverseDummyAcFactors = [
    { key: "rings", label: "반지" },
    { key: "curse", label: "저주" },
    { key: "arc", label: "아크" },
    { key: "abre", label: "아브" },
    { key: "ambush", label: "기습" },
  ];
  const reverseDummyBuffFactors = [
    { key: "elementBoost", label: "속강" },
    { key: "move", label: "움" },
    { key: "focus", label: "집중" },
    { key: "trap", label: "트랩" },
    { key: "nar", label: "나르" },
  ];
  const meteorCastMana = 12960;
  const crasherNagelringShotHp = 10300000;
  const resultFontScales = [100, 85, 70];
  const crasherDamageKeys = ["mad", "crasher", "fury", "downFourWay", "jobSkill"];
  const martialDamageKeys = ["dara", "guyang", "whirlwind", "punggak", "dangak", "jiyeol"];
  const martialKickOptions = [4, 10, "업글"];
  const martialWindOptions = [2, 10, "업글"];
  const martialDaraManaModes = ["풀마", "1틱"];
  const martialBaseCoefficients = {
    tail: 3.04702800361337,
    jiyeol: 2.085980126467931,
    wind: 1.564489611562782,
    scratch: 1.303739837398374,
    hawk: 1.117488708220416,
    combo: 0.670487804878049,
    dual: 0.2607407407407407,
  };
  const martialUpgradeCoefficients = {
    dangakLevel: 20.81838,
    punggakLevel: 30.52726,
    whirlwindLevel: 19.423302,
    jiyeolLevel: 23.25,
  };
  const martialTechniqueDefs = [
    { key: "daraLevel", damageKey: "dara", label: "다라", type: "fixed" },
    { key: "guyangLevel", damageKey: "guyang", label: "구양", type: "fixed" },
    { key: "whirlwindLevel", damageKey: "whirlwind", label: "선풍", type: "select", options: martialWindOptions },
    { key: "punggakLevel", damageKey: "punggak", label: "붕각", type: "select", options: martialKickOptions },
    { key: "dangakLevel", damageKey: "dangak", label: "단각", type: "select", options: martialKickOptions },
    { key: "jiyeolLevel", damageKey: "jiyeol", label: "지열", type: "select", options: martialWindOptions },
  ];
  const martialInputTechniqueDefs = martialTechniqueDefs.filter((technique) => technique.type !== "fixed");

  const curseValueCrasher = { 없음: 0, 데프: 50, 프라보: 65, 어각: 70, 아나테마: 75 };
  const curseValueMeteor = { 없음: 0, 데프: 50, 프라보: 65, 어각: 70, 아나테마: 75 };
  const meditationTable = {
    1: { time: 6, recovery: 0.4 },
    2: { time: 8, recovery: 0.5 },
    3: { time: 10, recovery: 0.6 },
    4: { time: 12, recovery: 0.7 },
    5: { time: 14, recovery: 0.8 },
    6: { time: 16, recovery: 0.9 },
    7: { time: 18, recovery: 1 },
    8: { time: 20, recovery: 1.4 },
    9: { time: 22, recovery: 2.1 },
    10: { time: 24, recovery: 3 },
  };

  const crasherMonsterRows = [
    { section: "나겔링", name: "뱀", ac: -153, kind: "normal" },
    { section: "나겔링", name: "벌", ac: -156, kind: "normal" },
    { section: "나겔링", name: "멘티스", ac: -159, kind: "normal" },
    { section: "나겔링", name: "늑대", ac: -162, kind: "normal" },
    { section: "나겔링", name: "늑대인간", ac: -166, kind: "normal" },
    { section: "나겔링", name: "고블린", ac: -181, kind: "normal" },
    { section: "나겔링", name: "슈리커", ac: -186, kind: "normal" },
    { section: "나겔링", name: "에인트", ac: -191, kind: "normal" },
    { section: "보스", name: "발록", ac: -210, kind: "boss" },
    { section: "연습장", name: "허수아비", ac: 100, kind: "dummy" },
  ];

  const meteorMonsterRows = [
    { section: "백유", name: "백유고층", ac: -8, kind: "normal" },
    { section: "나겔링", name: "뱀", ac: -153, kind: "normal" },
    { section: "나겔링", name: "벌", ac: -156, kind: "normal" },
    { section: "나겔링", name: "멘티스", ac: -159, kind: "normal" },
    { section: "나겔링", name: "늑대", ac: -162, kind: "normal" },
    { section: "나겔링", name: "늑대인간", ac: -166, kind: "normal" },
    { section: "나겔링", name: "고블린", ac: -181, kind: "normal" },
    { section: "나겔링", name: "슈리커", ac: -186, kind: "normal" },
    { section: "나겔링", name: "에인트", ac: -191, kind: "normal" },
    { section: "연습장", name: "허수아비", ac: 100, kind: "dummy" },
  ];

  const baekyuMonsterInfoRows = [
    { zone: 1, name: "로밍래더", hp: 404997, nature: "일반" },
    { zone: 1, name: "로밍체어", hp: 435216, nature: "일반" },
    { zone: 2, name: "레아로", hp: 221386, nature: "일반" },
    { zone: 2, name: "로밍스테츄", hp: "몰라", nature: "일반" },
    { zone: 3, name: "부", hp: 504150, nature: "일반" },
    { zone: 3, name: "미리테이블", hp: 425654, nature: "일반" },
    { zone: 4, name: "드랜스부", hp: 499773, nature: "암" },
    { zone: 4, name: "부", hp: 416184, nature: "일반" },
    { zone: 5, name: "스파시에", hp: 534045, nature: "일반" },
    { zone: 5, name: "드랜스부", hp: 523849, nature: "암" },
    { zone: 6, name: "스파시에", hp: 518075, nature: "일반" },
    { zone: 6, name: "세파시에", hp: 548873, nature: "일반" },
    { zone: 7, name: "세파시에", hp: 528207, nature: "일반" },
    { zone: 7, name: "큐벅스", hp: 525735, nature: "일반" },
    { zone: 8, name: "큐벅스", hp: 500307, nature: "일반" },
    { zone: 8, name: "큐브롬", hp: 554426, nature: "일반" },
    { zone: 8, name: "큐레스", hp: 631445, nature: "일반" },
    { zone: 9, name: "큐레스", hp: 582134, nature: "일반" },
    { zone: 9, name: "큐브롬", hp: 554426, nature: "일반" },
    { zone: 9, name: "큐립스", hp: 582730, nature: "일반" },
    { zone: 10, name: "큐립스", hp: 582730, nature: "일반" },
    { zone: 10, name: "엘리자벳", hp: 654763, nature: "암" },
    { zone: 10, name: "큐레스", hp: 582134, nature: "일반" },
    { zone: 11, name: "엘리자벳", hp: 654763, nature: "암" },
    { zone: 11, name: "조안", hp: 654732, nature: "암" },
    { zone: 11, name: "큐립스", hp: 582730, nature: "일반" },
    { zone: 12, name: "조나단", hp: 1637309, nature: "암" },
  ];

  const factorLabels = {
    ac: "AC가중치",
    damage: "데미지증가",
    buff: "버프가중치",
    hot: "핫타임",
    spirit: "정령",
  };

  const crasherDefs = [
    { section: "기본" },
    { key: "jobType", label: "전직", type: "select", options: jobTypes },
    { key: "ability", label: "어빌", type: "number" },
    { key: "basePhysical", label: "무장체", type: "number" },
    { key: "str", label: "힘", type: "number" },
    { key: "con", label: "콘", type: "number" },
    { section: "기술" },
    { key: "madType", label: "매드", type: "select", options: madTypes },
    { key: "furyLevel", label: "퓨리", type: "select", options: zeroToTenUpgrade },
    { key: "dashLevel", label: "대쉬", type: "select", options: zeroToTenUpgrade },
    { key: "downFourWayLevel", label: "내려/사방", type: "select", options: zeroToTenUpgrade },
    { section: "장비 - 에테르 강화 수치 입력" },
    { key: "ring1", label: "반지1", type: "number", factors: ["ac"] },
    { key: "ring2", label: "반지2", type: "number", factors: ["ac"] },
    { key: "weapon", label: "무기", type: "number", factors: ["damage"] },
    { key: "acc1", label: "악세1", type: "number", factors: ["damage"] },
    { key: "acc2", label: "악세2", type: "number", factors: ["damage"] },
    { key: "extraElement", label: "이펙트", type: "number", factors: ["buff"] },
    { key: "horde", label: "호드/나겔목", type: "select", options: hordeOptions, factors: ["buff"] },
    { section: "AC가중치" },
    { key: "curse", label: "저주", type: "select", options: curses, factors: ["ac"] },
    { key: "arc", label: "아크", type: "select", options: zeroToThree, factors: ["ac"] },
    { key: "abre", label: "아브", type: "select", options: zeroToThree, factors: ["ac"] },
    { key: "ambush", label: "기습", type: "select", options: onOff, factors: ["ac"] },
    { section: "버프가중치" },
    { key: "elementBoost", label: "속강", type: "select", options: onOff, factors: ["buff"] },
    { key: "elementAttack", label: "속성(공방)", type: "select", options: crasherElements, factors: ["buff"] },
    { key: "move", label: "움(렙)", type: "select", options: zeroToSix, factors: ["buff"] },
    { key: "focus", label: "집중", type: "select", options: onOff, factors: ["buff"] },
    { key: "trap", label: "트랩", type: "select", options: onOff, factors: ["buff"] },
    { key: "nar", label: "나르", type: "select", options: onOff, factors: ["buff"] },
    { section: "기타" },
    { key: "hotTime", label: "핫타임", type: "select", options: hotTimes, factors: ["hot"] },
    { key: "spirit", label: "정령", type: "number", factors: ["spirit"] },
  ];

  const meteorDefs = [
    { section: "기본" },
    { key: "ability", label: "어빌", type: "number" },
    { key: "baseMagic", label: "무장마", type: "number" },
    { key: "meditation", label: "메디", type: "number" },
    { section: "장비 - 에테르 강화 수치 입력" },
    { key: "manaReduction", label: "마나감소", type: "number" },
    { key: "earring", label: "귀걸이", type: "number" },
    { key: "ring1", label: "반지1", type: "number", factors: ["ac"] },
    { key: "ring2", label: "반지2", type: "number", factors: ["ac"] },
    { key: "weapon", label: "무기", type: "number", factors: ["damage"] },
    { key: "acc1", label: "악세1", type: "number", factors: ["damage"] },
    { key: "acc2", label: "악세2", type: "number", factors: ["damage"] },
    { key: "extraElement", label: "이펙트", type: "number", factors: ["buff"] },
    { key: "horde", label: "호드/나겔목", type: "select", options: hordeOptions, factors: ["buff"] },
    { section: "AC가중치" },
    { key: "curse", label: "저주", type: "select", options: curses, factors: ["ac"] },
    { key: "arc", label: "아크", type: "select", options: zeroToThree, factors: ["ac"] },
    { key: "abre", label: "아브", type: "select", options: zeroToThree, factors: ["ac"] },
    { key: "ambush", label: "기습", type: "select", options: onOff, factors: ["ac"] },
    { section: "버프가중치" },
    { key: "elementBoost", label: "속강", type: "select", options: onOff, factors: ["buff"] },
    { key: "elementAttack", label: "속성(공방)", type: "select", options: meteorElements, factors: ["buff"] },
    { key: "trap", label: "트랩", type: "select", options: onOff, factors: ["buff"] },
    { key: "nar", label: "나르", type: "select", options: onOff, factors: ["buff"] },
    { section: "기타" },
    { key: "hotTime", label: "핫타임", type: "select", options: hotTimes, factors: ["hot"] },
    { key: "spirit", label: "정령", type: "number", factors: ["spirit"] },
  ];

  const martialDefs = [
    { section: "기본" },
    { key: "ability", label: "어빌", type: "number" },
    { key: "basePhysical", label: "무장체", type: "number" },
    { key: "baseMagic", label: "무장마", type: "number" },
    { key: "str", label: "힘", type: "number" },
    { key: "con", label: "콘", type: "number" },
    { section: "기술" },
    ...martialInputTechniqueDefs,
    { section: "장비 - 에테르 강화 수치 입력" },
    { key: "ring1", label: "반지1", type: "number", factors: ["ac"] },
    { key: "ring2", label: "반지2", type: "number", factors: ["ac"] },
    { key: "weapon", label: "무기", type: "number", factors: ["damage"] },
    { key: "acc1", label: "악세1", type: "number", factors: ["damage"] },
    { key: "acc2", label: "악세2", type: "number", factors: ["damage"] },
    { key: "extraElement", label: "이펙트", type: "number", factors: ["buff"] },
    { key: "horde", label: "호드/나겔목", type: "select", options: hordeOptions, factors: ["buff"] },
    { section: "AC가중치" },
    { key: "curse", label: "저주", type: "select", options: curses, factors: ["ac"] },
    { key: "arc", label: "아크", type: "select", options: zeroToThree, factors: ["ac"] },
    { key: "abre", label: "아브", type: "select", options: zeroToThree, factors: ["ac"] },
    { key: "ambush", label: "기습", type: "select", options: onOff, factors: ["ac"] },
    { section: "버프가중치" },
    { key: "elementBoost", label: "속강", type: "select", options: onOff, factors: ["buff"] },
    { key: "elementAttack", label: "속성(공방)", type: "select", options: crasherElements, factors: ["buff"] },
    { key: "move", label: "움(렙)", type: "select", options: zeroToSix, factors: ["buff"] },
    { key: "focus", label: "집중", type: "select", options: focusOptions, factors: ["buff"] },
    { key: "trap", label: "트랩", type: "select", options: onOff, factors: ["buff"] },
    { key: "nar", label: "나르", type: "select", options: onOff, factors: ["buff"] },
    { section: "기타" },
    { key: "hotTime", label: "핫타임", type: "select", options: hotTimes, factors: ["hot"] },
    { key: "spirit", label: "정령", type: "number", factors: ["spirit"] },
  ];

  const dummyDefs = [
    { section: "기본" },
    { key: "ability", label: "어빌", type: "number" },
    { key: "basePhysical", label: "무장체", type: "number" },
    { key: "baseMagic", label: "무장마", type: "number" },
    { key: "weaponMin", label: "무기 민뎀", type: "number" },
    { key: "weaponMax", label: "무기 맥뎀", type: "number" },
    { key: "str", label: "힘", type: "number" },
    { key: "con", label: "콘", type: "number" },
    { key: "dex", label: "덱스", type: "number" },
    { key: "int", label: "인트", type: "number" },
    { key: "damage", label: "DAM", type: "number" },
    { section: "장비 - 에테르 강화 수치 입력" },
    { key: "ring1", label: "반지1", type: "number", factors: ["ac"] },
    { key: "ring2", label: "반지2", type: "number", factors: ["ac"] },
    { key: "weapon", label: "무기", type: "number", factors: ["damage"] },
    { key: "acc1", label: "악세1", type: "number", factors: ["damage"] },
    { key: "acc2", label: "악세2", type: "number", factors: ["damage"] },
    { key: "extraElement", label: "이펙트", type: "number", factors: ["buff"] },
    { key: "horde", label: "호드/나겔목", type: "select", options: hordeOptions, factors: ["buff"] },
    { section: "AC가중치" },
    { key: "curse", label: "저주", type: "select", options: curses, factors: ["ac"] },
    { key: "arc", label: "아크", type: "select", options: zeroToThree, factors: ["ac"] },
    { key: "abre", label: "아브", type: "select", options: zeroToThree, factors: ["ac"] },
    { key: "ambush", label: "기습", type: "select", options: onOff, factors: ["ac"] },
    { section: "버프가중치" },
    { key: "elementBoost", label: "속강", type: "select", options: onOff, factors: ["buff"] },
    { key: "elementAttack", label: "속성(공방)", type: "select", options: crasherElements, factors: ["buff"] },
    { key: "move", label: "움(렙)", type: "select", options: zeroToSix, factors: ["buff"] },
    { key: "focus", label: "집중", type: "select", options: dummyFocusOptions, factors: ["buff"] },
    { key: "trap", label: "트랩", type: "select", options: onOff, factors: ["buff"] },
    { key: "nar", label: "나르", type: "select", options: onOff, factors: ["buff"] },
    { section: "기타" },
    { key: "hotTime", label: "핫타임", type: "select", options: hotTimes, factors: ["hot"] },
    { key: "spirit", label: "정령", type: "number", factors: ["spirit"] },
  ];

  const defaults = {
    crasher: {
      specs: {
        jobType: "순수",
        madType: "일반",
        furyLevel: 0,
        dashLevel: 0,
        downFourWayLevel: 0,
        ability: 201,
        basePhysical: 1000000,
        str: 180,
        con: 180,
        ring1: 0,
        ring2: 0,
        weapon: 0,
        acc1: 0,
        acc2: 0,
        elementBoost: "Off",
        elementAttack: "숲철공",
        move: 0,
        curse: "없음",
        arc: 0,
        abre: 0,
        ambush: "Off",
        focus: "Off",
        trap: "Off",
        nar: "Off",
        hotTime: "Off",
        spirit: 0,
        extraElement: 0,
        horde: "Off",
      },
      conv: { flatPhysical: 0, strConverted: 0, conConverted: 0 },
    },
    martial: {
      specs: {
        daraLevel: "업글",
        guyangLevel: "일반",
        whirlwindLevel: "업글",
        punggakLevel: "업글",
        dangakLevel: "업글",
        jiyeolLevel: "업글",
        ability: 201,
        basePhysical: 1000000,
        baseMagic: 1000000,
        str: 180,
        con: 180,
        ring1: 0,
        ring2: 0,
        weapon: 0,
        acc1: 0,
        acc2: 0,
        elementBoost: "Off",
        elementAttack: "숲철공",
        move: 0,
        curse: "없음",
        arc: 0,
        abre: 0,
        ambush: "Off",
        focus: "Off",
        trap: "Off",
        nar: "Off",
        hotTime: "Off",
        spirit: 0,
        extraElement: 0,
        horde: "Off",
      },
      conv: { flatPhysical: 0, strConverted: 0, conConverted: 0 },
      daraManaMode: "풀마",
    },
    meteor: {
      specs: {
        ability: 201,
        baseMagic: 1000000,
        meditation: 0,
        oneTick: 0,
        oneTickPlusMedi: 0,
        earring: 0,
        ring1: 0,
        ring2: 0,
        weapon: 0,
        acc1: 0,
        acc2: 0,
        elementBoost: "Off",
        elementAttack: "숲철공",
        curse: "없음",
        manaReduction: 0,
        arc: 0,
        abre: 0,
        ambush: "Off",
        focus: "Off",
        trap: "Off",
        nar: "Off",
        hotTime: "Off",
        spirit: 0,
        extraElement: 0,
        horde: "Off",
      },
      conv: { castMana: meteorCastMana },
    },
  };

  const state = {
    skill: "crasher",
    crasher: freshSkillState("crasher"),
    martial: freshSkillState("martial"),
    meteor: freshSkillState("meteor"),
    dummy: defaultDummyState(),
  };
  const storageKey = "darkAgesDamageCalculator.v1";

  function freshSkillState(skill) {
    return {
      specs: structuredClone(defaults[skill].specs),
      specManual: {},
      convManual: {},
      customMonsters: [],
      sectionOrder: defaultSectionOrder(skill),
      collapsedSections: [],
      reverse: defaultReverseState(skill),
      downFourWay: defaultDownFourWayState(),
      dashStacks: 1,
      resultFontScale: 100,
      ...(skill === "crasher" ? { damageIncludes: defaultCrasherDamageIncludes() } : {}),
      ...(skill === "martial" ? { damageIncludes: defaultMartialDamageIncludes(), daraManaMode: defaults.martial.daraManaMode } : {}),
    };
  }

  function defaultCrasherDamageIncludes() {
    return crasherDamageKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {});
  }

  function normalizeCrasherDamageIncludes(value) {
    const defaults = defaultCrasherDamageIncludes();
    if (!value || typeof value !== "object") return defaults;
    return crasherDamageKeys.reduce((acc, key) => {
      acc[key] = value[key] !== false;
      return acc;
    }, {});
  }

  function defaultMartialDamageIncludes() {
    return martialDamageKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {});
  }

  function normalizeMartialDamageIncludes(value) {
    const defaults = defaultMartialDamageIncludes();
    if (!value || typeof value !== "object") return defaults;
    return martialDamageKeys.reduce((acc, key) => {
      acc[key] = value[key] !== false;
      return acc;
    }, {});
  }

  function defaultDownFourWayState() {
    return {
      furyDamage: "",
      fourWayDamage: "",
      downDamage: "",
    };
  }

  function defaultReverseState(skill) {
    return {
      dummyDamage: "",
      dummyAttackElement: defaults[skill].specs.elementAttack,
      dummyAcFactors: ["rings"],
      dummyBuffFactors: reverseDummyBuffFactors.map((factor) => factor.key),
      dummyHotTime: 0,
      dummyHotTimePercentInput: true,
      dummySpirit: 0,
      targetAttackElement: defaults[skill].specs.elementAttack,
      targetAc: physicalSkillKeys.has(skill) ? -153 : -8,
      targetHotTime: 0,
      targetSpirit: 0,
      buffs: [],
      debuffs: [],
    };
  }

  function defaultDummySpecs() {
    return {
      ability: 201,
      basePhysical: 1000000,
      baseMagic: 1000000,
      weaponMin: 0,
      weaponMax: 0,
      str: 180,
      con: 180,
      dex: 180,
      int: 180,
      damage: 0,
      ring1: 0,
      ring2: 0,
      weapon: 0,
      acc1: 0,
      acc2: 0,
      elementBoost: "Off",
      elementAttack: "숲철공",
      move: 0,
      curse: "없음",
      arc: 0,
      abre: 0,
      ambush: "Off",
      focus: "Off",
      trap: "Off",
      nar: "Off",
      hotTime: "Off",
      spirit: 0,
      extraElement: 0,
      horde: "Off",
    };
  }

  function defaultDummyState() {
    return {
      sourceSkill: "martial",
      collapsedCards: {
        reverse: false,
        coefficient: false,
      },
      specs: defaultDummySpecs(),
      specManual: {},
      convManual: {},
      reverse: defaultReverseState("martial"),
      coefficient: {
        damage: "",
        necklaceBonus: 0,
        attackElement: "생암",
        dummyAcFactors: ["rings"],
        dummyBuffFactors: reverseDummyBuffFactors.map((factor) => factor.key),
        dummyHotTime: 0,
        dummySpirit: 0,
        stats: ["str", "con"],
        operator: "multiply",
        useAbility: false,
      },
    };
  }

  function defaultSectionOrder(skill) {
    const rows = physicalSkillKeys.has(skill) ? crasherMonsterRows : meteorMonsterRows;
    return [...new Set(rows.map((row) => row.section))];
  }

  function normalizeElementName(name) {
    return elementNameMap[name] || name;
  }

  function loadSavedState() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (applyImportedState(saved)) saveState();
    } catch (error) {
      console.warn("Saved calculator state could not be loaded.", error);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(snapshotState()),
      );
    } catch (error) {
      console.warn("Calculator state could not be saved.", error);
    }
  }

  function snapshotState() {
    return {
      version: 1,
      savedAt: new Date().toISOString(),
      skill: state.skill,
      crasher: state.crasher,
      martial: state.martial,
      meteor: state.meteor,
      dummy: state.dummy,
    };
  }

  function applyImportedState(saved) {
    if (!saved || typeof saved !== "object") return false;
    if (tabKeys.includes(saved.skill)) {
      state.skill = saved.skill;
    }
    for (const skill of skillKeys) {
      if (!saved[skill]) continue;
      state[skill] = freshSkillState(skill);
      state[skill].specs = { ...state[skill].specs, ...(saved[skill].specs || {}) };
      state[skill].specManual = { ...state[skill].specManual, ...(saved[skill].specManual || {}) };
      state[skill].convManual = { ...state[skill].convManual, ...(saved[skill].convManual || {}) };
      state[skill].customMonsters = Array.isArray(saved[skill].customMonsters) ? saved[skill].customMonsters : [];
      state[skill].sectionOrder = Array.isArray(saved[skill].sectionOrder) ? saved[skill].sectionOrder : state[skill].sectionOrder;
      state[skill].collapsedSections = Array.isArray(saved[skill].collapsedSections) ? saved[skill].collapsedSections : [];
      state[skill].reverse = { ...state[skill].reverse, ...(saved[skill].reverse || {}) };
      state[skill].downFourWay = { ...state[skill].downFourWay, ...(saved[skill].downFourWay || {}) };
      state[skill].dashStacks = saved[skill].dashStacks;
      state[skill].resultFontScale = saved[skill].resultFontScale;
      if (skill === "crasher") {
        state[skill].damageIncludes = normalizeCrasherDamageIncludes(saved[skill].damageIncludes);
      }
      if (skill === "martial") {
        state[skill].damageIncludes = normalizeMartialDamageIncludes(saved[skill].damageIncludes);
        state[skill].daraManaMode = martialDaraManaModes.includes(saved[skill].daraManaMode)
          ? saved[skill].daraManaMode
          : defaults.martial.daraManaMode;
      }
      migrateSavedSkillState(skill);
    }
    if (saved.dummy) {
      state.dummy = { ...defaultDummyState(), ...saved.dummy };
      state.dummy.specs = { ...defaultDummySpecs(), ...(saved.dummy.specs || {}) };
      state.dummy.specManual = { ...(saved.dummy.specManual || {}) };
      state.dummy.convManual = { ...(saved.dummy.convManual || {}) };
      state.dummy.coefficient = { ...defaultDummyState().coefficient, ...(saved.dummy.coefficient || {}) };
    } else {
      const sourceSkill = skillKeys.includes(saved.skill) ? saved.skill : "martial";
      state.dummy = {
        ...defaultDummyState(),
        sourceSkill,
        reverse: { ...defaultReverseState(sourceSkill), ...(state[sourceSkill]?.reverse || {}) },
      };
    }
    normalizeDummyState();
    return true;
  }

  function migrateSavedSkillState(skill) {
    const skillState = state[skill];
    if (skill === "crasher" && skillState.specs.jobType === "전직") {
      skillState.specs.jobType = "도전";
    }
    if (skill === "crasher") {
      skillState.damageIncludes = normalizeCrasherDamageIncludes(skillState.damageIncludes);
    }
    if (skill === "martial") {
      skillState.damageIncludes = normalizeMartialDamageIncludes(skillState.damageIncludes);
      delete skillState.convManual.daraLevel;
      delete skillState.convManual.guyangLevel;
      skillState.specs.guyangLevel = "일반";
      if (skillState.specs.focus === "On") {
        skillState.specs.focus = "일반";
      }
      if (!focusOptions.includes(skillState.specs.focus)) {
        skillState.specs.focus = "Off";
      }
      skillState.daraManaMode = martialDaraManaModes.includes(skillState.daraManaMode)
        ? skillState.daraManaMode
        : defaults.martial.daraManaMode;
    }
    if (skillState.specs.horde === "On") {
      skillState.specs.horde = "호드목";
    }
    skillState.specs.elementAttack = normalizeElementName(skillState.specs.elementAttack);
    if (skillState.reverse?.attackElement) {
      skillState.reverse.attackElement = normalizeElementName(skillState.reverse.attackElement);
      if (
        !skillState.reverse.targetAttackElement ||
        skillState.reverse.targetAttackElement === defaultReverseState(skill).targetAttackElement
      ) {
        skillState.reverse.targetAttackElement = skillState.reverse.attackElement;
      }
      if (!skillState.reverse.dummyAttackElement) {
        skillState.reverse.dummyAttackElement = defaults[skill].specs.elementAttack;
      }
    }
    if (
      physicalSkillKeys.has(skill) &&
      Object.prototype.hasOwnProperty.call(skillState.convManual, "flatPhysical") &&
      !Object.prototype.hasOwnProperty.call(skillState.convManual, "basePhysical")
    ) {
      skillState.convManual.basePhysical = skillState.convManual.flatPhysical;
    }
    delete skillState.convManual.flatPhysical;
    if (skillState.specs.curse === "데프" && Number(skillState.convManual.curse) === 60) {
      delete skillState.convManual.curse;
    }
    for (const key of readonlyConversionKeysForSkill(skill)) {
      delete skillState.convManual[key];
    }
    delete skillState.convManual.oneTickPlusMedi;
    delete skillState.specManual.oneTick;
    if (!Array.isArray(skillState.reverse?.debuffs)) {
      skillState.reverse = { ...defaultReverseState(skill), ...(skillState.reverse || {}), debuffs: [] };
    }
    if (!Array.isArray(skillState.reverse?.buffs)) {
      skillState.reverse.buffs = [];
    }
    if (!Array.isArray(skillState.reverse?.dummyAcFactors)) {
      skillState.reverse.dummyAcFactors = ["rings"];
    }
    if (!Array.isArray(skillState.reverse?.dummyBuffFactors)) {
      skillState.reverse.dummyBuffFactors = reverseDummyBuffFactors.map((factor) => factor.key);
    }
    skillState.reverse.dummyAcFactors = skillState.reverse.dummyAcFactors.filter((key) =>
      reverseDummyAcFactors.some((factor) => factor.key === key),
    );
    skillState.reverse.dummyBuffFactors = skillState.reverse.dummyBuffFactors.filter((key) =>
      reverseDummyBuffFactors.some((factor) => factor.key === key),
    );
    if (!skillState.reverse.dummyHotTimePercentInput) {
      const oldHotTime = Number(skillState.reverse.dummyHotTime) || 0;
      skillState.reverse.dummyHotTime = oldHotTime > 0 && oldHotTime <= 1 ? oldHotTime * 100 : oldHotTime;
      skillState.reverse.dummyHotTimePercentInput = true;
    }
    skillState.reverse.dummyHotTime = Number(skillState.reverse.dummyHotTime) || 0;
    skillState.reverse.dummySpirit = Number(skillState.reverse.dummySpirit) || 0;
    skillState.reverse.targetHotTime = Number(skillState.reverse.targetHotTime) || 0;
    skillState.reverse.targetSpirit = Number(skillState.reverse.targetSpirit) || 0;
    if (!skillState.downFourWay || typeof skillState.downFourWay !== "object") {
      skillState.downFourWay = defaultDownFourWayState();
    }
    skillState.dashStacks = clampInt(skillState.dashStacks, 1, 6, 1);
    skillState.resultFontScale = resultFontScales.includes(Number(skillState.resultFontScale))
      ? Number(skillState.resultFontScale)
      : 100;
    skillState.reverse.buffs = skillState.reverse.buffs.filter((buff) => reverseBuffs.includes(buff));
    skillState.reverse.debuffs = skillState.reverse.debuffs.filter((debuff) => reverseDebuffs.includes(debuff));
    delete skillState.reverse.belt;
    delete skillState.reverse.attackElement;
    const options = reverseElementOptionsForSkill();
    skillState.reverse.dummyAttackElement = normalizeElementName(skillState.reverse.dummyAttackElement);
    skillState.reverse.targetAttackElement = normalizeElementName(skillState.reverse.targetAttackElement);
    if (!options.includes(skillState.reverse.dummyAttackElement)) {
      skillState.reverse.dummyAttackElement = defaults[skill].specs.elementAttack;
    }
    if (!options.includes(skillState.reverse.targetAttackElement)) {
      skillState.reverse.targetAttackElement = defaults[skill].specs.elementAttack;
    }
  }

  function getDummySourceSkill() {
    if (!state.dummy || !skillKeys.includes(state.dummy.sourceSkill)) {
      state.dummy = { ...defaultDummyState(), ...(state.dummy || {}), sourceSkill: "martial" };
    }
    return state.dummy.sourceSkill;
  }

  function normalizeDummyState() {
    if (!state.dummy || typeof state.dummy !== "object") {
      state.dummy = defaultDummyState();
    }
    state.dummy.collapsedCards = {
      ...defaultDummyState().collapsedCards,
      ...(state.dummy.collapsedCards || {}),
    };
    if (!skillKeys.includes(state.dummy.sourceSkill)) {
      state.dummy.sourceSkill = "martial";
    }
    const sourceSkill = state.dummy.sourceSkill;
    state.dummy.specs = { ...defaultDummySpecs(), ...(state.dummy.specs || {}) };
    state.dummy.specManual = { ...(state.dummy.specManual || {}) };
    state.dummy.convManual = { ...(state.dummy.convManual || {}) };
    if (state.dummy.specs.horde === "On") {
      state.dummy.specs.horde = "호드목";
    }
    if (state.dummy.specs.focus === "On") {
      state.dummy.specs.focus = sourceSkill === "crasher" ? "집중(전사)" : "변신마스터";
    }
    if (state.dummy.specs.focus === "일반") {
      state.dummy.specs.focus = "변신마스터";
    }
    if (state.dummy.specs.focus === "업글") {
      state.dummy.specs.focus = "정신집중(도가)";
    }
    if (!dummyFocusOptions.includes(state.dummy.specs.focus)) {
      state.dummy.specs.focus = "Off";
    }
    state.dummy.specs.elementAttack = normalizeElementName(state.dummy.specs.elementAttack);
    if (!crasherElements.includes(state.dummy.specs.elementAttack)) {
      state.dummy.specs.elementAttack = defaultDummySpecs().elementAttack;
    }
    for (const key of readonlyConversionKeysForSkill("dummy")) {
      delete state.dummy.convManual[key];
    }
    const rawDummyReverse = state.dummy.reverse || {};
    state.dummy.reverse = { ...defaultReverseState(sourceSkill), ...rawDummyReverse };
    if (rawDummyReverse.attackElement && !rawDummyReverse.targetAttackElement) {
      state.dummy.reverse.targetAttackElement = rawDummyReverse.attackElement;
    }
    if (
      rawDummyReverse.attackElement &&
      state.dummy.reverse.targetAttackElement === defaultReverseState(sourceSkill).targetAttackElement
    ) {
      state.dummy.reverse.targetAttackElement = rawDummyReverse.attackElement;
    }
    if (rawDummyReverse.attackElement && !rawDummyReverse.dummyAttackElement) {
      state.dummy.reverse.dummyAttackElement = defaults[sourceSkill].specs.elementAttack;
    }
    if (!Array.isArray(state.dummy.reverse.buffs)) state.dummy.reverse.buffs = [];
    if (!Array.isArray(state.dummy.reverse.debuffs)) state.dummy.reverse.debuffs = [];
    if (!Array.isArray(state.dummy.reverse.dummyAcFactors)) state.dummy.reverse.dummyAcFactors = ["rings"];
    if (!Array.isArray(state.dummy.reverse.dummyBuffFactors)) {
      state.dummy.reverse.dummyBuffFactors = reverseDummyBuffFactors.map((factor) => factor.key);
    }
    state.dummy.reverse.buffs = state.dummy.reverse.buffs.filter((buff) => reverseBuffs.includes(buff));
    state.dummy.reverse.debuffs = state.dummy.reverse.debuffs.filter((debuff) => reverseDebuffs.includes(debuff));
    delete state.dummy.reverse.belt;
    delete state.dummy.reverse.attackElement;
    state.dummy.reverse.dummyAcFactors = state.dummy.reverse.dummyAcFactors.filter((key) =>
      reverseDummyAcFactors.some((factor) => factor.key === key),
    );
    state.dummy.reverse.dummyBuffFactors = state.dummy.reverse.dummyBuffFactors.filter((key) =>
      reverseDummyBuffFactors.some((factor) => factor.key === key),
    );
    state.dummy.reverse.dummyAttackElement = normalizeElementName(state.dummy.reverse.dummyAttackElement);
    state.dummy.reverse.targetAttackElement = normalizeElementName(state.dummy.reverse.targetAttackElement);
    const options = reverseElementOptionsForSkill();
    if (!options.includes(state.dummy.reverse.dummyAttackElement)) {
      state.dummy.reverse.dummyAttackElement = defaults[sourceSkill].specs.elementAttack;
    }
    if (!options.includes(state.dummy.reverse.targetAttackElement)) {
      state.dummy.reverse.targetAttackElement = defaults[sourceSkill].specs.elementAttack;
    }
    if (!state.dummy.reverse.dummyHotTimePercentInput) {
      const oldHotTime = Number(state.dummy.reverse.dummyHotTime) || 0;
      state.dummy.reverse.dummyHotTime = oldHotTime > 0 && oldHotTime <= 1 ? oldHotTime * 100 : oldHotTime;
      state.dummy.reverse.dummyHotTimePercentInput = true;
    }
    state.dummy.reverse.dummyHotTime = Number(state.dummy.reverse.dummyHotTime) || 0;
    state.dummy.reverse.dummySpirit = Number(state.dummy.reverse.dummySpirit) || 0;
    state.dummy.reverse.targetHotTime = Number(state.dummy.reverse.targetHotTime) || 0;
    state.dummy.reverse.targetSpirit = Number(state.dummy.reverse.targetSpirit) || 0;
    state.dummy.coefficient = { ...defaultDummyState().coefficient, ...(state.dummy.coefficient || {}) };
    state.dummy.coefficient.attackElement = normalizeElementName(state.dummy.coefficient.attackElement);
    if (!coefficientElements.some((option) => option.value === state.dummy.coefficient.attackElement)) {
      state.dummy.coefficient.attackElement = defaultDummyState().coefficient.attackElement;
    }
    if (!Array.isArray(state.dummy.coefficient.stats)) {
      state.dummy.coefficient.stats = defaultDummyState().coefficient.stats;
    }
    state.dummy.coefficient.stats = state.dummy.coefficient.stats.filter((key) =>
      coefficientStats.some((stat) => stat.key === key),
    );
    if (!Array.isArray(state.dummy.coefficient.dummyAcFactors)) {
      state.dummy.coefficient.dummyAcFactors = ["rings"];
    }
    if (!Array.isArray(state.dummy.coefficient.dummyBuffFactors)) {
      state.dummy.coefficient.dummyBuffFactors = reverseDummyBuffFactors.map((factor) => factor.key);
    }
    state.dummy.coefficient.dummyAcFactors = state.dummy.coefficient.dummyAcFactors.filter((key) =>
      reverseDummyAcFactors.some((factor) => factor.key === key),
    );
    state.dummy.coefficient.dummyBuffFactors = state.dummy.coefficient.dummyBuffFactors.filter((key) =>
      reverseDummyBuffFactors.some((factor) => factor.key === key),
    );
    if (!coefficientOperators.some((operator) => operator.key === state.dummy.coefficient.operator)) {
      state.dummy.coefficient.operator = defaultDummyState().coefficient.operator;
    }
    state.dummy.coefficient.necklaceBonus = Number(state.dummy.coefficient.necklaceBonus) || 0;
    state.dummy.coefficient.dummyHotTime = Number(state.dummy.coefficient.dummyHotTime) || 0;
    state.dummy.coefficient.dummySpirit = Number(state.dummy.coefficient.dummySpirit) || 0;
    state.dummy.coefficient.useAbility = Boolean(state.dummy.coefficient.useAbility);
  }

  function importDummySpecsFromSkill(skill) {
    if (!skillKeys.includes(skill)) return;
    const sourceSpecs = state[skill]?.specs || {};
    const target = { ...defaultDummySpecs(), ...(state.dummy.specs || {}) };
    const dummyKeys = dummyDefs.filter((def) => def.key).map((def) => def.key);
    for (const key of dummyKeys) {
      if (Object.prototype.hasOwnProperty.call(sourceSpecs, key)) {
        target[key] = sourceSpecs[key];
      }
    }
    target.elementAttack = normalizeElementName(target.elementAttack);
    if (skill === "crasher" && sourceSpecs.focus === "On") {
      target.focus = "On";
    }
    state.dummy.sourceSkill = skill;
    state.dummy.specs = target;
    state.dummy.specManual = { ...(state.dummy.specManual || {}) };
    state.dummy.convManual = { ...(state.dummy.convManual || {}) };
    for (const key of readonlyConversionKeysForSkill("dummy")) {
      delete state.dummy.convManual[key];
    }
    if (!state.dummy.coefficient || typeof state.dummy.coefficient !== "object") {
      state.dummy.coefficient = defaultDummyState().coefficient;
    }
    if (physicalSkillKeys.has(skill)) {
      state.dummy.coefficient.necklaceBonus = Number(state[skill]?.convManual?.basePhysical) || 0;
    }
    normalizeDummyState();
    saveState();
    render();
  }

  function exportStateFile() {
    const blob = new Blob([JSON.stringify(snapshotState(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    anchor.href = url;
    anchor.download = `damage-calculator-settings-${date}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function importStateFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      try {
        const parsed = JSON.parse(String(reader.result || "{}"));
        if (!applyImportedState(parsed)) {
          alert("불러올 수 없는 설정 파일입니다.");
          return;
        }
        saveState();
        render();
      } catch (error) {
        alert("설정 파일을 읽는 중 오류가 발생했습니다.");
      }
    });
    reader.readAsText(file, "utf-8");
  }

  function floorInt(value) {
    return Math.floor(Number(value) || 0);
  }

  function clampInt(value, min, max, fallback) {
    const number = Math.trunc(Number(value));
    if (!Number.isFinite(number)) return fallback;
    return Math.min(max, Math.max(min, number));
  }

  function roundDown(value, digits) {
    const factor = 10 ** digits;
    return Math.trunc(value * factor) / factor;
  }

  function equipLevel(level, multiplier) {
    const value = Number(level) || 0;
    return (value + floorInt(value / 5)) * multiplier;
  }

  function onValue(value) {
    return value === "On" ? 1 : 0;
  }

  function martialFocusValue(value) {
    if (value === "업글") return 0.4;
    if (value === "일반" || value === "On") return 0.3;
    return 0;
  }

  function dummyFocusValue(value, sourceSkill = getDummySourceSkill()) {
    if (value === "집중(전사)") return 1;
    if (value === "변신마스터") return 0.3;
    if (value === "정신집중(도가)") return 0.4;
    if (value === "On") return sourceSkill === "crasher" ? 1 : 0.3;
    return martialFocusValue(value);
  }

  function hordeValue(value) {
    if (value === "나겔목") return 0.3;
    if (value === "호드목" || value === "On") return 0.15;
    return 0;
  }

  function elementFormulaValue(factor, c) {
    if (factor === 1) return 1;
    const elementBoost = Number(c.elementBoost) || 0;
    const extraElement = Number(c.extraElement) || 0;
    const horde = Number(c.horde) || 0;
    const bonusSign = factor < 1 ? -1 : 1;
    return factor ** 2 * (1 + factor * elementBoost - elementBoost + bonusSign * extraElement + bonusSign * horde);
  }

  function jobTypeValue(value) {
    return value === "순수" ? 4 : 2;
  }

  function bossCrasherRate(jobType) {
    if (jobType === "순수") return 0.9;
    return jobType === "도전" ? 1 : 0.75;
  }

  function madCoefficient(type, jobType) {
    if (type !== "업글") return jobType === "순수" ? 0.55 : 0.5;
    return jobType === "순수" ? 0.55 : 0.5;
  }

  function levelCoefficient(level, multiplier, upgradeValue) {
    return level === "업글" ? upgradeValue : multiplier * (Number(level) || 0);
  }

  function dashCoefficient(level) {
    return level === "업글" ? 57.8012585037289 : 3.724984600805496 * (Number(level) || 0);
  }

  function martialCoefficient(key, level, ability) {
    if (key === "daraLevel") return 2;
    if (key === "guyangLevel") return 0.4;
    if (level === "업글" || level === "업글1" || level === "업글2") {
      return (martialUpgradeCoefficients[key] ?? 0) * abilityCoefficient(ability, 0.00415);
    }
    const levelNumber = Number(level) || 0;
    if (key === "dangakLevel") return (martialBaseCoefficients.dual + martialBaseCoefficients.combo) * levelNumber;
    if (key === "punggakLevel") return (martialBaseCoefficients.scratch + martialBaseCoefficients.tail) * levelNumber;
    if (key === "whirlwindLevel") return martialBaseCoefficients.wind * levelNumber;
    if (key === "jiyeolLevel") return martialBaseCoefficients.jiyeol * levelNumber;
    return 0;
  }

  function abilityCoefficient(ability, rate = 0.0041) {
    const value = Number(ability);
    return value < 201 ? 1 : (value - 200) * rate + 1.1;
  }

  function buffWeightWithElement(elementValue, additiveBuffs) {
    return elementValue > 0 && elementValue < 1
      ? elementValue * (1 + additiveBuffs)
      : elementValue + additiveBuffs;
  }

  function downFourWayRatio(values = {}) {
    const furyDamage = Number(values.furyDamage) || 0;
    if (!furyDamage) return 0;
    const fourWayRatio = (Number(values.fourWayDamage) || 0) / furyDamage;
    const downRatio = (Number(values.downDamage) || 0) / furyDamage;
    return fourWayRatio + downRatio;
  }

  function applyManual(skillState, key, computed) {
    if (Object.prototype.hasOwnProperty.call(skillState.convManual, key)) {
      return skillState.convManual[key];
    }
    return computed;
  }

  function defenseRate(ac) {
    if (ac >= -98) return 1 + ac / 100;
    if (ac >= -196) return (198 + ac) / 5000;
    return (296 + ac) / 250000;
  }

  function normalizeCustomMonsters(monsters = []) {
    return monsters
      .filter((monster) => monster && monster.section && monster.name && Number.isFinite(Number(monster.ac)))
      .map((monster) => ({
        id: monster.id,
        section: String(monster.section),
        name: String(monster.name),
        ac: Number(monster.ac),
        hp: monster.hp === "" || monster.hp === null || monster.hp === undefined ? null : Number(monster.hp),
        kind: "custom",
        custom: true,
      }))
      .filter((monster) => monster.hp === null || Number.isFinite(monster.hp));
  }

  function syncSectionOrder(skill, rows) {
    const skillState = state[skill];
    const sections = [...new Set(rows.map((row) => row.section))];
    const ordered = (skillState.sectionOrder || []).filter((section) => sections.includes(section));
    for (const section of sections) {
      if (!ordered.includes(section)) ordered.push(section);
    }
    skillState.sectionOrder = ordered;
    skillState.collapsedSections = (skillState.collapsedSections || []).filter((section) => sections.includes(section));
    return ordered;
  }

  function orderedRowsForSkill(skill, rows) {
    const order = syncSectionOrder(skill, rows);
    const rank = new Map(order.map((section, index) => [section, index]));
    return [...rows].sort((a, b) => (rank.get(a.section) ?? 999) - (rank.get(b.section) ?? 999));
  }

  function shotNote(damage, hp) {
    if (!hp || hp <= 0) return "";
    return damage >= hp
      ? `<span class="shot-mark">[샷]</span>`
      : `<span class="damage-warn">${formatNumber(hp - damage)} 남음</span>`;
  }

  function calculateCrasher(inputState = state.crasher) {
    const s = inputState.specs;
    const isPureJob = s.jobType === "순수";
    const usesJobSkill = s.jobType !== "직전/법전";
    const c = {};
    c.jobType = jobTypeValue(s.jobType);
    c.ability = applyManual(
      inputState,
      "ability",
      abilityCoefficient(s.ability),
    );
    c.flatPhysical = applyManual(inputState, "basePhysical", defaults.crasher.conv.flatPhysical);
    c.str = Number(s.str) + 5;
    c.con = Number(s.con) + 13;
    c.ring1 = applyManual(inputState, "ring1", equipLevel(s.ring1, 1));
    c.ring2 = applyManual(inputState, "ring2", equipLevel(s.ring2, 1));
    c.weapon = applyManual(inputState, "weapon", equipLevel(s.weapon, 0.03));
    c.acc1 = applyManual(inputState, "acc1", equipLevel(s.acc1, 0.01));
    c.acc2 = applyManual(inputState, "acc2", equipLevel(s.acc2, 0.01));
    c.elementBoost = applyManual(inputState, "elementBoost", onValue(s.elementBoost));
    c.move = applyManual(inputState, "move", (Number(s.move) || 0) * 0.4);
    c.madType = applyManual(
      inputState,
      "madType",
      madCoefficient(s.madType, s.jobType) * (s.madType === "업글" ? abilityCoefficient(s.ability, 0.00404) : 1),
    );
    c.furyLevel = applyManual(
      inputState,
      "furyLevel",
      levelCoefficient(s.furyLevel, 4.984914075823167, 77.32374) *
        (s.furyLevel === "업글" ? abilityCoefficient(s.ability, 0.00415) : 1),
    );
    c.dashLevel = applyManual(
      inputState,
      "dashLevel",
      dashCoefficient(s.dashLevel) * (s.dashLevel === "업글" ? c.ability : 1),
    );
    c.downFourWayLevel = applyManual(inputState, "downFourWayLevel", downFourWayRatio(inputState.downFourWay));
    c.dashStacks = clampInt(inputState.dashStacks, 1, 6, 1);
    c.curse = applyManual(inputState, "curse", curseValueCrasher[s.curse] ?? 0);
    c.arc = applyManual(inputState, "arc", (Number(s.arc) || 0) * 13);
    c.abre = applyManual(inputState, "abre", (Number(s.abre) || 0) * 18);
    c.ambush = applyManual(inputState, "ambush", s.ambush === "On" || Number(s.ambush) === 1 ? 20 : 0);
    c.focus = applyManual(inputState, "focus", onValue(s.focus));
    c.trap = applyManual(inputState, "trap", onValue(s.trap));
    c.nar = applyManual(inputState, "nar", onValue(s.nar));
    c.hotTime = applyManual(
      inputState,
      "hotTime",
      s.hotTime === "평일" ? 0.15 : s.hotTime === "주말" || s.hotTime === "On" ? 0.2 : 0,
    );
    c.spirit = applyManual(inputState, "spirit", (Number(s.spirit) || 0) / 100);
    c.extraElement = applyManual(inputState, "extraElement", equipLevel(s.extraElement, 0.01));
    c.horde = applyManual(inputState, "horde", hordeValue(s.horde));
    c.elementAttack = applyManual(inputState, "elementAttack", crasherElementValue(s.elementAttack, c));
    const damageIncludes = normalizeCrasherDamageIncludes(inputState.damageIncludes);

    const monsterRows = [...crasherMonsterRows, ...normalizeCustomMonsters(inputState.customMonsters)];
    const rows = monsterRows.map((monster) => {
      const acChanged =
        monster.ac + c.ring1 + c.ring2 + c.curse + c.arc + c.abre + c.ambush;
      const damageIncrease = 1 + c.weapon + c.acc1 + c.acc2;
      const buffWeight = buffWeightWithElement(c.elementAttack, c.move + c.focus + c.trap + c.nar);
      const acWeight = defenseRate(acChanged);
      const percent = acWeight * damageIncrease * buffWeight;
      const percentWithoutFocus = acWeight * damageIncrease * (buffWeight - c.focus);
      const base = Number(s.basePhysical) || 0;
      const flat = c.flatPhysical;
      const flatBonusElements = new Set(["생암", "생(암)공"]);
      const appliesFlatBonus = flatBonusElements.has(normalizeElementName(s.elementAttack)) && monster.kind !== "boss";
      const useHot = monster.kind !== "boss";
      const flatBonus = appliesFlatBonus ? flat : 0;
      const hotTimeWeight = useHot ? 1 + c.hotTime : 1;
      const spiritWeight = 1 + c.spirit;
      const bossRate = monster.kind === "boss" ? bossCrasherRate(s.jobType) : 1;
      const mad = (base * c.madType * percent * hotTimeWeight + flatBonus) * spiritWeight;
      const crasher = ((base * c.jobType * percent * hotTimeWeight + flatBonus) * bossRate) * spiritWeight;
      const skillBase =
        acWeight *
        damageIncrease *
        (buffWeight - c.focus) *
        (Number(s.str) || 0) *
        (Number(s.con) || 0) *
        hotTimeWeight;
      const fury = (skillBase * c.furyLevel + flatBonus) * spiritWeight;
      const jobSkillName = isPureJob ? "대쉬" : "암살";
      const downFourWayDamage = fury * c.downFourWayLevel;
      const jobSkillDamage = usesJobSkill
        ? isPureJob
          ? ((skillBase * c.dashLevel + flatBonus) * spiritWeight) * c.dashStacks
          : (base * 0.1 * 0.375 * percentWithoutFocus * hotTimeWeight + flatBonus) * spiritWeight
        : 0;
      const totalDamage =
        (damageIncludes.mad ? mad : 0) +
        (damageIncludes.crasher ? crasher : 0) +
        (damageIncludes.fury ? fury : 0) +
        (damageIncludes.downFourWay ? downFourWayDamage : 0) +
        (usesJobSkill && damageIncludes.jobSkill ? jobSkillDamage : 0);
      const total = monster.kind === "boss" ? Math.trunc(totalDamage) : null;
      const balrogShot = monster.kind === "boss" ? 36000000 - total : null;
      return {
        ...monster,
        acChanged,
        acWeight,
        damageIncrease,
        buffWeight,
        hotTimeWeight,
        spiritWeight,
        percent,
        mad,
        crasher,
        fury,
        downFourWayDamage,
        jobSkillName,
        jobSkillDamage,
        usesJobSkill,
        totalDamage,
        total,
        balrogShot,
      };
    });

    const orderedRows = orderedRowsForSkill("crasher", rows);
    return { conversions: c, rows: orderedRows, damageIncludes, factorSummary: buildFactorSummary(orderedRows, c, "crasher") };
  }

  function calculateMartial(inputState = state.martial) {
    const s = inputState.specs;
    const c = {};
    c.ability = applyManual(inputState, "ability", abilityCoefficient(s.ability));
    c.flatPhysical = applyManual(inputState, "basePhysical", defaults.martial.conv.flatPhysical);
    c.oneTick = Math.floor((Number(s.baseMagic) || 0) / 5);
    c.str = Number(s.str) + 5;
    c.con = Number(s.con) + 13;
    c.ring1 = applyManual(inputState, "ring1", equipLevel(s.ring1, 1));
    c.ring2 = applyManual(inputState, "ring2", equipLevel(s.ring2, 1));
    c.weapon = applyManual(inputState, "weapon", equipLevel(s.weapon, 0.03));
    c.acc1 = applyManual(inputState, "acc1", equipLevel(s.acc1, 0.01));
    c.acc2 = applyManual(inputState, "acc2", equipLevel(s.acc2, 0.01));
    c.elementBoost = applyManual(inputState, "elementBoost", onValue(s.elementBoost));
    c.move = applyManual(inputState, "move", (Number(s.move) || 0) * 0.4);
    for (const technique of martialTechniqueDefs) {
      c[technique.key] = applyManual(inputState, technique.key, martialCoefficient(technique.key, s[technique.key], s.ability));
    }
    c.curse = applyManual(inputState, "curse", curseValueCrasher[s.curse] ?? 0);
    c.arc = applyManual(inputState, "arc", (Number(s.arc) || 0) * 13);
    c.abre = applyManual(inputState, "abre", (Number(s.abre) || 0) * 18);
    c.ambush = applyManual(inputState, "ambush", s.ambush === "On" || Number(s.ambush) === 1 ? 20 : 0);
    c.focus = applyManual(inputState, "focus", martialFocusValue(s.focus));
    c.trap = applyManual(inputState, "trap", onValue(s.trap));
    c.nar = applyManual(inputState, "nar", onValue(s.nar));
    c.hotTime = applyManual(
      inputState,
      "hotTime",
      s.hotTime === "평일" ? 0.15 : s.hotTime === "주말" || s.hotTime === "On" ? 0.2 : 0,
    );
    c.spirit = applyManual(inputState, "spirit", (Number(s.spirit) || 0) / 100);
    c.extraElement = applyManual(inputState, "extraElement", equipLevel(s.extraElement, 0.01));
    c.horde = applyManual(inputState, "horde", hordeValue(s.horde));
    c.elementAttack = applyManual(inputState, "elementAttack", crasherElementValue(s.elementAttack, c));
    const damageIncludes = normalizeMartialDamageIncludes(inputState.damageIncludes);

    const monsterRows = [...crasherMonsterRows, ...normalizeCustomMonsters(inputState.customMonsters)];
    const rows = monsterRows.map((monster) => {
      const acChanged =
        monster.ac + c.ring1 + c.ring2 + c.curse + c.arc + c.abre + c.ambush;
      const damageIncrease = 1 + c.weapon + c.acc1 + c.acc2;
      const buffWeight = buffWeightWithElement(c.elementAttack, c.move + c.focus + c.trap + c.nar);
      const acWeight = defenseRate(acChanged);
      const percent = acWeight * damageIncrease * buffWeight;
      const hotTimeWeight = monster.kind !== "boss" ? 1 + c.hotTime : 1;
      const skillBase =
        acWeight *
        damageIncrease *
        buffWeight *
        (Number(s.str) || 0) *
        (Number(s.con) || 0) *
        hotTimeWeight;
      const spiritWeight = 1 + c.spirit;
      const currentHp = Number(s.basePhysical) || 0;
      const fullMana = Number(s.baseMagic) || 0;
      const selectedMana = inputState.daraManaMode === "1틱" ? c.oneTick : fullMana;
      const flatBonusElements = new Set(["생암", "생(암)공"]);
      const flatBonus = flatBonusElements.has(normalizeElementName(s.elementAttack)) && monster.kind !== "boss" ? c.flatPhysical : 0;
      const damages = martialTechniqueDefs.reduce((acc, technique) => {
        if (technique.key === "daraLevel") {
          acc[technique.damageKey] = (Math.max(0, currentHp + selectedMana - 1440) * c.daraLevel * percent * hotTimeWeight + flatBonus) * spiritWeight;
        } else if (technique.key === "guyangLevel") {
          acc[technique.damageKey] = (currentHp * c.guyangLevel * percent * hotTimeWeight + flatBonus) * spiritWeight;
        } else {
          acc[technique.damageKey] = (skillBase * c[technique.key] + flatBonus) * spiritWeight;
        }
        return acc;
      }, {});
      const totalDamage = martialDamageKeys.reduce(
        (total, key) => total + (damageIncludes[key] ? damages[key] || 0 : 0),
        0,
      );
      const total = monster.kind === "boss" ? Math.trunc(totalDamage) : null;
      const balrogShot = monster.kind === "boss" ? 36000000 - total : null;
      return {
        ...monster,
        acChanged,
        acWeight,
        damageIncrease,
        buffWeight,
        hotTimeWeight,
        spiritWeight,
        percent,
        damages,
        totalDamage,
        total,
        balrogShot,
      };
    });

    const orderedRows = orderedRowsForSkill("martial", rows);
    return { conversions: c, rows: orderedRows, damageIncludes, factorSummary: buildFactorSummary(orderedRows, c, "martial") };
  }

  function calculateDummy(inputState = state.dummy) {
    const s = { ...defaultDummySpecs(), ...(inputState.specs || {}) };
    if (!inputState.convManual) inputState.convManual = {};
    const c = {};
    c.ability = applyManual(inputState, "ability", abilityCoefficient(s.ability));
    c.flatPhysical = 0;
    c.oneTick = Math.floor((Number(s.baseMagic) || 0) / 5);
    c.weaponMin = Number(s.weaponMin) || 0;
    c.weaponMax = Number(s.weaponMax) || 0;
    c.str = Number(s.str) || 0;
    c.con = Number(s.con) || 0;
    c.dex = Number(s.dex) || 0;
    c.int = Number(s.int) || 0;
    c.damage = Number(s.damage) || 0;
    c.ring1 = applyManual(inputState, "ring1", equipLevel(s.ring1, 1));
    c.ring2 = applyManual(inputState, "ring2", equipLevel(s.ring2, 1));
    c.weapon = applyManual(inputState, "weapon", equipLevel(s.weapon, 0.03));
    c.acc1 = applyManual(inputState, "acc1", equipLevel(s.acc1, 0.01));
    c.acc2 = applyManual(inputState, "acc2", equipLevel(s.acc2, 0.01));
    c.elementBoost = applyManual(inputState, "elementBoost", onValue(s.elementBoost));
    c.move = applyManual(inputState, "move", (Number(s.move) || 0) * 0.4);
    c.curse = applyManual(inputState, "curse", curseValueCrasher[s.curse] ?? 0);
    c.arc = applyManual(inputState, "arc", (Number(s.arc) || 0) * 13);
    c.abre = applyManual(inputState, "abre", (Number(s.abre) || 0) * 18);
    c.ambush = applyManual(inputState, "ambush", s.ambush === "On" || Number(s.ambush) === 1 ? 20 : 0);
    c.focus = applyManual(inputState, "focus", dummyFocusValue(s.focus, inputState.sourceSkill || getDummySourceSkill()));
    c.trap = applyManual(inputState, "trap", onValue(s.trap));
    c.nar = applyManual(inputState, "nar", onValue(s.nar));
    c.hotTime = applyManual(
      inputState,
      "hotTime",
      s.hotTime === "평일" ? 0.15 : s.hotTime === "주말" || s.hotTime === "On" ? 0.2 : 0,
    );
    c.spirit = applyManual(inputState, "spirit", (Number(s.spirit) || 0) / 100);
    c.extraElement = applyManual(inputState, "extraElement", equipLevel(s.extraElement, 0.01));
    c.horde = applyManual(inputState, "horde", hordeValue(s.horde));
    c.elementAttack = applyManual(inputState, "elementAttack", crasherElementValue(s.elementAttack, c));

    const acChanged = 100 + c.ring1 + c.ring2 + c.curse + c.arc + c.abre + c.ambush;
    const acWeight = defenseRate(acChanged);
    const damageIncrease = 1 + c.weapon + c.acc1 + c.acc2;
    const buffWeight = buffWeightWithElement(c.elementAttack, c.move + c.focus + c.trap + c.nar);
    const hotTimeWeight = 1 + c.hotTime;
    const spiritWeight = 1 + c.spirit;
    const percent = acWeight * damageIncrease * buffWeight * hotTimeWeight * spiritWeight;
    const row = {
      section: "허수아비",
      name: "허수아비 입력값",
      ac: 100,
      acChanged,
      acWeight,
      damageIncrease,
      buffWeight,
      hotTimeWeight,
      spiritWeight,
      percent,
    };
    return { conversions: c, specs: s, rows: [row], factorSummary: buildFactorSummary([row], c, "dummy") };
  }

  function crasherElementValue(name, c) {
    const table = {
      숲철공: 1.35,
      속공: 1.3,
      생암: 1.2,
      "생(암)공": 1.1,
      암방: 0.9,
      "암암(반속)": 0.75,
      중립속성: 1,
    };
    const selected = table[normalizeElementName(name)] || table.속공;
    return elementFormulaValue(selected, c);
  }

  function calculateMeteor(inputState = state.meteor) {
    const s = resolveMeteorSpecs(inputState);
    const c = {};
    c.ability = applyManual(inputState, "ability", Number(s.ability) < 201 ? 1 : 1 + (Number(s.ability) - 201) / 200);
    c.earring = applyManual(inputState, "earring", equipLevel(s.earring, 0.02));
    c.ring1 = applyManual(inputState, "ring1", equipLevel(s.ring1, 1));
    c.ring2 = applyManual(inputState, "ring2", equipLevel(s.ring2, 1));
    c.weapon = applyManual(inputState, "weapon", equipLevel(s.weapon, 0.03));
    c.acc1 = applyManual(inputState, "acc1", equipLevel(s.acc1, 0.01));
    c.acc2 = applyManual(inputState, "acc2", equipLevel(s.acc2, 0.01));
    c.elementBoost = applyManual(inputState, "elementBoost", onValue(s.elementBoost));
    c.curse = applyManual(inputState, "curse", curseValueMeteor[s.curse] ?? 0);
    c.manaReduction = applyManual(inputState, "manaReduction", (100 - (Number(s.manaReduction) || 0)) / 100);
    c.arc = applyManual(inputState, "arc", (Number(s.arc) || 0) * 13);
    c.abre = applyManual(inputState, "abre", (Number(s.abre) || 0) * 18);
    c.ambush = applyManual(inputState, "ambush", s.ambush === "On" || Number(s.ambush) === 1 ? 20 : 0);
    c.focus = 0;
    c.trap = applyManual(inputState, "trap", onValue(s.trap));
    c.nar = applyManual(inputState, "nar", onValue(s.nar));
    c.hotTime = applyManual(
      inputState,
      "hotTime",
      s.hotTime === "평일" ? 0.15 : s.hotTime === "주말" ? 0.2 : 0,
    );
    c.spirit = applyManual(inputState, "spirit", (Number(s.spirit) || 0) / 100);
    c.extraElement = applyManual(inputState, "extraElement", equipLevel(s.extraElement, 0.01));
    c.horde = applyManual(inputState, "horde", hordeValue(s.horde));
    c.elementAttack = applyManual(inputState, "elementAttack", meteorElementValue(s.elementAttack, c));

    const med = meditationTable[Number(s.meditation)] || { time: 3, recovery: 0 };
    c.oneTick = applyManual(inputState, "oneTick", Math.floor((Number(s.baseMagic) || 0) * (med.recovery / 100) * (1 + c.earring)));
    c.meditation = applyManual(inputState, "meditation", c.oneTick * (med.time - 3));
    c.castMana = defaults.meteor.conv.castMana;

    const resolvedSpecs = { ...s };
    resolvedSpecs.oneTick = Math.floor(((Number(s.baseMagic) || 0) / 5) * (1 + c.earring));
    if (!inputState.specManual.oneTickPlusMedi) {
      resolvedSpecs.oneTickPlusMedi = resolvedSpecs.oneTick + c.meditation;
    }

    const monsterRows = [...meteorMonsterRows, ...normalizeCustomMonsters(inputState.customMonsters)];
    const rows = monsterRows.map((monster) => {
      const acChanged =
        monster.ac +
        c.ring1 +
        c.ring2 +
        c.curse +
        c.arc +
        c.abre +
        c.ambush;
      const damageIncrease = 1 + c.weapon + c.acc1 + c.acc2;
      const buffWeight = buffWeightWithElement(c.elementAttack, c.focus + c.trap + c.nar);
      const hotTimeWeight = 1 + c.hotTime;
      const spiritWeight = 1 + c.spirit;
      const acWeight = defenseRate(acChanged);
      const percent = acWeight * damageIncrease * buffWeight;
      const castManaCost = c.castMana * c.manaReduction;
      const baseMagic = Number(s.baseMagic) || 0;
      const cappedMana = (mana) => Math.min(Number(mana) || 0, baseMagic);
      const meteorDamage = (mana) =>
        (cappedMana(mana) - castManaCost) * 1.5 * percent * hotTimeWeight * spiritWeight;
      const oneTickOneMediDamage = meteorDamage(resolvedSpecs.oneTickPlusMedi);
      const twoTickOneMediDamage = meteorDamage(resolvedSpecs.oneTick * 2 + c.meditation);
      const twoTickTwoMediDamage = meteorDamage(resolvedSpecs.oneTickPlusMedi * 2);
      const fullManaDamage = meteorDamage(baseMagic);
      return {
        ...monster,
        acChanged,
        acWeight,
        damageIncrease,
        buffWeight,
        hotTimeWeight,
        spiritWeight,
        percent,
        oneTickOneMediDamage,
        twoTickOneMediDamage,
        twoTickTwoMediDamage,
        fullManaDamage,
      };
    });

    const orderedRows = orderedRowsForSkill("meteor", rows);
    return { conversions: c, specs: resolvedSpecs, rows: orderedRows, factorSummary: buildFactorSummary(orderedRows, c, "meteor") };
  }

  function buildFactorSummary(rows, conversions, skill) {
    const firstRow = rows[0];
    const hotValues = rows.map((row) => row.hotTimeWeight);
    const minHot = Math.min(...hotValues);
    const maxHot = Math.max(...hotValues);
    const spiritWeight = firstRow.spiritWeight ?? 1;
    const acChangeTotal =
      skill === "crasher"
        ? conversions.ring1 + conversions.ring2 + conversions.curse + conversions.arc + conversions.abre + conversions.ambush
        : conversions.ring1 + conversions.ring2 + conversions.curse + conversions.arc + conversions.abre + conversions.ambush;
    const acFactors =
      skill === "crasher"
        ? ["반지1", "반지2", "저주", "아크", "아브", "기습"]
        : ["반지1", "반지2", "저주", "아크", "아브", "기습"];
    const buffFactors =
      physicalSkillKeys.has(skill) ? ["속강", "속성(공방)", "움", "집중", "트랩", "나르", "이펙트", "호드/나겔목"] : ["속강", "속성(공방)", "트랩", "나르", "이펙트", "호드/나겔목"];
    return [
      {
        key: "ac",
        label: "AC가중치",
        value: formatNumber(acChangeTotal * -1, 2),
        sub: "AC 변화량 합계",
        factors: acFactors,
      },
      {
        key: "damage",
        label: "데미지증가",
        value: formatNumber(firstRow.damageIncrease, 4),
        sub: "장비 공격 증가 합산",
        factors: ["무기", "악세1", "악세2"],
      },
      {
        key: "buff",
        label: "버프가중치",
        value: formatNumber(firstRow.buffWeight, 4),
        sub: "속성/상태 버프 합산",
        factors: buffFactors,
      },
      {
        key: "hot",
        label: "핫타임",
        value:
          minHot === 1 && maxHot === 1
            ? "-"
            : minHot === maxHot
              ? formatNumber(minHot, 2)
              : `${formatNumber(minHot, 2)} ~ ${formatNumber(maxHot, 2)}`,
        sub: "최종 데미지 곱",
        factors: ["핫타임"],
      },
      {
        key: "spirit",
        label: "정령",
        value: spiritWeight === 1 ? "-" : formatNumber(spiritWeight, 4),
        sub: "최종 데미지 곱",
        factors: ["정령"],
      },
    ];
  }

  function resolveMeteorSpecs(inputState) {
    return { ...inputState.specs };
  }

  function meteorElementValue(name, c) {
    const table = {
      숲철공: 1.35,
      속공: 1.3,
      생암: 1.2,
      "생(암)공": 1.1,
      암방: 0.9,
      "암암(반속)": 0.75,
      중립속성: 1,
    };
    const selected = table[normalizeElementName(name)] || table["암암(반속)"];
    return roundDown(elementFormulaValue(selected, c), 4);
  }

  function getCurrentResult() {
    if (state.skill === "dummy") return calculateDummy(state.dummy);
    return calculateResultForSkill(state.skill);
  }

  function calculateResultForSkill(skill) {
    if (skill === "crasher") return calculateCrasher(state.crasher);
    if (skill === "martial") return calculateMartial(state.martial);
    if (skill === "dummy") return calculateDummy(state.dummy);
    return calculateMeteor(state.meteor);
  }

  function clearMeteorDerivedManuals(key) {
    if (state.skill !== "meteor") return;
    if (!["baseMagic", "meditation", "earring"].includes(key)) return;
    delete state.meteor.specManual.oneTickPlusMedi;
    delete state.meteor.specs.oneTickPlusMedi;
  }

  function clearCrasherSkillConversionManuals(key) {
    if (!physicalSkillKeys.has(state.skill)) return;
    const skillState = getCurrentSkillState();
    if (["madType", "furyLevel", "dashLevel", "downFourWayLevel"].includes(key)) {
      delete skillState.convManual[key];
    }
    if (martialTechniqueDefs.some((technique) => technique.key === key)) {
      delete skillState.convManual[key];
    }
    if (key === "jobType") {
      delete skillState.convManual.madType;
    }
  }

  function getCurrentDefs() {
    if (state.skill === "crasher") return crasherDefs;
    if (state.skill === "martial") return martialDefs;
    if (state.skill === "dummy") return dummyDefs;
    return meteorDefs;
  }

  function getCurrentSkillState() {
    if (state.skill === "dummy") return state.dummy;
    return state[state.skill];
  }

  function elementOptionsForSkill(skill) {
    return physicalSkillKeys.has(skill) ? crasherElements : meteorElements;
  }

  function reverseElementOptionsForSkill() {
    return reverseElements;
  }

  function elementValueForSkill(skill, name, conversions) {
    return physicalSkillKeys.has(skill) ? crasherElementValue(name, conversions) : meteorElementValue(name, conversions);
  }

  function calculateReverseDamage(result, sourceSkill = state.skill, reverseOverride = null) {
    const skillState = state.skill === "dummy" ? state.dummy : state[sourceSkill];
    const reverse = reverseOverride || skillState.reverse || defaultReverseState(sourceSkill);
    const options = reverseElementOptionsForSkill();
    const defaultElement = skillState.specs?.elementAttack || defaults[sourceSkill].specs.elementAttack;
    if (!options.includes(reverse.dummyAttackElement)) {
      reverse.dummyAttackElement = defaultElement;
    }
    if (!options.includes(reverse.targetAttackElement)) {
      reverse.targetAttackElement = defaultElement;
    }

    const dummyDamage = Number(reverse.dummyDamage) || 0;
    const targetAc = Number(reverse.targetAc) || 0;
    const selectedDummyAcFactors = new Set(Array.isArray(reverse.dummyAcFactors) ? reverse.dummyAcFactors : []);
    const selectedDummyBuffFactors = new Set(Array.isArray(reverse.dummyBuffFactors) ? reverse.dummyBuffFactors : []);
    const selectedTargetBuffs = new Set(Array.isArray(reverse.buffs) ? reverse.buffs : []);
    const dummyConversions = {
      ...result.conversions,
      elementBoost: selectedDummyBuffFactors.has("elementBoost") ? result.conversions.elementBoost || 0 : 0,
    };
    const targetConversions = {
      ...result.conversions,
      elementBoost: selectedTargetBuffs.has("속강") ? 1 : 0,
    };
    const dummyElementValue = elementValueForSkill(sourceSkill, reverse.dummyAttackElement, dummyConversions);
    const targetElementValue = elementValueForSkill(sourceSkill, reverse.targetAttackElement, targetConversions);
    const targetElementBuffWeight = targetElementValue >= 1 ? targetElementValue : 0;
    const targetElementDebuffValue = targetElementValue <= 1 && targetElementValue > 0 ? targetElementValue : 0;
    const damageIncrease = result.rows[0]?.damageIncrease ?? 1;
    const dummyAcChanged =
      100 +
      (selectedDummyAcFactors.has("rings") ? (result.conversions.ring1 || 0) + (result.conversions.ring2 || 0) : 0) +
      (selectedDummyAcFactors.has("curse") ? result.conversions.curse || 0 : 0) +
      (selectedDummyAcFactors.has("arc") ? result.conversions.arc || 0 : 0) +
      (selectedDummyAcFactors.has("abre") ? result.conversions.abre || 0 : 0) +
      (selectedDummyAcFactors.has("ambush") ? result.conversions.ambush || 0 : 0);
    const dummyAcWeight = defenseRate(dummyAcChanged);
    const dummyBuffAdditive =
      (selectedDummyBuffFactors.has("move") ? result.conversions.move || 0 : 0) +
      (selectedDummyBuffFactors.has("focus") ? result.conversions.focus || 0 : 0) +
      (selectedDummyBuffFactors.has("trap") ? result.conversions.trap || 0 : 0) +
      (selectedDummyBuffFactors.has("nar") ? result.conversions.nar || 0 : 0);
    const dummyBuffWeight = buffWeightWithElement(dummyElementValue, dummyBuffAdditive);
    const dummyHotTimeWeight = 1 + (Number(reverse.dummyHotTime) || 0) / 100;
    const dummySpiritWeight = 1 + (Number(reverse.dummySpirit) || 0) / 100;
    const originalDivider = dummyAcWeight * damageIncrease * dummyBuffWeight * dummyHotTimeWeight * dummySpiritWeight;
    const baseBuffWeight = targetElementBuffWeight || 1;
    const targetFocusWeight = state.skill === "dummy" || sourceSkill === "martial" ? result.conversions.focus || 0 : 1;
    const selectedBuffWeight =
      baseBuffWeight +
      (selectedTargetBuffs.has("집중") ? targetFocusWeight : 0) +
      (selectedTargetBuffs.has("나르") ? 1 : 0) +
      (selectedTargetBuffs.has("트랩") ? 1 : 0);
    const debuffTotal = reverseDebuffTotal(reverse.debuffs, targetAc, targetElementDebuffValue);
    const targetAcWeight = defenseRate(targetAc);
    const targetHotTimeWeight = 1 + (Number(reverse.targetHotTime) || 0) / 100;
    const targetSpiritWeight = 1 + (Number(reverse.targetSpirit) || 0) / 100;
    const targetPercent = targetAcWeight * damageIncrease * (selectedBuffWeight / debuffTotal) * targetHotTimeWeight * targetSpiritWeight;
    const originalDamage = originalDivider ? dummyDamage / originalDivider : 0;

    return {
      damage: originalDamage * targetPercent,
      originalDamage,
      acWeight: targetAcWeight,
      damageIncrease,
      dummyAcChanged,
      dummyAcWeight,
      dummyBuffWeight,
      dummyHotTimeWeight,
      dummySpiritWeight,
      originalDivider,
      targetPercent,
      selectedBuffWeight,
      targetHotTimeWeight,
      targetSpiritWeight,
      elementDebuffValue: targetElementDebuffValue,
      debuffTotal,
    };
  }

  function reverseDebuffTotal(debuffs = [], targetAc, elementDebuffValue = 0) {
    const selected = new Set(debuffs.filter((debuff) => reverseDebuffs.includes(debuff)));
    const values = reverseDebuffValues(selected, targetAc);
    if (elementDebuffValue) values.push(elementDebuffValue);
    const count = values.length;
    if (!count) return 1;
    const reciprocalTotal = values.reduce((total, value) => total + (value ? 1 / value : 0), 0);
    const overlap = Math.max(0, count - 1);
    const total = reciprocalTotal - overlap;
    return total || 1;
  }

  function reverseDebuffValues(selected, targetAc) {
    const values = [];
    if (selected.has("호르/자보")) values.push(0.5);

    const acDrop = (selected.has("콜라마") ? 10 : 0) + (selected.has("매프") ? 20 : 0);
    if (acDrop) {
      const beforeWeight = defenseRate(targetAc);
      const afterWeight = defenseRate(targetAc - acDrop);
      const value = beforeWeight > 0 && afterWeight > 0 ? afterWeight / beforeWeight : 1;
      values.push(value);
    }
    return values;
  }

  function formatNumber(value, digits = 0) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return "-";
    const factor = 10 ** digits;
    const truncated = Math.trunc(Number(value) * factor) / factor;
    return new Intl.NumberFormat("ko-KR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: digits,
    }).format(truncated);
  }

  function formatInputValue(value) {
    if (typeof value === "number") {
      return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(8)));
    }
    return value ?? "";
  }

  function formatDecimalInputValue(value, digits = 4) {
    if (typeof value !== "number") return formatInputValue(value);
    const factor = 10 ** digits;
    const truncated = Math.trunc(value * factor) / factor;
    return Number.isInteger(truncated) ? String(truncated) : String(Number(truncated.toFixed(digits)));
  }

  function conversionFor(key, result) {
    const map = result.conversions;
    if (key === "jobType") return map.jobType;
    if (key === "madType") return map.madType;
    if (key === "furyLevel") return map.furyLevel;
    if (key === "dashLevel") return map.dashLevel;
    if (key === "downFourWayLevel") return map.downFourWayLevel;
    if (martialTechniqueDefs.some((technique) => technique.key === key)) return map[key];
    if (state.skill === "dummy" && ["basePhysical", "weaponMin", "weaponMax", "str", "con", "dex", "int", "damage"].includes(key)) {
      return "";
    }
    if (key === "basePhysical") return map.flatPhysical;
    if (key === "baseMagic") {
      if (state.skill === "meteor") return result.specs.oneTick;
      if (state.skill === "martial" || state.skill === "dummy") return map.oneTick;
      return "";
    }
    if (key === "meditation" && state.skill === "meteor") return map.oneTick;
    if (key === "str" || key === "con") return "";
    return map[key] ?? "";
  }

  function editableConversionKeysForSkill(skill) {
    if (skill === "crasher") {
      return new Set(["basePhysical", "madType", "furyLevel", "dashLevel", "downFourWayLevel", "hotTime"]);
    }
    if (skill === "martial") {
      return new Set(["basePhysical", ...martialInputTechniqueDefs.map((technique) => technique.key), "hotTime"]);
    }
    if (skill === "dummy") {
      return new Set(["hotTime"]);
    }
    return new Set(["meditation", "hotTime"]);
  }

  function readonlyConversionKeysForSkill(skill) {
    const defs = skill === "crasher" ? crasherDefs : skill === "martial" ? martialDefs : skill === "dummy" ? dummyDefs : meteorDefs;
    const editable = editableConversionKeysForSkill(skill);
    return defs
      .filter((def) => def.key && !editable.has(def.key))
      .map((def) => def.key);
  }

  function isReadonlyConversionKey(key) {
    return !editableConversionKeysForSkill(state.skill).has(key);
  }

  function formatConversionInputValue(key, value) {
    if (key === "dashLevel" || martialTechniqueDefs.some((technique) => technique.key === key)) return formatDecimalInputValue(value, 2);
    return formatDecimalInputValue(value, 4);
  }

  function conversionSuffix(key) {
    if (physicalSkillKeys.has(state.skill) && key === "basePhysical") return "추뎀";
    if ((state.skill === "meteor" || state.skill === "martial" || state.skill === "dummy") && key === "baseMagic") return "1틱";
    if (state.skill === "meteor" && key === "meditation") return "1틱";
    return "";
  }

  function convertedBinding(def) {
    if (state.skill === "meteor" && def.key === "baseMagic") {
      return { kind: "spec", key: "oneTick" };
    }
    return { kind: "conv", key: def.key };
  }

  function render() {
    normalizeDummyState();
    const skillState = getCurrentSkillState();
    const result = getCurrentResult();
    document.getElementById("inputMode").textContent = skillLabels[state.skill];
    document.getElementById("resultMode").textContent = skillLabels[state.skill];
    document.querySelector(".result-heading h2").textContent = state.skill === "dummy" ? "계산 도구" : "데미지 계산";
    document.querySelector(".workspace").classList.toggle("dummy-workspace", state.skill === "dummy");
    document.querySelector(".input-panel").hidden = false;
    if (state.skill === "dummy") {
      renderInputs(state.dummy.specs, result);
      renderDummyTools(result);
    } else {
      const specs = state.skill === "meteor" ? result.specs : skillState.specs;
      renderInputs(specs, result);
      renderResults(result);
      renderSummary(result);
      document.getElementById("reversePanel").innerHTML = "";
    }
    renderMonsterSectionOptions();
    document.querySelectorAll(".skill-tab").forEach((button) => {
      const active = button.dataset.skill === state.skill;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  function renderMonsterSectionOptions() {
    const options = new Set(["백유", "나겔링", "연습장"]);
    for (const skill of skillKeys) {
      for (const monster of state[skill].customMonsters || []) {
        if (monster.section) options.add(monster.section);
      }
    }
    document.getElementById("monsterSectionOptions").innerHTML = Array.from(options)
      .map((section) => `<option value="${section}"></option>`)
      .join("");
  }

  function renderSectionOrderList() {
    const result = getCurrentResult();
    const counts = result.rows.reduce((acc, row) => {
      acc.set(row.section, (acc.get(row.section) || 0) + 1);
      return acc;
    }, new Map());
    const order = state[state.skill].sectionOrder || [];
    document.getElementById("sectionOrderList").innerHTML = order
      .filter((section) => counts.has(section))
      .map((section, index) => `<div class="section-order-item">
        <span class="section-order-name">${section}</span>
        <span class="section-order-count">${counts.get(section)}개</span>
        <button class="section-order-button" type="button" data-section-move="up" data-section-index="${index}" ${index === 0 ? "disabled" : ""}>▲</button>
        <button class="section-order-button" type="button" data-section-move="down" data-section-index="${index}" ${index === order.length - 1 ? "disabled" : ""}>▼</button>
      </div>`)
      .join("");
  }

  function moveSection(index, direction) {
    const skillState = getCurrentSkillState();
    const order = [...(skillState.sectionOrder || [])];
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || nextIndex < 0 || nextIndex >= order.length) return;
    [order[index], order[nextIndex]] = [order[nextIndex], order[index]];
    skillState.sectionOrder = order;
    saveState();
    render();
    renderSectionOrderList();
  }

  function appendSectionOrder(skillState, section) {
    if (!skillState.sectionOrder) skillState.sectionOrder = [];
    if (!skillState.sectionOrder.includes(section)) skillState.sectionOrder.push(section);
  }

  function toggleSectionCollapse(section) {
    const skillState = getCurrentSkillState();
    const collapsed = new Set(skillState.collapsedSections || []);
    if (collapsed.has(section)) {
      collapsed.delete(section);
    } else {
      collapsed.add(section);
    }
    skillState.collapsedSections = Array.from(collapsed);
    saveState();
    render();
  }

  function cycleResultFontScale() {
    const skillState = getCurrentSkillState();
    const current = resultFontScales.includes(Number(skillState.resultFontScale))
      ? Number(skillState.resultFontScale)
      : 100;
    const next = resultFontScales[(resultFontScales.indexOf(current) + 1) % resultFontScales.length];
    skillState.resultFontScale = next;
    saveState();
    render();
  }

  function renderInputs(specs, result) {
    const rows = [];
    if (state.skill === "dummy") {
      rows.push(`<tr class="dummy-import-row"><td colspan="3">${renderDummyImportBar()}</td></tr>`);
    }
    for (const def of getCurrentDefs()) {
      if (def.section) {
        rows.push(`<tr class="section-row"><td colspan="3">${def.section}</td></tr>`);
        continue;
      }
      rows.push(renderInputRow(def, specs, result));
      if (state.skill === "meteor" && def.key === "meditation") {
        rows.push(renderMeteorHelperRow("메디 회복량", "conv", "meditation", result.conversions.meditation));
        rows.push(renderMeteorHelperRow("1틱 + 메디", "spec", "oneTickPlusMedi", result.specs.oneTickPlusMedi));
      }
    }
    document.getElementById("inputRows").innerHTML = rows.join("");
  }

  function renderDummyImportBar() {
    return `<div class="dummy-import-bar" aria-label="다른 탭 입력값 불러오기">
      <span>입력값 불러오기</span>
      ${skillKeys
        .map((skill) => `<button class="dummy-import-button" type="button" data-dummy-import="${skill}">${skillLabels[skill]}</button>`)
        .join("")}
    </div>`;
  }

  function renderInputRow(def, specs, result) {
    const specControl = renderSpecControl(def, specs);
    const converted = conversionFor(def.key, result);
    const binding = convertedBinding(def);
    const suffix = conversionSuffix(def.key);
    const convertedInput =
      converted === ""
        ? `<input class="field-control converted" data-kind="conv" data-key="${def.key}" type="text" value="-" disabled />`
        : isReadonlyConversionKey(def.key)
          ? `<input class="field-control converted${suffix ? " has-suffix" : ""}" type="number" value="${formatConversionInputValue(def.key, converted)}" disabled />`
          : `<input class="field-control converted${suffix ? " has-suffix" : ""}" data-kind="${binding.kind}" data-key="${binding.key}" type="number" step="any" value="${formatConversionInputValue(
              def.key,
              converted,
            )}" />`;
    const convertedControl =
      suffix && converted !== ""
        ? `<div class="field-with-suffix suffix-wide">${convertedInput}<span class="input-suffix">${suffix}</span></div>`
        : convertedInput;
    const factorClass = factorClassName(def.factors);
    const chips = renderFactorDots(def.factors);
    return `<tr class="${factorClass}"><td class="field-label">${def.label}${chips}</td><td>${specControl}</td><td>${convertedControl}</td></tr>`;
  }

  function renderSpecControl(def, specs) {
    if (state.skill === "crasher" && def.key === "downFourWayLevel") {
      return `<button class="field-control calibrate-button" type="button" data-open-down-fourway>비율 입력</button>`;
    }

    if (def.type === "select") {
      return `<select class="field-control" data-kind="spec" data-key="${def.key}">${def.options
        .map((option) => `<option value="${option}" ${String(specs[def.key]) === String(option) ? "selected" : ""}>${option}</option>`)
        .join("")}</select>`;
    }

    const suffix = specSuffix(def.key);
    const input = `<input class="field-control${suffix ? " has-suffix" : ""}" data-kind="spec" data-key="${def.key}" type="number" step="any" value="${formatInputValue(
      specs[def.key],
    )}" />`;
    if (!suffix) return input;
    return `<div class="field-with-suffix${suffix.length > 1 ? " suffix-wide" : ""}">${input}<span class="input-suffix">${suffix}</span></div>`;
  }

  function specSuffix(key) {
    const suffixes = {
      manaReduction: "%",
      spirit: "%",
      damage: "%",
    };
    return suffixes[key] || "";
  }

  function renderMeteorHelperRow(label, kind, key, value, options = {}) {
    const binding = options.readonly ? "" : ` data-kind="${kind}" data-key="${key}"`;
    const readonly = options.readonly ? " readonly aria-readonly=\"true\"" : "";
    const displayValue = kind === "conv" ? formatConversionInputValue(key, value) : formatInputValue(value);
    return `<tr class="helper-row">
      <td colspan="3">
        <label class="inline-helper">
          <span class="helper-label">${label}</span>
          <span class="helper-colon">:</span>
          <input class="field-control helper-input" type="number" step="any"${binding} value="${displayValue}"${readonly} />
        </label>
      </td>
    </tr>`;
  }

  function renderDownFourWayDialog() {
    const values = state.crasher.downFourWay || defaultDownFourWayState();
    const fields = {
      furyDamage: document.getElementById("downFourWayFuryDamage"),
      fourWayDamage: document.getElementById("downFourWayFourWayDamage"),
      downDamage: document.getElementById("downFourWayDownDamage"),
    };
    for (const [key, input] of Object.entries(fields)) {
      if (input) input.value = formatInputValue(values[key]);
    }
    renderDownFourWaySummary();
  }

  function renderDownFourWaySummary() {
    const values = state.crasher.downFourWay || defaultDownFourWayState();
    const furyDamage = Number(values.furyDamage) || 0;
    const fourWayRatio = furyDamage ? (Number(values.fourWayDamage) || 0) / furyDamage : 0;
    const downRatio = furyDamage ? (Number(values.downDamage) || 0) / furyDamage : 0;
    const totalRatio = fourWayRatio + downRatio;
    const summary = document.getElementById("downFourWaySummary");
    if (!summary) return;
    summary.innerHTML = `
      <span>사방 ${formatNumber(fourWayRatio, 4)}</span>
      <span>내려 ${formatNumber(downRatio, 4)}</span>
      <strong>합산 ${formatNumber(totalRatio, 4)}</strong>
    `;
  }

  function renderResults(result) {
    const container = document.querySelector(".result-table-wrap");
    if (state.skill === "crasher") {
      const jobType = state.crasher.specs.jobType;
      const isPure = jobType === "순수";
      const hideJobSkill = jobType === "직전/법전";
      const crasherLabel = isPure ? "데빌" : "크래셔";
      const jobSkillLabel = isPure ? "대쉬" : "암살";
      const damageIncludes = result.damageIncludes || normalizeCrasherDamageIncludes(state.crasher.damageIncludes);
      const jobSkillHeader = isPure
        ? renderDashStackHeader({ includeToggle: true, damageIncludes })
        : renderCrasherDamageHeader("jobSkill", jobSkillLabel, damageIncludes);
      const headers = [
        "몬스터",
        "기존 AC",
        "AC변화",
        "AC가중치",
        "데미지증가",
        "버프가중치",
        "핫타임",
        "퍼센트",
        renderCrasherDamageHeader("mad", "매드", damageIncludes),
        renderCrasherDamageHeader("crasher", crasherLabel, damageIncludes),
        renderCrasherDamageHeader("fury", "퓨리", damageIncludes),
        renderCrasherDamageHeader("downFourWay", "내려/사방", damageIncludes),
      ];
      if (!hideJobSkill) headers.push(jobSkillHeader);
      headers.push("합계", "비고");
      container.innerHTML = renderGroupedTables(result.rows, {
        tableClass: "crasher-result",
        colWidths: hideJobSkill
          ? [7.2, 5.8, 6.0, 6.4, 6.8, 7.0, 4.8, 6.2, 8.0, 8.0, 8.0, 8.0, 8.2, 9.6]
          : [6.6, 5.4, 5.6, 6.0, 6.4, 6.6, 4.4, 5.8, 7.4, 7.4, 7.4, 7.4, 7.2, 7.6, 8.8],
        colKinds: hideJobSkill
          ? ["", "", "", "", "", "", "", "", "damage", "damage", "damage", "damage", "damage", ""]
          : ["", "", "", "", "", "", "", "", "damage", "damage", "damage", "damage", "damage", "damage", ""],
        headers,
        rowRenderer: (row) => {
          const note =
            row.custom && row.hp
              ? shotNote(row.totalDamage, row.hp)
              : row.kind === "boss"
              ? row.balrogShot > 0
                ? `<span class="damage-warn">${formatNumber(row.balrogShot)} 남음</span>`
                : `<span class="damage-note">발록 샷</span>`
              : "";
          const deleteButton = row.custom ? `<button class="delete-monster" type="button" data-monster-id="${row.id}">삭제</button>` : "";
          const mobileDashControl = isPure ? `<span class="mobile-dash-stack-label">${renderDashStackHeader()}</span>` : "";
          const jobSkillCellClass = isPure ? "damage-strong dash-stack-cell" : "damage-strong";
          const jobSkillCell = hideJobSkill
            ? ""
            : `<td data-label="${jobSkillLabel}" class="${jobSkillCellClass}">${mobileDashControl}<span class="dash-stack-damage">${formatIncludedCrasherDamage(row, row.jobSkillDamage, damageIncludes.jobSkill)}</span></td>`;
          return `<tr>
            <td data-label="몬스터">${row.name}${deleteButton}</td>
            <td data-label="기존 AC">${formatNumber(row.ac, 2)}</td>
            <td data-label="AC변화" class="factor-ac">${formatNumber(row.acChanged, 2)}</td>
            <td data-label="AC가중치" class="factor-ac">${formatNumber(row.acWeight, 4)}</td>
            <td data-label="데미지증가" class="factor-damage">${formatNumber(row.damageIncrease, 4)}</td>
            <td data-label="버프가중치" class="factor-buff">${formatNumber(row.buffWeight, 4)}</td>
            <td data-label="핫타임" class="factor-hot">${formatHotTimeWeight(row.hotTimeWeight)}</td>
            <td data-label="퍼센트">${formatNumber(row.percent, 4)}</td>
            <td data-label="매드" class="damage-strong">${formatIncludedCrasherDamage(row, row.mad, damageIncludes.mad)}</td>
            <td data-label="${crasherLabel}" class="damage-strong">${formatIncludedCrasherDamage(row, row.crasher, damageIncludes.crasher)}</td>
            <td data-label="퓨리" class="damage-strong">${formatIncludedCrasherDamage(row, row.fury, damageIncludes.fury)}</td>
            <td data-label="내려/사방" class="damage-strong">${formatIncludedCrasherDamage(row, row.downFourWayDamage, damageIncludes.downFourWay)}</td>
            ${jobSkillCell}
            <td data-label="합계" class="damage-total">${formatNumber(row.totalDamage)}</td>
            <td data-label="비고">${note}</td>
          </tr>`;
        },
      });
      return;
    }

    if (state.skill === "martial") {
      const damageIncludes = result.damageIncludes || normalizeMartialDamageIncludes(state.martial.damageIncludes);
      const headers = [
        "몬스터",
        "기존 AC",
        "AC변화",
        "AC가중치",
        "데미지증가",
        "버프가중치",
        "핫타임",
        "퍼센트",
        ...martialTechniqueDefs.map((technique) =>
          technique.damageKey === "dara"
            ? renderDaraDamageHeader(damageIncludes)
            : renderCrasherDamageHeader(technique.damageKey, technique.label, damageIncludes),
        ),
        "합계",
        "비고",
      ];
      container.innerHTML = renderGroupedTables(result.rows, {
        tableClass: "martial-result",
        colWidths: [6.4, 5.2, 5.4, 5.8, 6.2, 6.4, 4.2, 5.6, 6.7, 6.7, 6.7, 6.7, 6.7, 6.7, 7.2, 7.4],
        colKinds: ["", "", "", "", "", "", "", "", "damage", "damage", "damage", "damage", "damage", "damage", "damage", ""],
        headers,
        rowRenderer: (row) => {
          const note =
            row.custom && row.hp
              ? shotNote(row.totalDamage, row.hp)
              : row.kind === "boss"
              ? row.balrogShot > 0
                ? `<span class="damage-warn">${formatNumber(row.balrogShot)} 남음</span>`
                : `<span class="damage-note">발록 샷</span>`
              : "";
          const deleteButton = row.custom ? `<button class="delete-monster" type="button" data-monster-id="${row.id}">삭제</button>` : "";
          const damageCells = martialTechniqueDefs
            .map(
              (technique) =>
                `<td data-label="${technique.label}" class="damage-strong">${formatIncludedCrasherDamage(
                  row,
                  row.damages[technique.damageKey],
                  damageIncludes[technique.damageKey],
                )}</td>`,
            )
            .join("");
          return `<tr>
            <td data-label="몬스터">${row.name}${deleteButton}</td>
            <td data-label="기존 AC">${formatNumber(row.ac, 2)}</td>
            <td data-label="AC변화" class="factor-ac">${formatNumber(row.acChanged, 2)}</td>
            <td data-label="AC가중치" class="factor-ac">${formatNumber(row.acWeight, 4)}</td>
            <td data-label="데미지증가" class="factor-damage">${formatNumber(row.damageIncrease, 4)}</td>
            <td data-label="버프가중치" class="factor-buff">${formatNumber(row.buffWeight, 4)}</td>
            <td data-label="핫타임" class="factor-hot">${formatHotTimeWeight(row.hotTimeWeight)}</td>
            <td data-label="퍼센트">${formatNumber(row.percent, 4)}</td>
            ${damageCells}
            <td data-label="합계" class="damage-total">${formatNumber(row.totalDamage)}</td>
            <td data-label="비고">${note}</td>
          </tr>`;
        },
      });
      return;
    }

    container.innerHTML = renderGroupedTables(result.rows, {
      tableClass: "meteor-result",
      colWidths: [8.8, 5.8, 6.0, 6.5, 6.8, 7.0, 4.8, 6.2, 12.0, 12.0, 12.0, 12.1],
      colKinds: ["", "", "", "", "", "", "", "", "damage", "damage", "damage", "damage"],
      headerHtml: `<tr>
        <th rowspan="2">몬스터</th>
        <th rowspan="2">기존 AC</th>
        <th rowspan="2">AC변화</th>
        <th rowspan="2">AC가중치</th>
        <th rowspan="2">데미지증가</th>
        <th rowspan="2">버프가중치</th>
        <th rowspan="2">핫타임</th>
        <th rowspan="2">퍼센트</th>
        <th class="merged-meteor-head" colspan="4">메테오</th>
      </tr>
      <tr>
        <th class="col-damage">1틱+1메디</th>
        <th class="col-damage">2틱+1메디</th>
        <th class="col-damage">2틱+2메디</th>
        <th class="col-damage">풀마</th>
      </tr>`,
      rowRenderer: (row) => {
        return `<tr>
          <td data-label="몬스터">${row.name}${row.custom ? `<button class="delete-monster" type="button" data-monster-id="${row.id}">삭제</button>` : ""}</td>
          <td data-label="기존 AC">${formatNumber(row.ac, 2)}</td>
          <td data-label="AC변화" class="factor-ac">${formatNumber(row.acChanged, 2)}</td>
          <td data-label="AC가중치" class="factor-ac">${formatNumber(row.acWeight, 4)}</td>
          <td data-label="데미지증가" class="factor-damage">${formatNumber(row.damageIncrease, 4)}</td>
          <td data-label="버프가중치" class="factor-buff">${formatNumber(row.buffWeight, 4)}</td>
          <td data-label="핫타임" class="factor-hot">${formatHotTimeWeight(row.hotTimeWeight)}</td>
          <td data-label="퍼센트">${formatNumber(row.percent, 4)}</td>
          <td data-label="1틱+1메디" class="damage-strong">${formatMeteorDamage(row, row.oneTickOneMediDamage)}</td>
          <td data-label="2틱+1메디" class="damage-strong">${formatMeteorDamage(row, row.twoTickOneMediDamage)}</td>
          <td data-label="2틱+2메디" class="damage-strong">${formatMeteorDamage(row, row.twoTickTwoMediDamage)}</td>
          <td data-label="풀마" class="damage-main">${formatMeteorDamage(row, row.fullManaDamage)}</td>
        </tr>`;
      },
    });
  }

  function formatCrasherDamage(row, value) {
    const defaultNagelringShot = row.section === "나겔링" && value >= crasherNagelringShotHp;
    const customShot = row.custom && row.hp && value >= row.hp;
    return `${defaultNagelringShot || customShot ? '<span class="shot-mark">[샷]</span> ' : ""}${formatNumber(value)}`;
  }

  function formatIncludedCrasherDamage(row, value, included) {
    return included ? formatCrasherDamage(row, value) : "-";
  }

  function renderCrasherDamageHeader(key, label, damageIncludes) {
    const checked = damageIncludes?.[key] !== false ? "checked" : "";
    return `<label class="crasher-damage-head">
      <input class="crasher-damage-check" type="checkbox" data-crasher-damage-include="${key}" ${checked} aria-label="${label} 합계 포함">
      <span>${label}</span>
    </label>`;
  }

  function renderDaraDamageHeader(damageIncludes) {
    const current = martialDaraManaModes.includes(state.martial.daraManaMode)
      ? state.martial.daraManaMode
      : defaults.martial.daraManaMode;
    const manaOptions = martialDaraManaModes
      .map((value) => `<option value="${value}" ${value === current ? "selected" : ""}>${value}</option>`)
      .join("");
    return `<span class="dash-stack-head dash-stack-head-checked">
      <input class="crasher-damage-check" type="checkbox" data-crasher-damage-include="dara" ${damageIncludes?.dara !== false ? "checked" : ""} aria-label="다라 합계 포함">
      <span class="dash-stack-control">
        <span>다라</span>
        <span class="dara-mana-select-wrap">
          <select class="dara-mana-select" data-dara-mana-mode aria-label="다라 마나 기준">${manaOptions}</select>
        </span>
      </span>
    </span>`;
  }

  function formatMeteorDamage(row, value) {
    const defaultBaekyuShot = row.name === "백유고층" && value >= 654732;
    const customShot = row.custom && row.hp && value >= row.hp;
    return `${defaultBaekyuShot || customShot ? '<span class="shot-mark">[샷]</span> ' : ""}${formatNumber(value)}`;
  }

  function formatHotTimeWeight(value) {
    return value === 1 ? "-" : formatNumber(value, 2);
  }

  function renderDashStackHeader(options = {}) {
    const current = clampInt(state.crasher.dashStacks, 1, 6, 1);
    const stackOptions = [1, 2, 3, 4, 5, 6]
      .map((value) => `<option value="${value}" ${value === current ? "selected" : ""}>${value}</option>`)
      .join("");
    const includeToggle = options.includeToggle
      ? `<input class="crasher-damage-check" type="checkbox" data-crasher-damage-include="jobSkill" ${options.damageIncludes?.jobSkill !== false ? "checked" : ""} aria-label="대쉬 합계 포함">`
      : "";
    const stackControl = `<span class="dash-stack-control">
      <span>대쉬</span>
      <span class="dash-stack-select-wrap">
        <select class="dash-stack-select" data-dash-stack aria-label="대쉬 중첩수">${stackOptions}</select>
      </span>
      <span class="dash-stack-unit">중</span>
    </span>`;
    if (options.includeToggle) {
      return `<span class="dash-stack-head dash-stack-head-checked">
        ${includeToggle}
        ${stackControl}
      </span>`;
    }
    return `<span class="dash-stack-head">${stackControl}</span>`;
  }

  function escapeAttribute(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[char]);
  }

  function renderGroupedTables(rows, config) {
    const skillState = getCurrentSkillState();
    const collapsedSections = new Set(skillState.collapsedSections || []);
    const resultFontScale = resultFontScales.includes(Number(skillState.resultFontScale))
      ? Number(skillState.resultFontScale)
      : 100;
    const grouped = rows.reduce((acc, row) => {
      if (!acc.has(row.section)) acc.set(row.section, []);
      acc.get(row.section).push(row);
      return acc;
    }, new Map());
    return Array.from(grouped.entries())
      .map(
        ([section, sectionRows]) => {
          const collapsed = collapsedSections.has(section);
          const sectionKey = encodeURIComponent(section);
          const safeSection = escapeAttribute(section);
          return `<section class="monster-group${collapsed ? " is-collapsed" : ""}">
          <div class="monster-group-title">
            <span class="section-tag">${safeSection}</span>
            <strong>${sectionRows.length}개 대상</strong>
            ${renderSectionInfoButton(section)}
            <button class="section-font-button" type="button" data-result-font-scale title="결과표 글자 크기 조정">
              글자 ${resultFontScale}%
            </button>
            <button class="section-toggle-button" type="button" data-section-toggle="${sectionKey}" aria-expanded="${String(!collapsed)}">
              <span class="toggle-icon" aria-hidden="true">${collapsed ? "▸" : "▾"}</span>
              <span>${collapsed ? "펼치기" : "접기"}</span>
            </button>
          </div>
          <table class="result-table ${config.tableClass} font-scale-${resultFontScale}"${collapsed ? " hidden" : ""}>
            ${
              config.colWidths
                ? `<colgroup>${config.colWidths
                    .map((width, index) => {
                      const kind = config.colKinds?.[index] || "";
                      const className = kind ? ` class="col-${kind}"` : "";
                      const style = kind === "damage" ? "" : ` style="width: ${width}%"`;
                      return `<col${className}${style}>`;
                    })
                    .join("")}</colgroup>`
                : ""
            }
            <thead>${
              config.headerHtml ||
              `<tr>${config.headers
                .map((header, index) => `<th${config.colKinds?.[index] ? ` class="col-${config.colKinds[index]}"` : ""}>${header}</th>`)
                .join("")}</tr>`
            }</thead>
            <tbody>${sectionRows.map(config.rowRenderer).join("")}</tbody>
          </table>
        </section>`;
        },
      )
      .join("") + `<div class="monster-add-row">
        <button class="monster-add-button" type="button" id="openMonsterDialog">몬스터 추가</button>
        <button class="monster-add-button" type="button" id="openSectionOrderDialog">순서 변경</button>
      </div>`;
  }

  function renderSectionInfoButton(section) {
    if (state.skill === "meteor" && section === "백유") {
      return `<button class="section-info-button" type="button" id="openBaekyuInfoDialog">몬스터 정보</button>`;
    }
    return "";
  }

  function renderSummary(result) {
    document.getElementById("summaryStrip").innerHTML = result.factorSummary
      .map(
        (item) => `<div class="summary-item factor-card factor-${item.key}">
          <div class="summary-label">${item.label}</div>
          <div class="summary-value">${item.value}</div>
          <div class="summary-sub">${item.sub}</div>
          <div class="factor-chip-row">${item.factors.map((factor) => `<span>${factor}</span>`).join("")}</div>
        </div>`,
      )
      .join("");
  }

  function renderDummyTools(result) {
    document.querySelector(".result-table-wrap").innerHTML = `
      <div class="dummy-tools" id="dummyToolSurface">
        <div id="dummyReverseSurface"></div>
      </div>`;
    document.getElementById("summaryStrip").innerHTML = "";
    document.getElementById("reversePanel").innerHTML = "";
    renderReverseCalculator(result, "dummyReverseSurface");
  }

  function coefficientStatBase(coefficient) {
    const specs = state.dummy.specs || defaultDummySpecs();
    const selectedStats = Array.isArray(coefficient.stats) ? coefficient.stats : [];
    const values = selectedStats.map((key) => Number(specs[key]) || 0);
    if (!values.length) return 0;
    if (coefficient.operator === "sum") {
      return values.reduce((total, value) => total + value, 0);
    }
    return values.reduce((total, value) => total * value, 1);
  }

  function calculateCoefficientEstimate(result, sourceSkill) {
    const coefficient = state.dummy.coefficient || defaultDummyState().coefficient;
    const damage = Number(coefficient.damage) || 0;
    const necklaceBonus = Number(coefficient.necklaceBonus) || 0;
    const adjustedDamage = Math.max(0, damage - necklaceBonus);
    const reverse = {
      ...state.dummy.reverse,
      dummyDamage: adjustedDamage,
      dummyAttackElement: coefficient.attackElement,
      dummyAcFactors: coefficient.dummyAcFactors,
      dummyBuffFactors: coefficient.dummyBuffFactors,
      dummyHotTime: coefficient.dummyHotTime,
      dummySpirit: coefficient.dummySpirit,
    };
    const calculation = calculateReverseDamage(result, sourceSkill, reverse);
    const statBase = coefficientStatBase(coefficient);
    const abilityWeight = coefficient.useAbility ? result.conversions.ability || 1 : 1;
    const denominator = statBase * abilityWeight;
    return {
      ...calculation,
      statBase,
      abilityWeight,
      necklaceBonus,
      adjustedDamage,
      denominator,
      coefficient: denominator ? calculation.originalDamage / denominator : 0,
    };
  }

  function renderCoefficientEstimator(result, sourceSkill) {
    const coefficient = state.dummy.coefficient || defaultDummyState().coefficient;
    const estimate = calculateCoefficientEstimate(result, sourceSkill);
    const selectedStats = new Set(coefficient.stats || []);
    const selectedCoefficientAcFactors = new Set(coefficient.dummyAcFactors || []);
    const selectedCoefficientBuffFactors = new Set(coefficient.dummyBuffFactors || []);
    const collapsed = Boolean(state.dummy.collapsedCards?.coefficient);
    return `<section class="reverse-card estimate-card">
      <div class="reverse-heading">
        <div>
          <p class="eyebrow">Skill Coefficient</p>
          <h2>기술 계수 측정</h2>
        </div>
        <div class="reverse-heading-actions">
          <div class="reverse-output-group">
            <div class="reverse-output">
              <span>원 데미지</span>
              <strong>${formatNumber(estimate.originalDamage)}</strong>
            </div>
          </div>
          <button class="card-toggle-button" type="button" data-dummy-card-toggle="coefficient" aria-expanded="${!collapsed}">
            ${collapsed ? "펼치기" : "접기"}
          </button>
        </div>
      </div>
      <div class="coefficient-layout" ${collapsed ? "hidden" : ""}>
        <section class="coefficient-group coefficient-input-group">
          <h3>측정값</h3>
          <div class="reverse-grid coefficient-field-grid">
            <label class="reverse-field">
              <span>허수아비가 입은 데미지</span>
              <input class="field-control" data-estimate-key="damage" type="number" step="any" value="${formatInputValue(coefficient.damage)}" />
            </label>
            <label class="reverse-field">
              <span>목걸이추뎀</span>
              <input class="field-control" data-estimate-key="necklaceBonus" type="number" step="any" value="${formatInputValue(coefficient.necklaceBonus)}" />
            </label>
            <label class="reverse-field">
              <span>속성</span>
              <select class="field-control" data-estimate-key="attackElement">
                ${coefficientElements
                  .map(
                    (option) =>
                      `<option value="${option.value}" ${String(coefficient.attackElement) === String(option.value) ? "selected" : ""}>${option.label}</option>`,
                  )
                  .join("")}
              </select>
            </label>
          </div>
        </section>
        <section class="coefficient-group coefficient-stat-group">
          <h3>스탯 조건</h3>
          <div class="coefficient-check-layout">
            <fieldset class="reverse-check-group coefficient-check-group">
              <legend>반영 스탯</legend>
              ${coefficientStats
                .map(
                  (stat) => `<label class="reverse-check">
                    <input type="checkbox" data-estimate-stat="${stat.key}" ${selectedStats.has(stat.key) ? "checked" : ""} />
                    <span>${stat.label}</span>
                  </label>`,
                )
                .join("")}
            </fieldset>
            <fieldset class="reverse-check-group coefficient-check-group">
              <legend>스탯 관계</legend>
              ${coefficientOperators
                .map(
                  (operator) => `<label class="reverse-check">
                    <input type="radio" name="coefficientOperator" data-estimate-operator="${operator.key}" ${coefficient.operator === operator.key ? "checked" : ""} />
                    <span>${operator.label}</span>
                  </label>`,
                )
                .join("")}
            </fieldset>
          </div>
        </section>
        <section class="coefficient-group coefficient-weight-group">
          <h3>가중치</h3>
          <div class="coefficient-weight-layout">
            <fieldset class="reverse-check-group coefficient-check-group coefficient-ability-group">
              <legend>어빌</legend>
              <label class="reverse-check">
                <input type="checkbox" data-estimate-ability ${coefficient.useAbility ? "checked" : ""} />
                <span>어빌가중치 적용</span>
              </label>
            </fieldset>
            <fieldset class="reverse-check-group coefficient-check-group">
              <legend>AC가중치 적용</legend>
              ${reverseDummyAcFactors
                .map(
                  (factor) => `<label class="reverse-check">
                    <input type="checkbox" data-estimate-dummy-ac="${factor.key}" ${selectedCoefficientAcFactors.has(factor.key) ? "checked" : ""} />
                    <span>${factor.label}</span>
                  </label>`,
                )
                .join("")}
            </fieldset>
            <fieldset class="reverse-check-group coefficient-check-group">
              <legend>버프가중치 적용</legend>
              ${reverseDummyBuffFactors
                .map(
                  (factor) => `<label class="reverse-check">
                    <input type="checkbox" data-estimate-dummy-buff="${factor.key}" ${selectedCoefficientBuffFactors.has(factor.key) ? "checked" : ""} />
                    <span>${factor.label}</span>
                  </label>`,
                )
                .join("")}
            </fieldset>
            <fieldset class="reverse-check-group coefficient-check-group">
              <legend>기타</legend>
              <div class="reverse-grid coefficient-field-grid">
                <label class="reverse-field">
                  <span>핫타임(%)</span>
                  <input class="field-control" data-estimate-key="dummyHotTime" type="number" step="any" value="${formatInputValue(coefficient.dummyHotTime)}" />
                </label>
                <label class="reverse-field">
                  <span>정령 %</span>
                  <input class="field-control" data-estimate-key="dummySpirit" type="number" step="any" value="${formatInputValue(coefficient.dummySpirit)}" />
                </label>
              </div>
            </fieldset>
          </div>
        </section>
        <section class="coefficient-group coefficient-output-group">
          <h3>계산 결과</h3>
          <div class="coefficient-output-grid">
            <div class="reverse-output coefficient-output">
              <span>보정 데미지</span>
              <strong>${formatNumber(estimate.adjustedDamage)}</strong>
            </div>
            <div class="reverse-output coefficient-output">
              <span>스탯 연산값</span>
              <strong>${formatNumber(estimate.statBase, 4)}</strong>
            </div>
            <div class="reverse-output coefficient-output">
              <span>어빌가중치</span>
              <strong>${coefficient.useAbility ? formatNumber(estimate.abilityWeight, 4) : "-"}</strong>
            </div>
            <div class="reverse-output coefficient-output coefficient-result">
              <span>추정 계수</span>
              <strong>${estimate.denominator ? formatNumber(estimate.coefficient, 6) : "-"}</strong>
            </div>
          </div>
        </section>
      </div>
    </section>`;
  }

  function renderReverseCalculator(result, targetId = "reversePanel") {
    const target = document.getElementById(targetId);
    if (!target) return;
    const sourceSkill = "martial";
    const reverse = state.dummy.reverse || defaultReverseState(sourceSkill);
    const calculation = calculateReverseDamage(result, sourceSkill, reverse);
    const elementOptions = reverseElementOptionsForSkill();
    const selectedBuffs = new Set(reverse.buffs || []);
    const selectedDebuffs = new Set(reverse.debuffs || []);
    const selectedDummyAcFactors = new Set(reverse.dummyAcFactors || []);
    const selectedDummyBuffFactors = new Set(reverse.dummyBuffFactors || []);
    const collapsed = Boolean(state.dummy.collapsedCards?.reverse);
    target.innerHTML = `
      <section class="reverse-card">
      <div class="reverse-heading">
        <div>
          <p class="eyebrow">Dummy Reverse</p>
          <h2>허수아비 역산</h2>
        </div>
        <div class="reverse-heading-actions">
          <div class="reverse-output-group">
            <div class="reverse-output">
              <span>원 데미지</span>
              <strong>${formatNumber(calculation.originalDamage)}</strong>
            </div>
            <div class="reverse-output">
              <span>계산된 데미지</span>
              <strong>${formatNumber(calculation.damage)}</strong>
            </div>
          </div>
          <button class="card-toggle-button" type="button" data-dummy-card-toggle="reverse" aria-expanded="${!collapsed}">
            ${collapsed ? "펼치기" : "접기"}
          </button>
        </div>
      </div>
      <div class="dummy-card-body" ${collapsed ? "hidden" : ""}>
      <div class="reverse-metrics">
        <div class="reverse-metric factor-ac">
          <span>허수 AC가중치</span>
          <strong>${formatNumber(calculation.dummyAcWeight, 4)}</strong>
        </div>
        <div class="reverse-metric factor-buff">
          <span>허수 버프가중치</span>
          <strong>${formatNumber(calculation.dummyBuffWeight, 4)}</strong>
        </div>
        <div class="reverse-metric factor-ac">
          <span>대상 AC가중치</span>
          <strong>${formatNumber(calculation.acWeight, 4)}</strong>
        </div>
        <div class="reverse-metric factor-damage">
          <span>장비 데미지증가</span>
          <strong>${formatNumber(calculation.damageIncrease, 4)}</strong>
        </div>
        <div class="reverse-metric factor-buff">
          <span>대상 버프가중치</span>
          <strong>${formatNumber(calculation.selectedBuffWeight, 4)}</strong>
        </div>
        <div class="reverse-metric factor-hot">
          <span>디버프가중치</span>
          <strong>${formatNumber(calculation.debuffTotal, 4)}</strong>
        </div>
        <div class="reverse-metric">
          <span>퍼센트</span>
          <strong>${formatNumber(calculation.targetPercent, 4)}</strong>
        </div>
      </div>
      <div class="reverse-condition-layout">
        <section class="reverse-condition-group">
          <h3>허수아비 타격 조건</h3>
          <p>스펙과 장비는 허수아비 입력값을 사용합니다.</p>
          <div class="reverse-grid reverse-grid-dummy-inputs">
            <label class="reverse-field">
              <span>허수아비 데미지</span>
              <input class="field-control" data-reverse-key="dummyDamage" type="number" step="any" value="${formatInputValue(reverse.dummyDamage)}" />
            </label>
            <label class="reverse-field">
              <span>공격속성(공방)</span>
              <select class="field-control" data-reverse-key="dummyAttackElement">
                ${elementOptions
                  .map((option) => `<option value="${option}" ${String(reverse.dummyAttackElement) === String(option) ? "selected" : ""}>${option}</option>`)
                  .join("")}
              </select>
            </label>
            <label class="reverse-field">
              <span>핫타임(%)</span>
              <input class="field-control" data-reverse-key="dummyHotTime" type="number" step="any" value="${formatInputValue(reverse.dummyHotTime)}" />
            </label>
            <label class="reverse-field">
              <span>정령 %</span>
              <input class="field-control" data-reverse-key="dummySpirit" type="number" step="any" value="${formatInputValue(reverse.dummySpirit)}" />
            </label>
          </div>
          <div class="reverse-grid reverse-grid-dummy-factors">
            <fieldset class="reverse-check-group">
              <legend>AC가중치 적용</legend>
              ${reverseDummyAcFactors
                .map(
                  (factor) => `<label class="reverse-check">
                    <input type="checkbox" data-reverse-dummy-ac="${factor.key}" ${selectedDummyAcFactors.has(factor.key) ? "checked" : ""} />
                    <span>${factor.label}</span>
                  </label>`,
                )
                .join("")}
            </fieldset>
            <fieldset class="reverse-check-group">
              <legend>버프가중치 적용</legend>
              ${reverseDummyBuffFactors
                .map(
                  (factor) => `<label class="reverse-check">
                    <input type="checkbox" data-reverse-dummy-buff="${factor.key}" ${selectedDummyBuffFactors.has(factor.key) ? "checked" : ""} />
                    <span>${factor.label}</span>
                  </label>`,
                )
                .join("")}
            </fieldset>
          </div>
        </section>
        <section class="reverse-condition-group">
          <h3>공격 대상</h3>
          <div class="reverse-grid reverse-grid-target">
            <label class="reverse-field">
              <span>속성(공방)</span>
              <select class="field-control" data-reverse-key="targetAttackElement">
                ${elementOptions
                  .map((option) => `<option value="${option}" ${String(reverse.targetAttackElement) === String(option) ? "selected" : ""}>${option}</option>`)
                  .join("")}
              </select>
            </label>
            <label class="reverse-field">
              <span>대상 AC</span>
              <input class="field-control" data-reverse-key="targetAc" type="number" step="any" value="${formatInputValue(reverse.targetAc)}" />
            </label>
            <label class="reverse-field">
              <span>핫타임(%)</span>
              <input class="field-control" data-reverse-key="targetHotTime" type="number" step="any" value="${formatInputValue(reverse.targetHotTime)}" />
            </label>
            <label class="reverse-field">
              <span>정령 %</span>
              <input class="field-control" data-reverse-key="targetSpirit" type="number" step="any" value="${formatInputValue(reverse.targetSpirit)}" />
            </label>
            <fieldset class="reverse-check-group">
              <legend>버프</legend>
              ${reverseBuffs
                .map(
                  (buff) => `<label class="reverse-check">
                    <input type="checkbox" data-reverse-buff="${buff}" ${selectedBuffs.has(buff) ? "checked" : ""} />
                    <span>${buff}</span>
                  </label>`,
                )
                .join("")}
            </fieldset>
            <fieldset class="reverse-check-group">
              <legend>디버프</legend>
              ${reverseDebuffs
                .map(
                  (debuff) => `<label class="reverse-check">
                    <input type="checkbox" data-reverse-debuff="${debuff}" ${selectedDebuffs.has(debuff) ? "checked" : ""} />
                    <span>${debuff}</span>
                  </label>`,
                )
                .join("")}
            </fieldset>
          </div>
        </section>
      </div>
      </div>
      </section>`;
    target.insertAdjacentHTML("beforeend", renderCoefficientEstimator(result, sourceSkill));
  }

  function renderBaekyuInfoDialog() {
    document.getElementById("baekyuInfoContent").innerHTML = `
      <div class="info-highlight">
        <span>백작유리드</span>
        <strong>${baekyuMonsterInfoRows.length}개 기록</strong>
      </div>
      <div class="info-table-wrap">
        <table class="info-table">
          <colgroup>
            <col />
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th>존</th>
              <th>네임</th>
              <th>HP</th>
              <th>DEF Nature</th>
            </tr>
          </thead>
          <tbody>
            ${baekyuMonsterInfoRows
              .map(
                (row) => `<tr class="${row.zone >= 10 && row.zone <= 11 ? "info-row-focus" : ""}">
                  <td>${row.zone}</td>
                  <td>${row.name}</td>
                  <td>${formatInfoValue(row.hp)}</td>
                  <td><span class="${row.nature === "암" ? "nature-dark" : ""}">${row.nature}</span></td>
                </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>`;
  }

  function formatInfoValue(value) {
    return typeof value === "number" ? formatNumber(value) : value;
  }

  function factorClassName(factors = []) {
    return factors.map((factor) => `input-factor-${factor}`).join(" ");
  }

  function renderFactorDots(factors = []) {
    if (!factors.length) return "";
    return `<span class="factor-dots">${factors
      .map((factor) => `<i class="factor-dot factor-${factor}" title="${factorLabels[factor]}"></i>`)
      .join("")}</span>`;
  }

  function parseInputValue(input) {
    if (input.tagName === "SELECT") return input.value;
    const value = Number(input.value);
    return Number.isFinite(value) ? value : 0;
  }

  function bindEvents() {
    document.querySelector(".skill-tabs").addEventListener("click", (event) => {
      const button = event.target.closest(".skill-tab");
      if (!button) return;
      state.skill = button.dataset.skill;
      saveState();
      render();
    });

    document.getElementById("localSaveButton").addEventListener("click", () => {
      const activeInput = document.activeElement?.closest?.("[data-kind]");
      if (activeInput) saveFieldOnly(activeInput);
      saveState();
    });

    document.getElementById("exportButton").addEventListener("click", () => {
      saveState();
      exportStateFile();
    });

    document.getElementById("importButton").addEventListener("click", () => {
      document.getElementById("importFile").click();
    });

    document.getElementById("importFile").addEventListener("change", (event) => {
      importStateFile(event.target.files?.[0]);
      event.target.value = "";
    });

    document.getElementById("monsterForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const section = form.section.value.trim();
      const name = form.name.value.trim();
      const ac = Number(form.ac.value);
      const hp = form.hp.value.trim() === "" ? null : Number(form.hp.value);
      if (!section || !name || !Number.isFinite(ac) || (hp !== null && (!Number.isFinite(hp) || hp <= 0))) {
        alert("장소, 몬스터명, AC를 확인해주세요. 체력은 비워두거나 1 이상 숫자로 입력해주세요.");
        return;
      }
      const skillState = getCurrentSkillState();
      skillState.customMonsters.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        section,
        name,
        ac,
        hp,
      });
      appendSectionOrder(skillState, section);
      form.reset();
      document.getElementById("monsterDialog").close();
      saveState();
      render();
    });

    document.getElementById("closeMonsterDialog").addEventListener("click", () => {
      document.getElementById("monsterDialog").close();
    });

    document.getElementById("closeSectionOrderDialog").addEventListener("click", () => {
      document.getElementById("sectionOrderDialog").close();
    });

    document.getElementById("closeBaekyuInfoDialog").addEventListener("click", () => {
      document.getElementById("baekyuInfoDialog").close();
    });

    document.getElementById("closeDownFourWayDialog").addEventListener("click", () => {
      document.getElementById("downFourWayDialog").close();
    });

    document.getElementById("sectionOrderList").addEventListener("click", (event) => {
      const button = event.target.closest("[data-section-move]");
      if (!button) return;
      moveSection(Number(button.dataset.sectionIndex), button.dataset.sectionMove);
    });

    document.querySelector(".result-table-wrap").addEventListener("click", (event) => {
      const dummyCardToggle = event.target.closest("[data-dummy-card-toggle]");
      if (dummyCardToggle) {
        toggleDummyCard(dummyCardToggle.dataset.dummyCardToggle);
        return;
      }
      const dummyImport = event.target.closest("[data-dummy-import]");
      if (dummyImport) {
        importDummySpecsFromSkill(dummyImport.dataset.dummyImport);
        return;
      }
      const sectionToggle = event.target.closest("[data-section-toggle]");
      if (sectionToggle) {
        toggleSectionCollapse(decodeURIComponent(sectionToggle.dataset.sectionToggle || ""));
        return;
      }
      if (event.target.closest("#openMonsterDialog")) {
        document.getElementById("monsterDialog").showModal();
        document.getElementById("monsterSection").focus();
        return;
      }
      if (event.target.closest("#openSectionOrderDialog")) {
        renderSectionOrderList();
        document.getElementById("sectionOrderDialog").showModal();
        return;
      }
      if (event.target.closest("#openBaekyuInfoDialog")) {
        renderBaekyuInfoDialog();
        document.getElementById("baekyuInfoDialog").showModal();
        return;
      }
      if (event.target.closest("[data-result-font-scale]")) {
        cycleResultFontScale();
        return;
      }
      const button = event.target.closest(".delete-monster");
      if (!button) return;
      const skillState = getCurrentSkillState();
      skillState.customMonsters = skillState.customMonsters.filter((monster) => monster.id !== button.dataset.monsterId);
      saveState();
      render();
    });

    document.querySelector(".result-table-wrap").addEventListener("change", (event) => {
      const damageInclude = event.target.closest("[data-crasher-damage-include]");
      if (damageInclude) {
        const skillState = getCurrentSkillState();
        if (state.skill === "crasher") {
          skillState.damageIncludes = normalizeCrasherDamageIncludes(skillState.damageIncludes);
        } else if (state.skill === "martial") {
          skillState.damageIncludes = normalizeMartialDamageIncludes(skillState.damageIncludes);
        } else {
          return;
        }
        skillState.damageIncludes[damageInclude.dataset.crasherDamageInclude] = damageInclude.checked;
        saveState();
        render();
        return;
      }
      const daraManaMode = event.target.closest("[data-dara-mana-mode]");
      if (daraManaMode) {
        if (state.skill !== "martial") return;
        state.martial.daraManaMode = martialDaraManaModes.includes(daraManaMode.value)
          ? daraManaMode.value
          : defaults.martial.daraManaMode;
        saveState();
        render();
        return;
      }
      const select = event.target.closest("[data-dash-stack]");
      if (!select) return;
      if (state.skill !== "crasher") return;
      state.crasher.dashStacks = clampInt(select.value, 1, 6, 1);
      saveState();
      render();
    });

    document.getElementById("inputRows").addEventListener("change", (event) => {
      const input = event.target.closest("[data-kind]");
      if (!input) return;
      commitField(input);
    });

    document.getElementById("inputRows").addEventListener("click", (event) => {
      const dummyImport = event.target.closest("[data-dummy-import]");
      if (dummyImport) {
        importDummySpecsFromSkill(dummyImport.dataset.dummyImport);
        return;
      }
      if (!event.target.closest("[data-open-down-fourway]")) return;
      renderDownFourWayDialog();
      document.getElementById("downFourWayDialog").showModal();
      document.getElementById("downFourWayFuryDamage").focus();
    });

    document.getElementById("inputRows").addEventListener("input", (event) => {
      const input = event.target.closest("input[data-kind]");
      if (!input) return;
      saveFieldOnly(input);
    });

    document.getElementById("inputRows").addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      const input = event.target.closest("[data-kind]");
      if (!input) return;
      event.preventDefault();
      commitField(input);
      input.blur();
    });

    document.querySelector(".result-panel").addEventListener("input", (event) => {
      const estimateInput = event.target.closest("[data-estimate-key]");
      if (estimateInput) {
        saveCoefficientEstimateFieldOnly(estimateInput);
        return;
      }
      const input = event.target.closest("[data-reverse-key]");
      if (!input) return;
      saveReverseFieldOnly(input);
    });

    document.querySelector(".result-panel").addEventListener("change", (event) => {
      const estimateInput = event.target.closest("[data-estimate-key]");
      if (estimateInput) {
        commitCoefficientEstimateField(estimateInput);
        return;
      }
      const estimateStat = event.target.closest("[data-estimate-stat]");
      if (estimateStat) {
        toggleCoefficientStat(estimateStat.dataset.estimateStat, estimateStat.checked);
        return;
      }
      const estimateOperator = event.target.closest("[data-estimate-operator]");
      if (estimateOperator) {
        setCoefficientOperator(estimateOperator.dataset.estimateOperator);
        return;
      }
      const estimateAbility = event.target.closest("[data-estimate-ability]");
      if (estimateAbility) {
        setCoefficientAbility(estimateAbility.checked);
        return;
      }
      const estimateDummyAc = event.target.closest("[data-estimate-dummy-ac]");
      if (estimateDummyAc) {
        toggleCoefficientDummyFactor("dummyAcFactors", estimateDummyAc.dataset.estimateDummyAc, estimateDummyAc.checked);
        return;
      }
      const estimateDummyBuff = event.target.closest("[data-estimate-dummy-buff]");
      if (estimateDummyBuff) {
        toggleCoefficientDummyFactor("dummyBuffFactors", estimateDummyBuff.dataset.estimateDummyBuff, estimateDummyBuff.checked);
        return;
      }
      const dummyAc = event.target.closest("[data-reverse-dummy-ac]");
      if (dummyAc) {
        toggleReverseDummyFactor("dummyAcFactors", dummyAc.dataset.reverseDummyAc, dummyAc.checked);
        return;
      }
      const dummyBuff = event.target.closest("[data-reverse-dummy-buff]");
      if (dummyBuff) {
        toggleReverseDummyFactor("dummyBuffFactors", dummyBuff.dataset.reverseDummyBuff, dummyBuff.checked);
        return;
      }
      const buff = event.target.closest("[data-reverse-buff]");
      if (buff) {
        toggleReverseBuff(buff);
        return;
      }
      const debuff = event.target.closest("[data-reverse-debuff]");
      if (debuff) {
        toggleReverseDebuff(debuff);
        return;
      }
      const input = event.target.closest("[data-reverse-key]");
      if (!input) return;
      commitReverseField(input);
    });

    document.querySelector(".result-panel").addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      const estimateInput = event.target.closest("[data-estimate-key]");
      if (estimateInput) {
        event.preventDefault();
        commitCoefficientEstimateField(estimateInput);
        estimateInput.blur();
        return;
      }
      const input = event.target.closest("[data-reverse-key]");
      if (!input) return;
      event.preventDefault();
      commitReverseField(input);
      input.blur();
    });

    document.getElementById("downFourWayDialog").addEventListener("input", (event) => {
      const input = event.target.closest("[data-down-fourway-key]");
      if (!input) return;
      saveDownFourWayFieldOnly(input);
      renderDownFourWaySummary();
      render();
    });

    document.getElementById("downFourWayDialog").addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      const input = event.target.closest("[data-down-fourway-key]");
      if (!input) return;
      event.preventDefault();
      input.blur();
    });
  }

  function commitField(input) {
      const skillState = getCurrentSkillState();
      const key = input.dataset.key;
      clearMeteorDerivedManuals(key);
      clearCrasherSkillConversionManuals(key);
      if (input.dataset.kind === "spec") {
        skillState.specs[key] = parseInputValue(input);
        skillState.specManual[key] = true;
        if (key !== "basePhysical") {
          delete skillState.convManual[key];
        }
      } else {
        skillState.convManual[key] = parseInputValue(input);
      }
      saveState();
      render();
  }

  function saveFieldOnly(input) {
      const skillState = getCurrentSkillState();
      const key = input.dataset.key;
      clearMeteorDerivedManuals(key);
      clearCrasherSkillConversionManuals(key);
      if (input.dataset.kind === "spec") {
        skillState.specs[key] = parseInputValue(input);
        skillState.specManual[key] = true;
        if (key !== "basePhysical") {
          delete skillState.convManual[key];
        }
      } else {
        skillState.convManual[key] = parseInputValue(input);
      }
      saveState();
  }

  function parseReverseInputValue(input) {
    if (input.tagName === "SELECT") return input.value;
    if (input.value === "") return "";
    const value = Number(input.value);
    return Number.isFinite(value) ? value : "";
  }

  function ensureReverseState() {
    if (state.skill === "dummy") {
      normalizeDummyState();
      return state.dummy.reverse;
    }
    const skillState = getCurrentSkillState();
    if (!skillState.reverse) skillState.reverse = defaultReverseState(state.skill);
    if (!Array.isArray(skillState.reverse.buffs)) skillState.reverse.buffs = [];
    if (!Array.isArray(skillState.reverse.debuffs)) skillState.reverse.debuffs = [];
    if (!Array.isArray(skillState.reverse.dummyAcFactors)) skillState.reverse.dummyAcFactors = ["rings"];
    if (!Array.isArray(skillState.reverse.dummyBuffFactors)) {
      skillState.reverse.dummyBuffFactors = reverseDummyBuffFactors.map((factor) => factor.key);
    }
    return skillState.reverse;
  }

  function saveReverseFieldOnly(input) {
    const reverse = ensureReverseState();
    reverse[input.dataset.reverseKey] = parseReverseInputValue(input);
    saveState();
  }

  function commitReverseField(input) {
    saveReverseFieldOnly(input);
    render();
  }

  function saveCoefficientEstimateFieldOnly(input) {
    normalizeDummyState();
    state.dummy.coefficient[input.dataset.estimateKey] = parseReverseInputValue(input);
    saveState();
  }

  function commitCoefficientEstimateField(input) {
    saveCoefficientEstimateFieldOnly(input);
    normalizeDummyState();
    saveState();
    render();
  }

  function toggleCoefficientStat(key, checked) {
    normalizeDummyState();
    if (!coefficientStats.some((stat) => stat.key === key)) return;
    const selected = new Set(state.dummy.coefficient.stats || []);
    if (checked) selected.add(key);
    else selected.delete(key);
    state.dummy.coefficient.stats = coefficientStats.map((stat) => stat.key).filter((statKey) => selected.has(statKey));
    saveState();
    render();
  }

  function setCoefficientOperator(key) {
    normalizeDummyState();
    if (!coefficientOperators.some((operator) => operator.key === key)) return;
    state.dummy.coefficient.operator = key;
    saveState();
    render();
  }

  function setCoefficientAbility(checked) {
    normalizeDummyState();
    state.dummy.coefficient.useAbility = Boolean(checked);
    saveState();
    render();
  }

  function toggleCoefficientDummyFactor(listKey, value, checked) {
    normalizeDummyState();
    const coefficient = state.dummy.coefficient;
    const selected = new Set(coefficient[listKey] || []);
    if (checked) selected.add(value);
    else selected.delete(value);
    const allowed = listKey === "dummyAcFactors" ? reverseDummyAcFactors : reverseDummyBuffFactors;
    coefficient[listKey] = allowed.map((factor) => factor.key).filter((key) => selected.has(key));
    saveState();
    render();
  }

  function toggleDummyCard(cardKey) {
    normalizeDummyState();
    if (!["reverse", "coefficient"].includes(cardKey)) return;
    state.dummy.collapsedCards[cardKey] = !state.dummy.collapsedCards[cardKey];
    saveState();
    render();
  }

  function saveDownFourWayFieldOnly(input) {
    if (!state.crasher.downFourWay) state.crasher.downFourWay = defaultDownFourWayState();
    state.crasher.downFourWay[input.dataset.downFourwayKey] = parseReverseInputValue(input);
    delete state.crasher.convManual.downFourWayLevel;
    saveState();
  }

  function toggleReverseBuff(input) {
    const reverse = ensureReverseState();
    const selected = new Set(reverse.buffs || []);
    if (input.checked) selected.add(input.dataset.reverseBuff);
    else selected.delete(input.dataset.reverseBuff);
    reverse.buffs = reverseBuffs.filter((buff) => selected.has(buff));
    saveState();
    render();
  }

  function toggleReverseDummyFactor(listKey, value, checked) {
    const reverse = ensureReverseState();
    const selected = new Set(reverse[listKey] || []);
    if (checked) selected.add(value);
    else selected.delete(value);
    const allowed = listKey === "dummyAcFactors" ? reverseDummyAcFactors : reverseDummyBuffFactors;
    reverse[listKey] = allowed.map((factor) => factor.key).filter((key) => selected.has(key));
    saveState();
    render();
  }

  function toggleReverseDebuff(input) {
    const reverse = ensureReverseState();
    const selected = new Set(reverse.debuffs || []);
    if (input.checked) selected.add(input.dataset.reverseDebuff);
    else selected.delete(input.dataset.reverseDebuff);
    reverse.debuffs = reverseDebuffs.filter((debuff) => selected.has(debuff));
    saveState();
    render();
  }

  globalThis.DamageCalculator = {
    calculateCrasher,
    calculateMartial,
    calculateMeteor,
    calculateDummy,
    calculateReverseDamage,
    calculateCoefficientEstimate,
    coefficientStatBase,
    freshSkillState,
    defaultDummyState,
    importDummySpecsFromSkill,
    defaults,
  };

  if (typeof document !== "undefined") {
    loadSavedState();
    bindEvents();
    render();
  }
})();
