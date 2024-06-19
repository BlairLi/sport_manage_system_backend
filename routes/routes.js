import express from 'express'
import { createSchedule, getSchedule, updateSchedule ,deleteSchedule, addSession, deleteSession, getSession, getPersonSessionsDuration } from '../controllers/scheduleControllers.js'
import { createRegistration, getRegistration, deleteRegistration } from '../controllers/registrationControllers.js'

const routers=express.Router()

routers.post('/createSchedule',createSchedule)
routers.get('/getSchedule',getSchedule)
routers.put('/updateSchedule/:id',updateSchedule)
routers.delete('/deleteSchedule/:id',deleteSchedule)

routers.post('/createRegistration',createRegistration)
routers.get('/getRegistration',getRegistration)
// routers.put('/update/:id',Updated)
routers.delete('/deleteRegistration/:id',deleteRegistration)

routers.get('/getSession',getSession)
routers.post('/addSession/:id', addSession);
routers.delete('/deleteSession/:scheduleId/:sessionId', deleteSession);

routers.get('/getPersonSessionsDuration', getPersonSessionsDuration);

export default routers