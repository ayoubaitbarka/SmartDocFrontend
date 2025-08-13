# SmartDoc - AI Document Processing Frontend

A modern, clean React frontend for the SmartDoc AI document processing system. Upload documents, extract data with AI, and manage your document library with ease.

## 🚀 Features

- **Drag & Drop Upload**: Intuitive file upload with support for PDFs and images
- **AI Processing**: Automatic data extraction using advanced AI models
- **Document Management**: Browse, search, and edit processed documents
- **Real-time Updates**: Live progress tracking and instant feedback
- **Modern UI**: Clean, responsive design with smooth animations
- **Full TypeScript**: Type-safe development with comprehensive error handling

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **UI Library**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **State Management**: React Query for server state
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router
- **Styling**: Custom design system with HSL colors
- **File Upload**: React Dropzone

## 📋 Prerequisites

- Node.js 18+ and npm
- Spring Boot backend running (see API contract below)

## 🚀 Getting Started

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd smartdoc-frontend
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env and set VITE_API_BASE_URL to your backend URL
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:8080`

## ⚙️ Configuration

### Environment Variables

Set these in your `.env` file:

```env
# Required: Backend API base URL
VITE_API_BASE_URL=http://localhost:8080/api

# Optional: App metadata
VITE_APP_NAME=SmartDoc
VITE_APP_VERSION=1.0.0
```

### Backend Requirements

The frontend expects a Spring Boot backend with these exact endpoints:

#### API Contract

**Base URL**: `VITE_API_BASE_URL` (e.g., `http://localhost:8080/api`)

| Method | Endpoint | Description | Request | Response |
|--------|----------|-------------|---------|----------|
| GET | `/documents` | List all documents | - | `DocumentDTO[]` |
| GET | `/documents/{id}` | Get document by ID | - | `DocumentDTO` |
| PUT | `/documents/{id}` | Update document | `DocumentDTO` | `DocumentDTO` |
| POST | `/upload` | Upload file | `multipart/form-data` (field: `file`) | `DocumentDTO` |

#### DocumentDTO Structure

```typescript
interface DocumentDTO {
  id: string;              // UUID
  fileName: string;        // Original filename
  docType: string;         // Document type/category
  createdAt: string;       // ISO LocalDateTime
  status: string;          // Processing status
  extractedDataJson: string; // JSON data as string
}
```

**Field Rules**:
- `id`, `fileName`, `docType`, `createdAt`: Read-only in UI
- `status`, `extractedDataJson`: Editable in UI
- `extractedDataJson` must be valid JSON when saving

## 🎨 Design System

The app uses a custom design system with:

- **Colors**: HSL-based semantic tokens
- **Typography**: Clean, readable fonts with proper hierarchy
- **Components**: Rounded corners (2xl), soft shadows, generous spacing
- **Animations**: Smooth transitions with cubic-bezier timing
- **Accessibility**: Keyboard navigation, ARIA labels, proper contrast

## 🧪 Testing Checklist

Verify these scenarios work correctly:

1. **Upload Flow**:
   - Drag & drop PDF/image → Upload starts → Progress shown → Redirects to detail page

2. **Document Management**:
   - List shows all documents with search/sort
   - Click document → Opens detail page
   - Edit status/JSON → Save updates backend

3. **Data Validation**:
   - Invalid JSON prevents saving and shows error
   - Required fields are validated
   - Copy-to-clipboard works for IDs

4. **Error Handling**:
   - Network errors show meaningful messages
   - 404 states for missing documents
   - Loading states during API calls

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── upload/             # Upload-specific components
│   └── documents/          # Document management components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and API client
├── pages/                  # Route components
├── types/                  # TypeScript type definitions
└── assets/                 # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Follow the existing code style and component patterns
2. Use semantic commit messages
3. Test upload/edit flows before submitting
4. Ensure TypeScript compilation passes
5. Maintain the design system consistency

## 📄 License

This project is part of the SmartDoc system. See the main repository for license information.