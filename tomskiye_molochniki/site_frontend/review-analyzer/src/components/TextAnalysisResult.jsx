export default function TextAnalysisResult({ result, onClose }) {
  if (!result) return null;

  const isToxic = result.classLabel === 1 || result.classLabel === 2;
  const confidence = Math.min(100, result.probability || 0).toFixed(2);
  
  return (
    <div className="analysis-modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎯 Результат анализа тональности</h2>
        </div>
        
        <div className="modal-body">
          <div className="text-section">
            <div className="section-title">📝 Анализируемый текст:</div>
            <div className="text-bubble">"{result.comment || 'Текст не указан'}"</div>
          </div>
          
          <div className="result-section">
            <div className="verdict-item">
              <span className="label">🏷️ Вердикт:</span>
              <span className={`verdict ${isToxic ? 'toxic' : 'non-toxic'}`}>
                {isToxic ? '🔴 Токсичный' : '🟢 Нетоксичный'}
              </span>
            </div>
            
            <div className="confidence-item">
              <span className="label">📊 Уверенность:</span>
              <div className="confidence-container">
                <div className="confidence-bar">
                  <div 
                    className={`confidence-fill ${isToxic ? 'toxic' : 'non-toxic'}`}
                    style={{ width: `${confidence}%` }}
                  ></div>
                </div>
                <span className="confidence-text">{confidence}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}