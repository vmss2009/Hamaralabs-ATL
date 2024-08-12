const functions = require("firebase-functions");
const logger = require('firebase-functions/logger');
const express = require("express");
const cors = require("cors");
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");

require('dotenv').config()

const MODEL_NAME = "gemini-1.5-pro-latest";
const port = 3000

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.post("/generate", async (req, res) => {
    const {inputText} = req.body; 

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 1,
      topK: 0,
      topP: 0.95,
      maxOutputTokens: 8192,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const parts = [
      {text: "input: Give me a tinkering activity about chromatography"},
      {text: `output: {    "tips": [        "Use a variety of marker colors or plant leaves to observe different pigments."    ],    "resources": [        "Online tutorials or videos demonstrating paper chromatography."    ],    "taID": "SCM1693296692864",    "assessment": [        "Ask her to describe the changes she observed on the paper strip.",        "Discuss why certain pigments traveled farther than others.",        "Have her compare the colors obtained from markers with those from plant extracts."    ],    "intro": "Chromatography is a technique used to separate and analyze different components of a mixture. It's widely used in various fields, including chemistry, biology, and forensics. In this activity, she'll use paper chromatography to separate the pigments present in markers or plant extracts based on their solubility and interactions with the paper.",    "taName": "Chromatography",    "extensions": [        "Research the science behind chromatography and its applications.",        "Experiment with different paper types and solvents to observe changes in separation patterns."    ],    "goals": [        "Understand the basic principles of chromatography.",        "Learn about the solubility and separation of pigments.",        "Observe how different colors are made up of various pigments."    ],    "materials": [        "White coffee filters or chromatography paper strips,Water-soluble markers of various colors (or plant leaves with pigments)",        "Pencil,Tall glass or beaker,Tape,",        "Scissors,Ruler,Small container of water"    ],    "instructions": [        "Cut the coffee filters or chromatography paper into strips (about 2-3 cm wide and 10-15 cm long).",        "Using a pencil, draw a horizontal line about 1-2 cm from the bottom of the strip.",        "Choose a marker color or prepare a plant leaf for extracting pigments.",        "Make a small dot above the pencil line using the chosen marker color or apply plant extract.",        "Fill the glass or beaker with a small amount of water (enough to submerge the paper strip without touching the dot).",        "Hang the paper strip vertically into the glass, ensuring the dot is above the water line. You can tape the top end to the side of the glass.",        "As the water travels up the paper, it will carry the pigments with it. Different pigments will move at different rates, creating colorful patterns.",        "Allow the paper to stay in place until the water reaches near the top edge of the paper. Remove the paper and let it dry."    ]}`},
      {text: "input: Give me a tinkering activity about Crystal growing"},
      {text: `output: {    "tips": [        "Be patient; crystal growth takes time.",        "Avoid disturbing the container during growth.",        "Safety goggles are recommended, especially when handling hot water."    ],    "taName": "Crystal Growing",    "resources": [        "Crystal growing kits (available online or at science stores)"    ],    "extensions": [        "Research the types of crystals you've grown and their practical applications.",        "Experiment with different concentrations of the crystal-growing solution to observe how it affects crystal growth.",        "Compare your grown crystals with naturally occurring crystals."    ],    "assessment": [        "Keep a journal of your observations, including changes in the crystal's appearance, growth rate, and any unexpected occurrences."    ],    "intro": "In this tinkering activity, you'll explore the fascinating process of growing crystals. Crystals are beautiful, structured arrangements of molecules or atoms. Through this hands-on experience, you'll witness how crystals form and learn about the science behind their growth.",    "instructions": [        "Prepare the Solution:Follow the instructions provided in a crystal growing kit or create your own solution by dissolving Epsom salt, sugar, or borax in hot water until no more dissolves.",        "Create a Seed Crystal:Shape a string or pipe cleaner into a loop or tie it around a pencil/stick.Dip it into the solution and allow it to dry. This will serve as your seed crystal.",        "Prepare the Growing Container:Clean a glass or jar thoroughly, and if desired, add a few drops of food coloring to the solution for a colored effect.",        "Initiate Crystal Growth:Hang the seed crystal in the container without it touching the sides or bottom. Use a pencil or stick to balance it.",        "Observe and Wait:Place the container in a stable location away from direct sunlight or temperature changes.Over the next days or weeks, watch as the crystal grows larger as more substance adheres to the seed crystal.",        "Harvest and Display:Carefully remove the grown crystal from the container once it's reached the desired size.Allow it to dry completely before handling or displaying it."    ],    "materials": [        "Crystal growing kit (or you can gather Epsom salt, sugar, or borax)",        "Water,String or pipe cleaner,Pencil or stick,",        "Jar or glassFood coloring (optional)Safety goggles (for eye protection)"    ],    "goals": [        "Understand the process of crystal formation.",        "Explore how the rate of crystal growth can be influenced.",        "Develop an appreciation for the role of supersaturation in crystal growth.",        "Gain insights into the broader concepts of chemistry and materials science."    ],    "taID": "SCM1693285041741"}`},
      {text: "input: Give me tinkering activity about making bath bombs"},
      {text: `output: {    "extensions": [        "Experiment with different ratios of ingredients to observe how they affect fizziness and fragrance.",        "Research the science behind the reactions happening in the bath bombs.",        "Explore the concept of pH and its role in the fizzing reaction."    ],    "goals": [        "Understand the basics of chemical reactions and their effects.",        "Explore concepts of solubility, acids and bases, and effervescence."    ],    "instructions": [        "In a mixing bowl, combine 1 cup of baking soda, 1/2 cup of citric acid, 1/2 cup of cornstarch, and 1/2 cup of Epsom salt (if desired). Thoroughly whisk the dry ingredients to ensure an even mixture.",        "In a separate small bowl, mix a few drops of your chosen essential oils or fragrance oils with water. Add food coloring if desired for a colorful bath bomb. It's important to spray the mixture lightly and evenly to avoid activating the citric acid prematurely.",        "Slowly drizzle the wet mixture into the dry mixture while whisking continuously. The goal is to incorporate the wet ingredients without causing excessive fizzing.",        "Test the mixture's consistency: It should hold together when squeezed without crumbling. If it's too dry, lightly spray more water; if it's too wet, it might fizz prematurely.",        "Quickly pack the mixture into molds, pressing firmly to ensure they hold their shape. Let the molds sit for a few minutes to allow the mixture to set.",        "Gently tap the molds to release the bath bombs. Place them on a clean, dry surface to harden and dry for at least 24 hours."    ],    "assessment": [],    "materials": [        "Baking soda (sodium bicarbonate),Citric acid,Cornstarch.",        "Epsom salt (optional for muscle relaxation),Essential oils or fragrance oils,Food coloring (optional).",        "Water in a spray bottleMolds (can be spherical, heart-shaped, etc.),Mixing bowls.",        "Whisk,Measuring spoons."    ],    "resources": [        "Online tutorials and videos on making bath bombs.",        "Chemistry books or websites explaining the science behind the reactions.",        "Science kits or craft stores that offer bath bomb-making supplies."    ],    "intro": "Bath bombs are delightful self-care products that fizz and release pleasant aromas when dropped into water. They are made using simple chemistry principles and can be customized with various scents, colors, and even added benefits like moisturizers.",    "taName": "Making Bath Bombs",    "tips": [],    "taID": "SCM1693292249908"}`},
      {text: "input: Give me a tinkering activity about creating Slime or ploymers"},
      {text: `output: {    "instructions": [        "Prepare Borax Solution:Mix 1 teaspoon of borax powder with 1 cup of warm water in a mixing bowl. Stir until the borax is completely dissolved. This will be your cross-linking agent.",        "Prepare Glue Solution:In another mixing bowl, pour about ½ cup of clear glue. If desired, add a few drops of food coloring and stir to mix evenly.",        "Create Slime Mixture:Slowly add a small amount of the borax solution to the glue mixture while stirring continuously.As you add the borax solution, you'll notice the mixture transforming into slime. Keep stirring until the slime forms and starts pulling away from the sides of the bowl.",        "Knead and Play:Remove the slime from the bowl and knead it with your hands. This will help it become smoother and stretchier If it's too sticky, you can dip it briefly in the borax solution and knead again."    ],    "taID": "SCM1693293894661",    "taName": "Creating Slime or Polymers",    "extensions": [        "Experiment with adding small amounts of other materials (like glitter or small beads) to your slime to see how they interact.",        "Explore how changing the ratios of glue to borax solution affects the consistency of the slime.",        "Research different types of polymers and their applications in everyday life."    ],    "intro": "In this activity, you will explore the fascinating world of polymers by creating your own slime. Polymers are long chains of molecules that give substances unique properties. Slime is a classic example of a polymer, and you'll get to see firsthand how different ingredients can come together to create a fun and stretchy material.",    "materials": [        "Clear glue (polyvinyl acetate-based),Borax powder,Water,Measuring cups and spoons,",        "Food coloring (optional)Mixing bowlsStirring utensilSealable plastic bags (for storage)"    ],    "resources": [        "Online tutorials or videos demonstrating slime-making techniques.",        "Books or websites on polymer chemistry and materials science.",        "Educational videos explaining the science behind slime and polymers."    ],    "tips": [        "Borax can be an irritant, so avoid touching your face while handling it.",        "Always wash your hands thoroughly after playing with slime.",        "Store your slime in a sealable plastic bag to keep it from drying out."    ],    "assessment": [        "What changes did you notice as you added the borax solution to the glue?",        "Describe the texture and properties of the slime you created.",        "How do you think the borax solution contributes to the formation of slime?"    ],    "goals": [        "Learn about polymers and their properties.",        "Understand how chemical reactions and molecular chains contribute to material characteristics."    ]}`},
      {text: "input: Give me a tinkering activity for Testing Starch and Sugar"},
      {text: `output: {    "extensions": [        "Research and explain the differences between complex carbohydrates (starch) and simple carbohydrates (sugar).",        "Explore other food items or natural substances to test for the presence of starch and sugar."    ],    "materials": [        "Various food samples (potato, bread, rice, etc.)",        "Iodine solution (available at pharmacies or online)",        "Benedict's solution (available at pharmacies or online)",        "Test tubes or small containers",        "Droppers or pipettes,Water",        "Heat source (stove or hot plate),Safety goggles and lab apron"    ],    "intro": "Explain to her that this activity will allow her to explore the principles of chemical testing by investigating the presence of starch and sugar in different substances. Starch is a complex carbohydrate found in many foods, while sugar is a simple carbohydrate. This experiment will use common chemical indicators to detect the presence of these substances.",    "taName": "Testing for Starch and Sugar",    "assessment": [        "Ask her to describe the color changes she observed in both tests and explain their significance."    ],    "goals": [        "Understand the concept of chemical indicators and their role in detecting specific compounds.",        "Learn about the properties of starch and sugar.",        "Practice conducting a simple chemical test and interpreting the results."    ],    "taID": "SCM1693299188250",    "instructions": [        "Preparation: Gather all the materials and put on safety gear.",        "Preparing the Samples: Cut or crush the different food samples to expose their interior.",        "Testing for Starch:Place a small amount of the food sample in a test tube.Add a few drops of iodine solution to the sample and observe the color change. Blue-black color indicates the presence of starch.",        "Testing for Sugar:Mix a small amount of the food sample with water in a test tube.Add a few drops of Benedict's solution.Heat the test tube in a water bath for a few minutes. Observe any color changes. Orange-red or brick-red color indicates the presence of reducing sugars like glucose.",        "Safety and Cleanup: Dispose of the food samples properly. Clean and store the materials."    ],    "tips": [        "Use small amounts of the food samples and solutions to conserve resources.",        "Handle chemicals with care and follow safety guidelines.",        "Observe and record the changes in color accurately."    ],    "resources": [        "Online sources explaining iodine and Benedict's solution tests.",        "Chemistry textbooks or websites for background information on carbohydrates and chemical indicators."    ]}`},
      {text: "input: " + inputText},
      {text: "output: "},
    ];

    await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    }).then((response) => {
        return res.status(200).send({"success": true, "response": response});
    }).catch((error) => {
        return res.status(400).send({"success": false, "error": error});
    }); 
});

app.get("/" , (req, res) => {
    return res.status(200).send("Hello World");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

exports.tinkeringActivityAI = functions.https.onRequest(app);