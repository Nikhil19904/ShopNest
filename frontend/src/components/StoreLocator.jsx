import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaDirections, FaTimes, FaWhatsapp, FaCheckCircle, FaTimesCircle, FaParking, FaWheelchair } from "react-icons/fa";

const stores = [
  {
    name: "ShopNest Delhi",
    address: "Connaught Place, New Delhi",
    mapUrl: "https://www.google.com/maps?q=Connaught+Place,+New+Delhi&output=embed",
    phone: "+91 9876543210",
    whatsapp: "+919876543210",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    timings: "10:00 AM - 9:00 PM",
    tags: ["Parking", "Wheelchair"],
    lat: 28.6315,
    lng: 77.2167,
  },
  {
    name: "ShopNest Mumbai",
    address: "Bandra, Mumbai",
    mapUrl: "https://www.google.com/maps?q=Bandra,+Mumbai&output=embed",
    phone: "+91 9123456780",
    whatsapp: "+919123456780",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    timings: "10:00 AM - 9:00 PM",
    tags: ["Parking"],
    lat: 19.0606,
    lng: 72.8365,
  },
  {
    name: "ShopNest Bengaluru",
    address: "MG Road, Bengaluru",
    mapUrl: "https://www.google.com/maps?q=MG+Road,+Bengaluru&output=embed",
    phone: "+91 9988776655",
    whatsapp: "+919988776655",
    image: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=400&q=80",
    timings: "10:00 AM - 9:00 PM",
    tags: ["Wheelchair"],
    lat: 12.9752,
    lng: 77.6069,
  },
  {
    name: "ShopNest Hyderabad",
    address: "Banjara Hills, Hyderabad",
    mapUrl: "https://www.google.com/maps?q=Banjara+Hills,+Hyderabad&output=embed",
    phone: "+91 8877665544",
    whatsapp: "+918877665544",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    timings: "10:00 AM - 9:00 PM",
    tags: [],
    lat: 17.4140,
    lng: 78.4333,
  },
  {
    name: "ShopNest Kolkata",
    address: "Park Street, Kolkata",
    mapUrl: "https://www.google.com/maps?q=Park+Street,+Kolkata&output=embed",
    phone: "+91 7766554433",
    whatsapp: "+917766554433",
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80",
    timings: "10:00 AM - 9:00 PM",
    tags: ["Parking"],
    lat: 22.5535,
    lng: 88.3520,
  },
];

// Helper to check if store is open
function isStoreOpen(timings) {
  const [open, close] = timings.split(" - ");
  const now = new Date();
  const [openH, openM, openA] = open.match(/(\d+):(\d+) (\w+)/).slice(1);
  const [closeH, closeM, closeA] = close.match(/(\d+):(\d+) (\w+)/).slice(1);

  function to24(h, m, a) {
    let hour = parseInt(h, 10);
    if (a === "PM" && hour !== 12) hour += 12;
    if (a === "AM" && hour === 12) hour = 0;
    return hour * 60 + parseInt(m, 10);
  }
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const openMins = to24(openH, openM, openA);
  const closeMins = to24(closeH, closeM, closeA);
  return nowMins >= openMins && nowMins <= closeMins;
}

// Helper to get distance between two lat/lng (Haversine)
function getDistance(lat1, lon1, lat2, lon2) {
  function toRad(x) { return x * Math.PI / 180; }
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const StoreLocator = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [nearest, setNearest] = useState(null);

  // Find nearest store using Geolocation API
  const handleFindNearest = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      let minDist = Infinity, minIdx = null;
      stores.forEach((s, i) => {
        const dist = getDistance(latitude, longitude, s.lat, s.lng);
        if (dist < minDist) {
          minDist = dist;
          minIdx = i;
        }
      });
      setNearest(minIdx);
    });
  };

  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="py-14 bg-gradient-to-br from-yellow-50 to-white">
      <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
        Our Stores
      </h2>
      <div className="w-24 h-1 bg-yellow-400 mx-auto mb-8 rounded"></div>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search city or store..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg w-80 focus:ring-2 focus:ring-yellow-400 outline-none"
        />
        <button
          onClick={handleFindNearest}
          className="mt-3 md:mt-0 px-4 py-2 bg-yellow-400 text-gray-900 font-semibold rounded hover:bg-yellow-500 transition"
        >
          Find Nearest Store
        </button>
      </div>
      <div className="flex overflow-x-auto gap-8 px-4 max-w-7xl mx-auto pb-4">
        {filteredStores.map((store, idx) => (
          <div
            key={idx}
            className={`min-w-[320px] bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 border border-gray-100 flex flex-col relative ${
              nearest === idx ? "ring-4 ring-yellow-400" : ""
            }`}
          >
            {nearest === idx && (
              <span className="absolute top-3 right-3 bg-yellow-400 text-xs px-2 py-1 rounded font-bold text-gray-900 shadow">
                Nearest
              </span>
            )}
            <img
              src={store.image}
              alt={store.name}
              className="w-full h-32 object-cover rounded mb-3"
            />
            <div className="flex items-center gap-2 mb-2 text-yellow-500">
              <FaMapMarkerAlt className="text-xl" />
              <h3 className="font-semibold text-lg text-gray-800">{store.name}</h3>
              <span className="ml-2">
                {isStoreOpen(store.timings) ? (
                  <span className="flex items-center text-green-600 text-xs font-semibold gap-1">
                    <FaCheckCircle /> Open Now
                  </span>
                ) : (
                  <span className="flex items-center text-red-500 text-xs font-semibold gap-1">
                    <FaTimesCircle /> Closed
                  </span>
                )}
              </span>
            </div>
            <p className="mb-2 text-gray-600 flex items-center gap-2">
              <FaMapMarkerAlt className="text-base text-gray-400" />
              {store.address}
            </p>
            <p className="mb-2 text-gray-500 flex items-center gap-2">
              <FaPhoneAlt className="text-base text-gray-400" />
              <a href={`tel:${store.phone}`} className="hover:underline">{store.phone}</a>
              <a
                href={`https://wa.me/${store.whatsapp.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-green-500 hover:text-green-600"
                title="WhatsApp"
              >
                <FaWhatsapp size={18} />
              </a>
            </p>
            <p className="mb-2 text-gray-500">Timings: {store.timings}</p>
            <div className="flex gap-2 mb-2">
              {store.tags.includes("Parking") && (
                <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                  <FaParking /> Parking
                </span>
              )}
              {store.tags.includes("Wheelchair") && (
                <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                  <FaWheelchair /> Wheelchair
                </span>
              )}
            </div>
            <div className="aspect-video rounded overflow-hidden border border-gray-200 mb-3">
              <iframe
                src={store.mapUrl}
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title={store.name}
                className="w-full h-full"
              ></iframe>
            </div>
            <div className="flex gap-2">
              <a
                href={store.mapUrl.replace("&output=embed", "")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-yellow-400 text-gray-900 font-semibold py-2 rounded hover:bg-yellow-500 flex items-center justify-center gap-2 transition"
              >
                <FaDirections /> Directions
              </a>
              <button
                onClick={() => setSelected(store)}
                className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2 rounded hover:bg-gray-200 transition"
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for store details */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setSelected(null)}
            >
              <FaTimes />
            </button>
            <img
              src={selected.image}
              alt={selected.name}
              className="w-full h-40 object-cover rounded mb-4"
            />
            <h3 className="text-2xl font-bold mb-2">{selected.name}</h3>
            <p className="mb-2 flex items-center gap-2 text-gray-600">
              <FaMapMarkerAlt /> {selected.address}
            </p>
            <p className="mb-2 flex items-center gap-2 text-gray-600">
              <FaPhoneAlt /> <a href={`tel:${selected.phone}`}>{selected.phone}</a>
              <a
                href={`https://wa.me/${selected.whatsapp.replace("+", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-green-500 hover:text-green-600"
                title="WhatsApp"
              >
                <FaWhatsapp size={18} />
              </a>
            </p>
            <p className="mb-2 text-gray-600">Timings: {selected.timings}</p>
            <div className="flex gap-2 mb-2">
              {selected.tags.includes("Parking") && (
                <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                  <FaParking /> Parking
                </span>
              )}
              {selected.tags.includes("Wheelchair") && (
                <span className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-700">
                  <FaWheelchair /> Wheelchair
                </span>
              )}
            </div>
            <a
              href={selected.mapUrl.replace("&output=embed", "")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition mt-2"
            >
              <FaDirections /> Get Directions
            </a>
          </div>
        </div>
      )}
    </section>
  );
};

export default StoreLocator;
