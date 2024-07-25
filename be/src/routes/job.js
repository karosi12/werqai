import express from "express";
import authenticate from "../middlewares/authenticate";
import jobCtrl from "../controller/job";
const jobRouter = express.Router();

jobRouter.post("/api/job", authenticate, jobCtrl.create);
jobRouter.get("/api/jobs", authenticate, jobCtrl.list);
jobRouter.get("/api/job/:id", jobCtrl.view);
jobRouter.put("/api/job/apply", authenticate, jobCtrl.apply);


export default jobRouter;
