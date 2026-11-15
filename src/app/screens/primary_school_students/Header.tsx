import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';

export interface ClassInfo {
  lop: number | string;
  ten_chuong_trinh?: string;
}

interface HeaderProps {
  navigation?: any;
  route?: any;
  name?: string;
  classes?: ClassInfo[] | any[];
  selectedClass?: string;
  setSelectedClass?: (cls: string) => void;
}

const Header = ({
  name,
  classes = [],
  selectedClass = 'Lớp 1',
  setSelectedClass,
}: HeaderProps) => {
  // Xử lý danh sách lớp an toàn tuyệt đối, không bao giờ sinh ra "Lớp undefined"
  const normalizedClasses = React.useMemo(() => {
    const list = Array.isArray(classes) && classes.length > 0
      ? classes
      : [{ lop: 1 }, { lop: 2 }, { lop: 3 }];

    return list.map((cls: any, index: number) => {
      let num = index + 1;
      if (typeof cls === 'number') {
        num = cls;
      } else if (typeof cls === 'string') {
        const parsed = parseInt(cls.replace(/\D/g, ''), 10);
        num = !isNaN(parsed) && parsed > 0 ? parsed : index + 1;
      } else if (cls && typeof cls === 'object') {
        const parsed = typeof cls.lop === 'number'
          ? cls.lop
          : parseInt(String(cls.lop || '').replace(/\D/g, ''), 10);
        num = !isNaN(parsed) && parsed > 0 ? parsed : index + 1;
      }
      return { lop: num, label: `Lớp ${num}` };
    });
  }, [classes]);

  // Làm sạch selectedClass (loại bỏ hoàn toàn 'undefined')
  const currentClass = React.useMemo(() => {
    if (!selectedClass || selectedClass.includes('undefined')) {
      return 'Lớp 1';
    }
    const cleanNum = selectedClass.replace(/\D/g, '');
    return cleanNum ? `Lớp ${cleanNum}` : 'Lớp 1';
  }, [selectedClass]);

  const displayName = !name || name.includes('undefined') ? 'Mai Thanh An' : name;

  return (
    <View style={styles.container}>
      {/* Cấu hình hiển thị chữ trắng trên nền xanh của Status Bar */}
      <StatusBar style="light" />

      {/* Toàn bộ khối tiêu đề chào hỏi và các nút lớp nằm trong nền xanh dương theo hình 1 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Chào con {displayName} đang học {currentClass}! 👋
        </Text>
        <Text style={styles.headerSubtitle}>
          Hôm nay con muốn luyện kỹ năng gì nào?
        </Text>

        {/* Cụm nút chọn lớp màu xanh dương chuẩn theo hình 1 */}
        <View style={styles.classContainer}>
          <View style={styles.classGrid}>
            {normalizedClasses.map((item, index) => {
              const isActive = currentClass === item.label;

              return (
                <TouchableOpacity
                  key={`lop-${item.lop}-${index}`}
                  style={[
                    styles.classButton,
                    isActive ? styles.classButtonActive : styles.classButtonInactive,
                  ]}
                  onPress={() => setSelectedClass && setSelectedClass(item.label)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.classText,
                      isActive ? styles.classTextActive : styles.classTextInactive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2563EB',
  },
  header: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    // Tự động thụt lề bằng chiều cao Status Bar của Android + 16px khoảng đệm
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) + 16 : 20,
    paddingBottom: 18,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    lineHeight: 30,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#BAE6FD',
    marginTop: 6,
  },
  classContainer: {
    marginTop: 16,
  },
  classGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  classButton: {
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 25,
    minWidth: 85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  classButtonActive: {
    backgroundColor: '#1D4ED8',
    borderWidth: 2,
    borderColor: '#93C5FD',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  classButtonInactive: {
    backgroundColor: '#1E40AF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  classText: {
    fontSize: 14,
    fontWeight: '600',
  },
  classTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  classTextInactive: {
    color: '#E0E7FF',
  },
});

export default Header;