const request = require("supertest");

const songs = require("../app.js");
const db = require("../db/dbConfig.js");

// describe("One", () => {
//   it("hi", () => {
//     expect(1).toBe(1);
//   });
//   describe("Two", () => {
//     describe("Two.point oh", () => {
//       it("hello", () => {
//         expect(1).toBe(1);
//       });
//     });

//     describe("Three", () => {
//       it("hello", () => {
//         expect(1).toBe(1);
//       });
//     });
//   });
// });

describe("Basic root route", () => {
  describe("/", () => {
    it("is able to make a successful get request to /, that returns a string", async () => {
      const response = await request(songs).get("/");
      expect(response.text).toBe("Welcome to Tuner");
    });
  });
});

describe("Songs", () => {
  beforeEach(async () => {
    await db.none("DELETE FROM songs WHERE true");
    await db.none("ALTER SEQUENCE songs_id_seq RESTART");
    await db.none(`INSERT INTO songs (name, artist, album, time, is_favorite) VALUES
    ('Fame', 'David Bowie', 'Young Americans', '4:12', true ),
    ('Once in a Lifetime', 'Talking Heads', 'Remain in Light', '4:19', true ),
    ('The Great Curve', 'Talking Heads', 'Sand in the Vaseline', '5:39', true ),
    ('(Nothing But) Flowers',  'Talking Heads', 'Remain in Light', '6:28', false ),
    ('Books about UFOs', 'Hüsker Dü', 'New Day Rising', '2:49', true ),
    ('Mr. Startup', 'Wolf Parade', 'Thin Mind', '3:31', true ),
    ('We Got the World', 'Icona Pop', 'This is...', '3:17', false );`);
  });

  afterAll(() => {
    db.$pool.end();
  });

  describe("/songs", () => {
    describe("GET", () => {
      it("returns all songs", async () => {
        const expected = [
          {
            id: 1,
            name: "Fame",
            artist: "David Bowie",
            album: "Young Americans",
            time: "4:12",
            is_favorite: true,
          },
          {
            id: 2,
            name: "Once in a Lifetime",
            artist: "Talking Heads",
            album: "Remain in Light",
            time: "4:19",
            is_favorite: true,
          },
          {
            id: 3,
            name: "The Great Curve",
            artist: "Talking Heads",
            album: "Sand in the Vaseline",
            time: "5:39",
            is_favorite: true,
          },
          {
            id: 4,
            name: "(Nothing But) Flowers",
            artist: "Talking Heads",
            album: "Remain in Light",
            time: "6:28",
            is_favorite: false,
          },
          {
            id: 5,
            name: "Books about UFOs",
            artist: "Hüsker Dü",
            album: "New Day Rising",
            time: "2:49",
            is_favorite: true,
          },
          {
            id: 6,
            name: "Mr. Startup",
            artist: "Wolf Parade",
            album: "Thin Mind",
            time: "3:31",
            is_favorite: true,
          },
          {
            id: 7,
            name: "We Got the World",
            artist: "Icona Pop",
            album: "This is...",
            time: "3:17",
            is_favorite: false,
          },
        ];

        const response = await request(songs).get("/songs").expect(200);
        const parsedRes = JSON.parse(response.text);
        expect(parsedRes).toEqual(expect.arrayContaining(expected));
      });
    });

    describe("POST", () => {
      describe("handling a proper create request", () => {
        it("can create a song with all the fields", async () => {
          const response = await request(songs).post("/songs").send({
            name: "Star Roving",
            artist: "Slowdive",
            is_favorite: "false",
            time: "5:37",
          });

          const parsedRes = JSON.parse(response.text);
          expect(response.statusCode).toBe(200);
          expect(!!parsedRes.id).toBe(true);
          expect(parsedRes.artist).toEqual("Slowdive");
          expect(parsedRes.name).toEqual("Star Roving");
          expect(parsedRes.is_favorite).toEqual(false);
          expect(parsedRes.time).toEqual("5:37");
        });
      });
      describe("handling an improper create request", () => {
        it("will return an error if the name is missing", async () => {
          const response = await request(songs).post("/songs").send({
            artist: "Slowdive",
            is_favorite: "false",
            time: "5:37",
          });

          const parsedRes = JSON.parse(response.text);
          expect(response.statusCode).toBe(400);
          expect(!!parsedRes.id).toBe(false);
        });
        it("will return an error if artist is missing", async () => {
          const response = await request(songs).post("/songs").send({
            name: "Star Roving",
            is_favorite: "false",
            time: "5:37",
          });

          const parsedRes = JSON.parse(response.text);
          expect(response.statusCode).toBe(400);
          expect(!!parsedRes.id).toBe(false);
        });

        it("will return an error if is_favorite is not a boolean", async () => {
          const response = await request(songs).post("/songs").send({
            artist: "Slowdive",
            is_favorite: "maybe",
            time: "5:37",
          });

          const parsedRes = JSON.parse(response.text);
          expect(response.statusCode).toBe(400);
          expect(!!parsedRes.id).toBe(false);
        });
      });
    });
  });

  describe("/songs/:id", () => {
    describe("GET", () => {
      it("with correct id - fetches the correct song with the correct key/properties", async () => {
        const response = await request(songs).get("/songs/1");
        const parsedRes = JSON.parse(response.text);
        expect(parsedRes.name).toEqual("Fame");
        expect(parsedRes.artist).toEqual("David Bowie");
        expect(parsedRes.album).toEqual("Young Americans");
        expect(parsedRes.time).toEqual("4:12");
        expect(parsedRes.is_favorite).toEqual(true);
      });

      it("with incorrect id - sets status to 404 and returns error key", async () => {
        const response = await request(songs).get("/songs/98989898");
        expect(response.statusCode).toEqual(404);
      });
    });

    describe("PUT", () => {
      describe("handling a proper update request", () => {
        it("can update a song with all the fields", async () => {
          const response = await request(songs).put("/songs/1").send({
            name: "Bluebird of Happiness",
            artist: "Mojave 3",
            is_favorite: "true",
            time: "9:13",
          });

          const parsedRes = JSON.parse(response.text);
          expect(response.statusCode).toBe(200);
          expect(!!parsedRes.id).toBe(true);
          expect(parsedRes.artist).toEqual("Mojave 3");
          expect(parsedRes.name).toEqual("Bluebird of Happiness");
          expect(parsedRes.is_favorite).toEqual(true);
          expect(parsedRes.time).toEqual("9:13");
        });
      });
      describe("handling an improper update request", () => {
        it("will return an error if the name is missing", async () => {
          const response = await request(songs).post("/songs").send({
            artist: "Mojave 3",
            is_favorite: "true",
            time: "9:13",
          });

          const parsedRes = JSON.parse(response.text);
          expect(response.statusCode).toBe(400);
          expect(!!parsedRes.id).toBe(false);
        });
        it("will return an error if artist is missing", async () => {
          const response = await request(songs).post("/songs").send({
            name: "Bluebird of Happiness",
            is_favorite: "true",
            time: "9:13",
          });

          const parsedRes = JSON.parse(response.text);
          expect(response.statusCode).toBe(400);
          expect(!!parsedRes.id).toBe(false);
        });

        it("will return an error if is_favorite is not a boolean", async () => {
          const response = await request(songs).post("/songs").send({
            artist: "Mojave 3",
            is_favorite: "maybe",
            time: "9:13",
          });

          const parsedRes = JSON.parse(response.text);
          expect(response.statusCode).toBe(400);
          expect(!!parsedRes.id).toBe(false);
        });
      });
    });

    describe("DELETE", () => {
      it("with valid id - deletes the correct song", async () => {
        const response = await request(songs).delete("/songs/1").send();
        const parsedRes = JSON.parse(response.text);
        expect(parsedRes.name).toEqual("Fame");
      });
      it("with invalid id - does not delete anything", async () => {
        const response = await request(songs).delete("/songs/99999").send();
        const parsedRes = JSON.parse(response.text);
        expect(!!parsedRes.id).toBe(false);
        expect(response.statusCode).toEqual(404);
      });
    });
  });
});
