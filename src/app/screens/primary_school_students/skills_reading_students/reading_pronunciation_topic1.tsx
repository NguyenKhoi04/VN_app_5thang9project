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

export default function ReadingPronunciationTopic1Screen() {
  const params = useLocalSearchParams<{
    ho_ten?: string;
    ten_ky_nang?: string;
  }>();
  const [name, setName] = useState(params.ho_ten || "");
  const [tenBaiHoc] = useState("Tôi là học sinh lớp 1");
  const [mode, setMode] = useState<1 | 2 | 3>(1); // 1: mẫu, 2: từ khó, 3: từng câu
  const [showExplain, setShowExplain] = useState(false);
  const [explainWord, setExplainWord] = useState("");
  const [explainText, setExplainText] = useState("");

  const [selectedClass, setSelectedClass] = useState<string>("");
  // Sử dụng router như navigation
  const navigation = useNavigation();
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  useEffect(() => {
    if (params.ho_ten) setName(params.ho_ten);
  }, [params.ho_ten]);

  const AUDIO_MAP: Record<string, any> = {
    doc_mau: require("../../../../../text-to-speech/speech_docmau_bai1_topic1.wav"),
    dong_phuc: require("../../../../../text-to-speech/speech_docmau_dong_phuc.wav"),
    hanh_dien: require("../../../../../text-to-speech/speech_docmau_hanh_dien.wav"),
    chung_chac: require("../../../../../text-to-speech/speech_docmau_chung_chac.wav"),
    doan1: require("../../../../../text-to-speech/speech_docmau_doan1_bai1_topic1.wav"),
    doan2: require("../../../../../text-to-speech/speech_docmau_doan2_bai1_topic1.wav"),
    doan3: require("../../../../../text-to-speech/speech_docmau_doan3_bai1_topic1.wav"),
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

  const openExplain = (word: string, meaning: string) => {
    setExplainWord(word);
    setExplainText(meaning);
    setShowExplain(true);
    // Có thể phát âm luôn
    if (word === "đồng phục") playSound("dong_phuc");
    if (word === "hãnh diện") playSound("hanh_dien");
    if (word === "chững chạc") playSound("chung_chac");
  };

  // ===== NỘI DUNG BÀI =====
  const renderMode1 = () => (
    <View style={styles.storyBox}>
      <View style={styles.tabHeader}>
        <Pressable onPress={() => playSound("doc_mau")}>
          <Text style={styles.speaker}>🔊</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Tôi là học sinh lớp 1</Text>

      <Text style={styles.paragraph}>
        {/* \u00A0\u00A0\u00A0\u00A0 : 4 khoang trang và thụt câu */}
        {"\u00A0\u00A0\u00A0\u00A0"}Tôi tên là Nam, học sinh lớp 1A, Trường Tiểu
        học Lê Quý Đôn. Ngày đầu đi học, mặc bộ đồng phục của trường, tôi hãnh
        diện lắm.
      </Text>

      <Text style={styles.paragraph}>
        {"\u00A0\u00A0\u00A0\u00A0"}Hồi đầu năm học, tôi mới học chữ cái. Thế mà
        bây giờ, tôi đã đọc được truyện tranh. Tôi còn biết làm toán nữa. Tôi có
        thêm nhiều bạn mới.
      </Text>

      <Text style={styles.paragraph}>
        {"\u00A0\u00A0\u00A0\u00A0"}Ai cũng bảo từ khi đi học, tôi chững chạc
        hẳn lên.
      </Text>

      <Text style={styles.author}>(Trung Sơn)</Text>
    </View>
  );

  const renderMode2 = () => (
    <View style={styles.storyBox}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Hiểu từ khó</Text>
        <Pressable onPress={() => playSound("doc_mau")}>
          <Text style={styles.speaker}>🔊</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Tôi là học sinh lớp 1</Text>

      <Text style={styles.paragraph}>
        {"\u00A0\u00A0\u00A0\u00A0"}Tôi tên là Nam, học sinh lớp 1A, Trường Tiểu
        học Lê Quý Đôn. Ngày đầu đi học, mặc bộ{" "}
        <Text
          style={styles.hardWord}
          onPress={() =>
            openExplain(
              "đồng phục",
              "Đồng phục là bộ quần áo giống nhau của học sinh khi đến trường.",
            )
          }
        >
          đồng phục
          <Text style={styles.questionMark}> ?</Text>
        </Text>{" "}
        của trường, tôi{" "}
        <Text
          style={styles.hardWord}
          onPress={() =>
            openExplain(
              "hãnh diện",
              "Hãnh diện nghĩa là cảm thấy tự hào, vui vẻ vì điều gì đó tốt đẹp.",
            )
          }
        >
          hãnh diện
          <Text style={styles.questionMark}> ?</Text>
        </Text>{" "}
        lắm.
      </Text>

      <Text style={styles.paragraph}>
        {"\u00A0\u00A0\u00A0\u00A0"}Hồi đầu năm học, tôi mới học chữ cái. Thế mà
        bây giờ, tôi đã đọc được truyện tranh. Tôi còn biết làm toán nữa. Tôi có
        thêm nhiều bạn mới.
      </Text>

      <Text style={styles.paragraph}>
        {"\u00A0\u00A0\u00A0\u00A0"}Ai cũng bảo từ khi đi học, tôi{" "}
        <Text
          style={styles.hardWord}
          onPress={() =>
            openExplain(
              "chững chạc",
              "Chững chạc nghĩa là trông người lớn hơn, đứng đắn, chín chắn hơn.",
            )
          }
        >
          chững chạc
          <Text style={styles.questionMark}> ?</Text>
        </Text>{" "}
        hẳn lên.
      </Text>

      <Text style={styles.author}>(Trung Sơn)</Text>
    </View>
  );

  const renderMode3 = () => (
    <View style={styles.storyBox}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Đọc theo mẫu</Text>
      </View>

      <Text style={styles.title}>Tôi là học sinh lớp 1</Text>

      {/* Câu 1 */}
      <Pressable
        style={({ pressed }) => [
          styles.sentenceLine,
          pressed && styles.pressed,
        ]}
        onPress={() => playSound("doan1")}
      >
        <Text style={styles.speaker_2}>🔊</Text>
        <Text style={styles.paragraph}>
          {"\u00A0\u00A0\u00A0\u00A0"}Tôi tên là Nam, học sinh lớp 1A, Trường
          Tiểu học Lê Quý Đôn. Ngày đầu đi học, mặc bộ đồng phục của trường, tôi
          hãnh diện lắm.
        </Text>
      </Pressable>

      {/* Câu 2 */}
      <Pressable
        style={({ pressed }) => [
          styles.sentenceLine,
          pressed && styles.pressed,
        ]}
        onPress={() => playSound("doan2")}
      >
        <Text style={styles.speaker_2}>🔊</Text>
        <Text style={styles.paragraph}>
          {"\u00A0\u00A0\u00A0\u00A0"}Hồi đầu năm học, tôi mới học chữ cái. Thế
          mà bây giờ, tôi đã đọc được truyện tranh. Tôi còn biết làm toán nữa.
          Tôi có thêm nhiều bạn mới.
        </Text>
      </Pressable>

      {/* Câu 3 */}
      <Pressable
        style={({ pressed }) => [
          styles.sentenceLine,
          pressed && styles.pressed,
        ]}
        onPress={() => playSound("doan3")}
      >
        <Text style={styles.speaker_2}>🔊</Text>
        <Text style={styles.paragraph}>
          {"\u00A0\u00A0\u00A0\u00A0"}Ai cũng bảo từ khi đi học, tôi chững chạc
          hẳn lên.
        </Text>
      </Pressable>

      <Text style={styles.author}>(Trung Sơn)</Text>
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
            3. Đọc theo mẫu
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mode === 1 && renderMode1()}
        {mode === 2 && renderMode2()}
        {mode === 3 && renderMode3()}
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
  modeButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  modeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#E2E8F0",
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
