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
  .connect(atlasDb, {
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

  await Court.insertMany([
    {
      title: "Richmond Olympic Oval",
      image:
        "https://www.fastepp.com/wp-content/uploads/FE-Richmond-Olympic-Oval-8-Credit-Nic-Lehoux-and-Cannon-Design-1.jpg",
      description:
        "The Richmond Olympic Oval is an indoor multi-sports arena in the Canadian city of Richmond, British Columbia. The oval was built for the 2010 Winter Olympics and was originally configured with a speed skating rink.",
      location: "Richmond, BC",
      opening_hours: 7,
      closing_hours: 10,
      court: "indoor",
      avgNumberOfPlayers: 107,
    },
    {
      title: "Kitsilano Hoops",
      image:
        "https://bballaroundtheworld.files.wordpress.com/2017/07/img_4217.jpg",
      description:
        "The scenic views from the courts are magnificent and the court itself is very well maintained. With the court being in the center of a very popular beach park, don’t get nervous because you will always be playing in front of a crowd.",
      location: "Kitsilano Beach Vancouver",
      opening_hours: 6,
      closing_hours: 10,
      court: "outdoor",
      avgNumberOfPlayers: 52,
    },
    {
      title: "House of Mamba",
      image:
        "https://vortexbasketball.com/assets/images/7.-2_NIKELEDbasketballcourt.jpg",
      description:
        "This futuristic space is the world's first full-sized LED basketball court.",
      location: "Shanghai, China",
      opening_hours: 9,
      closing_hours: 11,
      court: "indoor",
      avgNumberOfPlayers: 80,
    },
    {
      title: "Pigalle",
      image:
        "https://cdn.theculturetrip.com/wp-content/uploads/2017/06/jctp0083-pigalle-basketball-court-paris-france-mccarthy-4.jpg",
      description:
        "A coloufully-painted basketball court sits tightly tucked in between two city buildings in France.",
      location: "Paris, France",
      opening_hours: 7,
      closing_hours: 10,
      court: "outdoor",
      avgNumberOfPlayers: 20,
    },
    {
      title: "People’s place",
      image: "https://media.timeout.com/images/105707139/1372/772/image.jpg",
      description:
        " Designed by local street artist Xeme, this stunning large-scale artwork brings street art culture to neighbourhoods and communities that may not have everyday access to public art.",
      location: "Hong Kong",
      opening_hours: 7,
      closing_hours: 11,
      court: "outdoor",
      avgNumberOfPlayers: 16,
    },
    {
      title: "Choi Hung Estate",
      image: "https://i.imgur.com/nxKpeJ1.jpg",
      description:
        "Basketball court at Choi Hung Estate, one of the oldest public housing estates in Hong Kong",
      location: "Kowloon",
      opening_hours: 8,
      closing_hours: 10,
      court: "outdoor",
      avgNumberOfPlayers: 15,
    },
  ]);

  let imageSize = "/800x600";
  let indoorOutdoor = ["indoor", "outdoor"];
  let image = [
    `https://source.unsplash.com/collection/1841259${imageSize}`,
    `https://source.unsplash.com/collection/9454911${imageSize}`,
    `https://source.unsplash.com/collection/173${imageSize}`,
    `https://source.unsplash.com/collection/3331316${imageSize}`,
    `https://source.unsplash.com/collection/3161728${imageSize}`,
  ];

  for (let i = 0; i < 3; i++) {
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
