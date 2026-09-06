import { createAudioPlayer } from "expo-audio";
// import { router, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Modal,
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

export default function ReadingPronunciationbai6week3Screen() {
  const params = useLocalSearchParams<{
    ho_ten?: string;
    ten_ky_nang?: string;
  }>();
  const [name, setName] = useState(params.ho_ten || "");
  const [tenBaiHoc] = useState("Một giờ học");
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [showAnswer3, setShowAnswer3] = useState(false);
  const [mode, setMode] = useState<1 | 2 | 3 | 4>(1); // 1: mẫu, 2: từ khó, 3: từng câu
  const [showExplain, setShowExplain] = useState(false);
  const [explainWord, setExplainWord] = useState("");
  const [explainText, setExplainText] = useState("");

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  useEffect(() => {
    if (params.ho_ten) setName(params.ho_ten);
  }, [params.ho_ten]);

  const AUDIO_MAP: Record<string, any> = {
    doc_mau: require("../../../../../text-to-speech/speech_docmau_bai6_week3.wav"),
    lung_tung: require("../../../../../text-to-speech/speech_lung_tung.wav"),
    kien_nhan: require("../../../../../text-to-speech/speech_kien_nhan.wav"),
    doan1: require("../../../../../text-to-speech/speech_doan1_bai6_week3.wav"),
    doan2: require("../../../../../text-to-speech/speech_doan2_bai6_week3.wav"),
    doan3: require("../../../../../text-to-speech/speech_doan3_bai6_week3.wav"),
    doan4: require("../../../../../text-to-speech/speech_doan4_bai6_week3.wav"),
    cau_hoi_1: require("../../../../../text-to-speech/speech_cauhoi1_bai6_week3.wav"),
    dap_an_1: require("../../../../../text-to-speech/speech_dapan1_bai6_week3.wav"),
    cau_hoi_2: require("../../../../../text-to-speech/speech_cauhoi2_bai6_week3.wav"),
    dap_an_2: require("../../../../../text-to-speech/speech_dapan2_bai6_week3.wav"),
    cau_hoi_3: require("../../../../../text-to-speech/speech_cauhoi3_bai6_week3.wav"),
    dap_an_3: require("../../../../../text-to-speech/speech_dapan3_bai6_week3.wav"),
  };

  const openExplain = (word: string, meaning: string) => {
    setExplainWord(word);
    setExplainText(meaning);
    setShowExplain(true);
    if (word === "lúng túng") playSound("lung_tung");
    if (word === "kiên nhẫn") playSound("kien_nhan");
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

  // ===== NỘI DUNG BÀI =====
  // ===== MODE 1: Đọc theo mẫu =====
  const renderMode1 = () => (
    <View style={styles.storyBox}>
      <View style={styles.tabHeader}>
        <Pressable onPress={() => playSound("doc_mau")}>
          <Text style={styles.speaker}>🔊</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Một giờ học</Text>

      <Text style={styles.paragraph}>
        {"\u00A0\u00A0\u00A0\u00A0"}Thầy giáo nói: “Chúng ta cần học cách giao
        tiếp tự tin. Vì thế hôm nay chúng ta sẽ tập nói trước lớp về bất cứ điều
        gì mình thích.”.
      </Text>
      <Text style={styles.paragraph}>
        {"\u00A0\u00A0\u00A0\u00A0"}Quang được mời lên nói đầu tiên. Cậu lúng
        túng, đỏ mặt. Quang cảm thấy nói với bạn bên cạnh thì dễ, nhưng nói
        trước cả lớp thì sao mà khó thế. Thầy bảo: “Sáng nay ngủ dậy, em đã làm
        gì? Em cố nhớ xem.”.
      </Text>
      <Text style={styles.paragraph}>
        {"\u00A0\u00A0\u00A0\u00A0"}Quang ngập ngừng, vừa nói vừa gãi đầu:
        “Em...”. Thầy giáo nhắc: “Rồi gì nữa?”. Quang lại gãi đầu: “À... ờ... Em
        ngủ dậy.”. Và cậu nói tiếp: “Rồi... ờ...”.
      </Text>
      <Text style={styles.paragraph}>
        {"\u00A0\u00A0\u00A0\u00A0"}Thầy giáo mỉm cười, kiên nhẫn nghe Quang
        nói. Thầy bảo: “Thế là được rồi đấy!”. Nhưng Quang chưa chịu về chỗ.
        Bỗng cậu nói to: “Rồi sau đó... ờ... à...”. Quang thở mạnh một hơi rồi
        nói tiếp: “Mẹ... ờ... bảo: Con đánh răng đi. Thế là em đánh răng.”. Thầy
        giáo vỗ tay. Cả lớp vỗ tay theo. Cuối cùng, Quang nói với giọng rất tự
        tin: “Sau đó bố đưa em đi học.”.
      </Text>
      <Text style={styles.paragraph}>
        {"\u00A0\u00A0\u00A0\u00A0"}Thầy giáo vỗ tay. Các bạn vỗ tay theo. Quang
        cũng vỗ tay. Cả lớp tràn ngập tiếng vỗ tay.
      </Text>

      <Text style={styles.author}>(Theo Tốt-tô-chan, cô bé bên cửa sổ)</Text>
    </View>
  );

  // ===== MODE 2: Hiểu từ khó =====
  const renderMode2 = () => (
    <View style={styles.storyBox}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Hiểu từ khó</Text>
        <Pressable onPress={() => playSound("doc_mau")}>
          <Text style={styles.speaker}>🔊</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Một giờ học</Text>

      <Text style={styles.paragraph}>
        {"\u00A0\u00A0\u00A0\u00A0"}Thầy giáo nói: “Chúng ta cần học cách giao
        tiếp tự tin. Vì thế hôm nay chúng ta sẽ tập nói trước lớp về bất cứ điều
        gì mình thích.”.
      </Text>
      <Text style={styles.paragraph}>
        {"\u00A0\u00A0\u00A0\u00A0"}Quang được mời lên nói đầu tiên. Cậu{" "}
        <Text
          style={styles.hardWord}
          onPress={() =>
            openExplain(
              "lúng túng",
              "Lúng túng là không biết nói hoặc làm như thế nào.",
            )
          }
        >
          lúng túng
          <Text style={styles.questionMark}> ?</Text>
        </Text>
        , đỏ mặt. Quang cảm thấy nói với bạn bên cạnh thì dễ, nhưng nói trước cả
        lớp thì sao mà khó thế. Thầy bảo: “Sáng nay ngủ dậy, em đã làm gì? Em cố
        nhớ xem.”.
      </Text>
      <Text style={styles.paragraph}>
        {"\u00A0\u00A0\u00A0\u00A0"}Quang ngập ngừng, vừa nói vừa gãi đầu:
        “Em...”. Thầy giáo nhắc: “Rồi gì nữa?”. Quang lại gãi đầu: “À... ờ... Em
        ngủ dậy.”. Và cậu nói tiếp: “Rồi... ờ...”.
      </Text>
      <Text style={styles.paragraph}>
        {"\u00A0\u00A0\u00A0\u00A0"}Thầy giáo mỉm cười,{" "}
        <Text
          style={styles.hardWord}
          onPress={() =>
            openExplain(
              "kiên nhẫn",
              "Kiên nhẫn là tiếp tục làm việc đã định mà không nản lòng.",
            )
          }
        >
          kiên nhẫn
          <Text style={styles.questionMark}> ?</Text>
        </Text>{" "}
        nghe Quang nói. Thầy bảo: “Thế là được rồi đấy!”. Nhưng Quang chưa chịu
        về chỗ. Bỗng cậu nói to: “Rồi sau đó... ờ... à...”. Quang thở mạnh một
        hơi rồi nói tiếp: “Mẹ... ờ... bảo: Con đánh răng đi. Thế là em đánh
        răng.”. Thầy giáo vỗ tay. Cả lớp vỗ tay theo. Cuối cùng, Quang nói với
        giọng rất tự tin: “Sau đó bố đưa em đi học.”.
      </Text>
      <Text style={styles.paragraph}>
        {"\u00A0\u00A0\u00A0\u00A0"}Thầy giáo vỗ tay. Các bạn vỗ tay theo. Quang
        cũng vỗ tay. Cả lớp tràn ngập tiếng vỗ tay.
      </Text>

      <Text style={styles.author}>(Theo Tốt-tô-chan, cô bé bên cửa sổ)</Text>
    </View>
  );

  // ===== MODE 3: Đọc từng đoạn =====
  const renderMode3 = () => (
    <View style={styles.storyBox}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Đọc từng đoạn</Text>
      </View>

      <Text style={styles.title}>Một giờ học</Text>

      <Pressable
        style={({ pressed }) => [
          styles.sentenceLine,
          pressed && styles.pressed,
        ]}
        onPress={() => playSound("doan1")}
      >
        <Text style={styles.speaker_2}>🔊</Text>
        <Text style={styles.paragraph}>
          {"\u00A0\u00A0\u00A0\u00A0"}Thầy giáo nói: “Chúng ta cần học cách giao
          tiếp tự tin. Vì thế hôm nay chúng ta sẽ tập nói trước lớp về bất cứ
          điều gì mình thích.”.
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.sentenceLine,
          pressed && styles.pressed,
        ]}
        onPress={() => playSound("doan2")}
      >
        <Text style={styles.speaker_2}>🔊</Text>
        <Text style={styles.paragraph}>
          {"\u00A0\u00A0\u00A0\u00A0"}Quang được mời lên nói đầu tiên. Cậu lúng
          túng, đỏ mặt. Quang cảm thấy nói với bạn bên cạnh thì dễ, nhưng nói
          trước cả lớp thì sao mà khó thế. Thầy bảo: “Sáng nay ngủ dậy, em đã
          làm gì? Em cố nhớ xem.”.
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.sentenceLine,
          pressed && styles.pressed,
        ]}
        onPress={() => playSound("doan3")}
      >
        <Text style={styles.speaker_2}>🔊</Text>
        <Text style={styles.paragraph}>
          {"\u00A0\u00A0\u00A0\u00A0"}Quang ngập ngừng, vừa nói vừa gãi đầu:
          “Em...”. {"\n"}
          {"\u00A0\u00A0\u00A0\u00A0"}Thầy giáo nhắc: “Rồi gì nữa?”. {"\n"}
          {"\u00A0\u00A0\u00A0\u00A0"}Quang lại gãi đầu: “À... ờ... Em ngủ
          dậy.”. Và cậu nói tiếp: “Rồi... ờ...”. {"\n"}
          {"\u00A0\u00A0\u00A0\u00A0"}Thầy giáo mỉm cười, kiên nhẫn nghe Quang
          nói. Thầy bảo: “Thế là được rồi đấy!”.
        </Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.sentenceLine,
          pressed && styles.pressed,
        ]}
        onPress={() => playSound("doan4")}
      >
        <Text style={styles.speaker_2}>🔊</Text>
        <Text style={styles.paragraph}>
          {"\u00A0\u00A0\u00A0\u00A0"}Nhưng Quang chưa chịu về chỗ. Bỗng cậu nói
          to: “Rồi sau đó... ờ... à...”. Quang thở mạnh một hơi rồi nói tiếp:
          “Mẹ... ờ... bảo: Con đánh răng đi. Thế là em đánh răng.”. Thầy giáo vỗ
          tay. Cả lớp vỗ tay theo. Cuối cùng, Quang nói với giọng rất tự tin:
          “Sau đó bố đưa em đi học.”.
          {"\n"} {"\u00A0\u00A0\u00A0\u00A0"} Thầy giáo vỗ tay. Các bạn vỗ tay
          theo. Quang cũng vỗ tay. Cả lớp tràn ngập tiếng vỗ tay.
        </Text>
      </Pressable>

      <Text style={styles.author}>(Theo Tốt-tô-chan, cô bé bên cửa sổ)</Text>
    </View>
  );

  // ===== MODE 4: Tìm hiểu bài học =====
  const renderMode4 = () => (
    <View>
      <View style={styles.storyBox}>
        <View style={styles.tabHeader}>
          <Text style={styles.tabTitle}>Tìm hiểu bài học rút ra đại ý</Text>
        </View>

        <Text style={styles.title}>Một giờ học</Text>

        <Text style={styles.paragraph}>
          {"\u00A0\u00A0\u00A0\u00A0"}Thầy giáo nói: “Chúng ta cần học cách giao
          tiếp tự tin. Vì thế hôm nay chúng ta sẽ tập nói trước lớp về bất cứ
          điều gì mình thích.”.
        </Text>
        <Text style={styles.paragraph}>
          {"\u00A0\u00A0\u00A0\u00A0"}Quang được mời lên nói đầu tiên. Cậu lúng
          túng, đỏ mặt... Thầy giáo mỉm cười, kiên nhẫn nghe Quang nói... Cuối
          cùng, Quang nói với giọng rất tự tin: “Sau đó bố đưa em đi học.”. Cả
          lớp tràn ngập tiếng vỗ tay.
        </Text>

        <Text style={styles.author}>(Theo Tốt-tô-chan, cô bé bên cửa sổ)</Text>
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
              Thầy giáo yêu cầu các bạn làm gì trong giờ học?
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
                Thầy giáo yêu cầu các bạn tập nói trước lớp về bất cứ điều gì
                mình thích.
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
              Quang cảm thấy như thế nào khi được mời lên nói trước lớp?
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
                Quang lúng túng, đỏ mặt. Cậu cảm thấy nói trước cả lớp rất khó.
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
              Thái độ của thầy giáo khi nghe Quang nói như thế nào?
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
                Thầy giáo mỉm cười, kiên nhẫn nghe Quang nói và động viên cậu.
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

      {/* Banner giữ nguyên */}
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

      {/* Nút chuyển chế độ */}
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
            2. Hiểu từ khó
          </Text>
        </Pressable>
        <Pressable
          style={[styles.modeBtn, mode === 3 && styles.modeBtnActive]}
          onPress={() => setMode(3)}
        >
          <Text style={[styles.modeText, mode === 3 && styles.modeTextActive]}>
            3. Hiểu từng đoạn
          </Text>
        </Pressable>
        <Pressable
          style={[styles.modeBtn, mode === 4 && styles.modeBtnActive]}
          onPress={() => setMode(4)}
        >
          <Text style={[styles.modeText, mode === 4 && styles.modeTextActive]}>
            4. Tìm hiểu bài học
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mode === 1 && renderMode1()}
        {mode === 2 && renderMode2()}
        {mode === 3 && renderMode3()}
        {mode === 4 && renderMode4()}
      </ScrollView>

      {/* Modal giải thích từ khó */}
      <Modal visible={showExplain} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{explainWord}</Text>
            <Text style={styles.modalContent}>{explainText}</Text>
            <Pressable
              style={styles.closeBtn}
              onPress={() => setShowExplain(false)}
            >
              <Text style={styles.closeText}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  // Banner giữ nguyên
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
  // Nút chế độ - 2 hàng × 2 cột
  modeButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
    gap: 10,
  },
  modeBtn: {
    width: (width - 52) / 2, // 2 cột
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
  },
  modeBtnActive: {
    backgroundColor: "#2563EB",
  },
  modeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  modeTextActive: {
    color: "#FFFFFF",
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
    minHeight: 100,
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

  // Khung bài đọc
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
    marginBottom: 16,
    color: "#1E3A8A",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 26,
    color: "#1E293B",
    marginBottom: 14,
    textAlign: "justify",
  },
  author: {
    textAlign: "right",
    fontStyle: "italic",
    color: "#64748B",
    marginTop: 8,
  },

  // Từ khó
  hardWord: {
    color: "#DC2626",
    fontWeight: "700",
  },
  questionMark: {
    fontSize: 12,
    color: "#DC2626",
    fontWeight: "700",
  },

  // Chế độ 3 - từng câu
  sentenceLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  speaker: {
    fontSize: 16,
    marginLeft: 5,
  },

  speaker_2: {
    fontSize: 14,
    marginLeft: -15,
  },
  pressed: {
    opacity: 0.7,
  },

  // Modal giải thích
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: width * 0.8,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#DC2626",
    marginBottom: 12,
  },
  modalContent: {
    fontSize: 16,
    lineHeight: 24,
    color: "#1E293B",
    marginBottom: 20,
  },
  closeBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
