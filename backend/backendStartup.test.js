const assert = require("node:assert/strict");
const { test } = require("node:test");
const request = require("supertest");

// Use the real route modules and controllers without connecting to a database.
const databasePath = require.resolve("./config/database");
require.cache[databasePath] = {
  id: databasePath,
  filename: databasePath,
  loaded: true,
  exports: {},
};
process.env.GOOGLE_CLIENT_ID = "startup-test";
process.env.GOOGLE_CLIENT_SECRET = "startup-test";
process.env.SESSION_SECRET = "startup-test";
process.env.ACCESS_TOKEN_SECRET = "startup-test";
require("dotenv").config = () => ({ parsed: {} });

for (const name of [
  "enrollmentRoutes",
  "assessmentRoutes",
  "adminCodingQuestionRoutes",
  "codeExecutionRoutes",
  "sessionRoutes",
]) {
  test(`${name} registers with real handlers`, () => {
    const router = require(`./routes/${name}`);
    assert.equal(typeof router, "function");
    assert.ok(router.stack.some((layer) => layer.route));
  });
}

test("the full backend mounts its routes and answers the deployment health check", async () => {
  const app = require("./app");
  const response = await request(app).get("/api/health").expect(200);
  assert.equal(response.body.status, "healthy");
});

test("session broadcasts forward supported events for an existing session", async () => {
  const express = require("express");
  const controller = require("./controllers/sessionController");
  const app = express();
  app.use(express.json());
  app.post("/sessions", controller.createSession);
  app.post("/broadcast", controller.broadcastSessionEvent);
  const created = await request(app).post("/sessions").send({
    title: "Practice", instructorId: 1, startTime: "2026-11-23T10:00:00Z"
  }).expect(201);
  const sessionId = created.body.id;
  const post = (event, id = sessionId) => request(app).post("/broadcast").send({ sessionId: id, event });
  await post("unknown").expect(400);
  await post("session:started", "missing").expect(404);
  await post("session:started").expect(503);
  const received = [];
  const socket = { user: { id: 1 }, emit: (event, payload) => received.push([event, payload.sessionId]) };
  app.set("io", { sockets: { sockets: new Map([["test", socket]]) } });
  for (const event of ["session:started", "session:ended"]) {
    await post(event).expect(200, { success: true, notifiedUsers: 1 });
    assert.deepEqual(received.pop(), [event, sessionId]);
  }
});
