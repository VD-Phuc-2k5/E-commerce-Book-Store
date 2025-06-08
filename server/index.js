import "dotenv/config";
import cors from "cors";
import express from "express";
import appRoute from "./appRoute.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ?? 3000;
appRoute(app);
app.listen(PORT, () => {
  console.log(`✅ Mock API running at http://localhost:${PORT}`);
});
