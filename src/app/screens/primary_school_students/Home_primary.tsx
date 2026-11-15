import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// 1. Sửa SafeAreaView từ react-native-safe-area-context để hết Warning
import { SafeAreaView } from "react-native-safe-area-context";

import Footer from "../Footer";
import Header from "./Header";

import { API_ENDPOINTS } from "@/config/api";

const { width } = Dimensions.get("window");

interface ClassInfo {
  lop: number | string;
  ten_chuong_trinh?: string;
}

interface Feature {
  id_ky_nang: number;
  ma_ky_nang: string;
  ten_ky_nang: string;
  mo_ta: string;
  icon: string;
  lop: number;
  ten_chuong_trinh?: string;
  bgColor?: string;
  url_link?: string;
}

const BG_COLORS = ["#E0F7FA", "#FFF3E0", "#E8F5E9", "#E0F2FE", "#CCCCFF"];

// Dữ liệu chuẩn từ bảng chuong_trinh (hình 3)
const DEFAULT_PROGRAMS: Record<number, string> = {
  1: "Tiếng Việt lớp 1 - Kết nối tri thức với cuộc sống",
  2: "Tiếng Việt lớp 2 - Kết nối tri thức với cuộc sống",
  3: "Tiếng Việt lớp 3 - Kết nối tri thức với cuộc sống",
};

// Dữ liệu chuẩn từ bảng ky_nang (hình 2)
const DEFAULT_SKILLS_BY_CLASS: Record<number, Feature[]> = {
  1: [
    {
      id_ky_nang: 6,
      ma_ky_nang: "hsdoc1",
      ten_ky_nang: "Tập đọc lớp 1",
      mo_ta: "Đọc và hiểu nghĩa",
      icon: "📖",
      lop: 1,
      ten_chuong_trinh: "Tiếng Việt lớp 1 - Kết nối tri thức với cuộc sống",
      url_link: "PracticeReadingClass1",
      bgColor: "#E0F7FA",
    },
    {
      id_ky_nang: 7,
      ma_ky_nang: "hsviet1",
      ten_ky_nang: "Luyện viết lớp 1",
      mo_ta: "Viết chữ cái, viết từ, câu",
      icon: "✍️",
      lop: 1,
      ten_chuong_trinh: "Tiếng Việt lớp 1 - Kết nối tri thức với cuộc sống",
      url_link: "WritingPracticeClass1",
      bgColor: "#FFF3E0",
    },
    {
      id_ky_nang: 8,
      ma_ky_nang: "hscta1",
      ten_ky_nang: "Chính tả lớp 1",
      mo_ta: "Nghe và viết đúng chính tả",
      icon: "📝",
      lop: 1,
      ten_chuong_trinh: "Tiếng Việt lớp 1 - Kết nối tri thức với cuộc sống",
      url_link: "SkillsSpellingClass1Students",
      bgColor: "#E8F5E9",
    },
    {
      id_ky_nang: 9,
      ma_ky_nang: "hsontap1",
      ten_ky_nang: "Ôn tập lớp 1",
      mo_ta: "Ôn lại kiến thức đã học lớp 1",
      icon: "📚",
      lop: 1,
      ten_chuong_trinh: "Tiếng Việt lớp 1 - Kết nối tri thức với cuộc sống",
      url_link: "",
      bgColor: "#E0F2FE",
    },
  ],
  2: [
    {
      id_ky_nang: 10,
      ma_ky_nang: "hsdoc2",
      ten_ky_nang: "Tập đọc lớp 2",
      mo_ta: "Đọc và hiểu nghĩa",
      icon: "📖",
      lop: 2,
      ten_chuong_trinh: "Tiếng Việt lớp 2 - Kết nối tri thức với cuộc sống",
      url_link: "PracticeReadingClass2",
      bgColor: "#E0F7FA",
    },
    {
      id_ky_nang: 11,
      ma_ky_nang: "hsviet2",
      ten_ky_nang: "Luyện viết lớp 2",
      mo_ta: "Viết chữ cái, viết từ, câu",
      icon: "✍️",
      lop: 2,
      ten_chuong_trinh: "Tiếng Việt lớp 2 - Kết nối tri thức với cuộc sống",
      url_link: "WritingPracticeClass2",
      bgColor: "#FFF3E0",
    },
    {
      id_ky_nang: 12,
      ma_ky_nang: "hscta2",
      ten_ky_nang: "Chính tả lớp 2",
      mo_ta: "Nghe và viết đúng chính tả",
      icon: "📝",
      lop: 2,
      ten_chuong_trinh: "Tiếng Việt lớp 2 - Kết nối tri thức với cuộc sống",
      url_link: "SkillsSpellingClass2Students",
      bgColor: "#E8F5E9",
    },
    {
      id_ky_nang: 13,
      ma_ky_nang: "hsontap2",
      ten_ky_nang: "Ôn tập lớp 2",
      mo_ta: "Ôn lại kiến thức đã học lớp 2",
      icon: "📚",
      lop: 2,
      ten_chuong_trinh: "Tiếng Việt lớp 2 - Kết nối tri thức với cuộc sống",
      url_link: "",
      bgColor: "#E0F2FE",
    },
  ],
  3: [
    {
      id_ky_nang: 14,
      ma_ky_nang: "hsdoc3",
      ten_ky_nang: "Tập đọc lớp 3",
      mo_ta: "Đọc và hiểu nghĩa",
      icon: "📖",
      lop: 3,
      ten_chuong_trinh: "Tiếng Việt lớp 3 - Kết nối tri thức với cuộc sống",
      url_link: "PracticeReadingClass3",
      bgColor: "#E0F7FA",
    },
    {
      id_ky_nang: 15,
      ma_ky_nang: "hsviet3",
      ten_ky_nang: "Luyện viết lớp 3",
      mo_ta: "Viết chữ, từ, câu và đoạn văn ngắn",
      icon: "✍️",
      lop: 3,
      ten_chuong_trinh: "Tiếng Việt lớp 3 - Kết nối tri thức với cuộc sống",
      url_link: "WritingPracticeClass3",
      bgColor: "#FFF3E0",
    },
    {
      id_ky_nang: 16,
      ma_ky_nang: "hscta3",
      ten_ky_nang: "Chính tả lớp 3",
      mo_ta: "Nghe và viết đúng chính tả",
      icon: "📝",
      lop: 3,
      ten_chuong_trinh: "Tiếng Việt lớp 3 - Kết nối tri thức với cuộc sống",
      url_link: "SkillsSpellingClass3Students",
      bgColor: "#E8F5E9",
    },
    {
      id_ky_nang: 17,
      ma_ky_nang: "hsontap3",
      ten_ky_nang: "Ôn tập lớp 3",
      mo_ta: "Ôn lại kiến thức đã học lớp 3",
      icon: "📚",
      lop: 3,
      ten_chuong_trinh: "Tiếng Việt lớp 3 - Kết nối tri thức với cuộc sống",
      url_link: "",
      bgColor: "#E0F2FE",
    },
  ],
};

const getLopNumber = (clsStr?: string | number): number => {
  if (typeof clsStr === "number") return clsStr;
  if (!clsStr) return 1;
  const num = parseInt(String(clsStr).replace(/\D/g, ""), 10);
  return !isNaN(num) && num > 0 ? num : 1;
};

const HomePrimary = ({ navigation, route }: any) => {
  const initialLop = getLopNumber(route?.params?.selectedClass);
  const [name, setName] = useState<string>(
    route?.params?.ho_ten || route?.params?.name || "Mai Thanh An"
  );

  const [classes, setClasses] = useState<ClassInfo[]>([
    { lop: 1 },
    { lop: 2 },
    { lop: 3 },
  ]);
  const [selectedClass, setSelectedClass] = useState<string>(`Lớp ${initialLop}`);
  const [ten_chuong_trinh, setProgramName] = useState<string>(
    route?.params?.ten_chuong_trinh || DEFAULT_PROGRAMS[initialLop]
  );
  const [features, setFeatures] = useState<Feature[]>(
    DEFAULT_SKILLS_BY_CLASS[initialLop] || DEFAULT_SKILLS_BY_CLASS[1]
  );

  useEffect(() => {
    const incomingName = route?.params?.ho_ten || route?.params?.name;
    if (incomingName && !incomingName.includes("undefined")) {
      setName(incomingName);
    }
    if (route?.params?.selectedClass && !route.params.selectedClass.includes("undefined")) {
      const num = getLopNumber(route.params.selectedClass);
      setSelectedClass(`Lớp ${num}`);
    }
    if (route?.params?.classes && route.params.classes.length > 0) {
      setClasses(route.params.classes);
    }
  }, [route?.params]);

  // 1. Lấy danh sách lớp khi mở màn hình
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.GET_CLASSES, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) return;

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const parsedClasses = data.map((item: any, idx: number) => ({
            lop: getLopNumber(item.lop ?? item ?? idx + 1),
          }));
          setClasses(parsedClasses);
        }
      } catch (error) {
        console.log("Dùng danh sách lớp mặc định [1, 2, 3]");
      }
    };

    fetchClasses();
  }, []);

  // 2. Tự động lấy danh sách kỹ năng & chương trình khi selectedClass thay đổi
  useEffect(() => {
    const lopNumber = getLopNumber(selectedClass);

    // Cập nhật ngay lập tức giao diện với dữ liệu chuẩn theo hình 2 & 3
    setProgramName(DEFAULT_PROGRAMS[lopNumber] || `Tiếng Việt lớp ${lopNumber} - Kết nối tri thức với cuộc sống`);
    setFeatures(DEFAULT_SKILLS_BY_CLASS[lopNumber] || DEFAULT_SKILLS_BY_CLASS[1]);

    const fetchSkillsData = async () => {
      const url = `${API_ENDPOINTS.GET_SKILLS_BY_CLASS}?lop=${lopNumber}`;
      console.log("👉 Đang gọi API kỹ năng:", url);

      try {
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) return;

        const rawText = await response.text();
        if (rawText.trim().startsWith("<")) return;

        const data: Feature[] = JSON.parse(rawText);

        if (Array.isArray(data) && data.length > 0) {
          const programTitle = data[0]?.ten_chuong_trinh || DEFAULT_PROGRAMS[lopNumber];
          setProgramName(programTitle);
          const formattedFeatures = data.map((item, index) => ({
            ...item,
            bgColor: BG_COLORS[index % BG_COLORS.length],
          }));
          setFeatures(formattedFeatures);
        }
      } catch (error) {
        console.log("Sử dụng dữ liệu offline lớp:", lopNumber);
      }
    };

    fetchSkillsData();
  }, [selectedClass]);

  const handleNavigate = (url?: string, tenKyNang?: string) => {
    if (!url) {
      Alert.alert(
        "Thông báo",
        `Tính năng "${tenKyNang}" đang được phát triển!`
      );
      return;
    }

    navigation.navigate(url, {
      ho_ten: name,
      name: name,
      ten_ky_nang: tenKyNang || "",
      selectedClass: selectedClass,
      classes: classes,
      ten_chuong_trinh: ten_chuong_trinh,
      user: route?.params?.user || null,
      id_nguoi_dung: route?.params?.user?.id_nguoi_dung || route?.params?.user?.id || 1,
    });
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

      {/* Banner Chương trình */}
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={require("../../../../assets/images/banner-chuong-trinh.png")}
          style={styles.bannerBackground}
          resizeMode="contain"
        >
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>CHƯƠNG TRÌNH</Text>
            <Text style={styles.bannerSubtitle}>
              {ten_chuong_trinh || DEFAULT_PROGRAMS[getLopNumber(selectedClass)]}
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* Danh sách kỹ năng của lớp được chọn */}
      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>
          Các kỹ năng {selectedClass} hôm nay ✨
        </Text>

        <View style={styles.featuresGrid}>
          {features.length > 0 ? (
            features.map((feature) => (
              <TouchableOpacity
                key={feature.id_ky_nang}
                style={[
                  styles.featureCard,
                  { backgroundColor: feature.bgColor },
                ]}
                onPress={() =>
                  handleNavigate(feature.url_link, feature.ten_ky_nang)
                }
                activeOpacity={0.8}
              >
                <View style={styles.emojiContainer}>
                  <Text style={styles.featureEmoji}>
                    {feature.icon || "🌟"}
                  </Text>
                </View>
                <Text style={styles.featureTitle}>{feature.ten_ky_nang}</Text>
                <Text style={styles.featureDesc}>{feature.mo_ta}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ textAlign: "center", color: "#888", marginTop: 20 }}>
              {selectedClass} hiện chưa có kỹ năng nào.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFF" },

  header: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "white" },
  headerSubtitle: { fontSize: 15, color: "#BAE6FD", marginTop: 4 },
  classContainer: {
    backgroundColor: "white",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  classGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  classButton: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 30,
    backgroundColor: "#F1F5F9",
    minWidth: 75,
    alignItems: "center",
  },
  classButtonActive: {
    backgroundColor: "#2563EB",
  },
  classText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },
  classTextActive: {
    color: "white",
  },

  mainContent: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E40AF",
    marginBottom: 16,
  },

  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  featureCard: {
    width: (width - 56) / 2,
    aspectRatio: 1,
    borderRadius: 24,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  emojiContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
  },
  featureEmoji: { fontSize: 34 },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12.5,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 16,
  },

  bannerContainer: {
    alignItems: "center",
    marginHorizontal: 5,
    marginTop: 8,
    marginBottom: 5,
  },

  bannerBackground: {
    width: "100%",
    height: 85,
    justifyContent: "center",
    alignItems: "center",
  },

  bannerTextContainer: {
    alignItems: "center",
    marginTop: -25,
  },

  bannerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E53E3E",
    letterSpacing: 0.5,
  },

  bannerSubtitle: {
    fontSize: 12,
    color: "#2B6CB0",
    marginTop: 2,
  },
});

export default HomePrimary;

// Điều hướng bằng router của expo-router
// const handleNavigate = (url?: string, tenKyNang?: string) => {
//   if (url) {
//     router.push({
//       pathname: url as any,
//       params: {
//         ho_ten: name,
//         ten_ky_nang: tenKyNang || '',
//       },
//     });
//   } else {
//     Alert.alert('Thông báo', `Tính năng "${tenKyNang}" đang được phát triển!`);
//   }
// };
