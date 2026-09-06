import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';

export interface ClassInfo {
  lop: number | string;
  ten_chuong_trinh?: string;
}

interface HeaderProps {
  navigation?: any;
  route?: any;
  name?: string;
  classes: ClassInfo[];
  selectedClass: string;
  setSelectedClass: (cls: string) => void;
}

const Header = ({
  name,
  classes,
  selectedClass,
  setSelectedClass,
}: HeaderProps) => {
  return (
    <View style={styles.container}>
      {/* Cấu hình hiển thị chữ trắng trên nền xanh của Status Bar */}
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* Tiêu đề chào hỏi */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Chào {name ? `con ${name}` : 'con'} đang học {selectedClass}! 👋
        </Text>
        <Text style={styles.headerSubtitle}>
          Hôm nay con muốn luyện kỹ năng gì nào?
        </Text>
      </View>

      {/* Cụm nút chọn lớp */}
      <View style={styles.classContainer}>
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
                activeOpacity={0.7}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    backgroundColor: '#F8FAFF',
  },
  header: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    // Tự động thụt lề bằng chiều cao Status Bar của Android + 16px khoảng đệm
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 16 : 20,
    paddingBottom: 20,
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
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  classGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  classButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 25,
    backgroundColor: '#F1F5F9',
    minWidth: 70,
    alignItems: 'center',
  },
  classButtonActive: {
    backgroundColor: '#2563EB',
  },
  classText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  classTextActive: {
    color: 'white',
  },
});

export default Header;