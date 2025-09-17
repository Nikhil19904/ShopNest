# ShopNest

ShopNest is a full-stack e-commerce application built with React and Node.js.

## Project Structure

```
ShopNest/
├── Backend/          # Node.js backend
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
│
└── frontend/         # React frontend
    ├── public/
    ├── src/
    └── package.json
```

## Tech Stack

- **Frontend**
  - React
  - TailwindCSS
  - React Toastify
  
- **Backend**
  - Node.js
  - Express.js
  - MongoDB

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- npm/yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ShopNest.git
cd ShopNest
```

2. Install Backend Dependencies:
```bash
cd Backend
npm install
```

3. Install Frontend Dependencies:
```bash
cd frontend
npm install
```

### Running the Application

1. Start the Backend server:
```bash
cd Backend
npm start
```

2. Start the Frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Features

- User authentication
- Product browsing
- Shopping cart functionality
- Responsive design with Tailwind CSS
- Toast notifications for better user experience

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.