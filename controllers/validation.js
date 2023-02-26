const validation = (req, res, next) => {
  if (
    typeof req.body.is_favorite === "boolean" &&
    req.body.name &&
    req.body.artist
  ) {
    next();
  } else {
    res.status(400).json({
      error:
        "Invalid data entered - please fill out all expenditure information properly",
      name: typeof req.body.song,
      artist: typeof req.body.artist,
      is_favorite: typeof req.body.is_favorite,
    });
  }
};

module.exports = { validation };
