# 🏙️ City Explorer (Mashup)

**City Explorer** es una aplicación web interactiva que integra datos de múltiples APIs para mostrar información útil y visual de cualquier ciudad del mundo. El usuario puede buscar una ciudad y obtener **el clima actual**, **su ubicación en un mapa**, **imágenes representativas** y **conversiones de divisas** en tiempo real.

Este proyecto fue desarrollado como parte de una práctica académica para poner en práctica conocimientos de **desarrollo web frontend y backend**, manejo de **APIs externas** y despliegue en la nube.

---

## 👨‍💻 Integrantes del equipo

- **Jesús Orlando Delgado Azar**
- **Ángel López de Santiago**
- **Héctor Antonio Terrazas Guevara**

---

## 📖 Descripción general

City Explorer es un mashup web que combina varias fuentes de información en una sola interfaz.  
Cuando el usuario ingresa el nombre de una ciudad, la aplicación realiza lo siguiente:

1. **Consulta el clima actual** mediante la API de **OpenWeatherMap**.
2. **Obtiene coordenadas geográficas** exactas usando la API de geocodificación (Nominatim/OpenStreetMap).
3. **Muestra la ciudad en un mapa interactivo** usando **Leaflet** y **OpenStreetMap**.
4. **Busca imágenes relacionadas** en **Pixabay** para ilustrar la ciudad.
5. **Realiza conversión de divisas** usando la API de **ExchangeRate**, mostrando el equivalente de 100 USD en pesos mexicanos.
6. Presenta toda la información en un diseño responsive, limpio y ordenado.

El backend sirve como intermediario para realizar las llamadas a las APIs externas, protegiendo así las claves privadas (API keys) y asegurando un flujo de datos seguro.

---

## 🎯 Objetivos del proyecto

- Integrar datos de diferentes APIs en una única experiencia de usuario.
- Practicar el consumo de APIs REST en frontend y backend.
- Aprender a manejar variables de entorno de forma segura.
- Implementar un mapa interactivo y responsivo.
- Desplegar un proyecto en producción con **Netlify**.

---

## 🛠️ Tecnologías utilizadas

### **Frontend**
- **React** con **TypeScript** para una interfaz modular y tipada.
- **CSS personalizado** y layout responsivo.
- **Leaflet** para mapas interactivos.
- **Fetch API** para consumo de datos desde el backend.

### **Backend**
- **Node.js** + **Express** como servidor.
- Rutas específicas para:
  - `/api/weather` → consulta clima.
  - `/api/geocode` → obtiene coordenadas de la ciudad.
  - `/api/images` → busca imágenes en Pixabay.
  - `/api/convert` → realiza conversión de divisas.
- Uso de **dotenv** para manejo de claves de API.
- **Funciones serverless** en Netlify para desplegar el backend junto al frontend.

### **APIs externas**
- **[OpenWeatherMap](https://openweathermap.org/)** → información del clima.
- **[Pixabay](https://pixabay.com/api/docs/)** → imágenes de la ciudad.
- **[ExchangeRate](https://exchangerate.host/)** → tasas de conversión monetaria.
- **[Nominatim / OpenStreetMap](https://nominatim.org/)** → geocodificación.

---

## ⚙️ Funcionamiento paso a paso

1. **Búsqueda de ciudad**  
   El usuario escribe el nombre de la ciudad y presiona **"Buscar"** o la tecla Enter.

2. **Backend recibe la solicitud**  
   La petición llega a una ruta en el backend (`/api/weather`, `/api/geocode`, `/api/images`, `/api/convert`).

3. **Llamadas a APIs externas**  
   El backend consulta:
   - OpenWeatherMap → temperatura, descripción, país.
   - Nominatim → latitud y longitud.
   - Pixabay → imágenes relacionadas.
   - ExchangeRate → conversión de 100 USD a MXN.

4. **Envío de respuesta al frontend**  
   El backend unifica y envía la información procesada al frontend en formato JSON.

5. **Renderizado en frontend**  
   React actualiza la interfaz mostrando:
   - Panel de clima.
   - Mapa centrado en la ubicación.
   - Galería de imágenes.
   - Información de divisas.

6. **Manejo de errores**  
   Si alguna API falla o la ciudad no existe, el sistema muestra un mensaje de advertencia sin romper la aplicación.

---

## 📦 Instalación y uso local

1. **Clonar el repositorio**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd city-explorer