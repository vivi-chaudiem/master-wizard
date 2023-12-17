import React from 'react';
import { useRouter } from 'next/router';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const SuccessPage = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="text-green-500">
                <CheckCircleIcon className="w-16 h-16" /> {/* Adjust icon size */}
            </div>
            <h1 className="text-2xl font-semibold mt-4">Daten erfolgreich gespeichert</h1>

            <div className="flex justify-end">
                    <button
                    onClick={() => router.push({
                        pathname: '/'
                    })}

                    className="bg-blue-950 hover:bg-hover-color text-white font-bold py-2 px-4 rounded-md mt-4">
                    Neu starten
                    </button>
            </div>
        </div>
    );
};

export default SuccessPage;
