interface OxfordResponse {
  meta: Meta;
  hom?: number;
  hwi: Hwi;
  fl: string;
  def: Def[];
  et?: string[][];
  date?: string;
  shortdef: string[];
  ins?: In[];
  uros?: Uro[];
  dros?: Dro[];
}

interface Dro {
  drp: string;
  vrs: Vr[];
  def: Def2[];
}

interface Def2 {
  sseq: (Sseq4 | string)[][][];
}

interface Vr {
  vl: string;
  va: string;
}

interface Uro {
  ure: string;
  prs?: Pr[];
  fl: string;
}

interface In {
  if: string;
  ifc?: string;
  prs?: Pr[];
}

interface Def {
  sseq: ((Sseq | Sseq2 | string)[][][] | (Sseq22 | Sseq222 | Sseq2 | Sseq24 | string)[] | Sseq3 | Sseq4 | Sseq5 | Sseq6 | Sseq222 | Sseq2 | Sseq2 | Sseq2 | Sseq2 | Sseq2 | (Sseq13 | Sseq2 | string)[][][] | string | string | string | string | string)[][][][];
  vd?: string;
}

interface Sseq13 {
  sense: Sseq2;
}

interface Sseq6 {
  dt: string[][];
  sdsense: Sdsense2;
}

interface Sdsense2 {
  sd: string;
  dt: string[][];
}

interface Sseq5 {
  sn: string;
  sls: string[];
  dt: string[][];
}

interface Sseq4 {
  dt: string[][];
}

interface Sseq3 {
  dt: (Dt[] | string | string)[][];
}

interface Sseq24 {
  sn: string;
  dt: ((Dt[] | string | string)[][][] | string | string)[][];
}

interface Sseq222 {
  sn: string;
  dt: (Dt[] | string | string)[][];
}

interface Sseq22 {
  sn: string;
  dt: (string[][][] | string | string)[][];
}

interface Sseq2 {
  sn: string;
  dt: string[][];
}

interface Sseq {
  sn: string;
  dt: string[][];
  sdsense: Sdsense;
}

interface Sdsense {
  sd: string;
  dt: (Dt[] | string | string)[][];
}

interface Dt {
  t: string;
}

interface Hwi {
  hw: string;
  prs?: Pr[];
}

interface Pr {
  mw: string;
  sound: Sound;
}

interface Sound {
  audio: string;
  ref: string;
  stat: string;
}

interface Meta {
  id: string;
  uuid: string;
  sort: string;
  src: string;
  section: string;
  stems: string[];
  offensive: boolean;
}