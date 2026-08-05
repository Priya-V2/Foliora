import { BadRequestException } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';
import * as mammoth from 'mammoth';
import WordExtractor from 'word-extractor';
import { AllowedResumeMimeType } from '../../resume/validators/resume-file.validator';

// Dispatches to the right text-extraction library by mimetype. Used only by
// the Extracted-Text strategy - the PDF-native strategy sends the file to
// Gemini as-is and never calls this.
export async function extractTextFromFile(
  fileBuffer: Buffer,
  mimeType: string,
): Promise<string> {
  switch (mimeType as AllowedResumeMimeType) {
    case 'application/pdf':
      return extractFromPdf(fileBuffer);
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return extractFromDocx(fileBuffer);
    case 'application/msword':
      return extractFromDoc(fileBuffer);
    default:
      throw new BadRequestException(
        `Unsupported file type for text extraction: ${mimeType}`,
      );
  }
}

async function extractFromPdf(fileBuffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: fileBuffer });
  try {
    const result = await parser.getText();
    return result.text;
  } finally {
    await parser.destroy();
  }
}

async function extractFromDocx(fileBuffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer: fileBuffer });
  return result.value;
}

async function extractFromDoc(fileBuffer: Buffer): Promise<string> {
  const extractor = new WordExtractor();
  const document = await extractor.extract(fileBuffer);
  return document.getBody();
}
