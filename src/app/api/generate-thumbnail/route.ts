// app/api/generate-image/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('JSON parsing error:', error);
      return NextResponse.json({ 
        error: 'Invalid JSON in request body' 
      }, { status: 400 });
    }

    const { prompt, imagePath } = body;

    // Validate required fields
    if (!prompt || !imagePath) {
      return NextResponse.json({ 
        error: 'Missing required fields: prompt and imagePath' 
      }, { status: 400 });
    }

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY environment variable is not set');
      return NextResponse.json({ 
        error: 'API key not configured. Please check server configuration.' 
      }, { status: 500 });
    }

    // Initialize Google GenAI
    let ai;
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
      });
    } catch (error) {
      console.error('Error initializing GoogleGenAI:', error);
      return NextResponse.json({ 
        error: 'Failed to initialize AI service' 
      }, { status: 500 });
    }

    // Read the image file
    const fullImagePath = path.join(process.cwd(), imagePath);
    
    if (!fs.existsSync(fullImagePath)) {
      console.error(`Image file not found at path: ${fullImagePath}`);
      
      // Create a simple template if it doesn't exist
      const templateDir = path.dirname(fullImagePath);
      if (!fs.existsSync(templateDir)) {
        fs.mkdirSync(templateDir, { recursive: true });
      }
      
      // Create a basic 1x1 pixel PNG as template
      const basicTemplate = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        'base64'
      );
      fs.writeFileSync(fullImagePath, basicTemplate);
    }

    let imageData, base64Image;
    try {
      imageData = fs.readFileSync(fullImagePath);
      base64Image = imageData.toString("base64");
    } catch (error) {
      console.error('Error reading image file:', error);
      return NextResponse.json({ 
        error: `Failed to read image file at ${imagePath}` 
      }, { status: 400 });
    }

    // Prepare the prompt
    const genAIPrompt = [
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Image,
        },
      },
    ];

    // Generate content
    let response;
    try {
      console.log('Calling Google GenAI API...');
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents: genAIPrompt,
      });
      console.log('Google GenAI API call successful');
    } catch (error) {
      console.error('Error calling Google GenAI API:', error);
      return NextResponse.json({
        error: 'Failed to generate content with AI service',
        details: error instanceof Error ? error.message : 'Unknown AI service error'
      }, { status: 500 });
    }

    const candidates = response.candidates;
    
    if (candidates && candidates[0]?.content?.parts) {
      const results = [];
      
      for (const part of candidates[0].content.parts) {
        if (part.text) {
          results.push({
            type: 'text',
            content: part.text
          });
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          if (typeof imageData === "string") {
            try {
              // Save generated image
              const outputPath = path.join(process.cwd(), 'public', 'generated', `generated-${Date.now()}.png`);
              
              const outputDir = path.dirname(outputPath);
              if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
              }
              
              const buffer = Buffer.from(imageData, "base64");
              fs.writeFileSync(outputPath, buffer);
              
              const publicPath = `/generated/${path.basename(outputPath)}`;
              
              results.push({
                type: 'image',
                content: publicPath,
                base64: imageData
              });
            } catch (error) {
              console.error('Error saving generated image:', error);
              return NextResponse.json({
                error: 'Failed to save generated image'
              }, { status: 500 });
            }
          }
        }
      }
      
      return NextResponse.json({
        success: true,
        results: results,
        message: 'Content generated successfully'
      });
      
    } else {
      console.error('No candidates or parts found in AI response');
      return NextResponse.json({
        error: 'No content generated by AI service'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('Unexpected error in API route:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Optional: Add GET method for API info
export async function GET() {
  return NextResponse.json({
    message: 'Google GenAI Image Generation API',
    methods: ['POST'],
    usage: 'Send POST request with prompt and imagePath in body',
    status: 'API is running',
    timestamp: new Date().toISOString()
  });
}