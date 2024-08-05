import { useSQLiteContext } from "expo-sqlite";

export function StudentsService() {

    const db = useSQLiteContext();

    const addStudent = async (classroom_id, name, callback) => {
        const statement = await db.prepareAsync("INSERT INTO Students (classroom_id, name, feedback) VALUES ($classroom_id, $name, 'Nenhuma observação.');");
        try {
            const result = await statement.executeAsync({ $classroom_id: classroom_id, $name: name });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    const getStudents = async (classroom_id, callback) => {
        try {
            const result = await db.getAllAsync(`
                SELECT
                    Students.id,
                    Students.name,
                    Students.classroom_id,
                    Students.feedback,
                    SUM(CASE WHEN Attendances_Students.status = 'presente' THEN 1 ELSE 0 END) AS total_attendance,
                    SUM(CASE WHEN Attendances_Students.status = 'ausente' THEN 1 ELSE 0 END) AS total_absence
                FROM
                    Students
                LEFT JOIN
                    Attendances_Students ON Attendances_Students.student_id = Students.id
                WHERE
                    Students.classroom_id = ${classroom_id}
                GROUP BY
                    Students.id, Students.name, Students.classroom_id;
            `);
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        }
    };

    const updateStudent = async (id, classroom_id, name, feedback, callback) => {
        const statement = await db.prepareAsync('UPDATE Students SET classroom_id = $classroom_id, name = $name, feedback = $feedback WHERE id = $id;');
        try {
            const result = await statement.executeAsync({ $classroom_id: classroom_id, $name: name, $feedback: feedback, $id: id });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    const deleteStudent = async (id, callback) => {
        const statement = await db.prepareAsync('DELETE FROM Students WHERE id = $id;');
        try {
            const result = await statement.executeAsync({ $id: id });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    return { addStudent, getStudents, updateStudent, deleteStudent };
}