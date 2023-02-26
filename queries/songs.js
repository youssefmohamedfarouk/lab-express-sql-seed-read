const db = require("../db/dbConfig");

// FORMAT BUYER NAME
function formatString(string) {
  return string
    .toLowerCase()
    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
}

// SHOW ALL SONGS
const getAllSongs = async () => {
  try {
    const allSongs = await db.any("SELECT * FROM songs");
    return allSongs;
  } catch (error) {
    return error;
  }
};

// SHOW ONE SONG
const getOneSong = async (songId) => {
  try {
    const oneSong = await db.oneOrNone(
      "SELECT * FROM songs WHERE id=$1",
      songId
    );
    return oneSong;
  } catch (error) {
    return error;
  }
};

// CREATE A SONG
const createSong = async (song) => {
  const { name, artist, album, time, is_favorite } = song;
  try {
    const newSong = await db.one(
      "INSERT INTO songs (name, artist, album, time, is_favorite) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, artist, album, time, is_favorite]
    );
    return newSong;
  } catch (error) {
    throw error;
  }
};

// UPDATE A SONG
const updateSong = async (id, song) => {
  const { name, artist, album, time, is_favorite } = song;
  try {
    const updatedSong = await db.one(
      "UPDATE songs SET name=$1, artist=$2, album=$3, time=$4, is_favorite=$5 WHERE id=$6 RETURNING *",
      [name, artist, album, time, is_favorite, id]
    );
    return updatedSong;
  } catch (error) {
    return error;
  }
};

//DELETE A SONG
const deleteSong = async (id) => {
  try {
    const deletedSong = await db.one(
      "DELETE FROM songs WHERE id=$1 RETURNING *",
      id
    );
    return deletedSong;
  } catch (error) {
    return error;
  }
};

module.exports = {
  createSong,
  updateSong,
  deleteSong,
  getAllSongs,
  getOneSong,
};
