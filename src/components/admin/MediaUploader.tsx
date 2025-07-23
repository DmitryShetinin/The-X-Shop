import { Product } from '@/types/product';
import React, { useState, useRef, useEffect, ReactElement } from 'react';
import { FaUpload, FaTrash, FaImage, FaVideo, FaGripLines, FaPlay, FaPause } from 'react-icons/fa';
import './MediaUploader.css'
import { v4 as uuidv4 } from 'uuid';


interface MediaUploaderProps {
  formData: Partial<Product>;
  onChange: (files: File[]) => void; // Новый пропс для обновления файлов
}

type FileItem = {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  playing?: boolean;
};
 

 
const MediaUploader = ({ formData, onChange }: MediaUploaderProps): ReactElement => {

  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  
  // Создание объекта файла с превью
    const createFileObject = (item: File | string): FileItem => {
    // Если это строка (URL существующего файла)
      if (typeof item === 'string') {
      const extension = item.split('.').pop()?.toLowerCase();
      const type = extension && ['mp4', 'webm', 'mov'].includes(extension) 
        ? 'video' 
        : 'image';

        return {
          id: uuidv4(), // Используем более надежный способ генерации ID
          url:  item,
          preview: `/images/${item}`,
          type
        };
    }
    // Если это объект File (новый загруженный файл)
    else {
      // Проверяем, что это действительно File объект
      if (!(item instanceof File)) {
        console.error('Invalid file object:', item);
        return {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          preview: '',
          type: 'image',
          file: new File([], 'invalid.txt') // Создаем пустой файл для обработки ошибки
        };
      }

      const preview = URL.createObjectURL(item);
      const type = item.type.startsWith('image/') ? 'image' : 'video';
      
      return {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file: item,
        preview,
        type,
        playing: false
      };
    }
  };

  // Инициализация состояния файлов из formData
    const [files, setFiles] = useState<FileItem[]>(() => {
    const initialFiles: (File | string)[] = [];
    
    // Добавляем дополнительные изображения
    if (formData.additional_images && formData.additional_images.length > 0) {
      // Фильтруем только валидные элементы (строки или File объекты)
      formData.additional_images.forEach(item => {
        if (typeof item === 'string' || item instanceof File) {
          initialFiles.push(item);
        } else {
          console.warn('Invalid item in additional_images:', item);
        }
      });
    }
    
    return initialFiles.map(item => createFileObject(item));
  });
  
 
   

  // Поддерживаемые типы файлов
  const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'];

  // Синхронизация с родительским компонентом при изменении files
  useEffect(() => {
    const items = files.map(f => {
      if (f.file) return f.file;  // Новые файлы
      if (f.url) return f.url;    // Существующие файлы
      return ''; // На всякий случай
    }).filter(item => item !== ''); // Фильтруем пустые значения
    
    onChange(items);
}, [files, onChange]);

  // Функция для перетаскивания элементов
  const handleDragStart = (e: React.DragEvent, index: number) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setDragImage(e.target as HTMLElement, 0, 0);
    setTimeout(() => {
      setDragIndex(index);
    }, 0);
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    dragOverItem.current = index;
    setHoverIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragLeave = () => {
    setHoverIndex(null);
  };

  const handleDrop = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newFiles = [...files];
      const draggedItem = newFiles[dragItem.current];
      
      newFiles.splice(dragItem.current, 1);
      newFiles.splice(dragOverItem.current, 0, draggedItem);
      
      setFiles(newFiles);
    }
    
    dragItem.current = null;
    dragOverItem.current = null;
    setDragIndex(null);
    setHoverIndex(null);
  };

  // Обработка перетаскивания файлов в область загрузки
  const handleAreaDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleAreaDragLeave = () => {
    setIsDragging(false);
  };

  const handleAreaDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  // Обработка выбора файлов через input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  };

  // Обработка и валидация файлов
  const processFiles = (fileList: File[]) => {
  setError('');
  
  const validFiles: FileItem[] = [];
  const invalidFiles: string[] = [];
  
  fileList.forEach(file => {
    if (supportedTypes.includes(file.type)) {
      validFiles.push(createFileObject(file));
    } else {
      invalidFiles.push(file.name);
    }
  });
  
  setFiles(prev => [...prev, ...validFiles]);
  
    if (invalidFiles.length > 0) {
      setError(`Неподдерживаемые типы файлов: ${invalidFiles.join(', ')}`);
    }
  };

  // Управление воспроизведением видео
  const toggleVideoPlay = (id: string) => {
    setFiles(prevFiles => 
      prevFiles.map(file => {
        if (file.id === id) {
          const isPlaying = !file.playing;
          
          if (isPlaying) {
            setFiles(files => files.map(f => 
              f.type === 'video' && f.id !== id ? { ...f, playing: false } : f
            ));
            
            if (videoRefs.current[id]) {
              videoRefs.current[id]?.play();
            }
          } else {
            if (videoRefs.current[id]) {
              videoRefs.current[id]?.pause();
            }
          }
          
          return { ...file, playing: isPlaying };
        }
        return file;
      })
    );
  };

  // Удаление файла
  const removeFile = (index: number) => {
    const newFiles = [...files];
    const fileToRemove = newFiles[index];
    
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  // Очистка всех файлов
  const clearAllFiles = () => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setFiles([]);
    setError('');
  };

  // Открытие диалога выбора файлов
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Освобождаем ресурсы при размонтировании
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  // Обработчик окончания видео
  const handleVideoEnded = (id: string) => {
    setFiles(prevFiles => 
      prevFiles.map(file => 
        file.id === id ? { ...file, playing: false } : file
      )
    );
  };
    console.log("files")
  console.log(files)
  return (
    <div className="container">
      <h1 className="title">Загрузка фото и видео</h1>
      <p className="subtitle">Перетащите файлы или нажмите для выбора</p>
      
      <div 
        className={`drop-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleAreaDragOver}
        onDragLeave={handleAreaDragLeave}
        onDrop={handleAreaDrop}
        onClick={openFileDialog}
      >
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*,video/*"
          style={{ display: 'none' }}
        />
        
        <div className="upload-icon">
          <FaUpload size={48} />
        </div>
        
        <p>Перетащите файлы сюда или кликните</p>
        <p className="file-types">Поддерживаемые форматы: JPG, PNG, GIF, MP4, WEBM</p>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      {files.length > 0 && (
        <div className="files-container">
          <div className="files-header">
            <h2>Загруженные файлы ({files.length})</h2>
            <button onClick={clearAllFiles} className="clear-btn">
              Очистить все
            </button>
          </div>
          
          <div className="preview-grid">
            {files.map((item, index) => (
              <div 
                key={item.id}
                className={`preview-item 
                  ${index === dragIndex ? 'dragging' : ''} 
                  ${index === hoverIndex ? 'drag-over' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="drag-handle">
                  <FaGripLines />
                </div>
                
                <div className="preview-content">
                  {item.type === 'image' ? (
                    <img src={item.preview} />
                  ) : (
                    <div className="video-container">
                      <video
                        ref={el => videoRefs.current[item.id] = el}
                        src={item.preview}
                        muted
                        playsInline
                        onClick={() => toggleVideoPlay(item.id)}
                        onEnded={() => handleVideoEnded(item.id)}
                      />
                      {!item.playing && (
                        <div className="video-overlay">
                          <FaPlay className="play-icon" />
                        </div>
                      )}
                      {item.playing && (
                        <div className="video-overlay playing">
                          <FaPause className="pause-icon" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
               
                
                <button 
                  onClick={() => removeFile(index)} 
                  className="remove-btn"
                  aria-label="Удалить файл"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          
          <div className="reorder-hint">
            <p>Перетащите элементы, чтобы изменить их порядок</p>
            <p className="mobile-hint">На мобильных: нажмите на видео для воспроизведения</p>
          </div>
        </div>
      )}
    </div>
  );
};

 

const MediaUploaderWithStyles = ({ formData, onChange }: MediaUploaderProps): ReactElement => (
  <>
     
    <MediaUploader formData={formData} onChange={onChange} />
  </>
);

export default MediaUploaderWithStyles;