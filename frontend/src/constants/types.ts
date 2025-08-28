export interface LoginData {
  username: string;
  password: string;
}

export interface refreshTokenData {
    refreshToken: string
}

export interface LogoutData {
    id: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface eventData {
    id: number;
    title: string;
    coordinator: string;
    event_date: string;
    createdAt: string;
    updatedAt: string;
}

export interface EventData {
    title: string;
    coordinator: string;
    event_date: string;
}

export interface searchStudentData {
  searchTerm: string;
}

export interface ClassStudent {
  id: number
  name: string
  year: string
}

export interface Student {
  id: number
  first_name: string
  last_name: string
  dob: string
  address: string
  gender: string
  gardian: string
  religion: string
  mobile: string
  register_no: string
  addmission_date: string
  thired_or_upper: boolean
  teacher_child: boolean
  leave_date: string
  classes: number
  class: number
  classStudent: ClassStudent // Reference to ClassStudent interface
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  thiredOrUpper: boolean,
  teacherChild: boolean,
  registerNo: string,
  addmissionDate: string,
  leaveDate: string,
}

export interface StudentData {
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  address: string,
  gardian: string,
  gender: string,
  religion: string,
  mobile: string,
  thiredOrUpper: boolean,
  teacherChild: boolean,
  registerNo: string,
  addmissionDate: string,
  leaveDate: string,
  classes: number | null
}

export interface ClassData {
  id: number;
  name: string;
}

export interface Teacher {
  id: number;
  first_name: string;
  last_name: string;
  address: string;
  mobile: string;
  email: string;
  class: number | null;
  training: boolean;
}

export interface TeacherData {
  firstName: string;
  lastName: string;
  address: string;
  mobile: string;
  email: string;
  classes: number | null;
  training: boolean;
}

export interface Mark {
  id: number;
  first_name: string;
  last_name: string;
  register_no: string;
  classStudent: ClassStudent;
  performance: performance;
}

export interface performance {
  gpa: gpa;
  average: average;
}

export interface gpa {
  value: string;
  year: string;
  term: string;
}

export interface average {
  value: string;
  year: string;
  term: string;
}

export interface MarkData {
  registerNo: string;
  term: string;
  subject: number | null;
  marks: string;
}

export interface SubjectData {
  id: number;
  subject_id: string;
  name: string;
}

export interface SubjectForm {
  subjectId: string;
  name: string;
}

export interface MarkRequest {
  searchTerm: string;
  id: number | null;
}

export interface MarkResponse {
  id: number;
  marks: string;
  grade: string;
  term: string;
  year: string;
  subject: SubjectData;
}

export interface Classes {
  id: number;
  name: string;
  year: string;
  subjectCount: number;
  teacher: Teachers;
}

export interface ClassForm {
  name: string;
  year: string;
  subjectCount: number;
}

export interface Teachers {
  id: number;
  name: string;
}

export interface FeesData {
  id: number;
  class: number | null;
  amount: string;
  classFees: ClassData;
}

export interface FeesForm {
  classes: number | null;
  amount: string;
}

export interface PaymentData {
  id: number;
  term: string;
  bill_id: string;
  payed_date: string;
  fees: string;
  method: string;
  status: string;
  studentTFees: studentTFees;
}

export interface studentTFees {
  id: number;
  first_name: string;
  last_name: string;
  register_no: string;
}

export interface PaymentForm {
  student: number | null;
  billId: string;
  term: string;
  method: string;
  discount: number
}

export interface PayData {
  id: number;
  first_name: string;
  last_name: string;
  register_no: string;
  religion: string;
  thired_or_upper: boolean;
  teacher_child: boolean;
  feesTStudent: feesTStudent;
}

interface feesTStudent {
  id: number;
  term: string;
  bill_id: string;
  payed_date: string;
  fees: number;
  method: string;
  status: string;
}