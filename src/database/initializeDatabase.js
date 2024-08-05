export default async function initializeDatabase(db) {

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS Classrooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        );

        CREATE TABLE IF NOT EXISTS Attendances (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            classroom_id INTEGER,
            date TEXT,
            FOREIGN KEY (classroom_id) REFERENCES Classrooms(id)
        );

        CREATE TABLE IF NOT EXISTS Students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            classroom_id INTEGER,
            name TEXT,
            feedback TEXT,
            FOREIGN KEY (classroom_id) REFERENCES Classrooms(id)
        );

        CREATE TABLE IF NOT EXISTS Assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            classroom_id INTEGER,
            name TEXT,
            passing_score REAL,
            FOREIGN KEY (classroom_id) REFERENCES Classrooms(id)
        );

        CREATE TABLE IF NOT EXISTS Activities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            classroom_id INTEGER,
            description TEXT,
            status TEXT,
            FOREIGN KEY (classroom_id) REFERENCES Classrooms(id)
        );

        CREATE TABLE IF NOT EXISTS Schedules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            classroom_id INTEGER,
            week_day TEXT,
            start_time TEXT,
            end_time TEXT,
            FOREIGN KEY (classroom_id) REFERENCES Classrooms(id)
        );

        CREATE TABLE IF NOT EXISTS Attendances_Students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            attendance_id INTEGER,
            student_id INTEGER,
            status TEXT,
            FOREIGN KEY (attendance_id) REFERENCES Attendances(id),
            FOREIGN KEY (student_id) REFERENCES Students(id)
        );

        CREATE TABLE IF NOT EXISTS Scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            assessment_id INTEGER,
            student_id INTEGER,
            score REAL,
            FOREIGN KEY (assessment_id) REFERENCES Assessments(id),
            FOREIGN KEY (student_id) REFERENCES Students(id)
        );
    `)
}