# Sistema de Asistencias 📋

Un sistema completo para gestionar asistencias de usuarios con autenticación por roles, desarrollado con Angular y Node.js.

## 🚀 Características

- **Autenticación y Autorización**: Login/registro con sistema de roles (USER/ADMIN)
- **Gestión de Asistencias**: Marcar asistencia, ver historial y reportes
- **Panel de Administración**: Gestión de usuarios y visualización de asistencias
- **Responsive Design**: Interfaz adaptable a diferentes dispositivos
- **Base de Datos**: Integración con MySQL usando Prisma ORM

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Angular 20.1.0** - Framework de desarrollo web
- **TypeScript 5.8.2** - Lenguaje de programación
- **RxJS 7.8.0** - Manejo de programación reactiva
- **Angular Router** - Navegación y guard de rutas
- **Angular Forms** - Manejo de formularios reactivos

### Backend
- **Node.js** - Runtime de JavaScript
- **Express 5.1.0** - Framework web para Node.js
- **Prisma 6.14.0** - ORM para base de datos
- **MySQL2 3.14.3** - Conector de base de datos MySQL
- **CORS 2.8.5** - Middleware para Cross-Origin Resource Sharing
- **Nodemon 3.1.10** - Herramienta de desarrollo para auto-restart

## 📁 Estructura del Proyecto

```
angular-asistencias/
├── backend/                 # API y lógica del servidor
│   ├── prisma/
│   │   └── schema.prisma   # Esquema de base de datos
│   ├── router/
│   │   └── authRouter.js   # Rutas de autenticación
│   ├── index.js            # Punto de entrada del servidor
│   └── package.json
├── frontend/               # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin-dashboard/    # Panel de administrador
│   │   │   ├── guards/             # Guards de autenticación
│   │   │   ├── login/              # Componente de login
│   │   │   ├── mark-attendance/    # Marcar asistencia
│   │   │   ├── user-dashboard/     # Panel de usuario
│   │   │   ├── user-management/    # Gestión de usuarios
│   │   │   ├── view-attendance/    # Ver asistencias
│   │   │   ├── profile/            # Perfil de usuario
│   │   │   ├── register/           # Registro de usuarios
│   │   │   ├── navbar/             # Barra de navegación
│   │   │   ├── auth.service.ts     # Servicio de autenticación
│   │   │   ├── user.service.ts     # Servicio de usuarios
│   │   │   ├── auth.guard.ts       # Guard de autenticación
│   │   │   └── role.guard.ts       # Guard de roles
│   │   └── ...
│   └── package.json
└── README.md
```

## 🎯 Funcionalidades

### Para Usuarios (USER)
- ✅ Registrarse e iniciar sesión
- ✅ Marcar asistencia diaria
- ✅ Ver historial personal de asistencias
- ✅ Gestionar perfil personal

### Para Administradores (ADMIN)
- ✅ Todas las funcionalidades de usuario
- ✅ Gestionar usuarios del sistema
- ✅ Ver asistencias de todos los usuarios
- ✅ Generar reportes por rango de fechas
- ✅ Marcar ausencias automáticas

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js (v16 o superior)
- MySQL
- Angular CLI (`npm install -g @angular/cli`)

### Configuración del Backend

1. **Navegar al directorio del backend**:
   ```bash
   cd backend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crear archivo `.env` con:
   ```env
   DATABASE_URL="mysql://usuario:contraseña@localhost:3306/nombre_base_datos"
   ```

4. **Configurar Prisma**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

   El servidor estará disponible en `http://localhost:3000`

### Configuración del Frontend

1. **Navegar al directorio del frontend**:
   ```bash
   cd frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar en desarrollo**:
   ```bash
   npm start
   ```

   La aplicación estará disponible en `http://localhost:4200`

## 📊 Esquema de Base de Datos

### Modelos Principales

**Usuario (User)**:
```prisma
model User {
  id          Int           @id @default(autoincrement())
  email       String        @unique
  password    String
  role        Role          @default(USER)
  attendances Attendance[]
}
```

**Asistencia (Attendance)**:
```prisma
model Attendance {
  id        Int              @id @default(autoincrement())
  userId    Int
  user      User             @relation(fields: [userId], references: [id])
  date      DateTime
  status    AttendanceStatus @default(ABSENT)
  entryTime DateTime?
}
```

## 🔐 Sistema de Autenticación

- **Registro**: Los usuarios pueden registrarse con email y contraseña
- **Login**: Autenticación basada en email/contraseña
- **Roles**: Sistema de dos roles (USER/ADMIN)
- **Guards**: Protección de rutas basada en autenticación y roles
- **Persistencia**: Datos de sesión guardados en localStorage

## 📡 API Endpoints

### Autenticación
- `POST /register` - Registro de usuarios
- `POST /login` - Inicio de sesión

### Asistencias
- `POST /attendance/mark` - Marcar asistencia
- `GET /attendance/:userId` - Obtener asistencias por usuario
- `GET /attendance/range` - Obtener asistencias por rango de fechas

### General
- `GET /` - Información de endpoints disponibles
- `GET /users` - Obtener lista de usuarios (solo admin)

## 🎨 Componentes Principales

- **LoginComponent**: Formulario de autenticación
- **RegisterComponent**: Formulario de registro
- **AdminDashboardComponent**: Panel principal para administradores
- **UserDashboardComponent**: Panel principal para usuarios
- **MarkAttendanceComponent**: Interfaz para marcar asistencia
- **ViewAttendanceComponent**: Visualización de historiales
- **UserManagementComponent**: Gestión de usuarios (solo admin)
- **ProfileComponent**: Gestión de perfil personal

## 🔒 Seguridad

- Validación de entrada en frontend y backend
- Guards de autenticación para proteger rutas
- Sistema de roles para control de acceso
- Validación de tokens de usuario
- CORS configurado para seguridad de API

## 🚀 Scripts Disponibles

### Backend
- `npm start` - Ejecutar servidor en producción
- `npm run dev` - Ejecutar servidor en desarrollo con nodemon
- `npm test` - Ejecutar pruebas

### Frontend
- `npm start` - Ejecutar aplicación en desarrollo
- `npm run build` - Construir aplicación para producción
- `npm run watch` - Construir en modo watch
- `npm test` - Ejecutar pruebas unitarias

## 📝 Próximas Mejoras

- [ ] Implementar JWT para autenticación
- [ ] Agregar notificaciones push
- [ ] Sistema de reportes avanzados
- [ ] Integración con calendario
- [ ] Configuración de horarios laborales
- [ ] API para aplicaciones móviles
- [ ] Dashboard con gráficos y estadísticas
- [ ] Sistema de notificaciones por email

## 🤝 Contribución

1. Fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👨‍💻 Autor

Desarrollado con ❤️ para gestión eficiente de asistencias.

---

**Nota**: Asegúrate de tener MySQL ejecutándose y la base de datos configurada antes de iniciar el backend.
