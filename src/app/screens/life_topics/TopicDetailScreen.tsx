// src/app/screens/life_topics/TopicDetailScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  LIFE_TOPICS,
  LifeItem,
  speakVietnamese,
  getSecondaryLanguageText,
  detectObjectFromImage,
  DetectionResult,
} from '@/services/aiDetectionService';

export default function TopicDetailScreen({ route, navigation }: any) {
  const { topicId = 'fruits' } = route.params || {};
  const currentTopic = LIFE_TOPICS[topicId] || LIFE_TOPICS.fruits;

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [appLang, setAppLang] = useState<string>('Tiếng Anh');
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const cameraRef = useRef<any>(null);

  // Lấy ngôn ngữ cài đặt nếu có
  useEffect(() => {
    (async () => {
      try {
        const lang = await AsyncStorage.getItem('APP_LANGUAGE');
        if (lang) setAppLang(lang);
      } catch (_) {}
    })();
  }, []);

  // Đổi camera trước / sau
  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  // Phát âm khi người dùng bấm vào một dòng trong bảng
  const handleItemPress = (item: LifeItem) => {
    setActiveItemId(item.id);
    speakVietnamese(item.vietnamese);
  };

  // Quét và nhận diện đồ vật qua Camera
  const handleScanObject = async () => {
    if (isScanning) return;
    setIsScanning(true);

    try {
      let imageUriOrBase64 = '';

      // Chụp ảnh từ Camera nếu camera đã sẵn sàng
      if (cameraRef.current) {
        try {
          const photo = await cameraRef.current.takePictureAsync({
            quality: 0.7,
            base64: true,
            shutterSound: false,
          });
          if (photo) {
            imageUriOrBase64 = photo.base64 ? `data:image/jpeg;base64,${photo.base64}` : photo.uri;
            setPreviewUri(photo.uri);
          }
        } catch (camErr) {
          console.log('Chụp qua camera lỗi nhẹ, tiếp tục nhận diện:', camErr);
        }
      }

      // Gửi vào mô hình AI nhận diện (Roboflow Workflow hoặc custom detector)
      const result = await detectObjectFromImage(
        imageUriOrBase64 || 'sample_frame',
        topicId as 'fruits' | 'animals',
        undefined
      );

      setDetectionResult(result);

      if (result.detected) {
        setActiveItemId(result.classId);
        // Phát âm thanh tiếng Việt rành rọt
        await speakVietnamese(result.vietnameseName);
      } else {
        Alert.alert(
          'Chưa nhận diện được',
          'Camera chưa nhận diện rõ sự vật trong khung hình 200x200. Bạn vui lòng đưa đồ vật lại gần hơn hoặc bấm chọn từ cần học trong bảng bên dưới nhé!'
        );
      }
    } catch (error) {
      console.warn('Lỗi quét AI:', error);
      Alert.alert('Thông báo', 'Không thể nhận diện vật thể lúc này. Vui lòng thử lại!');
    } finally {
      setIsScanning(false);
    }
  };

  // Chọn ảnh từ thư viện để nhận diện
  const handlePickImage = async () => {
    try {
      const pickResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!pickResult.canceled && pickResult.assets[0]) {
        const asset = pickResult.assets[0];
        setPreviewUri(asset.uri);
        setIsScanning(true);

        const base64Data = asset.base64
          ? `data:image/jpeg;base64,${asset.base64}`
          : asset.uri;

        const fileName = (asset as any).fileName || asset.uri || '';
        const result = await detectObjectFromImage(
          base64Data,
          topicId as 'fruits' | 'animals',
          undefined,
          fileName
        );

        setDetectionResult(result);
        if (result.detected) {
          setActiveItemId(result.classId);
          await speakVietnamese(result.vietnameseName);
        } else {
          Alert.alert(
            'Chưa nhận diện được',
            'Không tìm thấy sự vật trong ảnh vừa chọn. Bạn hãy thử chọn ảnh rõ nét hơn nhé!'
          );
        }
        setIsScanning(false);
      }
    } catch (err) {
      setIsScanning(false);
      console.log('Lỗi chọn ảnh:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>
            {currentTopic.icon} Chủ đề: {currentTopic.titleVi}
          </Text>
          <Text style={styles.headerSubtitle}>
            {currentTopic.titleEn} • AI Object Recognition
          </Text>
        </View>
        <TouchableOpacity
          style={styles.infoBadge}
          onPress={() =>
            Alert.alert(
              'Hướng dẫn',
              'Đặt vật thể thật trước ô vuông camera 200x200 hoặc bấm Chọn ảnh để AI nhận diện, sau đó loa sẽ phát âm tiếng Việt chuẩn xác!'
            )
          }
        >
          <Text style={styles.infoBadgeText}>❓</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* KHUNG CAMERA VUÔNG NHỎ KÍCH THƯỚC 200x200 */}
        <View style={styles.cameraSection}>
          <View style={styles.cameraHeaderRow}>
            <Text style={styles.cameraSectionTitle}>
              📷 Camera Quét Đồ Vật (200x200)
            </Text>
            {detectionResult?.detected && (
              <View style={styles.confidencePill}>
                <Text style={styles.confidenceText}>
                  Độ tin cậy: {Math.round(detectionResult.confidence * 100)}%
                </Text>
              </View>
            )}
          </View>

          {/* Ô VUÔNG CAMERA 200x200 CHÍNH XÁC */}
          <View style={styles.cameraBoxContainer}>
            <View style={styles.cameraSquareBox}>
              {!permission?.granted ? (
                <View style={styles.permissionBox}>
                  <Text style={styles.permissionEmoji}>📷</Text>
                  <Text style={styles.permissionText}>
                    Cần cấp quyền Camera để quét vật thể
                  </Text>
                  <TouchableOpacity
                    style={styles.grantBtn}
                    onPress={requestPermission}
                  >
                    <Text style={styles.grantBtnText}>Cấp quyền</Text>
                  </TouchableOpacity>
                </View>
              ) : previewUri ? (
                <Image source={{ uri: previewUri }} style={styles.cameraView} />
              ) : (
                <CameraView
                  ref={cameraRef}
                  style={styles.cameraView}
                  facing={facing}
                  mute={true}
                />
              )}

              {/* 4 Góc ngắm camera quét AI (Corner guides) */}
              <View style={[styles.corner, styles.cornerTL]} />
              <View style={[styles.corner, styles.cornerTR]} />
              <View style={[styles.corner, styles.cornerBL]} />
              <View style={[styles.corner, styles.cornerBR]} />

              {/* BOUNDING BOX XANH LÁ + NHÃN NỔI KHI NHẬN DIỆN THÀNH CÔNG */}
              {detectionResult?.detected && (
                <View
                  style={[
                    styles.boundingBox,
                    {
                      left: detectionResult.bbox?.x || 20,
                      top: detectionResult.bbox?.y || 20,
                      width: detectionResult.bbox?.width || 160,
                      height: detectionResult.bbox?.height || 160,
                    },
                  ]}
                >
                  <View style={styles.boundingBoxLabel}>
                    <Text style={styles.boundingBoxLabelText}>
                      ✓ {detectionResult.vietnameseName}
                    </Text>
                  </View>
                </View>
              )}

              {/* Hiệu ứng loading khi đang quét AI */}
              {isScanning && (
                <View style={styles.scanningOverlay}>
                  <ActivityIndicator size="large" color="#10B981" />
                  <Text style={styles.scanningText}>AI đang phân tích...</Text>
                </View>
              )}
            </View>
          </View>

          {/* Hàng nút điều khiển camera */}
          <View style={styles.cameraActionRow}>
            <TouchableOpacity
              style={styles.auxBtn}
              onPress={toggleCameraFacing}
              activeOpacity={0.7}
            >
              <Text style={styles.auxBtnIcon}>🔄</Text>
              <Text style={styles.auxBtnText}>Đổi Cam</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.mainScanBtn, isScanning && styles.mainScanBtnDisabled]}
              onPress={handleScanObject}
              disabled={isScanning}
              activeOpacity={0.8}
            >
              <Text style={styles.mainScanBtnText}>
                {isScanning ? '⏳ Đang quét...' : '⚡ QUÉT NHẬN DIỆN'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.auxBtn}
              onPress={handlePickImage}
              activeOpacity={0.7}
            >
              <Text style={styles.auxBtnIcon}>🖼️</Text>
              <Text style={styles.auxBtnText}>Chọn ảnh</Text>
            </TouchableOpacity>
          </View>

          {/* Phản hồi tên sự vật vừa nhận diện */}
          {detectionResult?.detected && (
            <View style={styles.detectedFeedbackBox}>
              <Text style={styles.detectedFeedbackEmoji}>🎉</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.detectedFeedbackTitle}>
                  Đã nhận diện: {detectionResult.vietnameseName}
                </Text>
                <Text style={styles.detectedFeedbackSub}>
                  Đã phát âm tiếng Việt • Đối chiếu với bảng bên dưới
                </Text>
              </View>
              <TouchableOpacity
                style={styles.speakAgainBtn}
                onPress={() => speakVietnamese(detectionResult.vietnameseName)}
              >
                <Text style={styles.speakAgainIcon}>🔊</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* BẢNG LIỆT KÊ SẢN PHẨM: STT | HÌNH ẢNH | TIẾNG VIỆT | TIẾNG ANH */}
        <View style={styles.tableSection}>
          <Text style={styles.tableSectionTitle}>
            📋 Danh Sách {currentTopic.items.length} {currentTopic.titleVi} (Bấm để nghe)
          </Text>

          {/* Header Bảng */}
          <View style={styles.tableHeader}>
            <Text style={[styles.thText, { width: 40, textAlign: 'center' }]}>
              STT
            </Text>
            <Text style={[styles.thText, { width: 55, textAlign: 'center' }]}>
              Ảnh
            </Text>
            <Text style={[styles.thText, { flex: 1.2 }]}>Tiếng Việt</Text>
            <Text style={[styles.thText, { flex: 1 }]}>
              {appLang.includes('Anh') ? 'Tiếng Anh' : 'Ngoại ngữ'}
            </Text>
            <Text style={[styles.thText, { width: 45, textAlign: 'center' }]}>
              Loa
            </Text>
          </View>

          {/* Danh sách 5 dòng */}
          {currentTopic.items.map((item) => {
            const isHighlighted = activeItemId === item.id;
            const secondaryText = getSecondaryLanguageText(item, appLang);

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.tableRow,
                  isHighlighted && styles.tableRowHighlighted,
                ]}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.7}
              >
                {/* STT */}
                <View style={[styles.sttBox, isHighlighted && styles.sttBoxActive]}>
                  <Text
                    style={[
                      styles.sttText,
                      isHighlighted && styles.sttTextActive,
                    ]}
                  >
                    {item.stt}
                  </Text>
                </View>

                {/* Hình ảnh / Emoji */}
                <View style={styles.avatarBox}>
                  <Text style={styles.itemEmoji}>{item.emoji}</Text>
                </View>

                {/* Tiếng Việt */}
                <View style={{ flex: 1.2 }}>
                  <Text
                    style={[
                      styles.itemVnText,
                      isHighlighted && styles.itemVnTextActive,
                    ]}
                  >
                    {item.vietnamese}
                  </Text>
                  {isHighlighted && (
                    <Text style={styles.detectedBadge}>✓ Đã chọn</Text>
                  )}
                </View>

                {/* Tiếng Anh / Ngoại ngữ */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemEnText}>{secondaryText}</Text>
                  <Text style={styles.itemPronun}>
                    {item.english !== secondaryText ? item.english : ''}
                  </Text>
                </View>

                {/* Nút phát âm thanh */}
                <TouchableOpacity
                  style={[
                    styles.soundBtn,
                    isHighlighted && styles.soundBtnActive,
                  ]}
                  onPress={() => handleItemPress(item)}
                >
                  <Text style={styles.soundBtnText}>🔊</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#BAE6FD',
    fontSize: 12,
    marginTop: 2,
  },
  infoBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBadgeText: {
    fontSize: 18,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  cameraSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cameraHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cameraSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  confidencePill: {
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    color: '#03543F',
    fontSize: 12,
    fontWeight: '700',
  },
  cameraBoxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  // Ô VUÔNG CAMERA 200x200
  cameraSquareBox: {
    width: 200,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  cameraView: {
    width: 200,
    height: 200,
  },
  permissionBox: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  permissionText: {
    color: '#CBD5E1',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 10,
  },
  grantBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  grantBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  // 4 góc ngắm quét AI
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#10B981',
  },
  cornerTL: {
    top: 8,
    left: 8,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  cornerTR: {
    top: 8,
    right: 8,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  cornerBL: {
    bottom: 8,
    left: 8,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  cornerBR: {
    bottom: 8,
    right: 8,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  // Bounding box màu xanh lá quanh vật thể
  boundingBox: {
    position: 'absolute',
    borderWidth: 2.5,
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 8,
  },
  boundingBoxLabel: {
    position: 'absolute',
    top: -24,
    left: 0,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  boundingBoxLabelText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  cameraActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 10,
  },
  auxBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 65,
  },
  auxBtnIcon: {
    fontSize: 18,
  },
  auxBtnText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
    marginTop: 2,
  },
  mainScanBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  mainScanBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  mainScanBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  detectedFeedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
    borderRadius: 14,
    padding: 12,
    marginTop: 14,
    gap: 10,
  },
  detectedFeedbackEmoji: {
    fontSize: 24,
  },
  detectedFeedbackTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
  },
  detectedFeedbackSub: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
  },
  speakAgainBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakAgainIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  tableSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  tableSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 8,
  },
  thText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    borderRadius: 12,
    marginBottom: 4,
  },
  tableRowHighlighted: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1.5,
  },
  sttBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sttBoxActive: {
    backgroundColor: '#10B981',
  },
  sttText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  sttTextActive: {
    color: '#FFFFFF',
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemVnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  itemVnTextActive: {
    color: '#065F46',
  },
  detectedBadge: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '700',
    marginTop: 2,
  },
  itemEnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  itemPronun: {
    fontSize: 11,
    color: '#94A3B8',
  },
  soundBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundBtnActive: {
    backgroundColor: '#DEF7EC',
  },
  soundBtnText: {
    fontSize: 16,
  },
});

