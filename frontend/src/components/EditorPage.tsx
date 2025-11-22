import { Languages } from '@/types/language-types';
import { Editor } from '@monaco-editor/react'
import { editor } from 'monaco-editor';
import { type ChangeEvent, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';




const EditorArea = () => {
    const socketRef = useRef<Socket | null>(null);
    const [language, setLanguage] = useState<Languages>(Languages.Javascript);
    console.log(language);
    const editorRef = useRef<editor.IStandaloneCodeEditor>(null);

    const changeLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
        const socket = socketRef.current;
        if (!socket) return;
        const newLang = e.target.value;
        setLanguage(newLang as Languages);
        socket?.emit("langChange", newLang);
    };
    const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;
        const socket = socketRef.current;
        if (!socket) return;
        editor.onDidChangeModelContent(() => {
            const value = editor.getValue();
            socket?.emit("codeChange", value);
        });

    }


    useEffect(() => {
        // TODO: pass roomId and JWT
        const jwt = localStorage.getItem("token");
        const soc = io("http://localhost:5001", {
            auth: {
                token: jwt,
            }
        });
        socketRef.current = soc;


        soc?.on("connect", () => {
            soc?.emit("joinRoom", {
                roomId: "1"
            });
        });
        // 
        soc?.on("disconnect", () => console.log("Disconnected"));
        soc?.on("codeChange", (newCode: string) => {
            const editor = editorRef.current;
            if (!editor) return;
            const selection = editor.getSelection();
            if (editor.getValue() !== newCode) {
                editor.setValue(newCode);
                if (selection) editor.setSelection(selection);
            }
        })

        soc?.on("langChange", (newLang: string) => {
            const editor = editorRef.current;
            if (!editor) return;
            const model = editor.getModel();
            if (model?.getLanguageId() !== newLang) {
                setLanguage(newLang as Languages);
            }
        })

        // TODO: handle validation failure
        soc?.on("connect_error", (err)=>{
            console.error("Connection failed:", err.message);
        })




        return () => {
            soc?.disconnect();
        }
    }, [])
    return (
        <div>
            <select onChange={changeLanguage}>
                <option value={'javascript'} selected={language === Languages.Javascript}>Javascript</option>
                <option value={'python'} selected={language === Languages.Python}>Python</option>
                <option value={'java'} selected={language === Languages.Java}>Java</option>
            </select>
            <Editor
                height="90vh"
                language={language}
                defaultValue="// some comment"
                theme="vs-dark"
                onMount={handleEditorDidMount}
            />
        </div>
    )
}

export default EditorArea