import Editor from "@monaco-editor/react";

export default function CodeEditor({
  code,
  language,
  onChange
}) {
  return (
    <Editor
      height="100%"
      language={language}
      theme="vs-dark"
      value={code}
      onChange={(value) => onChange(value ?? "")}
      options={{
        fontSize: 15,
        automaticLayout: true,
        minimap: { enabled: false },
        wordWrap: "on"
      }}
    />
  );
}
