import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Simple in-memory mutex to prevent race conditions
let isWriting = false;

// A more flexible interface for incoming data from n8n
interface IncomingArticle {
  titlu_seo?: string;
  meta_description?: string;
  continut_principal?: string;
  sursa_originala?: string;
  keywords_principale?: string | string[];
  keywords_secundare?: string | string[];
  categorii?: string | string[];
  tags?: string | string[];
  metadata?: string | { [key: string]: any };
  continut_html?: string;
  [key: string]: any; // Allow other properties
}

// Interface for the data structure as it's stored in stiri.json
interface StoredArticle {
  row_number: number;
  titlu_seo: string;
  meta_description: string;
  continut_principal: string;
  sursa_originala: string;
  keywords_principale: string; // stringified JSON
  keywords_secundare: string; // stringified JSON
  categorii: string; // stringified JSON
  tags: string; // stringified JSON
  metadata: string; // stringified JSON
  continut_html: string;
}

// Helper function to safely stringify data that might already be a string
const ensureStringified = (data: any): string => {
  if (data === null || data === undefined) {
    return '""';
  }
  
  if (typeof data === 'string') {
    // Check if it's a string that looks like an object or array
    const trimmed = data.trim();
    if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
      try {
        JSON.parse(trimmed);
        return trimmed; // It's already a valid JSON string
      } catch (e) {
        // It's a malformed JSON string, treat as regular string
        return JSON.stringify(data);
      }
    }
    // It's a plain string
    return JSON.stringify(data);
  }
  
  try {
    return JSON.stringify(data);
  } catch (e) {
    console.warn('Failed to stringify data, using empty object:', e);
    return '{}';
  }
};

export async function POST(req: NextRequest) {
  const authToken = req.headers.get('Authorization');
  const expectedToken = `Bearer ${process.env.N8N_TOKEN}`;

  if (authToken !== expectedToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Prevent race conditions from simultaneous requests
  if (isWriting) {
    return NextResponse.json({ message: 'Another request is processing, please try again' }, { status: 429 });
  }

  isWriting = true;

  try {
    const incomingData: IncomingArticle = await req.json();

    // --- More robust validation ---
    if (!incomingData.titlu_seo || typeof incomingData.titlu_seo !== 'string') {
      return NextResponse.json({ message: 'Invalid or missing titlu_seo' }, { status: 400 });
    }
    if (!incomingData.continut_principal || typeof incomingData.continut_principal !== 'string') {
      return NextResponse.json({ message: 'Invalid or missing continut_principal' }, { status: 400 });
    }

    // Clean strings to prevent JSON corruption
    const cleanString = (str: string): string => {
      if (typeof str !== 'string') return '';
      // Remove any problematic characters that could break JSON
      return str.replace(/[\x00-\x1F\x7F]/g, '').trim();
    };

    const filePath = path.join(process.cwd(), 'src', 'data', 'stiri.json');
    
    let articles: StoredArticle[] = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      if (fileContent.trim()) {
        try {
          articles = JSON.parse(fileContent);
          console.log(`Successfully read ${articles.length} existing articles from stiri.json`);
        } catch (parseError) {
          console.error('JSON parsing error:', parseError);
          console.error('Corrupted JSON content:', fileContent.substring(0, 500) + '...');
          return NextResponse.json({ 
            message: 'Error: stiri.json file is corrupted and cannot be parsed. Please fix the JSON structure manually.', 
            error: parseError instanceof Error ? parseError.message : 'JSON parse error' 
          }, { status: 500 });
        }
      } else {
        console.log('stiri.json is empty. Starting with empty array.');
        articles = [];
      }
    } catch (fileNotFoundError) {
      console.log('stiri.json not found. Creating new file with first article.');
      articles = [];
    }

    const maxRowNumber = articles.reduce((max, article) => Math.max(max, article.row_number || 0), 0);

    // --- Transform incoming data to the stored format ---
    const newArticle: StoredArticle = {
      row_number: maxRowNumber + 1,
      titlu_seo: cleanString(incomingData.titlu_seo),
      meta_description: cleanString(incomingData.meta_description || ''),
      continut_principal: cleanString(incomingData.continut_principal),
      sursa_originala: cleanString(incomingData.sursa_originala || ''),
      keywords_principale: ensureStringified(incomingData.keywords_principale),
      keywords_secundare: ensureStringified(incomingData.keywords_secundare),
      categorii: ensureStringified(incomingData.categorii),
      tags: ensureStringified(incomingData.tags),
      metadata: ensureStringified(incomingData.metadata),
      continut_html: cleanString(incomingData.continut_html || ''), // Use if provided, otherwise empty
    };

    articles.unshift(newArticle);

    // Validate JSON before writing to prevent corruption
    let jsonContent: string;
    try {
      jsonContent = JSON.stringify(articles, null, 2);
      // Test if the generated JSON is valid by parsing it
      JSON.parse(jsonContent);
    } catch (jsonError) {
      console.error('Error creating valid JSON:', jsonError);
      return NextResponse.json({ 
        message: 'Error: Failed to create valid JSON structure', 
        error: jsonError instanceof Error ? jsonError.message : 'JSON creation error' 
      }, { status: 500 });
    }

    // Use atomic write with backup on Windows
    const tempPath = filePath + '.tmp';
    const backupPath = filePath + '.backup';
    
    try {
      // Create backup of current file if it exists
      try {
        await fs.access(filePath);
        await fs.copyFile(filePath, backupPath);
      } catch (backupError) {
        // File doesn't exist, no backup needed
      }

      // Write to temporary file first
      await fs.writeFile(tempPath, jsonContent, { encoding: 'utf-8', flag: 'w' });
      
      // Verify the temp file was written correctly
      const tempContent = await fs.readFile(tempPath, 'utf-8');
      JSON.parse(tempContent); // Validate JSON
      
      // Move temp file to final location using copy + delete (safer on Windows)
      await fs.copyFile(tempPath, filePath);
      await fs.unlink(tempPath);
      
      console.log(`Successfully wrote ${articles.length} articles to stiri.json`);
    } catch (writeError) {
      console.error('Error writing file:', writeError);
      
      // Clean up temp file if it exists
      try {
        await fs.access(tempPath);
        await fs.unlink(tempPath);
      } catch (cleanupError) {
        // Temp file doesn't exist, ignore
      }
      
      // Restore from backup if something went wrong and backup exists
      try {
        await fs.access(backupPath);
        await fs.copyFile(backupPath, filePath);
      } catch (restoreError) {
        // No backup to restore
      }
      
      return NextResponse.json({ 
        message: 'Error: Failed to write to file', 
        error: writeError instanceof Error ? writeError.message : 'File write error' 
      }, { status: 500 });
    }

    return NextResponse.json({ message: 'Article added successfully', article: newArticle }, { status: 200 });
  } catch (error) {
    console.error('Error processing request:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  } finally {
    // Always release the lock
    isWriting = false;
  }
}