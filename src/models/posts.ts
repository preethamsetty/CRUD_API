import mongoose, { Schema, Document } from 'mongoose';

interface IPost extends Document {
  title: string;
  content: string;
  author: string;
}

const postSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

export default mongoose.model<IPost>('Post', postSchema);
