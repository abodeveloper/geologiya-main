export interface Menu {
  id: number;
  title_uz: string;
  title_ru?: string;
  title_en?: string;
  has_page: boolean;
  position: number;
  page_slug: string | null; // has_page = false bo‘lsa null bo‘ladi
  status: boolean;
  parent?: number | null; // qo‘shimcha: quyi menyular uchun kerak bo‘lishi mumkin
  children?: Menu[]; // har doim bo‘lmasligi mumkin, shuning uchun optional
}
