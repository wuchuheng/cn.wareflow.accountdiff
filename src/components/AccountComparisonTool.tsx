// Function to compare accounts between two lists using draft-js editors
import { CompositeDecorator, ContentBlock, Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { ReactNode, useCallback, useRef, useState } from 'react';

// Define types for store name entries
interface StoreNameEntry {
  name: string;
  isValid: boolean;
  lineIndex: number;
  // Store position info for highlighting
  startPos: number;
  endPos: number;
}

// Define type for duplicate info
interface DuplicateInfo {
  leftDuplicates: { [name: string]: number };
  rightDuplicates: { [name: string]: number };
}

// Define type for decorator callback function
type DecoratorCallback = (start: number, end: number) => void;

// Draft.js Editor wrapper component to handle focus and other issues
const DraftEditor = ({
  editorState,
  onChange,
  placeholder,
}: {
  editorState: EditorState;
  onChange: (state: EditorState) => void;
  placeholder?: string;
}) => {
  const editorRef = useRef<Editor>(null);

  return (
    <div
      onClick={() => {
        editorRef.current?.focus();
      }}
      className="min-h-full"
    >
      <Editor
        ref={editorRef}
        editorState={editorState}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

// Component for highlighting matched entries
const MatchedSpan = (props: { children: ReactNode }) => (
  <span className="bg-red-300 bg-opacity-30">{props.children}</span>
);

function extractStoreName(line: string): string {
  const match = line.match(/^([^#]+)#([^#]+)#/);
  if (match && match[1].length > 0) {
    return match[1].trim();
  }

  const match2 = line.match(/\d+\s([^\s]+)\s[a-zA-Z\d]+@[a-zA-z\d]+\.[a-zA-z]+\s[^\s]+\s.*/);
  if (match2 && match2[1].length > 0) {
    return match2[1].trim();
  }

  return '';
}

function AccountComparisonTool() {
  // Initialize editor states
  const [leftEditorState, setLeftEditorState] = useState(EditorState.createEmpty());
  const [rightEditorState, setRightEditorState] = useState(EditorState.createEmpty());
  // Add state to track matches
  const [matchCount, setMatchCount] = useState(0);
  // Add state to track duplicate names
  const [duplicateInfo, setDuplicateInfo] = useState<DuplicateInfo>({
    leftDuplicates: {},
    rightDuplicates: {},
  });
  // Rename debug state to make it usable
  const [debugInfo, setDebugInfo] = useState<{
    leftNames: string[];
    rightNames: string[];
    matchedNames: string[];
  }>({ leftNames: [], rightNames: [], matchedNames: [] });
  // Add state to control debug visibility
  const [showDebug, setShowDebug] = useState(false);

  // 1. Extract store names from left editor (logged-in accounts)
  const extractStoreNames = useCallback((text: string): StoreNameEntry[] => {
    const storeNames: StoreNameEntry[] = [];
    const lines = text.split('\n');

    // 1.1 Process each line and extract store names
    lines.forEach((line: string, index: number) => {
      if (!line.trim()) return; // Skip empty lines

      // Match format: [number] [store name] [email]...
      // More specific regex to capture exactly the pattern we want
      const storeName = extractStoreName(line);

      if (storeName.length > 0) {
        const startPos = line.indexOf(storeName);
        const endPos = startPos + storeName.length;

        storeNames.push({
          name: storeName,
          isValid: true,
          lineIndex: index,
          startPos,
          endPos,
        });
      } else {
        // For invalid format entries, just mark as invalid (we won't highlight these)
        storeNames.push({
          name: line,
          isValid: false,
          lineIndex: index,
          startPos: 0,
          endPos: 0,
        });
      }
    });

    return storeNames;
  }, []);

  // Helper function to find duplicate names
  const findDuplicates = (names: string[]): { [name: string]: number } => {
    const counts: { [name: string]: number } = {};
    const duplicates: { [name: string]: number } = {};

    names.forEach((name) => {
      counts[name] = (counts[name] || 0) + 1;
      if (counts[name] > 1) {
        duplicates[name] = counts[name];
      }
    });

    return duplicates;
  };

  // 3. Implement comparison logic and highlighting
  const compareAccounts = useCallback(() => {
    // 3.1 Get current text from both editors
    const leftText = leftEditorState.getCurrentContent().getPlainText();
    const rightText = rightEditorState.getCurrentContent().getPlainText();

    // 3.2 Extract store names from both texts
    const leftStoreNames = extractStoreNames(leftText);
    const rightStoreNames = extractStoreNames(rightText);

    // For debugging - show what we extracted
    const leftValidNames = leftStoreNames.filter((item) => item.isValid).map((item) => item.name);
    const rightValidNames = rightStoreNames.filter((item) => item.isValid).map((item) => item.name);

    console.log('Left store names:', leftValidNames);
    console.log('Right store names:', rightValidNames);

    // 3.3 Check for duplicate names
    const leftDuplicates = findDuplicates(leftValidNames);
    const rightDuplicates = findDuplicates(rightValidNames);

    // Update duplicate info state
    setDuplicateInfo({
      leftDuplicates,
      rightDuplicates,
    });

    // Show message if duplicates are found
    const leftDupeCount = Object.keys(leftDuplicates).length;
    const rightDupeCount = Object.keys(rightDuplicates).length;

    if (leftDupeCount > 0 || rightDupeCount > 0) {
      let warningMsg = 'Duplicate store names found: ';
      if (leftDupeCount > 0) {
        warningMsg += `${leftDupeCount} in logged-in accounts`;
      }
      if (leftDupeCount > 0 && rightDupeCount > 0) {
        warningMsg += ' and ';
      }
      if (rightDupeCount > 0) {
        warningMsg += `${rightDupeCount} in wished login accounts`;
      }
      // Display the message
    }

    // 3.4 Create a set of store names from the right editor for quick lookup
    const rightStoreNamesSet = new Set(rightValidNames);

    // 3.5 Find matching names and count them
    const matchingNames = leftValidNames.filter((name) => rightStoreNamesSet.has(name));
    console.log('leftValidNames:', leftValidNames);
    console.log('rightStoreNamesSet:', rightStoreNamesSet);
    console.log('Matching names:', matchingNames);

    setMatchCount(matchingNames.length);
    setDebugInfo({
      leftNames: leftValidNames,
      rightNames: rightValidNames,
      matchedNames: matchingNames,
    });

    // Create maps to store the matched entries for exact highlighting
    const matchedNamesSet = new Set(matchingNames);

    // 3.6 Create decorators for highlighting only matching store names
    const leftDecorator = new CompositeDecorator([
      {
        strategy: (contentBlock: ContentBlock, callback: DecoratorCallback) => {
          const blockText = contentBlock.getText();

          // Find the corresponding store entry by matching the text content
          const storeEntry = leftStoreNames.find((item) => {
            // Check if this block contains the store name at the expected position
            if (!item.isValid) return false;

            // For left editor: Check if the block text contains the store name at the expected position
            return blockText.indexOf(item.name) === item.startPos;
          });

          // Only highlight if it's a valid entry AND the name exists in matchedNamesSet
          if (storeEntry && storeEntry.isValid && matchedNamesSet.has(storeEntry.name)) {
            callback(storeEntry.startPos, storeEntry.endPos);
          }
        },
        component: MatchedSpan,
      },
    ]);

    const rightDecorator = new CompositeDecorator([
      {
        strategy: (contentBlock: ContentBlock, callback: DecoratorCallback) => {
          const blockText = contentBlock.getText();

          // Find the corresponding store entry by matching the text content
          const storeEntry = rightStoreNames.find((item) => {
            // Check if this block contains the store name at the expected position
            if (!item.isValid) return false;

            // For right editor: Check if the block text contains the store name at the expected position
            return blockText.indexOf(item.name) === item.startPos;
          });

          // Only highlight if it's a valid entry AND the name exists in matchedNamesSet
          if (storeEntry && storeEntry.isValid && matchedNamesSet.has(storeEntry.name)) {
            callback(storeEntry.startPos, storeEntry.endPos);
          }
        },
        component: MatchedSpan,
      },
    ]);

    // 3.7 Apply decorators to editor states
    const newLeftEditorState = EditorState.set(leftEditorState, { decorator: leftDecorator });
    const newRightEditorState = EditorState.set(rightEditorState, { decorator: rightDecorator });

    // 3.8 Update editor states with new decorators
    setLeftEditorState(newLeftEditorState);
    setRightEditorState(newRightEditorState);
  }, [leftEditorState, rightEditorState, extractStoreNames]);

  // Render duplicate information
  const renderDuplicateInfo = () => {
    const leftDupes = Object.keys(duplicateInfo.leftDuplicates);
    const rightDupes = Object.keys(duplicateInfo.rightDuplicates);

    if (leftDupes.length === 0 && rightDupes.length === 0) {
      return null;
    }

    return (
      <div className="mt-4 p-3  border border-yellow-200 rounded">
        <h3 className="font-bold text-yellow-700">Duplicate Store Names:</h3>
        {leftDupes.length > 0 && (
          <div className="mt-2">
            <p className="font-semibold">In Logged-in Accounts:</p>
            <ul className="list-disc pl-5">
              {leftDupes.map((name) => (
                <li key={`left-${name}`}>
                  "{name}" appears {duplicateInfo.leftDuplicates[name]} times
                </li>
              ))}
            </ul>
          </div>
        )}
        {rightDupes.length > 0 && (
          <div className="mt-2">
            <p className="font-semibold">In Wished Login Accounts:</p>
            <ul className="list-disc pl-5">
              {rightDupes.map((name) => (
                <li key={`right-${name}`}>
                  "{name}" appears {duplicateInfo.rightDuplicates[name]} times
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Add a function to render debug info
  const renderDebugInfo = () => {
    if (!showDebug) return null;

    return (
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-700">Debug Information:</h3>
          <button
            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
            onClick={() => setShowDebug(false)}
          >
            Hide
          </button>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-4">
          <div>
            <p className="font-semibold">Left Names ({debugInfo.leftNames.length}):</p>
            <ul className="text-xs list-disc pl-5 max-h-40 overflow-y-auto">
              {debugInfo.leftNames.map((name, index) => (
                <li key={`left-debug-${index}`}>{name}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold">Right Names ({debugInfo.rightNames.length}):</p>
            <ul className="text-xs list-disc pl-5 max-h-40 overflow-y-auto">
              {debugInfo.rightNames.map((name, index) => (
                <li key={`right-debug-${index}`}>{name}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-semibold">Matched Names ({debugInfo.matchedNames.length}):</p>
            <ul className="text-xs list-disc pl-5 max-h-40 overflow-y-auto">
              {debugInfo.matchedNames.map((name, index) => (
                <li key={`match-debug-${index}`}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  // Output/rendering of the component
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Account Comparison Tool</h2>
      <div className="flex flex-row gap-5 mb-5">
        <div className="flex-1">
          <div className="font-bold mb-1">Currently Logged-in Accounts</div>
          <div className="border border-gray-300 rounded p-2.5 h-96 overflow-y-auto">
            <DraftEditor
              editorState={leftEditorState}
              onChange={setLeftEditorState}
              placeholder="Paste logged-in accounts here..."
            />
          </div>
        </div>

        <div className="flex flex-col justify-center px-2.5">
          <button
            className="py-2 px-4 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700"
            onClick={compareAccounts}
          >
            Compare
          </button>

          {matchCount > 0 && (
            <div className="mt-4 text-sm">
              <p>Matched: {matchCount}</p>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="font-bold mb-1">Wished Login Accounts</div>
          <div className="border border-gray-300 rounded p-2.5 h-96 overflow-y-auto">
            <DraftEditor
              editorState={rightEditorState}
              onChange={setRightEditorState}
              placeholder="Paste wished login accounts here..."
            />
          </div>
        </div>
      </div>
      {/* Render duplicate information */}
      {renderDuplicateInfo()}
      {/* Debug information toggle button */}
      {!showDebug && (
        <button
          className="mt-4 text-xs bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded"
          onClick={() => setShowDebug(true)}
        >
          Show Debug Info
        </button>
      )}
      {/* Debug information panel */}
      {renderDebugInfo()}
      <div className="mt-4">
        <p className="font-bold">Instructions:</p>
        <ul className="list-disc pl-5">
          <li>
            Left Format:{' '}
            <code className="bg-blue-500 px-1 rounded">[number] [store name] [email] ...</code>
          </li>
          <li>
            Right Format:{' '}
            <code className="bg-green-500 px-1 rounded">[store name]#[email]#[password]</code>
          </li>
          <li>Red highlights indicate matching accounts in both lists</li>
          <li>Un-highlighted entries in either editor need attention</li>
          <li>Duplicate store names will be shown in the warning section</li>
          <li>Use the debug button to see detailed matching information</li>
        </ul>
      </div>
    </div>
  );
}

export default AccountComparisonTool;
