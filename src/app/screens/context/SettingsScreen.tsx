import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Switch,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRegion, RegionType, REGIONS_INFO } from './RegionContext';

const { width } = Dimensions.get('window');

// Danh sách ngôn ngữ sao chép từ file language.tsx
const AVAILABLE_LANGUAGES = [
  { id: 'vi', flag: '🇻🇳', name: 'Tiếng Việt (Vietnamese)', code: 'vi' },
  { id: 'en', flag: '🇬🇧', name: 'Tiếng Anh (English)', code: 'en' },
  { id: 'ko', flag: '🇰🇷', name: 'Tiếng Hàn (한국어)', code: 'ko' },
  { id: 'ja', flag: '🇯🇵', name: 'Tiếng Nhật (日本語)', code: 'ja' },
  { id: 'zh', flag: '🇨🇳', name: 'Tiếng Trung (中文)', code: 'zh' },
  { id: 'fr', flag: '🇫🇷', name: 'Tiếng Pháp (Français)', code: 'fr' },
  { id: 'de', flag: '🇩🇪', name: 'Tiếng Đức (Deutsch)', code: 'de' },
  { id: 'ru', flag: '🇷🇺', name: 'Tiếng Nga (Русский)', code: 'ru' },
];

export default function SettingsScreen({ navigation, route }: any) {
  const { region, changeRegion, regionDetail } = useRegion();

  // State thông tin người dùng
  const [userInfo, setUserInfo] = useState({
    ho_ten: route?.params?.user?.ho_ten || route?.params?.ho_ten || 'Mai Thanh An',
    ten_dangnhap: route?.params?.user?.ten_dangnhap || 'an_lop1',
    ten_vaitro: route?.params?.user?.ten_vaitro || 'Học sinh Tiểu Học',
    email: route?.params?.user?.email || 'an.nguyen@hs.edu.vn',
    so_dien_thoai: route?.params?.user?.so_dien_thoai || '0901000001',
    lop: route?.params?.selectedClass || 'Lớp 1',
  });

  // State Modal Thông tin cá nhân
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  // State Ngôn ngữ nước ngoài (Modal từ file language.tsx)
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Tiếng Việt (Vietnamese)');
  const [searchLang, setSearchLang] = useState('');

  // State Cài đặt ứng dụng
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  // Tải cài đặt đã lưu
  useEffect(() => {
    const loadSavedSettings = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('APP_LANGUAGE');
        if (savedLang) setSelectedLanguage(savedLang);

        const savedAutoPlay = await AsyncStorage.getItem('SETTING_AUTOPLAY');
        if (savedAutoPlay !== null) setAutoPlayAudio(savedAutoPlay === 'true');

        const savedReminder = await AsyncStorage.getItem('SETTING_REMINDER');
        if (savedReminder !== null) setDailyReminder(savedReminder === 'true');

        const savedUser = await AsyncStorage.getItem('USER_INFO');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setUserInfo((prev) => ({
            ...prev,
            ho_ten: parsed.ho_ten || prev.ho_ten,
            ten_dangnhap: parsed.ten_dangnhap || prev.ten_dangnhap,
            ten_vaitro: parsed.ten_vaitro || prev.ten_vaitro,
            email: parsed.email || prev.email,
            so_dien_thoai: parsed.so_dien_thoai || prev.so_dien_thoai,
          }));
        }
      } catch (err) {
        console.log('Lỗi tải cài đặt:', err);
      }
    };
    loadSavedSettings();
  }, []);

  // Đổi ngôn ngữ
  const handleSelectLanguage = async (langName: string) => {
    setSelectedLanguage(langName);
    try {
      await AsyncStorage.setItem('APP_LANGUAGE', langName);
    } catch (_) {}
    setLanguageModalVisible(false);
    Alert.alert('Thành công', `Đã chuyển ngôn ngữ sang ${langName}`);
  };

  // Đổi trạng thái tự động phát âm
  const toggleAutoPlay = async (value: boolean) => {
    setAutoPlayAudio(value);
    try {
      await AsyncStorage.setItem('SETTING_AUTOPLAY', value.toString());
    } catch (_) {}
  };

  // Đổi trạng thái nhắc nhở
  const toggleReminder = async (value: boolean) => {
    setDailyReminder(value);
    try {
      await AsyncStorage.setItem('SETTING_REMINDER', value.toString());
    } catch (_) {}
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    Alert.alert(
      '🚪 Đăng xuất tài khoản',
      'Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('USER_INFO');
              await AsyncStorage.removeItem('USER_TOKEN');
              // Điều hướng về màn hình đăng nhập
              if (navigation?.reset) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              } else if (navigation?.navigate) {
                navigation.navigate('Login');
              }
            } catch (e) {
              console.log('Lỗi đăng xuất:', e);
              navigation.navigate('Login');
            }
          },
        },
      ]
    );
  };

  // Lọc ngôn ngữ theo từ khóa tìm kiếm
  const filteredLanguages = AVAILABLE_LANGUAGES.filter((l) =>
    l.name.toLowerCase().includes(searchLang.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />

      {/* Header thanh điều hướng */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>◀️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt hệ thống</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ========================================================= */}
        {/* DÒNG 1: THÔNG TIN CÁ NHÂN */}
        {/* ========================================================= */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>👤 TÀI KHOẢN NGƯỜI DÙNG</Text>
        </View>

        <TouchableOpacity
          style={styles.profileCard}
          activeOpacity={0.85}
          onPress={() => setProfileModalVisible(true)}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {userInfo.ho_ten.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userInfo.ho_ten}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{userInfo.ten_vaitro}</Text>
            </View>
            <Text style={styles.profileSub}>
              Đang học: {userInfo.lop} • ID: @{userInfo.ten_dangnhap}
            </Text>
          </View>
          <Text style={styles.arrowIcon}>❯</Text>
        </TouchableOpacity>

        {/* ========================================================= */}
        {/* DÒNG 2: NGÔN NGỮ NƯỚC NGOÀI (MENU COPPY TỪ LANGUAGE.TSX) */}
        {/* ========================================================= */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>🌐 NGÔN NGỮ HIỂN THỊ & DỊCH</Text>
        </View>

        <TouchableOpacity
          style={styles.menuRowItem}
          activeOpacity={0.75}
          onPress={() => setLanguageModalVisible(true)}
        >
          <View style={styles.menuIconContainer}>
            <Text style={styles.menuItemEmoji}>🌍</Text>
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuItemTitle}>Ngôn ngữ nước ngoài</Text>
            <Text style={styles.menuItemSubtitle}>{selectedLanguage}</Text>
          </View>
          <View style={styles.menuRightContainer}>
            <Text style={styles.tagText}>Thay đổi</Text>
            <Text style={styles.arrowIcon}>❯</Text>
          </View>
        </TouchableOpacity>

        {/* ========================================================= */}
        {/* DÒNG 3: CHẾ ĐỘ 3 VÙNG MIỀN BẮC - TRUNG - NAM CHO TIỂU HỌC */}
        {/* ========================================================= */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>🇻🇳 CHỌN VÙNG MIỀN (HỌC SINH TIỂU HỌC)</Text>
        </View>

        <View style={styles.regionCard}>
          <Text style={styles.regionIntroText}>
            💡 <Text style={{ fontWeight: '700' }}>Cơ chế 1 nút bấm thay đổi toàn bộ app:</Text> Khi chọn vùng miền, toàn bộ giọng phát âm mẫu (TTS) và các từ vựng trong bài học sẽ tự động quy đổi đồng bộ.
          </Text>

          {/* 3 Nút chọn vùng miền */}
          <View style={styles.regionButtonRow}>
            {(['bac', 'trung', 'nam'] as RegionType[]).map((rKey) => {
              const rInfo = REGIONS_INFO[rKey];
              const isSelected = region === rKey;

              return (
                <TouchableOpacity
                  key={rKey}
                  style={[styles.regionBtn, isSelected && styles.regionBtnActive]}
                  onPress={() => changeRegion(rKey)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.regionEmoji}>{rInfo.icon}</Text>
                  <Text style={[styles.regionName, isSelected && styles.regionNameActive]}>
                    {rInfo.name}
                  </Text>
                  {isSelected && <Text style={styles.activeCheck}>✓ Đang chọn</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Chi tiết vùng miền đang chọn */}
          <View style={styles.regionDetailBox}>
            <View style={styles.regionDetailHeader}>
              <Text style={styles.regionDetailTitle}>
                {regionDetail.icon} {regionDetail.name} ({regionDetail.subName})
              </Text>
            </View>
            <Text style={styles.regionDetailDesc}>{regionDetail.description}</Text>
            <View style={styles.voiceRow}>
              <Text style={styles.voiceLabel}>🔊 Giọng đọc TTS mẫu:</Text>
              <Text style={styles.voiceValue}>{regionDetail.voiceName}</Text>
            </View>
            <View style={styles.exampleWordRow}>
              <Text style={styles.exampleWordLabel}>📝 Từ ngữ đặc trưng:</Text>
              <Text style={styles.exampleWordValue}>
                {regionDetail.sampleWords.join(' • ')}
              </Text>
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* DÒNG 4: CÀI ĐẶT LIÊN QUAN ĐẾN ÂM THANH & GIỌNG ĐỌC */}
        {/* ========================================================= */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>🔊 ÂM THANH & BÀI HỌC</Text>
        </View>

        <View style={styles.settingGroupCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingRowLeft}>
              <Text style={styles.settingItemTitle}>Tự động phát giọng đọc bài học</Text>
              <Text style={styles.settingItemSub}>Tự động phát audio khi mở bài đọc / bài chính tả</Text>
            </View>
            <Switch
              value={autoPlayAudio}
              onValueChange={toggleAutoPlay}
              trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
              thumbColor={autoPlayAudio ? '#2563EB' : '#F1F5F9'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingRowLeft}>
              <Text style={styles.settingItemTitle}>Hiệu ứng âm thanh tương tác</Text>
              <Text style={styles.settingItemSub}>Âm thanh vui nhộn khi hoàn thành bài tập</Text>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
              trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
              thumbColor={soundEffects ? '#2563EB' : '#F1F5F9'}
            />
          </View>
        </View>

        {/* ========================================================= */}
        {/* DÒNG 5: CÀI ĐẶT THÔNG BÁO & THÔNG TIN ỨNG DỤNG */}
        {/* ========================================================= */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>⚙️ TIỆN ÍCH & THÔNG TIN ỨNG DỤNG</Text>
        </View>

        <View style={styles.settingGroupCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingRowLeft}>
              <Text style={styles.settingItemTitle}>Nhắc nhở học tập mỗi ngày</Text>
              <Text style={styles.settingItemSub}>Nhắc bé luyện đọc & viết chữ lúc 19:30 tối</Text>
            </View>
            <Switch
              value={dailyReminder}
              onValueChange={toggleReminder}
              trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
              thumbColor={dailyReminder ? '#2563EB' : '#F1F5F9'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRowSimple}>
            <Text style={styles.settingItemTitle}>Phiên bản ứng dụng</Text>
            <Text style={styles.versionBadge}>v1.0.0 (Tốt nghiệp)</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRowSimple}>
            <Text style={styles.settingItemTitle}>Hỗ trợ & Hướng dẫn</Text>
            <Text style={styles.arrowIcon}>❯</Text>
          </View>
        </View>

        {/* ========================================================= */}
        {/* DÒNG CUỐI QUAN TRỌNG: NÚT ĐĂNG XUẤT */}
        {/* ========================================================= */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ========================================================= */}
      {/* MODAL 1: THÔNG TIN CHI TIẾT CÁ NHÂN */}
      {/* ========================================================= */}
      <Modal visible={profileModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thông tin cá nhân</Text>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕ Đóng</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalAvatarBox}>
              <View style={[styles.avatarCircle, { width: 70, height: 70, borderRadius: 35 }]}>
                <Text style={{ fontSize: 28, fontWeight: '700', color: 'white' }}>
                  {userInfo.ho_ten.charAt(0).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.modalProfileName}>{userInfo.ho_ten}</Text>
              <Text style={styles.modalProfileRole}>{userInfo.ten_vaitro}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoFieldLabel}>Họ và tên:</Text>
              <Text style={styles.infoFieldValue}>{userInfo.ho_ten}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoFieldLabel}>Tên đăng nhập:</Text>
              <Text style={styles.infoFieldValue}>{userInfo.ten_dangnhap}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoFieldLabel}>Email liên hệ:</Text>
              <Text style={styles.infoFieldValue}>{userInfo.email}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoFieldLabel}>Số điện thoại:</Text>
              <Text style={styles.infoFieldValue}>{userInfo.so_dien_thoai}</Text>
            </View>

            <View style={styles.infoField}>
              <Text style={styles.infoFieldLabel}>Lớp học hiện tại:</Text>
              <Text style={styles.infoFieldValue}>{userInfo.lop}</Text>
            </View>

            <TouchableOpacity
              style={styles.modalSubmitButton}
              onPress={() => setProfileModalVisible(false)}
            >
              <Text style={styles.modalSubmitText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ========================================================= */}
      {/* MODAL 2: NGÔN NGỮ NƯỚC NGOÀI (CHÉP TỪ LANGUAGE.TSX) */}
      {/* ========================================================= */}
      <Modal visible={languageModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { height: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn ngôn ngữ dịch</Text>
              <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕ Đóng</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="🔍 Tìm kiếm ngôn ngữ..."
              value={searchLang}
              onChangeText={setSearchLang}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredLanguages.map((lang) => {
                const isSelected = selectedLanguage === lang.name;
                return (
                  <TouchableOpacity
                    key={lang.id}
                    style={[styles.langOption, isSelected && styles.langOptionSelected]}
                    onPress={() => handleSelectLanguage(lang.name)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.langFlag}>{lang.flag}</Text>
                    <Text style={[styles.langText, isSelected && styles.langTextSelected]}>
                      {lang.name}
                    </Text>
                    {isSelected && <Text style={styles.langCheck}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
  },
  backButton: {
    padding: 6,
  },
  backIcon: {
    fontSize: 20,
    color: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionHeaderRow: {
    marginTop: 18,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },

  // Dòng 1: Profile card
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  roleBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  profileSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
  },
  arrowIcon: {
    fontSize: 16,
    color: '#94A3B8',
    marginLeft: 8,
  },

  // Dòng 2: Ngôn ngữ item
  menuRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemEmoji: {
    fontSize: 20,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  menuRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
  },

  // Dòng 3: Vùng miền
  regionCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  regionIntroText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 14,
  },
  regionButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  regionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  regionBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  regionEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  regionName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  regionNameActive: {
    color: '#1E40AF',
    fontWeight: '700',
  },
  activeCheck: {
    fontSize: 10.5,
    color: '#2563EB',
    fontWeight: '700',
    marginTop: 2,
  },
  regionDetailBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  regionDetailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  regionDetailTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
  },
  regionDetailDesc: {
    fontSize: 12.5,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 6,
  },
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  voiceLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  voiceValue: {
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '700',
    marginLeft: 6,
  },
  exampleWordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  exampleWordLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  exampleWordValue: {
    fontSize: 12,
    color: '#D97706',
    fontWeight: '700',
    marginLeft: 6,
    flex: 1,
  },

  // Cài đặt nhóm
  settingGroupCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingRowSimple: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  settingRowLeft: {
    flex: 1,
    paddingRight: 10,
  },
  settingItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  settingItemSub: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  versionBadge: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },

  // Nút đăng xuất
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingVertical: 15,
    borderRadius: 16,
    marginTop: 24,
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
  },

  // Modal chung
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalCloseText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  modalAvatarBox: {
    alignItems: 'center',
    marginVertical: 12,
  },
  modalProfileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
  },
  modalProfileRole: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 2,
  },
  infoField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoFieldLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  infoFieldValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  modalSubmitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  modalSubmitText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },

  // Modal Ngôn ngữ
  searchInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
  },
  langOptionSelected: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#2563EB',
  },
  langFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  langText: {
    fontSize: 15,
    color: '#334155',
    flex: 1,
  },
  langTextSelected: {
    fontWeight: '700',
    color: '#1E40AF',
  },
  langCheck: {
    fontSize: 18,
    color: '#2563EB',
    fontWeight: '700',
  },
});
