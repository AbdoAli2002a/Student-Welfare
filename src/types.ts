export interface Student {
  id: string; // UUID
  studentId: string; // رقم الجلوس أو الكارنيه
  name: string;
  email: string;
  department: string; // القسم (تكنولوجيا التعليم، اقتصاد منزلي، الخ)
  year: number; // الفرقة
  createdAt: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  committee: 'artistic' | 'sports' | 'cultural' | 'scouting';
  date: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  rating?: number;
  reviewsCount?: number;
}

export interface SolidarityRequest {
  id: string;
  name: string;
  studentId: string;
  assistanceType: string;
  details: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface ElectionStep {
  id: string;
  title: string;
  date: string;
  icon: string;
  status: 'completed' | 'active' | 'upcoming';
}

export interface Trip {
  id: string;
  title: string;
  date: string;
  duration: string;
  price: string;
  status: 'متاح التسجيل' | 'اكتمل العدد' | 'منتهية';
  image: string;
  rating?: number;
  reviewsCount?: number;
}
