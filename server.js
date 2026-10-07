const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let crops = [
  { id: 1, name: "Paddy", season: "Kharif", area: "2.5 acres", status: "Growing" },
  { id: 2, name: "Tomato", season: "Rabi", area: "1.2 acres", status: "Ready" }
];

let tasks = [
  { id: 1, task: "Irrigation", date: "2026-10-08", status: "Pending" },
  { id: 2, task: "Fertilizer application", date: "2026-10-10", status: "Pending" }
];

app.get("/api/dashboard", (req, res) => {
  res.json({
    totalCrops: crops.length,
    activeTasks: tasks.filter(t => t.status === "Pending").length,
    totalArea: "3.7 acres",
    estimatedYield: "8.4 tons"
  });
});

app.get("/api/crops", (req, res) => res.json(crops));

app.post("/api/crops", (req, res) => {
  const { name, season, area } = req.body;
  if (!name || !season || !area) return res.status(400).json({ error: "All fields are required" });
  const crop = { id: Date.now(), name, season, area, status: "Growing" };
  crops.push(crop);
  res.status(201).json(crop);
});

app.delete("/api/crops/:id", (req, res) => {
  const id = Number(req.params.id);
  crops = crops.filter(c => c.id !== id);
  res.json({ success: true });
});

app.get("/api/tasks", (req, res) => res.json(tasks));

app.post("/api/tasks", (req, res) => {
  const { task, date } = req.body;
  if (!task || !date) return res.status(400).json({ error: "Task and date are required" });
  const item = { id: Date.now(), task, date, status: "Pending" };
  tasks.push(item);
  res.status(201).json(item);
});

app.patch("/api/tasks/:id", (req, res) => {
  const item = tasks.find(t => t.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: "Task not found" });
  item.status = item.status === "Pending" ? "Completed" : "Pending";
  res.json(item);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`Agriculture Management System running on http://localhost:${PORT}`));