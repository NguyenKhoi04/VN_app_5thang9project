import { useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../Footer";
import Header, { ClassInfo } from "../Header";

const { width } = Dimensions.get("window");

// ================== VIDEO MAP ==================
const VIDEO_MAP: Record<string, any> = {
  // Mode 1 - Chữ hoa
  A: require("@/assets/videos/a_hoa.mp4"),
  Ă: require("@/assets/videos/a_hoa_loai2.mp4"),
  Â: require("@/assets/videos/a_hoa_loai3.mp4"),
  B: require("@/assets/videos/b_hoa.mp4"),
  C: require("@/assets/videos/c_hoa.mp4"),
  D: require("@/assets/videos/d_hoa.mp4"),

  // Mode 2 - Ứng dụng
  a_ungdung: require("@/assets/videos/a_ungdung.mp4"),

  // Mode 3 - Từ khó
  lat_xat: require("@/assets/videos/lat_xat.mp4"),
  xuyt_xoa: require("@/assets/videos/xuyt_xoa.mp4"),
};

// ================== NHÃN HIỂN THỊ ==================
const LETTER_LABELS: Record<string, string> = {
  A: "A",
  Ă: "Ă",
  Â: "Â",
  B: "B",
  C: "C",
  D: "D",
  a_ungdung: "a ứng dụng",
  lat_xat: "lạt xạt",
  xuyt_xoa: "xuýt xoa",
};

// ================== GIẢI THÍCH TỪ KHÓ ==================
const WORD_MEANINGS: Record<string, string> = {
  lat_xat: "Lạt xạt: tiếng động phát ra khi mưa rơi trên lá cây hoặc mái nhà.",
  xuyt_xoa: "Xuýt xoa: tỏ vẻ đau đớn, xót xa hoặc cảm thấy tiếc nuối.",
};

// Danh sách theo từng mode
const MODE1_LETTERS = ["A", "Ă", "Â", "B", "C", "D"];
const MODE2_LETTERS = ["a_ungdung"];
const MODE3_LETTERS = ["lat_xat", "xuyt_xoa"];

export default function WritingPracticeClass2Detail() {
  const params = useLocalSearchParams<{ ho_ten?: string }>();
  const [name, setName] = useState(params.ho_ten || "");
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  // Mode chính: 1 = Chữ hoa, 2 = Ứng dụng, 3 = Từ khó
  const [mode, setMode] = useState<1 | 2 | 3>(1);

  // Chữ / từ đang chọn
  const [currentLetter, setCurrentLetter] = useState("A");

  // ===== Player =====
  const player = useVideoPlayer(VIDEO_MAP[currentLetter], (p) => {
    p.loop = false;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  // Đổi video khi chọn chữ/từ mới
  useEffect(() => {
    const changeVideo = async () => {
      try {
        if (VIDEO_MAP[currentLetter]) {
          await player.replaceAsync(VIDEO_MAP[currentLetter]);
          player.pause();
        }
      } catch (e) {
        console.log("Lỗi đổi video:", e);
      }
    };
    changeVideo();
  }, [currentLetter]);

  useEffect(() => {
    if (params.ho_ten) setName(params.ho_ten);
  }, [params.ho_ten]);

  // Khi đổi mode → tự chọn item đầu tiên của mode đó
  useEffect(() => {
    if (mode === 1) setCurrentLetter("A");
    if (mode === 2) setCurrentLetter("a_ungdung");
    if (mode === 3) setCurrentLetter("lat_xat");
  }, [mode]);

  const getCurrentList = () => {
    if (mode === 1) return MODE1_LETTERS;
    if (mode === 2) return MODE2_LETTERS;
    return MODE3_LETTERS;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
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
            <Text style={styles.bannerSubtitle}>Luyện viết chữ</Text>
          </View>
        </ImageBackground>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ========== MENU 1 - 2 - 3 (TRƯỚC KHUNG) ========== */}
        <View style={styles.modeButtons}>
          <Pressable
            style={[styles.modeBtn, mode === 1 && styles.modeBtnActive]}
            onPress={() => setMode(1)}
          >
            <Text style={[styles.modeText, mode === 1 && styles.modeTextActive]}>
              1. Viết chữ hoa
            </Text>
          </Pressable>

          <Pressable
            style={[styles.modeBtn, mode === 2 && styles.modeBtnActive]}
            onPress={() => setMode(2)}
          >
            <Text style={[styles.modeText, mode === 2 && styles.modeTextActive]}>
              2. Ứng dụng
            </Text>
          </Pressable>

          <Pressable
            style={[styles.modeBtn, mode === 3 && styles.modeBtnActive]}
            onPress={() => setMode(3)}
          >
            <Text style={[styles.modeText, mode === 3 && styles.modeTextActive]}>
              3. Luyện từ khó
            </Text>
          </Pressable>
        </View>

        {/* ========== MENU PHỤ THEO MODE ========== */}

        {/* Mode 1 & 2: Menu ngang (gọn hơn) */}
          {(mode === 1 || mode === 2) && (
            <View style={styles.horizontalMenu}>
              {getCurrentList().map((item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.horizontalItem,
                    currentLetter === item && styles.horizontalItemActive,
                  ]}
                  onPress={() => setCurrentLetter(item)}
                >
                  <Text
                    style={[
                      styles.horizontalText,
                      currentLetter === item && styles.horizontalTextActive,
                    ]}
                  >
                    {LETTER_LABELS[item] || item}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

        {/* Mode 3: Menu ngang */}
        {mode === 3 && (
          <View style={styles.horizontalMenu}>
            {MODE3_LETTERS.map((item) => (
              <Pressable
                key={item}
                style={[
                  styles.horizontalItem,
                  currentLetter === item && styles.horizontalItemActive,
                ]}
                onPress={() => setCurrentLetter(item)}
              >
                <Text
                  style={[
                    styles.horizontalText,
                    currentLetter === item && styles.horizontalTextActive,
                  ]}
                >
                  {LETTER_LABELS[item] || item}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* ========== KHUNG VIDEO ========== */}
        <View style={styles.storyBox}>
          {/* Tab hiện tên đang chọn */}
          <View style={styles.tabHeader}>
            <Text style={styles.tabTitle}>
              {LETTER_LABELS[currentLetter] || currentLetter}
            </Text>
          </View>

          {/* Hướng dẫn */}
          <Text style={styles.instruction}>
            Các bé xem video và viết vào vở:
          </Text>

          {/* ===== GIẢI THÍCH NGHĨA (chỉ Mode 3) ===== */}
          {mode === 3 && WORD_MEANINGS[currentLetter] && (
            <View style={styles.meaningBox}>
              <Text style={styles.meaningTitle}>Giải thích:</Text>
              <Text style={styles.meaningText}>
                {WORD_MEANINGS[currentLetter]}
              </Text>
            </View>
          )}

          {/* VIDEO */}
          <View style={styles.videoWrapper}>
            <VideoView
              style={styles.video}
              player={player}
              allowsVideoFrameAnalysis
              allowsPictureInPicture
            />
          </View>

          {/* Nút Phát / Tạm dừng */}
          <View style={styles.controlRow}>
            <Pressable
              style={styles.playBtn}
              onPress={() => {
                if (isPlaying) {
                  player.pause();
                } else {
                  player.play();
                }
              }}
            >
              <Text style={styles.playBtnText}>
                {isPlaying ? "⏸ Tạm dừng" : "▶ Phát video"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

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

  // ===== MENU 1-2-3 =====
  modeButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 8,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
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
    textAlign: "center",
  },
  modeTextActive: {
    color: "#FFFFFF",
  },


  // ===== MENU NGANG (Mode 3) =====
  horizontalMenu: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
    justifyContent: "center",
  },
  horizontalItem: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
  },
  horizontalItemActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  horizontalText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },
  horizontalTextActive: {
    color: "#FFFFFF",
  },

  // ===== KHUNG VIDEO =====
  storyBox: {
    borderWidth: 2,
    borderColor: "#2B6CB0",
    borderRadius: 20,
    padding: 18,
    backgroundColor: "#FFFFFF",
    marginTop: 8,
  },
  tabHeader: {
    position: "absolute",
    top: -14,
    left: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#2B6CB0",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  tabTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  instruction: {
    fontSize: 16,
    color: "#1E293B",
    textAlign: "center",
    marginTop: 22,
    marginBottom: 14,
    fontWeight: "500",
  },

  // Hộp giải thích nghĩa
  meaningBox: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  meaningTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 4,
  },
  meaningText: {
    fontSize: 14,
    color: "#78350F",
    lineHeight: 20,
  },

  videoWrapper: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
  },
  video: {
    width: "100%",
    height: "100%",
  },

  controlRow: {
    marginTop: 16,
    alignItems: "center",
  },
  playBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 11,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  playBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
});