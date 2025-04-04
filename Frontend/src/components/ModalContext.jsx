import { createContext, useState, useContext } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success"); // success | error

    const showModal = (message, type = "success") => {
        setModalMessage(message);
        setModalType(type);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalMessage("");
    };

    return (
        <ModalContext.Provider value={{ showModal, closeModal }}>
            {children}

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-sm animate-fadeIn">
                    <div className={`bg-white p-8 rounded-2xl shadow-2xl w-[90%] sm:w-96 text-center`}>
                        {/* Icon (Conditional Rendering) */}
                        <div className="flex justify-center mb-4">
                            {modalType === "success" ? (
                                // Success Icon (Green)
                                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                </svg>
                            ) : (
                                // Error Icon (Red)
                                <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            )}
                        </div>

                        {/* Modal Message */}
                        <p className={`text-lg font-semibold ${modalType === "success" ? "text-green-700" : "text-red-700"}`}>
                            {modalMessage}
                        </p>

                        {/* Close Button */}
                        <button 
                            className={`mt-5 px-6 py-2 ${modalType === "success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"} text-white rounded-full shadow-lg transition duration-300`}
                            onClick={closeModal}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};

// Custom Hook for using modal anywhere
export const useModal = () => useContext(ModalContext);
