import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Visitor {
    surname: string;
    firstName: string;
    middleName: string;
    address: string;
    birthdate: string;
    relationship: string;
    waiverImage: string;
    requirementImage: string;
    validationImage: string;
    leftImage: string;
    rightImage: string;
    visitHistory: {
        date: string;
        duration: string;
        login: string;
        logout: string;
    };
}

const VisitorsCodeIdentification: React.FC = () => {
    const [selectedVisitor, setSelectedVisitor] = useState<'visitor1' | 'visitor2'>('visitor1');

    const visitors: Record<string, Visitor> = {
        visitor1: {
            surname: 'Doe',
            firstName: 'John',
            middleName: 'A.',
            address: '123 Main St, Quezon City',
            birthdate: '1990-01-01',
            relationship: 'Friend',
            waiverImage: 'No Image Found',
            requirementImage: 'No Image Found',
            validationImage: 'No Image Found',
            leftImage: 'No Image Found',
            rightImage: 'No Image Found',
            visitHistory: {
                date: '2023-04-09',
                duration: '2 hours',
                login: '10:00 AM',
                logout: '12:00 PM',
            },
        },
        visitor2: {
            surname: 'Smith',
            firstName: 'Jane',
            middleName: 'B.',
            address: '456 Elm St, Quezon City',
            birthdate: '1985-05-15',
            relationship: 'Sister',
            waiverImage: 'No Image Found',
            requirementImage: 'No Image Found',
            validationImage: 'No Image Found',
            leftImage: 'No Image Found',
            rightImage: 'No Image Found',
            visitHistory: {
                date: '2023-04-08',
                duration: '1 hour',
                login: '09:00 AM',
                logout: '10:00 AM',
            },
        },
    };

    const handleVisitorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedVisitor(event.target.value as 'visitor1' | 'visitor2');
    };

    const visitorData = visitors[selectedVisitor];

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('Visitors Code Identification', 14, 20);
        doc.text(`Name: ${visitorData.firstName} ${visitorData.middleName} ${visitorData.surname}`, 14, 30);
        doc.text(`Address: ${visitorData.address}`, 14, 40);
        doc.text(`Birthdate: ${visitorData.birthdate}`, 14, 50);
        doc.text(`Relationship: ${visitorData.relationship}`, 14, 60);
        
        autoTable(doc, {
            head: [['Visit History']],
            body: [
                [`Date: ${visitorData.visitHistory.date}`],
                [`Duration: ${visitorData.visitHistory.duration}`],
                [`Login: ${visitorData.visitHistory.login}`],
                [`Logout: ${visitorData.visitHistory.logout}`],
            ],
            startY: 70,
        });

        doc.save(`${visitorData.firstName}_${visitorData.surname}_Identification.pdf`);
    };

    const handlePrint = () => {
        const printContents = document.getElementById('printableArea')?.innerHTML;
        const newWindow = window.open('', '', 'height=600,width=800');
        newWindow!.document.write(`
            <html>
            <head>
                <title>Print</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .section { margin-bottom: 20px; }
                    h1, h2, h3 { text-align: center; }
                    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                </style>
            </head>
            <body>
                ${printContents}
            </body>
            </html>
        `);
        newWindow!.document.close();
        newWindow!.window.print();
    };

    return (
        <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
            <div className="mb-4 w-full max-w-xl">
                <label className="block text-sm font-medium text-gray-600 mb-2">Select Visitor:</label>
                <select
                    value={selectedVisitor}
                    onChange={handleVisitorChange}
                    className="block w-full border border-gray-300 rounded-md p-2"
                >
                    <option value="visitor1">Visitor 1: John Doe</option>
                    <option value="visitor2">Visitor 2: Jane Smith</option>
                </select>
            </div>

            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl" id="printableArea">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">QUEZON CITY JAIL MALE DORM</h1>
                <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">VISITORS CODE IDENTIFICATION</h2>
                
                {/* Action Buttons */}
                <div className="flex justify-between mb-4">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                        Print
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Download PDF
                    </button>
                </div>

                {/* Visitor's Basic Info Section */}
                <div className="section mb-6">
                    <h3 className="text-lg font-semibold mb-2">Visitor's Basic Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Surname:</label>
                            <p className="mt-1 block w-full border border-gray-300 rounded-md p-2">{visitorData.surname}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">First Name:</label>
                            <p className="mt-1 block w-full border border-gray-300 rounded-md p-2">{visitorData.firstName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Middle Name:</label>
                            <p className="mt-1 block w-full border border-gray-300 rounded-md p-2">{visitorData.middleName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Address:</label>
                            <p className="mt-1 block w-full border border-gray-300 rounded-md p-2">{visitorData.address}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Birthdate:</label>
                            <p className="mt-1 block w-full border border-gray-300 rounded-md p-2">{visitorData.birthdate}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Relationship to PDL:</label>
                            <p className="mt-1 block w-full border border-gray-300 rounded-md p-2">{visitorData.relationship}</p>
                        </div>
                    </div>
                </div>

                {/* Identification Section */}
                <div className="section mb-6">
                    <h3 className="text-lg font-semibold mb-2">Identification Markings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-gray-300 rounded-md text-center">
                            <div className="flex justify-center items-center bg-gray-300 h-36">
                                <span className="text-gray-500">{visitorData.waiverImage}</span>
                            </div>
                            <p className="mt-2">Waiver</p>
                        </div>
                        <div className="p-4 border border-gray-300 rounded-md text-center">
                            <div className="flex justify-center items-center bg-gray-300 h-36">
                                <span className="text-gray-500">{visitorData.requirementImage}</span>
                            </div>
                            <p className="mt-2">Requirement</p>
                        </div>
                        <div className="p-4 border border-gray-300 rounded-md text-center">
                            <div className="flex justify-center items-center bg-gray-300 h-36">
                                <span className="text-gray-500">{visitorData.validationImage}</span>
                            </div>
                            <p className="mt-2">Validation</p>
                        </div>
                    </div>
                </div>

                {/* Identification Pictures Section */}
                <div className="section mb-6">
                    <h3 className="text-lg font-semibold mb-2">Identification Pictures</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border border-gray-300 rounded-md text-center">
                            <div className="flex justify-center items-center bg-gray-300 h-36">
                                <span className="text-gray-500">{visitorData.leftImage}</span>
                            </div>
                            <p className="mt-2">Left Side</p>
                        </div>
                        <div className="p-4 border border-gray-300 rounded-md text-center">
                            <div className="flex justify-center items-center bg-gray-300 h-36">
                                <span className="text-gray-500">{visitorData.rightImage}</span>
                            </div>
                            <p className="mt-2">Right Side</p>
                        </div>
                    </div>
                </div>

                {/* Visitor History Section */}
                <div className="section">
                    <h3 className="text-lg font-semibold mb-2">Visitor History</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Date:</label>
                            <p className="mt-1 block w-full border border-gray-300 rounded-md p-2">{visitorData.visitHistory.date}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Duration:</label>
                            <p className="mt-1 block w-full border border-gray-300 rounded-md p-2">{visitorData.visitHistory.duration}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Login:</label>
                            <p className="mt-1 block w-full border border-gray-300 rounded-md p-2">{visitorData.visitHistory.login}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Logout:</label>
                            <p className="mt-1 block w-full border border-gray-300 rounded-md p-2">{visitorData.visitHistory.logout}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisitorsCodeIdentification;