'use client';

import { useState } from 'react';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddModal({ isOpen, onClose }: AddModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'Hackathon',
    link: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/events/auto-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert('ღონისძიება წარმატებით გაიგზავნა!');
        onClose();
      } else {
        alert('შეცდომა გაგზავნისას');
      }
    } catch (err) {
      alert('სერვერის შეცდომა');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#121824] border border-gray-800 text-white rounded-xl p-6 w-full max-w-lg shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">➕ ღონისძიების დამატება</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">სათაური</label>
            <input 
              required
              type="text" 
              className="w-full bg-[#1e293b] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">აღწერა</label>
            <textarea 
              required
              rows={3}
              className="w-full bg-[#1e293b] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">კატეგორია</label>
              <select 
                className="w-full bg-[#1e293b] border border-gray-700 rounded-lg p-2 text-white focus:outline-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Hackathon">ჰაკათონი</option>
                <option value="Workshop">ვორქშოფი</option>
                <option value="Internship">სტაჟირება</option>
                <option value="Other">სხვა</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">მდებარეობა</label>
              <input 
                type="text" 
                placeholder="მაგ: თსუ / ონლაინ"
                className="w-full bg-[#1e293b] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">ბმული</label>
            <input 
              type="url" 
              placeholder="https://..."
              className="w-full bg-[#1e293b] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
              value={formData.link}
              onChange={(e) => setFormData({...formData, link: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg"
            >
              გაუქმება
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium"
            >
              {loading ? 'იგზავნება...' : 'დამატება'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}