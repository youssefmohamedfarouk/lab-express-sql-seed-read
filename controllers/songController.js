const express = require("express");
const songs = express.Router();
const {
  createSong,
  updateSong,
  deleteSong,
  getAllSongs,
  getOneSong,
} = require("../queries/songs");
const { validation } = require("./validation");

// INDEX
songs.get("/", async (req, res) => {
  const allSongs = await getAllSongs();
  console.log(allSongs);
  if (Array.isArray(allSongs)) {
    res.status(200).json(allSongs);
  } else {
    res.status(500).json({ error: "Server Error" });
  }
});

// CREATE
songs.post("/", async (req, res) => {
  try {
    const song = await createSong(req.body);
    res.status(200).json(song);
  } catch (error) {
    res.status(400).json({ error: "Bad Request" });
  }
});

// UPDATE
songs.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const song = await updateSong(id, req.body);
    res.status(200).json(song);
  } catch (error) {
    res.status(400).json({ error: "Bad Request" });
  }
});

// SHOW
songs.get("/:id", async (req, res) => {
  const { id } = req.params;
  const song = await getOneSong(id);
  console.log(song);
  if (song) {
    res.status(200).json(song);
  } else {
    res.status(404).json({ error: "Song not found" });
  }
});

// DELETE
songs.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedSong = await deleteSong(id);
  if (deletedSong.id) {
    res.status(200).json(deletedSong);
  } else {
    res.status(404).json({ error: "Song not found" });
  }
});

module.exports = songs;
