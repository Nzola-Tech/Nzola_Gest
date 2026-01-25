// src/App.tsx
import React from 'react';
import { GlobeAltIcon, EnvelopeIcon, ShareIcon } from '@heroicons/react/24/outline';
import DefaultLayout from '@/layouts/default';

const ComingSoonPage: React.FC = () => {
    return (
        <DefaultLayout>
            <div className="min-h-lvh bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col justify-center items-center antialiased">
                <main className="text-center max-w-2xl  mx-auto">
                    <div className="transform transition-all duration-500 ease-in-out hover:scale-105">
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
                            Algo incrível está a caminho.
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-md mx-auto">
                            Estamos trabalhando duro nos bastidores para trazer a você uma nova experiência. Fique atento!
                        </p>
                    </div>

                    
                 
                </main>

                <footer className="absolute bottom-6 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} NZOLA TECH. Todos os direitos reservados.</p>
                </footer>
            </div>
        </DefaultLayout>
    );
};

export default ComingSoonPage;
