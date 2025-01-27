# Challenge Global Think Technology - Sebastian Ponce

## Configuración

### 1. Clonar repositorio
```bash
git clone https://github.com/sebaponce2/challenge-global.git
```

### 2. Instalar dependencias del frontend
```bash
cd challenge-global/frontend
npm i
```

1. Ubicarse en la carpeta `ios`:
```bash
cd ios
pod install
```

### 3. Configurar variables de entorno para la API
1. Ir a la carpeta `api`:
```bash
cd ../api
```
2. Crear un archivo `.env` con las siguientes variables:
```
PORT=8080

DB_HOST=localhost
DB_NAME=challenge_global
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_contraseña_postgres
```

### 4. Crear la base de datos
Ejecutar el script SQL `script base de datos.sql` ubicado en la carpeta `api` para crear la base de datos y sus tablas.

### 5. Instalar dependencias de la API
```bash
npm i
```

### 6. Ejecutar la aplicación
#### Frontend
1. Ubicarse en la carpeta `frontend`:
```bash
cd ../frontend
```
2. Ejecutar el comando:
```bash
adb reverse tcp:8080 tcp:8080
```
3. Iniciar la aplicación en Android o iOS:
```bash
npm run android
# o
npm run ios
```

#### Backend
1. Ubicarse en la carpeta `api`:
```bash
cd ../api
```
2. Iniciar el servidor:
```bash
npm run dev
```

### Usuarios de prueba
- **Email:** walter.olmos@gmail.com  
  **Contraseña:** Cualquiera que cumpla con:
  - 8 caracteres
  - Al menos 1 mayúscula
  - Al menos 1 minúscula
  - Al menos 1 número

- **Email:** john.gonzales@gmail.com  
  **Contraseña:** Cualquiera que cumpla con:
  - 8 caracteres
  - Al menos 1 mayúscula
  - Al menos 1 minúscula
  - Al menos 1 número

- **Email:** maria.lopez@gmail.com  
  **Contraseña:** Cualquiera que cumpla con:
  - 8 caracteres
  - Al menos 1 mayúscula
  - Al menos 1 minúscula
  - Al menos 1 número

- **Email:** peter.sanchez@gmail.com  
  **Contraseña:** Cualquiera que cumpla con:
  - 8 caracteres
  - Al menos 1 mayúscula
  - Al menos 1 minúscula
  - Al menos 1 número

### Nota
Para que la aplicación funcione correctamente, es necesario ejecutar tanto el backend (API) como el frontend al mismo tiempo.
