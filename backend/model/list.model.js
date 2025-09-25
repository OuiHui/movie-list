import mongoose from "mongoose";

const listSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    }
  }, {
    timestamps: true
  }
);

const List = mongoose.model("List", listSchema);

export default List;
