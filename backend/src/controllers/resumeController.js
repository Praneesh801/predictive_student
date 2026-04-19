import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Resume from '../models/Resume.js';
import { scoreResume } from '../utils/resumeScorer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please upload a PDF or TXT file.' });
    }

    const { originalname, filename, path: filePath, mimetype } = req.file;
    const studentName = req.body.studentName || 'Anonymous';

    let extractedText = '';

    if (mimetype === 'application/pdf') {
      try {
        // Dynamic import for pdf-parse
        const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
        const dataBuffer = fs.readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text;
      } catch (pdfErr) {
        console.error('PDF parsing warning:', pdfErr.message);
        extractedText = '';
      }
    } else if (mimetype === 'text/plain') {
      extractedText = fs.readFileSync(filePath, 'utf8');
    } else {
      // Try reading as text
      try {
        extractedText = fs.readFileSync(filePath, 'utf8');
      } catch {
        extractedText = '';
      }
    }

    // Score the resume
    const result = scoreResume(extractedText);

    // Save to DB
    const resume = await Resume.create({
      studentName,
      fileName: filename,
      originalName: originalname,
      extractedText: extractedText.substring(0, 5000), // limit stored text
      score: result.score,
      grade: result.grade,
      scoreBreakdown: result.scoreBreakdown,
      feedback: result.feedback,
      strengths: result.strengths,
      improvements: result.improvements,
      keywords: result.keywords
    });

    res.status(201).json({
      message: 'Resume uploaded and analyzed successfully',
      resumeId: resume._id,
      studentName,
      fileName: originalname,
      score: result.score,
      grade: result.grade,
      scoreBreakdown: result.scoreBreakdown,
      feedback: result.feedback,
      strengths: result.strengths,
      improvements: result.improvements,
      keywords: result.keywords,
      textExtracted: extractedText.length > 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Resume processing failed', error: err.message });
  }
};

export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find().select('-extractedText').sort({ createdAt: -1 }).limit(20);
    res.json({ resumes });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching resumes', error: err.message });
  }
};

export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id).select('-extractedText');
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json({ resume });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching resume', error: err.message });
  }
};

export const scoreTextResume = async (req, res) => {
  try {
    const { text, studentName } = req.body;
    if (!text) return res.status(400).json({ message: 'Resume text is required' });

    const result = scoreResume(text);
    const resume = await Resume.create({
      studentName: studentName || 'Anonymous',
      fileName: 'text-input',
      originalName: 'Text Input',
      extractedText: text.substring(0, 5000),
      score: result.score,
      grade: result.grade,
      scoreBreakdown: result.scoreBreakdown,
      feedback: result.feedback,
      strengths: result.strengths,
      improvements: result.improvements,
      keywords: result.keywords
    });

    res.status(201).json({
      message: 'Resume text analyzed',
      resumeId: resume._id,
      ...result
    });
  } catch (err) {
    res.status(500).json({ message: 'Score error', error: err.message });
  }
};
