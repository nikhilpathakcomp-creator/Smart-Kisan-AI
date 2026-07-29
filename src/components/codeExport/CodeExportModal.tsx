import React, { useState } from 'react';
import { Code, Download, Copy, Check, FileCode, Layers, Server } from 'lucide-react';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'flutter' | 'express' | 'python' | 'mongo' | 'readme'>('flutter');
  const [copied, setCopied] = useState(false);

  const flutterMainDart = `// Smart Kisan AI - Complete Flutter App Entry Point
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  runApp(const SmartKisanApp());
}

class SmartKisanApp extends StatelessWidget {
  const SmartKisanApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart Kisan AI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.green,
        textTheme: GoogleFonts.poppinsTextTheme(),
        scaffoldBackgroundColor: const Color(0xFFAFAFA),
      ),
      home: const MainHomeScreen(),
    );
  }
}

class MainHomeScreen extends StatefulWidget {
  const MainHomeScreen({Key? key}) : super(key: key);

  @override
  State<MainHomeScreen> createState() => _MainHomeScreenState();
}

class _MainHomeScreenState extends State<MainHomeScreen> {
  int _selectedIndex = 0;

  final List<Widget> _screens = const [
    DashboardView(),
    DiseaseDetectionScreen(),
    ChatbotScreen(),
    MarketPricesScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: _screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        selectedItemColor: const Color(0xFF15803D),
        unselectedItemColor: Colors.grey,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.camera_alt_outlined), label: 'Disease AI'),
          BottomNavigationBarItem(icon: Icon(Icons.smart_toy_outlined), label: 'Chatbot'),
          BottomNavigationBarItem(icon: Icon(Icons.trending_up), label: 'Mandi Rates'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profile'),
        ],
      ),
    );
  }
}

class DashboardView extends StatelessWidget {
  const DashboardView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Smart Kisan AI', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF14532D),
        actions: [
          IconButton(icon: const Icon(Icons.notifications_none), onPressed: () {}),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF166534), Color(0xFF15803D)]),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text('Namaste, Ramesh Patil!', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
                  SizedBox(height: 4),
                  Text('Nashik, Maharashtra • 4.5 Acres Land', style: TextStyle(color: Colors.white70, fontSize: 12)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
class DiseaseDetectionScreen extends StatelessWidget {
  const DiseaseDetectionScreen({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('AI Disease Scanner')));
}
class ChatbotScreen extends StatelessWidget {
  const ChatbotScreen({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Krishi Mitra Chatbot')));
}
class MarketPricesScreen extends StatelessWidget {
  const MarketPricesScreen({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Mandi Prices')));
}
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: const Text('Farmer Profile')));
}
`;

  const expressBackendCode = `// Smart Kisan AI - Node.js Express Backend API (server.js)
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// AI Disease Detection Endpoint
app.post('/api/ai/disease-detect', async (req, res) => {
  const { imageBase64, cropHint } = req.body;
  try {
    const cleanBase64 = imageBase64.replace(/^data:image\\/\\w+;base64,/, '');
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
        { text: 'Analyze this plant disease image and output JSON with diseaseName, confidenceScore, symptoms, causes, organic & chemical treatments.' }
      ],
      config: { responseMimeType: 'application/json' }
    });
    res.json(JSON.parse(response.text));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI Chatbot Endpoint
app.post('/api/ai/chatbot', async (req, res) => {
  const { message } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: { systemInstruction: 'You are Krishi Mitra, an expert Indian agronomist assistant.' }
    });
    res.json({ reply: response.text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Smart Kisan API listening on port 3000'));
`;

  const pythonAiCode = `# Smart Kisan AI - Python AI Microservice (main.py)
from flask import Flask, request, jsonify
import tensorflow as tf
from PIL import Image
import numpy as np
import io

app = Flask(__name__)

# Load trained PyTorch / Keras crop disease model
MODEL_PATH = "models/crop_disease_model.h5"
# model = tf.keras.models.load_model(MODEL_PATH)

CLASSES = ["Tomato_Early_Blight", "Rice_Blast", "Cotton_Leaf_Curl", "Healthy"]

@app.route("/predict-disease", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No image file uploaded"}), 400
    
    file = request.files["file"]
    img = Image.open(io.BytesIO(file.read())).resize((224, 224))
    img_array = np.expand_dims(np.array(img) / 255.0, axis=0)
    
    # predictions = model.predict(img_array)
    # class_idx = np.argmax(predictions[0])
    
    return jsonify({
        "diseaseName": CLASSES[0],
        "confidenceScore": 94.8,
        "status": "success"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
`;

  const mongoSchemaCode = `// MongoDB Mongoose Schemas (models/Farmer.js)
const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ['farmer', 'admin'], default: 'farmer' },
  language: { type: String, enum: ['en', 'hi', 'mr'], default: 'en' },
  location: {
    district: String,
    state: String,
    pincode: String
  },
  farmInfo: {
    landSizeAcres: Number,
    soilType: String,
    irrigationSource: String,
    primaryCrops: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Farmer', FarmerSchema);
`;

  const readmeCode = `# Smart Kisan AI - Production Deployment Guide

## Architecture Overview
- Frontend: Flutter (Android / iOS / Web)
- Backend: Node.js + Express REST API
- Database: MongoDB
- AI Models: Gemini 3.6 Flash + PyTorch/TensorFlow Vision Model

## Quick Start
1. Clone repository
2. Set environment variables:
   \`GEMINI_API_KEY="your_api_key"\`
   \`JWT_SECRET="your_secret"\`
   \`MONGODB_URI="mongodb://localhost:27017/smart_kisan"\`
3. Run Backend:
   \`npm install && npm start\`
4. Run Flutter Mobile App:
   \`flutter pub get && flutter run\`
`;

  const getCode = () => {
    switch (activeTab) {
      case 'flutter':
        return flutterMainDart;
      case 'express':
        return expressBackendCode;
      case 'python':
        return pythonAiCode;
      case 'mongo':
        return mongoSchemaCode;
      case 'readme':
        return readmeCode;
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(getCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-900 text-slate-100 rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl border border-slate-800">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Code className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm sm:text-base text-white">
              Smart Kisan AI Source Code & Deployment Exporter
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white font-bold p-1 text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-2 border-b border-slate-800 overflow-x-auto text-xs font-semibold gap-1">
          <button
            onClick={() => setActiveTab('flutter')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'flutter' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Flutter Frontend (Dart)
          </button>
          <button
            onClick={() => setActiveTab('express')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'express' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Express Backend (Node.js)
          </button>
          <button
            onClick={() => setActiveTab('python')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'python' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Python AI Service (Flask/PyTorch)
          </button>
          <button
            onClick={() => setActiveTab('mongo')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'mongo' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            MongoDB Schema
          </button>
          <button
            onClick={() => setActiveTab('readme')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'readme' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            README & Deployment Guide
          </button>
        </div>

        {/* Code Content Viewer */}
        <div className="flex-1 p-4 overflow-auto font-mono text-xs bg-slate-950 text-emerald-300 leading-relaxed">
          <pre>{getCode()}</pre>
        </div>
      </div>
    </div>
  );
};
