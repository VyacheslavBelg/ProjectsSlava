import { useState } from 'react';
import TextAnalysisResult from './TextAnalysisResult';
import FileAnalysisResult from './FileAnalysisResult';

const API_URL = 'http://localhost:5039/api';

export default function UploadForm({ onResult }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const review = formData.get('review')?.trim();
    const file = formData.get('csvFile');

    const hasText = review && review.length > 0;
    const hasFile = file && file.size > 0;

    console.log('DEBUG: hasText=', hasText, 'hasFile=', hasFile, 'review=', review);

    if (!hasText && !hasFile) {
      alert('Введите отзыв или загрузите файл');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      if (hasText && !hasFile) {
        console.log('DEBUG: Analyzing text:', review);
        
        const textFormData = new FormData();
        textFormData.append('review', review);

        const response = await fetch(`${API_URL}/Analysis/analyze`, {
          method: 'POST',
          body: textFormData,
        });

        console.log('DEBUG: Text analysis response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('DEBUG: Text analysis result:', data);
          
          const normalizedData = {
            comment: data.comment || review,
            classLabel: data.class_label !== undefined ? data.class_label : data.classLabel,
            probability: data.probability,
            createdDate: data.created_date || data.createdDate,
            type: 'text'
          };
          
          // Проверка что comment не пустой
          if (!normalizedData.comment) {
            normalizedData.comment = review;
          }
          
          console.log('DEBUG: Normalized text data:', normalizedData);
          setResult(normalizedData);
          onResult?.(normalizedData);
        } else {
          const error = await response.text();
          alert(`Ошибка анализа текста: ${error}`);
        }

      } else if (hasFile && !hasText) {
        console.log('DEBUG: Analyzing file');
        
        const fileFormData = new FormData();
        fileFormData.append('csvFile', file);

        const response = await fetch(`${API_URL}/Analysis/analyze-file`, {
          method: 'POST',
          body: fileFormData,
        });

        console.log('DEBUG: File analysis response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('DEBUG: File analysis result:', data);
          
          const normalizedData = {
            totalRecords: data.totalRecords || 0,
            positiveCount: data.positiveCount || 0,
            negativeCount: data.negativeCount || 0,
            analysisDate: data.analysisDate,
            type: 'file'
          };
          
          console.log('DEBUG: Normalized file data:', normalizedData);
          setResult(normalizedData);
          onResult?.(normalizedData);
        } else {
          const error = await response.text();
          alert(`Ошибка анализа файла: ${error}`);
        }

      } else {
        alert('Нельзя одновременно отправить текст и файл');
      }
    } catch (err) {
      console.error('DEBUG: Request error:', err);
      alert('Не удалось подключиться к серверу');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    console.log('DEBUG: Closing modal');
    setResult(null);
  };

  return (
    <div className="upload-section">
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label>Один отзыв</label>
          <textarea
            name="review"
            placeholder="Введите отзыв для анализа тональности..."
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Или загрузите файл</label>
          <input type="file" name="csvFile" accept=".csv" />
          <small className="file-hint">Поддерживаются только CSV файлы с колонкой 'comment'</small>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? '🔄 Анализ...' : '📊 Проанализировать'}
        </button>
      </form>

      {/* ТОЛЬКО модальные окна - без отладочной информации */}
      {result && result.type === 'text' && (
        <div className="modal-overlay" onClick={closeModal}>
          <TextAnalysisResult result={result} />
        </div>
      )}

      {result && result.type === 'file' && (
        <div className="modal-overlay" onClick={closeModal}>
          <FileAnalysisResult result={result} />
        </div>
      )}
    </div>
  );
}