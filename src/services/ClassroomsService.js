import { useSQLiteContext } from "expo-sqlite";

export function ClassroomsService() {

    const db = useSQLiteContext();

    const addClassroom = async (name, callback) => {
        const statement = await db.prepareAsync('INSERT INTO Classrooms (name) VALUES ($name);');
        try {
            const result = await statement.executeAsync({ $name: name });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    const getClassrooms = async (callback) => {
        try {
            const result = await db.getAllAsync('SELECT * FROM Classrooms;');
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        }
    };

    const updateClassroom = async (id, name, callback) => {
        const statement = await db.prepareAsync('UPDATE Classrooms SET name = $name WHERE id = $id;');
        try {
            const result = await statement.executeAsync({ $name: name, $id: id });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    const deleteClassroom = async (id, callback) => {
        const statement = await db.prepareAsync('DELETE FROM Classrooms WHERE id = $id;');
        try {
            const result = await statement.executeAsync({ $id: id });
            callback(result);
        } catch (e) {
            console.log('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    return { addClassroom, getClassrooms, updateClassroom, deleteClassroom };
}