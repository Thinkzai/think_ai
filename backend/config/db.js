// Temporary stub so the app can start locally without a real DB.
// TODO: replace with real DB connection once teammate pushes config/db.js
module.exports = {
  query: () => {
    throw new Error("Database not connected — this is a local stub");
  },
};