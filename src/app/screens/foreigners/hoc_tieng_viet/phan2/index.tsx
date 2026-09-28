// Phần 2: Phát âm - Duolingo Roadmap
import React from 'react';
import DuolingoRoadmap, { LessonNode } from '../DuolingoRoadmap';

const THEME_COLOR = '#0891B2';

const lessons: LessonNode[] = [
  {
    id: 1,
    title: 'Gặp nhau ở sân bay',
    subtitle: 'Meeting at the Airport',
    emoji: '✈️',
    status: 'current',
    screenName: 'Phan2Bai1',
  },
  {
    id: 2,
    title: 'Ở khách sạn và ở công ty',
    subtitle: 'At the Hotel and at the Company',
    emoji: '🏫',
    status: 'current',
    screenName: 'Phan2Bai2',
  },
  {
    id: 3,
    title: 'Khai báo ở Hải Quan',
    subtitle: 'Customs Declaration',
    emoji: '📦',
    status: 'current',
    screenName: 'Phan2Bai3',
  },
  {
    id: 4,
    title: 'Mua vé máy bay',
    subtitle: 'Buy a Plane Ticket',
    emoji: '🎫',
    status: 'current',
    screenName: 'Phan2Bai4',
  },
  {
    id: 5,
    title: 'Bài tập tổng hợp phần 2',
    subtitle: 'Comprehensive Practice Part 2',
    emoji: '🎯',
    status: 'current',
    screenName: 'Phan2Bai5',
  },
];

interface Props { navigation: any; }

const Phan2Roadmap: React.FC<Props> = ({ navigation }) => (
  <DuolingoRoadmap
    navigation={navigation}
    sectionTitle="PHẦN 2: Luyện Phát âm"
    sectionSubtitle="Pronunciation - Sounds & Tones"
    sectionColor={THEME_COLOR}
    lessons={lessons}
    onBack={() => navigation.goBack()}
  />
);

export default Phan2Roadmap;
