import { useSQLiteContext } from "expo-sqlite";

export function StudentsService() {

    const db = useSQLiteContext();

    const addStudent = async (classroom_id, name, callback) => {
        const statement = await db.prepareAsync('INSERT INTO Students (classroom_id, name) VALUES ($classroom_id, $name);');
        try {
            const result = await statement.executeAsync({ $classroom_id: classroom_id, $name: name });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    const getStudents = async (callback) => {
        try {
            const result = await db.getAllAsync('SELECT * FROM Students;');
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        }
    };

    const updateStudent = async (id, classroom_id, name, callback) => {
        const statement = await db.prepareAsync('UPDATE Students SET classroom_id = $classroom_id, name = $name WHERE id = $id;');
        try {
            const result = await statement.executeAsync({ $classroom_id: classroom_id, $name: name, $id: id });
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