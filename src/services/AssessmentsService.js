import { useSQLiteContext } from "expo-sqlite";

export function AssessmentsService() {

    const db = useSQLiteContext();

    const addAssessment = async (classroom_id, name, passing_score, callback) => {
        const statement = await db.prepareAsync('INSERT INTO Assessments (classroom_id, name, passing_score) VALUES ($classroom_id, $name, $passing_score);');
        try {
            const result = await statement.executeAsync({ $classroom_id: classroom_id, $name: name, $passing_score: passing_score });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    const getAssessments = async (callback) => {
        try {
            const result = await db.getAllAsync('SELECT * FROM Assessments;');
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        }
    };

    const updateAssessment = async (id, classroom_id, name, passing_score, callback) => {
        const statement = await db.prepareAsync('UPDATE Assessments SET classroom_id = $classroom_id, name = $name, passing_score = $passing_score WHERE id = $id;');
        try {
            const result = await statement.executeAsync({ $classroom_id: classroom_id, $name: name, $passing_score: passing_score, $id: id });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    const deleteAssessment = async (id, callback) => {
        const statement = await db.prepareAsync('DELETE FROM Assessments WHERE id = $id;');
        try {
            const result = await statement.executeAsync({ $id: id });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        } finally {
            statement.finalizeAsync();
        }
    };

    return { addAssessment, getAssessments, updateAssessment, deleteAssessment };
}