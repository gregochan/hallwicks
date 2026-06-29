import type { Capability, Environment, Project } from "@/lib/content/types";

export type Language = "en" | "zh";

export const languages: Language[] = ["en", "zh"];

export const dictionary = {
  en: {
    nav: {
      story: "Story",
      capabilities: "Capabilities",
      works: "Works",
      contact: "Contact",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      home: "Hallwicks home",
    },
    hero: {
      kicker: "est. 1987 // hk + china + sg",
      rotatorLabel: "specialized environments //",
      rotate: [
        "Medical centres",
        "Day procedure centres",
        "Laboratories",
        "Dental clinics & centres",
        "Veterinary hospitals",
      ],
      title: ["the intersection", "of care, precision,", "and space."],
      copy:
        "Hallwicks creates medical, dental, and specialist care interiors across Hong Kong, China, and Singapore. Since 1987, the studio has turned clinical workflow into calm, precise space.",
    },
    story: {
      label: "01 // Our story",
      title: "Designed for care environments where precision is operational.",
      paragraphs: [
        "Since 1987, Hallwicks has built a focused studio practice around medical and dental clinic environments across Hong Kong, China, and Singapore.",
        "We translate clinical workflow, patient movement, infection-aware detailing, brand image, and budget control into interiors that are efficient, precise, and quietly distinctive.",
        "Clients work with us because the design process is joined to delivery knowledge: planning, interior design, cost analysis, lighting design, site coordination, and direct access to furniture manufacturing resources in China.",
        "That integrated model gives each project a disciplined path from brief to handover, keeping technical requirements visible, details buildable, and the finished clinic calm, functional, and ready for long-term professional use.",
      ],
      stats: {
        founded: "Founded",
        experience: "Experience",
        regions: "Regions",
        yearSuffix: "yrs",
        regionText: "HK.China.SG",
      },
    },
    capabilities: {
      label: "02 // Capabilities",
      title: "One-stop clinical design intelligence.",
      intro:
        "From spatial strategy to the last site detail, Hallwicks connects technical planning with minimalist interior expression.",
    },
    environments: {
      label: "03 // Environments",
      title: "Specialized environments, exact requirements.",
    },
    clients: {
      label: "04 // Clients",
      title: "Trusted by specialist operators and care brands.",
    },
    works: {
      label: "05 // Selected works",
      title: "Featured works.",
      all: "All",
      filtersLabel: "Filter selected works",
      viewGallery: "View gallery",
      openGallery: "Open gallery for",
      closeGallery: "Close",
      previous: "Prev",
      next: "Next",
      showImage: "Show image",
    },
    contact: {
      label: "06 // Inquiry",
      title: "Let's talk.",
      copy:
        "Start a conversation about a clinic, medical center, dental suite, or healthcare environment that needs disciplined design thinking.",
      name: "name",
      email: "email",
      projectType: "project type",
      message: "message",
      submit: "submit inquiry",
    },
    footer: {
      legal: "Hallwicks Design Limited // © 2026",
      history: "story",
      services: "capabilities",
      projects: "works",
      email: "email",
    },
    scrollTop: "Scroll to top",
  },
  zh: {
    nav: {
      story: "故事",
      capabilities: "能力",
      works: "作品",
      contact: "聯絡",
      openMenu: "開啟選單",
      closeMenu: "關閉選單",
      home: "返回 Hallwicks 首頁",
    },
    hero: {
      kicker: "創立 1987 // 香港 + 中國 + 新加坡",
      rotatorLabel: "專門設計環境 //",
      rotate: ["醫療中心", "日間醫療程序中心", "化驗室", "牙科診所及中心", "獸醫醫院"],
      title: ["專業照護空間", "由精準設計開始"],
      copy:
        "Hallwicks 專注醫療、牙科及專科照護室內設計，服務香港、中國及新加坡。自 1987 年起，我們把臨床流程，化成冷靜、精準、經得起長期使用的空間。",
    },
    story: {
      label: "01 // 我們的故事",
      title: "為照護環境而設計，讓精準成為日常運作",
      paragraphs: [
        "自 1987 年起，Hallwicks 專注設計醫療及牙科診所環境，足跡遍及香港、中國及新加坡。",
        "臨床流程、病人動線、感染控制細節、品牌形象與預算管理，我們逐一梳理，轉化成高效、精準、低調而鮮明的空間。",
        "客戶選擇我們，因為設計與落地執行緊密相連。由規劃、室內設計、成本分析、燈光設計、現場協調，到中國家具製造資源，一應配合。",
        "這種整合模式，讓每個項目由簡報到交付都有清晰路徑。技術要求看得見，細節做得到，完成後的診所冷靜、實用，支援長期專業營運。",
      ],
      stats: {
        founded: "創立",
        experience: "經驗",
        regions: "地區",
        yearSuffix: "年",
        regionText: "香港.中國.新加坡",
      },
    },
    capabilities: {
      label: "02 // 核心能力",
      title: "一站式臨床設計判斷",
      intro: "由空間策略到最後一個現場細節，Hallwicks 把技術規劃與克制的室內表達連結起來。",
    },
    environments: {
      label: "03 // 專門環境",
      title: "不同照護場景，對應精準要求",
    },
    clients: {
      label: "04 // 客戶",
      title: "獲專科營運者及照護品牌信任",
    },
    works: {
      label: "05 // 精選作品",
      title: "代表項目",
      all: "全部",
      filtersLabel: "篩選精選作品",
      viewGallery: "查看相簿",
      openGallery: "開啟相簿：",
      closeGallery: "關閉",
      previous: "上一張",
      next: "下一張",
      showImage: "顯示圖片",
    },
    contact: {
      label: "06 // 查詢",
      title: "開始對話",
      copy: "診所、醫療中心、牙科空間或照護環境，需要嚴謹而清晰的設計思考，歡迎與我們聯絡。",
      name: "姓名",
      email: "電郵",
      projectType: "項目類型",
      message: "訊息",
      submit: "提交查詢",
    },
    footer: {
      legal: "Hallwicks Design Limited // © 2026",
      history: "故事",
      services: "能力",
      projects: "作品",
      email: "電郵",
    },
    scrollTop: "返回頁首",
  },
} as const;

export function localizeCapability(item: Capability, language: Language): Capability {
  if (language === "en") return item;

  const copy: Record<string, Pick<Capability, "title" | "copy">> = {
    planning: {
      title: "空間規劃",
      copy: "為專科環境規劃功能分區、臨床鄰接、動線及無菌工作流程。",
    },
    management: {
      title: "項目管理",
      copy: "由簡報到交付，統籌顧問、進度、採購與執行紀律。",
    },
    analysis: {
      title: "成本分析",
      copy: "早期預算、規格控制與價值規劃，配合醫療級項目要求。",
    },
    site: {
      title: "現場管理",
      copy: "管理施工、安裝次序及細節控制，支援高度服務化的醫療裝修。",
    },
    interior: {
      title: "室內設計",
      copy: "為照護空間設計精準的室內建築、訂製木作、燈光、物料與家具系統。",
    },
    brand: {
      title: "品牌體驗",
      copy: "把臨床品牌轉化為接待、治療及診症空間中的空間識別系統。",
    },
  };

  return { ...item, ...(copy[item.icon] ?? {}) };
}

export function localizeEnvironment(item: Environment, language: Language): Environment {
  if (language === "en") return item;

  const copy: Record<string, Pick<Environment, "title" | "copy">> = {
    medical: {
      title: "醫療中心",
      copy: "診症套房、影像支援、治療室及專科臨床規劃",
    },
    procedure: {
      title: "日間醫療程序中心",
      copy: "具牌照要求的程序空間，配合復甦、支援及臨床流程控制",
    },
    lab: {
      title: "化驗室",
      copy: "技術房間、易清潔表面、儲存、公用設施及樣本處理支援",
    },
    dental: {
      title: "牙科診所及中心",
      copy: "牙科治療間、消毒流程、牙科技工支援及病人體驗節點",
    },
    veterinary: {
      title: "獸醫醫院",
      copy: "為候診、治療、準備及復甦區域提供耐用的醫療級室內環境",
    },
  };

  return { ...item, ...(copy[item.icon] ?? {}) };
}

export function localizeProject(project: Project, language: Language): Project {
  if (language === "en") return project;

  if (project.titleZh || project.metaZh || project.descriptionZh) {
    return {
      ...project,
      description: project.descriptionZh || project.description,
      meta: project.metaZh || project.meta,
      title: project.titleZh || project.title,
    };
  }

  const copy: Record<string, Pick<Project, "title" | "meta">> = {
    "Great People Branemark Center": {
      title: "上海品眾口腔門診部",
      meta: "上海，中國 // 牙科中心 // 2019",
    },
    "St. George Medical Center": {
      title: "St. George 醫療中心",
      meta: "香港 // 專科診所 // 2019",
    },
    "Conch Hospital": {
      title: "芜湖海螺医院",
      meta: "安徽，中國 // 牙科部 // 2019",
    },
    "Clinic A K11 TST": {
      title: "Clinic A K11 尖沙咀",
      meta: "香港 // 牙科診所 // 2019",
    },
    "Clinic A Dental Section": {
      title: "Clinic A 牙科區域",
      meta: "香港 // 臨床室內 // 2019",
    },
    "Langham Place Orthodontics": {
      title: "朗豪坊矯齒中心",
      meta: "香港九龍 // 矯齒中心 // 2019",
    },
    "Varios Dental Clinic": {
      title: "Varios 牙科診所",
      meta: "香港 // 牙科診所",
    },
    "VSH Wanchai MRI": {
      title: "VSH 灣仔 MRI",
      meta: "香港 // 獸醫醫院 // MRI 套房",
    },
    "Monnis Restaurant": {
      title: "Monnis 餐廳",
      meta: "蒙古 // 餐飲空間 // 2016",
    },
    "Private Residence": {
      title: "私人住宅",
      meta: "住宅 // 室內設計",
    },
  };

  return { ...project, ...(copy[project.title] ?? {}) };
}
