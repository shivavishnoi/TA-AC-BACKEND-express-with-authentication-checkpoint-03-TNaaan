var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sourceSchema = new Schema(
  {
    source: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    userId: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Source', sourceSchema);
