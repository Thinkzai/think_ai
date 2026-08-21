const MOCK_USERS = [
  { id: "u1", username: "codeNinja42", displayName: "Alex Chen", avatar: null, role: "admin", reputation: 15420 },
  { id: "u2", username: "javaJunkie", displayName: "Maria Lopez", avatar: null, role: "moderator", reputation: 12300 },
  { id: "u3", username: "reactFan", displayName: "Sam Wilson", avatar: null, role: "member", reputation: 8750 },
  { id: "u4", username: "backendBoss", displayName: "Dmitri Volkov", avatar: null, role: "member", reputation: 9200 },
  { id: "u5", username: "cssWizard", displayName: "Priya Sharma", avatar: null, role: "member", reputation: 7100 },
  { id: "u6", username: "devOpsKing", displayName: "James Carter", avatar: null, role: "moderator", reputation: 11000 },
  { id: "u7", username: "typescriptFan", displayName: "Yuki Tanaka", avatar: null, role: "member", reputation: 6800 },
  { id: "u8", username: "sqlMaster", displayName: "Emma Brown", avatar: null, role: "member", reputation: 5400 },
  { id: "u9", username: "hookHunter", displayName: "Omar Hassan", avatar: null, role: "member", reputation: 4300 },
  { id: "u10", username: "restGuru", displayName: "Sophie Martin", avatar: null, role: "admin", reputation: 14100 },
  { id: "u11", username: "dockerDev", displayName: "Liam O'Brien", avatar: null, role: "member", reputation: 7600 },
  { id: "u12", username: "graphqlGuy", displayName: "Fatima Al-Rashid", avatar: null, role: "member", reputation: 5900 },
  { id: "u13", username: "springSteve", displayName: "Steve Nguyen", avatar: null, role: "member", reputation: 8200 },
  { id: "u14", username: "nodeNewbie", displayName: "Aisha Patel", avatar: null, role: "member", reputation: 2100 },
  { id: "u15", username: "perfPro", displayName: "Marcus Johnson", avatar: null, role: "moderator", reputation: 10500 },
  { id: "u16", username: "securitySam", displayName: "Samantha Lee", avatar: null, role: "member", reputation: 6300 },
  { id: "u17", username: "testQueen", displayName: "Rachel Kim", avatar: null, role: "member", reputation: 7800 },
  { id: "u18", username: "jpaJanet", displayName: "Janet Torres", avatar: null, role: "member", reputation: 4900 },
  { id: "u19", username: "streamSamurai", displayName: "Kenji Watanabe", avatar: null, role: "member", reputation: 3600 },
  { id: "u20", username: "responsiveRex", displayName: "Rex Anderson", avatar: null, role: "member", reputation: 3200 },
];

const MOCK_TAGS = [
  "React", "JavaScript", "Java", "Spring Boot", "Hooks", "Streams",
  "CSS", "Responsive", "Security", "REST API", "JPA", "PostgreSQL",
  "Transactions", "Docker", "DevOps", "Node.js", "TypeScript", "GraphQL",
  "Testing", "Performance",
];

const TITLE_TEMPLATES = [
  "How to {verb} {concept} in {technology}?",
  "Best practices for {concept} with {technology}",
  "{concept} not working after updating {technology}",
  "Understanding {concept} in {technology} - beginner help",
  "Why is my {concept} so slow in {technology}?",
  "{technology} vs {technology2} for {concept}",
  "How to implement {concept} in {technology}?",
  "Error when using {concept} in {technology}: {error}",
  "What is the recommended way to handle {concept} in {technology}?",
  "Performance issues with {concept} in {technology}",
  "Clean architecture for {concept} using {technology}",
  "{concept} best practices - what am I doing wrong?",
  "How do you handle {concept} in production with {technology}?",
  "Is {technology} still worth learning for {concept}?",
  "Beginner question about {concept} and {technology}",
  "Advanced {concept} patterns in {technology}",
  "{technology} {concept} tutorial - step by step",
  "Debugging {concept} issues in {technology}",
  "How to optimize {concept} in {technology}",
  "{concept} security concerns with {technology}",
  "Migrating from {technology} to {technology2} for {concept}",
  "Unit testing {concept} with {technology}",
  "Real-time {concept} with {technology} and WebSockets",
  "RESTful {concept} design using {technology}",
  "State management for {concept} in {technology}",
  "{concept} with {technology} - which approach is best?",
  "How to cache {concept} efficiently in {technology}",
  "Common mistakes when working with {concept} in {technology}",
  "{technology} authentication and {concept} setup",
  "How to deploy {concept} built with {technology}",
  "Database design for {concept} in {technology}",
  "Handling errors in {concept} with {technology}",
  "Microservices architecture with {technology} for {concept}",
  "{concept} configuration management in {technology}",
  "Logging and monitoring {concept} in {technology}",
  "How to scale {concept} in {technology}",
  "Integration testing {concept} with {technology}",
  "{concept} with {technology} - memory leak issue",
  "Smooth animations for {concept} using {technology}",
  "How to secure {concept} endpoints in {technology}",
  "Why does {technology} {concept} throw a null pointer?",
  "Automating {concept} pipelines with {technology}",
  "{concept} with {technology} and Docker Compose",
  "How to migrate {concept} data using {technology}",
  "Optimizing {technology} queries for {concept}",
  "{concept} file upload in {technology} application",
  "Event-driven {concept} with {technology} and message queues",
  "{technology} type safety for {concept}",
  "How to handle concurrent {concept} in {technology}?",
  "Debugging {technology} builds for {concept} feature",
];

const CONTENT_TEMPLATES = [
  "I've been working on {concept} in {technology} and running into some issues. Specifically, when I try to {action}, I get unexpected behavior. Has anyone else encountered this? I've tried {attempt1} but it doesn't seem to help. Any suggestions would be appreciated.",
  "Can someone explain how {concept} works in {technology}? I've read the docs but I'm still confused about the {detail}. What's the recommended approach?",
  "After upgrading to the latest version of {technology}, my {concept} broke. Here's what's happening: {issue}. I've been debugging for hours. Anyone know what changed?",
  "I'm building a {project} and need to implement {concept}. I'm using {technology} for the backend. What's the best way to approach this? Looking for {detail}.",
  "What are the best practices for {concept} in {technology}? I know the basics but I want to make sure I'm following industry standards. Currently I'm doing {approach} but I feel like there's a better way.",
  "I keep getting this error when working with {concept}: \"{error}\". I'm using {technology} and here's my code setup: {detail}. What am I missing?",
  "Quick question about {concept}: is it better to {option1} or {option2} when using {technology}? I've seen both approaches recommended and I'm not sure which to go with.",
  "I've been struggling with performance issues related to {concept} in my {technology} application. The response times are {detail}. What optimization strategies would you recommend?",
  "Here's a solution I found for {concept} in {technology}: {solution}. It took me a while to figure this out so I'm sharing in case anyone else runs into the same issue.",
  "I'm new to {technology} and trying to understand {concept}. Can someone point me to good resources? I've checked {resource} but looking for more hands-on examples.",
  "Has anyone used {technology} for {concept} in a production environment? I'm evaluating it for a project and would love to hear about real-world experiences.",
  "I'm trying to implement {concept} but keep running into issues with {detail}. My current approach uses {approach} in {technology}. Is there a more elegant solution?",
  "Best way to test {concept} in {technology}? I want to make sure my implementation is solid before deploying. Currently using {approach} for testing.",
  "When should you use {technology} for {concept} versus alternatives? Looking for use cases where {technology} really shines and where it falls short.",
  "I just discovered a neat trick for {concept} in {technology}: {solution}. It simplified my code significantly and improved performance.",
  "Running into a race condition with {concept} in my {technology} app. The issue occurs when {detail}. How do you typically handle this?",
  "How do you organize your {concept} code in large {technology} projects? I'm finding it hard to keep things maintainable as the project grows.",
  "What's the idiomatic way to handle {concept} in {technology}? I see a lot of different patterns online and I'm not sure which is considered best practice.",
  "I need to add {concept} support to my {technology} application. Currently thinking about {approach}. Are there any gotchas I should be aware of?",
  "Does {technology} handle {concept} well? I'm comparing it with {technology2} for a new project and trying to make an informed decision.",
  "My {concept} implementation in {technology} works fine locally but fails in production with {detail}. What could cause this discrepancy?",
  "Looking for recommendations on {concept} libraries for {technology}. I need something that supports {detail} and is well maintained.",
  "I'm getting a {error} error when my {technology} app tries to handle {concept}. Stack trace shows the issue at {detail}. Help!",
  "How would you refactor {concept} code in {technology} to improve readability? My current implementation works but it's a mess.",
  "Tutorial: implementing {concept} with {technology} from scratch. I'll walk through {detail} and share the key lessons learned along the way.",
  "What tools do you use for debugging {concept} in {technology}? I've been using console.log but I need something more powerful.",
  "I found that {concept} performance in {technology} depends heavily on {detail}. Here are my benchmarks comparing different approaches.",
  "How do you handle {concept} when using {technology} in a microservices architecture? Our current setup has {detail} and we need to coordinate across services.",
  "Is it worth abstracting {concept} in {technology} or should I keep it simple? The project is expected to grow to {detail} features.",
  "My team is debating between {approach1} and {approach2} for {concept} in our {technology} project. Which would you choose and why?",
];

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function pick(arr, rand) {
  return arr[Math.floor(rand() * arr.length)];
}

function pickN(arr, n, rand) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, n);
}

function randInt(min, max, rand) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

const TECHNIQUES = {
  React: ["React"],
  JavaScript: ["JavaScript", "JS"],
  Java: ["Java"],
  "Spring Boot": ["Spring Boot", "Spring"],
  Hooks: ["React Hooks", "custom hooks"],
  Streams: ["Java Streams", "Stream API"],
  CSS: ["CSS", "CSS3"],
  Responsive: ["responsive design", "responsive layouts"],
  Security: ["web security", "authentication", "authorization"],
  "REST API": ["REST API", "RESTful API", "REST endpoints"],
  JPA: ["JPA", "JPA/Hibernate"],
  PostgreSQL: ["PostgreSQL", "Postgres", "PostgreSQL database"],
  Transactions: ["database transactions", "transaction management"],
  Docker: ["Docker", "Docker containers"],
  DevOps: ["DevOps", "CI/CD pipelines"],
  "Node.js": ["Node.js", "Node"],
  TypeScript: ["TypeScript", "TS"],
  GraphQL: ["GraphQL"],
  Testing: ["unit testing", "integration testing", "testing"],
  Performance: ["performance", "optimization", "speed"],
};

const CONCEPTS = [
  "state management", "authentication", "error handling", "caching",
  "data validation", "form handling", "routing", "API integration",
  "database queries", "middleware", "dependency injection", "logging",
  "pagination", "file uploads", "real-time updates", "pagination",
  "search functionality", "user permissions", "session management",
  "payload serialization", "request validation", "event handling",
  "component composition", "code splitting", "lazy loading",
  "server-side rendering", "database migrations", "connection pooling",
  "retry logic", "rate limiting",
];

const ACTIONS = [
  "submit a form", "fetch paginated data", "handle user input",
  "update a record", "validate input", "authenticate a user",
  "process a file upload", "send an email", "generate a report",
  "process a webhook", "run a background job", "cache API responses",
];

const DETAILS = [
  "the connection pool exhaustion issue", "memory allocation patterns",
  "the lifecycle hooks", "the configuration hierarchy",
  "how context propagation works", "the event loop behavior",
  "transaction isolation levels", "the garbage collection pauses",
  "the template compilation step", "the dependency graph",
  "the serialization format", "the retry strategy",
];

const ATTEMPTS = [
  "increasing the timeout", "adding error handlers", "checking the logs",
  "using a different library", "refactoring the component",
  "consulting the official docs", "asking on Stack Overflow",
  "downgrading the version", "clearing the cache", "restarting the server",
  "switching to a different ORM", "adding more console.log statements",
];

const ERRORS = [
  "TypeError: Cannot read property of undefined",
  "NullPointerException in service layer",
  "ECONNREFUSED: Connection refused",
  "SQL state [HY000]: general error",
  "ERR_HTTP_HEADERS_SENT: headers already sent",
  "SyntaxError: Unexpected token in JSON",
  "Connection pool timeout exceeded",
  "SIGTERM: process terminated unexpectedly",
  "OutOfMemoryError: Java heap space",
  "Error: Maximum call stack size exceeded",
  "EACCES: permission denied",
  "MigrationFailedError: relation already exists",
];

const SOLUTIONS = [
  "memoizing expensive computations", "implementing a custom hook",
  "using a connection pool with proper limits", "applying the circuit breaker pattern",
  "implementing exponential backoff", "using a message queue for decoupling",
  "adding proper error boundaries", "implementing request deduplication",
  "using database-level caching", "applying the repository pattern",
  "implementing optimistic updates", "using a load balancer",
];

const APPROACHES = [
  "basic try/catch blocks", "a centralized error handler",
  "the observer pattern", "a pub/sub architecture",
  "option-based configuration", "environment variables",
  "a service layer pattern", "direct database queries",
  "mock-based testing", "integration test suites",
  "a monorepo structure", "feature flags for gradual rollout",
];

const OPTIONS = ["Option A (type-safe)", "Option B (flexible)", "use libraries", "build custom solutions"];
const RESOURCES = ["the official documentation", "MDN Web Docs", "Spring.io guides", "React.dev", "YouTube tutorials", "Udemy courses"];
const PROJECTS = ["web application", "mobile API", "admin dashboard", "e-commerce platform", "real-time chat application", "data processing pipeline"];

function interpolateTemplate(template, rand) {
  let result = template;
  const replacements = {
    "{technology}": pick(MOCK_TAGS, rand),
    "{technology2}": pick(MOCK_TAGS, rand),
    "{concept}": pick(CONCEPTS, rand),
    "{verb}": pick(["implement", "debug", "optimize", "understand", "configure", "deploy", "test"], rand),
    "{error}": pick(ERRORS, rand),
    "{detail}": pick(DETAILS, rand),
    "{action}": pick(ACTIONS, rand),
    "{attempt1}": pick(ATTEMPTS, rand),
    "{approach}": pick(APPROACHES, rand),
    "{approach1}": pick(APPROACHES, rand),
    "{approach2}": pick(APPROACHES, rand),
    "{solution}": pick(SOLUTIONS, rand),
    "{option1}": pick(OPTIONS, rand),
    "{option2}": pick(OPTIONS, rand),
    "{project}": pick(PROJECTS, rand),
    "{resource}": pick(RESOURCES, rand),
  };

  for (const [token, value] of Object.entries(replacements)) {
    while (result.includes(token)) {
      result = result.replace(token, value);
    }
  }
  return result;
}

function generateMockPosts(count = 1000) {
  const rand = seededRandom(42);
  const posts = [];

  const startDate = new Date("2024-01-01T00:00:00Z");
  const endDate = new Date("2026-08-20T00:00:00Z");
  const timeSpan = endDate.getTime() - startDate.getTime();

  const pinnedIndices = new Set();
  while (pinnedIndices.size < Math.min(15, Math.floor(count * 0.02))) {
    pinnedIndices.add(Math.floor(rand() * count));
  }

  const solvedIndices = new Set();
  while (solvedIndices.size < Math.floor(count * 0.3)) {
    solvedIndices.add(Math.floor(rand() * count));
  }

  for (let i = 0; i < count; i++) {
    const author = pick(MOCK_USERS, rand);
    const postDate = new Date(startDate.getTime() + rand() * timeSpan);
    const tagCount = randInt(1, 4, rand);
    const tags = pickN(MOCK_TAGS, tagCount, rand);

    const upvotes = Math.floor(Math.pow(rand(), 3) * 200);
    const downvotes = Math.floor(Math.pow(rand(), 3) * Math.floor(upvotes * 0.3));
    const views = Math.floor(Math.pow(rand(), 2) * 50000) + upvotes * 5;
    const replies = Math.floor(Math.pow(rand(), 2) * 50);

    const titleTemplate = pick(TITLE_TEMPLATES, rand);
    const contentTemplate = pick(CONTENT_TEMPLATES, rand);

    posts.push({
      id: `p${i + 1}`,
      authorId: author.id,
      title: interpolateTemplate(titleTemplate, rand),
      content: interpolateTemplate(contentTemplate, rand),
      tags,
      upvotes,
      downvotes,
      views: Math.max(views, upvotes + downvotes),
      replies,
      isSolved: solvedIndices.has(i),
      isPinned: pinnedIndices.has(i),
      createdAt: postDate.toISOString(),
    });
  }

  return posts;
}

const mockPosts = generateMockPosts(1000);

const mockForumData = {
  users: MOCK_USERS,
  posts: mockPosts,
  tags: MOCK_TAGS,
};

export { MOCK_USERS, MOCK_TAGS, generateMockPosts, mockForumData };
export default mockForumData;
