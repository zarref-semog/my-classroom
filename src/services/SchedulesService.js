import { useSQLiteContext } from "expo-sqlite";

export function SchedulesService() {

    const db = useSQLiteContext();

    const addSchedule = async (start_time, end_time, week_day, callback) => {
        const statement = await db.prepareAsync('INSERT INTO Schedules (start_time, end_time, week_day) VALUES ($start_time, $end_time, $week_day);');
        try {
            const result = await statement.executeAsync({ $start_time: start_time, $end_time: end_time, $week_day: week_day });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    const getSchedules = async (callback) => {
        try {
            const result = await db.getAllAsync('SELECT * FROM Schedules;');
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        }
    };

    const updateSchedule = async (id, start_time, end_time, week_day, callback) => {
        const statement = await db.prepareAsync('UPDATE Schedules SET start_time = $start_time, end_time = $end_time, week_day = $week_day WHERE id = $id;');
        try {
            const result = await statement.finalizeAsync({ $start_time: start_time, $end_time: end_time, $week_day: week_day, $id: id });
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
            const result = await runAsync({ $id: id });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    return { addSchedule, getSchedules, updateSchedule, deleteSchedule };
}