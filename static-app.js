const BRAND = {
  brown: "#A0621A",
  brownDark: "#7A4900",
  brownLight: "#D4963E",
  beigeCard: "#FFFEFB",
  border: "#DFCFB8",
  textMain: "#2F1D08",
  textSub: "#70522C",
};

const CATS = [
  { label: "Matéria-prima", color: "#3B6D11" },
  { label: "Folha de pagamento", color: "#534AB7" },
  { label: "Operacional", color: "#BA7517" },
  { label: "Logística", color: "#185FA5" },
  { label: "Marketing", color: "#D4537E" },
  { label: "Outros", color: "#888780" },
];
const CAT_COLOR = Object.fromEntries(CATS.map((cat) => [cat.label, cat.color]));
const CAT_ICON = {
  "Matéria-prima": "package",
  "Folha de pagamento": "users",
  Operacional: "settings",
  Logística: "truck",
  Marketing: "megaphone",
  Outros: "circle",
};
const SK = "livinha_despesas_v6";
const APP_VERSION_KEY = `${SK}_app_version`;
const APP_VERSION = "2026.05.20.1";
const APP_UPDATE_MESSAGE = "Atualização aplicada: tela de login obrigatória, aba Conta e acesso aos dados somente após autenticação.";
const SEED_VERSION_KEY = `${SK}_seed_version`;
const SEED_VERSION = "2026-07-print-v1";
const SUPABASE_URL = "https://bybobnokmfkuerqgzmtk.supabase.co";
const SUPABASE_KEY = "sb_publishable_doSkbX5MAGsHmcE11JTY6A_iqbnPJnM";
const AUTH_REDIRECT_URL = window.location.protocol === "file:" ? "http://127.0.0.1:4173/" : `${window.location.origin}/`;
const ML = {
  "2026-05": "Mai/26",
  "2026-06": "Jun/26",
  "2026-07": "Jul/26",
  "2026-08": "Ago/26",
  "2026-09": "Set/26",
  "2026-10": "Out/26",
  "2026-11": "Nov/26",
  "2026-12": "Dez/26",
  "2027-01": "Jan/27",
  "2027-02": "Fev/27",
  "2027-03": "Mar/27",
};
const SORT_OPTS = [
  ["val_desc", "Valor desc."],
  ["val_asc", "Valor asc."],
  ["due_asc", "Vencimento asc."],
  ["due_desc", "Vencimento desc."],
  ["desc_asc", "Descrição A-Z"],
  ["desc_desc", "Descrição Z-A"],
];
const SS = {
  pago: { bg: "#EAF6ED", color: "#1F6A35", label: "Pago" },
  atrasado: { bg: "#FCECEA", color: "#8B2020", label: "Atrasado" },
  vence: { bg: "#FFF5DF", color: "#7A4900", label: "Vence em breve" },
  aberta: { bg: "#F5EDD8", color: "#5C3A00", label: "Em aberto" },
};

let nextId = 1;
let state = {
  data: [],
  tab: "dash",
  selMon: "2026-05",
  search: "",
  sortKey: "due_asc",
  monthMenuOpen: false,
  showForm: false,
  editId: null,
  duplicateMode: false,
  session: null,
  authEmail: "",
  authMessage: "",
  authLoading: false,
  syncStatus: "local",
  syncMessage: "Modo local",
  dataReviewMessage: "",
  updateMessage: "",
  form: { desc: "", person: "", cat: "Matéria-prima", parcela: "1/1", due: "", val: "" },
};

const supabaseClient = window.supabase?.createClient
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

function storageGet(key) {
  try {
    return window.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

function storageSet(key, value) {
  try {
    window.localStorage?.setItem(key, value);
    return true;
  } catch {
    state.syncStatus = "local";
    state.syncMessage = "Modo local sem armazenamento do navegador";
    return false;
  }
}

function icon(name, label = "") {
  const title = label ? `<title>${esc(label)}</title>` : "";
  const common = `class="ui-icon" viewBox="0 0 24 24" aria-hidden="${label ? "false" : "true"}" focusable="false"`;
  const paths = {
    check: `<path d="M20 6 9 17l-5-5"/>`,
    copy: `<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`,
    edit: `<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>`,
    trash: `<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5"/><path d="M14 11v5"/>`,
    package: `<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z"/><path d="m4 7.5 8 4.5 8-4.5"/><path d="M12 12v9"/>`,
    users: `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
    settings: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V20h-3v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 5 15.4a1.7 1.7 0 0 0-1.55-1H3v-3h.09a1.7 1.7 0 0 0 1.55-1A1.7 1.7 0 0 0 4.3 8.5l-.06-.06 2.12-2.12.06.06A1.7 1.7 0 0 0 8.3 6a1.7 1.7 0 0 0 1-1.55V4h3v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.12 2.12-.06.06A1.7 1.7 0 0 0 19 8.6a1.7 1.7 0 0 0 1.55 1H21v3h-.09a1.7 1.7 0 0 0-1.55 1Z"/>`,
    truck: `<path d="M10 17H5V6h11v11h-2"/><path d="M16 8h3l3 4v5h-3"/><circle cx="7.5" cy="17.5" r="2"/><circle cx="17.5" cy="17.5" r="2"/>`,
    megaphone: `<path d="m3 11 18-5v12L3 13Z"/><path d="M11 14v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-4"/>`,
    circle: `<circle cx="12" cy="12" r="8"/>`,
  };
  return `<svg ${common}>${title}${paths[name] || paths.circle}</svg>`;
}

function categoryIcon(category) {
  const color = CAT_COLOR[category] || "#888780";
  const name = CAT_ICON[category] || "circle";
  return `<span class="cat-icon" style="color:${color}" title="${esc(category)}">${icon(name)}</span>`;
}

function uid() {
  return `e${nextId++}_${Math.random().toString(36).slice(2, 5)}`;
}

function mk(month, person, desc, cat, parcela, due, val, projected = false) {
  return { id: uid(), month, person, desc, cat, parcela, due, val, paid: false, projected };
}

function seedData() {
  const rows = [
    mk("2026-05", "Sem pessoa", "Conta Vivo", "Operacional", "3/10", "2026-05-10", 38),
    mk("2026-05", "Glawderson de Oliveira Araujo", "Salário - Glaucio", "Folha de pagamento", "1/6", "2026-05-12", 1050),
    mk("2026-05", "Glawdenia de Oliveira Araujo", "Salário", "Folha de pagamento", "2/6", "2026-05-20", 830.5),
    mk("2026-05", "Glawdenia de Oliveira Araujo", "INSS + FGTS", "Folha de pagamento", "1/3", "2026-05-20", 516.1),
    mk("2026-05", "TBM S A INDUSTRIA TEXTIL - Filati Malhas", "Tecido Filati - Copa (Cartão 2)", "Matéria-prima", "2/3", "2026-05-25", 849.65),
    mk("2026-05", "TBM S A INDUSTRIA TEXTIL - Filati Malhas", "Tecido Filati - Copa (Cartão 1)", "Matéria-prima", "1/3", "2026-05-26", 1233.33),
    mk("2026-05", "Sem pessoa", "Ar Condicionado - Fábrica", "Operacional", "3/10", "2026-05-26", 190),
    mk("2026-05", "Sem pessoa", "Material Elétrico - Fábrica", "Operacional", "3/6", "2026-05-26", 369.09),
    mk("2026-05", "Sem pessoa", "Instalação - Ar", "Operacional", "3/5", "2026-05-26", 203.92),
    mk("2026-05", "Sem pessoa", "Varejão - Mesas", "Operacional", "3/3", "2026-05-26", 83.2),
    mk("2026-05", "Sem pessoa", "Tag", "Matéria-prima", "3/3", "2026-05-26", 383.84),
    mk("2026-05", "Sem pessoa", "Câmeras de segurança", "Operacional", "2/7", "2026-05-26", 54.26),
    mk("2026-05", "Sem pessoa", "Cadeiras de Costura (3)", "Operacional", "2/12", "2026-05-26", 52.56),
    mk("2026-05", "Sem pessoa", "Cesto Estoque - (10Pç)", "Operacional", "2/4", "2026-05-26", 53.19),
    mk("2026-05", "Sem pessoa", "Linhas, Elásticos e Aviamentos", "Matéria-prima", "2/3", "2026-05-26", 166.77),
    mk("2026-05", "Glawderson de Oliveira Araujo", "Salário - Glaucio", "Folha de pagamento", "2/6", "2026-05-27", 1050),
    mk("2026-05", "Sem pessoa", "Varejão 1 - Compras Fábrica", "Operacional", "2/4", "2026-05-27", 51.84),
    mk("2026-05", "Sem pessoa", "Varejão 2 - Compras Fábrica", "Operacional", "2/4", "2026-05-27", 50.99),
    mk("2026-05", "TBM S A INDUSTRIA TEXTIL - Filati Malhas", "Modelagens", "Matéria-prima", "2/3", "2026-05-27", 195),
    mk("2026-05", "Glawderson de Oliveira Araujo", "INSS + FGTS - Glaucio", "Folha de pagamento", "1/3", "2026-05-27", 516.1),
    mk("2026-06", "Glawdenia de Oliveira Araujo", "Salário", "Folha de pagamento", "3/6", "2026-06-04", 830.5),
    mk("2026-06", "Sem pessoa", "Material de Construção - Fábrica", "Operacional", "4/4", "2026-06-08", 150.29),
    mk("2026-06", "Sem pessoa", "Sistema Webpic", "Operacional", "3/10", "2026-06-10", 800),
    mk("2026-06", "Sem pessoa", "Conta Vivo", "Operacional", "4/10", "2026-06-10", 38),
    mk("2026-06", "Sem pessoa", "Assinatura - Nuvem Shop", "Marketing", "4/10", "2026-06-10", 69),
    mk("2026-06", "Sem pessoa", "Maquinas Jack", "Operacional", "3/15", "2026-06-10", 800),
    mk("2026-06", "TBM S A INDUSTRIA TEXTIL - Filati Malhas", "Tecidos Filati - 1", "Matéria-prima", "3/3", "2026-06-10", 1666.66),
    mk("2026-06", "TBM S A INDUSTRIA TEXTIL - Filati Malhas", "Tecido Filati - 2", "Matéria-prima", "3/3", "2026-06-10", 1024.18),
    mk("2026-06", "Airton Matheus Melgaço Frota - Matheus Melgaço", "Shoppe 1 - Banco Inter", "Operacional", "2/2", "2026-06-11", 69.18),
    mk("2026-06", "Glawderson de Oliveira Araujo", "Salário - Glaucio", "Folha de pagamento", "3/6", "2026-06-11", 1050),
    mk("2026-06", "Airton Matheus Melgaço Frota - Matheus Melgaço", "Shoppe 2 - Banco Inter", "Operacional", "2/2", "2026-06-11", 63.16),
    mk("2026-06", "Clara Raquel dos Santos Alves Perreira", "Salário - Raquel", "Folha de pagamento", "2/4", "2026-06-12", 1621),
    mk("2026-06", "Lívia Sousa Dourado - Lívia Dourado", "CP260314203949LD", "Outros", "1/1", "2026-06-14", 1600),
    mk("2026-06", "Sem pessoa", "Gasolina", "Logística", "4/10", "2026-06-15", 400),
    mk("2026-06", "Sem pessoa", "Contabilidade", "Operacional", "4/11", "2026-06-15", 405),
    mk("2026-06", "Glawdenia de Oliveira Araujo", "Salário", "Folha de pagamento", "4/6", "2026-06-19", 830.5),
    mk("2026-06", "Glawdenia de Oliveira Araujo", "INSS + FGTS", "Folha de pagamento", "2/3", "2026-06-20", 516.1),
    mk("2026-06", "TBM S A INDUSTRIA TEXTIL - Filati Malhas", "Tecido Filati - Copa (Cartão 2)", "Matéria-prima", "3/3", "2026-06-25", 849.65),
    mk("2026-06", "Sem pessoa", "Ar Condicionado - Fábrica", "Operacional", "4/10", "2026-06-26", 190),
    mk("2026-06", "TBM S A INDUSTRIA TEXTIL - Filati Malhas", "Tecido Filati - Copa (Cartão 1)", "Matéria-prima", "2/3", "2026-06-26", 1233.33),
    mk("2026-06", "Glawderson de Oliveira Araujo", "Salário - Glaucio", "Folha de pagamento", "4/6", "2026-06-26", 1050),
    mk("2026-06", "Sem pessoa", "Câmeras de segurança", "Operacional", "3/7", "2026-06-26", 54.26),
    mk("2026-06", "Sem pessoa", "Cadeiras de Costura (3)", "Operacional", "3/12", "2026-06-26", 52.56),
    mk("2026-06", "Sem pessoa", "Cesto Estoque - (10Pç)", "Operacional", "3/4", "2026-06-26", 53.19),
    mk("2026-06", "Sem pessoa", "Linhas, Elásticos e Aviamentos", "Matéria-prima", "3/3", "2026-06-26", 166.76),
    mk("2026-06", "Sem pessoa", "Material Elétrico - Fábrica", "Operacional", "4/6", "2026-06-26", 369.09),
    mk("2026-06", "Sem pessoa", "Instalação - Ar", "Operacional", "4/5", "2026-06-26", 203.92),
    mk("2026-06", "Glawderson de Oliveira Araujo", "INSS + FGTS - Glaucio", "Folha de pagamento", "2/3", "2026-06-27", 516.1),
    mk("2026-06", "Sem pessoa", "Varejão 1 - Compras Fábrica", "Operacional", "3/4", "2026-06-27", 51.84),
    mk("2026-06", "Sem pessoa", "Varejão 2 - Compras Fábrica", "Operacional", "3/4", "2026-06-27", 50.99),
    mk("2026-06", "TBM S A INDUSTRIA TEXTIL - Filati Malhas", "Modelagens", "Matéria-prima", "3/3", "2026-06-27", 195),
  ];

  const jul = [
    ["Glawdenia de Oliveira Araujo", "Salário", "Folha de pagamento", "5/6", "2026-07-04", 830.5],
    ["Sem pessoa", "Maquinas Jack", "Operacional", "4/15", "2026-07-10", 800],
    ["Sem pessoa", "Conta Vivo", "Operacional", "5/10", "2026-07-10", 38],
    ["Sem pessoa", "Assinatura - Nuvem Shop", "Marketing", "5/10", "2026-07-10", 69],
    ["Sem pessoa", "Sistema Webpic", "Operacional", "4/10", "2026-07-10", 800],
    ["Glawderson de Oliveira Araujo", "Salário - Glaucio", "Folha de pagamento", "5/6", "2026-07-11", 1050],
    ["Clara Raquel dos Santos Alves Perreira", "Salário - Raquel", "Folha de pagamento", "3/4", "2026-07-12", 1621],
    ["Lívia Sousa Dourado - Lívia Dourado", "CP260314203950LD", "Outros", "1/1", "2026-07-14", 1600],
    ["Sem pessoa", "Contabilidade", "Operacional", "5/11", "2026-07-15", 405],
    ["Sem pessoa", "Gasolina", "Logística", "5/10", "2026-07-15", 400],
    ["Glawdenia de Oliveira Araujo", "Salário", "Folha de pagamento", "6/6", "2026-07-19", 830.5],
    ["Glawdenia de Oliveira Araujo", "INSS + FGTS", "Folha de pagamento", "3/3", "2026-07-20", 516.1],
    ["Sem pessoa", "Material Elétrico - Fábrica", "Operacional", "5/6", "2026-07-26", 369.09],
    ["Sem pessoa", "Instalação - Ar", "Operacional", "5/5", "2026-07-26", 203.92],
    ["TBM S A INDUSTRIA TEXTIL - Filati Malhas", "Tecido Filati - Copa (Cartão 1)", "Matéria-prima", "3/3", "2026-07-26", 1233.34],
    ["Glawderson de Oliveira Araujo", "Salário - Glaucio", "Folha de pagamento", "6/6", "2026-07-24", 1050],
    ["Sem pessoa", "Câmeras de segurança", "Operacional", "4/7", "2026-07-26", 54.26],
    ["Sem pessoa", "Cesto Estoque - (10Pç)", "Operacional", "4/4", "2026-07-26", 53.2],
    ["Sem pessoa", "Cadeiras de Costura (3)", "Operacional", "4/12", "2026-07-26", 52.56],
    ["Glawderson de Oliveira Araujo", "INSS + FGTS - Glaucio", "Folha de pagamento", "3/3", "2026-07-27", 516.1],
    ["Sem pessoa", "Varejão 1 - Compras Fábrica", "Operacional", "4/4", "2026-07-27", 51.84],
    ["Sem pessoa", "Varejão 2 - Compras Fábrica", "Operacional", "4/4", "2026-07-27", 50.99],
    ["Sem pessoa", "Ar Condicionado - Fábrica", "Operacional", "5/10", "2026-07-27", 190],
  ];
  jul.forEach((r) => rows.push(mk("2026-07", r[0], r[1], r[2], r[3], r[4], r[5], true)));

  const recurringMonths = ["2026-08", "2026-09", "2026-10", "2026-11", "2026-12"];
  recurringMonths.forEach((month, index) => {
    const n = index + 5;
    rows.push(mk(month, "Sem pessoa", "Sistema Webpic", "Operacional", `${n}/10`, `${month}-10`, 800, true));
    rows.push(mk(month, "Sem pessoa", "Maquinas Jack", "Operacional", `${n}/15`, `${month}-10`, 800, true));
    rows.push(mk(month, "Sem pessoa", "Conta Vivo", "Operacional", `${n + 1}/10`, `${month}-10`, 38, true));
    rows.push(mk(month, "Sem pessoa", "Assinatura - Nuvem Shop", "Marketing", `${n + 1}/10`, `${month}-10`, 69, true));
    rows.push(mk(month, "Lívia Sousa Dourado - Lívia Dourado", "CP260314203950LD", "Outros", "1/1", `${month}-14`, 1600, true));
    rows.push(mk(month, "Sem pessoa", "Contabilidade", "Operacional", `${n + 1}/11`, `${month}-15`, 405, true));
    rows.push(mk(month, "Sem pessoa", "Gasolina", "Logística", `${n + 1}/10`, `${month}-15`, 400, true));
    rows.push(mk(month, "Sem pessoa", "Ar Condicionado - Fábrica", "Operacional", `${n + 1}/10`, `${month}-26`, 190, true));
    rows.push(mk(month, "Sem pessoa", "Cadeiras de Costura (3)", "Operacional", `${n}/12`, `${month}-26`, 52.56, true));
    if (month === "2026-08") {
      rows.push(mk(month, "Clara Raquel dos Santos Alves Perreira", "Salário - Raquel", "Folha de pagamento", "4/4", `${month}-12`, 1621, true));
      rows.push(mk(month, "Sem pessoa", "Material Elétrico - Fábrica", "Operacional", "6/6", `${month}-26`, 369.09, true));
      rows.push(mk(month, "Sem pessoa", "Câmeras de segurança", "Operacional", "5/7", `${month}-26`, 54.26, true));
    }
    if (month === "2026-09") rows.push(mk(month, "Sem pessoa", "Câmeras de segurança", "Operacional", "6/7", `${month}-26`, 54.26, true));
    if (month === "2026-10") rows.push(mk(month, "Sem pessoa", "Câmeras de segurança", "Operacional", "7/7", `${month}-26`, 54.26, true));
  });

  rows.push(mk("2027-01", "Sem pessoa", "Sistema Webpic", "Operacional", "10/10", "2027-01-10", 800, true));
  rows.push(mk("2027-01", "Sem pessoa", "Maquinas Jack", "Operacional", "10/15", "2027-01-10", 800, true));
  rows.push(mk("2027-01", "Lívia Sousa Dourado - Lívia Dourado", "CP260314203950LD", "Outros", "1/1", "2027-01-14", 1600, true));
  rows.push(mk("2027-01", "Sem pessoa", "Contabilidade", "Operacional", "11/11", "2027-01-15", 405, true));
  rows.push(mk("2027-01", "Sem pessoa", "Cadeiras de Costura (3)", "Operacional", "10/12", "2027-01-26", 52.56, true));
  rows.push(mk("2027-02", "Sem pessoa", "Maquinas Jack", "Operacional", "11/15", "2027-02-10", 800, true));
  rows.push(mk("2027-02", "Lívia Sousa Dourado - Lívia Dourado", "CP260314203950LD", "Outros", "1/1", "2027-02-14", 1600, true));
  rows.push(mk("2027-02", "Sem pessoa", "Cadeiras de Costura (3)", "Operacional", "11/12", "2027-02-26", 52.56, true));
  rows.push(mk("2027-03", "Sem pessoa", "Maquinas Jack", "Operacional", "12/15", "2027-03-10", 800, true));
  rows.push(mk("2027-03", "Lívia Sousa Dourado - Lívia Dourado", "CP260314203950LD", "Outros", "1/1", "2027-03-14", 1600, true));
  rows.push(mk("2027-03", "Sem pessoa", "Cadeiras de Costura (3)", "Operacional", "12/12", "2027-03-26", 52.56, true));
  return rows;
}

function fBRL(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);
}

function fDate(date) {
  if (!date) return "-";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function getStatus(expense) {
  if (expense.paid) return "pago";
  const due = new Date(`${expense.due}T12:00:00`);
  const diff = Math.floor((due - new Date()) / 86400000);
  if (diff < 0) return "atrasado";
  if (diff <= 3) return "vence";
  return "aberta";
}

function sortRows(rows) {
  const sorted = [...rows];
  const key = state.sortKey;
  if (key === "val_desc") return sorted.sort((a, b) => b.val - a.val);
  if (key === "val_asc") return sorted.sort((a, b) => a.val - b.val);
  if (key === "due_asc") return sorted.sort((a, b) => a.due.localeCompare(b.due));
  if (key === "due_desc") return sorted.sort((a, b) => b.due.localeCompare(a.due));
  if (key === "desc_asc") return sorted.sort((a, b) => a.desc.localeCompare(b.desc));
  if (key === "desc_desc") return sorted.sort((a, b) => b.desc.localeCompare(a.desc));
  return sorted;
}

function saveData() {
  state.data = normalizeExpenses(state.data).rows;
  storageSet(SK, JSON.stringify(state.data));
  storageSet(SEED_VERSION_KEY, SEED_VERSION);
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeExpense(expense) {
  return {
    ...expense,
    month: normalizeText(expense.month),
    person: normalizeText(expense.person) || "Sem pessoa",
    desc: normalizeText(expense.desc),
    cat: normalizeText(expense.cat),
    parcela: normalizeText(expense.parcela),
    due: normalizeText(expense.due),
    val: Number(expense.val),
    paid: Boolean(expense.paid),
    projected: Boolean(expense.projected),
  };
}

function duplicateKey(expense) {
  const normalized = normalizeExpense(expense);
  return [
    normalized.month,
    normalized.person.toLowerCase(),
    normalized.desc.toLowerCase(),
    normalized.cat.toLowerCase(),
    normalized.parcela,
    normalized.due,
    normalized.val.toFixed(2),
  ].join("|");
}

function normalizeExpenses(expenses) {
  const seen = new Set();
  const removed = [];
  const rows = [];

  for (const raw of expenses) {
    const expense = normalizeExpense(raw);
    const key = duplicateKey(expense);
    if (seen.has(key)) {
      removed.push(expense);
      continue;
    }
    seen.add(key);
    rows.push(expense);
  }

  return { rows, removed };
}

function toDb(expense) {
  return {
    user_id: state.session?.user?.id,
    month: expense.month,
    person: expense.person || "Sem pessoa",
    description: expense.desc,
    category: expense.cat,
    installment: expense.parcela,
    due: expense.due,
    value: expense.val,
    paid: Boolean(expense.paid),
    projected: Boolean(expense.projected),
  };
}

function fromDb(row) {
  return {
    id: row.id,
    month: row.month,
    person: row.person || "Sem pessoa",
    desc: row.description,
    cat: row.category,
    parcela: row.installment || "",
    due: row.due,
    val: Number(row.value),
    paid: Boolean(row.paid),
    projected: Boolean(row.projected),
  };
}

async function loadRemoteData() {
  if (!supabaseClient || !state.session) return false;
  state.syncStatus = "syncing";
  state.syncMessage = "Sincronizando...";
  render();

  const { data, error } = await supabaseClient
    .from("expenses")
    .select("*")
    .order("due", { ascending: true });

  if (error) {
    state.syncStatus = "error";
    state.syncMessage = error.message;
    render();
    return false;
  }

  if (data.length === 0) {
    const seedRows = seedData().map((expense) => toDb(expense));
    const { data: inserted, error: seedError } = await supabaseClient
      .from("expenses")
      .insert(seedRows)
      .select("*");

    if (seedError) {
      state.syncStatus = "error";
      state.syncMessage = seedError.message;
      render();
      return false;
    }

    const normalized = normalizeExpenses(inserted.map(fromDb));
    state.data = normalized.rows;
    state.syncStatus = "remote";
    state.syncMessage = "Dados iniciais salvos no Supabase";
  } else {
    const normalized = normalizeExpenses(data.map(fromDb));
    state.data = normalized.rows;
    state.syncStatus = "remote";
    state.syncMessage = normalized.removed.length
      ? `${normalized.removed.length} duplicata(s) local(is) removida(s)`
      : "Sincronizado com Supabase";
  }

  storageSet(SK, JSON.stringify(state.data));
  render();
  return true;
}

async function persistRemoteChange(kind, expenseOrId, patch = {}) {
  if (!supabaseClient || !state.session) {
    saveData();
    return true;
  }

  state.syncStatus = "syncing";
  state.syncMessage = "Salvando...";
  render();

  let result;
  if (kind === "insert") {
    result = await supabaseClient.from("expenses").insert(toDb(expenseOrId)).select("*").single();
  }
  if (kind === "update") {
    result = await supabaseClient.from("expenses").update(patch).eq("id", expenseOrId).select("*").single();
  }
  if (kind === "delete") {
    result = await supabaseClient.from("expenses").delete().eq("id", expenseOrId);
  }

  if (result?.error) {
    state.syncStatus = "error";
    state.syncMessage = result.error.message;
    render();
    return false;
  }

  state.syncStatus = "remote";
  state.syncMessage = "Sincronizado com Supabase";
  return result?.data || true;
}

function loadData() {
  try {
    const savedVersion = storageGet(SEED_VERSION_KEY);
    if (savedVersion !== SEED_VERSION) {
      const fresh = normalizeExpenses(seedData()).rows;
      storageSet(SK, JSON.stringify(fresh));
      storageSet(SEED_VERSION_KEY, SEED_VERSION);
      return fresh;
    }
    const saved = JSON.parse(storageGet(SK));
    if (Array.isArray(saved) && saved.length) {
      const normalized = normalizeExpenses(saved);
      if (normalized.removed.length) {
        state.dataReviewMessage = `${normalized.removed.length} conta(s) duplicada(s) removida(s) da base local.`;
        storageSet(SK, JSON.stringify(normalized.rows));
      }
      return normalized.rows;
    }
  } catch {}
  const fresh = normalizeExpenses(seedData()).rows;
  storageSet(SEED_VERSION_KEY, SEED_VERSION);
  return fresh;
}

function filteredRows() {
  const q = state.search.trim().toLowerCase();
  return sortRows(
    state.data.filter((expense) => {
      const monthOk = state.selMon === "all" || expense.month === state.selMon;
      const searchOk =
        !q || expense.desc.toLowerCase().includes(q) || expense.person.toLowerCase().includes(q);
      return monthOk && searchOk;
    }),
  );
}

function appStats(rows) {
  const months = [...new Set(state.data.map((expense) => expense.month))].sort();
  const totalAll = state.data.reduce((sum, expense) => sum + expense.val, 0);
  const totalMon = rows.reduce((sum, expense) => sum + expense.val, 0);
  const paidMon = rows.filter((expense) => expense.paid).reduce((sum, expense) => sum + expense.val, 0);
  const overdue = state.data.filter((expense) => !expense.paid && getStatus(expense) === "atrasado");
  return { months, totalAll, totalMon, paidMon, overdue, overdueTotal: overdue.reduce((s, e) => s + e.val, 0) };
}

function html(strings, ...values) {
  return strings.reduce((out, part, index) => out + part + (values[index] ?? ""), "");
}

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function monthSelector(months) {
  const projected = state.selMon !== "all" && state.data.some((e) => e.month === state.selMon && e.projected);
  const currentLabel = state.selMon === "all" ? "Todos os meses" : ML[state.selMon] || state.selMon;
  return html`
    <div class="month-select" aria-label="Filtrar por mês">
      <button class="month-trigger" data-action="toggleMonthMenu" type="button" aria-expanded="${state.monthMenuOpen}">
        <span>Mês</span>
        <strong>${currentLabel}</strong>
      </button>
      ${state.monthMenuOpen ? `<div class="month-menu">
        ${months.map((m) => {
          const isActive = state.selMon === m;
          const isProjected = state.data.some((e) => e.month === m && e.projected);
          return `<button class="month-option ${isActive ? "active" : ""}" data-action="selMonth" data-month="${m}" type="button">${ML[m] || m}${isProjected ? `<span>projetado</span>` : ""}</button>`;
        }).join("")}
        <button class="month-option ${state.selMon === "all" ? "active" : ""}" data-action="selMonth" data-month="all" type="button">Todos os meses</button>
      </div>` : ""}
      ${projected ? `<span class="projected-tag">projetado</span>` : ""}
    </div>
  `;
}

function metric(label, value, sub, tone = "") {
  return `<div class="metric-card"><div class="metric-label">${label}</div><div class="metric-value ${tone}">${value}</div><div class="metric-sub">${sub}</div></div>`;
}

function barChart(months) {
  const totals = months.map((m) => state.data.filter((e) => e.month === m).reduce((s, e) => s + e.val, 0));
  const max = Math.max(...totals, 1);
  return `<div class="static-bars">${months.map((m, i) => {
    const projected = state.data.some((e) => e.month === m && e.projected);
    return `<div class="static-bar-item" title="${ML[m] || m}: ${fBRL(totals[i])}">
      <div class="static-bar-track"><div class="static-bar" style="height:${Math.max(3, (totals[i] / max) * 100)}%;background:${projected ? BRAND.brownLight : BRAND.brown}"></div></div>
      <div class="static-bar-label">${ML[m] || m}</div>
    </div>`;
  }).join("")}</div>`;
}

function pieFallback(pieData) {
  const total = pieData.reduce((s, item) => s + item.value, 0) || 1;
  return `<div class="static-pie-list">${pieData.map((item) => `<div class="static-pie-row">
    <span>${categoryIcon(item.name)}${item.name}</span>
    <strong>${fBRL(item.value)}</strong>
    <div class="progress-track"><div class="progress-fill" style="width:${Math.round((item.value / total) * 100)}%;background:${item.color}"></div></div>
  </div>`).join("")}</div>`;
}

function dashboard(rows, stats) {
  const isProj = state.selMon !== "all" && state.data.some((e) => e.month === state.selMon && e.projected);
  const byCat = CATS.map((cat) => {
    const catRows = rows.filter((e) => e.cat === cat.label);
    return { ...cat, total: catRows.reduce((s, e) => s + e.val, 0), n: catRows.length };
  }).filter((cat) => cat.n).sort((a, b) => b.total - a.total);
  const pieData = byCat.map((cat) => ({ name: cat.label, color: cat.color, value: cat.total }));
  const open = stats.totalMon - stats.paidMon;
  return html`
    ${monthSelector(stats.months)}
    <div class="metrics-grid">
      ${metric("Total acumulado", fBRL(stats.totalAll), `${stats.months.length} meses monitorados`)}
      ${metric("Mês selecionado", fBRL(stats.totalMon), `${rows.length} lançamentos filtrados`)}
      ${metric("Pendente no filtro", fBRL(open), "valor ainda a pagar", open > 0 ? "risk" : "good")}
      ${metric("Em atraso geral", fBRL(stats.overdueTotal), `${stats.overdue.length} lançamentos vencidos`, stats.overdueTotal > 0 ? "risk" : "good")}
    </div>
    <div class="dashboard-grid">
      <div class="card"><div class="card-title">Fluxo de saídas - Mai/26 a Mar/27</div><div class="chart-box">${barChart(stats.months)}</div><div class="legend-row"><span class="legend-item"><span class="legend-swatch" style="background:${BRAND.brown}"></span>Confirmado</span><span class="legend-item"><span class="legend-swatch" style="background:${BRAND.brownLight}"></span>Projetado</span></div></div>
      <div class="card"><div class="card-title"><span>Por categoria - ${ML[state.selMon] || state.selMon}</span>${isProj ? `<span class="projected-tag">projetado</span>` : ""}</div><div class="chart-box">${pieFallback(pieData)}</div></div>
    </div>
    <div class="card">
      <div class="card-title"><span>Resumo por categoria - ${ML[state.selMon] || state.selMon}</span>${isProj ? `<span class="projected-tag">projetado</span>` : ""}</div>
      <table class="category-summary"><tbody>${byCat.map((cat) => `<tr><td>${categoryIcon(cat.label)}${cat.label}</td><td class="number-cell"><strong>${fBRL(cat.total)}</strong></td><td class="number-cell muted">${cat.n} lanç.</td><td class="number-cell muted">${stats.totalMon ? Math.round((cat.total / stats.totalMon) * 100) : 0}%</td></tr>`).join("")}</tbody></table>
    </div>
  `;
}

function formPanel() {
  if (!state.showForm) return "";
  const form = state.form;
  const input = (label, type, key) => `<div class="form-field"><label>${label}</label><input class="field" type="${type}" data-form="${key}" value="${esc(form[key])}"></div>`;
  const title = state.editId ? "Editar lançamento" : state.duplicateMode ? "Duplicar lançamento" : "Novo lançamento";
  return html`
    <div class="card form-card">
      <div class="card-title"><span>${title}</span><button class="icon-button" data-action="cancelForm" type="button">X</button></div>
      <div class="form-grid">
        ${input("Descrição", "text", "desc")}
        ${input("Pessoa / Fornecedor", "text", "person")}
        ${input("Vencimento", "date", "due")}
        ${input("Valor (R$)", "number", "val")}
        ${input("Parcela", "text", "parcela")}
        <div class="form-field"><label>Categoria</label><select class="select" data-form="cat">${CATS.map((cat) => `<option value="${cat.label}" ${form.cat === cat.label ? "selected" : ""}>${cat.label}</option>`).join("")}</select></div>
      </div>
      <div class="toolbar" style="margin-top:14px;margin-bottom:0"><button class="primary-button" data-action="saveForm" type="button">${state.editId ? "Salvar alterações" : state.duplicateMode ? "Criar cópia" : "Adicionar"}</button><button class="ghost-button" data-action="cancelForm" type="button">Cancelar</button></div>
    </div>
  `;
}

function list(rows, stats) {
  const open = stats.totalMon - stats.paidMon;
  const openCount = rows.filter((e) => !e.paid).length;
  const paidCount = rows.length - openCount;
  const paidPct = stats.totalMon > 0 ? Math.round((stats.paidMon / stats.totalMon) * 100) : 0;
  const isProj = state.selMon !== "all" && state.data.some((e) => e.month === state.selMon && e.projected);
  return html`
    ${monthSelector(stats.months)}
    <div class="balance-card">
      <div class="balance-main"><div><div class="balance-label">Em aberto</div><div class="balance-open">${fBRL(open)}</div><div class="balance-sub">${openCount} lançamento${openCount !== 1 ? "s" : ""} pendente${openCount !== 1 ? "s" : ""}</div></div><div style="text-align:right"><div class="balance-label">Pago</div><div class="balance-paid">${fBRL(stats.paidMon)}</div><div class="balance-sub">${paidCount} lançamento${paidCount !== 1 ? "s" : ""}</div></div></div>
      <div style="margin-top:16px"><div class="balance-main" style="margin-bottom:6px"><span class="muted">Progresso do mês</span><strong class="muted">${paidPct}%</strong></div><div class="progress-track"><div class="progress-fill" style="width:${paidPct}%;min-width:${paidPct ? 6 : 0}px"></div></div><div class="balance-main" style="margin-top:6px"><span class="muted">R$ 0</span><span class="muted">${fBRL(stats.totalMon)}</span></div></div>
    </div>
    ${isProj ? `<div class="projected-note"><strong>${ML[state.selMon]}</strong> é um mês projetado. Edite os lançamentos ao confirmar o extrato real.</div>` : ""}
    <div class="toolbar"><input class="field" data-action="search" type="text" placeholder="Buscar descrição ou pessoa..." value="${esc(state.search)}" style="flex:1 1 260px"><select class="select" data-action="sort">${SORT_OPTS.map(([key, label]) => `<option value="${key}" ${state.sortKey === key ? "selected" : ""}>${label}</option>`).join("")}</select><button class="primary-button" data-action="startNew" type="button">${state.showForm && !state.editId ? "Cancelar" : "+ Lançamento"}</button></div>
    ${formPanel()}
    <div class="card table-card"><div class="table-scroll"><table class="expense-table"><thead><tr><th>Descrição</th><th>Categoria</th><th>Parcela</th><th>Vencimento</th><th class="number-cell">Valor</th><th>Status</th><th class="number-cell">Ações</th></tr></thead><tbody>
      ${rows.length ? rows.map((expense) => rowHtml(expense)).join("") : `<tr class="empty-row"><td colspan="7">Nenhum lançamento encontrado.</td></tr>`}
      ${rows.length ? `<tr class="total-row"><td colspan="4">Total filtrado</td><td class="number-cell">${fBRL(stats.totalMon)}</td><td colspan="2"></td></tr>` : ""}
    </tbody></table></div></div>
  `;
}

function rowHtml(expense) {
  const status = getStatus(expense);
  const token = SS[status];
  const classes = [expense.projected ? "projected" : "", expense.paid ? "paid-row" : "", status === "atrasado" ? "overdue-row" : "", state.editId === expense.id ? "editing-row" : ""].filter(Boolean).join(" ");
  return `<tr class="${classes}">
    <td><div class="desc-main">${esc(expense.desc)} ${expense.projected ? `<span class="muted">proj.</span>` : ""}</div><div class="desc-sub">${esc(expense.person)}</div></td>
    <td>${categoryIcon(expense.cat)}${esc(expense.cat)}</td>
    <td class="muted">${esc(expense.parcela)}</td>
    <td class="date-cell">${fDate(expense.due)}</td>
    <td class="number-cell"><strong>${fBRL(expense.val)}</strong></td>
    <td><span class="status-badge" style="background:${token.bg};color:${token.color}">${token.label}</span></td>
    <td><div class="actions">
      <button class="icon-button ${expense.paid ? "paid" : ""}" data-action="togglePaid" data-id="${expense.id}" type="button" title="${expense.paid ? "Marcar pendente" : "Marcar pago"}" aria-label="${expense.paid ? "Marcar pendente" : "Marcar pago"}">${icon("check")}</button>
      <button class="icon-button" data-action="duplicate" data-id="${expense.id}" type="button" title="Duplicar" aria-label="Duplicar">${icon("copy")}</button>
      <button class="icon-button" data-action="edit" data-id="${expense.id}" type="button" title="Editar" aria-label="Editar">${icon("edit")}</button>
      <button class="icon-button danger" data-action="delete" data-id="${expense.id}" type="button" title="Excluir" aria-label="Excluir">${icon("trash")}</button>
    </div></td>
  </tr>`;
}

function fillDuplicateForm(id) {
  const expense = state.data.find((item) => item.id === id);
  if (!expense) return;
  state.editId = null;
  state.duplicateMode = true;
  state.showForm = true;
  state.form = {
    desc: expense.desc,
    person: expense.person,
    cat: expense.cat,
    parcela: expense.parcela,
    due: expense.due,
    val: String(expense.val),
  };
  state.tab = "lista";
}

function duplicateExpense(id) {
  fillDuplicateForm(id);
  render();
}

function checkAppUpdateMessage() {
  const previousVersion = storageGet(APP_VERSION_KEY);
  if (previousVersion !== APP_VERSION) {
    state.updateMessage = APP_UPDATE_MESSAGE;
    storageSet(APP_VERSION_KEY, APP_VERSION);
  }
}

function loginScreen() {
  const libReady = Boolean(supabaseClient);
  return html`
    <section class="login-wrap">
      <div class="login-card">
        <img class="login-emblem" src="./assets/logo-usel.svg" alt="uselivinha" />
        <div class="login-kicker">controle de despesas</div>
        <h1>Acesse sua conta</h1>
        <p>${libReady ? "Digite seu e-mail para receber um link seguro de acesso." : "Não foi possível carregar o Supabase. Verifique a conexão e recarregue a página."}</p>
        <div class="login-actions">
          <input class="field" data-action="authEmail" type="email" inputmode="email" autocomplete="email" autofocus placeholder="seu@email.com" value="${esc(state.authEmail)}" ${libReady ? "" : "disabled"}>
          <button class="primary-button" data-action="login" type="button" ${libReady && !state.authLoading ? "" : "disabled"}>${state.authLoading ? "Enviando..." : "Enviar link de acesso"}</button>
        </div>
        <div class="sync-pill ${state.syncStatus}">${esc(state.syncMessage)}</div>
        ${state.authMessage ? `<div class="auth-message">${esc(state.authMessage)}</div>` : ""}
      </div>
    </section>
  `;
}

function accountTab() {
  const email = state.session?.user?.email || "usuário";
  return html`
    <section class="card account-card">
      <div>
        <div class="card-title">Conta</div>
        <h2>Conta conectada</h2>
        <p>Sessão ativa: <strong>${esc(email)}</strong></p>
        <p class="muted">Os dados desta conta são carregados e salvos no Supabase.</p>
      </div>
      <div class="sync-pill ${state.syncStatus}">${esc(state.syncMessage)}</div>
      <div class="account-actions">
        <button class="ghost-button" data-action="syncNow" type="button">Sincronizar agora</button>
        <button class="ghost-button" data-action="logout" type="button">Sair</button>
      </div>
    </section>
  `;
}

function render() {
  const previousFocus = document.activeElement?.dataset?.action;
  const connected = Boolean(state.session);
  const currentTab = connected
    ? (["dash", "lista", "conta"].includes(state.tab) ? state.tab : "dash")
    : "login";
  const rows = connected ? filteredRows() : [];
  const stats = appStats(rows);
  document.getElementById("root").innerHTML = html`
    <div class="app-shell">
      <header class="app-header">
        <div class="brand-mark"><img class="brand-emblem" src="./assets/logo-usel.svg" alt="uselivinha" /><div><div class="brand-title">uselivinha</div><div class="brand-subtitle">controle de despesas</div></div></div>
        <div class="header-total">${connected ? `${state.data.length} lançamentos` : "Acesso seguro"}<strong>${connected ? fBRL(stats.totalAll) : "Supabase"}</strong></div>
      </header>
      <main class="page">
        ${state.updateMessage ? `<div class="update-note"><span>${esc(state.updateMessage)}</span><button class="ghost-button" data-action="dismissUpdate" type="button">Ok</button></div>` : ""}
        ${state.dataReviewMessage ? `<div class="projected-note">${esc(state.dataReviewMessage)}</div>` : ""}
        ${connected
          ? `<div class="tabs" role="tablist"><button class="tab-button ${currentTab === "dash" ? "active" : ""}" data-action="tab" data-tab="dash" type="button">Dashboard</button><button class="tab-button ${currentTab === "lista" ? "active" : ""}" data-action="tab" data-tab="lista" type="button">Despesas</button><button class="tab-button ${currentTab === "conta" ? "active" : ""}" data-action="tab" data-tab="conta" type="button">Conta</button></div>`
          : ""}
        ${currentTab === "login" ? loginScreen() : currentTab === "dash" ? dashboard(rows, stats) : currentTab === "lista" ? list(rows, stats) : accountTab()}
      </main>
    </div>
  `;
  if (previousFocus === "authEmail") {
    const emailInput = document.querySelector('[data-action="authEmail"]');
    emailInput?.focus();
    emailInput?.setSelectionRange(emailInput.value.length, emailInput.value.length);
  }
}

function updateFormValue(target) {
  if (!target.dataset.form) return;
  state.form = { ...state.form, [target.dataset.form]: target.value };
}

document.addEventListener("input", (event) => {
  const target = event.target;
  updateFormValue(target);
  if (target.dataset.action === "authEmail") {
    state.authEmail = target.value;
  }
  if (target.dataset.action === "search") {
    state.search = target.value;
    render();
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;
  updateFormValue(target);
  if (target.dataset.action === "selMon") {
    state.selMon = target.value;
    render();
  }
  if (target.dataset.action === "sort") {
    state.sortKey = target.value;
    render();
  }
});

document.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) {
    if (state.monthMenuOpen) {
      state.monthMenuOpen = false;
      render();
    }
    return;
  }
  const action = target.dataset.action;
  if (action === "login") {
    if (!supabaseClient || !state.authEmail) return;
    state.authLoading = true;
    state.authMessage = "";
    render();
    const { error } = await supabaseClient.auth.signInWithOtp({
      email: state.authEmail,
      options: { emailRedirectTo: AUTH_REDIRECT_URL },
    });
    state.authLoading = false;
    state.authMessage = error ? error.message : "Link enviado. Abra seu e-mail para entrar.";
    render();
    return;
  }
  if (action === "logout") {
    if (supabaseClient) await supabaseClient.auth.signOut();
    state.session = null;
    state.tab = "login";
    state.data = [];
    state.syncStatus = "local";
    state.syncMessage = "Sessão encerrada";
    render();
    return;
  }
  if (action === "syncNow") {
    await loadRemoteData();
    return;
  }
  if (action === "dismissUpdate") {
    state.updateMessage = "";
    render();
    return;
  }
  if (action === "toggleMonthMenu") {
    state.monthMenuOpen = !state.monthMenuOpen;
    render();
    return;
  }
  if (action === "selMonth") {
    state.selMon = target.dataset.month;
    state.monthMenuOpen = false;
    render();
    return;
  }
  if (action === "tab" && state.session) state.tab = target.dataset.tab;
  if (action === "startNew") {
    state.editId = null;
    state.duplicateMode = false;
    state.form = { desc: "", person: "", cat: "Matéria-prima", parcela: "1/1", due: "", val: "" };
    state.showForm = !state.showForm;
  }
  if (action === "cancelForm") {
    state.showForm = false;
    state.editId = null;
    state.duplicateMode = false;
  }
  if (action === "togglePaid") {
    const expense = state.data.find((item) => item.id === target.dataset.id);
    if (expense) {
      const paid = !expense.paid;
      state.data = state.data.map((item) => item.id === target.dataset.id ? { ...item, paid } : item);
      const ok = await persistRemoteChange("update", target.dataset.id, { paid });
      if (!ok) state.data = state.data.map((item) => item.id === target.dataset.id ? expense : item);
      saveData();
    }
  }
  if (action === "delete" && confirm("Remover este lançamento?")) {
    const previous = state.data;
    state.data = state.data.filter((expense) => expense.id !== target.dataset.id);
    const ok = await persistRemoteChange("delete", target.dataset.id);
    if (!ok) state.data = previous;
    saveData();
  }
  if (action === "edit") {
    const expense = state.data.find((item) => item.id === target.dataset.id);
    if (expense) {
      state.editId = expense.id;
      state.duplicateMode = false;
      state.showForm = true;
      state.form = { desc: expense.desc, person: expense.person, cat: expense.cat, parcela: expense.parcela, due: expense.due, val: String(expense.val) };
    }
  }
  if (action === "duplicate") {
    fillDuplicateForm(target.dataset.id);
  }
  if (action === "saveForm") {
    const form = state.form;
    if (form.desc && form.due && form.val) {
      const month = form.due.slice(0, 7);
      const clean = { ...form, person: form.person || "Sem pessoa", month, val: parseFloat(String(form.val).replace(",", ".")), projected: false };
      if (state.editId) {
        const previous = state.data;
        const patch = {
          month: clean.month,
          person: clean.person,
          description: clean.desc,
          category: clean.cat,
          installment: clean.parcela,
          due: clean.due,
          value: clean.val,
          projected: false,
        };
        const saved = await persistRemoteChange("update", state.editId, patch);
        if (!saved) {
          state.data = previous;
          render();
          return;
        }
        state.data = state.data.map((expense) => expense.id === state.editId ? { ...expense, ...clean } : expense);
        if (saved && saved !== true) state.data = state.data.map((expense) => expense.id === state.editId ? fromDb(saved) : expense);
      } else {
        const localExpense = { id: uid(), ...clean, paid: false };
        const saved = await persistRemoteChange("insert", localExpense);
        if (!saved) {
          render();
          return;
        }
        state.data = [...state.data, saved && saved !== true ? fromDb(saved) : localExpense];
      }
      state.selMon = month;
      state.tab = "lista";
      state.showForm = false;
      state.editId = null;
      state.duplicateMode = false;
      saveData();
    }
  }
  render();
});

window.addEventListener("load", () => {
  document.querySelector('[data-action="authEmail"]')?.focus();
});

async function boot() {
  checkAppUpdateMessage();
  state.data = [];
  if (!supabaseClient) {
    state.tab = "login";
    state.syncStatus = "error";
    state.syncMessage = "Supabase indisponível";
    render();
    return;
  }

  state.syncStatus = "syncing";
  state.syncMessage = "Verificando sessão...";
  render();

  const { data } = await supabaseClient.auth.getSession();
  state.session = data.session;

  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    state.session = session;
    if (session) {
      state.tab = "dash";
      await loadRemoteData();
    } else {
      state.tab = "login";
      state.data = [];
      state.syncStatus = "local";
      state.syncMessage = "Aguardando login";
      render();
    }
  });

  if (state.session) {
    state.tab = ["dash", "lista", "conta"].includes(state.tab) ? state.tab : "dash";
    await loadRemoteData();
  } else {
    state.tab = "login";
    state.syncStatus = "local";
    state.syncMessage = "Aguardando login";
    render();
  }
}

boot();
