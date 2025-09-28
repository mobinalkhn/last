/**
 * ReceiptScanner Component
 * Clean and simple receipt scanning functionality
 */

import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Platform } from 'react-native';
import { ActivityIndicator, Button, Card, Text } from 'react-native-paper';

type ReceiptScannerProps = {
  onItemsExtracted?: (items: string[]) => void;
};

export default function ReceiptScanner({ onItemsExtracted }: ReceiptScannerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isAutoScanning, setIsAutoScanning] = useState(false);

  // Fast visual receipt detection
  const detectReceiptVisually = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, video: HTMLVideoElement): boolean => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let whitePixels = 0;
    let totalPixels = 0;
    let textLikeRegions = 0;
    
    // Sample every 4th pixel for speed
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Calculate brightness
      const brightness = (r + g + b) / 3;
      totalPixels++;
      
      // Count white/light pixels (potential receipt background)
      if (brightness > 200) whitePixels++;
      
      // Look for text-like patterns (dark on light)
      if (brightness < 100 && i > 0) {
        const prevBrightness = (data[i-16] + data[i-15] + data[i-14]) / 3;
        if (prevBrightness > 150) textLikeRegions++;
      }
    }
    
    const whiteRatio = whitePixels / totalPixels;
    const textDensity = textLikeRegions / totalPixels;
    
    // Receipt detection criteria: mostly white background with good text density
    return whiteRatio > 0.3 && textDensity > 0.02;
  };

  // Auto-scan captured image
  const autoScanCapturedImage = async (imageUrl: string) => {
    if (!imageUrl) return;
    
    setLoading(true);
    setError('');
    setItems([]);
    
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        try {
          if (typeof reader.result === 'string' && reader.result) {
            const base64 = reader.result.split(',')[1];
            
            const formData = new FormData();
            formData.append('base64Image', `data:image/jpeg;base64,${base64}`);
            formData.append('language', 'eng');
            formData.append('isOverlayRequired', 'false');
            formData.append('detectOrientation', 'true');
            formData.append('scale', 'true');
            formData.append('OCREngine', '2');
            
            const ocrRes = await axios.post(
              'https://api.ocr.space/parse/image',
              formData,
              {
                headers: {
                  apikey: 'K87471371288957',
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
            
            if (ocrRes.data?.ParsedResults?.[0]?.ParsedText) {
              const text = ocrRes.data.ParsedResults[0].ParsedText;
              const lines = text.split('\n').filter((l: string) => 
                l.trim().length > 2 && /[a-zA-Z0-9]/.test(l)
              );
              
              setItems(lines);
              if (onItemsExtracted) onItemsExtracted(lines);
            } else {
              setError('No text found in auto-captured image.');
            }
          }
        } catch (apiError) {
          console.error('Auto-scan OCR Error:', apiError);
          setError('Auto-scan failed: ' + String(apiError));
        } finally {
          setLoading(false);
        }
      };
    } catch (error) {
      console.error('Auto-scan error:', error);
      setError('Auto-scan failed: ' + String(error));
      setLoading(false);
    }
  };

  // Fast OCR-based receipt detection
  const analyzeFrame = async (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, video: HTMLVideoElement) => {
    if (!context || isAutoScanning) return false;
    
    // First check visually - this is instant
    const visualMatch = detectReceiptVisually(canvas, context, video);
    if (!visualMatch) return false;
    
    setIsAutoScanning(true);
    try {
      // Capture current frame for OCR
      context.drawImage(video, 0, 0);
      
      const blob = await new Promise<Blob | null>(resolve => {
        canvas.toBlob(resolve, 'image/jpeg', 0.6); // Lower quality for speed
      });
      
      if (!blob) {
        setIsAutoScanning(false);
        return false;
      }
      
      // Quick OCR check
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      
      return new Promise((resolve) => {
        reader.onloadend = async () => {
          try {
            if (typeof reader.result === 'string' && reader.result) {
              const base64 = reader.result.split(',')[1];
              
              const formData = new FormData();
              formData.append('base64Image', `data:image/jpeg;base64,${base64}`);
              formData.append('language', 'eng');
              formData.append('isOverlayRequired', 'false');
              
              const ocrRes = await axios.post(
                'https://api.ocr.space/parse/image',
                formData,
                {
                  headers: {
                    apikey: 'K87471371288957',
                    'Content-Type': 'multipart/form-data',
                  },
                  timeout: 3000 // Faster timeout
                }
              );
              
              if (ocrRes.data?.ParsedResults?.[0]?.ParsedText) {
                const text = ocrRes.data.ParsedResults[0].ParsedText.toLowerCase();
                
                // Enhanced receipt detection
                const strongIndicators = ['total', 'subtotal', 'receipt', 'invoice'];
                const weakIndicators = ['price', '$', 'tax', 'amount', 'date', 'store', 'shop'];
                
                const strongMatches = strongIndicators.filter(word => text.includes(word));
                const weakMatches = weakIndicators.filter(word => text.includes(word));
                
                // Auto-capture if we have strong indicators or multiple weak ones
                console.log('OCR detected text:', text.substring(0, 100));
                console.log('Strong matches:', strongMatches);
                console.log('Weak matches:', weakMatches);
                
                if (strongMatches.length >= 1 || weakMatches.length >= 2) {
                  // Capture high-quality final image
                  context.drawImage(video, 0, 0);
                  const finalBlob = await new Promise<Blob | null>(resolve => {
                    canvas.toBlob(resolve, 'image/jpeg', 0.9);
                  });
                  
                  if (finalBlob) {
                    const url = URL.createObjectURL(finalBlob);
                    setImage(url);
                    setIsAutoScanning(false);
                    
                    // Auto-scan the captured image immediately
                    setTimeout(() => {
                      autoScanCapturedImage(url);
                    }, 500);
                    
                    resolve(true);
                    return;
                  }
                }
              }
            }
          } catch (error) {
            console.log('Auto-scan analysis failed:', error);
          }
          setIsAutoScanning(false);
          resolve(false);
        };
      });
    } catch (error) {
      console.log('Frame analysis error:', error);
      setIsAutoScanning(false);
      return false;
    }
  };

  const pickImage = async () => {
    setError('');
    
    if (Platform.OS === 'web') {
      const useCamera = window.confirm('Use camera? (Cancel to select file)');
      
      if (useCamera && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' }
          });
          
          const video = document.createElement('video');
          video.srcObject = stream;
          video.play();
          
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            // Create UI elements
            const container = document.createElement('div');
            container.style.cssText = `
              position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
              background: black; z-index: 9999; display: flex; 
              flex-direction: column; align-items: center; justify-content: center;
            `;
            
            video.style.cssText = 'max-width: 90%; max-height: 70%; border: 2px solid #4CAF50;';
            
            const statusText = document.createElement('div');
            statusText.style.cssText = `
              color: white; font-size: 18px; margin: 20px; text-align: center;
              padding: 10px; background: rgba(0,0,0,0.7); border-radius: 8px;
            `;
            statusText.innerText = 'Point camera at receipt - Auto-scanning...';
            
            const manualBtn = document.createElement('button');
            manualBtn.innerText = 'Manual Capture';
            manualBtn.style.cssText = `
              padding: 15px 30px; font-size: 16px; background: #2196F3; 
              color: white; border: none; border-radius: 8px; margin: 10px; cursor: pointer;
            `;
            
            const closeBtn = document.createElement('button');
            closeBtn.innerText = 'Close Camera';
            closeBtn.style.cssText = `
              padding: 15px 30px; font-size: 16px; background: #f44336; 
              color: white; border: none; border-radius: 8px; margin: 10px; cursor: pointer;
            `;
            
            container.appendChild(statusText);
            container.appendChild(video);
            container.appendChild(manualBtn);
            container.appendChild(closeBtn);
            document.body.appendChild(container);
            
            // Real-time auto-scanning system
            let scanFrame: any;
            let scanCount = 0;
            let lastScanTime = 0;
            let isProcessing = false;
            
            const realtimeScan = async () => {
              const now = Date.now();
              
              // Visual check first (always)
              const visualMatch = detectReceiptVisually(canvas, context!, video);
              
              if (visualMatch) {
                statusText.innerText = '✅ Receipt-like pattern detected! Analyzing text...';
                statusText.style.background = 'rgba(76, 175, 80, 0.8)';
                
                // Limit OCR calls to prevent overwhelming the API  
                if (now - lastScanTime >= 2000 && !isProcessing) {
                  scanCount++;
                  statusText.innerText = `🔍 Reading text... (attempt ${scanCount})`;
                  
                  isProcessing = true;
                  lastScanTime = now;
                  
                  const success = await analyzeFrame(canvas, context!, video);
                  
                  if (success) {
                    statusText.innerText = '📸 Receipt captured! Processing...';
                    statusText.style.background = 'rgba(33, 150, 243, 0.8)';
                    cancelAnimationFrame(scanFrame);
                    setTimeout(() => {
                      cleanup();
                    }, 1500);
                    return;
                  }
                  
                  isProcessing = false;
                }
              } else {
                statusText.innerText = '📱 Point camera at receipt - Looking for paper...';
                statusText.style.background = 'rgba(0,0,0,0.7)';
              }
              
              // Continue scanning
              scanFrame = requestAnimationFrame(realtimeScan);
            };
            
            const cleanup = () => {
              if (scanFrame) cancelAnimationFrame(scanFrame);
              stream.getTracks().forEach(track => track.stop());
              if (document.body.contains(container)) {
                document.body.removeChild(container);
              }
            };
            
            // Manual capture button
            manualBtn.onclick = () => {
              if (context) {
                context.drawImage(video, 0, 0);
                canvas.toBlob((blob) => {
                  if (blob) {
                    const url = URL.createObjectURL(blob);
                    setImage(url);
                    
                    // Auto-scan manual capture too
                    setTimeout(() => {
                      autoScanCapturedImage(url);
                    }, 500);
                  }
                });
              }
              cleanup();
            };
            
            // Close button
            closeBtn.onclick = cleanup;
            
            // Start real-time scanning immediately
            setTimeout(() => {
              realtimeScan();
            }, 1000);
          };
        } catch (cameraError) {
          console.error('Camera error:', cameraError);
          setError('Camera access not available. Please select a file.');
        }
        return;
      }
      
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const url = URL.createObjectURL(file);
          setImage(url);
        }
      };
      input.click();
    } else {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        setError('Permission to access media library is required!');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    }
  };

  const scanReceipt = async () => {
    if (!image) return;
    
    setLoading(true);
    setError('');
    setItems([]);
    
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        try {
          if (typeof reader.result === 'string' && reader.result) {
            const base64 = reader.result.split(',')[1];
            
            const formData = new FormData();
            formData.append('base64Image', `data:image/jpeg;base64,${base64}`);
            formData.append('language', 'eng');
            formData.append('isOverlayRequired', 'false');
            formData.append('detectOrientation', 'true');
            formData.append('scale', 'true');
            formData.append('OCREngine', '2');
            
            const ocrRes = await axios.post(
              'https://api.ocr.space/parse/image',
              formData,
              {
                headers: {
                  apikey: 'K87471371288957',
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
            
            if (ocrRes.data?.ParsedResults?.[0]?.ParsedText) {
              const text = ocrRes.data.ParsedResults[0].ParsedText;
              const lines = text.split('\n').filter((l: string) => 
                l.trim().length > 2 && /[a-zA-Z0-9]/.test(l)
              );
              
              setItems(lines);
              if (onItemsExtracted) onItemsExtracted(lines);
            } else {
              setError('No readable text found in image. Please try a clearer image.');
            }
            
          } else {
            setError('Error reading image. Please try again.');
          }
        } catch (apiError) {
          console.error('OCR API Error:', apiError);
          setError('Error connecting to OCR service: ' + String(apiError));
        } finally {
          setLoading(false);
        }
      };
    } catch (error) {
      console.error('General error:', error);
      setError('An error occurred: ' + String(error));
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>Scan Supermarket Receipt</Text>
      <Text variant="bodyMedium" style={{ marginBottom: 16, textAlign: 'center', color: '#666' }}>
        📱 Camera will auto-detect receipts when opened
      </Text>
      <Button mode="contained" onPress={pickImage} style={{ marginBottom: 16 }}>
        📷 Scan Receipt (Auto-Detect)
      </Button>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button mode="contained" onPress={scanReceipt} disabled={!image || loading} style={{ marginVertical: 16 }}>
        {loading ? 'Scanning...' : 'Scan and Extract Items'}
      </Button>
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      {items.length > 0 && (
        <Card style={{ marginTop: 16 }}>
          <Card.Title title="Detected Items" />
          <Card.Content>
            {items.map((item, idx) => (
              <Text key={idx}>{item}</Text>
            ))}
          </Card.Content>
        </Card>
      )}
      {loading && <ActivityIndicator animating size="large" style={{ marginTop: 16 }} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    marginVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});