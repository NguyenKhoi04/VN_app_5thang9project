import { useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
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
import { SafeAreaView } from "react-native-safe-area-context"; // ← đổi ở đây
import Footer from "../Footer";
import Header, { ClassInfo } from "../Header";
import { useEvent } from "expo";

const { width } = Dimensions.get("window");

// ================== VIDEO MAP ==================
const VIDEO_MAP: Record<string, any> = {
  a: require("@/assets/videos/chu_a.mp4"),
  b: require("@/assets/videos/chu_b.mp4"),
  c: require("@/assets/videos/chu_c.mp4"),
  ba_huyen: require("@/assets/videos/chu_ba_huyen.mp4"),
  ca_sac: require("@/assets/videos/chu_ca_sac.mp4"),
  i: require("@/assets/videos/chu_i.mp4"),
  k: require("@/assets/videos/chu_k.mp4"),
  ki_da: require("@/assets/videos/chu_ki_da.mp4"), // ← đổi key thành ki_da
};

// ================== TÊN HIỂN THỊ TIẾNG VIỆT ==================
const LETTER_LABELS: Record<string, string> = {
  a: "a",
  b: "b",
  c: "c",
  ba_huyen: "bà",
  ca_sac: "cá",
  i: "i",
  k: "k",
  ki_da: "kì đà",          // ← tên đẹp để hiển thị
};

const LETTERS = Object.keys(VIDEO_MAP);

export default function WritingPracticeWeek1Detail() {
  const params = useLocalSearchParams<{ ho_ten?: string }>();
  const [name, setName] = useState(params.ho_ten || "");
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  const [currentLetter, setCurrentLetter] = useState("a");
  const [showLetterPicker, setShowLetterPicker] = useState(false);

  // ===== Tạo player =====
const player = useVideoPlayer(VIDEO_MAP[currentLetter], (player) => {
  player.loop = false;
});

// Lắng nghe trạng thái playing để cập nhật UI
const { isPlaying } = useEvent(player, "playingChange", {
  isPlaying: player.playing,
});

// Khi đổi chữ cái
useEffect(() => {
  const changeVideo = async () => {
    try {
      await player.replaceAsync(VIDEO_MAP[currentLetter]);
      player.pause(); // dừng khi đổi video
    } catch (e) {
      console.log("Lỗi đổi video:", e);
    }
  };
  changeVideo();
}, [currentLetter]);

  // Khi đổi chữ cái → dùng replaceAsync (tránh warning iOS)
  useEffect(() => {
    const changeVideo = async () => {
      try {
        await player.replaceAsync(VIDEO_MAP[currentLetter]);
      } catch (e) {
        console.log("Lỗi đổi video:", e);
      }
    };
    changeVideo();
  }, [currentLetter]);

  useEffect(() => {
    if (params.ho_ten) setName(params.ho_ten);
  }, [params.ho_ten]);

  const selectLetter = (letter: string) => {
    setCurrentLetter(letter);
    setShowLetterPicker(false);
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
        <View style={styles.storyBox}>
          {/* Tab chọn chữ */}
          <Pressable
            style={styles.tabHeader}
            onPress={() => setShowLetterPicker(true)}
          >
            <Text style={styles.tabTitle}>
              Chọn chữ {LETTER_LABELS[currentLetter] || currentLetter} ▽
            </Text>
          </Pressable>

          {/* Hướng dẫn */}
          <Text style={styles.instruction}>
            Các bé xem video và viết vào vở:
          </Text>

          {/* ===== VIDEO ===== */}
          <View style={styles.videoWrapper}>
            <VideoView
              style={styles.video}
              player={player}
              allowsVideoFrameAnalysis
              allowsPictureInPicture
            />
          </View>

          {/* Nút điều khiển */}
          <View style={styles.controlRow}>
            <Pressable
              style={styles.playBtn}
              onPress={() => {
                if (player.playing) {
                  player.pause();
                } else {
                  player.play();
                }
              }}
            >
              <Text style={styles.playBtnText}>
                {player.playing ? "⏸ Tạm dừng" : "▶ Phát video"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Modal chọn chữ cái */}
      <Modal
        visible={showLetterPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLetterPicker(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowLetterPicker(false)}
        >
          <View style={styles.letterPickerBox}>
            <Text style={styles.pickerTitle}>Chọn bài học</Text>
            <FlatList
              data={LETTERS}
              keyExtractor={(item) => item}
              numColumns={4}
              contentContainerStyle={{ alignItems: "center" }}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.letterItem,
                    currentLetter === item && styles.letterItemActive,
                  ]}
                  onPress={() => selectLetter(item)}
                >
                  <Text
                    style={[
                      styles.letterText,
                      currentLetter === item && styles.letterTextActive,
                    ]}
                  >
                    {LETTER_LABELS[item] || item}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>

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

  storyBox: {
    borderWidth: 2,
    borderColor: "#2B6CB0",
    borderRadius: 20,
    padding: 18,
    backgroundColor: "#FFFFFF",
    marginTop: 12,
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
    marginBottom: 16,
    fontWeight: "500",
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  letterPickerBox: {
    width: width * 0.85,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    maxHeight: 420,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 16,
    textAlign: "center",
  },
  letterItem: {
    width: 58,
    height: 58,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
  },
  letterItemActive: {
    backgroundColor: "#2563EB",
  },
  letterText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#334155",
    textTransform: "lowercase",
  },
  letterTextActive: {
    color: "#FFFFFF",
  },
});