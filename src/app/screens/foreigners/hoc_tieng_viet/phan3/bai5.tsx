// Phần 3 - Bài 5: Bài tập tổng hợp (Comprehensive Practice)
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { API_ENDPOINTS } from '../../../../../config/api';

const THEME = '#059669';
type SectionKey = 'tracNghiem' | 'dienTu' | 'nguPhap' | 'hoiThoai' | 'nghe';
interface Props { navigation: any; }

// ─────────────────────────────────────────────────────────────
// TYPES - CẤU TRÚC DỮ LIỆU ĐƯỢC LOAD ĐỘNG TỪ BẢNG CAU_HOI_NN (BAI_HOC_ID = 9)
// ─────────────────────────────────────────────────────────────
interface TracNghiemItem {
  id: number;
  cat?: string;
  q: string;
  opts: string[];
  ans: string;
}

interface DienTuDang1Item {
  id: number;
  cat?: string;
  sentence: string;
  wordBank: string[];
  ans: string;
}

interface DienTuDang2Item {
  id: number;
  cat?: string;
  emoji: string;
  hint: string;
  ans: string;
}

interface DienTuDang3Item {
  id: number;
  cat?: string;
  emoji: string;
  shuffled: string[];
  ans: string;
}

interface NguPhapDang1Item {
  id: number;
  cat?: string;
  sentence: string;
  wordBank: string[];
  ans: string;
}

interface NguPhapDang2Item {
  id: number;
  cat?: string;
  original: string;
  rewrite: string;
  ans: string;
}

interface NguPhapDang3Item {
  id: number;
  cat?: string;
  words: string[];
  ans: string;
}

interface NguPhapDang4Item {
  id: number;
  cat?: string;
  emoji: string;
  words: string[];
  ans: string;
}

interface HoiThoaiDang1Item {
  id: number;
  cat?: string;
  q: string;
  opts: string[];
  ans: string;
}

interface HoiThoaiDang2Item {
  id: number;
  cat?: string;
  title: string;
  lines: { key: string; text: string }[];
  ans: string[];
}

interface HoiThoaiDang3Item {
  id: number;
  cat?: string;
  dialogue: string;
  blank: string;
  wordBank: string[];
}

interface NgheDang1Item {
  id: number;
  cat?: string;
  audio: string;
  opts: string[];
  ans: string;
}

interface NgheDang2Item {
  id: number;
  cat?: string;
  audio: string;
  ans: string;
}

interface NgheDang3Item {
  id: number;
  cat?: string;
  audio: string;
  emojis: string[];
  ans: string;
}

// ─────────────────────────────────────────────────────────────
// PARSER CAU_HOI_NN TỪ MYSQL CHO BÀI 5 TỔNG HỢP (50 CÂU)
// ─────────────────────────────────────────────────────────────
const parseCauHoiNN = (rows: any[]) => {
  const byDang: Record<string, any[]> = {};
  rows.forEach((r) => {
    byDang[r.dang_bai] = byDang[r.dang_bai] || [];
    byDang[r.dang_bai].push(r);
  });

  const tracNghiem = (byDang.trac_nghiem || []).map((q, idx) => {
    const optsObj = typeof q.du_lieu_phuong_an === 'string' ? JSON.parse(q.du_lieu_phuong_an) : q.du_lieu_phuong_an;
    return {
      id: idx + 1,
      cat: q.phan_loai_phu || 'Trắc nghiệm',
      q: q.de_bai,
      opts: Object.entries(optsObj || {}).map(([k, v]) => `${k}. ${v}`),
      ans: q.dap_an_chuan,
    };
  });

  const dienTuRows = byDang.dien_tu || [];
  const dienTuDang1 = dienTuRows.slice(0, 4).map((q, idx) => {
    const p = typeof q.du_lieu_phuong_an === 'string' ? JSON.parse(q.du_lieu_phuong_an) : q.du_lieu_phuong_an;
    return { id: idx + 1, cat: q.phan_loai_phu, sentence: q.de_bai, wordBank: (p && p.bank) || [], ans: q.dap_an_chuan };
  });
  const dienTuDang2Emojis = ['✈️', '🏥', '🥖'];
  const dienTuDang2 = dienTuRows.slice(4, 7).map((q, idx) => {
    return { id: idx + 1, cat: q.phan_loai_phu, emoji: dienTuDang2Emojis[idx] || '📝', hint: q.chu_thich || q.de_bai, ans: q.dap_an_chuan };
  });
  const dienTuDang3Emojis = ['🏫', '🏥', '✈️'];
  const dienTuDang3 = dienTuRows.slice(7, 10).map((q, idx) => {
    const p = typeof q.du_lieu_phuong_an === 'string' ? JSON.parse(q.du_lieu_phuong_an) : q.du_lieu_phuong_an;
    return {
      id: idx + 1,
      cat: q.phan_loai_phu,
      emoji: dienTuDang3Emojis[idx] || '🔤',
      shuffled: ((p && p.letters) || []).map((l: string) => l.toUpperCase()),
      ans: (q.dap_an_chuan || '').toUpperCase(),
    };
  });

  const nguPhapRows = byDang.ngu_phap || [];
  const nguPhapDang1 = nguPhapRows.slice(0, 3).map((q, idx) => {
    const p = typeof q.du_lieu_phuong_an === 'string' ? JSON.parse(q.du_lieu_phuong_an) : q.du_lieu_phuong_an;
    const sent = q.de_bai.replace('Kéo từ đúng vào chỗ trống. ', '').trim();
    return { id: idx + 1, cat: q.phan_loai_phu, sentence: sent, wordBank: (p && p.bank) || [], ans: q.dap_an_chuan };
  });
  const nguPhapDang2 = nguPhapRows.slice(3, 6).map((q, idx) => {
    return { id: idx + 1, cat: q.phan_loai_phu, original: q.de_bai, rewrite: q.chu_thich || q.de_bai, ans: q.dap_an_chuan };
  });
  const nguPhapDang3 = nguPhapRows.slice(6, 8).map((q, idx) => {
    const p = typeof q.du_lieu_phuong_an === 'string' ? JSON.parse(q.du_lieu_phuong_an) : q.du_lieu_phuong_an;
    return { id: idx + 1, cat: q.phan_loai_phu, words: (p && p.words) || [], ans: q.dap_an_chuan };
  });
  const nguPhapDang4Emojis = ['🏥', '✈️'];
  const nguPhapDang4 = nguPhapRows.slice(8, 10).map((q, idx) => {
    const p = typeof q.du_lieu_phuong_an === 'string' ? JSON.parse(q.du_lieu_phuong_an) : q.du_lieu_phuong_an;
    return { id: idx + 1, cat: q.phan_loai_phu, emoji: nguPhapDang4Emojis[idx] || '🖼️', words: (p && p.words) || [], ans: q.dap_an_chuan };
  });

  const hoiThoaiRows = byDang.hoi_thoai || [];
  const hoiThoaiDang1 = hoiThoaiRows.slice(0, 4).map((q, idx) => {
    const p = typeof q.du_lieu_phuong_an === 'string' ? JSON.parse(q.du_lieu_phuong_an) : q.du_lieu_phuong_an;
    const promptLine = p && p.lines && p.lines[0] ? `${p.lines[0].speaker}: "${p.lines[0].text}"` : q.phan_loai_phu;
    return {
      id: idx + 1,
      cat: q.phan_loai_phu,
      q: `${promptLine} – Chọn câu trả lời:`,
      opts: ((p && p.options) || []).map((o: any) => `${o.key}. ${o.text}`),
      ans: q.dap_an_chuan,
    };
  });
  const hoiThoaiDang2 = hoiThoaiRows.slice(4, 7).map((q, idx) => {
    const p = typeof q.du_lieu_phuong_an === 'string' ? JSON.parse(q.du_lieu_phuong_an) : q.du_lieu_phuong_an;
    const keys = ['A', 'B', 'C', 'D'];
    return {
      id: idx + 1,
      cat: q.phan_loai_phu,
      title: q.phan_loai_phu || `Hội thoại ${idx + 1}`,
      lines: ((p && p.lines) || []).map((l: any, i: number) => ({ key: keys[i] || String(i), text: `${l.speaker}: ${l.text}` })),
      ans: ((p && p.lines) || []).map((_: any, i: number) => keys[i]),
    };
  });
  const hoiThoaiDang3 = hoiThoaiRows.slice(7, 10).map((q, idx) => {
    const p = typeof q.du_lieu_phuong_an === 'string' ? JSON.parse(q.du_lieu_phuong_an) : q.du_lieu_phuong_an;
    const fullText = ((p && p.lines) || []).map((l: any) => `${l.speaker}: ${l.text}`).join(' ');
    const blankWord = q.dap_an_chuan ? q.dap_an_chuan.split(',')[0].trim() : 'đường';
    return {
      id: idx + 1,
      cat: q.phan_loai_phu,
      dialogue: fullText,
      blank: blankWord,
      wordBank: [blankWord, 'ở', 'đến', 'làm'],
    };
  });

  const ngheRows = byDang.nghe_dien_tu || [];
  const ngheDang1 = ngheRows.slice(0, 4).map((q, idx) => {
    const p = typeof q.du_lieu_phuong_an === 'string' ? JSON.parse(q.du_lieu_phuong_an) : q.du_lieu_phuong_an;
    return {
      id: idx + 1,
      cat: q.phan_loai_phu,
      audio: `🔊 "${q.de_bai}"`,
      opts: ((p && p.options) || []).map((o: any) => `${o.key}. ${o.text}`),
      ans: q.dap_an_chuan,
    };
  });
  const ngheDang2 = ngheRows.slice(4, 7).map((q, idx) => {
    const p = typeof q.du_lieu_phuong_an === 'string' ? JSON.parse(q.du_lieu_phuong_an) : q.du_lieu_phuong_an;
    return {
      id: idx + 1,
      cat: q.phan_loai_phu,
      audio: `🔊 "${(p && p.sentence) || q.de_bai}"`,
      ans: q.dap_an_chuan,
    };
  });
  const ngheDang3Emojis: Record<string, string[]> = {
    'Nhà ga': ['🚉', '🏠', '🏥', '🏢', '✈️'],
    'Tôi đặt vé máy bay': ['✈️', '🚗', '🚢', '🚲', '🏍️'],
    'Tôi bị đau đầu': ['🤕', '😀', '🏃', '🏊', '🍳'],
  };
  const ngheDang3 = ngheRows.slice(7, 10).map((q, idx) => {
    const ems = ngheDang3Emojis[q.de_bai] || ['🏠', '🏫', '🏥', '🏢', '✈️'];
    return {
      id: idx + 1,
      cat: q.phan_loai_phu,
      audio: `🔊 "${q.de_bai}"`,
      emojis: ems,
      ans: ems[0],
    };
  });

  return {
    tracNghiem,
    dienTuDang1,
    dienTuDang2,
    dienTuDang3,
    nguPhapDang1,
    nguPhapDang2,
    nguPhapDang3,
    nguPhapDang4,
    hoiThoaiDang1,
    hoiThoaiDang2,
    hoiThoaiDang3,
    ngheDang1,
    ngheDang2,
    ngheDang3,
  };
};

// ─────────────────────────────────────────────────────────────
// SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────
const ResultBanner: React.FC<{ correct: boolean; onRetry: () => void }> = ({ correct, onRetry }) => (
  <View style={[styles.banner, { backgroundColor: correct ? '#D1FAE5' : '#FEE2E2' }]}>
    <Text style={[styles.bannerTitle, { color: correct ? '#065F46' : '#991B1B' }]}>
      {correct ? '🎉 Chúc mừng bạn đúng hết bài học!' : '❌ Còn sai! Hãy làm lại nhé.'}
    </Text>
    {!correct && (
      <TouchableOpacity onPress={onRetry} style={[styles.retryBtn, { backgroundColor: '#DC2626' }]}>
        <Text style={styles.retryText}>Làm lại • Retry</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─────────────────────────────────────────────────────────────
// TRẮC NGHIỆM
// ─────────────────────────────────────────────────────────────
const TracNghiemSection: React.FC<{ data?: TracNghiemItem[] }> = ({ data = [] }) => {
  const tracNghiemList = data;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setShowResult(false);
  }, [data]);

  const handleSubmit = () => {
    if (!tracNghiemList.every(q => answers[q.id])) { Alert.alert('Chưa xong!', 'Chọn tất cả đáp án.'); return; }
    setSubmitted(true);
    const ok = tracNghiemList.every(q => answers[q.id] === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 120000);
  };

  const allCorrect = submitted && tracNghiemList.every(q => answers[q.id] === q.ans);

  if (tracNghiemList.length === 0) {
    return (
      <View style={styles.questionCard}>
        <Text style={styles.placeholder}>Đang tải câu hỏi từ database (bài học 9)...</Text>
      </View>
    );
  }

  return (
    <View>
      {tracNghiemList.map(q => (
        <View key={q.id} style={styles.questionCard}>
          <Text style={styles.catBadge}>{q.cat}</Text>
          <Text style={styles.questionText}>Câu {q.id}: {q.q}</Text>
          {q.opts.map(opt => {
            const letter = opt[0];
            const chosen = answers[q.id] === letter;
            const isCorrect = submitted && letter === q.ans;
            const isWrong = submitted && chosen && letter !== q.ans;
            return (
              <TouchableOpacity key={opt} onPress={() => !submitted && setAnswers(p => ({ ...p, [q.id]: letter }))}
                style={[styles.optBtn, chosen && !submitted && { borderColor: THEME, backgroundColor: '#D1FAE5' }, isCorrect && { borderColor: '#059669', backgroundColor: '#D1FAE5' }, isWrong && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.optText, isWrong && { color: '#DC2626', fontWeight: '700' }]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// ĐIỀN TỪ
// ─────────────────────────────────────────────────────────────
const DienTuDang1: React.FC<{ data?: DienTuDang1Item[] }> = ({ data = [] }) => {
  const list = data;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setShowResult(false);
  }, [data]);

  const handleSubmit = () => {
    if (!list.every(q => answers[q.id])) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = list.every(q => answers[q.id] === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 12000);
  };

  const allCorrect = submitted && list.every(q => answers[q.id] === q.ans);

  if (list.length === 0) {
    return (
      <View style={styles.questionCard}>
        <Text style={styles.placeholder}>Đang tải câu hỏi từ database (bài học 9)...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 1: Chọn từ điền vào chỗ trống</Text>
      {list.map(q => {
        const parts = q.sentence.split('___');
        const isCorrect = submitted && answers[q.id] === q.ans;
        const isWrong = submitted && answers[q.id] !== q.ans;
        return (
          <View key={q.id} style={styles.questionCard}>
            {q.cat ? <Text style={styles.catBadge}>🏷️ {q.cat}</Text> : null}
            <View style={styles.sentenceRow}>
              <Text style={styles.sentText}>{parts[0]}</Text>
              <View style={[styles.blankBox, isCorrect && { borderColor: '#059669', backgroundColor: '#D1FAE5' }, isWrong && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.blankText, isWrong && { color: '#DC2626' }]}>{answers[q.id] || '   '}</Text>
              </View>
              <Text style={styles.sentText}>{parts[1] || ''}</Text>
            </View>
            <View style={styles.wordBankRow}>
              {q.wordBank.map(w => (
                <TouchableOpacity key={w} onPress={() => !submitted && setAnswers(p => ({ ...p, [q.id]: w }))} style={[styles.wordChip, answers[q.id] === w && { backgroundColor: THEME }]}>
                  <Text style={[styles.wordChipText, answers[q.id] === w && { color: 'white' }]}>{w}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const DienTuDang2: React.FC<{ data?: DienTuDang2Item[] }> = ({ data = [] }) => {
  const list = data;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setShowResult(false);
  }, [data]);

  const handleSubmit = () => {
    if (!list.every(q => answers[q.id]?.trim())) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = list.every(q => answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase());
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 120000);
  };

  const allCorrect = submitted && list.every(q => answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase());

  if (list.length === 0) {
    return (
      <View style={styles.questionCard}>
        <Text style={styles.placeholder}>Đang tải câu hỏi từ database (bài học 9)...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 2: Nhìn hình – Gõ từ</Text>
      {list.map(q => {
        const correct = submitted && answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase();
        const wrong = submitted && !correct;
        return (
          <View key={q.id} style={styles.questionCard}>
            {q.cat ? <Text style={styles.catBadge}>🏷️ {q.cat}</Text> : null}
            <Text style={styles.bigEmoji}>{q.emoji}</Text>
            <Text style={styles.hintText}>{q.hint}</Text>
            <TextInput
              style={[styles.typeInput, correct && { borderColor: '#059669', backgroundColor: '#D1FAE5' }, wrong && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}
              value={answers[q.id] || ''}
              onChangeText={t => !submitted && setAnswers(p => ({ ...p, [q.id]: t }))}
              placeholder="Gõ từ tiếng Việt..."
              editable={!submitted}
            />
            {wrong && <Text style={styles.correctHint}>✓ Đáp án: {q.ans}</Text>}
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const DienTuDang3: React.FC<{ data?: DienTuDang3Item[] }> = ({ data = [] }) => {
  const list = data;
  const [arranged, setArranged] = useState<Record<number, string[]>>(
    Object.fromEntries(list.map(q => [q.id, [...q.shuffled].sort(() => Math.random() - 0.5)]))
  );
  const [answers, setAnswers] = useState<Record<number, string[]>>(
    Object.fromEntries(list.map(q => [q.id, []]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setArranged(Object.fromEntries(list.map(q => [q.id, [...q.shuffled].sort(() => Math.random() - 0.5)])));
    setAnswers(Object.fromEntries(list.map(q => [q.id, []])));
    setSubmitted(false);
    setShowResult(false);
  }, [data]);

  const moveLetter = (qid: number, letter: string, from: 'bank' | 'answer') => {
    if (submitted) return;
    if (from === 'bank') {
      setArranged(prev => {
        const cur = prev[qid] || [];
        const idx = cur.indexOf(letter); if (idx === -1) return prev;
        const n = [...cur]; n.splice(idx, 1);
        return { ...prev, [qid]: n };
      });
      setAnswers(prev => ({ ...prev, [qid]: [...(prev[qid] || []), letter] }));
    } else {
      setAnswers(prev => {
        const cur = prev[qid] || [];
        const idx = cur.indexOf(letter); if (idx === -1) return prev;
        const n = [...cur]; n.splice(idx, 1);
        return { ...prev, [qid]: n };
      });
      setArranged(prev => ({ ...prev, [qid]: [...(prev[qid] || []), letter] }));
    }
  };

  const handleSubmit = () => {
    if (!list.every(q => (answers[q.id] || []).length > 0)) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = list.every(q => (answers[q.id] || []).join('') === q.ans.replace(/ /g, ''));
    setShowResult(true);
    if (!ok) setTimeout(() => {
      setSubmitted(false); setShowResult(false);
      setArranged(Object.fromEntries(list.map(q => [q.id, [...q.shuffled].sort(() => Math.random() - 0.5)])));
      setAnswers(Object.fromEntries(list.map(q => [q.id, []])));
    }, 120000);
  };

  const allCorrect = submitted && list.every(q => (answers[q.id] || []).join('') === q.ans.replace(/ /g, ''));

  if (list.length === 0) {
    return (
      <View style={styles.questionCard}>
        <Text style={styles.placeholder}>Đang tải câu hỏi từ database (bài học 9)...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 3: Sắp xếp chữ cái thành từ</Text>
      {list.map(q => {
        const userAns = (answers[q.id] || []).join('');
        const correct = submitted && userAns === q.ans.replace(/ /g, '');
        const wrong = submitted && !correct;
        const curBank = arranged[q.id] || [];
        const curAnswers = answers[q.id] || [];
        return (
          <View key={q.id} style={styles.questionCard}>
            {q.cat ? <Text style={styles.catBadge}>🏷️ {q.cat}</Text> : null}
            <Text style={styles.bigEmoji}>{q.emoji}</Text>
            <View style={[styles.letterRow, correct && { backgroundColor: '#D1FAE5' }, wrong && { backgroundColor: '#FEE2E2' }]}>
              {curAnswers.length === 0
                ? <Text style={styles.placeholder}>Nhấn chữ cái để xếp...</Text>
                : curAnswers.map((l, i) => (
                  <TouchableOpacity key={`a${i}`} onPress={() => moveLetter(q.id, l, 'answer')} style={[styles.letterChip, { backgroundColor: correct ? '#059669' : wrong ? '#DC2626' : THEME }]}>
                    <Text style={styles.letterChipText}>{l}</Text>
                  </TouchableOpacity>
                ))}
            </View>
            <View style={styles.letterRow}>
              {curBank.map((l, i) => (
                <TouchableOpacity key={`b${i}`} onPress={() => moveLetter(q.id, l, 'bank')} style={[styles.letterChip, { backgroundColor: '#94A3B8' }]}>
                  <Text style={styles.letterChipText}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {wrong && <Text style={styles.correctHint}>✓ Đáp án: {q.ans}</Text>}
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => {
        setSubmitted(false); setShowResult(false);
        setArranged(Object.fromEntries(list.map(q => [q.id, [...q.shuffled].sort(() => Math.random() - 0.5)])));
        setAnswers(Object.fromEntries(list.map(q => [q.id, []])));
      }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// NGỮ PHÁP
// ─────────────────────────────────────────────────────────────
const NguPhapDang1: React.FC<{ data?: NguPhapDang1Item[] }> = ({ data = [] }) => {
  const list = data;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setShowResult(false);
  }, [data]);

  const handleSubmit = () => {
    if (!list.every(q => answers[q.id])) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = list.every(q => answers[q.id] === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 120000);
  };

  const allCorrect = submitted && list.every(q => answers[q.id] === q.ans);

  if (list.length === 0) {
    return (
      <View style={styles.questionCard}>
        <Text style={styles.placeholder}>Đang tải câu hỏi từ database (bài học 9)...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 1: Chọn từ điền vào câu</Text>
      {list.map(q => {
        const parts = q.sentence.split('___');
        return (
          <View key={q.id} style={styles.questionCard}>
            {q.cat ? <Text style={styles.catBadge}>🏷️ {q.cat}</Text> : null}
            <View style={styles.sentenceRow}>
              <Text style={styles.sentText}>{parts[0]}</Text>
              <View style={[styles.blankBox, submitted && answers[q.id] === q.ans && { borderColor: '#059669', backgroundColor: '#D1FAE5' }, submitted && answers[q.id] !== q.ans && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}>
                <Text style={styles.blankText}>{answers[q.id] || '   '}</Text>
              </View>
              <Text style={styles.sentText}>{parts[1] || ''}</Text>
            </View>
            <View style={styles.wordBankRow}>
              {q.wordBank.map(w => (
                <TouchableOpacity key={w} onPress={() => !submitted && setAnswers(p => ({ ...p, [q.id]: w }))} style={[styles.wordChip, answers[q.id] === w && { backgroundColor: THEME }]}>
                  <Text style={[styles.wordChipText, answers[q.id] === w && { color: 'white' }]}>{w}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const NguPhapDang2: React.FC<{ data?: NguPhapDang2Item[] }> = ({ data = [] }) => {
  const list = data;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setShowResult(false);
  }, [data]);

  const handleSubmit = () => {
    if (!list.every(q => answers[q.id]?.trim())) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = list.every(q => answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase());
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 120000);
  };

  const allCorrect = submitted && list.every(q => answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase());

  if (list.length === 0) {
    return (
      <View style={styles.questionCard}>
        <Text style={styles.placeholder}>Đang tải câu hỏi từ database (bài học 9)...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 2: Viết lại câu</Text>
      {list.map(q => {
        const correct = submitted && answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase();
        const wrong = submitted && !correct;
        const parts = q.rewrite.split('___');
        return (
          <View key={q.id} style={styles.questionCard}>
            {q.cat ? <Text style={styles.catBadge}>🏷️ {q.cat}</Text> : null}
            <Text style={styles.originalSent}>Gốc: {q.original}</Text>
            <View style={styles.sentenceRow}>
              <Text style={styles.sentText}>{parts[0]}</Text>
              <TextInput
                style={[styles.inlineInput, correct && { borderColor: '#059669', color: '#059669' }, wrong && { borderColor: '#DC2626', color: '#DC2626' }]}
                value={answers[q.id] || ''}
                onChangeText={t => !submitted && setAnswers(p => ({ ...p, [q.id]: t }))}
                editable={!submitted}
              />
              <Text style={styles.sentText}>{parts[1] || ''}</Text>
            </View>
            {wrong && <Text style={styles.correctHint}>✓ Đáp án: {q.ans}</Text>}
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const NguPhapDang3: React.FC<{ data?: NguPhapDang3Item[] }> = ({ data = [] }) => {
  const list = data;
  const [arrangements, setArrangements] = useState<Record<number, { bank: string[], answer: string[] }>>(
    Object.fromEntries(list.map(q => [q.id, { bank: [...q.words].sort(() => Math.random() - 0.5), answer: [] }]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setArrangements(Object.fromEntries(list.map(q => [q.id, { bank: [...q.words].sort(() => Math.random() - 0.5), answer: [] }])));
    setSubmitted(false);
    setShowResult(false);
  }, [data]);

  const moveWord = (qid: number, word: string, from: 'bank' | 'answer') => {
    if (submitted) return;
    setArrangements(prev => {
      const cur = prev[qid] || { bank: [], answer: [] };
      if (from === 'bank') {
        const idx = cur.bank.indexOf(word); if (idx === -1) return prev;
        const bank = [...cur.bank]; bank.splice(idx, 1);
        return { ...prev, [qid]: { bank, answer: [...cur.answer, word] } };
      } else {
        const idx = cur.answer.indexOf(word); if (idx === -1) return prev;
        const answer = [...cur.answer]; answer.splice(idx, 1);
        return { ...prev, [qid]: { bank: [...cur.bank, word], answer } };
      }
    });
  };

  const handleSubmit = () => {
    if (!list.every(q => (arrangements[q.id]?.answer || []).length > 0)) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = list.every(q => (arrangements[q.id]?.answer || []).join(' ') === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => {
      setSubmitted(false); setShowResult(false);
      setArrangements(Object.fromEntries(list.map(q => [q.id, { bank: [...q.words].sort(() => Math.random() - 0.5), answer: [] }])));
    }, 120000);
  };

  const allCorrect = submitted && list.every(q => (arrangements[q.id]?.answer || []).join(' ') === q.ans);

  if (list.length === 0) {
    return (
      <View style={styles.questionCard}>
        <Text style={styles.placeholder}>Đang tải câu hỏi từ database (bài học 9)...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 3: Sắp xếp từ thành câu</Text>
      {list.map(q => {
        const curAns = arrangements[q.id]?.answer || [];
        const curBank = arrangements[q.id]?.bank || [];
        const correct = submitted && curAns.join(' ') === q.ans;
        const wrong = submitted && !correct;
        return (
          <View key={q.id} style={styles.questionCard}>
            {q.cat ? <Text style={styles.catBadge}>🏷️ {q.cat}</Text> : null}
            <Text style={styles.questionText}>Câu {q.id}: Sắp xếp thành câu đúng</Text>
            <View style={[styles.wordRow, correct && { backgroundColor: '#D1FAE5' }, wrong && { backgroundColor: '#FEE2E2' }]}>
              {curAns.length === 0
                ? <Text style={styles.placeholder}>Nhấn từ bên dưới...</Text>
                : curAns.map((w, i) => (
                  <TouchableOpacity key={`a${i}`} onPress={() => moveWord(q.id, w, 'answer')} style={[styles.wordChip, { backgroundColor: correct ? '#059669' : wrong ? '#DC2626' : THEME }]}>
                    <Text style={[styles.wordChipText, { color: 'white' }]}>{w}</Text>
                  </TouchableOpacity>
                ))}
            </View>
            <View style={styles.wordRow}>
              {curBank.map((w, i) => (
                <TouchableOpacity key={`b${i}`} onPress={() => moveWord(q.id, w, 'bank')} style={[styles.wordChip, { backgroundColor: '#94A3B8' }]}>
                  <Text style={[styles.wordChipText, { color: 'white' }]}>{w}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {wrong && <Text style={styles.correctHint}>✓ Đáp án: {q.ans}</Text>}
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => {
        setSubmitted(false); setShowResult(false);
        setArrangements(Object.fromEntries(list.map(q => [q.id, { bank: [...q.words].sort(() => Math.random() - 0.5), answer: [] }])));
      }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const NguPhapDang4: React.FC<{ data?: NguPhapDang4Item[] }> = ({ data = [] }) => {
  const list = data;
  const [arrangements, setArrangements] = useState<Record<number, { bank: string[], answer: string[] }>>(
    Object.fromEntries(list.map(q => [q.id, { bank: [...q.words].sort(() => Math.random() - 0.5), answer: [] }]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setArrangements(Object.fromEntries(list.map(q => [q.id, { bank: [...q.words].sort(() => Math.random() - 0.5), answer: [] }])));
    setSubmitted(false);
    setShowResult(false);
  }, [data]);

  const moveWord = (qid: number, word: string, from: 'bank' | 'answer') => {
    if (submitted) return;
    setArrangements(prev => {
      const cur = prev[qid] || { bank: [], answer: [] };
      if (from === 'bank') {
        const idx = cur.bank.indexOf(word); if (idx === -1) return prev;
        const bank = [...cur.bank]; bank.splice(idx, 1);
        return { ...prev, [qid]: { bank, answer: [...cur.answer, word] } };
      } else {
        const idx = cur.answer.indexOf(word); if (idx === -1) return prev;
        const answer = [...cur.answer]; answer.splice(idx, 1);
        return { ...prev, [qid]: { bank: [...cur.bank, word], answer } };
      }
    });
  };

  const handleSubmit = () => {
    if (!list.every(q => (arrangements[q.id]?.answer || []).length > 0)) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = list.every(q => (arrangements[q.id]?.answer || []).join(' ') === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => {
      setSubmitted(false); setShowResult(false);
      setArrangements(Object.fromEntries(list.map(q => [q.id, { bank: [...q.words].sort(() => Math.random() - 0.5), answer: [] }])));
    }, 120000);
  };

  const allCorrect = submitted && list.every(q => (arrangements[q.id]?.answer || []).join(' ') === q.ans);

  if (list.length === 0) {
    return (
      <View style={styles.questionCard}>
        <Text style={styles.placeholder}>Đang tải câu hỏi từ database (bài học 9)...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 4: Nhìn hình – Sắp xếp câu</Text>
      {list.map(q => {
        const curAns = arrangements[q.id]?.answer || [];
        const curBank = arrangements[q.id]?.bank || [];
        const correct = submitted && curAns.join(' ') === q.ans;
        const wrong = submitted && !correct;
        return (
          <View key={q.id} style={styles.questionCard}>
            {q.cat ? <Text style={styles.catBadge}>🏷️ {q.cat}</Text> : null}
            <Text style={styles.bigEmoji}>{q.emoji}</Text>
            <View style={[styles.wordRow, correct && { backgroundColor: '#D1FAE5' }, wrong && { backgroundColor: '#FEE2E2' }]}>
              {curAns.length === 0
                ? <Text style={styles.placeholder}>Nhấn từ bên dưới...</Text>
                : curAns.map((w, i) => (
                  <TouchableOpacity key={`a${i}`} onPress={() => moveWord(q.id, w, 'answer')} style={[styles.wordChip, { backgroundColor: correct ? '#059669' : wrong ? '#DC2626' : THEME }]}>
                    <Text style={[styles.wordChipText, { color: 'white' }]}>{w}</Text>
                  </TouchableOpacity>
                ))}
            </View>
            <View style={styles.wordRow}>
              {curBank.map((w, i) => (
                <TouchableOpacity key={`b${i}`} onPress={() => moveWord(q.id, w, 'bank')} style={[styles.wordChip, { backgroundColor: '#94A3B8' }]}>
                  <Text style={[styles.wordChipText, { color: 'white' }]}>{w}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {wrong && <Text style={styles.correctHint}>✓ Đáp án: {q.ans}</Text>}
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => {
        setSubmitted(false); setShowResult(false);
        setArrangements(Object.fromEntries(list.map(q => [q.id, { bank: [...q.words].sort(() => Math.random() - 0.5), answer: [] }])));
      }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// HỘI THOẠI
// ─────────────────────────────────────────────────────────────
const HoiThoaiDang1: React.FC<{ data?: HoiThoaiDang1Item[] }> = ({ data = [] }) => {
  const list = data;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setShowResult(false);
  }, [data]);

  const handleSubmit = () => {
    if (!list.every(q => answers[q.id])) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = list.every(q => answers[q.id] === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 120000);
  };

  const allCorrect = submitted && list.every(q => answers[q.id] === q.ans);

  if (list.length === 0) {
    return (
      <View style={styles.questionCard}>
        <Text style={styles.placeholder}>Đang tải câu hỏi từ database (bài học 9)...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 1: Hội thoại trắc nghiệm</Text>
      {list.map(q => (
        <View key={q.id} style={styles.questionCard}>
          {q.cat ? <Text style={styles.catBadge}>🏷️ {q.cat}</Text> : null}
          <Text style={styles.questionText}>💬 {q.q}</Text>
          {q.opts.map(opt => {
            const letter = opt[0];
            const chosen = answers[q.id] === letter;
            const correct = submitted && letter === q.ans;
            const wrong = submitted && chosen && letter !== q.ans;
            return (
              <TouchableOpacity key={opt} onPress={() => !submitted && setAnswers(p => ({ ...p, [q.id]: letter }))}
                style={[styles.optBtn, chosen && !submitted && { borderColor: THEME, backgroundColor: '#D1FAE5' }, correct && { borderColor: '#059669', backgroundColor: '#D1FAE5' }, wrong && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.optText, wrong && { color: '#DC2626', fontWeight: '700' }]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const HoiThoaiDang2: React.FC<{ data?: HoiThoaiDang2Item[] }> = ({ data = [] }) => {
  const list = data;
  const [orders, setOrders] = useState<Record<number, string[]>>(
    Object.fromEntries(list.map(d => [d.id, [...d.lines.map(l => l.key)].sort(() => Math.random() - 0.5)]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setOrders(Object.fromEntries(list.map(d => [d.id, [...d.lines.map(l => l.key)].sort(() => Math.random() - 0.5)])));
    setSubmitted(false);
    setShowResult(false);
  }, [data]);

  const moveUp = (did: number, idx: number) => {
    if (submitted || idx === 0) return;
    setOrders(prev => {
      const arr = [...(prev[did] || [])];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return { ...prev, [did]: arr };
    });
  };

  const moveDown = (did: number, idx: number) => {
    if (submitted) return;
    setOrders(prev => {
      const arr = [...(prev[did] || [])];
      if (idx >= arr.length - 1) return prev;
      [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
      return { ...prev, [did]: arr };
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const ok = list.every(d => (orders[d.id] || []).join('') === d.ans.join(''));
    setShowResult(true);
    if (!ok) setTimeout(() => {
      setSubmitted(false); setShowResult(false);
      setOrders(Object.fromEntries(list.map(d => [d.id, [...d.lines.map(l => l.key)].sort(() => Math.random() - 0.5)])));
    }, 120000);
  };

  const allCorrect = submitted && list.every(d => (orders[d.id] || []).join('') === d.ans.join(''));

  if (list.length === 0) {
    return (
      <View style={styles.questionCard}>
        <Text style={styles.placeholder}>Đang tải câu hỏi từ database (bài học 9)...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 2: Sắp xếp hội thoại (↑↓ để xếp)</Text>
      {list.map(d => {
        const currentOrder = orders[d.id] || d.lines.map(l => l.key);
        const correct = submitted && currentOrder.join('') === d.ans.join('');
        const wrong = submitted && !correct;
        return (
          <View key={d.id} style={styles.questionCard}>
            {d.cat ? <Text style={styles.catBadge}>🏷️ {d.cat}</Text> : null}
            <Text style={styles.questionText}>🗣️ {d.title}</Text>
            {currentOrder.map((key, idx) => {
              const line = d.lines.find(l => l.key === key);
              if (!line) return null;
              return (
                <View key={key} style={[styles.dialogueLine, correct && { backgroundColor: '#D1FAE5' }, wrong && { backgroundColor: '#FEE2E2' }]}>
                  <View style={styles.arrowBtns}>
                    <TouchableOpacity onPress={() => moveUp(d.id, idx)}><Text style={[styles.arrow, { color: THEME }]}>▲</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => moveDown(d.id, idx)}><Text style={[styles.arrow, { color: THEME }]}>▼</Text></TouchableOpacity>
                  </View>
                  <Text style={styles.dialogueText}>{line.text}</Text>
                </View>
              );
            })}
            {wrong && <Text style={styles.correctHint}>✓ Thứ tự đúng: {d.ans.join(' → ')}</Text>}
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => {
        setSubmitted(false); setShowResult(false);
        setOrders(Object.fromEntries(list.map(d => [d.id, [...d.lines.map(l => l.key)].sort(() => Math.random() - 0.5)])));
      }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const HoiThoaiDang3: React.FC<{ data?: HoiThoaiDang3Item[] }> = ({ data = [] }) => {
  const list = data;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setShowResult(false);
  }, [data]);

  const handleSubmit = () => {
    if (!list.every(q => answers[q.id])) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = list.every(q => answers[q.id] === q.blank);
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 120000);
  };

  const allCorrect = submitted && list.every(q => answers[q.id] === q.blank);

  if (list.length === 0) {
    return (
      <View style={styles.questionCard}>
        <Text style={styles.placeholder}>Đang tải câu hỏi từ database (bài học 9)...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 3: Điền từ vào hội thoại</Text>
      {list.map(q => {
        const parts = q.dialogue.split(q.blank);
        const correct = submitted && answers[q.id] === q.blank;
        const wrong = submitted && answers[q.id] !== q.blank;
        return (
          <View key={q.id} style={styles.questionCard}>
            {q.cat ? <Text style={styles.catBadge}>🏷️ {q.cat}</Text> : null}
            <Text style={styles.questionText}>💬 {parts[0]}[___]{parts[1] || ''}</Text>
            <View style={styles.wordBankRow}>
              {q.wordBank.map(w => (
                <TouchableOpacity key={w} onPress={() => !submitted && setAnswers(p => ({ ...p, [q.id]: w }))}
                  style={[styles.wordChip, answers[q.id] === w && { backgroundColor: THEME }, correct && answers[q.id] === w && { backgroundColor: '#059669' }, wrong && answers[q.id] === w && { backgroundColor: '#DC2626' }]}>
                  <Text style={[styles.wordChipText, answers[q.id] === w && { color: 'white' }]}>{w}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {wrong && <Text style={styles.correctHint}>✓ Đáp án: {q.blank}</Text>}
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// NGHE
// ─────────────────────────────────────────────────────────────
const NgheDang1: React.FC<{ data?: NgheDang1Item[] }> = ({ data = [] }) => {
  const list = data;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setShowResult(false);
  }, [data]);

  const handleSubmit = () => {
    if (!list.every(q => answers[q.id])) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = list.every(q => answers[q.id] === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 120000);
  };

  const allCorrect = submitted && list.every(q => answers[q.id] === q.ans);

  if (list.length === 0) {
    return (
      <View style={styles.questionCard}>
        <Text style={styles.placeholder}>Đang tải câu hỏi từ database (bài học 9)...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 1: Nghe – Trắc nghiệm</Text>
      {list.map(q => (
        <View key={q.id} style={styles.questionCard}>
          {q.cat ? <Text style={styles.catBadge}>🏷️ {q.cat}</Text> : null}
          <View style={styles.audioPill}><Text style={styles.audioText}>{q.audio}</Text></View>
          {q.opts.map(opt => {
            const letter = opt[0];
            const chosen = answers[q.id] === letter;
            const correct = submitted && letter === q.ans;
            const wrong = submitted && chosen && letter !== q.ans;
            return (
              <TouchableOpacity key={opt} onPress={() => !submitted && setAnswers(p => ({ ...p, [q.id]: letter }))}
                style={[styles.optBtn, chosen && !submitted && { borderColor: THEME, backgroundColor: '#D1FAE5' }, correct && { borderColor: '#059669', backgroundColor: '#D1FAE5' }, wrong && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.optText, wrong && { color: '#DC2626', fontWeight: '700' }]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const NgheDang2: React.FC<{ data?: NgheDang2Item[] }> = ({ data = [] }) => {
  const list = data;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setShowResult(false);
  }, [data]);

  const handleSubmit = () => {
    if (!list.every(q => answers[q.id]?.trim())) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = list.every(q => answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase());
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 120000);
  };

  const allCorrect = submitted && list.every(q => answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase());

  if (list.length === 0) {
    return (
      <View style={styles.questionCard}>
        <Text style={styles.placeholder}>Đang tải câu hỏi từ database (bài học 9)...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 2: Nghe – Tự điền từ</Text>
      {list.map(q => {
        const correct = submitted && answers[q.id]?.trim().toLowerCase() === q.ans.toLowerCase();
        const wrong = submitted && !correct;
        const parts = q.audio.split('___');
        return (
          <View key={q.id} style={styles.questionCard}>
            {q.cat ? <Text style={styles.catBadge}>🏷️ {q.cat}</Text> : null}
            <View style={[styles.audioPill, { flexWrap: 'wrap' }]}>
              <Text style={styles.audioText}>{parts[0]}</Text>
              <TextInput
                style={[styles.inlineInput, correct && { borderColor: '#059669', color: '#059669' }, wrong && { borderColor: '#DC2626', color: '#DC2626' }]}
                value={answers[q.id] || ''}
                onChangeText={t => !submitted && setAnswers(p => ({ ...p, [q.id]: t }))}
                editable={!submitted}
                placeholder="..."
              />
              <Text style={styles.audioText}>{parts[1] || ''}</Text>
            </View>
            {wrong && <Text style={styles.correctHint}>✓ Đáp án: {q.ans}</Text>}
          </View>
        );
      })}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const NgheDang3: React.FC<{ data?: NgheDang3Item[] }> = ({ data = [] }) => {
  const list = data;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setShowResult(false);
  }, [data]);

  const handleSubmit = () => {
    if (!list.every(q => answers[q.id])) { Alert.alert('Chưa xong!'); return; }
    setSubmitted(true);
    const ok = list.every(q => answers[q.id] === q.ans);
    setShowResult(true);
    if (!ok) setTimeout(() => { setSubmitted(false); setShowResult(false); setAnswers({}); }, 120000);
  };

  const allCorrect = submitted && list.every(q => answers[q.id] === q.ans);

  if (list.length === 0) {
    return (
      <View style={styles.questionCard}>
        <Text style={styles.placeholder}>Đang tải câu hỏi từ database (bài học 9)...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.sectionSubTitle}>📌 Dạng 3: Nghe – Chọn hình ảnh</Text>
      {list.map(q => (
        <View key={q.id} style={styles.questionCard}>
          {q.cat ? <Text style={styles.catBadge}>🏷️ {q.cat}</Text> : null}
          <View style={styles.audioPill}><Text style={styles.audioText}>{q.audio}</Text></View>
          <View style={styles.emojiGrid}>
            {q.emojis.map(em => {
              const chosen = answers[q.id] === em;
              const correct = submitted && em === q.ans;
              const wrong = submitted && chosen && em !== q.ans;
              return (
                <TouchableOpacity key={em} onPress={() => !submitted && setAnswers(p => ({ ...p, [q.id]: em }))}
                  style={[styles.emojiCard, chosen && !submitted && { borderColor: THEME }, correct && { borderColor: '#059669', backgroundColor: '#D1FAE5' }, wrong && { borderColor: '#DC2626', backgroundColor: '#FEE2E2' }]}>
                  <Text style={styles.emojiCardText}>{em}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
      {showResult && <ResultBanner correct={allCorrect} onRetry={() => { setSubmitted(false); setShowResult(false); setAnswers({}); }} />}
      {!showResult && (
        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: THEME }]} onPress={handleSubmit}>
          <Text style={styles.submitText}>Kiểm tra • Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────
const SECTIONS: { key: SectionKey; label: string; emoji: string }[] = [
  { key: 'tracNghiem', label: 'Trắc nghiệm', emoji: '📝' },
  { key: 'dienTu', label: 'Điền từ', emoji: '✏️' },
  { key: 'nguPhap', label: 'Ngữ pháp', emoji: '📐' },
  { key: 'hoiThoai', label: 'Hội thoại', emoji: '💬' },
  { key: 'nghe', label: 'Nghe', emoji: '🎧' },
];

const Phan3Bai5: React.FC<Props> = ({ navigation }) => {
  const [activeSection, setActiveSection] = useState<SectionKey>('tracNghiem');
  const [dienTuTab, setDienTuTab] = useState(1);
  const [nguPhapTab, setNguPhapTab] = useState(1);
  const [hoiThoaiTab, setHoiThoaiTab] = useState(1);
  const [ngheTab, setNgheTab] = useState(1);
  const [dbData, setDbData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_ENDPOINTS.GET_CAU_HOI_NN}?bai_hoc_id=9`);
        const json = await res.json();
        const rows = Array.isArray(json) ? json : (json?.data || []);
        if (rows && rows.length > 0) {
          const parsed = parseCauHoiNN(rows);
          setDbData(parsed);
        }
      } catch (e) {
        console.log('Error loading cau_hoi_nn for bai 5:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'tracNghiem': return <TracNghiemSection data={dbData?.tracNghiem} />;
      case 'dienTu':
        return (
          <View>
            <View style={styles.subTabRow}>
              {[1, 2, 3].map(n => (
                <TouchableOpacity key={n} onPress={() => setDienTuTab(n)} style={[styles.subTab, dienTuTab === n && { backgroundColor: THEME }]}>
                  <Text style={[styles.subTabText, dienTuTab === n && { color: 'white' }]}>Dạng {n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {dienTuTab === 1 && <DienTuDang1 data={dbData?.dienTuDang1} />}
            {dienTuTab === 2 && <DienTuDang2 data={dbData?.dienTuDang2} />}
            {dienTuTab === 3 && <DienTuDang3 data={dbData?.dienTuDang3} />}
          </View>
        );
      case 'nguPhap':
        return (
          <View>
            <View style={styles.subTabRow}>
              {[1, 2, 3, 4].map(n => (
                <TouchableOpacity key={n} onPress={() => setNguPhapTab(n)} style={[styles.subTab, nguPhapTab === n && { backgroundColor: THEME }]}>
                  <Text style={[styles.subTabText, nguPhapTab === n && { color: 'white' }]}>Dạng {n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {nguPhapTab === 1 && <NguPhapDang1 data={dbData?.nguPhapDang1} />}
            {nguPhapTab === 2 && <NguPhapDang2 data={dbData?.nguPhapDang2} />}
            {nguPhapTab === 3 && <NguPhapDang3 data={dbData?.nguPhapDang3} />}
            {nguPhapTab === 4 && <NguPhapDang4 data={dbData?.nguPhapDang4} />}
          </View>
        );
      case 'hoiThoai':
        return (
          <View>
            <View style={styles.subTabRow}>
              {[1, 2, 3].map(n => (
                <TouchableOpacity key={n} onPress={() => setHoiThoaiTab(n)} style={[styles.subTab, hoiThoaiTab === n && { backgroundColor: THEME }]}>
                  <Text style={[styles.subTabText, hoiThoaiTab === n && { color: 'white' }]}>Dạng {n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {hoiThoaiTab === 1 && <HoiThoaiDang1 data={dbData?.hoiThoaiDang1} />}
            {hoiThoaiTab === 2 && <HoiThoaiDang2 data={dbData?.hoiThoaiDang2} />}
            {hoiThoaiTab === 3 && <HoiThoaiDang3 data={dbData?.hoiThoaiDang3} />}
          </View>
        );
      case 'nghe':
        return (
          <View>
            <View style={styles.subTabRow}>
              {[1, 2, 3].map(n => (
                <TouchableOpacity key={n} onPress={() => setNgheTab(n)} style={[styles.subTab, ngheTab === n && { backgroundColor: THEME }]}>
                  <Text style={[styles.subTabText, ngheTab === n && { color: 'white' }]}>Dạng {n}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {ngheTab === 1 && <NgheDang1 data={dbData?.ngheDang1} />}
            {ngheTab === 2 && <NgheDang2 data={dbData?.ngheDang2} />}
            {ngheTab === 3 && <NgheDang3 data={dbData?.ngheDang3} />}
          </View>
        );
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, { backgroundColor: THEME }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>◀</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerBai}>BÀI 5</Text>
          <Text style={styles.headerTitle}>Bài tập tổng hợp Phần 3</Text>
          <Text style={styles.headerSub}>Comprehensive Practice Part 3</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll} contentContainerStyle={styles.tabContainer}>
        {SECTIONS.map(s => (
          <TouchableOpacity key={s.key} onPress={() => setActiveSection(s.key)} style={[styles.tab, activeSection === s.key && { backgroundColor: THEME, borderColor: THEME }]}>
            <Text style={[styles.tabText, activeSection === s.key && { color: 'white' }]}>{s.emoji} {s.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <ActivityIndicator size="large" color={THEME} />
            <Text style={{ marginTop: 12, color: '#64748B', fontSize: 13, fontWeight: '600' }}>
              Đang tải dữ liệu từ CSDL (bài_hoc_id = 9)...
            </Text>
          </View>
        ) : (
          renderContent()
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, marginTop: 30 },
  backBtn: { padding: 8, width: 40 },
  backIcon: { fontSize: 20, color: 'white' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerBai: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: '700', letterSpacing: 1 },
  headerTitle: { fontSize: 15, fontWeight: '800', color: 'white', textAlign: 'center', marginTop: 2 },
  headerSub: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  tabScroll: { maxHeight: 54, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tabContainer: { paddingHorizontal: 10, paddingVertical: 8, gap: 8 },
  tab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#CBD5E1', backgroundColor: 'white' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#475569' },

  subTabRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  subTab: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: '#E2E8F0', alignItems: 'center' },
  subTabText: { fontSize: 13, fontWeight: '700', color: '#475569' },

  content: { flex: 1 },
  contentInner: { padding: 16 },

  sectionSubTitle: { fontSize: 14, fontWeight: '800', color: THEME, marginBottom: 14, letterSpacing: 0.3 },

  questionCard: {
    backgroundColor: 'white', borderRadius: 16, padding: 16, marginBottom: 14,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6,
  },
  catBadge: { fontSize: 11, color: THEME, fontWeight: '700', marginBottom: 6, letterSpacing: 0.5 },
  questionText: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 12, lineHeight: 20 },
  optBtn: { borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 10, padding: 12, marginBottom: 8 },
  optText: { fontSize: 13, color: '#334155' },

  sentenceRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 },
  sentText: { fontSize: 14, color: '#334155', lineHeight: 22 },
  blankBox: { borderBottomWidth: 2, borderColor: THEME, minWidth: 70, alignItems: 'center', marginHorizontal: 4, paddingHorizontal: 8, paddingVertical: 4 },
  blankText: { fontSize: 14, color: '#1E293B', fontWeight: '600' },

  wordBankRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  wordRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, minHeight: 44, backgroundColor: '#F1F5F9', borderRadius: 10, padding: 10, marginBottom: 10 },
  wordChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, backgroundColor: '#E2E8F0', borderWidth: 1, borderColor: '#CBD5E1' },
  wordChipText: { fontSize: 13, fontWeight: '600', color: '#334155' },

  bigEmoji: { fontSize: 48, textAlign: 'center', marginBottom: 8 },
  hintText: { fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 12, fontStyle: 'italic' },
  typeInput: { borderWidth: 1.5, borderColor: '#CBD5E1', borderRadius: 10, padding: 12, fontSize: 14, color: '#1E293B', backgroundColor: '#F8FAFC' },
  inlineInput: { borderBottomWidth: 2, borderColor: THEME, minWidth: 70, paddingHorizontal: 6, fontSize: 14, color: '#1E293B', marginHorizontal: 4 },
  correctHint: { fontSize: 12, color: '#059669', fontWeight: '600', marginTop: 6 },
  originalSent: { fontSize: 12, color: '#64748B', fontStyle: 'italic', marginBottom: 10, backgroundColor: '#F1F5F9', padding: 8, borderRadius: 8 },

  letterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, minHeight: 44, backgroundColor: '#F1F5F9', borderRadius: 10, padding: 10, marginBottom: 10 },
  letterChip: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  letterChipText: { fontSize: 14, fontWeight: '700', color: 'white' },
  placeholder: { fontSize: 12, color: '#94A3B8', alignSelf: 'center' },

  dialogueLine: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 10, padding: 10, marginBottom: 8 },
  arrowBtns: { marginRight: 10 },
  arrow: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  dialogueText: { flex: 1, fontSize: 13, color: '#334155', lineHeight: 18 },

  audioPill: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', backgroundColor: '#D1FAE5', borderRadius: 12, padding: 12, marginBottom: 12 },
  audioText: { fontSize: 13, color: '#065F46', fontWeight: '600', lineHeight: 20 },

  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  emojiCard: { width: 70, height: 70, borderRadius: 14, borderWidth: 2.5, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' },
  emojiCardText: { fontSize: 28 },

  submitBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8, elevation: 3 },
  submitText: { fontSize: 15, fontWeight: '800', color: 'white', letterSpacing: 0.5 },

  banner: { borderRadius: 14, padding: 16, alignItems: 'center', marginBottom: 12, marginTop: 4 },
  bannerTitle: { fontSize: 15, fontWeight: '800', textAlign: 'center' },
  retryBtn: { marginTop: 10, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  retryText: { fontSize: 13, fontWeight: '700', color: 'white' },
});

export default Phan3Bai5;
