import mongoose from "mongoose";

mongoose.connect('mongodb://localhost/reddit-clone', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});