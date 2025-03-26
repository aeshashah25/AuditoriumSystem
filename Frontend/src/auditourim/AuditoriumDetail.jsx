import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import BookAuditorium from "./BookAuditorium";
import FixedLayout from '../components/FixedLayout';

function AuditoriumDetail() {
  const { id } = useParams();
  const [auditorium, setAuditorium] = useState(null);
  const navigate = useNavigate();
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5002/api/auditoriums?id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          data.images = Array.isArray(data.images)
            ? data.images.map((img) => `data:${img.mimetype};base64,${img.data}`)
            : [];
          data.start_time = formatTime(data.start_time);
          data.end_time = formatTime(data.end_time);
          setAuditorium(data);
        }
      })
      .catch((error) => console.error("Error fetching auditorium:", error));
  }, [id]);

  const formatTime = (timeString) => {
    if (!timeString) return "Not Available";
    return timeString.substring(11, 16);
  };

  if (!auditorium) return <p>Loading details...</p>;

  return (
    <>
      <div className="bg-gray-100">
        <FixedLayout>

          {/* Back Button */}
          {/* <button
            onClick={() => navigate(-1)}
            className="absolute top-28 left-4 bg-brown hover:bg-brown-light text-white p-2 rounded-md shadow-md transition-transform transform hover:scale-105"
          >
            Back
          </button> */}

          <div
            className={`min-h-screen flex items-center justify-center lg:mb-10 relative transition-all ${showBooking ? 'blur-sm' : ''}`}
          >
            {/* Auditorium Details */}
            <div className="w-full max-w-screen-lg md:max-w-2xl lg:max-w-3xl bg-white shadow-lg rounded-lg p-6 relative transition-all border border-gray-200">
              <div className="flex items-center justify-between w-full px-4">
                {/* Title */}
                <h1 className="text-3xl font-bold text-center flex-grow text-gray-800 tracking-wide">
                  {auditorium.name}
                </h1>
              </div>

              {/* Image Slider */}
              <div className="mt-6">
                {auditorium.images.length > 0 ? (
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    spaceBetween={10}
                    slidesPerView={1}
                    className="rounded-lg overflow-hidden"
                  >
                    {auditorium.images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={image}
                          alt={`Auditorium-${index + 1}`}
                          className="w-full object-cover rounded-lg h-[250px] md:h-[300px] lg:h-[350px]"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <img
                    src="default-image.jpg"
                    alt="Default Auditorium"
                    className="w-full object-cover rounded-lg h-[250px] md:h-[300px] lg:h-[350px]"
                  />
                )}
              </div>

              {/* Details Section */}
              <div className="mt-4 space-y-4 text-gray-700 text-lg bg-white p-6 rounded-lg shadow-md border border-gray-200">
                {/* 📌 Auditorium Description */}
                <p className="text-center italic text-gray-600">
                  {auditorium.description || "No description available."}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-lg bg-white p-4 rounded-lg shadow-md border border-gray-200">
                  {/* 📍 Location - Full Row */}
                  <div className="col-span-1 sm:col-span-2 flex items-center space-x-3 text-gray-700">
                    <span className="text-2xl text-brown">📍</span>
                    <p><strong>Location:</strong> {auditorium.location}</p>
                  </div>

                  {/* ⏰ Start Time & ⏳ End Time */}
                  <div className="flex items-center space-x-3 text-gray-700">
                    <span className="text-2xl text-brown">⏰</span>
                    <p><strong>Open Time:</strong> {auditorium.start_time}</p>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <span className="text-2xl text-brown">⏳</span>
                    <p><strong>Close Time:</strong> {auditorium.end_time}</p>
                  </div>

                  {/* 👥 Capacity & 💰 Price per Hour */}
                  <div className="flex items-center space-x-3 text-gray-700">
                    <span className="text-2xl text-brown">👥</span>
                    <p><strong>Capacity:</strong> {auditorium.capacity} people</p>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <span className="text-2xl text-brown">💰</span>
                    <p><strong>Price per Hour:</strong> ₹{auditorium.price_per_hour}</p>
                  </div>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={() => {
                  navigate(`/book-auditorium/${auditorium.id}`, { state: { auditorium } });
                  setShowBooking(true);
                }}
                className="mt-6 w-full bg-brown hover:bg-brown-light text-white p-3 rounded-md text-lg font-semibold shadow-lg transition-transform transform hover:scale-105"
              >
                Book Auditorium
              </button>
            </div>

            {/* Sliding Book Auditorium Panel */}
            {showBooking && (
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 right-0 h-full w-full md:w-[50%] lg:w-[40%] bg-white shadow-xl p-6 overflow-y-auto z-50 border-l-4 border-brown"
              >
                <button
                  onClick={() => setShowBooking(false)}
                  className="absolute top-4 right-4 bg-gray-300 hover:bg-gray-400 text-gray-800 p-2 rounded-md transition-transform transform hover:scale-110"
                >
                  ❌ Close
                </button>
                <BookAuditorium auditorium={auditorium} setFlip={setShowBooking} />
              </motion.div>
            )}
          </div>

        </FixedLayout >
      </div>
    </>
  );
}

export default AuditoriumDetail;