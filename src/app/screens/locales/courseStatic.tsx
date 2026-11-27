export type LangCode = "vi" | "en" | "ko" | "zh-CN" | "ja" | "fr" | "de" | "ru" | "es";

export const COURSE_STATIC_LABELS: Record<
  LangCode,
  {
    courseTitle: string;
    courseSubtitle: string;
    programTitle: string;
    programSubtitle: string;
    programDesc: string;
    partLabel: (partNum: number) => string;
    statsText: (lessons: number, skills: number) => string;
    specialSection: string;
    vocabBoard: string;
    tabHome: string;
    tabLessons: string;
    tabSettings: string;
    sections: {
      phonetics_writing: { title: string; subtitle: string };
      pronunciation_drills: { title: string; subtitle: string };
      thematic_lessons: { title: string; subtitle: string };
    };
  }
> = {
  vi: {
    courseTitle: "Tiếng Việt",
    courseSubtitle: "Khóa học tiếng Việt",
    programTitle: "Chương trình học",
    programSubtitle: "Lộ trình nền tảng",
    programDesc: "Chọn phần học phù hợp với bạn",
    partLabel: (n) => `PHẦN ${n}`,
    statsText: (lessons, skills) => `${lessons} bài học • ${skills} kỹ năng`,
    specialSection: "PHẦN ĐẶC BIỆT",
    vocabBoard: "BẢNG TỪ VỰNG",
    tabHome: "Trang chủ",
    tabLessons: "Bài học",
    tabSettings: "Cài đặt",
    sections: {
      phonetics_writing: {
        title: "Ngữ âm và chữ viết",
        subtitle: "Bảng chữ cái, dấu thanh & luyện viết",
      },
      pronunciation_drills: {
        title: "Luyện Phát âm",
        subtitle: "Âm đầu, vần & thanh điệu",
      },
      thematic_lessons: {
        title: "Bài học theo chủ đề",
        subtitle: "Từ vựng & đoạn văn theo chủ đề",
      },
    },
  },
  en: {
    courseTitle: "Vietnamese",
    courseSubtitle: "Vietnamese Language Course",
    programTitle: "Learning Program",
    programSubtitle: "Core Curriculum",
    programDesc: "Choose the section that suits you",
    partLabel: (n) => `PART ${n}`,
    statsText: (lessons, skills) => `${lessons} lessons • ${skills} skills`,
    specialSection: "SPECIAL SECTION",
    vocabBoard: "VOCABULARY BANK",
    tabHome: "Home",
    tabLessons: "Lessons",
    tabSettings: "Settings",
    sections: {
      phonetics_writing: {
        title: "Phonetics and Writing",
        subtitle: "Writing system, tones & spelling",
      },
      pronunciation_drills: {
        title: "Pronunciation Drills",
        subtitle: "Sounds, vowels & six tones",
      },
      thematic_lessons: {
        title: "Thematic Lessons",
        subtitle: "Topic-based reading & words",
      },
    },
  },
  ko: {
    courseTitle: "베트남어",
    courseSubtitle: "베트남어 학습 과정",
    programTitle: "학습 프로그램",
    programSubtitle: "기초 커리큘럼",
    programDesc: "원하는 학습 파트를 선택하세요",
    partLabel: (n) => `${n}단계`,
    statsText: (lessons, skills) => `${lessons}강 • ${skills}개 영역`,
    specialSection: "특별 섹션",
    vocabBoard: "단어장",
    tabHome: "홈",
    tabLessons: "학습",
    tabSettings: "설정",
    sections: {
      phonetics_writing: {
        title: "음성 및 문자 쓰기",
        subtitle: "문자 체계, 성조 및 철자 연습",
      },
      pronunciation_drills: {
        title: "발음 훈련",
        subtitle: "자음·모음 및 성조 연습",
      },
      thematic_lessons: {
        title: "주제별 학습",
        subtitle: "주제별 어휘 및 읽기 연습",
      },
    },
  },
  "zh-CN": {
    courseTitle: "越南语",
    courseSubtitle: "越南语语言课程",
    programTitle: "学习项目",
    programSubtitle: "基础课程体系",
    programDesc: "选择适合你的学习部分",
    partLabel: (n) => `第 ${n} 部分`,
    statsText: (lessons, skills) => `${lessons} 课时 • ${skills} 项技能`,
    specialSection: "特色板块",
    vocabBoard: "词汇表",
    tabHome: "首页",
    tabLessons: "课程",
    tabSettings: "设置",
    sections: {
      phonetics_writing: {
        title: "语音与书写",
        subtitle: "书写系统、声调与拼写",
      },
      pronunciation_drills: {
        title: "发音训练",
        subtitle: "辅音、韵母与声调练习",
      },
      thematic_lessons: {
        title: "主题课程",
        subtitle: "按主题分类的词汇与阅读",
      },
    },
  },
  ja: {
    courseTitle: "ベトナム語",
    courseSubtitle: "ベトナム語学習コース",
    programTitle: "学習プログラム",
    programSubtitle: "基礎カリキュラム",
    programDesc: "自分に合ったセクションを選んでください",
    partLabel: (n) => `第${n}部`,
    statsText: (lessons, skills) => `${lessons}レッスン • ${skills}スキル`,
    specialSection: "特別セクション",
    vocabBoard: "単語一覧",
    tabHome: "ホーム",
    tabLessons: "学習",
    tabSettings: "設定",
    sections: {
      phonetics_writing: {
        title: "音声と文字表記",
        subtitle: "文字体系・声調・書き取り",
      },
      pronunciation_drills: {
        title: "発音トレーニング",
        subtitle: "子音・母音・声調の練習",
      },
      thematic_lessons: {
        title: "テーマ別レッスン",
        subtitle: "テーマ別の語彙と読解",
      },
    },
  },
  fr: {
    courseTitle: "Vietnamien",
    courseSubtitle: "Cours de langue vietnamienne",
    programTitle: "Programme d'apprentissage",
    programSubtitle: "Parcours fondamental",
    programDesc: "Choisissez la section qui vous convient",
    partLabel: (n) => `PARTIE ${n}`,
    statsText: (lessons, skills) => `${lessons} leçons • ${skills} compétences`,
    specialSection: "SECTION SPÉCIALE",
    vocabBoard: "LISTE DE VOCABULAIRE",
    tabHome: "Accueil",
    tabLessons: "Leçons",
    tabSettings: "Paramètres",
    sections: {
      phonetics_writing: {
        title: "Phonétique et écriture",
        subtitle: "Système d'écriture, tons et orthographe",
      },
      pronunciation_drills: {
        title: "Exercices de prononciation",
        subtitle: "Sons, voyelles et tons",
      },
      thematic_lessons: {
        title: "Leçons thématiques",
        subtitle: "Vocabulaire et lecture par thème",
      },
    },
  },
  de: {
    courseTitle: "Vietnamesisch",
    courseSubtitle: "Vietnamesisch-Sprachkurs",
    programTitle: "Lernprogramm",
    programSubtitle: "Grundlagen-Lehrplan",
    programDesc: "Wählen Sie den passenden Abschnitt",
    partLabel: (n) => `TEIL ${n}`,
    statsText: (lessons, skills) => `${lessons} Lektionen • ${skills} Fähigkeiten`,
    specialSection: "SPEZIELLER ABSCHNITT",
    vocabBoard: "WORTSCHATZLISTE",
    tabHome: "Startseite",
    tabLessons: "Lektionen",
    tabSettings: "Einstellungen",
    sections: {
      phonetics_writing: {
        title: "Phonetik und Schrift",
        subtitle: "Schriftsystem, Töne & Rechtschreibung",
      },
      pronunciation_drills: {
        title: "Ausspracheübungen",
        subtitle: "Laute, Vokale & sechs Töne",
      },
      thematic_lessons: {
        title: "Thematische Lektionen",
        subtitle: "Themenbezogener Wortschatz & Lesen",
      },
    },
  },
  ru: {
    courseTitle: "Вьетнамский",
    courseSubtitle: "Курс вьетнамского языка",
    programTitle: "Программа обучения",
    programSubtitle: "Базовый курс",
    programDesc: "Выберите подходящий раздел",
    partLabel: (n) => `ЧАСТЬ ${n}`,
    statsText: (lessons, skills) => `${lessons} уроков • ${skills} навыков`,
    specialSection: "СПЕЦИАЛЬНЫЙ РАЗДЕЛ",
    vocabBoard: "СЛОВАРНЫЙ ЗАПАС",
    tabHome: "Главная",
    tabLessons: "Уроки",
    tabSettings: "Настройки",
    sections: {
      phonetics_writing: {
        title: "Фонетика и письмо",
        subtitle: "Система письма, тоны и правописание",
      },
      pronunciation_drills: {
        title: "Упражнения по произношению",
        subtitle: "Звуки, гласные и шесть тонов",
      },
      thematic_lessons: {
        title: "Тематические уроки",
        subtitle: "Лексика и чтение по темам",
      },
    },
  },
  es: {
    courseTitle: "Vietnamita",
    courseSubtitle: "Curso de idioma vietnamita",
    programTitle: "Programa de aprendizaje",
    programSubtitle: "Plan de estudios básico",
    programDesc: "Elige la sección que más te convenga",
    partLabel: (n) => `PARTE ${n}`,
    statsText: (lessons, skills) => `${lessons} lecciones • ${skills} habilidades`,
    specialSection: "SECCIÓN ESPECIAL",
    vocabBoard: "BANCO DE VOCABULARIO",
    tabHome: "Inicio",
    tabLessons: "Lecciones",
    tabSettings: "Ajustes",
    sections: {
      phonetics_writing: {
        title: "Fonética y escritura",
        subtitle: "Sistema de escritura, tonos y ortografía",
      },
      pronunciation_drills: {
        title: "Ejercicios de pronunciación",
        subtitle: "Sonidos, vocales y seis tonos",
      },
      thematic_lessons: {
        title: "Lecciones temáticas",
        subtitle: "Vocabulario y lectura por temas",
      },
    },
  },
};