// app/divine-greetings/page.tsx

'use client';

import Image from 'next/image';
import { Sun, Moon, Heart, Sparkles, Download, Share2, Loader2, Star } from 'lucide-react';
import React, { useState } from 'react';

type Result = {
  type: string;
  content: string;
};

export default function DivineGreetingsPage() {
  const [formData, setFormData] = useState({
    timeOfDay: '',
    religion: '',
    deity: '',
    quoteType: '',
    customMessage: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState('');

  const timeOptions = [
    { id: 'morning', label: 'Good Morning', icon: Sun, color: 'from-yellow-400 to-orange-500', emoji: '🌅' },
    { id: 'night', label: 'Good Night', icon: Moon, color: 'from-purple-500 to-indigo-600', emoji: '🌙' }
  ];

  const religionOptions = [
    { id: 'hindu', label: 'Sanatan Dharma', emoji: '🕉️', color: 'from-orange-400 to-red-500' },
    { id: 'muslim', label: 'Islam', emoji: '☪️', color: 'from-green-400 to-emerald-500' },
    { id: 'christian', label: 'Christian', emoji: '✝️', color: 'from-blue-400 to-purple-500' },
    { id: 'sikh', label: 'Sikh', emoji: '☬', color: 'from-yellow-400 to-orange-500' }
  ];

  const deityOptions = {
    hindu: [
      { id: 'ganesha', label: 'Lord Ganesha', emoji: '🐘', desc: 'Remover of obstacles' },
      { id: 'krishna', label: 'Lord Krishna', emoji: '🦚', desc: 'Divine love & wisdom' },
      { id: 'shiva', label: 'Lord Shiva', emoji: '🔱', desc: 'Destroyer of evil' },
      { id: 'lakshmi', label: 'Goddess Lakshmi', emoji: '🪷', desc: 'Wealth & prosperity' },
      { id: 'durga', label: 'Goddess Durga', emoji: '🦁', desc: 'Divine strength' },
      { id: 'rama', label: 'Lord Rama', emoji: '🏹', desc: 'Righteousness & virtue' },
      { id: 'hanuman', label: 'Lord Hanuman', emoji: '🙏', desc: 'Strength & devotion' },
      { id: 'saraswati', label: 'Goddess Saraswati', emoji: '🎵', desc: 'Knowledge & wisdom' }
    ],
    muslim: [
      { id: 'allah', label: 'Allah', emoji: '🌙', desc: 'The Most Merciful' },
      { id: 'prophet', label: 'Prophet Muhammad', emoji: '🕌', desc: 'The Final Messenger' },
      { id: 'general', label: 'Islamic Blessing', emoji: '☪️', desc: 'Peace & guidance' }
    ],
    christian: [
      { id: 'jesus', label: 'Jesus Christ', emoji: '✝️', desc: 'Our Lord & Savior' },
      { id: 'mary', label: 'Virgin Mary', emoji: '👼', desc: 'Mother of Jesus' },
      { id: 'god', label: 'Heavenly Father', emoji: '☁️', desc: 'Our Creator' },
      { id: 'trinity', label: 'Holy Trinity', emoji: '🙏', desc: 'Father, Son, Holy Spirit' }
    ],
    sikh: [
      { id: 'waheguru', label: 'Waheguru', emoji: '☬', desc: 'The Wonderful Lord' },
      { id: 'guru_nanak', label: 'Guru Nanak', emoji: '🙏', desc: 'The First Guru' },
      { id: 'guru_gobind', label: 'Guru Gobind Singh', emoji: '⚔️', desc: 'The Tenth Guru' },
      { id: 'golden_temple', label: 'Golden Temple', emoji: '🏛️', desc: 'Sacred sanctuary' }
    ]
  };

  const quoteOptions = [
    { id: 'motivational', label: 'Motivational', color: 'bg-green-100 text-green-800', emoji: '💪' },
    { id: 'peaceful', label: 'Peaceful', color: 'bg-blue-100 text-blue-800', emoji: '🧘‍♀️' },
    { id: 'grateful', label: 'Grateful', color: 'bg-pink-100 text-pink-800', emoji: '🙏' },
    { id: 'hopeful', label: 'Hopeful', color: 'bg-purple-100 text-purple-800', emoji: '⭐' }
  ];

  const generatePrompt = () => {
    const timeOfDayText = formData.timeOfDay === 'morning' ? 'Good Morning' : 'Good Night';
    const timeContext = formData.timeOfDay === 'morning' ? 
      'sunrise, dawn, morning light, fresh start, new beginning' : 
      'moonlight, starry sky, peaceful night, calm evening, serene darkness';
    
    const selectedDeities = deityOptions[formData.religion as keyof typeof deityOptions] || [];
    const deityInfo = selectedDeities.find(d => d.id === formData.deity);
    const quoteTypeInfo = quoteOptions.find(q => q.id === formData.quoteType);
    const religionInfo = religionOptions.find(r => r.id === formData.religion);
    
    const customPart = formData.customMessage ? ` Include this message: "${formData.customMessage}".` : '';
    
    // Religious-specific styling
    let religiousContext = '';
    let colorScheme = '';
    let symbols = '';
    
    switch(formData.religion) {
      case 'hindu':
        religiousContext = 'traditional Indian/Hindu art style with lotus flowers, om symbols';
        colorScheme = 'warm saffron, deep red, golden yellow, and vibrant orange';
        symbols = 'om symbols, lotus flowers, diyas (oil lamps), geometric mandalas';
        break;
      case 'muslim':
        religiousContext = 'elegant Islamic art style with geometric patterns, calligraphy';
        colorScheme = 'emerald green, gold, deep blue, and white';
        symbols = 'geometric Islamic patterns, crescents, stars, beautiful Arabic calligraphy';
        break;
      case 'christian':
        religiousContext = 'serene Christian art style with crosses, doves, light rays';
        colorScheme = 'heavenly blue, pure white, gold, and soft pastels';
        symbols = 'crosses, doves, light rays, olive branches, sacred hearts';
        break;
      case 'sikh':
        religiousContext = 'Sikh art style with Khanda symbol, Gurmukhi script';
        colorScheme = 'royal blue, saffron orange, white, and gold';
        symbols = 'Khanda symbol, Gurmukhi script, swords, lotus flowers';
        break;
    }
    
    return `Create a beautiful WhatsApp ${timeOfDayText} greeting image with the following specifications:

RELIGIOUS CONTEXT: ${religionInfo?.label} tradition

VISUAL ELEMENTS:
- ${timeContext} with warm, divine lighting
- Beautiful ${deityInfo?.label} representation in ${religiousContext}
- Elegant typography for "${timeOfDayText}" text
- Decorative borders with ${symbols}
- Rich colors: ${colorScheme}
- Professional WhatsApp-friendly dimensions (square format)
- Respectful and authentic religious imagery

MOOD & ATMOSPHERE:
- ${quoteTypeInfo?.label.toLowerCase()} and uplifting tone
- Spiritual and divine ambiance
- Family-friendly and heartwarming
- Perfect for sharing with loved ones
- Culturally respectful and authentic

TEXT ELEMENTS:
- "${timeOfDayText}" as main heading in beautiful calligraphy
- A ${quoteTypeInfo?.label.toLowerCase()} quote/blessing related to ${deityInfo?.label}
- Appropriate religious greeting (e.g., "Om Namah Shivaya", "Assalamu alaykum", "God Bless", "Waheguru")
${customPart}

STYLE:
- Traditional ${religionInfo?.label} aesthetic meets modern design
- Instagram/WhatsApp optimized
- High quality, crisp details
- Warm and inviting color palette
- Professional yet personal feel
- Culturally authentic and respectful

Make it absolutely stunning, respectful, and shareable!`;
  };

  const handleGenerate = async () => {
    if (!formData.timeOfDay || !formData.religion || !formData.deity || !formData.quoteType) {
      alert('Please fill all required fields!');
      return;
    }

    setIsLoading(true);
    try {
      const prompt = generatePrompt();
      
      console.log('Sending request to API...'); // Debug log
      
      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          imagePath: 'public/test-images/template.png'
        }),
      });

      console.log('Response status:', response.status); // Debug log
      console.log('Response headers:', response.headers); // Debug log

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error('Non-JSON response:', responseText);
        throw new Error('API returned non-JSON response: ' + responseText);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      if (data.success) {
        const imageResult = data.results.find((r: Result) => r.type === 'image');
        const textResult = data.results.find((r: Result) => r.type === 'text');
        
        if (imageResult) {
          setGeneratedImage(imageResult.content);
        }
        if (textResult) {
          setGeneratedText(textResult.content);
        }
      } else {
        alert('Error generating image: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Detailed error:', error);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        alert('Network error: Please check if your API server is running.');
      } else if (error instanceof SyntaxError && error.message.includes('JSON')) {
        alert('API returned invalid JSON. Check server logs for details.');
      } else {
        alert('Failed to generate image: ' + (error as Error).message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `${formData.timeOfDay}-blessing-${Date.now()}.png`;
      link.click();
    }
  };

  const selectedDeities = formData.religion ? deityOptions[formData.religion as keyof typeof deityOptions] || [] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="text-center py-12 px-4">
        <div className="flex justify-center items-center mb-4">
          <Sparkles className="text-4xl text-orange-500 mr-2" />
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            Divine Greetings
          </h1>
          <Sparkles className="text-4xl text-pink-500 ml-2" />
        </div>
        <p className="text-xl md:text-2xl text-gray-700 mb-2">
          Making Indian Parents&apos; Life Easy, One Blessing at a Time! 🙏
        </p>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Say goodbye to the monotonous flood of the same boring &apos;Good Morning&apos; images. We generate fresh, beautiful, and unique greetings for a brighter start to every day
        </p>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create beautiful WhatsApp morning & night images with divine blessings from all faiths. 
          Perfect for sharing with family and friends! ✨
        </p>
        
        <div className="flex justify-center mt-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
          ))}
          <span className="ml-2 text-gray-600">Loved by Many parents across all faiths </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {/* Step 1: Time of Day */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
                Choose Your Greeting Time
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {timeOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setFormData({...formData, timeOfDay: option.id})}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        formData.timeOfDay === option.id
                          ? 'border-orange-500 bg-orange-50 scale-105'
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                      }`}
                    >
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${option.color} flex items-center justify-center`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-800">
                        {option.emoji} {option.label}
                      </h4>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Choose Religion */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
                Choose Your Faith Tradition
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {religionOptions.map((religion) => (
                  <button
                    key={religion.id}
                    onClick={() => setFormData({...formData, religion: religion.id, deity: ''})}
                    className={`p-6 rounded-xl border-2 text-center transition-all duration-300 ${
                      formData.religion === religion.id
                        ? 'border-pink-500 bg-pink-50 scale-105'
                        : 'border-gray-200 hover:border-pink-300 hover:bg-pink-25'
                    }`}
                  >
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${religion.color} flex items-center justify-center`}>
                      <span className="text-2xl text-white">{religion.emoji}</span>
                    </div>
                    <h4 className="font-semibold text-gray-800">{religion.label}</h4>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Choose Deity/Figure */}
            {formData.religion && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">3</span>
                  Select Divine Focus
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedDeities.map((deity) => (
                    <button
                      key={deity.id}
                      onClick={() => setFormData({...formData, deity: deity.id})}
                      className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                        formData.deity === deity.id
                          ? 'border-purple-500 bg-purple-50 scale-105'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                      }`}
                    >
                      <div className="text-3xl mb-2">{deity.emoji}</div>
                      <h4 className="font-semibold text-gray-800 text-sm">{deity.label}</h4>
                      <p className="text-xs text-gray-600 mt-1">{deity.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Quote Type */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">4</span>
                Choose Your Message Mood
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quoteOptions.map((quote) => (
                  <button
                    key={quote.id}
                    onClick={() => setFormData({...formData, quoteType: quote.id})}
                    className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                      formData.quoteType === quote.id
                        ? 'border-blue-500 bg-blue-50 scale-105'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{quote.emoji}</div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${quote.color}`}>
                      {quote.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: Custom Message */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">5</span>
                Add Personal Touch (Optional)
              </h3>
              <textarea
                placeholder="Add your personal message here... (e.g., 'Happy Birthday Mom!' or 'Wishing you success!')"
                value={formData.customMessage}
                onChange={(e) => setFormData({...formData, customMessage: e.target.value})}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none resize-none"
                rows={3}
              />
            </div>

            {/* Generate Button */}
            <div className="text-center mb-8">
              <button
                onClick={handleGenerate}
                disabled={isLoading || !formData.timeOfDay || !formData.religion || !formData.deity || !formData.quoteType}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-2xl text-xl font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Creating Magic...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-2" />
                    Generate Blessing Image
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            {generatedImage && (
              <div className="border-t-2 border-gray-100 pt-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  🎉 Your Divine Greeting is Ready!
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center">
                    <Image 
                      src={generatedImage} 
                      alt="Generated blessing" 
                      width={512}
                      height={512}
                      className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
                    />
                    <div className="flex justify-center gap-4 mt-4">
                      <button
                        onClick={handleDownload}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                      <button
                        onClick={() => navigator.share && navigator.share({url: generatedImage})}
                        className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </button>
                    </div>
                  </div>
                  {generatedText && (
                    <div className="bg-gray-50 p-6 rounded-2xl">
                      <h4 className="font-bold text-gray-800 mb-3">Just in case</h4>
                      <p className="text-gray-700 leading-relaxed">I sincerely apologize if anything across as disrespectful to your religion. Please know that any offense was completely unintentional</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <p>Made with love for amazing parents of all faiths! 🙏</p>
          <p className="text-sm mt-2">Unity in diversity, blessings for all! ✨</p>
        </div>
      </div>
    </div>
  );
}