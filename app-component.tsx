import React, { useState, useCallback } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { FormSchema } from './types';

const defaultSchema = {
  formTitle: "Project Requirements Survey",
  formDescription: "Please fill out this survey about your project needs",
  fields: []
};

const App = () => {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(defaultSchema, null, 2));
  const [schema, setSchema] = useState<FormSchema>(defaultSchema);
  const [error, setError] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleJsonChange = useCallback((value: string) => {
    setJsonInput(value);
    try {
      const parsed = JSON.parse(value);
      setSchema(parsed);
      setError('');
    } catch (e) {
      setError('Invalid JSON format');
    }
  }, []);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonInput);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Dynamic Form Generator
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleCopyJson}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Copy JSON
            </button>
            <button
              onClick={toggleDarkMode}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Toggle Theme
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="w-full">
            <textarea
              value={jsonInput}
              onChange={(e) => handleJsonChange(e.target.value)}
              className={`w-full h-[600px] font-mono p-4 rounded border ${
                isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50'
              }`}
            />
            {error && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="w-full">
            <DynamicForm schema={schema} isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
