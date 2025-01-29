import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Activities.css'
const Activities = () => {
    const [news, setNews] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

    // Fetch news data
    useEffect(() => {
        fetch('http://localhost:5000/api/news')
            .then((res) => res.json())
            .then((data) => setNews(data))
            .catch((error) => console.error('Error fetching news:', error));
    }, []);

    // Fetch nearby restaurants data
    useEffect(() => {
        fetch('http://localhost:5000/api/restaurants')
            .then((res) => res.json())
            .then((data) => setRestaurants(data))
            .catch((error) => console.error('Error fetching restaurants:', error));
    }, []);

    return (
        <div className="activities-container p-6 bg-gray-100 min-h-screen">
            {/* Main Layout: Flexbox for positioning */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* News Carousel */}
                <div className="news-carousel-container lg:w-3/4">
                    <div className="card carousel-card">
                        <Carousel
                            showThumbs={false}
                            infiniteLoop
                            autoPlay
                            interval={4000}
                            transitionTime={800}
                            showStatus={false}
                            showIndicators={true}
                            stopOnHover
                            swipeable
                            emulateTouch
                        >
                            {news.map((item, index) => (
                                <div key={index} className="p-6 bg-white rounded-2xl shadow-lg">
                                    {item.urlToImage ? (
                                        <img
                                            src={item.urlToImage}
                                            alt={item.title}
                                            className="w-full h-56 object-cover rounded-lg mb-4"
                                        />
                                    ) : (
                                        <div className="w-full h-56 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
                                            <span className="text-gray-500">Image not available</span>
                                        </div>
                                    )}
                                    <h4 className="font-bold text-xl text-gray-900 mb-2">{item.title}</h4>
                                    <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                                        {item.description || 'No description available.'}
                                    </p>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-white bg-blue-600 px-4 py-2 rounded-lg shadow hover:bg-blue-500 transition-colors"
                                    >
                                        Read More
                                    </a>
                                </div>
                            ))}
                        </Carousel>
                    </div>
                </div>

                {/* Restaurants Grid with Enhanced Cards */}
                {restaurants.length > 0 && (
                    <div className="lg:w-1/3">
                        <h3 className="text-2xl font-semibold mb-4">Nearby Restaurants</h3>
                        <div className="max-h-96 overflow-y-auto pr-2"> {/* Added fixed height & scrollbar */}

                        <div className="grid grid-cols-1 gap-6">
                            {restaurants.map((restaurant, index) => (
                                <div
                                    key={index}
                                    className="restaurant-card relative bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300"
                                >
                                    {/* Restaurant Image */}
                                    {restaurant.photos && restaurant.photos[0] && (
                                        <div className="relative h-48 w-full">
                                            <img
                                                src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${restaurant.photos[0].photo_reference}&key=${API_KEY}`}
                                                alt={restaurant.name}
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                                        </div>
                                    )}

                                    {/* Restaurant Info */}
                                    <div className="p-5">
                                        <h4 className="text-lg font-bold text-gray-800 truncate mb-1">
                                            {restaurant.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 truncate mb-1">
                                            {restaurant.formatted_address}
                                        </p>
                                        <p className="text-yellow-500 font-medium">
                                            ⭐ {restaurant.rating} ({restaurant.user_ratings_total} reviews)
                                        </p>

                                        {/* Restaurant Tags */}
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {restaurant.types &&
                                                restaurant.types.slice(0, 3).map((type, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full"
                                                    >
                                                        {type.replace('_', ' ')}
                                                    </span>
                                                ))}
                                        </div>

                                        {/* Decorative Button */}
                                        <button className="mt-4 w-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-white py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Activities;
