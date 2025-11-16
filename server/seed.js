import 'dotenv/config';
import mongoose from 'mongoose';
import Problem from './models/Problem.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dsa_sheet';

const topics = [
  {
    _id: "t_algorithms_001",
    name: "Algorithms",
    status: "Pending",
    order: 1,
    subTopics: [
      {
        _id: "6918e8209303d7a6a670e603",
        name: "Two Sum",
        leetcode: "https://leetcode.com/problems/two-sum",
        youtube: "https://www.youtube.com/watch?v=KLlXCFG5TnA",
        article: "https://leetcode.com/problems/two-sum/solution/",
        level: "Easy",
        status: "Pending",
        order: 1
      },
      {
        _id: "alg_sorting_001",
        name: "Sorting Algorithms",
        leetcode: "https://leetcode.com/tag/sort/",
        youtube: "https://www.youtube.com/watch?v=pkkFqlG0Hds",
        article: "https://www.geeksforgeeks.org/sorting-algorithms/",
        level: "Easy",
        status: "Done",
        order: 2
      },
      {
        _id: "alg_divide_001",
        name: "Divide and Conquer",
        leetcode: "https://leetcode.com/tag/divide-and-conquer/",
        youtube: "https://www.youtube.com/watch?v=8hly31xKli0",
        article: "https://www.geeksforgeeks.org/divide-and-conquer-algorithm-introduction/",
        level: "Medium",
        status: "Done",
        order: 3
      },
      {
        _id: "alg_dp_001",
        name: "Dynamic Programming",
        leetcode: "https://leetcode.com/tag/dynamic-programming/",
        youtube: "https://www.youtube.com/watch?v=oBt53YbR9Kk",
        article: "https://www.topcoder.com/community/competitive-programming/tutorials/dynamic-programming/",
        level: "Medium",
        status: "Pending",
        order: 4
      },
      {
        _id: "alg_backtrack_001",
        name: "Backtracking",
        leetcode: "https://leetcode.com/tag/backtracking/",
        youtube: "https://www.youtube.com/watch?v=7fujbpJ0LB4",
        article: "https://www.geeksforgeeks.org/backtracking-algorithms/",
        level: "Hard",
        status: "Pending",
        order: 5
      }
    ]
  },
  {
    _id: "t_datastructures_001",
    name: "Data Structures",
    status: "Pending",
    order: 2,
    subTopics: [
      {
        _id: "ds_arrays_001",
        name: "Arrays & Two Pointers",
        leetcode: "https://leetcode.com/tag/array/",
        youtube: "https://www.youtube.com/watch?v=8hly31xKli0",
        article: "https://www.geeksforgeeks.org/array-data-structure/",
        level: "Easy",
        status: "Pending",
        order: 1
      },
      {
        _id: "ds_linkedlist_001",
        name: "Linked List Basics",
        leetcode: "https://leetcode.com/problems/reverse-linked-list",
        youtube: "https://www.youtube.com/watch?v=Koa8-8aR8vE",
        article: "https://www.geeksforgeeks.org/data-structures/linked-list/",
        level: "Easy",
        status: "Pending",
        order: 2
      },
      {
        _id: "6918e8209303d7a6a670e605",
        name: "Reverse Linked List",
        leetcode: "https://leetcode.com/problems/reverse-linked-list",
        youtube: "https://www.youtube.com/watch?v=G0_I-ZF0S38",
        article: "https://leetcode.com/problems/reverse-linked-list/solution/",
        level: "Easy",
        status: "Pending",
        order: 3
      },
      {
        _id: "ds_trees_001",
        name: "Trees & Graphs",
        leetcode: "https://leetcode.com/tag/tree/",
        youtube: "https://www.youtube.com/watch?v=uzkg6G7SkNc",
        article: "https://www.geeksforgeeks.org/binary-tree-data-structure/",
        level: "Medium",
        status: "Pending",
        order: 4
      }
    ]
  },
  {
    _id: "t_databases_001",
    name: "Databases",
    status: "Pending",
    order: 3,
    subTopics: [
      {
        _id: "db_sql_001",
        name: "SQL Basics",
        leetcode: "",
        youtube: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
        article: "https://www.w3schools.com/sql/",
        level: "Easy",
        status: "Pending",
        order: 1
      },
      {
        _id: "db_normalization_001",
        name: "Normalization",
        leetcode: "",
        youtube: "https://www.youtube.com/watch?v=UrYLYV7WSHM",
        article: "https://www.geeksforgeeks.org/database-normalization/",
        level: "Medium",
        status: "Pending",
        order: 2
      },
      {
        _id: "db_indexing_001",
        name: "Indexing & Optimization",
        leetcode: "",
        youtube: "https://www.youtube.com/watch?v=SaFz1w0ZzEY",
        article: "https://use-the-index-luke.com/",
        level: "Medium",
        status: "Pending",
        order: 3
      }
    ]
  },
  {
    _id: "t_ml_001",
    name: "Machine Learning",
    status: "Pending",
    order: 4,
    subTopics: [
      {
        _id: "ml_intro_001",
        name: "ML Basics",
        leetcode: "",
        youtube: "https://www.youtube.com/watch?v=GwIo3gDZCVQ",
        article: "https://www.coursera.org/learn/machine-learning",
        level: "Easy",
        status: "Pending",
        order: 1
      },
      {
        _id: "ml_supervised_001",
        name: "Supervised Learning",
        leetcode: "",
        youtube: "https://www.youtube.com/watch?v=ukzFI9rgwfU",
        article: "https://scikit-learn.org/stable/tutorial/",
        level: "Medium",
        status: "Pending",
        order: 2
      }
    ]
  },
  {
    _id: "t_os_001",
    name: "Operating Systems",
    status: "Pending",
    order: 5,
    subTopics: [
      {
        _id: "os_processes_001",
        name: "Processes & Threads",
        leetcode: "",
        youtube: "https://www.youtube.com/watch?v=26QPDBe-NB8",
        article: "https://www.geeksforgeeks.org/process-vs-thread-in-operating-system/",
        level: "Medium",
        status: "Pending",
        order: 1
      },
      {
        _id: "os_memory_001",
        name: "Memory Management",
        leetcode: "",
        youtube: "https://www.youtube.com/watch?v=VFil2Uu0A2k",
        article: "https://www.geeksforgeeks.org/memory-management-in-operating-system/",
        level: "Medium",
        status: "Pending",
        order: 2
      }
    ]
  },
  {
    _id: "t_networks_001",
    name: "Networks",
    status: "Pending",
    order: 6,
    subTopics: [
      {
        _id: "net_tcpip_001",
        name: "TCP / IP & OSI",
        leetcode: "",
        youtube: "https://www.youtube.com/watch?v=9QwBTgG9Y7w",
        article: "https://www.geeksforgeeks.org/introduction-of-computer-network/",
        level: "Easy",
        status: "Pending",
        order: 1
      },
      {
        _id: "net_routing_001",
        name: "Routing & Switching",
        leetcode: "",
        youtube: "https://www.youtube.com/watch?v=G3pGQ6z4f9k",
        article: "https://www.cloudflare.com/learning/ddos/glossary/routing/",
        level: "Medium",
        status: "Pending",
        order: 2
      }
    ]
  },
  {
    _id: "t_math_001",
    name: "Mathematics",
    status: "Pending",
    order: 7,
    subTopics: [
      {
        _id: "math_prob_001",
        name: "Probability & Combinatorics",
        leetcode: "",
        youtube: "https://www.youtube.com/watch?v=2MZ6S4zO1x4",
        article: "https://www.khanacademy.org/math/statistics-probability",
        level: "Medium",
        status: "Pending",
        order: 1
      },
      {
        _id: "math_linear_001",
        name: "Linear Algebra",
        leetcode: "",
        youtube: "https://www.youtube.com/watch?v=kjBOesZCoqc",
        article: "https://www.khanacademy.org/math/linear-algebra",
        level: "Easy",
        status: "Pending",
        order: 2
      }
    ]
  },
  {
    _id: "t_softwareeng_001",
    name: "Software Engineering",
    status: "Pending",
    order: 8,
    subTopics: [
      {
        _id: "se_design_001",
        name: "System Design Basics",
        leetcode: "",
        youtube: "https://www.youtube.com/watch?v=Zb8g4H2K0X8",
        article: "https://www.educative.io/courses/grokking-the-system-design-interview",
        level: "Medium",
        status: "Pending",
        order: 1
      },
      {
        _id: "se_testing_001",
        name: "Testing & TDD",
        leetcode: "",
        youtube: "https://www.youtube.com/watch?v=1N9o5-6nNn8",
        article: "https://www.guru99.com/software-testing.html",
        level: "Easy",
        status: "Pending",
        order: 2
      }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Delete all existing data
    await Problem.deleteMany({});
    await User.deleteMany({});
    console.log('Old data cleared');

    // Insert all topics
    await Problem.insertMany(topics);
    console.log('Topics seeded successfully');

    // Create demo user with progress
    const passwordHash = await bcrypt.hash('password123', 10);
    await User.create({
      _id: 'u_demo_001',
      name: 'Demo User',
      email: 'test@demo.com',
      passwordHash,
      userProgress: {
        userId: 'u_demo_001',
        completed: [
          { problemId: 'alg_sorting_001', completedAt: new Date('2025-11-10T08:00:00.000Z') },
          { problemId: 'alg_divide_001', completedAt: new Date('2025-11-12T09:30:00.000Z') },
          { problemId: '6918e8209303d7a6a670e603', completedAt: new Date('2025-11-15T22:47:45.189Z') }
        ]
      }
    });
    console.log('Demo user created: test@demo.com / password123');

    console.log('Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();