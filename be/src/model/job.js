import mongoose from "mongoose";
const { Schema } = mongoose;
import userModel from "./user";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    userId: {  
      type: Schema.Types.ObjectId,
      ref: userModel,
    },
    applicants: [{
      type: Schema.Types.ObjectId,
      ref: userModel,
    }],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

jobSchema.index({ '$**': 'text' });


const jobModel = mongoose.model("job", jobSchema);

export default jobModel;
