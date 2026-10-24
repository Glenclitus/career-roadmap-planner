/**
 * seedRoadmaps.js
 * Inserts realistic sample career roadmaps.
 * Safe to re-run — checks slug uniqueness before inserting.
 *
 * Usage:
 *   npm run seed:roadmaps
 */

require('dotenv').config();
const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}
const mongoose = require('mongoose');
const User = require('../src/models/User');
const CareerRoadmap = require('../src/models/CareerRoadmap');

const roadmapData = [
  {
    title: 'Software Developer',
    slug: 'software-developer',
    description:
      'A comprehensive roadmap for becoming a professional software developer. This path covers programming fundamentals, data structures, algorithms, version control, and software engineering best practices.',
    category: 'Software Development',
    difficulty: 'Beginner',
    estimatedDuration: '6–9 months',
    prerequisites: ['Basic computer literacy', 'Willingness to learn problem-solving'],
    skills: ['JavaScript', 'Python', 'Git', 'Data Structures', 'Algorithms', 'REST APIs'],
    projectSuggestions: [
      'Build a personal to-do list application',
      'Create a weather dashboard using a public API',
      'Develop a simple library management CLI tool',
    ],
    learningStages: [
      {
        title: 'Programming Fundamentals',
        description: 'Learn the core concepts of programming using Python or JavaScript.',
        order: 1,
        tasks: [
          { title: 'Understand variables, data types and operators' },
          { title: 'Learn control flow: if/else, loops' },
          { title: 'Study functions and scope' },
          { title: 'Explore arrays and objects' },
          { title: 'Practice by solving 30 beginner problems on LeetCode' },
        ],
        resources: [
          { title: 'Python.org Official Tutorial', url: 'https://docs.python.org/3/tutorial/' },
          { title: 'FreeCodeCamp JavaScript Course', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/' },
          { title: 'CS50 Introduction to Computer Science', url: 'https://cs50.harvard.edu/x/' },
        ],
      },
      {
        title: 'Data Structures & Algorithms',
        description: 'Build problem-solving skills essential for technical interviews and efficient code.',
        order: 2,
        tasks: [
          { title: 'Learn arrays, linked lists and stacks' },
          { title: 'Understand trees and graphs' },
          { title: 'Study sorting algorithms (bubble, merge, quick)' },
          { title: 'Practice searching algorithms (binary search)' },
          { title: 'Solve 50 medium problems on LeetCode' },
        ],
        resources: [
          { title: 'Visualgo — Algorithm Visualizations', url: 'https://visualgo.net/' },
          { title: 'NeetCode DSA Roadmap', url: 'https://neetcode.io/roadmap' },
        ],
      },
      {
        title: 'Version Control with Git',
        description: 'Learn to manage and collaborate on code using Git and GitHub.',
        order: 3,
        tasks: [
          { title: 'Understand repositories, commits and branches' },
          { title: 'Learn merging and rebasing' },
          { title: 'Practice pull requests on GitHub' },
          { title: 'Explore Git workflows (feature branching)' },
        ],
        resources: [
          { title: 'Pro Git Book (free)', url: 'https://git-scm.com/book/en/v2' },
          { title: 'GitHub Docs', url: 'https://docs.github.com/' },
        ],
      },
      {
        title: 'Software Engineering Practices',
        description: 'Adopt professional coding standards and software design principles.',
        order: 4,
        tasks: [
          { title: 'Study clean code principles' },
          { title: 'Learn SOLID design principles' },
          { title: 'Understand unit testing and TDD basics' },
          { title: 'Practice code review techniques' },
          { title: 'Read about Agile and Scrum' },
        ],
        resources: [
          { title: 'Clean Code by Robert C. Martin (summary)', url: 'https://www.freecodecamp.org/news/clean-coding-for-beginners/' },
          { title: 'Refactoring Guru — Design Patterns', url: 'https://refactoring.guru/design-patterns' },
        ],
      },
    ],
  },

  {
    title: 'Data Scientist',
    slug: 'data-scientist',
    description:
      'Learn to extract insights from complex datasets using statistics, machine learning and data storytelling. This roadmap covers Python, statistics, ML libraries and model deployment.',
    category: 'Data Science',
    difficulty: 'Intermediate',
    estimatedDuration: '9–12 months',
    prerequisites: ['Basic Python programming', 'High-school level mathematics'],
    skills: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Statistics', 'Matplotlib', 'SQL'],
    projectSuggestions: [
      'Analyze a real-world dataset from Kaggle',
      'Build a house price prediction model',
      'Create an exploratory data analysis notebook on a public dataset',
    ],
    learningStages: [
      {
        title: 'Python for Data Science',
        description: 'Learn Python libraries essential for data manipulation and analysis.',
        order: 1,
        tasks: [
          { title: 'Set up Python with Anaconda or venv' },
          { title: 'Master NumPy arrays and vectorized operations' },
          { title: 'Learn Pandas DataFrames and Series' },
          { title: 'Practice data cleaning and wrangling' },
          { title: 'Visualize data with Matplotlib and Seaborn' },
        ],
        resources: [
          { title: 'Python Data Science Handbook (free)', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/' },
          { title: 'Kaggle Python Course', url: 'https://www.kaggle.com/learn/python' },
        ],
      },
      {
        title: 'Statistics and Probability',
        description: 'Develop the mathematical foundation needed for machine learning.',
        order: 2,
        tasks: [
          { title: 'Study descriptive statistics (mean, median, std dev)' },
          { title: 'Understand probability distributions' },
          { title: 'Learn hypothesis testing and p-values' },
          { title: 'Study correlation and regression basics' },
        ],
        resources: [
          { title: 'Khan Academy Statistics', url: 'https://www.khanacademy.org/math/statistics-probability' },
          { title: 'StatQuest with Josh Starmer (YouTube)', url: 'https://www.youtube.com/@statquest' },
        ],
      },
      {
        title: 'Machine Learning Fundamentals',
        description: 'Build and evaluate machine learning models using Scikit-learn.',
        order: 3,
        tasks: [
          { title: 'Understand supervised vs unsupervised learning' },
          { title: 'Implement linear and logistic regression' },
          { title: 'Learn decision trees and random forests' },
          { title: 'Study model evaluation metrics (precision, recall, AUC)' },
          { title: 'Practice with Kaggle competitions' },
        ],
        resources: [
          { title: 'Scikit-learn Documentation', url: 'https://scikit-learn.org/stable/user_guide.html' },
          { title: 'Andrew Ng Machine Learning Course', url: 'https://www.coursera.org/learn/machine-learning' },
        ],
      },
    ],
  },

  {
    title: 'Full-Stack Developer',
    slug: 'full-stack-developer',
    description:
      'Master both frontend and backend development to build complete web applications. This roadmap covers HTML/CSS, JavaScript, React, Node.js, databases, and deployment.',
    category: 'Full-Stack Development',
    difficulty: 'Intermediate',
    estimatedDuration: '10–14 months',
    prerequisites: ['Basic programming knowledge', 'Familiarity with how websites work'],
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'Git'],
    projectSuggestions: [
      'Build a blog platform with user authentication',
      'Create an e-commerce product listing page with cart',
      'Develop a task management app with a REST API',
    ],
    learningStages: [
      {
        title: 'Web Fundamentals',
        description: 'Learn the building blocks of every website.',
        order: 1,
        tasks: [
          { title: 'Learn semantic HTML5 elements' },
          { title: 'Master CSS flexbox and grid layouts' },
          { title: 'Build responsive pages using media queries' },
          { title: 'Study JavaScript DOM manipulation' },
          { title: 'Understand async JavaScript (promises, async/await)' },
        ],
        resources: [
          { title: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/' },
          { title: 'CSS Tricks Complete Guide to Flexbox', url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/' },
        ],
      },
      {
        title: 'Frontend with React',
        description: 'Build interactive UIs with the world\'s most popular frontend library.',
        order: 2,
        tasks: [
          { title: 'Learn React components and JSX' },
          { title: 'Understand useState and useEffect hooks' },
          { title: 'Implement React Router for navigation' },
          { title: 'Manage global state with Context API' },
          { title: 'Fetch data from APIs with Axios' },
        ],
        resources: [
          { title: 'React Official Docs', url: 'https://react.dev/' },
          { title: 'Full Stack Open (free)', url: 'https://fullstackopen.com/en/' },
        ],
      },
      {
        title: 'Backend with Node.js & Express',
        description: 'Create RESTful APIs and manage server-side logic.',
        order: 3,
        tasks: [
          { title: 'Understand Node.js event loop and modules' },
          { title: 'Build REST endpoints with Express' },
          { title: 'Implement JWT-based authentication' },
          { title: 'Connect to MongoDB using Mongoose' },
          { title: 'Add input validation and error handling' },
        ],
        resources: [
          { title: 'Express.js Docs', url: 'https://expressjs.com/' },
          { title: 'Mongoose Docs', url: 'https://mongoosejs.com/docs/' },
        ],
      },
      {
        title: 'Deployment & DevOps Basics',
        description: 'Ship your application to the internet.',
        order: 4,
        tasks: [
          { title: 'Deploy frontend to Vercel or Netlify' },
          { title: 'Deploy backend to Render or Railway' },
          { title: 'Set up MongoDB Atlas for production' },
          { title: 'Configure environment variables securely' },
          { title: 'Add a custom domain name' },
        ],
        resources: [
          { title: 'Vercel Docs', url: 'https://vercel.com/docs' },
          { title: 'MongoDB Atlas Getting Started', url: 'https://www.mongodb.com/docs/atlas/getting-started/' },
        ],
      },
    ],
  },

  {
    title: 'Cybersecurity Analyst',
    slug: 'cybersecurity-analyst',
    description:
      'Learn to protect systems, networks and data from cyber threats. This roadmap covers networking fundamentals, ethical hacking, security tools, and incident response.',
    category: 'Cybersecurity',
    difficulty: 'Intermediate',
    estimatedDuration: '10–15 months',
    prerequisites: ['Basic networking knowledge', 'Comfort with the command line'],
    skills: ['Networking', 'Linux', 'Wireshark', 'Kali Linux', 'Penetration Testing', 'SIEM', 'Python'],
    projectSuggestions: [
      'Set up a home lab with VirtualBox and practice network scanning',
      'Complete TryHackMe beginner learning paths',
      'Participate in a Capture The Flag (CTF) competition',
    ],
    learningStages: [
      {
        title: 'Networking Fundamentals',
        description: 'Understand how data moves across networks.',
        order: 1,
        tasks: [
          { title: 'Learn the OSI and TCP/IP models' },
          { title: 'Understand IP addressing and subnetting' },
          { title: 'Study common protocols: HTTP, DNS, DHCP, FTP' },
          { title: 'Use Wireshark to analyze network traffic' },
        ],
        resources: [
          { title: 'Professor Messer CompTIA Network+ (free)', url: 'https://www.professormesser.com/network-plus/n10-008/n10-008-video/n10-008-training-course/' },
          { title: 'Wireshark Docs', url: 'https://www.wireshark.org/docs/' },
        ],
      },
      {
        title: 'Linux & Command Line',
        description: 'Most security tools run on Linux — master the terminal.',
        order: 2,
        tasks: [
          { title: 'Install and navigate a Linux distribution (Ubuntu/Kali)' },
          { title: 'Learn file system permissions and user management' },
          { title: 'Practice bash scripting basics' },
          { title: 'Understand process and service management' },
        ],
        resources: [
          { title: 'Linux Journey (free, interactive)', url: 'https://linuxjourney.com/' },
          { title: 'OverTheWire Bandit Wargame', url: 'https://overthewire.org/wargames/bandit/' },
        ],
      },
      {
        title: 'Ethical Hacking & Penetration Testing',
        description: 'Learn to find vulnerabilities before attackers do.',
        order: 3,
        tasks: [
          { title: 'Understand the penetration testing methodology' },
          { title: 'Perform reconnaissance and scanning with Nmap' },
          { title: 'Study common vulnerabilities (OWASP Top 10)' },
          { title: 'Practice on TryHackMe or HackTheBox' },
          { title: 'Learn Metasploit basics for exploitation' },
        ],
        resources: [
          { title: 'TryHackMe', url: 'https://tryhackme.com/' },
          { title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
        ],
      },
    ],
  },

  {
    title: 'Cloud Engineer',
    slug: 'cloud-engineer',
    description:
      'Learn to design, deploy and manage scalable infrastructure on cloud platforms. This roadmap covers AWS core services, infrastructure as code, containers and CI/CD.',
    category: 'Cloud Engineering',
    difficulty: 'Advanced',
    estimatedDuration: '12–18 months',
    prerequisites: ['Linux fundamentals', 'Basic networking', 'Familiarity with at least one scripting language'],
    skills: ['AWS', 'Azure', 'Terraform', 'Docker', 'Kubernetes', 'CI/CD', 'Python', 'Bash'],
    projectSuggestions: [
      'Deploy a containerized web app on AWS ECS or Azure AKS',
      'Write Terraform scripts to provision a VPC with EC2 instances',
      'Set up a CI/CD pipeline with GitHub Actions',
    ],
    learningStages: [
      {
        title: 'Cloud Fundamentals',
        description: 'Understand what cloud computing is and the core AWS services.',
        order: 1,
        tasks: [
          { title: 'Understand IaaS, PaaS, SaaS concepts' },
          { title: 'Create an AWS free-tier account' },
          { title: 'Learn EC2, S3, VPC and IAM' },
          { title: 'Deploy a static website on S3' },
          { title: 'Study pricing and billing best practices' },
        ],
        resources: [
          { title: 'AWS Cloud Practitioner Essentials (free)', url: 'https://explore.skillbuilder.aws/learn/course/134/aws-cloud-practitioner-essentials' },
          { title: 'FreeCodeCamp AWS Certified Cloud Practitioner Course', url: 'https://www.youtube.com/watch?v=SOTamWNgDKc' },
        ],
      },
      {
        title: 'Containers with Docker',
        description: 'Package applications in portable containers.',
        order: 2,
        tasks: [
          { title: 'Understand containers vs virtual machines' },
          { title: 'Write Dockerfiles for a Node.js application' },
          { title: 'Use Docker Compose for multi-service setups' },
          { title: 'Push images to Docker Hub or AWS ECR' },
        ],
        resources: [
          { title: 'Docker Official Docs', url: 'https://docs.docker.com/' },
          { title: 'Play with Docker (browser-based)', url: 'https://labs.play-with-docker.com/' },
        ],
      },
      {
        title: 'Infrastructure as Code with Terraform',
        description: 'Manage cloud infrastructure declaratively.',
        order: 3,
        tasks: [
          { title: 'Install Terraform and configure AWS provider' },
          { title: 'Write HCL to provision an EC2 instance' },
          { title: 'Manage state with Terraform Cloud or S3 backend' },
          { title: 'Use modules for reusable infrastructure patterns' },
        ],
        resources: [
          { title: 'HashiCorp Terraform Tutorials', url: 'https://developer.hashicorp.com/terraform/tutorials' },
        ],
      },
    ],
  },

  {
    title: 'Data Analyst',
    slug: 'data-analyst',
    description:
      'Learn to collect, clean, analyze and visualize data to support business decisions. This roadmap covers Excel, SQL, Python for analytics, and dashboard tools like Power BI or Tableau.',
    category: 'Data Analytics',
    difficulty: 'Beginner',
    estimatedDuration: '5–8 months',
    prerequisites: ['Basic spreadsheet skills', 'Curiosity about numbers and data'],
    skills: ['SQL', 'Excel', 'Python', 'Pandas', 'Power BI', 'Tableau', 'Statistics'],
    projectSuggestions: [
      'Analyze sales data to find trends using Excel pivot tables',
      'Build a Power BI dashboard for a public dataset',
      'Write SQL queries to answer business questions on a sample database',
    ],
    learningStages: [
      {
        title: 'Spreadsheets & Excel',
        description: 'Excel remains the most widely used analytics tool in business.',
        order: 1,
        tasks: [
          { title: 'Learn VLOOKUP, INDEX-MATCH formulas' },
          { title: 'Create pivot tables and charts' },
          { title: 'Build basic dashboards with slicers' },
          { title: 'Understand conditional formatting' },
        ],
        resources: [
          { title: 'Excel Easy (free tutorials)', url: 'https://www.excel-easy.com/' },
        ],
      },
      {
        title: 'SQL for Data Analysis',
        description: 'Query databases to extract business insights.',
        order: 2,
        tasks: [
          { title: 'Learn SELECT, WHERE, GROUP BY, ORDER BY' },
          { title: 'Practice JOINs: INNER, LEFT, RIGHT' },
          { title: 'Understand aggregate functions (SUM, AVG, COUNT)' },
          { title: 'Write subqueries and CTEs' },
          { title: 'Solve 20 SQL challenges on Mode Analytics or StrataScratch' },
        ],
        resources: [
          { title: 'SQLZoo (interactive)', url: 'https://sqlzoo.net/' },
          { title: 'Mode SQL Tutorial', url: 'https://mode.com/sql-tutorial/' },
        ],
      },
      {
        title: 'Data Visualization',
        description: 'Translate data into clear, persuasive visuals.',
        order: 3,
        tasks: [
          { title: 'Learn Power BI Desktop basics' },
          { title: 'Connect to a data source and build a report' },
          { title: 'Design dashboards with KPIs and filters' },
          { title: 'Learn Seaborn for Python visualizations' },
        ],
        resources: [
          { title: 'Microsoft Power BI Learning', url: 'https://learn.microsoft.com/en-us/power-bi/fundamentals/power-bi-overview' },
          { title: 'Tableau Public (free)', url: 'https://public.tableau.com/' },
        ],
      },
    ],
  },

  {
    title: 'AI/ML Engineer',
    slug: 'ai-ml-engineer',
    description:
      'Go beyond data science into designing and deploying production-grade AI systems. This roadmap covers deep learning, neural networks, NLP, computer vision, MLOps and model serving.',
    category: 'AI/ML',
    difficulty: 'Advanced',
    estimatedDuration: '14–20 months',
    prerequisites: ['Strong Python skills', 'Solid machine learning fundamentals', 'Linear algebra and calculus basics'],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'NLP', 'Computer Vision', 'MLOps', 'Docker'],
    projectSuggestions: [
      'Train an image classifier on a custom dataset',
      'Fine-tune a pre-trained NLP model on a sentiment analysis task',
      'Deploy a FastAPI ML model endpoint and containerize it with Docker',
    ],
    learningStages: [
      {
        title: 'Deep Learning Fundamentals',
        description: 'Understand how neural networks learn.',
        order: 1,
        tasks: [
          { title: 'Study perceptrons and multi-layer networks' },
          { title: 'Implement backpropagation from scratch' },
          { title: 'Learn activation functions and loss functions' },
          { title: 'Build your first model with Keras/TensorFlow' },
          { title: 'Understand overfitting and regularization techniques' },
        ],
        resources: [
          { title: 'Fast.ai Practical Deep Learning (free)', url: 'https://course.fast.ai/' },
          { title: 'Deep Learning Specialization — Coursera', url: 'https://www.coursera.org/specializations/deep-learning' },
        ],
      },
      {
        title: 'Natural Language Processing',
        description: 'Teach machines to understand and generate text.',
        order: 2,
        tasks: [
          { title: 'Understand tokenization and text preprocessing' },
          { title: 'Study word embeddings (Word2Vec, GloVe)' },
          { title: 'Learn transformer architecture and attention' },
          { title: 'Fine-tune a HuggingFace model' },
          { title: 'Build a text classification pipeline' },
        ],
        resources: [
          { title: 'HuggingFace NLP Course (free)', url: 'https://huggingface.co/learn/nlp-course' },
          { title: 'Illustrated Transformer (Jay Alammar)', url: 'https://jalammar.github.io/illustrated-transformer/' },
        ],
      },
      {
        title: 'MLOps & Model Deployment',
        description: 'Take models from notebooks to reliable production systems.',
        order: 3,
        tasks: [
          { title: 'Package models with FastAPI' },
          { title: 'Containerize ML services with Docker' },
          { title: 'Track experiments with MLflow or Weights & Biases' },
          { title: 'Set up a CI/CD pipeline for model retraining' },
          { title: 'Monitor model performance and data drift' },
        ],
        resources: [
          { title: 'MLOps Zoomcamp (free)', url: 'https://github.com/DataTalksClub/mlops-zoomcamp' },
          { title: 'FastAPI Docs', url: 'https://fastapi.tiangolo.com/' },
        ],
      },
    ],
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.');

  // Find any admin to use as createdBy
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) {
    console.error('❌  No admin user found. Run "npm run seed:admin" first.');
    process.exit(1);
  }

  let created = 0;
  let skipped = 0;

  for (const data of roadmapData) {
    const existing = await CareerRoadmap.findOne({ slug: data.slug });
    if (existing) {
      console.log(`ℹ️  Skipped (exists): ${data.title}`);
      skipped++;
      continue;
    }
    await CareerRoadmap.create({ ...data, createdBy: admin._id });
    console.log(`✅  Created: ${data.title}`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
