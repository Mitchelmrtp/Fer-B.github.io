"use client"

import { useState, useEffect } from "react"
import { Heart, ShoppingCart, Music, MicOffIcon as MusicOff, Star, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Product {
  id: number
  title: string
  price: string
  image: string
  description: string
  surprise: string
  category: string
}

const products: Product[] = [
  {
    id: 1,
    title: "Beso Infinito 💋",
    price: "Gratis, porque ya eres mía 😘",
    image: "/romantic-kiss-lips-heart.png",
    description: "Válido por besos ilimitados cada vez que sonrías",
    surprise:
      "Este cupón te da derecho a besos infinitos, abrazos eternos y sonrisas que nunca se acaban. Cada vez que me mires, recibirás uno gratis. ¡Sin fecha de vencimiento! 💕",
    category: "Amor",
  },
  {
    id: 2,
    title: "Mi Amor Eterno 🥰",
    price: "Invaluable",
    image: "/eternal-love-infinity.png",
    description: "Nunca se agota, no caduca, y siempre crece contigo",
    surprise:
      "Mi amor por ti es como el universo: infinito, en constante expansión y lleno de maravillas por descubrir. Cada día que pasa, crece más y más. ❤️✨",
    category: "Sentimientos",
  },
  {
    id: 3,
    title: "Nuestra Canción 🎵",
    price: "Incluida con el amor",
    image: "/romantic-music-notes.png",
    description: "Reproduce un audio especial para ustedes",
    surprise:
      "🎶 Cada vez que escucho esta canción, pienso en ti. Es nuestra melodía, la banda sonora de nuestro amor. Que suene siempre en nuestros corazones. 🎵💕",
    category: "Recuerdos",
  },
  {
    id: 4,
    title: "Recuerdo Favorito 📸",
    price: "Irremplazable",
    image: "/romantic-couple-memory.png",
    description: "Galería con fotos o momentos especiales",
    surprise:
      "Cada foto contigo es un tesoro. Cada momento juntos es una página de nuestra historia de amor. Estos recuerdos son mi mayor riqueza. 📷💖",
    category: "Recuerdos",
  },
  {
    id: 5,
    title: "Carta Secreta 💌",
    price: "Solo para ti",
    image: "/love-letter-heart.png",
    description: "Una carta romántica, escrita por ti",
    surprise:
      "Mi querida amor, cada palabra que escribo para ti sale directamente de mi corazón. Eres mi inspiración, mi musa, mi todo. Te amo más de lo que las palabras pueden expresar. 💕📝",
    category: "Mensajes",
  },
  {
    id: 6,
    title: "Sorpresa Misteriosa 🎁",
    price: "Tú decides",
    image: "/romantic-mystery-gift.png",
    description: "Un link a un video dedicado, collage o poema",
    surprise:
      "¡Sorpresa! Esta caja contiene todos mis sueños contigo, mis planes para nuestro futuro y una promesa: siempre haré todo lo posible por verte sonreír. 🎉💝",
    category: "Sorpresas",
  },
]

export default function RomanticStore() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cart, setCart] = useState<Product[]>([])
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([])

  // Floating hearts animation
  useEffect(() => {
    const interval = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        y: window.innerHeight,
      }
      setHearts((prev) => [...prev, newHeart])

      setTimeout(() => {
        setHearts((prev) => prev.filter((heart) => heart.id !== newHeart.id))
      }, 3000)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product])
  }

  const toggleMusic = () => {
    setMusicPlaying(!musicPlaying)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 relative overflow-hidden">
      {/* Floating Hearts */}
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="fixed text-pink-400 text-2xl animate-bounce pointer-events-none z-10"
          style={{
            left: heart.x,
            bottom: 0,
            animation: "float-up 3s ease-out forwards",
          }}
        >
          💖
        </div>
      ))}

      {/* Header */}
      <header className="bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-white animate-pulse" />
            <h1 className="text-2xl font-bold">Tienda del Amor 💕</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={toggleMusic} className="text-white hover:bg-white/20">
              {musicPlaying ? <MusicOff className="h-5 w-5" /> : <Music className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCart(true)}
              className="text-white hover:bg-white/20 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-yellow-400 text-pink-800">{cart.length}</Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="bg-gradient-to-r from-pink-300 to-rose-300 text-center py-8 px-4">
        <h2 className="text-3xl font-bold text-white mb-2">¡Ofertas exclusivas solo para ti, mi amor! 💖</h2>
        <p className="text-pink-800 text-lg">Descubre todo lo que tengo para ti ✨</p>
      </div>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm border-pink-200 cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Badge className="absolute top-2 right-2 bg-pink-500 text-white">{product.category}</Badge>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mb-2">{product.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-pink-600 font-bold text-lg">{product.price}</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <Button
                  className="w-full mt-3 bg-pink-500 hover:bg-pink-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    addToCart(product)
                  }}
                >
                  Agregar al corazón 💕
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-md bg-gradient-to-br from-pink-50 to-rose-50">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-pink-800">{selectedProduct.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="bg-white/50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{selectedProduct.surprise}</p>
                </div>
                <div className="text-center">
                  <span className="text-pink-600 font-bold text-xl">{selectedProduct.price}</span>
                </div>
                <Button
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                  onClick={() => {
                    addToCart(selectedProduct)
                    setSelectedProduct(null)
                  }}
                >
                  Agregar al corazón 💕
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cart Modal */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-md bg-gradient-to-br from-pink-50 to-rose-50">
          <DialogHeader>
            <DialogTitle className="text-2xl text-pink-800 flex items-center">
              <Heart className="h-6 w-6 mr-2" />
              Tu Carrito del Amor
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {cart.length === 0 ? (
              <p className="text-center text-gray-600 py-8">
                Tu carrito está vacío... ¡pero mi amor por ti está lleno! 💕
              </p>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/50 p-3 rounded-lg">
                    <img src={item.image || "/placeholder.svg"} alt={item.title} className="h-12 w-12 rounded" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-pink-600">{item.price}</p>
                    </div>
                  </div>
                ))}
                <div className="bg-pink-100 p-4 rounded-lg text-center">
                  <p className="text-pink-800 font-semibold mb-2">¡Has llenado tu carrito con amor!</p>
                  <p className="text-pink-600 text-sm">Y ya lo tienes todo... ¡Mi corazón completo! 💖</p>
                </div>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white">
                  Reclamar todo mi amor 💕
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Love Letter Section */}
      <section className="bg-gradient-to-r from-pink-100 to-rose-100 py-12 px-4 mt-12">
        <div className="container mx-auto max-w-2xl text-center">
          <Gift className="h-12 w-12 text-pink-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-pink-800 mb-4">Una Carta Especial Para Ti 💌</h3>
          <div className="bg-white/70 p-6 rounded-lg shadow-lg">
            <p className="text-gray-700 leading-relaxed italic">
              "Sé que esta página parece una tienda, pero en realidad es una muestra de lo mucho que significas para mí.
              Cada 'producto' es solo una forma divertida de recordarte cuánto te amo, lo especial que eres, y todo lo
              que haría por ti. Cada día contigo es un regalo, y quería crear algo único para demostrártelo. Eres mi
              amor, mi inspiración, mi todo. 💕"
            </p>
            <p className="text-pink-600 font-semibold mt-4">Con todo mi amor, siempre tuyo/a ❤️</p>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
