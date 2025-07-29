import React, {useEffect, useState} from "react"
import { useCookies } from "react-cookie";
import {Link, useNavigate} from "react-router"
import ProductItem from "~/components/productItem"
import ChatModal from "~/components/chat"
import api from "~/services/axiosInterceptor";


export default function Home() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(['jwtToken'])
  let navigate = useNavigate();

  // Verify token when component mounts or cookie changes
  useEffect(() => {
    if (cookies.jwtToken) {
      api.get("/api/v1/verify-token")
        .then(response => {
          setIsValidToken(true);
        })
        .catch(error => {
          console.error('Token verification failed:', error);
          setIsValidToken(false);
          removeCookie('jwtToken');
        });
    } else {
      setIsValidToken(false);
    }
  }, [cookies.jwtToken, removeCookie]);

  // Fetch products
  useEffect(() => {
    api.get("/api/v1/products")
      .then(res => {
        setItems(res.data)
        setLoading(false)
      })
      .catch(err => {
        setError("Failed to load items")
        setLoading(false)
      })
  }, [])

  const logout = () => {
    removeCookie('jwtToken')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <nav className="w-full bg-gradient-to-r from-yellow-50 to-yellow-100 flex items-center justify-between shadow-sm mb-8">
        <span className="font-semibold text-xl text-amber-600 p-6">
          Beach Fashion
        </span>
        {isValidToken ? (
          <button
            onClick={logout}
            className="bg-orange-400 text-black px-5 py-2 rounded-md font-medium text-base shadow-sm hover:bg-orange-500 transition-colors mr-4"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-yellow-400 text-black px-5 py-2 rounded-md no-underline font-medium text-base shadow-sm hover:bg-yellow-500 transition-colors mr-4"
          >
            Login
          </Link>
        )}
      </nav>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-gray-600 mb-6 text-center text-2xl">
          Products
        </h2>
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex flex-wrap gap-6 justify-center">
          {items.map((item, idx) => (
            <ProductItem
              key={idx}
              name={item.name}
              imageUrl={item.imageUrl}
              price={item.price}
              quantityDiscount={item.quantityDiscount}
            />
          ))}
        </div>
      </div>

      {isValidToken && (
        <>
          <ChatModal
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
          <button
            onClick={() => setIsChatOpen(true)}
            className='fixed bottom-4 right-4 z-40 w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
            <svg
              className='w-6 h-6 text-white'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
              />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}
