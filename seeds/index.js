//=============================
// REQUIRE
//=============================
const mongoose = require("mongoose");
const Court = require("../models/courts.js"); // require model
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

//=============================
// CONFIG
//=============================

let localDb = "mongodb://localhost:27017/courts";
let atlasDb = process.env.db;
// Connect Mongoose
mongoose
  .connect(localDb, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTED!");
  })
  .catch((e) => {
    console.log("MONGO CONNECTION ERROR :(");
    console.log(e);
  });

const seedDB = async () => {
  await Court.deleteMany({});

  let imageSize = "/800x600";
  let indoorOutdoor = ["indoor", "outdoor"];
  let image = [
    `https://source.unsplash.com/collection/1841259${imageSize}`,
    `https://source.unsplash.com/collection/9454911${imageSize}`,
    `https://source.unsplash.com/collection/173${imageSize}`,
    `https://source.unsplash.com/collection/3331316${imageSize}`,
    `https://source.unsplash.com/collection/3161728${imageSize}`,
  ];

  for (let i = 0; i < 15; i++) {
    let random1000 = Math.floor(Math.random() * 1000);
    let randomTitle1 = Math.floor(Math.random() * 18);
    let randomTitle2 = Math.floor(Math.random() * 18);
    let randomIndoor = Math.floor(Math.random() * 2);
    let randomPlayers = Math.floor(Math.random() * 50);
    let randomImage = Math.floor(Math.random() * 5);

    const court = new Court({
      title: `${descriptors[randomTitle1]} ${places[randomTitle2]}`,
      image: image[randomImage],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      opening_hours: 7,
      closing_hours: 9,
      court: indoorOutdoor[randomIndoor],
      avgNumberOfPlayers: randomPlayers,
    });

    await court.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
