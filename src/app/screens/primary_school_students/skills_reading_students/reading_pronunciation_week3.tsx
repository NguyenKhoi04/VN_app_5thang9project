// Phát âm tập đọc - Bài ki kì kí...
import { createAudioPlayer } from "expo-audio";
// import { useLocalSearchParams, useRouter } from "expo-router";

import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "../Footer";
import Header, { ClassInfo } from "../Header";

const { width } = Dimensions.get("window");

export default function PracticeReadingScreen({ navigation, route }: any) {
  const params = useLocalSearchParams<{
    ho_ten?: string;
    ten_ky_nang?: string;
  }>();

  const [name, setName] = useState<string>(
    route?.params?.ho_ten || route?.params?.name || params?.ho_ten || "Mai Thanh An"
  );
  const [selectedClass, setSelectedClass] = useState<string>(
    route?.params?.selectedClass || "Lớp 1"
  );
  const [classes, setClasses] = useState<ClassInfo[]>(
    route?.params?.classes && route.params.classes.length > 0
      ? route.params.classes
      : [{ lop: 1 }, { lop: 2 }, { lop: 3 }]
  );
  const [tenKyNang, setTenKyNang] = useState<string>(
    route?.params?.ten_ky_nang || params?.ten_ky_nang || "Tập đọc lớp 1"
  );
  const [tenBaiHoc] = useState("ki  kì  kí  kỉ  kĩ  kè  kẻ  kệ");

  useEffect(() => {
    const incomingName = route?.params?.ho_ten || route?.params?.name || params?.ho_ten;
    if (incomingName) setName(incomingName);
    if (route?.params?.selectedClass) setSelectedClass(route.params.selectedClass);
    if (route?.params?.classes && route.params.classes.length > 0) setClasses(route.params.classes);
    if (route?.params?.ten_ky_nang || params?.ten_ky_nang) {
      setTenKyNang(route?.params?.ten_ky_nang || params?.ten_ky_nang);
    }
  }, [route?.params, (params as any)?.ho_ten, (params as any)?.ten_ky_nang]);

  const navParams = {
    ho_ten: name,
    name: name,
    selectedClass: selectedClass,
    classes: classes,
    ten_ky_nang: tenKyNang,
    user: route?.params?.user || null,
    id_nguoi_dung: route?.params?.id_nguoi_dung || 1,
  };

  // Map âm thanh (bạn cần chuẩn bị file tương ứng)
  const AUDIO_MAP: Record<string, any> = {
    i: require("../../../../../text-to-speech/speech_i.wav"),
    k: require("../../../../../text-to-speech/speech_k.wav"),
    ki: require("../../../../../text-to-speech/speech_ki.wav"),
    kì: require("../../../../../text-to-speech/speech_ki_huyen.wav"),
    kí: require("../../../../../text-to-speech/speech_ki_sac.wav"),
    kỉ: require("../../../../../text-to-speech/speech_ki_hoi.wav"),
    kĩ: require("../../../../../text-to-speech/speech_ki_nga.wav"),
    kè: require("../../../../../text-to-speech/speech_ke_huyen.wav"),
    kẻ: require("../../../../../text-to-speech/speech_ke_hoi.wav"),
    kệ: require("../../../../../text-to-speech/speech_ke_nang.wav"),
    bi_do: require("../../../../../text-to-speech/speech_bi_do.wav"),
    ki_da: require("../../../../../text-to-speech/speech_ki_da.wav"),
    nam_ve_ki_da: require("../../../../../text-to-speech/speech_nam_ve_ki_da.wav"),
    kida_keda: require("../../../../../text-to-speech/speech_kida_keda.wav"),
  };

  const playSound = (text: string) => {
    console.log("Phát âm:", text);

    // Không dùng toLowerCase() với từ có dấu tiếng Việt
    const audioSource = AUDIO_MAP[text] || AUDIO_MAP[text.toLowerCase()];

    if (!audioSource) {
      console.warn(`Chưa gán file âm thanh cho: "${text}"`);
      return;
    }

    try {
      const player = createAudioPlayer(audioSource);
      player.play();
    } catch (error) {
      console.error("Lỗi phát âm thanh:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={name}
        classes={classes}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        navigation={navigation}
        route={route}
      />

      {/* Banner Kỹ năng - ĐÃ SỬA */}
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={require("@/assets/images/banner-chuong-trinh.png")}
          style={styles.bannerBackground}
          resizeMode="contain"
        >
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>KỸ NĂNG</Text>
            <Text style={styles.bannerSubtitle}>{tenKyNang}</Text>
          </View>
        </ImageBackground>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1E40AF', textAlign: 'center', marginVertical: 8 }}>
          Bài học: {tenBaiHoc}
        </Text>
        {/* ===== 1. Chữ i và k ===== */}
        <View style={styles.letterRow}>
          {["i", "k"].map((letter) => (
            <Pressable
              key={letter}
              style={({ pressed }) => [
                styles.letterItem,
                pressed && styles.pressed,
              ]}
              onPress={() => playSound(letter)}
            >
              <Text style={styles.letterText}>{letter}</Text>
              <Text style={styles.speaker}>🔊</Text>
            </Pressable>
          ))}
        </View>

        {/* ===== 2. Bảng k i ki nằm ngang ===== */}
        <View style={styles.horizontalTableRow}>
          {/* Nhóm 1: bảng ki + loa */}
          <Pressable
            style={({ pressed }) => [
              styles.horizontalGroup,
              pressed && styles.pressed,
            ]}
            onPress={() => playSound("ki")}
          >
            <View style={styles.horizontalBox}>
              <View style={styles.hCell}>
                <Text style={styles.hLetter}>k</Text>
              </View>
              <View style={styles.hCell}>
                <Text style={styles.hLetter}>i</Text>
              </View>
              <View style={[styles.hCell, styles.hLast]}>
                <Text style={styles.hLetter}>ki</Text>
              </View>
            </View>
            <Text style={styles.speaker}>🔊</Text>
          </Pressable>

          {/* Nhóm 2: bảng kì + loa */}
          <Pressable
            style={({ pressed }) => [
              styles.horizontalGroup,
              pressed && styles.pressed,
            ]}
            onPress={() => playSound("kì")}
          >
            <View style={styles.horizontalBox}>
              <View style={styles.hCell}>
                <Text style={styles.hLetter}>k</Text>
              </View>
              <View style={styles.hCell}>
                <Text style={styles.hLetter}>i</Text>
              </View>
              <View style={[styles.hCell, styles.hLast]}>
                <Text style={styles.hLetter}>kì</Text>
              </View>
            </View>
            <Text style={styles.speaker}>🔊</Text>
          </Pressable>
        </View>
        {/* ===== 3. Bảng 2 hàng × 3 cột nguyên âm ===== */}
        <View style={styles.grid3}>
          {[
            ["kí", "kỉ", "kĩ"],
            ["kè", "kẻ", "kệ"], // hàng 2 (có thể thay bằng kỉ, kĩ nếu cần)
          ].map((row, rowIndex) => (
            <View key={rowIndex} style={styles.gridRow}>
              {row.map((word) => (
                <Pressable
                  key={word + rowIndex}
                  style={({ pressed }) => [
                    styles.gridCell,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => playSound(word)}
                >
                  <Text style={styles.gridText}>{word}</Text>
                  <Text style={styles.smallSpeaker}>🔊</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>

        {/* ===== 4. Hình ảnh nằm ngang ===== */}
        <View style={styles.imageGrid}>
          {/* Ô 1: bí đỏ */}
          <Pressable
            style={({ pressed }) => [
              styles.imageCard,
              pressed && styles.pressed,
            ]}
            onPress={() => playSound("bi_do")}
          >
            <Image
              source={require("@/assets/images/bi_do.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <Text style={styles.cardWord}>bí đỏ</Text>
            <Text style={styles.smallSpeaker}>🔊</Text>
          </Pressable>

          {/* Ô 2: kì đà */}
          <Pressable
            style={({ pressed }) => [
              styles.imageCard,
              pressed && styles.pressed,
            ]}
            onPress={() => playSound("ki_da")}
          >
            <Image
              source={require("@/assets/images/ki_da.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <Text style={styles.cardWord}>kì đà</Text>
            <Text style={styles.smallSpeaker}>🔊</Text>
          </Pressable>
        </View>

        {/* ===== 5. Câu luyện tập ===== */}
        <View style={styles.sentenceSection}>
          <Pressable
            style={({ pressed }) => [
              styles.sentenceBox,
              pressed && styles.pressed,
            ]}
            onPress={() => playSound("nam_ve_ki_da")}
          >
            <Text style={styles.sentenceText}>Nam vẽ kì đà.</Text>
            <Text style={styles.speaker}>🔊</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.sentenceBox,
              pressed && styles.pressed,
            ]}
            onPress={() => playSound("kida_keda")}
          >
            <Text style={styles.sentenceText}>Kì đà bò ở kẽ đá.</Text>
            <Text style={styles.speaker}>🔊</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
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
    width: "90%", // Đảm bảo text có đủ chiều ngang để hiển thị trên 1 dòng
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
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  /* Chữ i k */
  letterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
    top: -10,
  },
  letterItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 8,
  },
  letterText: {
    fontSize: 48,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  speaker: {
    fontSize: 24,
  },
  smallSpeaker: {
    fontSize: 18,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.97 }],
  },

  /* Bảng ngang k i ki */
  horizontalTableRow: {
    flexDirection: "row",
    justifyContent: "space-around", // quan trọng
    alignItems: "center",
    marginBottom: 28,
    paddingHorizontal: 4,
    top: -20,
  },

  horizontalGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 10,
  },

  horizontalBox: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: "#94A3B8",
    borderRadius: 8,
    overflow: "hidden",
  },

  hCell: {
    width: 38, // giảm nhẹ để vừa màn hình nhỏ
    height: 40,
    borderRightWidth: 1,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },

  hLast: {
    borderRightWidth: 0,
    backgroundColor: "#FFFFFF",
  },

  hLetter: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1E40AF",
  },
  /* Lưới 2 hàng × 3 cột */
  grid3: {
    marginBottom: 28,
    top: -20,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  gridCell: {
    width: (width - 48) / 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
  },
  gridText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1E3A8A",
  },

  /* Hình ảnh 1 hàng × 2 cột */
  imageGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
    top: -20,
  },
  imageCard: {
    width: (width - 48) / 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  cardImage: {
    width: 55,
    height: 55,
  },
  cardWord: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A8A",
  },

  /* Câu luyện tập */
  sentenceSection: {
    gap: 14,
  },
  sentenceBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#64748B",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    top: -20,
    backgroundColor: "#F8FAFC",
  },
  sentenceText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1E3A8A",
  },
});
