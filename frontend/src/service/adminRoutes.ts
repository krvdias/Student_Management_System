import { LoginData, LogoutData, refreshTokenData, RegisterData, EventData, StudentData, TeacherData, MarkData, MarkRequest, ClassForm, SubjectForm, FeesForm, PaymentForm } from "@/constants/types";
import API from "./APIs";

//Auth Routes
export const adminLogin = (data: LoginData) => API.post('/admin/login', data);
export const refreshToken = (data: refreshTokenData) => API.post('/admin/refreshToken', data);
export const adminRegister = (data: RegisterData) => API.post('/admin/register', data);
export const adminLogout = (data: LogoutData) => API.post('/admin/logout', data);

//Dashboard Summary Routes
export const summary = () => API.get('admin/summary');

//Event Routes
export const addEvent = (data: EventData) => API.post('/admin/addEvent', data);
export const getEvents = () => API.get('/admin/getEvents');
export const editEvent = (data: EventData, id: number) => API.put(`/admin/editEvent/${id}`, data);
export const deleteEvent = (id: number) => API.delete(`/admin/deleteEvent/${id}`);

//Student Routes
export const addStudent = (data: StudentData) => API.post('/admin/addStudent', data);
export const searchStudents = (data: {searchTerm : string}) => API.post('/admin/fetchStudents', data);
export const getStudent = (id: number) => API.get(`/admin/getStudent/${id}`);
export const editStudent = (data: StudentData, id: number) => API.put(`/admin/editStudent/${id}`, data);
export const deleteStudent = (id: number) => API.delete(`/admin/deleteStudent/${id}`);

//Class Routes
export const addClass = (data: ClassForm) => API.post('/admin/addClass', data);
export const searchClass = (data: {searchTerm : string}) => API.post('/admin/searchClass', data);
export const getClasses = () => API.get(`/admin/getClasses`);
export const editClass = (data: ClassForm, id: number) => API.put(`/admin/editClass/${id}`, data);
export const deleteClass = (id: number) => API.delete(`/admin/deleteClass/${id}`);

//Teacher Routes
export const addTeacher = (data: TeacherData) => API.post('/admin/addTeacher', data);
export const searchTeachers = (data: {searchTerm : string}) => API.post('/admin/searchTeachers', data);
export const editTeacher = (data: TeacherData, id: number) => API.put(`/admin/editTeacher/${id}`, data);
export const deleteTeacher = (id: number) => API.delete(`/admin/deleteTeacher/${id}`);

//Mark Routes
export const addMark = (data: MarkData) => API.post('/admin/addMark', data);
export const addStudentMark = (data: string, id: number) => API.post(`/admin/addStudentMark/${id}`, data);
export const markSummary = (data: {searchTerm : string}) => API.post('/admin/markSummery', data);
export const getMarks = (data: MarkRequest) => API.post(`/admin/getMarks`, data);
export const getAllMarks = (data: MarkRequest) => API.post(`/admin/getAllMarks`, data);
export const editMark = (data: MarkData, id: number) => API.put(`/admin/editMark/${id}`, data);
export const deleteMark = (id: number) => API.delete(`/admin/deleteMark/${id}`);

//Subjects Routes
export const addSubject = (data: SubjectForm) => API.post('/admin/addSubject', data);
export const searchSubject = (data: {searchTerm : string}) => API.post('/admin/searchSubject', data);
export const getSubjects = () => API.get(`/admin/getSubjects`);
export const editSubject = (data: SubjectForm, id: number) => API.put(`/admin/editSubject/${id}`, data);
export const deleteSubject = (id: number) => API.delete(`/admin/deleteSubject/${id}`);

//Fees Routes
export const addFees = (data: FeesForm) => API.post('/admin/addFees', data);
export const searchFees = (data: {searchTerm : string}) => API.post('/admin/searchFees', data);
export const getFees = (id: number) => API.get(`/admin/getFees/${id}`);
export const editFees = (data: FeesForm, id: number) => API.put(`/admin/editFees/${id}`, data);
export const deleteFees = (id: number) => API.delete(`/admin/deleteFees/${id}`);

//Payment Fees Routes
export const addPayment = (data: PaymentForm) => API.post('/admin/addPayment', data);
export const searchPayment = (data: {searchTerm : string}) => API.post('/admin/searchPayment', data);
export const getPayment = (id: number | null) => API.get(`/admin/getPayment/${id}`);