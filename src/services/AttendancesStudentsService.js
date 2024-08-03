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

    const addManyAttendanceStudent = async (attendances, attendance_id) => {
        if (!Array.isArray(attendances) || attendances.some(att => !att.student_id || !att.status)) {
            console.error('Invalid attendances array');
            return;
        }

        let sql = '';
        attendances.forEach(att => {
            sql += `INSERT INTO Attendances_Students (attendance_id, student_id, status) VALUES (${attendance_id}, ${att.student_id}, '${att.status}');`
        });

        try {
            await db.execAsync(sql);
        } catch (e) {
            console.error('Error: ', e);
        }
    };

    const getAttendancesStudents = async (attendance_id, callback) => {
        try {
            const result = await db.getAllAsync(`
                SELECT 
                    Attendances_Students.id AS id,
                    Attendances_Students.attendance_id,
                    Attendances_Students.student_id AS student_id,
                    Attendances_Students.status,
                    Students.id AS student_id,
                    Students.name AS student_name
                FROM 
                    Attendances_Students
                INNER JOIN 
                    Students ON Students.id = Attendances_Students.student_id
                WHERE 
                    Attendances_Students.attendance_id = ${attendance_id};
            `);
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
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    return { addAttendanceStudent, addManyAttendanceStudent, getAttendancesStudents, updateAttendanceStudent, deleteAttendanceStudent };

}