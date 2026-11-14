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
  const [name, setName] = useState<string>(
    route?.params?.ho_ten || route?.params?.name || "Mai Thanh An"
  );

  const [classes, setClasses] = useState<ClassInfo[]>([
    { lop: 1 },
    { lop: 2 },
    { lop: 3 },
  ]);
  const [selectedClass, setSelectedClass] = useState<string>(
    route?.params?.selectedClass || "Lớp 1"
  );
  const [ten_chuong_trinh, setProgramName] = useState<string>(
    route?.params?.ten_chuong_trinh || ""
  );
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    const incomingName = route?.params?.ho_ten || route?.params?.name;
    if (incomingName) {
      setName(incomingName);
    }
    if (route?.params?.selectedClass) {
      setSelectedClass(route.params.selectedClass);
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

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Lỗi HTTP ${response.status} khi lấy danh sách lớp:`, errorText);
          return;
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setClasses(data);
          const firstLop = data[0].lop ?? 1;
          setSelectedClass(`Lớp ${firstLop}`);
        } else {
          setClasses([{ lop: 1 }, { lop: 2 }, { lop: 3 }]);
          setSelectedClass("Lớp 1");
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
      const url = `${API_ENDPOINTS.GET_SKILLS_BY_CLASS}?lop=${lopNumber}`;
      console.log("👉 Đang gọi API kỹ năng:", url);

      try {
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        // Đọc dữ liệu dạng text để kiểm tra xem server trả về HTML hay JSON
        const rawText = await response.text();

        if (!response.ok) {
          console.error(
            `❌ Server báo lỗi HTTP ${response.status} khi lấy kỹ năng:`,
            rawText.substring(0, 300) // In ra 300 ký tự đầu để xem lỗi HTML
          );
          setProgramName("");
          setFeatures([]);
          return;
        }

        // Kiểm tra nếu nội dung bắt đầu bằng thẻ HTML '<'
        if (rawText.trim().startsWith("<")) {
          console.error(
            "❌ Server trả về trang HTML thay vì JSON. Kiểm tra lại đường dẫn API:",
            rawText.substring(0, 300)
          );
          return;
        }

        const data: Feature[] = JSON.parse(rawText);

        if (Array.isArray(data) && data.length > 0) {
          let programTitle = data[0]?.ten_chuong_trinh || "";
          if (!programTitle) {
            try {
              const resProg = await fetch(`${API_ENDPOINTS.GET_PROGRAM_NAME}?lop=${lopNumber}`);
              if (resProg.ok) {
                const progData = await resProg.json();
                if (Array.isArray(progData) && progData.length > 0) {
                  programTitle = progData[0]?.ten_chuong_trinh || "";
                }
              }
            } catch (_) {}
          }
          setProgramName(programTitle);
          const formattedFeatures = data.map((item, index) => ({
            ...item,
            bgColor: BG_COLORS[index % BG_COLORS.length],
          }));
          setFeatures(formattedFeatures);
        } else {
          // Nếu chưa có kỹ năng, vẫn thử lấy tên chương trình theo lớp
          try {
            const resProg = await fetch(`${API_ENDPOINTS.GET_PROGRAM_NAME}?lop=${lopNumber}`);
            if (resProg.ok) {
              const progData = await resProg.json();
              if (Array.isArray(progData) && progData.length > 0) {
                setProgramName(progData[0]?.ten_chuong_trinh || "");
              } else {
                setProgramName("");
              }
            }
          } catch (_) {
            setProgramName("");
          }
          setFeatures([]);
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách kỹ năng:", error);
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
              {ten_chuong_trinh || "Chưa có chương trình"}
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
