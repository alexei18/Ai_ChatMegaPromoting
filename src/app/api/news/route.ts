// src/app/api/news/route.ts
import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'stiri.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading stiri.json:', error);
    return NextResponse.json({ error: 'Failed to read news data' }, { status: 500 });
  }
}
