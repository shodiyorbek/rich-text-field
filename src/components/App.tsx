'use client'

import '../stylesheets/App.css';
import Something from './SlateEditor/Editor'
import 'katex/dist/katex.min.css';

const App: React.FC = () => {
  return (
    <div className="App min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Rich Text Editor Playground</h1>
        <div className="bg-white shadow-lg rounded-lg p-6 prose">
          <Something/>
        </div>
      </div>
      {/* <InlineMath math="\int_0^\infty x^2 dx"/> */}
      {/* <BlockMath math="\int_0^\infty x^2 dx"/> */}
    </div>
  );
}

export default App;

