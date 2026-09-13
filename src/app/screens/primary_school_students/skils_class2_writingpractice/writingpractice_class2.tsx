//Danh mục đọc

import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Footer from "../Footer";
import Header, { ClassInfo } from "../Header";

const { width } = Dimensions.get("window");

interface Feature {
  id_ky_nang: number;
  ma_ky_nang: string;
  ten_ky_nang: string;
  mo_ta: string;
  icon: string;
  lop: number;
  url_link?: string;
  ten_chuong_trinh?: string;
  bgColor?: string;
}

const BG_COLORS = ["#E0F7FA", "#FFF3E0", "#E8F5E9", "#E0F2FE", "#CCCCFF"];

export default function PracticeReadingClass1Screen({ navigation, route }: any) {
  // Lấy params từ React Navigation route (nhất quán với createNativeStackNavigator)
  const [name, setName] = useState<string>(route?.params?.ho_ten || "");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [classes, setClasses] = useState<ClassInfo[]>([]);

  // Ưu tiên lấy tên kỹ năng từ params, fallback "Tập Đọc"
  const [tenKyNang, setTenKyNang] = useState<string>(
    route?.params?.ten_ky_nang || "Tập Đọc",
  );

  useEffect(() => {
    if (route?.params?.ho_ten) setName(route.params.ho_ten);
    if (route?.params?.ten_ky_nang) setTenKyNang(route.params.ten_ky_nang);
  }, [route?.params?.ho_ten, route?.params?.ten_ky_nang]);

  const handleNavigate = (screenName?: string, tenKyNang?: string) => {
    if (!screenName) {
      Alert.alert(
        "Thông báo",
        `Tính năng "${tenKyNang}" đang được phát triển!`,
      );
      return;
    }

    navigation.navigate(screenName, {
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
        route={navigation}
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

      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Grid 4 hình */}
        <View style={styles.imageGrid}>
          <View style={styles.imageRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate("skils_writingpractice_class2detail" as never)
              }
            >
              <Image
                source={require("@/assets/images/lop2/em_lonlen.png")}
                style={styles.imageBox}
                resizeMode="cover"
              />
            </TouchableOpacity>
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
    backgroundColor: "#F8F9FA",
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
    fontSize: 14,
    color: "#2B6CB0",
    marginTop: 2,
    textTransform: "uppercase",
  },

  mainContent: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E40AF",
    marginBottom: 16,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  imageGrid: {
    marginVertical: 12,
    gap: 12, // khoảng cách giữa 2 hàng
  },
  imageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12, // khoảng cách giữa 2 ảnh trong 1 hàng
  },
  imageBox: {
    width: (width - 16 * 2 - 12) / 2, // tính đúng 2 cột
    height: (width - 16 * 2 - 12) / 2, // vuông
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
});
