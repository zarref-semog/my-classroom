import { useSQLiteContext } from "expo-sqlite";

export function ScoresService() {

    const db = useSQLiteContext();

    const addScore = async (assessment_id, student_id, score, callback) => {
        try {
            const statement = await db.prepareAsync('INSERT INTO Scores (assessment_id, student_id, score) VALUES ($assessment_id, $student_id, $score);');
            const result = await statement.executeAsync({ $assessment_id: assessment_id, $student_id: student_id, $score: score });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        }
    };

    const getScores = async (callback) => {
        try {
            const result = await db.getAllAsync('SELECT * FROM Scores;');
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        }
    };

    const updateScore = async (id, assessment_id, student_id, score, callback) => {
        try {
            const statement = await db.prepareAsync('UPDATE Scores SET assessment_id = $assessment_id, student_id = $student_id, score = $score WHERE id = $id;');
            const result = await statement.executeAsync({ $assessment_id: assessment_id, $student_id: student_id, $score: score, $id: id });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        }
    };

    const deleteScore = async (id, callback) => {
        try {
            const statement = await db.prepareAsync('DELETE FROM Scores WHERE id = $id;');
            const result = await statement.executeAsync({ $id: id });
            callback(result);
        } catch (e) {
            console.error('Error: ', e);
        }
    };

    return { addScore, getScores, updateScore, deleteScore };
}