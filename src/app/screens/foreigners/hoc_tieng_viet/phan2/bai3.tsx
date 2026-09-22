// Phần 2 - Bài 3: Âm đệm và âm chính
import React from 'react';
import SkillMenuScreen, { SkillItem } from '../SkillMenuScreen';
const THEME = '#0891B2';
const skills: SkillItem[] = [
  { id: 1, title: 'Phát âm', subtitle: 'Pronunciation', emoji: '🗣️', screenName: 'SkillPhatAm', subSkills: [{ label: '1.1. Tập phát âm', labelEn: 'Pronunciation Practice', screenName: 'SkillPhatAm' }, { label: '1.2. Tập ghép và đọc tổ hợp âm', labelEn: 'Sound Combinations', screenName: 'SkillPhatAm' }, { label: '1.3. Thanh điệu', labelEn: 'Tones', screenName: 'SkillPhatAm' }] },
  { id: 2, title: 'Nghe và lập lại', subtitle: 'Listen and Repeat', emoji: '👂', screenName: 'SkillNgheLapLai' },
  { id: 3, title: 'Tập đọc', subtitle: 'Reading Practice', emoji: '📖', screenName: 'SkillTapDoc', subSkills: [{ label: '3.1. Đọc các chữ', labelEn: 'Read Characters', screenName: 'SkillTapDoc' }, { label: '3.2. Tập đối thoại', labelEn: 'Dialogue Practice', screenName: 'SkillTapDoc' }] },
  { id: 4, title: 'Ngữ pháp', subtitle: 'Grammar', emoji: '📐', screenName: 'SkillNguPhap' },
  { id: 5, title: 'Nhận diện và thay thế', subtitle: 'Recognition and Substitution', emoji: '🔄', screenName: 'SkillNhanDien' },
  { id: 6, title: 'Viết chính tả', subtitle: 'Dictation Writing', emoji: '✍️', screenName: 'SkillChinhTa' },
];
interface Props { navigation: any; }
const Phan2Bai3: React.FC<Props> = ({ navigation }) => (
  <SkillMenuScreen navigation={navigation} lessonTitle="Âm đệm và âm chính" lessonSubtitle="Medial and Main Vowels" lessonNumber={3} themeColor={THEME} skills={skills} onBack={() => navigation.goBack()} />
);
export default Phan2Bai3;
