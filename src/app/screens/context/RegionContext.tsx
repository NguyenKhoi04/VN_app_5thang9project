import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type RegionType = 'bac' | 'trung' | 'nam';

export interface RegionDetail {
  code: RegionType;
  name: string;
  subName: string;
  icon: string;
  voiceName: string;
  voiceCode: string;
  sampleWords: string[];
  description: string;
}

export interface RegionalWordItem {
  id: number;
  danh_muc: string;
  tu_mien_bac: string;
  tu_mien_trung: string;
  tu_mien_nam: string;
  ghi_chu_ngu_canh?: string;
  tu_dong_nghia_khac?: string;
}

// 33 cặp từ điển từ vựng 3 miền đồng bộ với tu_vung_vung_mien.sql
export const REGIONAL_DICTIONARY: RegionalWordItem[] = [
  { id: 1, danh_muc: 'Gia đình', tu_mien_bac: 'Bố', tu_mien_trung: 'Ba', tu_mien_nam: 'Ba', ghi_chu_ngu_canh: 'Cách gọi người cha trong gia đình' },
  { id: 2, danh_muc: 'Gia đình', tu_mien_bac: 'Mẹ', tu_mien_trung: 'Mạ', tu_mien_nam: 'Má', ghi_chu_ngu_canh: 'Cách gọi người mẹ trong gia đình' },
  { id: 3, danh_muc: 'Gia đình', tu_mien_bac: 'Anh cả', tu_mien_trung: 'Anh cả', tu_mien_nam: 'Anh hai', ghi_chu_ngu_canh: 'Con trai đầu trong gia đình' },
  { id: 4, danh_muc: 'Gia đình', tu_mien_bac: 'Chị cả', tu_mien_trung: 'Chị cả', tu_mien_nam: 'Chị hai', ghi_chu_ngu_canh: 'Con gái đầu trong gia đình' },
  { id: 5, danh_muc: 'Gia đình', tu_mien_bac: 'Trẻ con', tu_mien_trung: 'Con nít', tu_mien_nam: 'Con nít', ghi_chu_ngu_canh: 'Chỉ thiếu nhi, em nhỏ' },
  { id: 6, danh_muc: 'Ẩm thực', tu_mien_bac: 'Quả dứa', tu_mien_trung: 'Quả thơm', tu_mien_nam: 'Trái khóm', ghi_chu_ngu_canh: 'Loại quả nhiệt đới nhiều mắt' },
  { id: 7, danh_muc: 'Ẩm thực', tu_mien_bac: 'Quả na', tu_mien_trung: 'Quả mãng cầu', tu_mien_nam: 'Trái mãng cầu ta', ghi_chu_ngu_canh: 'Phân biệt với mãng cầu xiêm' },
  { id: 8, danh_muc: 'Ẩm thực', tu_mien_bac: 'Củ sắn', tu_mien_trung: 'Củ sắn', tu_mien_nam: 'Củ khoai mì', ghi_chu_ngu_canh: 'Loại củ làm bột năng, luộc ăn' },
  { id: 9, danh_muc: 'Ẩm thực', tu_mien_bac: 'Củ đậu', tu_mien_trung: 'Củ sắn nước', tu_mien_nam: 'Củ sắn', ghi_chu_ngu_canh: 'Củ vỏ nâu ruột trắng, ăn sống mát' },
  { id: 10, danh_muc: 'Ẩm thực', tu_mien_bac: 'Ngô', tu_mien_trung: 'Bắp', tu_mien_nam: 'Bắp', ghi_chu_ngu_canh: 'Cây lương thực hạt vàng/trắng' },
  { id: 11, danh_muc: 'Ẩm thực', tu_mien_bac: 'Lạc', tu_mien_trung: 'Đậu phụng', tu_mien_nam: 'Đậu phộng', ghi_chu_ngu_canh: 'Hạt dùng ép dầu, rang muối' },
  { id: 12, danh_muc: 'Ẩm thực', tu_mien_bac: 'Vừng', tu_mien_trung: 'Mè', tu_mien_nam: 'Mè', ghi_chu_ngu_canh: 'Hạt nhỏ dùng làm muối vừng/muối mè' },
  { id: 13, danh_muc: 'Ẩm thực', tu_mien_bac: 'Mỳ chính', tu_mien_trung: 'Bột ngọt', tu_mien_nam: 'Bột ngọt', ghi_chu_ngu_canh: 'Gia vị điều vị trong nấu ăn' },
  { id: 14, danh_muc: 'Ẩm thực', tu_mien_bac: 'Nước chè', tu_mien_trung: 'Nước chè', tu_mien_nam: 'Nước trà', ghi_chu_ngu_canh: 'Thức uống nấu từ lá trà' },
  { id: 15, danh_muc: 'Ẩm thực', tu_mien_bac: 'Quả roi', tu_mien_trung: 'Quả đào lộn hột', tu_mien_nam: 'Trái mận', ghi_chu_ngu_canh: 'Quả màu đỏ/hồng, mọng nước' },
  { id: 16, danh_muc: 'Ẩm thực', tu_mien_bac: 'Quả mận', tu_mien_trung: 'Quả mận Bắc', tu_mien_nam: 'Trái mận Hà Nội', ghi_chu_ngu_canh: 'Quả vùng ôn đới phía Bắc' },
  { id: 17, danh_muc: 'Ẩm thực', tu_mien_bac: 'Đỗ đen', tu_mien_trung: 'Đậu đen', tu_mien_nam: 'Đậu đen', ghi_chu_ngu_canh: 'Đậu nấu chè' },
  { id: 18, danh_muc: 'Ẩm thực', tu_mien_bac: 'Thịt lợn', tu_mien_trung: 'Thịt heo', tu_mien_nam: 'Thịt heo', ghi_chu_ngu_canh: 'Thực phẩm phổ biến' },
  { id: 19, danh_muc: 'Đồ vật', tu_mien_bac: 'Bát', tu_mien_trung: 'Đọi', tu_mien_nam: 'Chén', ghi_chu_ngu_canh: 'Dùng để ăn cơm hằng ngày' },
  { id: 20, danh_muc: 'Đồ vật', tu_mien_bac: 'Bát tô', tu_mien_trung: 'Tô', tu_mien_nam: 'Tô', ghi_chu_ngu_canh: 'Bát cỡ lớn đựng canh, bún' },
  { id: 21, danh_muc: 'Đồ vật', tu_mien_bac: 'Thìa', tu_mien_trung: 'Muỗng', tu_mien_nam: 'Muỗng', ghi_chu_ngu_canh: 'Dụng cụ xúc thức ăn' },
  { id: 22, danh_muc: 'Đồ vật', tu_mien_bac: 'Cốc', tu_mien_trung: 'Ly', tu_mien_nam: 'Ly', ghi_chu_ngu_canh: 'Dụng cụ đựng nước uống' },
  { id: 23, danh_muc: 'Đồ vật', tu_mien_bac: 'Ô', tu_mien_trung: 'Dù', tu_mien_nam: 'Dù', ghi_chu_ngu_canh: 'Vật dụng che mưa che nắng' },
  { id: 24, danh_muc: 'Đồ vật', tu_mien_bac: 'Chăn', tu_mien_trung: 'Mền', tu_mien_nam: 'Mền', ghi_chu_ngu_canh: 'Dùng đắp khi ngủ' },
  { id: 25, danh_muc: 'Đồ vật', tu_mien_bac: 'Cái chậu', tu_mien_trung: 'Cái thau', tu_mien_nam: 'Cái thau', ghi_chu_ngu_canh: 'Vật dụng đựng nước' },
  { id: 26, danh_muc: 'Đồ vật', tu_mien_bac: 'Túi bóng', tu_mien_trung: 'Bì ni-lông', tu_mien_nam: 'Bịch ni-lông', ghi_chu_ngu_canh: 'Túi nhựa đựng đồ' },
  { id: 27, danh_muc: 'Động vật', tu_mien_bac: 'Con lợn', tu_mien_trung: 'Con heo', tu_mien_nam: 'Con heo', ghi_chu_ngu_canh: 'Gia súc nuôi lấy thịt' },
  { id: 28, danh_muc: 'Động vật', tu_mien_bac: 'Con ngan', tu_mien_trung: 'Con vịt xiêm', tu_mien_nam: 'Con vịt xiêm', ghi_chu_ngu_canh: 'Gia cầm họ vịt' },
  { id: 29, danh_muc: 'Động vật', tu_mien_bac: 'Cá quả', tu_mien_trung: 'Cá tràu', tu_mien_nam: 'Cá lóc', ghi_chu_ngu_canh: 'Cá nước ngọt' },
  { id: 30, danh_muc: 'Giao tiếp', tu_mien_bac: 'Ngã', tu_mien_trung: 'Té', tu_mien_nam: 'Té', ghi_chu_ngu_canh: 'Mất thăng bằng rơi xuống đất' },
  { id: 31, danh_muc: 'Giao tiếp', tu_mien_bac: 'Ốm', tu_mien_trung: 'Đau', tu_mien_nam: 'Bệnh', ghi_chu_ngu_canh: 'Trạng thái sức khỏe không tốt' },
  { id: 32, danh_muc: 'Giao tiếp', tu_mien_bac: 'Bẩn', tu_mien_trung: 'Dơ', tu_mien_nam: 'Dơ', ghi_chu_ngu_canh: 'Không sạch sẽ' },
  { id: 33, danh_muc: 'Giao tiếp', tu_mien_bac: 'Thế à', tu_mien_trung: 'Rứa à', tu_mien_nam: 'Vậy hả', ghi_chu_ngu_canh: 'Câu cảm thán xác nhận' },
];

export const REGIONS_INFO: Record<RegionType, RegionDetail> = {
  bac: {
    code: 'bac',
    name: 'Miền Bắc',
    subName: 'Hà Nội & Bắc Bộ',
    icon: '🌸',
    voiceName: 'Ban Mai (Hà Nội)',
    voiceCode: 'banmai',
    sampleWords: ['Bát', 'Quả dứa', 'Ngô', 'Lạc', 'Ngã', 'Ốm'],
    description: 'Giọng đọc chuẩn Hà Nội thanh thoát, tự động sử dụng hệ từ vựng Bắc Bộ.',
  },
  trung: {
    code: 'trung',
    name: 'Miền Trung',
    subName: 'Huế & Đà Nẵng',
    icon: '☀️',
    voiceName: 'Mỹ An (Huế - Đà Nẵng)',
    voiceCode: 'myan',
    sampleWords: ['Đọi', 'Quả thơm', 'Bắp', 'Đậu phụng', 'Té', 'Đau'],
    description: 'Giọng đọc miền Trung trầm ấm, tự động chuyển đổi từ vựng theo văn hóa miền Trung.',
  },
  nam: {
    code: 'nam',
    name: 'Miền Nam',
    subName: 'TP. Hồ Chí Minh & Miền Tây',
    icon: '🌴',
    voiceName: 'Lan Nhi (Sài Gòn)',
    voiceCode: 'lannhi',
    sampleWords: ['Chén', 'Trái khóm', 'Bắp', 'Đậu phộng', 'Té', 'Bệnh'],
    description: 'Giọng đọc miền Nam ngọt ngào, gần gũi, sử dụng từ ngữ Nam Bộ quen thuộc.',
  },
};

interface ConvertedWordResult {
  converted: string;
  note?: string;
  found: boolean;
}

interface RegionContextProps {
  region: RegionType;
  regionDetail: RegionDetail;
  changeRegion: (newRegion: RegionType) => Promise<void>;
  getRegionalWord: (word: string, customRegion?: RegionType) => ConvertedWordResult;
  convertContentWithNotes: (content: string, customRegion?: RegionType) => { text: string; notes: string[] };
}

const RegionContext = createContext<RegionContextProps>({
  region: 'nam',
  regionDetail: REGIONS_INFO.nam,
  changeRegion: async () => {},
  getRegionalWord: (word: string) => ({ converted: word, found: false }),
  convertContentWithNotes: (content: string) => ({ text: content, notes: [] }),
});

export const RegionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [region, setRegion] = useState<RegionType>('nam');

  // Nạp lại vùng miền đã lưu khi vừa mở app
  useEffect(() => {
    const loadSavedRegion = async () => {
      try {
        const saved = await AsyncStorage.getItem('APP_REGION');
        if (saved === 'bac' || saved === 'trung' || saved === 'nam') {
          setRegion(saved as RegionType);
        }
      } catch (e) {
        console.log('Không thể đọc APP_REGION từ AsyncStorage:', e);
      }
    };
    loadSavedRegion();
  }, []);

  // Hàm gọi khi người dùng bấm chọn ở màn hình Cài đặt
  const changeRegion = async (newRegion: RegionType) => {
    setRegion(newRegion);
    try {
      await AsyncStorage.setItem('APP_REGION', newRegion);
    } catch (e) {
      console.log('Không thể lưu APP_REGION vào AsyncStorage:', e);
    }
  };

  // Hàm lấy từ tương ứng và tạo chú thích UX nhỏ
  // Ví dụ khi chọn miền Trung: "Bát" -> "Đọi" kèm "(Miền Bắc: Bát — Miền Nam: Chén)"
  const getRegionalWord = (word: string, customRegion?: RegionType): ConvertedWordResult => {
    const targetRegion = customRegion || region;
    const cleanWord = word.trim().toLowerCase();

    for (const item of REGIONAL_DICTIONARY) {
      const matchBac = item.tu_mien_bac.toLowerCase() === cleanWord;
      const matchTrung = item.tu_mien_trung.toLowerCase() === cleanWord;
      const matchNam = item.tu_mien_nam.toLowerCase() === cleanWord;

      if (matchBac || matchTrung || matchNam) {
        let converted = item.tu_mien_nam;
        if (targetRegion === 'bac') converted = item.tu_mien_bac;
        if (targetRegion === 'trung') converted = item.tu_mien_trung;

        const note = `(Miền Bắc: ${item.tu_mien_bac} — Miền Trung: ${item.tu_mien_trung} — Miền Nam: ${item.tu_mien_nam})`;
        return {
          converted,
          note,
          found: true,
        };
      }
    }

    return { converted: word, found: false };
  };

  // Hàm chuyển đổi nội dung đoạn văn và tự động đính kèm các chú thích nhỏ
  const convertContentWithNotes = (content: string, customRegion?: RegionType) => {
    const targetRegion = customRegion || region;
    let convertedText = content;
    const notes: string[] = [];

    for (const item of REGIONAL_DICTIONARY) {
      let targetWord = item.tu_mien_nam;
      if (targetRegion === 'bac') targetWord = item.tu_mien_bac;
      if (targetRegion === 'trung') targetWord = item.tu_mien_trung;

      const patterns = [item.tu_mien_bac, item.tu_mien_trung, item.tu_mien_nam];
      for (const p of patterns) {
        if (p.toLowerCase() !== targetWord.toLowerCase() && convertedText.toLowerCase().includes(p.toLowerCase())) {
          const reg = new RegExp(`\\b${p}\\b`, 'gi');
          if (reg.test(convertedText)) {
            convertedText = convertedText.replace(reg, targetWord);
            const noteText = `${targetWord} (Miền Bắc: ${item.tu_mien_bac} — Miền Nam: ${item.tu_mien_nam})`;
            if (!notes.includes(noteText)) {
              notes.push(noteText);
            }
          }
        }
      }
    }

    return { text: convertedText, notes };
  };

  return (
    <RegionContext.Provider
      value={{
        region,
        regionDetail: REGIONS_INFO[region] || REGIONS_INFO.nam,
        changeRegion,
        getRegionalWord,
        convertContentWithNotes,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
};

export const useRegion = () => useContext(RegionContext);
