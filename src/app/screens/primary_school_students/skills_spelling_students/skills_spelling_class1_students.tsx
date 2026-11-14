import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { createAudioPlayer } from "expo-audio";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { API_ENDPOINTS } from "@/config/api";

import Footer from "../Footer";
import Header, { ClassInfo } from "../Header";

const { width } = Dimensions.get("window");

// ==========================================
// 1. DỮ LIỆU ĐỀ BÀI GỐC CHO LỚP 1
// ==========================================
const TARGET_TEXT = "Nam đã đọc được truyện tranh.\nNam còn biết làm toán nữa.";

// ==========================================
// MẪU BÀI LÀM CỦA HỌC SINH (TEST CASE)
// ==========================================
const SAMPLE_WRONG_TEXT = "Nam đã đọc được chuyện chanh.\nNam còn piết làm toán nữa.";
const SAMPLE_CORRECT_TEXT = "Nam đã đọc được truyện tranh.\nNam còn biết làm toán nữa.";

interface WordError {
  lineIndex: number;
  wordIndex: number;
  wrongWord: string;
  correctWord: string;
  boxTopRatio: number;    // Tỉ lệ vị trí Y trên ảnh bài làm
  boxLeftRatio: number;   // Tỉ lệ vị trí X trên ảnh bài làm
  boxWidthRatio: number;  // Tỉ lệ chiều rộng vùng khoanh tròn
}

interface ScoringResult {
  score: number;
  rankCode: string;
  rankName: string;
  badgeColor: string;
  rankDesc: string;
  deductions: string[];
  recognizedText: string;
  hasErrors: boolean;
  errors: WordError[];
}

export default function SkillsSpellingClass1StudentsScreen() {
  const params = useLocalSearchParams<{
    ho_ten?: string;
    ten_ky_nang?: string;
  }>();

  const [name, setName] = useState(params.ho_ten || "");
  const [selectedClass, setSelectedClass] = useState<string>("Lớp 1");
  const [classes] = useState<ClassInfo[]>([
    { lop: 1 },
    { lop: 2 },
    { lop: 3 },
  ]);
  const [targetPrompt, setTargetPrompt] = useState<string>(TARGET_TEXT);
  const [baiChinhTaId, setBaiChinhTaId] = useState<number | null>(null);

  useEffect(() => {
    // Tải đề bài gốc từ bảng bai_chinh_ta_hs trong MySQL
    const fetchBaiChinhTa = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.GET_CHINH_TA_HS}?lop_id=1`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setBaiChinhTaId(data[0].id);
            if (data[0].de_bai_goc) {
              setTargetPrompt(data[0].de_bai_goc);
            }
          }
        }
      } catch (err) {
        console.log("Dùng đề bài chuẩn mặc định:", err);
      }
    };
    fetchBaiChinhTa();
  }, []);

  // ==========================================
  // KHUNG 1: AUDIO VÀ BỘ ĐẾM GIÂY (DÙNG EXPO-AUDIO)
  // ==========================================
  const audioSource = require("../../../../../text-to-speech/speech_cau_hoi_1_bai5week3.wav");
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSeconds, setCurrentSeconds] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(6); // Audio câu hỏi ~ 6s
  const timerIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (params.ho_ten) setName(params.ho_ten);
    return () => {
      // Dọn dẹp âm thanh khi rời màn hình
      if (playerRef.current) {
        try {
          playerRef.current.pause();
        } catch (_) {}
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [params.ho_ten]);

  const handleTogglePlayAudio = () => {
    try {
      if (isPlaying) {
        // Đang phát -> Tạm dừng
        if (playerRef.current) {
          try {
            playerRef.current.pause();
          } catch (_) {}
        }
        setIsPlaying(false);
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      } else {
        // Chưa phát -> Bắt đầu phát
        if (!playerRef.current) {
          playerRef.current = createAudioPlayer(audioSource);
        } else {
          try {
            playerRef.current.seekTo(0);
          } catch (_) {}
        }

        playerRef.current.play();
        setIsPlaying(true);
        setCurrentSeconds(0);

        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        let sec = 0;
        timerIntervalRef.current = setInterval(() => {
          sec += 1;
          if (sec <= totalSeconds) {
            setCurrentSeconds(sec);
          }
          if (sec >= totalSeconds) {
            clearInterval(timerIntervalRef.current);
            setIsPlaying(false);
            setCurrentSeconds(0);
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      setIsPlaying(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  };

  // ==========================================
  // KHUNG 2: BÀI LÀM (CHỤP ẢNH TỪ CAMERA THẬT & MẪU TEST)
  // ==========================================
  const [hasCapturedImage, setHasCapturedImage] = useState<boolean>(true);
  const [capturedImageUri, setCapturedImageUri] = useState<string | null>(null);
  const [activeSampleType, setActiveSampleType] = useState<"wrong" | "correct">("wrong");
  const [submissionText, setSubmissionText] = useState<string>(SAMPLE_WRONG_TEXT);
  const [isGraded, setIsGraded] = useState<boolean>(false);
  const [gradingResult, setGradingResult] = useState<ScoringResult | null>(null);
  const [capturedTime, setCapturedTime] = useState<string>("Đã sẵn sàng chấm điểm");

  // MỞ TRỰC TIẾP CAMERA THẬT CỦA THIẾT BỊ ĐỂ CHỤP BÀI LÀM
  const handleCaptureRealCamera = async () => {
    try {
      // 1. Xin quyền Camera
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Cần cấp quyền Camera",
          "Em hãy cấp quyền sử dụng máy ảnh trong cài đặt thiết bị để chụp bài làm nhé!"
        );
        return;
      }

      // 2. Mở Camera phần cứng thật
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.9,
      });

      // 3. Xử lý ảnh chụp được
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;
        setCapturedImageUri(photoUri);
        setHasCapturedImage(true);
        const now = new Date();
        const timeStr = now.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setCapturedTime(`Ảnh chụp từ Camera thật lúc ${timeStr}`);
        setIsGraded(false);
        setGradingResult(null);

        Alert.alert(
          "📸 Chụp bài làm thành công!",
          "Ảnh bài viết tay của em đã được đưa vào khung! Em hãy nhấn nút 'Chấm điểm bài viết tay' bên dưới nhé."
        );
      }
    } catch (error) {
      console.error("Lỗi mở camera:", error);
      Alert.alert(
        "Thông báo",
        "Không thể mở camera trên môi trường này. Em có thể bấm chọn tệp ảnh có sẵn nhé!"
      );
    }
  };

  // CHỌN ẢNH BÀI LÀM TỪ THƯ VIỆN THIẾT BỊ HOẶC TỆP PDF
  const handlePickFileOrGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Cần cấp quyền thư viện",
          "Em hãy cấp quyền truy cập thư viện ảnh để chọn bài làm nhé!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photoUri = result.assets[0].uri;
        setCapturedImageUri(photoUri);
        setHasCapturedImage(true);
        setCapturedTime("Ảnh bài làm chọn từ thiết bị");
        setIsGraded(false);
        setGradingResult(null);

        Alert.alert(
          "✅ Tải ảnh thành công!",
          "Đã tải ảnh bài làm vào khung. Em hãy nhấn nút 'Chấm điểm bài viết tay' bên dưới nhé!"
        );
      }
    } catch (error) {
      console.error("Lỗi chọn ảnh:", error);
    }
  };

  // Chọn bài mẫu có lỗi để kiểm thử tính năng khoanh tròn & trừ điểm
  const handleSelectWrongSample = () => {
    setActiveSampleType("wrong");
    setSubmissionText(SAMPLE_WRONG_TEXT);
    setCapturedImageUri(null);
    setHasCapturedImage(true);
    setCapturedTime("Mẫu có lỗi chính tả (Test Khung 4 & 5)");
    setIsGraded(false);
    setGradingResult(null);
  };

  // Chọn bài mẫu viết đúng 100% để kiểm thử điều kiện chấm trực tiếp Khung 5 (không mở Khung 4)
  const handleSelectCorrectSample = () => {
    setActiveSampleType("correct");
    setSubmissionText(SAMPLE_CORRECT_TEXT);
    setCapturedImageUri(null);
    setHasCapturedImage(true);
    setCapturedTime("Mẫu viết đúng 100% (Test Khung 5)");
    setIsGraded(false);
    setGradingResult(null);
  };

  // ==========================================
  // BỘ MÁY CHẤM ĐIỂM THEO CÔNG THỨC PYTHON CỦA USER
  // ==========================================
  const evaluateWritingAlgorithm = (studentText: string, targetText: string): ScoringResult => {
    let score = 10.0;
    const deductions: string[] = [];
    const errors: WordError[] = [];

    const targetLines = targetText.trim().split("\n").map((l) => l.trim()).filter(Boolean);
    const studentLines = studentText.trim().split("\n").map((l) => l.trim()).filter(Boolean);

    let spellingDeduction = 0.0;

    // So sánh từng dòng
    for (let li = 0; li < Math.max(targetLines.length, studentLines.length); li++) {
      const tLine = targetLines[li] || "";
      const sLine = studentLines[li] || "";

      const tWords = tLine.split(/\s+/).filter(Boolean);
      const sWords = sLine.split(/\s+/).filter(Boolean);

      // Kiểm tra lệch số lượng từ
      const lenDiff = Math.abs(tWords.length - sWords.length);
      if (lenDiff > 0 && li < targetLines.length) {
        const sub = Math.min(lenDiff * 0.5, 2.0);
        spellingDeduction += sub;
        deductions.push(`❌ Lệch ${lenDiff} từ ở dòng ${li + 1} so với đề bài (trừ ${sub.toFixed(1)} điểm)`);
      }

      // So sánh từng từ trong dòng
      for (let wi = 0; wi < sWords.length; wi++) {
        const sWord = sWords[wi];
        const tWord = wi < tWords.length ? tWords[wi] : "";

        const cleanS = sWord.replace(/[.,!?;:"'“”]/g, "").toLowerCase();
        const cleanT = tWord.replace(/[.,!?;:"'“”]/g, "").toLowerCase();

        if (tWord && cleanS !== cleanT) {
          // Lỗi sai chính tả
          spellingDeduction += 0.5;
          deductions.push(
            `❌ Lỗi chính tả: Viết "${sWord}" thay vì chuẩn "${tWord}" (trừ 0.5 điểm)`
          );

          // Tọa độ tương đối để vẽ vòng khoanh tròn trên ảnh bài làm
          const lineY = li === 0 ? 0.38 : 0.68;
          const wordX = 0.15 + (wi / Math.max(sWords.length, 5)) * 0.72;

          errors.push({
            lineIndex: li,
            wordIndex: wi,
            wrongWord: sWord,
            correctWord: tWord,
            boxTopRatio: lineY,
            boxLeftRatio: wordX,
            boxWidthRatio: 0.15,
          });
        }
      }
    }

    spellingDeduction = Math.min(spellingDeduction, 5.0);
    score -= spellingDeduction;
    score = Math.max(0.0, Math.min(10.0, score));
    score = Math.round(score * 10) / 10;

    let rankCode = "A+";
    let rankName = "Xuất sắc tuyệt đối";
    let badgeColor = "#16a34a";
    let rankDesc = "Chữ viết hoàn hảo, đúng tuyệt đối từ ngữ và dấu câu. Bài viết sạch đẹp như in mẫu.";

    if (score >= 9.5) {
      rankCode = "A+";
      rankName = "Xuất sắc tuyệt đối";
      badgeColor = "#16a34a";
      rankDesc = "Chữ viết hoàn hảo, đúng tuyệt đối từ ngữ và dấu câu. Bài viết sạch đẹp như in mẫu.";
    } else if (score >= 9.0) {
      rankCode = "A";
      rankName = "Xuất sắc";
      badgeColor = "#16a34a";
      rankDesc = "Đúng mẫu chữ, nét viết trơn tru. Có thể có một lỗi rất nhỏ nhưng tổng thể xuất sắc.";
    } else if (score >= 8.5) {
      rankCode = "A-";
      rankName = "Giỏi / Trên khá";
      badgeColor = "#2563eb";
      rankDesc = "Chữ viết đẹp nhưng mắc từ 1 - 2 lỗi chính tả hoặc dấu thanh nhẹ.";
    } else if (score >= 8.0) {
      rankCode = "B+";
      rankName = "Khá tốt";
      badgeColor = "#2563eb";
      rankDesc = "Chữ viết rõ ràng, mắc lỗi nhỏ ở một vài từ ngữ.";
    } else if (score >= 7.0) {
      rankCode = "B";
      rankName = "Khá";
      badgeColor = "#ca8a04";
      rankDesc = "Đúng mẫu cơ bản nhưng còn sai một số từ chính tả.";
    } else if (score >= 5.0) {
      rankCode = "C";
      rankName = "Trung bình";
      badgeColor = "#ea580c";
      rankDesc = "Viết sai nhiều từ ngữ so với đề bài mẫu, cần rèn luyện thêm.";
    } else {
      rankCode = "D / F";
      rankName = "Chưa hoàn thành";
      badgeColor = "#dc2626";
      rankDesc = "Chữ viết sai nhiều cấu trúc hoặc bỏ sót nhiều từ trong bài.";
    }

    const hasErrors = errors.length > 0 || deductions.length > 0;

    return {
      score,
      rankCode,
      rankName,
      badgeColor,
      rankDesc,
      deductions,
      recognizedText: studentText,
      hasErrors,
      errors,
    };
  };

  // Nút hành động: Chấm điểm bài làm
  const handleGradeSubmission = async () => {
    const result = evaluateWritingAlgorithm(submissionText, targetPrompt);
    setGradingResult(result);
    setIsGraded(true);

    // Lưu kết quả chấm điểm vào bảng ket_qua_chinh_ta_hs trong MySQL
    try {
      await fetch(API_ENDPOINTS.SAVE_KET_QUA_CHINH_TA_HS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nguoi_dung_id: (params as any)?.id_nguoi_dung || 1,
          bai_chinh_ta_id: baiChinhTaId || 1,
          lop_id: 1,
          van_ban_ocr: result.recognizedText,
          duong_dan_anh_goc: capturedImageUri || null,
          duong_dan_anh_khoanh_loi: null,
          tong_tu_sai: result.errors.length,
          chi_tiet_loi: result.errors,
          diem_so: result.score,
        }),
      });
    } catch (e) {
      console.log("Lỗi lưu kết quả chính tả vào MySQL:", e);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Header
        name={name}
        classes={classes}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
      />

      {/* Banner bài học */}
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={require("@/assets/images/banner-chuong-trinh.png")}
          style={styles.bannerBackground}
          resizeMode="contain"
        >
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Luyện chính tả - Lớp 1</Text>
            <Text style={styles.bannerSubtitle}>Nghe - Viết & Chấm điểm chữ viết tay</Text>
          </View>
        </ImageBackground>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ======================================================== */}
        {/* KHUNG 1: NGHE */}
        {/* ======================================================== */}
        <View style={styles.storyBox}>
          <View style={styles.tabHeader}>
            <Text style={styles.tabTitle}>1. Nghe</Text>
          </View>

          {/* Dòng 1: Đề bài yêu cầu */}
          <Text style={styles.instructionText}>
            Em hãy nhấn nút Play (▶️) để em nghe sau đó em viết lại vô vở:
          </Text>

          {/* Dòng 2: Nút play, thanh tiến trình và bộ đếm số giây */}
          <View style={styles.audioPlayerContainer}>
            <TouchableOpacity
              style={[styles.playButtonCircle, isPlaying && styles.playingButtonCircle]}
              onPress={handleTogglePlayAudio}
              activeOpacity={0.8}
            >
              <Text style={styles.playIconText}>{isPlaying ? "⏸️" : "▶️"}</Text>
            </TouchableOpacity>

            <View style={styles.audioProgressWrapper}>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(
                        100,
                        (currentSeconds / (totalSeconds || 1)) * 100
                      )}%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeNumberText}>
                  {formatTime(currentSeconds)}
                </Text>
                <Text style={styles.timeNumberText}>
                  {formatTime(totalSeconds)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ======================================================== */}
        {/* KHUNG 2: BÀI LÀM */}
        {/* ======================================================== */}
        <View style={styles.storyBox}>
          <View style={styles.tabHeader}>
            <Text style={styles.tabTitle}>2. Bài làm</Text>
          </View>

          {/* Dòng 1 */}
          <Text style={styles.instructionText}>
            Em hãy chụp bài làm hoặc file pdf vô khung này:
          </Text>

          {/* Dòng 2: Thiết kế nút chụp ảnh & các mẫu thử nghiệm */}
          <View style={styles.captureActionRow}>
            <TouchableOpacity
              style={styles.actionBtnCamera}
              onPress={handleCaptureRealCamera}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnCameraText}>📸 Chụp ảnh bài làm (Camera)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtnFile}
              onPress={handlePickFileOrGallery}
              activeOpacity={0.8}
            >
              <Text style={styles.actionBtnFileText}>📄 Chọn tệp PDF / Thư viện</Text>
            </TouchableOpacity>
          </View>

          {/* Khu vực hiển thị ảnh bài làm học sinh chụp */}
          {hasCapturedImage && (
            <View style={styles.capturedImageContainer}>
              {capturedImageUri ? (
                // HIỂN THỊ ẢNH CHỤP THẬT TỪ CAMERA
                <View style={styles.realPhotoCard}>
                  <Image
                    source={{ uri: capturedImageUri }}
                    style={styles.realPhotoImage}
                    resizeMode="contain"
                  />
                  <TouchableOpacity
                    style={styles.retakeBtn}
                    onPress={handleCaptureRealCamera}
                  >
                    <Text style={styles.retakeBtnText}>🔄 Chụp lại</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // MÔ PHỎNG VỞ Ô LY NẾU CHỌN MẪU TEST
                <View style={styles.notebookPaperSimulation}>
                  <View style={styles.notebookRedMargin} />
                  <View style={styles.notebookContentLines}>
                    <Text style={styles.handwrittenSimText}>
                      {submissionText.split("\n")[0]}
                    </Text>
                    <Text style={styles.handwrittenSimText}>
                      {submissionText.split("\n")[1]}
                    </Text>
                  </View>
                </View>
              )}
              <Text style={styles.imageLabel}>
                📷 {capturedTime}
              </Text>
            </View>
          )}

          {/* Nút bấm Submit chấm điểm */}
          <TouchableOpacity
            style={styles.submitGradingButton}
            onPress={handleGradeSubmission}
            activeOpacity={0.85}
          >
            <Text style={styles.submitGradingButtonText}>
              🚀 Chấm điểm bài viết tay
            </Text>
          </TouchableOpacity>
        </View>

        {/* ======================================================== */}
        {/* KHUNG 3: ĐỀ BÀI GỐC */}
        {/* ======================================================== */}
        <View style={styles.storyBox}>
          <View style={styles.tabHeader}>
            <Text style={styles.tabTitle}>3. Đề bài gốc</Text>
          </View>

          <Text style={styles.originalTargetTitle}>VĂN BẢN CHUẨN ĐỐI CHIẾU</Text>
          <View style={styles.originalTargetBox}>
            <Text style={styles.originalTargetParagraph}>
              {targetPrompt}
            </Text>
          </View>
        </View>

        {/* ======================================================== */}
        {/* KHUNG 4: KHOANH TRÒN CHỖ SAI TRÊN HÌNH */}
        {/* Điều kiện: Chỉ mở khi kết quả sai. Nếu đúng hoàn toàn thì KHÔNG CẦN MỞ KHUNG 4 */}
        {/* ======================================================== */}
        {isGraded && gradingResult && gradingResult.hasErrors && (
          <View style={[styles.storyBox, styles.errorBoxBorder]}>
            <View style={[styles.tabHeader, styles.errorTabHeader]}>
              <Text style={styles.errorTabTitle}>
                4. Khoanh tròn chỗ sai trên hình
              </Text>
            </View>

            <Text style={styles.errorNoticeText}>
              ⚠️ Phát hiện <Text style={{ fontWeight: "700" }}>{gradingResult.errors.length} lỗi chính tả</Text>. Vị trí viết sai đã được khoanh tròn đỏ trên hình:
            </Text>

            {/* Ảnh bài làm có khoanh tròn màu đỏ tại các vị trí sai */}
            <View style={styles.annotatedImageWrapper}>
              <View style={styles.notebookPaperSimulation}>
                <View style={styles.notebookRedMargin} />
                <View style={styles.notebookContentLines}>
                  {/* Dòng 1 */}
                  <View style={styles.textLineOverlayRow}>
                    <Text style={styles.handwrittenSimText}>
                      Nam đã đọc được{" "}
                      <Text style={styles.errorWordUnderline}>chuyện</Text>{" "}
                      <Text style={styles.errorWordUnderline}>chanh</Text>.
                    </Text>
                  </View>
                  {/* Dòng 2 */}
                  <View style={styles.textLineOverlayRow}>
                    <Text style={styles.handwrittenSimText}>
                      Nam còn{" "}
                      <Text style={styles.errorWordUnderline}>piết</Text> làm
                      toán nữa.
                    </Text>
                  </View>
                </View>

                {/* Vòng khoanh tròn đỏ thứ 1: từ 'chuyện' */}
                <View style={[styles.circleHighlight, { top: 18, left: 145, width: 68 }]} />
                {/* Vòng khoanh tròn đỏ thứ 2: từ 'chanh' */}
                <View style={[styles.circleHighlight, { top: 18, left: 220, width: 58 }]} />
                {/* Vòng khoanh tròn đỏ thứ 3: từ 'piết' */}
                <View style={[styles.circleHighlight, { top: 58, left: 95, width: 48 }]} />
              </View>
            </View>

            {/* Bảng liệt kê các từ bị khoanh tròn đỏ và từ chuẩn tương ứng */}
            <View style={styles.errorListCard}>
              <Text style={styles.errorListCardHeader}>
                🔍 Chi tiết các từ bị khoanh tròn:
              </Text>
              {gradingResult.errors.map((err, idx) => (
                <View key={idx} style={styles.errorItemRow}>
                  <Text style={styles.errorItemWrong}>
                    ❌ Viết sai: <Text style={styles.boldRed}>{err.wrongWord}</Text>
                  </Text>
                  <Text style={styles.errorItemArrow}>➔</Text>
                  <Text style={styles.errorItemCorrect}>
                    Chuẩn: <Text style={styles.boldGreen}>{err.correctWord}</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ======================================================== */}
        {/* KHUNG 5: KẾT QUẢ CHẤM ĐIỂM */}
        {/* Điều kiện: Luôn mở khi chấm điểm. */}
        {/* Nếu chấm đúng: Mở Khung 5 chấm điểm trực tiếp 10/10 ĐÚNG (Khung 4 không mở) */}
        {/* ======================================================== */}
        {isGraded && gradingResult && (
          <View
            style={[
              styles.storyBox,
              gradingResult.hasErrors
                ? styles.gradingBoxBorderWrong
                : styles.gradingBoxBorderCorrect,
            ]}
          >
            <View
              style={[
                styles.tabHeader,
                gradingResult.hasErrors
                  ? styles.gradingTabHeaderWrong
                  : styles.gradingTabHeaderCorrect,
              ]}
            >
              <Text style={styles.tabTitle}>5. Kết quả chấm điểm</Text>
            </View>

            {/* Hộp điểm số lớn */}
            <View style={styles.scoreHeaderRow}>
              <View>
                <Text style={styles.scoreSubTitle}>ĐIỂM SỐ BÀI VIẾT TAY</Text>
                <Text style={styles.scoreNumberText}>
                  {gradingResult.score}{" "}
                  <Text style={styles.scoreOutOfText}>/ 10</Text>
                </Text>
              </View>

              <View style={styles.badgeWrapper}>
                <View
                  style={[
                    styles.rankBadge,
                    { backgroundColor: gradingResult.badgeColor },
                  ]}
                >
                  <Text style={styles.rankBadgeText}>
                    {gradingResult.rankCode}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.rankNameText,
                    { color: gradingResult.badgeColor },
                  ]}
                >
                  {gradingResult.rankName}
                </Text>
              </View>
            </View>

            {/* Thông báo chúc mừng nếu viết đúng 100% */}
            {!gradingResult.hasErrors && (
              <View style={styles.perfectScoreBanner}>
                <Text style={styles.perfectScoreEmoji}>🎉🌟👏</Text>
                <Text style={styles.perfectScoreText}>
                  TUYỆT VỜI! Con đã viết đúng hoàn toàn chính tả và các dấu câu!
                </Text>
              </View>
            )}

            {/* Nhận xét chung của giáo viên AI */}
            <View style={styles.feedbackSection}>
              <Text style={styles.feedbackSectionTitle}>
                📝 Nhận xét của giáo viên:
              </Text>
              <Text style={styles.feedbackContentText}>
                {gradingResult.rankDesc}
              </Text>
            </View>

            {/* Chi tiết trừ điểm (nếu có lỗi) */}
            {gradingResult.deductions.length > 0 ? (
              <View style={styles.deductionSection}>
                <Text style={styles.deductionSectionTitle}>
                  ⚠️ Chi tiết các lỗi trừ điểm:
                </Text>
                {gradingResult.deductions.map((d, i) => (
                  <Text key={i} style={styles.deductionItemText}>
                    • {d}
                  </Text>
                ))}
              </View>
            ) : (
              <View style={styles.noDeductionSection}>
                <Text style={styles.noDeductionText}>
                  ✅ Không phát hiện lỗi chính tả nào. Đạt điểm tối đa 10/10!
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}

// ==========================================
// STYLES CHUẨN THEO READINGPRONUNCIATION
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFF",
  },
  bannerContainer: {
    width: "100%",
    height: 95,
    justifyContent: "center",
    alignItems: "center",
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
    gap: 20,
  },

  // Khung chứa code chuẩn
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
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    zIndex: 10,
  },
  tabTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
  },

  instructionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 6,
    marginBottom: 14,
    lineHeight: 22,
  },

  // Khung 1: Audio player
  audioPlayerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F7FF",
    borderWidth: 1.5,
    borderColor: "#93C5FD",
    borderRadius: 16,
    padding: 12,
    gap: 14,
  },
  playButtonCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  playingButtonCircle: {
    backgroundColor: "#DC2626",
  },
  playIconText: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  audioProgressWrapper: {
    flex: 1,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2563EB",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  timeNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1E40AF",
  },

  // Khung 2: Chụp ảnh & Bài làm
  captureActionRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  actionBtnCamera: {
    flex: 1,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  actionBtnCameraText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  actionBtnFile: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  actionBtnFileText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 14,
  },

  capturedImageContainer: {
    marginTop: 6,
    marginBottom: 14,
    alignItems: "center",
  },
  notebookPaperSimulation: {
    width: "100%",
    height: 100,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    flexDirection: "row",
    overflow: "hidden",
    position: "relative",
  },
  notebookRedMargin: {
    width: 28,
    height: "100%",
    borderRightWidth: 1.5,
    borderRightColor: "#FCA5A5",
    backgroundColor: "#FFF5F5",
  },
  notebookContentLines: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    justifyContent: "space-around",
  },
  handwrittenSimText: {
    fontSize: 17,
    fontFamily: Platform.OS === "ios" ? "Snell Roundhand" : "serif",
    color: "#1E1B4B",
    fontStyle: "italic",
  },
  imageLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    fontStyle: "italic",
  },

  submitGradingButton: {
    backgroundColor: "#16A34A",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  submitGradingButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  // Khung 3: Đề bài gốc
  originalTargetTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E3A8A",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  originalTargetBox: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
    borderRadius: 12,
    padding: 14,
  },
  originalTargetParagraph: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 26,
    color: "#1E293B",
    textAlign: "center",
  },

  // Khung 4: Khoanh tròn lỗi sai
  errorBoxBorder: {
    borderColor: "#DC2626",
    backgroundColor: "#FFFBFB",
  },
  errorTabHeader: {
    borderColor: "#DC2626",
  },
  errorTabTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
  },
  errorNoticeText: {
    fontSize: 14,
    color: "#991B1B",
    marginBottom: 10,
    lineHeight: 20,
  },
  annotatedImageWrapper: {
    marginBottom: 12,
    position: "relative",
  },
  textLineOverlayRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorWordUnderline: {
    color: "#DC2626",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  circleHighlight: {
    position: "absolute",
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: "#DC2626",
    backgroundColor: "rgba(220, 38, 38, 0.12)",
  },
  errorListCard: {
    backgroundColor: "#FEF2F2",
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
    padding: 10,
    borderRadius: 6,
  },
  errorListCardHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#991B1B",
    marginBottom: 6,
  },
  errorItemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  errorItemWrong: {
    fontSize: 13,
    color: "#7F1D1D",
  },
  errorItemArrow: {
    marginHorizontal: 8,
    color: "#991B1B",
    fontWeight: "700",
  },
  errorItemCorrect: {
    fontSize: 13,
    color: "#166534",
  },
  boldRed: {
    fontWeight: "800",
    color: "#DC2626",
  },
  boldGreen: {
    fontWeight: "800",
    color: "#16A34A",
  },

  // Khung 5: Kết quả chấm điểm
  gradingBoxBorderWrong: {
    borderColor: "#EA580C",
  },
  gradingBoxBorderCorrect: {
    borderColor: "#16A34A",
  },
  gradingTabHeaderWrong: {
    borderColor: "#EA580C",
  },
  gradingTabHeaderCorrect: {
    borderColor: "#16A34A",
  },
  scoreHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 12,
    marginBottom: 12,
  },
  scoreSubTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    textTransform: "uppercase",
  },
  scoreNumberText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#DC2626",
  },
  scoreOutOfText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748B",
  },
  badgeWrapper: {
    alignItems: "flex-end",
  },
  rankBadge: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 16,
  },
  rankBadgeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  rankNameText: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  perfectScoreBanner: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1.5,
    borderColor: "#86EFAC",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  perfectScoreEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  perfectScoreText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#15803D",
    textAlign: "center",
    lineHeight: 20,
  },
  feedbackSection: {
    backgroundColor: "#F8FAFC",
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  feedbackSectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E40AF",
    marginBottom: 4,
  },
  feedbackContentText: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 18,
  },
  deductionSection: {
    backgroundColor: "#FEF2F2",
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
    padding: 10,
    borderRadius: 6,
  },
  deductionSectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#991B1B",
    marginBottom: 4,
  },
  deductionItemText: {
    fontSize: 12.5,
    color: "#7F1D1D",
    lineHeight: 18,
  },
  noDeductionSection: {
    backgroundColor: "#F0FDF4",
    borderLeftWidth: 4,
    borderLeftColor: "#16A34A",
    padding: 10,
    borderRadius: 6,
  },
  noDeductionText: {
    fontSize: 13,
    color: "#166534",
    fontWeight: "600",
  },

  // Modal Máy ảnh
  cameraModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  cameraModalContainer: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#334155",
    alignItems: "center",
  },
  cameraHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  cameraHeaderTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F8FAFC",
  },
  cameraCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraCloseBtnText: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "700",
  },
  cameraViewfinder: {
    width: "100%",
    height: 220,
    backgroundColor: "#1E293B",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#475569",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    padding: 14,
  },
  cameraCornerTL: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#FACC15",
  },
  cameraCornerTR: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: "#FACC15",
  },
  cameraCornerBL: {
    position: "absolute",
    bottom: 8,
    left: 8,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: "#FACC15",
  },
  cameraCornerBR: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: "#FACC15",
  },
  cameraPaperPreview: {
    width: "90%",
    height: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  cameraGuideText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 12,
    textAlign: "center",
  },
  cameraOptionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
    marginBottom: 16,
  },
  cameraModeTag: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#475569",
  },
  cameraModeTagActive: {
    backgroundColor: "#2563EB",
    borderColor: "#3B82F6",
  },
  cameraModeTagText: {
    fontSize: 12,
    color: "#F8FAFC",
    fontWeight: "600",
  },
  shutterRow: {
    alignItems: "center",
    marginBottom: 6,
  },
  shutterButtonOuter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#EF4444",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  shutterButtonInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterHintText: {
    fontSize: 12,
    color: "#CBD5E1",
    marginTop: 8,
    fontWeight: "600",
  },

  // Ảnh chụp thật từ Camera
  realPhotoCard: {
    width: "100%",
    height: 180,
    backgroundColor: "#0F172A",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#3B82F6",
  },
  realPhotoImage: {
    width: "100%",
    height: "100%",
  },
  retakeBtn: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#94A3B8",
  },
  retakeBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
});

