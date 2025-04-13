import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Our Ecommerce Store
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Discover amazing products at great prices
            </p>
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Featured Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Electronics', 'Clothing', 'Books'].map((category) => (
            <div
              key={category}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {category}
                </h3>
                <Link
                  to={`/products?category=${category.toLowerCase()}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Products
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home 