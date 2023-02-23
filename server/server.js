// express for server and cors for cross origin requests
// dotenv for environment variables allow us to get that data from .env file
import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
// configuration and OpenAIApi for openai to simplify the process of making requests
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

// create a new configuration with the api key
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// create a new instance of the openai api
const openai = new OpenAIApi(configuration);

// create a new instance of express
// cors is a middleware that allows cross origin requests
// express.json() is a middleware that allows us to parse json data
const app = express()
app.use(cors())
app.use(express.json())

// from the request body
// we can now use req.body to get the data from the request body
// we can also use res.status().send() to send a response to the client
app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})

// app.get is used to handle get requests to retrieve data from fronted
// app.post is used to handle post requests to send data to the backend from the frontend
app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });
// res.send is used to send a response to the client
    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})
//app.listen is used to start the server and listen to new requests on the specified port
app.listen(5000, () => console.log('AI server started on http://localhost:5000'))