import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs/dist/bcrypt.js';
import fs from 'fs';
import random from 'lodash/random.js';
import mongoose from 'mongoose';

// Generate fake user data
const generateFakeUser = () => ({
  id: new mongoose.Types.ObjectId(),
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: bcrypt.hashSync(faker.internet.password(), 10),
  withPassword: true,
  avatar: faker.image.avatar(),
  bio: faker.lorem.sentence(),
  role: 'user',
  following: [],
  followers: [],
  blogs: [],
  history: [],
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});

// Generate fake blog data
const generateFakeBlog = (users) => ({
  id: new mongoose.Types.ObjectId(),
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(),
  author: users[random(0, users.length - 1)].id,
  imageURL: faker.image.url(),
  category: faker.lorem.word(),
  tags: [],
  isPublished: faker.datatype.boolean(),
  likes: [],
  comments: [],
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
});

const generateData = async () => {
  // Generate fake users
  const users = [];
  for (let i = 0; i < 15; i++) {
    const fakeUser = generateFakeUser();
    users.push(fakeUser);
  }

  // Save user data to JSON file
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2), 'utf-8');
  console.log('User data saved to users.json');

  // Generate fake blogs using user IDs
  
  const blogs = [];
  for (let i = 0; i < 50; i++) {
    const fakeBlog = generateFakeBlog(users);
    blogs.push(fakeBlog);
  }

  // Save blog data to JSON file
  fs.writeFileSync('blogs.json', JSON.stringify(blogs, null, 2), 'utf-8');
  console.log('Blog data saved to blogs.json');
};

// Generate data and save to files
generateData();
