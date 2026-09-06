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
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Footer from "../Footer";
import Header, { ClassInfo } from "../Header";

const { width } = Dimensions.get("window");

export default function PracticeReadingScreen() {
  // const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{
    ho_ten?: string;
    ten_ky_nang?: string;
  }>();

  const [name, setName] = useState(params.ho_ten || "");
  const [tenKyNang, setTenKyNang] = useState(params.ten_ky_nang || "Tập Đọc");
  const [tenBaiHoc] = useState("rạ  rế  rổ  sả  sẽ  sò");

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  useEffect(() => {
    if (params.ho_ten) setName(params.ho_ten);
    if (params.ten_ky_nang) setTenKyNang(params.ten_ky_nang);
  }, [params.ho_ten, params.ten_ky_nang]);

  // Map âm thanh (bạn cần chuẩn bị file tương ứng)
  const AUDIO_MAP: Record<string, any> = {
    r: require("../../../../../text-to-speech/speech_r.wav"),
    ra: require("../../../../../text-to-speech/speech_ra.wav"),
    rạ: require("../../../../../text-to-speech/speech_ra_nang.wav"),
    rế: require("../../../../../text-to-speech/speech_re_sac.wav"),
    rẻ: require("../../../../../text-to-speech/speech_re_hoi.wav"),
    rẽ: require("../../../../../text-to-speech/speech_re_nga.wav"),
    rổ: require("../../../../../text-to-speech/speech_ro_hoi.wav"),
    s: require("../../../../../text-to-speech/speech_s.wav"),
    sa: require("../../../../../text-to-speech/speech_sa.wav"),
    sả: require("../../../../../text-to-speech/speech_sa_hoi.wav"),
    sẽ: require("../../../../../text-to-speech/speech_se_nga.wav"),
    sẻ: require("../../../../../text-to-speech/speech_se_hoi.wav"),
    sổ: require("../../../../../text-to-speech/speech_so_hoi.wav"),
    sò: require("../../../../../text-to-speech/speech_so_huyen.wav"),
    ro_ra: require("../../../../../text-to-speech/speech_ro_ra.wav"),
    ca_ro: require("../../../../../text-to-speech/speech_ca_ro.wav"),
    su_su: require("../../../../../text-to-speech/speech_su_su.wav"),
    chu_so: require("../../../../../text-to-speech/speech_chu_so.wav"),
    oc_so: require("../../../../../text-to-speech/speech_oc_so.wav"),
    chim_se: require("../../../../../text-to-speech/speech_chim_se.wav"),
    bay_se: require("../../../../../text-to-speech/speech_bay_se.wav"),
    ga_casu: require("../../../../../text-to-speech/speech_ga_casu.wav"),
    cho_roca: require("../../../../../text-to-speech/speech_cho_roca.wav"),
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

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ===== 1. Chữ i và k ===== */}
        <View style={styles.letterRow}>
          {["r", "s"].map((letter) => (
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

        {/* ===== 2. Bảng r a ra nằm ngang ===== */}
        <View style={styles.horizontalTableRow}>
          {/* Nhóm 1: bảng ra + loa */}
          <Pressable
            style={({ pressed }) => [
              styles.horizontalGroup,
              pressed && styles.pressed,
            ]}
            onPress={() => playSound("ra")}
          >
            <View style={styles.horizontalBox}>
              <View style={styles.hCell}>
                <Text style={styles.hLetter}>r</Text>
              </View>
              <View style={styles.hCell}>
                <Text style={styles.hLetter}>a</Text>
              </View>
              <View style={[styles.hCell, styles.hLast]}>
                <Text style={styles.hLetter}>ra</Text>
              </View>
            </View>
            <Text style={styles.speaker}>🔊</Text>
          </Pressable>

          {/* Nhóm 2: bảng s e sẻ + loa */}
          <Pressable
            style={({ pressed }) => [
              styles.horizontalGroup,
              pressed && styles.pressed,
            ]}
            onPress={() => playSound("sẻ")}
          >
            <View style={styles.horizontalBox}>
              <View style={styles.hCell}>
                <Text style={styles.hLetter}>s</Text>
              </View>
              <View style={styles.hCell}>
                <Text style={styles.hLetter}>e</Text>
              </View>
              <View style={[styles.hCell, styles.hLast]}>
                <Text style={styles.hLetter}>sẻ</Text>
              </View>
            </View>
            <Text style={styles.speaker}>🔊</Text>
          </Pressable>
        </View>
        {/* ===== 3. Bảng 2 hàng × 3 cột nguyên âm ===== */}
        <View style={styles.grid3}>
          {[
            ["rạ", "rế", "rẻ", "rẽ", "rổ"], // hàng 1
            ["sa", "sả", "sẽ", "sổ", "sò"], // hàng 2 (có thể thay bằng kỉ, kĩ nếu cần)
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
          {/* Ô 1: rổ rá*/}
          <Pressable
            style={({ pressed }) => [
              styles.imageCard,
              pressed && styles.pressed,
            ]}
            onPress={() => playSound("ro_ra")}
          >
            <Image
              source={require("@/assets/images/ro_ra.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <Text style={styles.cardWord}>rổ rá</Text>
            <Text style={styles.smallSpeaker}>🔊</Text>
          </Pressable>

          {/* Ô 2: cá rô */}
          <Pressable
            style={({ pressed }) => [
              styles.imageCard,
              pressed && styles.pressed,
            ]}
            onPress={() => playSound("ca_ro")}
          >
            <Image
              source={require("@/assets/images/ca_ro.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <Text style={styles.cardWord}>cá rô</Text>
            <Text style={styles.smallSpeaker}>🔊</Text>
          </Pressable>
        </View>

        <View style={styles.imageGrid}>
          {/* Ô 3: su su */}
          <Pressable
            style={({ pressed }) => [
              styles.imageCard,
              pressed && styles.pressed,
            ]}
            onPress={() => playSound("su_su")}
          >
            <Image
              source={require("@/assets/images/su_su.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <Text style={styles.cardWord}>su su</Text>
            <Text style={styles.smallSpeaker}>🔊</Text>
          </Pressable>

          {/* Ô 4: chữ số */}
          <Pressable
            style={({ pressed }) => [
              styles.imageCard,
              pressed && styles.pressed,
            ]}
            onPress={() => playSound("chu_so")}
          >
            <Image
              source={require("@/assets/images/chu_so.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <Text style={styles.cardWord}>chữ số</Text>
            <Text style={styles.smallSpeaker}>🔊</Text>
          </Pressable>
        </View>

        <View style={styles.imageGrid}>
          {/* Ô 5: ốc sò */}
          <Pressable
            style={({ pressed }) => [
              styles.imageCard,
              pressed && styles.pressed,
            ]}
            onPress={() => playSound("oc_so")}
          >
            <Image
              source={require("@/assets/images/oc_so.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <Text style={styles.cardWord}>ốc sò</Text>
            <Text style={styles.smallSpeaker}>🔊</Text>
          </Pressable>

          {/* Ô 6: Chim sẻ */}
          <Pressable
            style={({ pressed }) => [
              styles.imageCard,
              pressed && styles.pressed,
            ]}
            onPress={() => playSound("chim_se")}
          >
            <Image
              source={require("@/assets/images/chim_se.png")}
              style={styles.cardImage}
              resizeMode="contain"
            />
            <Text style={styles.cardWord}>chim sẻ</Text>
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
            onPress={() => playSound("bay_se")}
          >
            <Text style={styles.sentenceText}>
              Bầy sẻ non ríu ra ríu rít bên mẹ.
            </Text>
            <Text style={styles.speaker}>🔊</Text>
          </Pressable>

          {/* ===== Câu luyện tập ===== */}
          <View style={styles.sentenceSection}>
            <View style={styles.sentenceBox}>
              {/* Câu 1 + loa */}
              <Pressable
                style={({ pressed }) => [
                  styles.sentenceLine,
                  pressed && styles.pressed,
                ]}
                onPress={() => playSound("ga_casu")}
              >
                {/* <Text style={styles.speaker}>🔊</Text>  */}
                <Text style={styles.sentenceText}>
                  Chợ có gà ri, cá rô, su su.
                </Text>
              </Pressable>

              {/* Câu 2 + loa */}
              <Pressable
                style={({ pressed }) => [
                  styles.sentenceLine,
                  pressed && styles.pressed,
                ]}
                onPress={() => playSound("cho_roca")}
              >
                <Text style={styles.sentenceText}>Chợ có cả rổ rá.</Text>
                {/* <Text style={styles.speaker}>🔊</Text> */}
              </Pressable>
            </View>
          </View>
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
    fontSize: 14,
    marginLeft: 4,
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
  /* Lưới 2 hàng × 5 cột */
  grid3: {
    marginBottom: 28,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  gridCell: {
    width: (width - 48) / 5,
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
    gap: 10,
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
    backgroundColor: "#F8FAFC",
  },
  sentenceText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E3A8A",
  },
  sentenceLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
