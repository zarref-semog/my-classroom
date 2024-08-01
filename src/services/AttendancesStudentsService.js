import { useSQLiteContext } from "expo-sqlite";

export function AttendancesStudentsService() {

    const db = useSQLiteContext();

    const addAttendanceStudent = async (attendance_id, student_id, status, callback) => {
        const statement = await db.prepareAsync('INSERT INTO Attendances_Students (attendance_id, student_id, status) VALUES ($attendance_id, $student_id, $status);');
        try {
            const result = await statement.executeAsync({ $attendance_id: attendance_id, $student_id: student_id, $status: status });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    const getAttendancesStudents = async (callback) => {
        try {
            const result = await db.getAllAsync('SELECT * FROM Attendances_Students;');
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        }
    };

    const updateAttendanceStudent = async (id, attendance_id, student_id, status, callback) => {
        const statement = await db.prepareAsync('UPDATE Attendances_Students SET attendance_id = $attendance_id, student_id = $student_id, status = $status WHERE id = $id;');
        try {
            const result = await statement.executeAsync({ $attendance_id: attendance_id, $student_id: student_id, $status: status, $id: id });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    const deleteAttendanceStudent = async (id, callback) => {
        const statement = await prepareAsync('DELETE FROM Attendances_Students WHERE id = $id;');
        try {
            const result = await statement.executeAsync({ $id: id });
            callback(result);
        } catch (e) {
            console.log('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    return { addAttendanceStudent, getAttendancesStudents, updateAttendanceStudent, deleteAttendanceStudent };

}