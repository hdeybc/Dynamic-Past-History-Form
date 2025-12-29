import React, { useState, ChangeEvent } from 'react';
import { Download, Upload, Plus, X, Clock } from 'lucide-react';

interface Disease {
  id: number;
  name: string;
  status: 'Yes' | 'No';
  since: string;
  notes: string;
  active: boolean;
}

interface SavedData {
  timestamp: string;
  activeCount: number;
  diseases: Disease[];
}

const MedicalHistoryForm: React.FC = () => {
  const initialDiseases: Disease[] = [
    { id: 1, name: 'Diabetes', status: 'Yes', since: '2018', notes: 'Type 1', active: true },
    { id: 2, name: 'Hypertension', status: 'Yes', since: '', notes: '', active: true },
    { id: 3, name: 'Thyroid Dysfunction', status: 'No', since: '', notes: '', active: true },
    { id: 4, name: 'Migraine', status: 'Yes', since: '', notes: '', active: true },
    { id: 5, name: 'Cardiac', status: 'No', since: '', notes: '', active: true },
    { id: 6, name: 'Epilepsy', status: 'No', since: '', notes: '', active: true },
    { id: 7, name: 'Asthma', status: 'No', since: '', notes: '', active: true },
    { id: 8, name: 'TB', status: 'Yes', since: '', notes: '', active: true },
    { id: 9, name: 'Blood Transfusion', status: 'Yes', since: '', notes: '', active: true },
    { id: 10, name: 'Surgery', status: 'No', since: '', notes: '', active: true },
    { id: 11, name: 'Thromboembolism', status: 'No', since: '', notes: '', active: true },
  ];

  const [diseases, setDiseases] = useState<Disease[]>(initialDiseases);
  const [activeCount, setActiveCount] = useState<number>(9);

  const handleStatusChange = (id: number, newStatus: 'Yes' | 'No'): void => {
    setDiseases(diseases.map(d => 
      d.id === id ? { ...d, status: newStatus } : d
    ));
  };

  const handleSinceChange = (id: number, value: string): void => {
    setDiseases(diseases.map(d => 
      d.id === id ? { ...d, since: value } : d
    ));
  };

  const handleNotesChange = (id: number, value: string): void => {
    setDiseases(diseases.map(d => 
      d.id === id ? { ...d, notes: value } : d
    ));
  };

  const addNewDisease = (): void => {
    const newId = Math.max(...diseases.map(d => d.id)) + 1;
    setDiseases([...diseases, {
      id: newId,
      name: '',
      status: 'No',
      since: '',
      notes: '',
      active: true
    }]);
    setActiveCount(activeCount + 1);
  };

  const removeDisease = (id: number): void => {
    setDiseases(diseases.map(d => 
      d.id === id ? { ...d, active: false } : d
    ));
    setActiveCount(activeCount - 1);
  };

  const handleNameChange = (id: number, value: string): void => {
    setDiseases(diseases.map(d => 
      d.id === id ? { ...d, name: value } : d
    ));
  };

  const saveToJSON = (): void => {
    const dataToSave: SavedData = {
      timestamp: new Date().toISOString(),
      activeCount: activeCount,
      diseases: diseases.filter(d => d.active)
    };
    
    const blob = new Blob([JSON.stringify(dataToSave, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `medical-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadFromJSON = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const result = e.target?.result;
          if (typeof result === 'string') {
            const data: SavedData = JSON.parse(result);
            setDiseases(data.diseases);
            setActiveCount(data.activeCount);
          }
        } catch (error) {
          alert('Error loading file. Please ensure it\'s a valid JSON file.');
          console.error('JSON parse error:', error);
        }
      };
      reader.readAsText(file);
    }
    // Reset the input value to allow re-uploading the same file
    event.target.value = '';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-800">PAST HISTORY</h2>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
              {activeCount} active
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={saveToJSON}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Save
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium cursor-pointer">
              <Upload className="w-4 h-4" />
              Load
              <input
                type="file"
                accept=".json"
                onChange={loadFromJSON}
                className="hidden"
              />
            </label>
            <button
              onClick={addNewDisease}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-600">
          <div className="col-span-4">DISEASE</div>
          <div className="col-span-2">STATUS</div>
          <div className="col-span-2">SINCE</div>
          <div className="col-span-3">NOTES</div>
          <div className="col-span-1"></div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {diseases.filter(d => d.active).map((disease) => (
            <div key={disease.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
              {/* Disease Name */}
              <div className="col-span-4">
                <input
                  type="text"
                  value={disease.name}
                  onChange={(e) => handleNameChange(disease.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Disease name"
                />
              </div>

              {/* Status */}
              <div className="col-span-2">
                <select
                  value={disease.status}
                  onChange={(e) => handleStatusChange(disease.id, e.target.value as 'Yes' | 'No')}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    disease.status === 'Yes'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-gray-50 text-gray-600 border border-gray-200'
                  }`}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {/* Since */}
              <div className="col-span-2">
                <input
                  type="text"
                  value={disease.since}
                  onChange={(e) => handleSinceChange(disease.id, e.target.value)}
                  placeholder="e.g. 2020"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-600"
                />
              </div>

              {/* Notes */}
              <div className="col-span-3">
                <input
                  type="text"
                  value={disease.notes}
                  onChange={(e) => handleNotesChange(disease.id, e.target.value)}
                  placeholder="Notes"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-600"
                />
              </div>

              {/* Delete Button */}
              <div className="col-span-1 flex justify-center">
                <button
                  onClick={() => removeDisease(disease.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          Data is automatically saved when you click "Save" button. Use "Load" to import previously saved data.
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryForm;