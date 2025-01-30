const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
app.use(cors());
const axios = require('axios'); 
const fetch = require('node-fetch');    
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");
app.use(bodyParser.json());
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Increase timeout if necessary
  })
    .then(() => console.log('MongoDB Atlas connected successfully'))
    .catch((error) => console.error('MongoDB connection error:', error));
// Enable CORS
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from your React app
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    credentials: true // Allow cookies if needed
}));


const DestinationSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: String,
    latitude: Number,
    longitude: Number,
    distance: Number,
    sustainableMeasures: [String],
});


const Destination = mongoose.model('Destination', DestinationSchema);

// Example API to get destinations based on category
app.get('/api/destinations', async (req, res) => {
    const { category } = req.query;
    
    console.log("Received Category:", category); // Log the category value
    console.log("Full Request Query:", req.query);  // Log the entire query object
    try {
        const destinations = await Destination.find({ category });
       
        res.json(destinations);

    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch destinations' });
    }
});

// Example API to add destinations (populate your DB via Postman or similar tools)
app.post('/api/destinations', async (req, res) => {
    const { name, description, category, distance, sustainableMeasures } = req.body;
    try {
        const destination = new Destination({
            name,
            description,
            category,
            distance,
            sustainableMeasures,
        });
        await destination.save();
        res.status(201).json(destination);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add destination' });
    }
});



app.post('/api/suggestions', async (req, res) => {
    try {
        const { plasticBottles, plasticCovers, otherItems, destination, budget, type, numPeople } = req.body;

        const prompt = `You are an AI travel assistant. Based on the user's preferences and sustainability choices, provide personalized travel suggestions to be followed in Rishikesh in JSON format.

        **User Preferences:**
        - **Destination:** ${destination}
        - **Budget:** $${budget}
        - **Trip Type:** ${type} (e.g., adventure, spiritual, wellness)
        - **Number of People:** ${numPeople}
        - **Eco-friendly Considerations:** 
          - Plastic Bottles: ${plasticBottles.has === "yes" ? plasticBottles.count : 0}
          - Plastic Covers: ${plasticCovers.has === "yes" ? plasticCovers.count : 0}
          - Other Items: ${otherItems || "None"}

        **Expected JSON Output:**
        {
          "suggestions": [
            {
              "activity": "{Recommended Activity for the selected destination in Rishikesh}",
              "budgetRange": "{Estimated Cost}",
              "ecoTips": "{Eco-friendly travel advice based on user's sustainability choices}"
            },
            {
              "activity": "{Recommended Activity for the selected destination in Rishikesh}",
              "budgetRange": "{Estimated Cost}",
              "ecoTips": "{Eco-friendly travel advice based on user's sustainability choices}"
            },
            {
              "activity": "{Recommended Activity for the selected destination in Rishikesh}",
              "budgetRange": "{Estimated Cost}",
              "ecoTips": "{Eco-friendly travel advice based on user's sustainability choices}"
            }
          ]
        }

        Ensure each suggestion aligns with the user's budget and trip type, and provide eco-friendly recommendations where applicable. Respond **only** with valid JSON format.`;

        const response = await axios.post(
            "https://api.sambanova.ai/v1/chat/completions",
            {
                stream: true,
                model: "Meta-Llama-3.3-70B-Instruct",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: prompt },
                ],
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.SAMB_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const lines = response.data.split('\n');
        const dataLines = lines.filter(line => line.startsWith('data:'));
        const jsonData = dataLines.map(line => {
            const cleanLine = line.replace(/^data:\s*/, '');
            return cleanLine !== '[DONE]' ? JSON.parse(cleanLine) : null;
        }).filter(entry => entry !== null);

        let accumulatedDelta = '';
        jsonData.forEach(chunk => {
            if (chunk.choices[0].delta.content) {
                accumulatedDelta += chunk.choices[0].delta.content;
            }
        });
        let cleanedText = accumulatedDelta.replace(/^\`\`\`json\s*/, '').replace(/\`\`\`$/, '');

      //  console.log(cleanedText);

        res.json({ suggestions: JSON.parse(cleanedText) });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error in generating travel suggestions");
    }
});


// Replace with your NewsAPI key or use environment variables
const NEWS_API_KEY = process.env.NEWS_API;

app.get("/api/news", async (req, res) => {
    try {
        const url = `https://newsapi.org/v2/everything?q=Rishikesh&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;

        // Fetch data from the NewsAPI using Axios
        const response = await axios.get(url);

        // Log and extract the data
   

        // Send the news articles to the client
        res.status(200).json(response.data.articles);
    } catch (error) {
        console.error("Error fetching news:", error.message);
        res.status(500).json({ error: "Failed to fetch news" });
    }
});

const API_KEY = process.env.WEATHER_API  // Replace with your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

app.get('/api/weather', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}?q=Rishikesh&appid=${API_KEY}&units=metric`);
       
        // Extract the relevant data
        const weather = {
            temperature: response.data.main.temp,
            condition: response.data.weather[0].description,
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed,
            sunrise: new Date(response.data.sys.sunrise * 1000).toLocaleTimeString(),
            sunset: new Date(response.data.sys.sunset * 1000).toLocaleTimeString(),
            icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
        };

    
        res.json(weather);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ message: 'Error fetching weather data' });
    }
});


// Route to fetch restaurant data
app.get('/api/restaurants', async (req, res) => {
    try {
      // Replace 'YOUR_GOOGLE_API_KEY' with your actual Google API key
      const apiKey =process.env.GOOGLE_API_KEY; 
      const location = 'Rishikesh'; // Replace with your desired location
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+${encodeURIComponent(location)}&key=${apiKey}`;
      
      // Use axios to make the HTTP request
      const response = await axios.get(url);

      if (response.data.results) {
        res.json(response.data.results); // Send restaurant data to the frontend
      } else {
        res.status(404).json({ error: 'No restaurants found!' });
      }
    } catch (error) {
      console.error('Error fetching restaurant data:', error.message);
      res.status(500).json({ error: 'Failed to fetch restaurant data.' });
    }
  });



  const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/api/getPoints",  upload.single("photo"), async (req, res) => {
    const { file } = req;
    const { category } = req.body;

    if (!file) {
        return res.status(400).json({ error: "No image file uploaded." });
    }
    if (!category) {
        return res.status(400).json({ error: "No category provided." });
    }

    

    try {
        const compressedImage = await sharp(file.buffer)
        .resize({ width: 800 })  // Resize the image
        .toFormat("jpeg")
        .jpeg({ quality: 80 })  // Compress quality
        .toBuffer();  // Use toBuffer() instead of toFile()


        const imageBase64 = compressedImage.toString("base64");
        // Call AI model to analyze the image
        const recognizedCategory = await analyzeImageWithAI(imageBase64, category);

            
        if (recognizedCategory.toLowerCase().includes("yes")) {
            return res.json({ success: true, message: "Correct category! You earned 10 points.", pointsAwarded: 10 });
        } else {
            return res.json({ success: false, message: "Wrong category. Try again!", pointsAwarded: 0 });
        }
    } catch (error) {
        console.error("Error processing image:", error.message);
        return res.status(500).json({ error: error.message || "Failed to process the image." });
    }
});

// Function to call Sambanova AI API for image recognition
const analyzeImageWithAI = async (imageBase64, category) => {
    const apiKey = process.env.SAMB_API_KEY;
    const url = "https://api.sambanova.ai/v1/chat/completions";

    const headers = {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
    };
    const data = {
        model: "Llama-3.2-11B-Vision-Instruct",
        messages: [
            {
                role: "user",
                content: [
                 {  type: "text",
                            text: `You are an AI image classification assistant. Your task is to analyze the uploaded image and identify the objects or features it recognizes in the image. 
                                    Once you've identified the recognized content, compare it to the specified category: ${category}. 
                                    The output should be structured in the following JSON format.

                                    {
                                        "recognized_objects": [list of objects/features you recognized in the image],
                                        "category_match": "Yes" or "No"
                                    }
                                    If the image contains objects or features related to the specified category, respond with "Yes" in the "category_match" field. 
                                    If the image does not relate to the category, respond with "No". 
                                    
                                    **Example 1**: 
                                    If the image contains plants, soil, or trees, and the category is "Planting Trees", you should respond with "Yes".
                                    
                                    **Example 2**:
                                    If the image contains plastic items or waste materials, and the category is "Planting Trees", you should respond with "No", because the content does not match the category.
                                    
                                    **Example 3**:
                                    If the image contains a bicycle, and the category is "Recycle Plastics", you should respond with "No", because a bicycle is not related to recycling plastics.
                        
                                     Ensure:
                                           1. Respond only with the proper JSON structure, no additional text.    `    
                        
                 },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/jpeg;base64,${imageBase64}`,
                        },
                    },
                ],
            },
        ],
        temperature: 0.1,
        top_p: 0.1,
    };
    

    try {
        const response = await axios.post(url, data, { headers });
        const recognizedCategory = response.data.choices[0].message.content.trim();
        //console.log(response)
        return recognizedCategory;
    } catch (error) {
        console.error("Error calling Sambanova API:", error.response?.data || error.message);
        throw new Error("Error with the AI API request.");
    }
};

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

