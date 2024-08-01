import { useSQLiteContext } from "expo-sqlite";

export function AttendancesService() {

    const db = useSQLiteContext();

    const addAttendance = async (classroom_id, date, callback) => {
        const statement = await db.prepareAsync('INSERT INTO Attendances (classroom_id, date) VALUES ($classroom_id, $date);');
        try {
            const result = await statement.executeAsync({ $classroom_id: classroom_id, $date: date });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    const getAttendances = async (callback) => {
        try {
            const result = await db.getAllAsync('SELECT * FROM Attendances;');
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        }
    };

    const updateAttendance = async (id, classroom_id, date, callback) => {
        const statement = await db.prepareAsync('UPDATE Attendances SET classroom_id = $classroom_id, date = $date WHERE id = $id;');
        try {
            const result = await statement.executeAsync({ $classroom_id: classroom_id, $date: date, $id: id });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    const deleteAttendance = async (id, callback) => {
        const statement = await db.prepareAsync('DELETE FROM Attendances WHERE id = $id;');
        try {
            const result = await statement.executeAsync({ $id: id });
            callback(result);
        } catch (e) {
            console.log('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    return { addAttendance, getAttendances, updateAttendance, deleteAttendance };
}