import jobModel from '../model/job';
import logger from '../utils/logger';
import Responses from "../helper/responses";

const create = async (req, res) => {
  try {
    const { id: userId } = req.decoded
    if(!req.body.title) return res.status(400).send(Responses.error(400, 'job title is required'))
    if(!req.body.description) return res.status(400).send(Responses.error(400, 'job description is required'))
    if(!userId) return res.status(400).send(Responses.error(400, 'userId is required')) 
    const job = await jobModel.create({ userId, ...req.body })
    if(!job) return res.status(400).send(Responses.error(400, "unable to create job"));
    return res.status(201).send(Responses.success(201, "job created successfully", job));
  } catch (error) {
    logger.info(`Internal server error => ${error}`)
    return res.status(500).send(Responses.error(500, "Internal server error"));
  }
}

const view = async (req, res) => {
  try {
    const {id} = req.params
    const job = await jobModel.findById(id)
    if(!job) return res.status(400).send(Responses.error(400, 'job not found'))
    return res.status(200).send(Responses.success(200, 'job retrieved successfully', job));
  } catch (error) {
    logger.info(`Internal server error => ${error}`)
    return res.status(500).send(Responses.error(500, "Internal server error"));
  }
}

const list = async (req, res) => {
  try {
    const { q } = req.query;
    const search = q === undefined ? {}: { $text: { $search: `\"${q}\"` } };
    const criteria =  Object.assign({}, search);
    const job = await jobModel.find(criteria).populate('applicants userId').exec();
    if(!job) return res.status(400).send(Responses.error(400, 'job not found'))
    if(job.length === 0) return res.status(200).send(Responses.success(200, 'Record not found', job))
    return res.status(200).send(Responses.output(200, 'Record retrieved', job));
  } catch (error) {
    logger.info(`Internal server error => ${error}`)
    return res.status(500).send(Responses.error(500, "Internal server error"));
  }
}


const apply = async (req, res) => {
  try {
    const { id: userId } = req.decoded
    const { jobId } = req.body
    const check = await jobModel.findOne({_id: jobId}).exec()
    if(!check){
      return res.status(400).send(Responses.error(400, 'job not found'))
    }
    if(userId === check.userId.toString()) {
      return res.status(400).send(Responses.error(400, 'Access denied! you created the job post'))
    } 
    const job = await jobModel.findOne({_id: jobId, applicants: userId}).populate('applicants').exec();
    if (job) {
      res.status(400).send(Responses.error(400, 'You have apply to this job'))
    } else {
      check.applicants.push(userId)
      await check.save()
      return res.status(200).send(Responses.success(200, 'user applied to this job', check));
    }
  } catch (error) {
    logger.info(`Internal server error => ${error}`)
    return res.status(500).send(Responses.error(500, "Internal server error"));
  }
}

export default { create, view, list, apply }