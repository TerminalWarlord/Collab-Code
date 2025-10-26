import './App.css';
// import React, { useEffect, useRef } from 'react';
// import Editor from '@monaco-editor/react';
// import { editor } from 'monaco-editor';
// import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
// import io from 'socket.io-client';
import EditorArea from './components/EditorArea';


// type Monaco = typeof monaco;

// const socket = io("http://localhost:3000"); // your backend endpoint


function App() {
  //   const editorRef = useRef<editor.IStandaloneCodeEditor>(null);

  //   function handleEditorDidMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
  //     // here is the editor instance
  //     // you can store it in `useRef` for further usage
  //     editorRef.current = editor;
  //     editor.onDidChangeModelContent(() => {
  //       const value = editor.getValue();
  //       socket.emit("codeChange", value);
  //     })
  //   }

  //   useEffect(() => {
  //   const socket = io("http://localhost:3000");

  //   socket.on("connect", () => console.log("✅ Connected", socket.id));
  //   socket.on("disconnect", () => console.log("❌ Disconnected"));

  //   socket.on("codeChange", (newCode: string) => {
  //     const editor = editorRef.current;
  //     if (!editor) return;
  //     const currentValue = editor.getValue();
  //     if (currentValue !== newCode) {
  //       const selection = editor.getSelection();
  //       editor.setValue(newCode);
  //       if (selection) editor.setSelection(selection);
  //     }
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  //   return (
  //     <Editor
  //       height="90vh"
  //       defaultLanguage="javascript"
  //       defaultValue="// some comment"
  //       theme="vs-dark"
  //       onMount={handleEditorDidMount}
  //     />
  //   );
  return <EditorArea />
}

export default App;
