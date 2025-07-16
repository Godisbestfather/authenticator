
import React, { useEffect, useState } from 'react';
import { View } from '../types';
import { BackArrowIcon } from './Icons';

declare const Html5QrcodeScanner: any;
declare const Html5QrcodeScanType: any;

interface ScanQrCodeProps {
  navigateTo: (view: View) => void;
  addAccount: (service: string, username: string, secret: string) => void;
}

export const ScanQrCode: React.FC<ScanQrCodeProps> = ({ navigateTo, addAccount }) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let scanner: any;
        try {
            scanner = new Html5QrcodeScanner(
                "qr-reader",
                {
                    fps: 10,
                    qrbox: (viewfinderWidth, viewfinderHeight) => {
                        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
                        const qrboxSize = Math.floor(minEdge * 0.8);
                        return { width: qrboxSize, height: qrboxSize };
                    },
                    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
                },
                /* verbose= */ false
            );

            const onScanSuccess = (decodedText: string) => {
                scanner.clear();
                try {
                    const url = new URL(decodedText);
                    if (url.protocol !== 'otpauth:') {
                        throw new Error("Invalid QR code: Not an 'otpauth' URL.");
                    }
                    const secret = url.searchParams.get('secret');
                    const issuer = url.searchParams.get('issuer');
                    const label = decodeURIComponent(url.pathname.substring(1).split('/').pop() || '');
                    const [issuerFromLabel, user] = label.includes(':') ? label.split(':') : [label, ''];

                    const service = issuer || issuerFromLabel || 'Unknown Service';
                    const username = user.trim() || (label.includes(':') ? '' : label);
                    
                    if (!secret) {
                        throw new Error("Invalid QR code: Secret key not found.");
                    }

                    addAccount(service, username, secret);
                    navigateTo(View.LIST);
                } catch (error) {
                    setErrorMessage(error instanceof Error ? error.message : "Failed to parse QR code.");
                }
            };

            const onScanFailure = (error: any) => {
                // This is called frequently, so we don't spam the console.
            };

            scanner.render(onScanSuccess, onScanFailure);
        } catch (e) {
            setErrorMessage("Could not initialize QR scanner. Please ensure camera permissions are enabled.");
        }

        return () => {
            if (scanner) {
                scanner.clear().catch((error: any) => {
                    console.error("Failed to clear html5-qrcode-scanner.", error);
                });
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="h-full w-full flex flex-col">
            <header className="p-4 border-b border-gray-200 dark:border-gray-700/50 flex items-center space-x-2">
                <button onClick={() => navigateTo(View.ADD)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors" aria-label="Go back">
                    <BackArrowIcon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </button>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Scan QR Code</h1>
            </header>
            <main className="flex-1 p-4 flex flex-col items-center justify-center bg-black">
                <div id="qr-reader" className="w-full max-w-sm aspect-square"></div>
                {errorMessage && (
                    <div className="mt-4 p-3 max-w-sm bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                        <p className="font-bold">Scan Error</p>
                        <p>{errorMessage}</p>
                    </div>
                )}
                 <div className="mt-4 text-center text-gray-300">
                    <p>Point your camera at the QR code.</p>
                </div>
            </main>
        </div>
    );
};
