import OpenAI from "openai";


export const aiRewrite = async (req, res, next) => {
  try {
    const user_msg = req.body;
    const client = new OpenAI({
      apiKey: process.env.api_key,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const response = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: `Act as a professional message rewriter 
      Your task is to rewrite the given message: "${user_msg.user_message}". Rules:
          - Preserve the original meaning and intent.

          - Rewrite it in a creative and natural way, not a direct paraphrase.

          - The tone should be clear, casual, and friendly, as if the message is sent to a close friend.

          - Do not add extra context or remove information.

          Example:

            Original: "today I feel boring"

            Rewritten: "I'm feeling bored today, so I thought I'd text you."
              
          if any emoji is need add  
          `
    });
    res
      .status(200)
      .json({ aiRewriteMsg: response.output_text, status: true });

  } catch (err) {
    res
      .status(400)
      .json({ error: `error in server side : ${ex}`, status: false });
  }
  };
