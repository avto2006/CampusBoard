'use client';

import { useState } from 'react';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ['ჰაკათონი', 'ვორქშოფი', 'გაცვლითი პროგრამა', 'სტაჟირება', 'სხვა'];
const UNIVERSITIES = [
  'თსუ (TSU)',
  'ილიაუნი (Iliauni)',
  'CU',
  'CIU',
  'GAU',
  'UG (საქართველოს უნივერსიტეტი)',
  'BTU',
  'სხვა',
];

const inputCls =
  'w-full bg-[#1e293b] border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500';

const emptyEvent = {
  title: '',
  description: '',
  category: 'ჰაკათონი',
  university: 'თსუ (TSU)',
  date: '',
  location: '',
  link: '',
};

const emptyTeammate = {
  author: '',
  university: 'თსუ (TSU)',
  role_needed: '',
  title: '',
  description: '',
  contact: '',
};

export function AddModal({ isOpen, onClose }: AddModalProps) {
  const [type, setType] = useState<'event' | 'teammate'>('event');
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState(emptyEvent);
  const [teammateData, setTeammateData] = useState(emptyTeammate);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload =
        type === 'event'
          ? { type, ...eventData }
          : { type, ...teammateData };

      const res = await fetch('/api/events/auto-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('განცხადება წარმატებით დაემატა!');
        setEventData(emptyEvent);
        setTeammateData(emptyTeammate);
        onClose();
        window.location.reload();
      } else {
        const data = await res.json().catch(() => ({}));
        alert('შეცდომა გაგზავნისას: ' + (data.error || res.status));
      }
    } catch (err) {
      alert('სერვერის შეცდომა');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4 overflow-y-auto">
      <div className="bg-[#121824] border border-gray-800 text-white rounded-xl p-6 w-full max-w-lg shadow-2xl relative my-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">➕ განცხადების დამატება</h2>

        <div className="flex gap-2 mb-5 bg-[#1e293b] p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setType('event')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              type === 'event' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            ღონისძიება
          </button>
          <button
            type="button"
            onClick={() => setType('teammate')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              type === 'teammate' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            ვეძებ მეწყვილეს
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'event' ? (
            <>
              <div>
                <label className="block text-sm text-gray-400 mb-1">სათაური</label>
                <input
                  required
                  type="text"
                  className={inputCls}
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">აღწერა</label>
                <textarea
                  required
                  rows={3}
                  className={inputCls}
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">კატეგორია</label>
                  <select
                    className={inputCls}
                    value={eventData.category}
                    onChange={(e) => setEventData({ ...eventData, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">უნივერსიტეტი</label>
                  <select
                    className={inputCls}
                    value={eventData.university}
                    onChange={(e) => setEventData({ ...eventData, university: e.target.value })}
                  >
                    {UNIVERSITIES.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">თარიღი</label>
                  <input
                    type="date"
                    className={inputCls}
                    value={eventData.date}
                    onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">მდებარეობა</label>
                  <input
                    type="text"
                    placeholder="მაგ: თსუ / ონლაინ"
                    className={inputCls}
                    value={eventData.location}
                    onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">ბმული</label>
                <input
                  type="url"
                  placeholder="https://..."
                  className={inputCls}
                  value={eventData.link}
                  onChange={(e) => setEventData({ ...eventData, link: e.target.value })}
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">შენი სახელი</label>
                  <input
                    required
                    type="text"
                    className={inputCls}
                    value={teammateData.author}
                    onChange={(e) => setTeammateData({ ...teammateData, author: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">უნივერსიტეტი</label>
                  <select
                    className={inputCls}
                    value={teammateData.university}
                    onChange={(e) => setTeammateData({ ...teammateData, university: e.target.value })}
                  >
                    {UNIVERSITIES.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">რომელი ივენთისთვის ეძებ მეწყვილეს?</label>
                <input
                  required
                  type="text"
                  placeholder="მაგ: Hackathon 2026"
                  className={inputCls}
                  value={teammateData.title}
                  onChange={(e) => setTeammateData({ ...teammateData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">ვის ეძებ? (როლი)</label>
                <input
                  type="text"
                  placeholder="მაგ: UI/UX დიზაინერი"
                  className={inputCls}
                  value={teammateData.role_needed}
                  onChange={(e) => setTeammateData({ ...teammateData, role_needed: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">აღწერა</label>
                <textarea
                  rows={3}
                  className={inputCls}
                  value={teammateData.description}
                  onChange={(e) => setTeammateData({ ...teammateData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Telegram (@username) ან ბმული</label>
                <input
                  required
                  type="text"
                  placeholder="@username"
                  className={inputCls}
                  value={teammateData.contact}
                  onChange={(e) => setTeammateData({ ...teammateData, contact: e.target.value })}
                />
              </div>
            </>
          )}

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
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white rounded-lg font-medium"
            >
              {loading ? 'იგზავნება...' : 'დამატება'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddModal;