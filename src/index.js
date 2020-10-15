import express from "express";

import "./db/mongoose.js";
import authRoutes from "./routes/auth.js";
import playlistsRoutes from "./routes/playlists.js";
import clipsRoutes from "./routes/clips.js";

const app = express();
const port = process.env.PORT || 5000;
const routePrefix = "/api/v2";

app.use(express.json());
app.use(`${routePrefix}/auth`, authRoutes);
app.use(`${routePrefix}/playlists`, playlistsRoutes);
app.use(`${routePrefix}/clips`, clipsRoutes);

app.listen(port, () => console.log(`Server Running on PORT: ${port}`));
