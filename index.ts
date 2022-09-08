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

const applicantsInterviewedByInteviewers = db.prepare(`
SELECT applicants.* FROM applicants 
JOIN interviews ON applicants.id=interviews.applicantsId
WHERE interviews.interviewersId=@interviewersId;
`)

const addNewApplicationInTable = db.prepare(`
INSERT INTO applicants (name,email) VALUES (@name,@email)
`)

const addNewInterviewersInTable = db.prepare(`
INSERT INTO interviewers (name,email) VALUES (@name,@email)
`)


const addNewInterviewsInTable = db.prepare(`
INSERT INTO interviews (applicantsId,interviewersId, date, score) VALUES (@applicantsId,@interviewersId,@date,@score)
`)

app.get('/', (req, res) => {
    res.send(`<h1>Yayyy</h1>`)
})


app.get('/applicants/:id', (req, res) => {

    const applicant = getApplicantsById.get(req.params)

    if (applicant) {
        applicant.interview = getInterviewDoneByApplicants.all({ applicantsId: applicant.id })
        applicant.interviewers = interviewersThatInterviewedApplicants.all({ applicantsId: applicant.id })
        res.send(applicant)
    } else {
        res.status(404).send("Applicant not found")
    }
})

app.get('/interviewers/:id', (req, res) => {

    const interviewer = getInterviewersById.get(req.params)

    if (interviewer) {
        interviewer.interview = getInterviewDoneForInterviewers.all({ interviewersId: interviewer.id })
        interviewer.applicant = applicantsInterviewedByInteviewers.all({ interviewersId: interviewer.id })
        res.send(interviewer)
    } else {
        res.status(404).send("Interviewer not found")
    }
})

app.post('/applicants', (req, res) => {

    let errors: string[] = []

    if (typeof req.body.name != 'string') {
        errors.push("Name not found or is not a string")
    }

    if (typeof req.body.email != 'string') {
        errors.push("Email not found or is not a string")
    }

    if (errors.length === 0) {
        const info = addNewApplicationInTable.run(req.body)
        const applicant = getApplicantsById.get({ id: info.lastInsertRowid })
        applicant.interview = getInterviewDoneByApplicants.all({ applicantsId: applicant.id })
        applicant.interviewers = interviewersThatInterviewedApplicants.all({ applicantsId: applicant.id })
        res.send(applicant)

    } else {
        res.status(404).send(errors)
    }
})

app.post('/interviewers', (req, res) => {

    let errors: string[] = []

    if (typeof req.body.name != 'string') {
        errors.push("Name not found or is not a string")
    }

    if (typeof req.body.email != 'string') {
        errors.push("Email not found or is not a string")
    }
})


app.listen(port, () => {
    console.log(`App runs on http://localhost:${port}/`)
})