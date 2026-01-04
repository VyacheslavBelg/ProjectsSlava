import { useState } from 'react';
import './App.css';

const API_URL = ""; 

function App() {

  const [method, setMethod] = useState('known'); 
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);


  const [formData, setFormData] = useState({
    name: '',
    chronoAge: '',
    sex: 'true', 
    heightCm: '',
    weight: '',
    fat: '',
  });


  const [bodyParams, setBodyParams] = useState({
    waist: '',
    neck: '',
    hips: '',
  });


  const [photoNum, setPhotoNum] = useState(3);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleParamsChange = (e) => {
    const { name, value } = e.target;
    setBodyParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);


    const userInputDto = {
      name: formData.name,
      chronoAge: parseInt(formData.chronoAge),
      sex: formData.sex === 'true', 
      heightCm: parseInt(formData.heightCm),
      weight: parseInt(formData.weight),
      fat: parseFloat(formData.fat) || 0 
    };

    let endpoint = "";
    let body = {};
    let queryParams = "";

    try {
      if (method === 'known') {
        endpoint = "/calculate";
        body = userInputDto;
      } 
      else if (method === 'calc') {
        endpoint = "/calculate_with_fat";
        body = {
          user: userInputDto,
          parametrs: {
            waist: parseInt(bodyParams.waist),
            neck: parseInt(bodyParams.neck),
            hips: formData.sex === 'false' ? parseInt(bodyParams.hips) : null
          }
        };
      } 
      else if (method === 'photo') {
       
        endpoint = "/calculate_with_photo";
        queryParams = `?photo_num=${photoNum}`;
        body = userInputDto;
      }

      const response = await fetch(`${API_URL}${endpoint}${queryParams}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Ошибка сервера');

      const data = await response.json();
      setResult(data);

    } catch (error) {
      console.error(error);
      alert("Произошла ошибка при расчете. Проверьте данные и запущен ли сервер.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Healthy Aging</h1>
        
        {/* Переключатель методов */}
        <div className="tabs">
          <button 
            className={`tab ${method === 'known' ? 'active' : ''}`}
            onClick={() => setMethod('known')}
          >
            Знаю % жира
          </button>
          <button 
            className={`tab ${method === 'calc' ? 'active' : ''}`}
            onClick={() => setMethod('calc')}
          >
            Замеры тела
          </button>
          <button 
            className={`tab ${method === 'photo' ? 'active' : ''}`}
            onClick={() => setMethod('photo')}
          >
            По фото
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ОБЩИЕ ПОЛЯ */}
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Имя</label>
              <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Иван" />
            </div>

            <div className="form-group">
              <label>Возраст (лет)</label>
              <input type="number" name="chronoAge" required value={formData.chronoAge} onChange={handleInputChange} placeholder="30" />
            </div>

            <div className="form-group">
              <label>Пол</label>
              <select name="sex" value={formData.sex} onChange={handleInputChange}>
                <option value="true">Мужской</option>
                <option value="false">Женский</option>
              </select>
            </div>

            <div className="form-group">
              <label>Рост (см)</label>
              <input type="number" name="heightCm" required value={formData.heightCm} onChange={handleInputChange} placeholder="175" />
            </div>

            <div className="form-group">
              <label>Вес (кг)</label>
              <input type="number" name="weight" required value={formData.weight} onChange={handleInputChange} placeholder="75" />
            </div>
          </div>

          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />

          {/* СПЕЦИФИЧНЫЕ ПОЛЯ */}
          
          {/* Метод 1: Знаю процент */}
          {method === 'known' && (
            <div className="form-group">
              <label style={{color: 'var(--accent-color)', fontWeight: 'bold'}}>Процент жира (%)</label>
              <input type="number" step="0.1" name="fat" required value={formData.fat} onChange={handleInputChange} placeholder="15.5" />
            </div>
          )}

          {/* Метод 2: Замеры */}
          {method === 'calc' && (
            <div className="form-grid">
              <div className="form-group">
                <label>Талия (см)</label>
                <input type="number" name="waist" required value={bodyParams.waist} onChange={handleParamsChange} />
              </div>
              <div className="form-group">
                <label>Шея (см)</label>
                <input type="number" name="neck" required value={bodyParams.neck} onChange={handleParamsChange} />
              </div>
              
              {/* Бедра нужны только женщинам (sex == 'false') */}
              {formData.sex === 'false' && (
                <div className="form-group full-width">
                  <label>Бедра (см)</label>
                  <input type="number" name="hips" required value={bodyParams.hips} onChange={handleParamsChange} />
                </div>
              )}
            </div>
          )}

          {/* Метод 3: Фото */}
          {method === 'photo' && (
            <div className="form-group">
              <label>Выберите телосложение, похожее на ваше:</label>
              <div className="photo-grid">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div 
                    key={num} 
                    className={`photo-option ${photoNum === num ? 'selected' : ''}`}
                    onClick={() => setPhotoNum(num)}
                  >
                    {/* Здесь можно вставить настоящие <img> */}
                    <span className="photo-placeholder">
                      {formData.sex === 'true' ? '♂' : '♀'}
                    </span>
                    <span className="photo-label">Тип {num}</span>
                  </div>
                ))}
              </div>
              <p style={{fontSize: '0.8rem', color: '#b0c4c5', marginTop: '10px', textAlign: 'center'}}>
                1 - Очень худой / Атлетичный ... 5 - Полный
              </p>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Считаем...' : 'Рассчитать возраст'}
          </button>
        </form>

        {/* Результат */}
        {result && (
          <div className="result-box">
            <div className="result-header">Метаболический возраст</div>
            <div className="result-value">
              {result.mbAge.toFixed(1)} <span style={{fontSize: '1rem'}}>лет</span>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '15px'}}>
              <div>
                <div className="result-header">Разница</div>
                <div style={{color: result.deltaAge <= 0 ? '#4caf50' : '#ff5252', fontWeight: 'bold', fontSize: '1.2rem'}}>
                  {result.deltaAge > 0 ? '+' : ''}{result.deltaAge.toFixed(1)}
                </div>
              </div>
            </div>

            <div style={{marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
              <div className="result-interpretation">
                {result.interpretation}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;