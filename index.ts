import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'

const db = Database('./db/data.db', { verbose: console.log })
const app = express()
const port = 5000

app.use(express.json())
app.use(cors())

const getInterviewersById = db.prepare(`
SELECT * FROM interviewers WHERE id=@id;
`)

const getApplicantsById = db.prepare(`
SELECT * FROM applicants WHERE id=@id;
`)

const getInterviewDoneByApplicants = db.prepare(`
SELECT * FROM interviews WHERE applicantsId=@applicantsId;
`)

const getInterviewDoneForInterviewers = db.prepare(`
SELECT * FROM interviews WHERE interviewersId=@interviewersId;
`)

const interviewersThatInterviewedApplicants = db.prepare(`
SELECT interviewers.* FROM interviewers 
JOIN interviews ON interviewers.id=interviews.interviewersId
 WHERE interviews.applicantsId=@applicantsId; 
`)

const applicantsInterviewedByIntervewrs = db.prepare(`
SELECT applicants.* FROM applicants 
JOIN interviews ON applicants.id=interviews.applicantsId
WHERE interviews.interviewersId=@interviewersId;
`)



app.listen(port, () => {
    console.log(`App is runngind on http://localhost:${port}/`)
})