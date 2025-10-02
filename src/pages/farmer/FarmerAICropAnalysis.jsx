import { useState } from 'react';
import { Upload, Camera, AlertCircle, Loader, CheckCircle, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';

const FarmerAICropAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  
  const [metadata, setMetadata] = useState({
    cropType: '',
    symptoms: '',
    location: ''
  });

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setSelectedImage(file);
    setError('');
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      // Simulated AI analysis - Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setResults({
        disease: 'Tomato Late Blight',
        confidence: 92,
        severity: 'Moderate',
        description: 'Late blight is caused by the fungus-like oomycete pathogen Phytophthora infestans. It affects leaves, stems, and fruits.',
        recommendations: [
          'Remove and destroy infected plants immediately',
          'Apply copper-based fungicide every 7-10 days',
          'Improve air circulation around plants',
          'Avoid overhead watering',
          'Apply preventive fungicide to healthy plants'
        ],
        organicTreatments: [
          'Neem oil spray (apply weekly)',
          'Baking soda solution (1 tbsp per gallon)',
          'Copper sulfate solution'
        ],
        preventionTips: [
          'Plant resistant varieties',
          'Space plants properly for air circulation',
          'Water at soil level, not on leaves',
          'Mulch to prevent soil splash',
          'Rotate crops yearly'
        ]
      });
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResults(null);
    setError('');
    setMetadata({ cropType: '', symptoms: '', location: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Crop Disease Analysis</h1>
        <p className="text-neutral-400">Upload a photo of your crop for instant disease detection</p>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Upload Crop Image</h2>
          
          {!imagePreview ? (
            <label className="block">
              <div className="border-2 border-dashed border-neutral-700 rounded-lg p-12 text-center hover:border-accent-teal transition-colors cursor-pointer">
                <Camera className="w-16 h-16 mx-auto mb-4 text-neutral-600" />
                <p className="text-neutral-400 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-neutral-500">PNG, JPG up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            </label>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Crop preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={handleReset}
                  className="absolute top-2 right-2 w-8 h-8 bg-error rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>

              <div className="space-y-3">
                <Input
                  label="Crop Type (Optional)"
                  placeholder="e.g., Tomatoes, Maize"
                  value={metadata.cropType}
                  onChange={(e) => setMetadata({...metadata, cropType: e.target.value})}
                />
                <Input
                  label="Symptoms Observed (Optional)"
                  placeholder="e.g., Yellow leaves, brown spots"
                  value={metadata.symptoms}
                  onChange={(e) => setMetadata({...metadata, symptoms: e.target.value})}
                />
                <Input
                  label="Location (Optional)"
                  placeholder="e.g., Accra"
                  value={metadata.location}
                  onChange={(e) => setMetadata({...metadata, location: e.target.value})}
                />
              </div>

              <Button
                fullWidth
                onClick={handleAnalyze}
                disabled={analyzing}
                loading={analyzing}
                icon={analyzing ? Loader : Upload}
              >
                {analyzing ? 'Analyzing...' : 'Analyze Crop'}
              </Button>
            </div>
          )}
        </Card>

        {/* Results Section */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
          
          {!results && !analyzing && (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-neutral-700" />
              <p className="text-neutral-500">Upload and analyze an image to see results</p>
            </div>
          )}

          {analyzing && (
            <div className="text-center py-12">
              <div className="animate-spin w-16 h-16 border-4 border-accent-teal border-t-accent-cyan rounded-full mx-auto mb-4" />
              <p className="text-neutral-400">Analyzing your crop...</p>
            </div>
          )}

          {results && (
            <div className="space-y-6">
              {/* Disease Detection */}
              <div className="p-4 bg-primary-dark rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-error">{results.disease}</h3>
                    <p className="text-sm text-neutral-400">Severity: {results.severity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent-cyan">{results.confidence}%</p>
                    <p className="text-xs text-neutral-500">Confidence</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-300 mt-3">{results.description}</p>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="text-success" size={20} />
                  Treatment Recommendations
                </h3>
                <ul className="space-y-2">
                  {results.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-accent-cyan mt-1">•</span>
                      <span className="text-neutral-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Organic Treatments */}
              <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                <h3 className="font-semibold mb-3 text-success">🌿 Organic Treatment Options</h3>
                <ul className="space-y-2">
                  {results.organicTreatments.map((treatment, idx) => (
                    <li key={idx} className="text-sm text-neutral-300">• {treatment}</li>
                  ))}
                </ul>
              </div>

              {/* Prevention Tips */}
              <div>
                <h3 className="font-semibold mb-3">Prevention for Future</h3>
                <ul className="space-y-2">
                  {results.preventionTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-warning mt-1">★</span>
                      <span className="text-neutral-300">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant="secondary"
                fullWidth
                onClick={handleReset}
              >
                Analyze Another Image
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="text-4xl mb-2">🎯</div>
          <h3 className="font-semibold mb-1">95% Accuracy</h3>
          <p className="text-sm text-neutral-400">AI-powered disease detection</p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl mb-2">⚡</div>
          <h3 className="font-semibold mb-1">Instant Results</h3>
          <p className="text-sm text-neutral-400">Get analysis in seconds</p>
        </Card>
        <Card className="text-center">
          <div className="text-4xl mb-2">🌱</div>
          <h3 className="font-semibold mb-1">Organic Options</h3>
          <p className="text-sm text-neutral-400">Eco-friendly treatments included</p>
        </Card>
      </div>
    </div>
  );
};

export default FarmerAICropAnalysis;