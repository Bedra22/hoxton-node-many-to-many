import Database from "better-sqlite3";

const db = Database('./db/data.db', { verbose: console.log })

const applicants = [
    {
        id: 1,
        name: "Bedra Kraja",
        email: "bedra@gmil.com"
    },
    {
        id: 2,
        name: "Uarda Kraja",
        email: "uarda@gmil.com"
    },
    {
        id: 3,
        name: "Sejda Kraja",
        email: "sejda@gmil.com"
    },
]

const interviews = [
    {
        applicantsId: 1,
        interviewersId: 1,
        date: "22/09/2022",
        score: 7
    },
    {
        applicantsId: 1,
        interviewersId: 2,
        date: "18/06/2022",
        score: 10
    },
    {
        applicantsId: 2,
        interviewersId: 2,
        date: "30/08/2022",
        score: 9
    },
    {
        applicantsId: 3,
        interviewersId: 1,
        date: "02/09/2022",
        score: 3
    },
    {
        applicantsId: 3,
        interviewersId: 2,
        date: "02/09/2022",
        score: 8
    }
]

const interviewers = [
    {
        id: 1,
        name: "Ed",
        email: "ed.putans@hoxton.com"
    },
    {
        id: 2,
        name: "Nicolas",
        email: "nico.marcora@hoxton.com"
    }
]

const deleteApplicantsTable = db.prepare(`
DROP TABLE IF EXISTS applicants;
`)
deleteApplicantsTable.run()
const createApplicantsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS applicants(
    id INTEGER,
    name TEXT,
    email TEXT,
    PRIMARY KEY (id)
);
`)
createApplicantsTable.run()
const addNewApplicationInTable = db.prepare(`
INSERT INTO applicants (name,email) VALUES (@name,@email)
`)
for (let applicant of applicants) {
    addNewApplicationInTable.run(applicant)
}


const deleteInterviewersTable = db.prepare(`
DROP TABLE IF EXISTS interviewers;
`)
deleteInterviewersTable.run()
const createInterviewersTable = db.prepare(`
CREATE TABLE IF NOT EXISTS interviewers(
    id INTEGER,
    name TEXT,
    email TEXT,
    PRIMARY KEY (id)
);
`)
createInterviewersTable.run()
const addNewInterviewersInTable = db.prepare(`
INSERT INTO interviewers (name,email) VALUES (@name,@email)
`)
for (let interviewer of interviewers) {
    addNewInterviewersInTable.run(interviewer)
}



const createInterviewsTable = db.prepare(`
CREATE TABLE IF NOT EXISTS interviews (
    id INTEGER,
    applicantsId INTEGER NOT NULL,
    interviewersId INTEGER NOT NULL,
    date TEXT,
    score INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (applicantsId) REFERENCES applicants(id) ON DELETE CASCADE,
    FOREIGN KEY (interviewersId) REFERENCES interviewers(id) ON DELETE CASCADE
);
`)
createInterviewsTable.run()
const addNewInterviewsInTable = db.prepare(`
INSERT INTO interviews (applicantsId,interviewersId, date, score) VALUES (@applicantsId,@interviewersId,@date,@score)
`)
for (let interview of interviews) {
    addNewInterviewsInTable.run(interview)
}