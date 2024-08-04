import { useSQLiteContext } from "expo-sqlite";

export function SchedulesService() {

    const db = useSQLiteContext();

    const addSchedule = async (classroom_id, week_day, start_time, end_time, callback) => {
        const statement = await db.prepareAsync('INSERT INTO Schedules (classroom_id, week_day, start_time, end_time) VALUES ($classroom_id, $week_day, $start_time, $end_time);');
        try {
            const result = await statement.executeAsync({ $classroom_id: classroom_id, $week_day: week_day, $start_time: start_time, $end_time: end_time});
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    const getSchedules = async (callback) => {
        try {
            const result = await db.getAllAsync(`
                SELECT
                    Schedules.id,
                    Schedules.classroom_id,
                    Schedules.week_day,
                    Schedules.start_time,
                    Schedules.end_time,
                    Classrooms.id AS classroom_id,
                    Classrooms.name AS classroom_name
                FROM
                    Schedules
                INNER JOIN
                    Classrooms ON Classrooms.id = Schedules.classroom_id;
            `);
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        }
    };

    const updateSchedule = async (id, classroom_id, week_day, start_time, end_time, callback) => {
        const statement = await db.prepareAsync('UPDATE Schedules SET classroom_id = $classroom_id, week_day = $week_day, start_time = $start_time, end_time = $end_time WHERE id = $id;');
        try {
            const result = await statement.executeAsync({ $classroom_id: classroom_id, $week_day: week_day, $start_time: start_time, $end_time: end_time, $id: id });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally { 
            statement.finalizeAsync();
        }
    };

    const deleteSchedule = async (id, callback) => {
        const statement = await db.prepareAsync('DELETE FROM Schedules WHERE id = $id;');
        try {
            const result = await statement.executeAsync({ $id: id });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    return { addSchedule, getSchedules, updateSchedule, deleteSchedule };
}