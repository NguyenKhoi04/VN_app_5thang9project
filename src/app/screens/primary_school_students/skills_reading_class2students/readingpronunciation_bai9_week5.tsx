import { createAudioPlayer } from "expo-audio";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Footer from "../Footer";
import Header, { ClassInfo } from "../Header";

const { width } = Dimensions.get("window");

export default function ReadingPronunciation_bai9_week5Screen() {
  const params = useLocalSearchParams<{
    ho_ten?: string;
    ten_ky_nang?: string;
  }>();
  const [name, setName] = useState(params.ho_ten || "");
  const [tenBaiHoc] = useState("Cô giáo lớp em");
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [showAnswer3, setShowAnswer3] = useState(false);
  const [mode, setMode] = useState<1 | 2 | 3>(1); // 1: Mẫu, 2: Từng khổ, 3: Tìm hiểu bài học

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  useEffect(() => {
    if (params.ho_ten) setName(params.ho_ten);
  }, [params.ho_ten]);

  const AUDIO_MAP: Record<string, any> = {
    doc_mau: require("../../../../../text-to-speech/speech_docmau_bai9_week5.wav"),
    // doan1: require("../../../../../text-to-speech/speech_doan1_bai9_week3.wav"),
    // doan2: require("../../../../../text-to-speech/speech_doan2_bai9_week3.wav"),
    // doan3: require("../../../../../text-to-speech/speech_doan3_bai9_week3.wav"),
    // cau_hoi_1: require("../../../../../text-to-speech/speech_cauhoi1_bai9_week3.wav"),
    // dap_an_1: require("../../../../../text-to-speech/speech_dapan1_bai9_week3.wav"),
    // cau_hoi_2: require("../../../../../text-to-speech/speech_cauhoi2_bai9_week3.wav"),
    // dap_an_2: require("../../../../../text-to-speech/speech_dapan2_bai9_week3.wav"),
    // cau_hoi_3: require("../../../../../text-to-speech/speech_cauhoi3_bai9_week3.wav"),
    // dap_an_3: require("../../../../../text-to-speech/speech_dapan3_bai9_week3.wav"),
  };

  const playSound = (key: string) => {
    const source = AUDIO_MAP[key];
    if (!source) return;
    try {
      const player = createAudioPlayer(source);
      player.play();
    } catch (e) {
      console.error(e);
    }
  };

  // ===== MODE 1: Đọc theo mẫu =====
  const renderMode1 = () => (
    <View style={styles.storyBox}>
      <View style={styles.tabHeader}>
        <Pressable onPress={() => playSound("doc_mau")}>
          <Text style={styles.speaker}>🔊</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Cô giáo lớp em</Text>

      <Text style={styles.poemStanza}>
        Sáng nào em đến lớp{"\n"}
        Cũng thấy cô đến rồi{"\n"}
        Đáp lời “Chào cô ạ!”{"\n"}
        Cô mỉm cười thật tươi.
      </Text>

      <Text style={styles.poemStanza}>
        Cô dạy em tập viết{"\n"}
        Gió đưa thoảng hương nhài{"\n"}
        Nắng ghé vào cửa lớp{"\n"}
        Xem chúng em học bài.
      </Text>

      <Text style={styles.poemStanza}>
        Những lời cô giáo giảng{"\n"}
        Ấm trang vở thơm tho{"\n"}
        Yêu thương em ngắm mãi{"\n"}
        Những điểm mười cô cho.
      </Text>

      <Text style={styles.author}>(Nguyễn Xuân Sanh)</Text>
    </View>
  );

  // ===== MODE 2: Đọc từng khổ =====
  const renderMode2 = () => (
    <View style={styles.storyBox}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Đọc từng khổ thơ</Text>
      </View>

      <Text style={styles.title}>Cô giáo lớp em</Text>

      {/* Khổ 1 */}
      <Pressable
        style={({ pressed }) => [
          styles.sentenceLine,
          pressed && styles.pressed,
        ]}
        onPress={() => playSound("doan1")}
      >
        <Text style={styles.speaker_2}>🔊</Text>
        <Text style={styles.poemStanzaLine}>
          Sáng nào em đến lớp{"\n"}
          Cũng thấy cô đến rồi{"\n"}
          Đáp lời “Chào cô ạ!”{"\n"}
          Cô mỉm cười thật tươi.
        </Text>
      </Pressable>

      {/* Khổ 2 */}
      <Pressable
        style={({ pressed }) => [
          styles.sentenceLine,
          pressed && styles.pressed,
        ]}
        onPress={() => playSound("doan2")}
      >
        <Text style={styles.speaker_2}>🔊</Text>
        <Text style={styles.poemStanzaLine}>
          Cô dạy em tập viết{"\n"}
          Gió đưa thoảng hương nhài{"\n"}
          Nắng ghé vào cửa lớp{"\n"}
          Xem chúng em học bài.
        </Text>
      </Pressable>

      {/* Khổ 3 */}
      <Pressable
        style={({ pressed }) => [
          styles.sentenceLine,
          pressed && styles.pressed,
        ]}
        onPress={() => playSound("doan3")}
      >
        <Text style={styles.speaker_2}>🔊</Text>
        <Text style={styles.poemStanzaLine}>
          Những lời cô giáo giảng{"\n"}
          Ấm trang vở thơm tho{"\n"}
          Yêu thương em ngắm mãi{"\n"}
          Những điểm mười cô cho.
        </Text>
      </Pressable>

      <Text style={styles.author}>(Nguyễn Xuân Sanh)</Text>
    </View>
  );

  // ===== MODE 3: Tìm hiểu bài học =====
  const renderMode3 = () => (
    <View>
      <View style={styles.storyBox}>
        <View style={styles.tabHeader}>
          <Text style={styles.tabTitle}>Tìm hiểu bài học rút ra đại ý</Text>
        </View>

        <Text style={styles.title}>Cô giáo lớp em</Text>

        <Text style={styles.poemStanza}>
          Sáng nào em đến lớp{"\n"}
          Cũng thấy cô đến rồi{"\n"}
          Đáp lời “Chào cô ạ!”{"\n"}
          Cô mỉm cười thật tươi.
        </Text>

        <Text style={styles.poemStanza}>
          Cô dạy em tập viết{"\n"}
          Gió đưa thoảng hương nhài{"\n"}
          Nắng ghé vào cửa lớp{"\n"}
          Xem chúng em học bài.
        </Text>
        <Text style={styles.poemStanza}>
          Những lời cô giáo giảng{"\n"}
          Ấm trang vở thơm tho{"\n"}
          Yêu thương em ngắm mãi{"\n"}
          Những điểm mười cô cho.
        </Text>

        <Text style={styles.author}>(Nguyễn Xuân Sanh)</Text>
      </View>

      {/* Câu hỏi */}
      <View style={styles.questionSection}>
        {/* Câu 1 */}
        <View style={styles.questionBlock}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionLabel}>Câu 1</Text>
            <Pressable onPress={() => playSound("cau_hoi_1")}>
              <Text style={styles.speaker}>🔊</Text>
            </Pressable>
          </View>

          <View style={styles.questionBox}>
            <Text style={styles.questionText}>
              Khi bạn nhỏ cất lời chào, cô giáo đã đáp lại như thế nào?
            </Text>
          </View>

          <View style={styles.answerToggleRow}>
            <Pressable
              style={styles.answerButton}
              onPress={() => setShowAnswer1(!showAnswer1)}
            >
              <Text style={styles.answerButtonText}>Trả lời</Text>
              <Text style={styles.speaker}>🔊</Text>
              <Text style={styles.arrow}>{showAnswer1 ? "▲" : "▼"}</Text>
            </Pressable>
          </View>

          {showAnswer1 && (
            <View style={styles.answerBox}>
              <Text style={styles.answerContent}>
                Đáp lời chào của học sinh, cô giáo mỉm cười thật tươi.
              </Text>
              <Pressable onPress={() => playSound("dap_an_1")}>
                <Text style={styles.speaker}>🔊</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Câu 2 */}
        <View style={styles.questionBlock}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionLabel}>Câu 2</Text>
            <Pressable onPress={() => playSound("cau_hoi_2")}>
              <Text style={styles.speaker}>🔊</Text>
            </Pressable>
          </View>

          <View style={styles.questionBox}>
            <Text style={styles.questionText}>
              Những hình ảnh nào cho thấy cảnh lớp học rất tươi vui và ấm áp?
            </Text>
          </View>

          <View style={styles.answerToggleRow}>
            <Pressable
              style={styles.answerButton}
              onPress={() => setShowAnswer2(!showAnswer2)}
            >
              <Text style={styles.answerButtonText}>Trả lời</Text>
              <Text style={styles.speaker}>🔊</Text>
              <Text style={styles.arrow}>{showAnswer2 ? "▲" : "▼"}</Text>
            </Pressable>
          </View>

          {showAnswer2 && (
            <View style={styles.answerBox}>
              <Text style={styles.answerContent}>
                Đó là hình ảnh gió thoảng hương nhài, ánh nắng ghé vào cửa lớp
                xem các bạn học bài và lời giảng của cô sưởi ấm trang vở thơm
                tho.
              </Text>
              <Pressable onPress={() => playSound("dap_an_2")}>
                <Text style={styles.speaker}>🔊</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Câu 3 */}
        <View style={styles.questionBlock}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionLabel}>Câu 3</Text>
            <Pressable onPress={() => playSound("cau_hoi_3")}>
              <Text style={styles.speaker}>🔊</Text>
            </Pressable>
          </View>

          <View style={styles.questionBox}>
            <Text style={styles.questionText}>
              Tình cảm yêu thương của bạn nhỏ đối với cô giáo được thể hiện qua
              hành động nào?
            </Text>
          </View>

          <View style={styles.answerToggleRow}>
            <Pressable
              style={styles.answerButton}
              onPress={() => setShowAnswer3(!showAnswer3)}
            >
              <Text style={styles.answerButtonText}>Trả lời</Text>
              <Text style={styles.speaker}>🔊</Text>
              <Text style={styles.arrow}>{showAnswer3 ? "▲" : "▼"}</Text>
            </Pressable>
          </View>

          {showAnswer3 && (
            <View style={styles.answerBox}>
              <Text style={styles.answerContent}>
                Bạn nhỏ cảm nhận từng lời giảng của cô và ngắm mãi những điểm
                mười cô cho với tất cả tình yêu thương.
              </Text>
              <Pressable onPress={() => playSound("dap_an_3")}>
                <Text style={styles.speaker}>🔊</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={name}
        classes={classes}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
      />

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={require("@/assets/images/banner-chuong-trinh.png")}
          style={styles.bannerBackground}
          resizeMode="contain"
        >
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Bài học</Text>
            <Text style={styles.bannerSubtitle}>{tenBaiHoc}</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Nút chuyển chế độ (3 chế độ) */}
      <View style={styles.modeButtons}>
        <Pressable
          style={[styles.modeBtn, mode === 1 && styles.modeBtnActive]}
          onPress={() => setMode(1)}
        >
          <Text style={[styles.modeText, mode === 1 && styles.modeTextActive]}>
            1. Mẫu
          </Text>
        </Pressable>

        <Pressable
          style={[styles.modeBtn, mode === 2 && styles.modeBtnActive]}
          onPress={() => setMode(2)}
        >
          <Text style={[styles.modeText, mode === 2 && styles.modeTextActive]}>
            2. Từng khổ
          </Text>
        </Pressable>

        <Pressable
          style={[styles.modeBtn, mode === 3 && styles.modeBtnActive]}
          onPress={() => setMode(3)}
        >
          <Text style={[styles.modeText, mode === 3 && styles.modeTextActive]}>
            3. Tìm hiểu bài
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mode === 1 && renderMode1()}
        {mode === 2 && renderMode2()}
        {mode === 3 && renderMode3()}
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  // Banner
  bannerContainer: {
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 8,
    marginBottom: 5,
  },
  bannerBackground: {
    width: "100%",
    height: 95,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerTextContainer: {
    alignItems: "center",
    marginTop: -25,
    width: "90%",
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E53E3E",
  },
  bannerSubtitle: {
    fontSize: 13,
    color: "#2B6CB0",
    marginTop: 2,
    textTransform: "uppercase",
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  // Nút chuyển chế độ
  modeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
    gap: 8,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
  },
  modeBtnActive: {
    backgroundColor: "#2563EB",
  },
  modeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  modeTextActive: {
    color: "#FFFFFF",
  },

  // Khung bài thơ
  storyBox: {
    borderWidth: 2,
    borderColor: "#2B6CB0",
    borderRadius: 20,
    padding: 18,
    backgroundColor: "#FFFFFF",
  },
  tabHeader: {
    position: "absolute",
    top: -14,
    left: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#2B6CB0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tabTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 20,
    color: "#1E3A8A",
  },
  poemStanza: {
    fontSize: 16,
    lineHeight: 28,
    color: "#1E293B",
    marginBottom: 16,
    textAlign: "center",
  },
  poemStanzaLine: {
    fontSize: 16,
    lineHeight: 28,
    color: "#1E293B",
    marginLeft: 10,
  },
  author: {
    textAlign: "right",
    fontStyle: "italic",
    color: "#64748B",
    marginTop: 10,
  },

  // Chế độ từng khổ
  sentenceLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
  },
  speaker: {
    fontSize: 16,
    marginLeft: 5,
  },
  speaker_2: {
    fontSize: 16,
    marginTop: 4,
  },
  pressed: {
    opacity: 0.7,
  },

  // Phần câu hỏi
  questionSection: {
    marginTop: 24,
  },
  questionBlock: {
    marginBottom: 24,
  },
  questionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  questionBox: {
    width: "100%",
    minHeight: 70,
    borderWidth: 1.5,
    borderColor: "#94A3B8",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
  },
  questionText: {
    fontSize: 16,
    color: "#1E293B",
    lineHeight: 24,
  },
  answerToggleRow: {
    marginTop: 10,
    alignItems: "flex-start",
  },
  answerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
  },
  answerButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  arrow: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  answerBox: {
    width: "100%",
    minHeight: 80,
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: "#22C55E",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#F0FDF4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  answerContent: {
    flex: 1,
    fontSize: 16,
    color: "#166534",
    lineHeight: 24,
    marginRight: 10,
  },
});
