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