
import React, { useState, useRef } from 'react';
import { geminiService } from '../services/geminiService';
import { AppStatus } from '../types';
import Window from './Window';

const PDFAnalyzer: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [markdown, setMarkdown] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('PDFファイルを選択してください。');
      return;
    }

    setFileName(file.name);
    setError(null);
    setStatus(AppStatus.LOADING);
    setMarkdown('');

    try {
      const base64 = await fileToBase64(file);
      await geminiService.analyzePDF(base64, (text) => {
        setMarkdown(text);
      });
      setStatus(AppStatus.COMPLETED);
    } catch (err: any) {
      setError(err.message || '解析に失敗しました。');
      setStatus(AppStatus.ERROR);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const downloadMarkdown = () => {
    const element = document.createElement('a');
    const file = new Blob([markdown], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${fileName.replace('.pdf', '')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const reset = () => {
    setStatus(AppStatus.IDLE);
    setMarkdown('');
    setFileName('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Window title="PDF to Markdown 解析">
      <div className="p-8 h-full flex flex-col gap-6">
        {status === AppStatus.IDLE && (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/30 transition-colors hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50">
            <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center text-white text-4xl mb-6 shadow-xl">
              <i className="fa-solid fa-cloud-arrow-up"></i>
            </div>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">PDFをアップロード</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 px-4 text-center max-w-sm">
              PDFファイルをドラッグ＆ドロップするか、ボタンをクリックしてファイルを選択してください。Gemini AIが内容を解析しマークダウンに変換します。
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <i className="fa-solid fa-file-pdf"></i>
              ファイルを選択
            </button>
          </div>
        )}

        {(status === AppStatus.LOADING || status === AppStatus.COMPLETED || status === AppStatus.ERROR) && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                  <i className="fa-solid fa-file-pdf text-xl text-red-500"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[200px]">{fileName}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {status === AppStatus.LOADING ? 'Gemini AI が解析中...' : '解析完了'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {status === AppStatus.COMPLETED && (
                  <button
                    onClick={downloadMarkdown}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-md font-medium shadow-sm transition-all flex items-center gap-2"
                  >
                    <i className="fa-solid fa-download"></i>
                    ダウンロード
                  </button>
                )}
                <button
                  onClick={reset}
                  className="px-4 py-1.5 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 text-sm rounded-md font-medium transition-all"
                >
                  やり直す
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white/50 dark:bg-zinc-800/50 p-6 font-mono text-sm">
              {error && (
                <div className="flex flex-col items-center justify-center h-full text-red-500">
                  <i className="fa-solid fa-triangle-exclamation text-3xl mb-4"></i>
                  <p>{error}</p>
                </div>
              )}
              {!error && markdown && (
                <pre className="whitespace-pre-wrap break-words text-zinc-700 dark:text-zinc-300">
                  {markdown}
                </pre>
              )}
              {!error && !markdown && status === AppStatus.LOADING && (
                <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="animate-pulse">Gemini AI が文書を読み取っています...</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 shrink-0">
          <div className="flex items-center gap-4">
            <span>ステータス: {status === AppStatus.LOADING ? '実行中' : status === AppStatus.COMPLETED ? '完了' : '待機中'}</span>
            {markdown && <span>文字数: {markdown.length}</span>}
          </div>
          <div className="flex items-center gap-1">
            <i className="fa-solid fa-shield-halved"></i>
            <span>Google Gemini Flash 3 モデル使用</span>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default PDFAnalyzer;
