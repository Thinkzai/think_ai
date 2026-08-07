import mockData from '../data/forumData.json';

const delay = (ms = 350) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const clone = (value) => JSON.parse(JSON.stringify(value));

let db = null;

function loadDb() {
  if (!db) {
    db = clone(mockData);
  }
  return db;
}

export const ForumApi = {
  async getPosts() {
    await delay();
    const { posts } = loadDb();
    return clone(posts).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  },

  async getUsers() {
    await delay(200);
    const { users } = loadDb();
    return clone(users);
  },

  async getUserById(userId) {
    await delay(150);
    const { users } = loadDb();
    return clone(users.find((u) => u.id === userId) ?? null);
  },

  async getTags() {
    await delay(120);
    const { tags } = loadDb();
    return clone(tags);
  },

  async votePost(postId, direction) {
    await delay(150);
    const { posts } = loadDb();
    const post = posts.find((p) => p.id === postId);
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }
    if (direction === 'up') {
      post.upvotes += 1;
    } else if (direction === 'down') {
      post.downvotes += 1;
    } else {
      throw new Error('direction must be "up" or "down"');
    }
    return clone(post);
  },

  async toggleSolved(postId) {
    await delay(120);
    const { posts } = loadDb();
    const post = posts.find((p) => p.id === postId);
    if (!post) {
      throw new Error(`Post ${postId} not found`);
    }
    post.isSolved = !post.isSolved;
    return clone(post);
  },
};

export const getForumPosts = (options = {}) =>
  ForumApi.getPosts(options);
