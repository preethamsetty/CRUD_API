import Post from '../models/posts';

export class PostService {
  async createPost(data: string) {
    return Post.create(data);
  }

  async getPosts() {
    return Post.find();
  }

  async getPostById(id: string) {
    return Post.findById(id);
  }

  async updatePost(id: string, data: any) {
    return Post.findByIdAndUpdate(id, data, { new: true });
  }

  async deletePost(id: string) {
    return Post.findByIdAndDelete(id);
  }
}
