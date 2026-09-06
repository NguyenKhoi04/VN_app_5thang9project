import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Footer from "./Footer";
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

const HomePrimary = ({ navigation, route }: any) => {
  const [name, setName] = useState<string>(route?.params?.ho_ten || "");

  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [ten_chuong_trinh, setProgramName] = useState<string>("");
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    if (route?.params?.ho_ten) {
      setName(route.params.ho_ten);
    }
  }, [route?.params?.ho_ten]);

  // 1. Lấy danh sách lớp khi mở màn hình
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.GET_CLASSES);
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setClasses(data);
          // Mặc định chọn lớp đầu tiên
          setSelectedClass(`Lớp ${data[0].lop}`);
        } else {
          setClasses([]);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách lớp:", error);
      }
    };

    fetchClasses();
  }, []);

  // 2. Tự động lấy danh sách kỹ năng & chương trình khi selectedClass thay đổi
  useEffect(() => {
    if (!selectedClass) return;

    const lopNumber = selectedClass.replace("Lớp ", "").trim();

    const fetchSkillsData = async () => {
      try {
        // Dùng endpoint GET_SKILLS_BY_CLASS
        const response = await fetch(
          `${API_ENDPOINTS.GET_SKILLS_BY_CLASS}?lop=${lopNumber}`,
        );
        const data: Feature[] = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          // Lấy tên chương trình của lớp đó gán vào banner
          setProgramName(data[0]?.ten_chuong_trinh || "");
          const formattedFeatures = data.map((item, index) => ({
            ...item,
            bgColor: BG_COLORS[index % BG_COLORS.length],
          }));
          setFeatures(formattedFeatures);
        } else {
          setProgramName("");
          setFeatures([]);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách kỹ năng:", error);
      }
    };

    fetchSkillsData();
  }, [selectedClass]);

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

  const handleNavigate = (url?: string, tenKyNang?: string) => {
    if (!url) {
      Alert.alert(
        "Thông báo",
        `Tính năng "${tenKyNang}" đang được phát triển!`,
      );
      return;
    }

    // Dùng navigation prop từ React Navigation Stack
    navigation.navigate(url, {
      ho_ten: name,
      ten_ky_nang: tenKyNang || "",
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
              {ten_chuong_trinh || "Chưa có chương trình"}
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* NÚT CHỌN LỚP (Gắn vào đây để người dùng bấm chọn) */}
      {/* <View style={styles.classContainer}>
        <View style={styles.classGrid}>
          {classes.map((cls, index) => {
            const classLabel = `Lớp ${cls.lop}`;
            const isActive = selectedClass === classLabel;

            return (
              <TouchableOpacity
                key={cls.lop ?? index}
                style={[
                  styles.classButton,
                  isActive && styles.classButtonActive,
                ]}
                onPress={() => setSelectedClass(classLabel)}
              >
                <Text
                  style={[
                    styles.classText,
                    isActive && styles.classTextActive,
                  ]}
                >
                  {classLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View> */}

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

  /* Grid cải tiến - đẹp và vừa màn hình */
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

  /* Banner Chương trình */
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
