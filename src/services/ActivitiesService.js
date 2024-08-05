import { useSQLiteContext } from "expo-sqlite";

export function ActivitiesService() {

    const db = useSQLiteContext()

    const addActivity = async (classroom_id, description, callback) => {
        const statement = await db.prepareAsync("INSERT INTO Activities (classroom_id, description) VALUES ($classroom_id, $description);");
        try {
            const result = await statement.executeAsync({ $classroom_id: classroom_id, $description: description });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    const getActivities = async (callback) => {
        try {
            const result = await db.getAllAsync(`
                SELECT 
                    Activities.id,
                    Activities.classroom_id,
                    Activities.description,
                    Classrooms.id AS classroom_id,
                    Classrooms.name AS classroom_name
                FROM 
                    Activities 
                INNER JOIN 
                    Classrooms ON Classrooms.id = Activities.classroom_id;
            `);
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        }
    };

    const updateActivity = async (id, classroom_id, description, callback) => {
        const statement = await db.prepareAsync('UPDATE Activities SET classroom_id = $classroom_id, description = $description WHERE id = $id;');
        try {
            const result = await statement.executeAsync({ $classroom_id: classroom_id, $description: description, $id: id });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    const deleteActivity = async (id, callback) => {
        const statement = await db.prepareAsync('DELETE FROM Activities WHERE id = $id;');
        try {
            const result = await statement.executeAsync({ $id: id });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    return { addActivity, getActivities, updateActivity, deleteActivity };
}