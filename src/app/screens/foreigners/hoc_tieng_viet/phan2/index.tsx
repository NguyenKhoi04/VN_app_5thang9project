// Phần 2: Phát âm - Duolingo Roadmap
import React, { useState, useEffect } from 'react';
import DuolingoRoadmap, { LessonNode } from '../DuolingoRoadmap';
import { API_ENDPOINTS } from '../../../../../config/api';

const THEME_COLOR = '#0891B2';

const DEFAULT_LESSONS: LessonNode[] = [
  {
    id: 1,
    title: 'BÀI 1: ÂM ĐẦU',
    subtitle: 'Lesson 1: Initial Consonants',
    emoji: '🗣️',
    status: 'current',
    screenName: 'Phan2Bai1',
  },
  {
    id: 2,
    title: 'BÀI 2: ÂM CUỐI',
    subtitle: 'Lesson 2: Final Consonants',
    emoji: '🎯',
    status: 'current',
    screenName: 'Phan2Bai2',
  },
  {
    id: 3,
    title: 'BÀI 3: ÂM ĐỆM VÀ ÂM CHÍNH',
    subtitle: 'Lesson 3: Medial and Main Vowels',
    emoji: '🎵',
    status: 'current',
    screenName: 'Phan2Bai3',
  },
  {
    id: 4,
    title: 'BÀI 4: LUYỆN TẬP TỔNG HỢP',
    subtitle: 'Lesson 4: Comprehensive Practice',
    emoji: '✍️',
    status: 'current',
    screenName: 'Phan2Bai4',
  },
  {
    id: 5,
    title: 'BÀI 5: BÀI TẬP TỔNG HỢP PHẦN 2',
    subtitle: 'Lesson 5: Comprehensive Practice Part 2',
    emoji: '🏆',
    status: 'current',
    screenName: 'Phan2Bai5',
  },
];

interface Props { navigation: any; }

const Phan2Roadmap: React.FC<Props> = ({ navigation }) => {
  const [lessons, setLessons] = useState<LessonNode[]>(DEFAULT_LESSONS);

  useEffect(() => {
    let isMounted = true;
    fetch(`${API_ENDPOINTS.GET_BAI_HOC_NN}?loai_phan=phat_am`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const emojis = ['🗣️', '🎯', '🎵', '✍️', '🏆'];
          const mapped: LessonNode[] = data.map((item: any, idx: number) => ({
            id: item.so_bai || (idx + 1),
            title: item.ten_bai_vn,
            subtitle: item.ten_bai_en,
            emoji: emojis[idx % emojis.length],
            status: 'current',
            screenName: `Phan2Bai${item.so_bai || (idx + 1)}`,
          }));
          setLessons(mapped);
        }
      })
      .catch((err) => {
        console.log('Using default Phan 2 lessons fallback:', err.message);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <DuolingoRoadmap
      navigation={navigation}
      sectionTitle="PHẦN 2: Luyện Phát âm"
      sectionSubtitle="Pronunciation - Sounds & Tones"
      sectionColor={THEME_COLOR}
      lessons={lessons}
      onBack={() => navigation.goBack()}
    />
  );
};

export default Phan2Roadmap;
